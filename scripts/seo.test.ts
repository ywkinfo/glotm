import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { briefIssues } from "../src/briefs/archive";
import { reports } from "../src/reports/registry";
import { liveShellProducts } from "../src/products/registry";
import { buildChapterPath, type DocumentData } from "../src/products/shared";
import {
  legalNavLinks,
  legalNoticeBullets,
  legalNoticeSummary,
  legalNoticeTitle,
  legalPages
} from "../src/trustLegal";
import {
  buildPublicHref,
  buildRobotsTxt,
  buildSitemapXml,
  buildStaticPageDefinitions,
  renderStaticHtml
} from "./seo";
import { preparePagesArtifacts } from "./prepare-pages";

function buildDocumentDataFixture(title: string, slug: string): DocumentData {
  return {
    meta: {
      title,
      builtAt: "2026-06-14T00:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: `${slug}-chapter-1`,
        slug: "chapter-1",
        title: `${title} 대표 챕터`,
        summary: `${title} 대표 챕터 요약`,
        html: `<section><h2>${title} fixture section</h2><p>${title} fixture body.</p></section>`,
        headings: []
      }
    ]
  };
}

const documentDataBySlug = new Map<string, DocumentData>(
  liveShellProducts.map((product) => [
    product.slug,
    buildDocumentDataFixture(product.title, product.slug)
  ])
);

const reportDocumentDataBySlug = new Map<string, DocumentData>(
  reports.map((report) => [report.slug, buildDocumentDataFixture(report.title, report.slug)])
);

function expectTrustLegalNotice(bodyHtml: string, surfaceLabel: "Gateway" | "Guide" | "Brief" | "Report") {
  expect(bodyHtml).toContain(`aria-label="${surfaceLabel} legal notice"`);
  expect(bodyHtml).toContain(legalNoticeTitle);
  expect(bodyHtml).toContain(`<h2>${surfaceLabel} 공통 고지</h2>`);
  expect(bodyHtml).toContain(legalNoticeSummary);

  for (const bullet of legalNoticeBullets) {
    expect(bodyHtml).toContain(`<li>${bullet}</li>`);
  }

  for (const link of legalNavLinks) {
    expect(bodyHtml).toContain(`href="/glotm${link.path}/"`);
    expect(bodyHtml).toContain(`>${link.label}</a>`);
  }
}

