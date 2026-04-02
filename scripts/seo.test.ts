import documentDataChina from "../public/generated/china/document-data.json";
import documentDataEurope from "../public/generated/europe/document-data.json";
import documentDataJapan from "../public/generated/japan/document-data.json";
import documentDataLatam from "../public/generated/latam/document-data.json";
import documentDataMexico from "../public/generated/mexico/document-data.json";
import documentDataUk from "../public/generated/uk/document-data.json";
import documentDataUsa from "../public/generated/usa/document-data.json";
import { describe, expect, it } from "vitest";
import { briefIssues } from "../src/briefs/archive";
import { liveShellProducts } from "../src/products/registry";
import type { DocumentData } from "../src/products/shared";
import {
  buildRobotsTxt,
  buildSitemapXml,
  buildStaticPageDefinitions,
  renderStaticHtml
} from "./seo";

const documentDataBySlug = new Map<string, DocumentData>([
  ["latam", documentDataLatam as DocumentData],
  ["mexico", documentDataMexico as DocumentData],
  ["usa", documentDataUsa as DocumentData],
  ["japan", documentDataJapan as DocumentData],
  ["china", documentDataChina as DocumentData],
  ["europe", documentDataEurope as DocumentData],
  ["uk", documentDataUk as DocumentData]
]);

describe("SEO build helpers", () => {
  it("builds static pages for the gateway, product homes, and chapters", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const expectedPageCount =
      1 + 1 + briefIssues.length + liveShellProducts.length + Array.from(documentDataBySlug.values()).reduce(
        (total, documentData) => total + documentData.chapters.length,
        0
      );

    expect(pages).toHaveLength(expectedPageCount);
    expect(pages[0]).toMatchObject({
      routePath: "/",
      canonicalUrl: "https://ywkinfo.github.io/glotm/",
      ogImageUrl: "https://ywkinfo.github.io/glotm/og/glotm-share-card.svg",
      title: "GloTm | Cross-border Trademark Operating Guides"
    });
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: "/latam",
          outputPath: "/tmp/glotm-dist/latam/index.html",
          canonicalUrl: "https://ywkinfo.github.io/glotm/latam",
          title: "중남미 상표 보호 운영 가이드 | GloTm"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: "/briefs",
          outputPath: "/tmp/glotm-dist/briefs/index.html",
          canonicalUrl: "https://ywkinfo.github.io/glotm/briefs",
          title: "Hot Global TM Brief | GloTm"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: `/briefs/${briefIssues[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/briefs/${briefIssues[0]?.slug}`,
          ogType: "article"
        })
      ])
    );
    expect(pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          routePath: `/latam/chapter/${documentDataLatam.chapters[0]?.slug}`,
          canonicalUrl: `https://ywkinfo.github.io/glotm/latam/chapter/${documentDataLatam.chapters[0]?.slug}`,
          ogType: "article"
        })
      ])
    );
  });

  it("builds a sitemap and robots.txt with the public routes", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const sitemapXml = buildSitemapXml(pages);
    const robotsTxt = buildRobotsTxt("https://ywkinfo.github.io", "/glotm");

    expect(sitemapXml).toContain("<urlset");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/briefs");
    expect(sitemapXml).toContain("https://ywkinfo.github.io/glotm/latam");
    expect(robotsTxt).toBe(
      ["User-agent: *", "Allow: /", "Sitemap: https://ywkinfo.github.io/glotm/sitemap.xml"].join(
        "\n"
      )
    );
  });

  it("renders og and twitter metadata with a base-path aware social image", () => {
    const [page] = buildStaticPageDefinitions(documentDataBySlug, {
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
      '<meta property="og:image" content="https://ywkinfo.github.io/glotm/og/glotm-share-card.svg" />'
    );
    expect(html).toContain(
      '<meta property="og:image:alt" content="GloTm Gateway와 cross-border trademark operating guides를 소개하는 대표 공유 이미지" />'
    );
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain(
      '<meta name="twitter:image" content="https://ywkinfo.github.io/glotm/og/glotm-share-card.svg" />'
    );
  });
});
