import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import documentDataBrandLocalizationReport from "../public/generated/reports/brand-localization-vs-standardization-framework/document-data.json";
import documentDataFilingPriorityReport from "../public/generated/reports/global-filing-priority-framework/document-data.json";
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
  buildPublicHref,
  buildRobotsTxt,
  buildSitemapXml,
  buildStaticPageDefinitions,
  renderStaticHtml
} from "./seo";
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
      1 + 1 + briefIssues.length + 1 + reports.length + liveShellProducts.length + Array.from(documentDataBySlug.values()).reduce(
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
      '<p>ChaTm에서 중국어 표기와 launch sequencing, 출원 경로를 먼저 잠그고, MexTm과 EuTm으로 buyer-entry control과 validate route pack을 이어 봅니다.</p>'
    );
    expect(html).toContain(
      '<p>최신 리포트 2개는 별도 탐색면이 아니라 이 세 가이드에서 공통으로 부딪히는 질문을 다시 묶는 trust layer로 둡니다.</p>'
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
