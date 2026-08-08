import { existsSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import documentDataBrandLocalizationReport from "../public/generated/reports/brand-localization-vs-standardization-framework/document-data.json";
import documentDataFilingPriorityReport from "../public/generated/reports/global-filing-priority-framework/document-data.json";
import documentDataGoodsServicesReport from "../public/generated/reports/global-goods-services-class-framework/document-data.json";
import documentDataHangulReport from "../public/generated/reports/hangul-mark-global-protection-framework/document-data.json";
import documentDataChina from "../public/generated/china/document-data.json";
import documentDataEurope from "../public/generated/europe/document-data.json";
import documentDataJapan from "../public/generated/japan/document-data.json";
import documentDataLatam from "../public/generated/latam/document-data.json";
import documentDataMexico from "../public/generated/mexico/document-data.json";
import documentDataRouteReport from "../public/generated/reports/global-filing-route-framework/document-data.json";
import documentDataReport from "../public/generated/reports/global-use-evidence-system/document-data.json";
import documentDataUk from "../public/generated/uk/document-data.json";
import documentDataUsa from "../public/generated/usa/document-data.json";
import { describe, expect, it } from "vitest";
import { briefIssues } from "../src/briefs/archive";
import { reports } from "../src/reports/registry";
import { liveShellProducts } from "../src/products/registry";
import type { DocumentData } from "../src/products/shared";
import {
  legalNavLinks,
  legalNoticeBullets,
  legalNoticeSummary,
  legalPages
} from "../src/trustLegal";
import {
  LEGAL_SOURCE_PATH,
  buildPublicHref,
  buildRobotsTxt,
  buildSitemapXml,
  buildStaticPageDefinitions,
  renderStaticHtml
} from "./seo";
import { resolveGitLastModified } from "./git-last-modified";
import { preparePagesArtifacts } from "./prepare-pages";

const documentDataBySlug = new Map<string, DocumentData>([
  ["latam", documentDataLatam as DocumentData],
  ["mexico", documentDataMexico as DocumentData],
  ["usa", documentDataUsa as DocumentData],
  ["japan", documentDataJapan as DocumentData],
  ["china", documentDataChina as DocumentData],
  ["europe", documentDataEurope as DocumentData],
  ["uk", documentDataUk as DocumentData]
]);

const reportDocumentDataBySlug = new Map<string, DocumentData>([
  ["brand-localization-vs-standardization-framework", documentDataBrandLocalizationReport as DocumentData],
  ["global-filing-priority-framework", documentDataFilingPriorityReport as DocumentData],
  ["global-goods-services-class-framework", documentDataGoodsServicesReport as DocumentData],
  ["hangul-mark-global-protection-framework", documentDataHangulReport as DocumentData],
  ["global-filing-route-framework", documentDataRouteReport as DocumentData],
  ["global-use-evidence-system", documentDataReport as DocumentData]
]);

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
          routePath: `/latam/chapter/${documentDataLatam.chapters[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/latam/chapter/${documentDataLatam.chapters[0]?.slug}/`,
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

  it("dates legal pages from their own source, not from the site's latest content", () => {
    // 이 3면의 내용은 src/trustLegal.ts가 정본이라 브리프·리포트 발행으로 바뀌지 않는다.
    // gatewayLastModified를 물려받으면 발행 때마다 갱신됐다고 신고하는 거짓 신선도가 된다.
    expect(
      existsSync(path.resolve(__dirname, "..", LEGAL_SOURCE_PATH)),
      `${LEGAL_SOURCE_PATH} must exist — a moved path makes the legal lastmod silently fall back`
    ).toBe(true);

    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const resolved = resolveGitLastModified(LEGAL_SOURCE_PATH);
    const committedAt = resolved.iso;
    const gatewayPage = pages.find((page) => page.routePath === "/");

    expect(gatewayPage).toBeDefined();
    expect(
      resolved.reason,
      `the legal source must have a usable commit date here — got ${resolved.reason} (${resolved.detail ?? "no detail"})`
    ).toBe("committed");

    for (const legalPage of legalPages) {
      const staticPage = pages.find((page) => page.routePath === legalPage.path);

      expect(staticPage?.lastModified, `${legalPage.path} must date from its own source`).toBe(
        committedAt
      );
    }

    // 게이트웨이는 최신 브리프·리포트를 실제로 드러내므로 종전대로 사이트 전체 최신일을 쓴다.
    // 두 값이 갈라져 있다는 것이 이 회귀 가드의 요지다.
    expect(
      gatewayPage?.lastModified,
      "the gateway aggregates latest content and must keep its own date"
    ).not.toBe(committedAt);
  });

  it("lets the caller override the legal date when git cannot answer", () => {
    const injected = "2026-01-02T03:04:05.000Z";
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io",
      legalLastModified: injected
    });

    for (const legalPage of legalPages) {
      expect(pages.find((page) => page.routePath === legalPage.path)?.lastModified).toBe(injected);
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

  it("renders the shared trust/legal notice in Gateway, guide, brief, and report static HTML", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const shell = [
      "<!doctype html>",
      "<html>",
      "  <head>",
      "    <title>Placeholder</title>",
      "  </head>",
      '  <body><div id="root"></div></body>',
      "</html>"
    ].join("\n");

    const representativeRoutes = [
      "/",
      "/briefs",
      `/briefs/${briefIssues[0]?.slug}`,
      "/reports",
      `/reports/${reports[0]?.slug}`,
      `/latam/chapter/${documentDataLatam.chapters[0]?.slug}`
    ];

    for (const routePath of representativeRoutes) {
      const page = pages.find((entry) => entry.routePath === routePath);
      expect(page, `missing static page for ${routePath}`).toBeDefined();
      const html = renderStaticHtml(shell, page!);

      expect(html, `notice summary missing on ${routePath}`).toContain(legalNoticeSummary);
      expect(html, `notice bullet missing on ${routePath}`).toContain(legalNoticeBullets[0]!);
      for (const link of legalNavLinks) {
        expect(html, `legal link ${link.path} missing on ${routePath}`).toContain(
          `href="${buildPublicHref(link.path, "/glotm")}"`
        );
      }
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

  it("emits JSON-LD structured data for the gateway, chapters, and reports", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });

    const gateway = pages.find((page) => page.routePath === "/")!;
    const gatewayGraph = gateway.structuredData?.[0] as { "@graph": Array<Record<string, unknown>> };
    expect(gatewayGraph["@graph"].map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["Organization", "WebSite"])
    );

    const usaChapterRoute = `/usa/chapter/${documentDataUsa.chapters[0]?.slug}`;
    const usaChapter = pages.find((page) => page.routePath === usaChapterRoute)!;
    const article = usaChapter.structuredData?.find((node) => node["@type"] === "Article") as
      | Record<string, unknown>
      | undefined;
    const breadcrumb = usaChapter.structuredData?.find(
      (node) => node["@type"] === "BreadcrumbList"
    );

    expect(article).toBeDefined();
    expect(breadcrumb).toBeDefined();
    // 가이드 챕터의 builtAt은 '재생성 시각'이라 게시일로 오인될 수 있어 datePublished를 넣지 않고
    // dateModified만 둔다(안정적 최초 게시일 필드 도입 전까지). dateModified는 lastModified에서만 파생.
    expect(article!.datePublished).toBeUndefined();
    expect(article!.dateModified).toBe(usaChapter.lastModified);
    expect((article!.author as Record<string, unknown>)["@type"]).toBe("Person");
    expect((article!.author as Record<string, unknown>).name).toBe("GloTm 운영자");
    expect((breadcrumb as { itemListElement: unknown[] }).itemListElement).toHaveLength(3);

    // 브리프는 진짜 게시일(publishedAt)이 있으므로 Article.datePublished를 유지한다.
    const briefRoute = `/briefs/${briefIssues[0]?.slug}`;
    const brief = pages.find((page) => page.routePath === briefRoute)!;
    const briefArticle = brief.structuredData?.find((node) => node["@type"] === "Article") as
      | Record<string, unknown>
      | undefined;
    expect(briefArticle?.datePublished).toBe(brief.lastModified);
  });

  it("renders JSON-LD scripts, article time metadata, and rel next/prev into chapter HTML", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const shell = [
      "<!doctype html>",
      "<html>",
      "  <head>",
      "    <title>Placeholder</title>",
      "  </head>",
      '  <body><div id="root"></div></body>',
      "</html>"
    ].join("\n");
    const firstChapter = pages.find(
      (page) => page.routePath === `/usa/chapter/${documentDataUsa.chapters[0]?.slug}`
    )!;
    const html = renderStaticHtml(shell, firstChapter);

    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain('"@type":"Article"');
    expect(html).toContain('"@context":"https://schema.org"');
    // 가이드 챕터는 게시일이 없으므로 modified_time만 있고 published_time은 없어야 한다.
    expect(html).toContain('<meta property="article:modified_time"');
    expect(html).not.toContain('<meta property="article:published_time"');
    // 첫 챕터에는 다음(next)만 있고 이전(prev)은 없어야 한다.
    expect(html).toContain('<link rel="next"');
    expect(html).not.toContain('<link rel="prev"');

    // 브리프 이슈는 진짜 게시일이 있으므로 published_time을 노출한다.
    const briefPage = pages.find((page) => page.routePath === `/briefs/${briefIssues[0]?.slug}`)!;
    const briefHtml = renderStaticHtml(shell, briefPage);
    expect(briefHtml).toContain('<meta property="article:published_time"');
  });

  it("surfaces the facts-reviewed provenance note only when factsReviewedOn is recorded", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const shell = [
      "<!doctype html>",
      "<html>",
      "  <head>",
      "    <title>Placeholder</title>",
      "  </head>",
      '  <body><div id="root"></div></body>',
      "</html>"
    ].join("\n");

    // UsaTm은 factsReviewedOn이 기록돼 있어 provenance 라인을 노출한다.
    const usaHome = pages.find((page) => page.routePath === "/usa")!;
    expect(renderStaticHtml(shell, usaHome)).toContain('data-provenance="facts-reviewed"');

    // LatTm은 factsReviewedOn 미기록 → 아무 provenance 라인도 렌더하지 않는다.
    const latamHome = pages.find((page) => page.routePath === "/latam")!;
    expect(renderStaticHtml(shell, latamHome)).not.toContain('data-provenance="facts-reviewed"');
  });

  it("adds priority and changefreq signals to the sitemap", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const sitemapXml = buildSitemapXml(pages);

    expect(sitemapXml).toContain("<priority>1.0</priority>");
    expect(sitemapXml).toContain("<changefreq>weekly</changefreq>");
    expect(sitemapXml).toContain("<changefreq>monthly</changefreq>");
  });
});