describe("SEO build helpers", () => {
  it("builds static pages for the gateway, product homes, and chapters", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const expectedPageCount =
      1 + 1 + briefIssues.length + 1 + reports.length + legalPages.length + liveShellProducts.length + Array.from(documentDataBySlug.values()).reduce(
        (total, documentData) => total + documentData.chapters.length,
        0
      );

    expect(pages).toHaveLength(expectedPageCount);
    expect(pages[0]).toMatchObject({
      routePath: "/",
      canonicalUrl: "https://ywkinfo.github.io/glotm/",
      ogImageUrl: "https://ywkinfo.github.io/glotm/og/glotm-share-card.svg",
      title: "GloTm | Cross-border Trademark Operating Guide"
    });
    expect(pages[0]).toMatchObject({
      description:
        "중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다."
    });
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: "/latam",
          outputPath: "/tmp/glotm-dist/latam/index.html",
          canonicalUrl: "https://ywkinfo.github.io/glotm/latam/",
          title: "중남미 상표 보호 운영 가이드 | GloTm"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: "/briefs",
          outputPath: "/tmp/glotm-dist/briefs/index.html",
          canonicalUrl: "https://ywkinfo.github.io/glotm/briefs/",
          title: "Hot Global TM Brief | GloTm"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: `/briefs/${briefIssues[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/briefs/${briefIssues[0]?.slug}/`,
          ogType: "article"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: "/reports",
          outputPath: "/tmp/glotm-dist/reports/index.html",
          canonicalUrl: "https://ywkinfo.github.io/glotm/reports/",
          title: "Report | GloTm"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: `/reports/${reports[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/reports/${reports[0]?.slug}/`,
          ogType: "article"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: `/latam/chapter/${documentDataBySlug.get("latam")!.chapters[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/latam/chapter/${documentDataBySlug.get("latam")!.chapters[0]?.slug}/`,
          ogType: "article"
        })
      ])
    );
  });

  it("prerenders legal/privacy/contact pages into the static mirror and sitemap", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const sitemapXml = buildSitemapXml(pages);

    expect(legalPages.length).toBeGreaterThan(0);

    for (const legalPage of legalPages) {
      expect(pages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            routePath: legalPage.path,
            outputPath: `/tmp/glotm-dist${legalPage.path}/index.html`,
            canonicalUrl: `https://ywkinfo.github.io/glotm${legalPage.path}/`,
            ogType: "website"
          })
        ])
      );
      expect(sitemapXml).toContain(`https://ywkinfo.github.io/glotm${legalPage.path}/`);
    }
  });

  it("keeps the trust/legal notice in the prerendered legal HTML for no-JS and crawlers", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const legalDefinition = legalPages.find((page) => page.slug === "legal");
    const legalPageStatic = pages.find((page) => page.routePath === "/legal");

    expect(legalDefinition).toBeDefined();
    expect(legalPageStatic).toBeDefined();

    const html = renderStaticHtml(
      [
        "<!doctype html>",
        "<html>",
        "  <head>",
        "    <title>Placeholder</title>",
        "  </head>",
        '  <body><div id="root"></div></body>',
        "</html>"
      ].join("\n"),
      legalPageStatic!
    );

    expect(html).toContain("법률 자문");
    expect(html).toContain(`<h1>${legalDefinition!.title}</h1>`);
    expect(html).toContain('<link rel="canonical" href="https://ywkinfo.github.io/glotm/legal/" />');
  });

  it("keeps the trust/legal notice in representative static mirror routes", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const latamFirstChapter = documentDataBySlug.get("latam")!.chapters[0];
    const representativeRoutes = [
      { routePath: "/", surface: "Gateway" },
      { routePath: buildChapterPath("/latam", latamFirstChapter.slug), surface: "Guide" },
      { routePath: "/briefs", surface: "Brief" },
      { routePath: `/briefs/${briefIssues[0]!.slug}`, surface: "Brief" },
      { routePath: "/reports", surface: "Report" },
      { routePath: `/reports/${reports[0]!.slug}`, surface: "Report" }
    ] as const;

    for (const route of representativeRoutes) {
      const page = pages.find((entry) => entry.routePath === route.routePath);

      expect(page).toBeDefined();
      expectTrustLegalNotice(page!.bodyHtml, route.surface);
    }
  });

  it("builds a sitemap and robots.txt with the public routes", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const sitemapXml = buildSitemapXml(pages);
    const robotsTxt = buildRobotsTxt("https://ywkinfo.github.io", "/glotm");

    expect(sitemapXml).toContain("<urlset");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/briefs/");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/reports/");
    expect(sitemapXml).toContain(`https://ywkinfo.github.io/glotm/reports/${reports[0]?.slug}/`);
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/latam/");
    expect(robotsTxt).toBe(
      ["User-agent: *", "Allow: /", "Sitemap: https://ywkinfo.github.io/glotm/sitemap.xml"].join(
        "\n"
      )
    );
  });

  it("renders og and twitter metadata with a base-path aware social image", () => {
    const [page] = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const html = renderStaticHtml(
      [
        "<!doctype html>",
        "<html>",
        "  <head>",
        "    <title>Placeholder</title>",
        "  </head>",
        '  <body><div id="root"></div></body>',
        "</html>"
      ].join("\n"),
      page
    );

    expect(html).toContain(
      '<meta name="description" content="중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다." />'
    );
    expect(html).toContain(
      '<meta property="og:image:alt" content="GloTm Gateway와 인하우스 팀을 위한 cross-border trademark operating guide를 소개하는 대표 공유 이미지" />'
    );
    expect(html).toContain('<h1>인하우스 팀을 위한 cross-border trademark operating guide</h1>');
    expect(html).toContain(
      '<p>중국 가이드(ChaTm)에서는 중국어 브랜드명, 시장별 출시 순서, 상표 출원 방식을 먼저 정리합니다. 이어 멕시코 가이드(MexTm)에서는 출원 준비와 등록 후 관리, 세관에서 위조품을 막기 위한 준비를 살펴봅니다. 유럽 가이드(EuTm)에서는 EU와 영국에서 상표를 어디까지 보호할지, 권리를 지키기 위해 어떤 증거가 필요한지 살펴봅니다.</p>'
    );
    expect(html).toContain(
      '<p>최신 리포트 2개는 세 가이드에서 반복해서 나오는 질문을 한곳에 모아 정리한 자료입니다.</p>'
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://ywkinfo.github.io/glotm/og/glotm-share-card.svg" />'
    );
    expect(html).toContain('<link rel="canonical" href="https://ywkinfo.github.io/glotm/" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain(
      '<meta name="twitter:image" content="https://ywkinfo.github.io/glotm/og/glotm-share-card.svg" />'
    );
  });

  it("prepares GitHub Pages 404 and .nojekyll artifacts from the rendered shell", async () => {
    const distDir = await mkdtemp(path.join(tmpdir(), "glotm-pages-"));
    const indexHtml = [
      "<!doctype html>",
      "<html>",
      "  <head>",
      "    <title>Placeholder</title>",
      '    <meta name="description" content="Placeholder description" />',
      '    <meta name="robots" content="index, follow" />',
      '    <meta name="twitter:card" content="summary_large_image" />',
      '    <meta property="og:title" content="Placeholder OG" />',
      '    <link rel="canonical" href="https://example.com" />',
      "  </head>",
      '  <body><div id="root"></div></body>',
      "</html>"
    ].join("\n");

    await writeFile(path.join(distDir, "index.html"), indexHtml);

    await preparePagesArtifacts(distDir);

    const notFoundHtml = await readFile(path.join(distDir, "404.html"), "utf8");
    const noJekyll = await readFile(path.join(distDir, ".nojekyll"), "utf8");

    expect(notFoundHtml).toContain("<title>찾을 수 없는 페이지 | GloTm</title>");
    expect(notFoundHtml).toContain(
      '<meta name="description" content="GloTm에서 요청한 페이지를 찾을 수 없습니다." />'
    );
    expect(notFoundHtml).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(notFoundHtml).not.toContain("twitter:card");
    expect(notFoundHtml).not.toContain("og:title");
    expect(notFoundHtml).not.toContain('rel="canonical"');
    expect(noJekyll).toBe("");
  });

  it("adds trailing slash for directory routes but not for file paths", () => {
    expect(buildPublicHref("/", "/glotm")).toBe("/glotm/");
    expect(buildPublicHref("/", "")).toBe("/");
    expect(buildPublicHref("/china", "/glotm")).toBe("/glotm/china/");
    expect(buildPublicHref("/briefs", "/glotm")).toBe("/glotm/briefs/");
    expect(buildPublicHref("/reports/global-filing-priority-framework", "/glotm")).toBe(
      "/glotm/reports/global-filing-priority-framework/"
    );
    expect(buildPublicHref("/latam/chapter/서문", "/glotm")).toBe("/glotm/latam/chapter/서문/");
    expect(buildPublicHref("/og/glotm-share-card.svg", "/glotm")).toBe(
      "/glotm/og/glotm-share-card.svg"
    );
    expect(buildPublicHref("/sitemap.xml", "/glotm")).toBe("/glotm/sitemap.xml");
    expect(
      buildPublicHref("/china/chapter/제4장-출원-경로#section-id", "/glotm")
    ).toBe("/glotm/china/chapter/제4장-출원-경로/#section-id");
  });
});
