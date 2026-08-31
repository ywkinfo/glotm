import { existsSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import documentDataBrandLocalizationReport from "../public/generated/reports/brand-localization-vs-standardization-framework/document-data.json";
import documentDataFilingPriorityReport from "../public/generated/reports/global-filing-priority-framework/document-data.json";
import documentDataGoodsServicesReport from "../public/generated/reports/global-goods-services-class-framework/document-data.json";
import documentDataLocalAgentReport from "../public/generated/reports/global-local-agent-selection-framework/document-data.json";
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
import {
  buildReportArchivePath,
  buildReportPath,
  getLatestReports,
  reports
} from "../src/reports/registry";
import { liveShellProducts } from "../src/products/registry";
import {
  CHAPTER_TITLE_QUALIFIER_BY_SLUG,
  type Chapter,
  type DocumentData
} from "../src/products/shared";
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
  ["global-local-agent-selection-framework", documentDataLocalAgentReport as DocumentData],
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
    const gatewayPage = pages.find((page) => page.routePath === "/");

    expect(gatewayPage).toBeDefined();

    if (resolved.reason === "committed") {
      for (const legalPage of legalPages) {
        expect(
          pages.find((page) => page.routePath === legalPage.path)?.lastModified,
          `${legalPage.path} must date from its own source`
        ).toBe(resolved.iso);
      }

      // 게이트웨이는 최신 브리프·리포트를 실제로 드러내므로 종전대로 사이트 전체 최신일을 쓴다.
      expect(
        gatewayPage?.lastModified,
        "the gateway aggregates latest content and must keep its own date"
      ).not.toBe(resolved.iso);

      return;
    }

    // git이 답할 수 없는 체크아웃에서는 종전 동작(gatewayLastModified)으로 내려간다.
    // 이 분기는 CI에서 실제로 탄다: pull_request 이벤트의 actions/checkout은 merge ref SHA를
    // 추가로 fetch하고 그 과정에서 .git/shallow가 생겨 저장소가 shallow로 판정된다
    // (fetch-depth: 0을 줘도 그렇다). push 이벤트인 deploy-pages는 브랜치 ref만 받아 온전하므로,
    // **실제로 발행되는 산출물은 커밋일을 쓴다.** PR 빌드는 아무것도 발행하지 않는다.
    // 여기서 단정할 수 있는 것은 fallback이 정의된 값이어야 한다는 것이고,
    // legal이 gateway와 분리됐다는 회귀 가드는 아래 주입 테스트가 진다.
    expect(
      ["not-a-repository", "shallow-clone", "uncommitted-changes", "no-commit-for-path", "git-unavailable"],
      `unexpected resolution reason: ${resolved.reason} (${resolved.detail ?? "no detail"})`
    ).toContain(resolved.reason);

    for (const legalPage of legalPages) {
      expect(
        pages.find((page) => page.routePath === legalPage.path)?.lastModified,
        `${legalPage.path} must fall back to the gateway date, not to nothing`
      ).toBe(gatewayPage?.lastModified);
    }
  });

  it("keeps the legal date independent of the gateway's aggregate date", () => {
    // git 가용성과 무관하게 항상 도는 회귀 가드다. legal 3면이 다시 gatewayLastModified를
    // 물려받으면 주입값이 무시되므로 여기서 걸린다.
    const injected = "2026-01-02T03:04:05.000Z";
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io",
      legalLastModified: injected
    });
    const gatewayPage = pages.find((page) => page.routePath === "/");

    for (const legalPage of legalPages) {
      expect(pages.find((page) => page.routePath === legalPage.path)?.lastModified).toBe(injected);
    }

    expect(
      gatewayPage?.lastModified,
      "the gateway must not follow the legal override"
    ).not.toBe(injected);
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

  // 게이트웨이 본문은 최신 리포트를 문장으로 약속하는데, prerender된 크롤 표면에는 오래도록
  // report 링크가 하나도 없었다 — `/reports/` 클러스터로 들어가는 인바운드가 리포트 상세끼리뿐이라
  // 링크 고립섬이었다(2026-08-31 실측). 이 케이스가 그 상태로 되돌아가는 것을 막는다.
  it("links the gateway into the report cluster so it is not a crawl island", () => {
    const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });
    const gateway = pages.find((entry) => entry.routePath === "/");

    expect(gateway).toBeDefined();

    const featured = getLatestReports(2);

    expect(featured.length).toBeGreaterThan(0);
    expect(gateway!.bodyHtml).toContain(
      `href="${buildPublicHref(buildReportArchivePath(), "/glotm")}"`
    );

    for (const report of featured) {
      expect(
        gateway!.bodyHtml,
        `gateway is missing a link to report ${report.slug}`
      ).toContain(`href="${buildPublicHref(buildReportPath(report.slug), "/glotm")}"`);
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

// 2026-08-15 라이브 실측에서 확인된 결함 2종을 잠근다.
// ⓐ `<title>` 중복 10건 / 4클러스터 — `서문 | GloTm`이 china·japan·mexico·usa에 동시에 있었고,
//    `제12장 …(RACI)`·`부록: …`(japan·mexico), `등록 후 유지관리와 갱신 체계`(uk·usa)도 각각 겹쳤다.
// ⓑ description 중복 7건 — MexTm 7개 챕터의 summary가 전부 절 제목 `도입`이라
//    `도입 MexTm 가이드 챕터.` 하나를 공유했다.
// 개별 문자열을 고정하면 원고가 바뀔 때마다 깨지므로, 값이 아니라 **유일성 자체**를 단정한다.
describe("SEO metadata uniqueness", () => {
  const buildPages = () =>
    buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });

  const findDuplicates = (values: string[]) => {
    const counts = new Map<string, number>();

    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
  };

  it("gives every live shell product a chapter title qualifier", () => {
    // 신규 가이드를 붙이면서 매핑을 빠뜨리면 buildChapterDocumentTitle이 throw한다.
    // 그 전에 여기서 먼저 잡아 원인을 명시적으로 알린다.
    const missing = liveShellProducts
      .filter((product) => !CHAPTER_TITLE_QUALIFIER_BY_SLUG[product.slug])
      .map((product) => product.slug);

    expect(missing).toEqual([]);
  });

  it("keeps every page title unique", () => {
    const duplicates = findDuplicates(buildPages().map((page) => page.title));

    expect(duplicates).toEqual([]);
  });

  it("keeps every page description unique", () => {
    const duplicates = findDuplicates(buildPages().map((page) => page.description));

    expect(duplicates).toEqual([]);
  });

  it("qualifies chapter titles by jurisdiction so same-named chapters stay distinguishable", () => {
    const pages = buildPages();
    const seomunTitles = liveShellProducts
      .map((product) => {
        const chapters = documentDataBySlug.get(product.slug)?.chapters ?? [];
        const seomun = chapters.find((chapter) => chapter.title === "서문");

        return seomun
          ? pages.find(
              (page) => page.routePath === `${product.path}/chapter/${seomun.slug}`
            )?.title
          : undefined;
      })
      .filter((title): title is string => Boolean(title));

    // 실측 기준 `서문` 챕터는 4개 가이드에 있다. 하나라도 없으면 이 회귀 가드가 무력해지므로 함께 단정한다.
    expect(seomunTitles.length).toBeGreaterThanOrEqual(4);
    expect(new Set(seomunTitles).size).toBe(seomunTitles.length);
    expect(seomunTitles).toContain("서문 | 멕시코 | GloTm");
  });

  it("falls back to the first body paragraph only when a summary repeats inside its guide", () => {
    const pages = buildPages();
    const mexicoChapters = documentDataBySlug.get("mexico")!.chapters;
    const descriptionFor = (productPath: string, slug: string) =>
      pages.find((page) => page.routePath === `${productPath}/chapter/${slug}`)!.description;

    // 되풀이되는 요약(`도입`)은 description으로 쓰이지 않는다.
    const repeated = mexicoChapters.filter((chapter) => chapter.summary?.trim() === "도입");

    expect(repeated.length).toBeGreaterThan(1);

    for (const chapter of repeated) {
      const description = descriptionFor("/mexico", chapter.slug);

      expect(description).not.toBe("도입 MexTm 가이드 챕터.");
      // 본문 전체를 훑는 대신 첫 문단만 뽑는 이유가 여기 있다. stripHtml(html)로 내려가면
      // 선두의 `도입` 절 제목이 그대로 description 앞에 붙어 7개 장이 다시 같은 말로 시작한다.
      expect(description.startsWith("도입")).toBe(false);
    }

    // 짧아도 고유한 요약은 그대로 쓴다 — 길이 임계값으로 바꾸면 이 단정이 깨진다.
    const uniqueShort = mexicoChapters.find((chapter) => chapter.title === "서문")!;

    expect(descriptionFor("/mexico", uniqueShort.slug)).toContain(uniqueShort.summary!);
  });
});

// description fallback 사슬의 방어 구간. 실제 가이드 데이터는 모든 장에 `<p>`가 있어
// 이 rung들이 한 번도 평가되지 않는다 — 합성 문서로 각 단계를 직접 친다.
// 이걸 안 잠그면 원고 구조가 바뀔 때(요약 없는 장, 표만 있는 장) 조용히 빈 description이 나간다.
describe("chapter description fallback chain", () => {
  const syntheticGuide = (chapters: Array<Partial<Chapter>>): DocumentData => ({
    meta: { title: "합성 가이드", builtAt: "2026-08-15T00:00:00.000Z", chapterCount: chapters.length },
    chapters: chapters.map((chapter, index) => ({
      id: chapter.slug ?? `ch-${index}`,
      slug: chapter.slug ?? `ch-${index}`,
      title: chapter.title ?? `합성 제${index}장`,
      summary: chapter.summary,
      html: chapter.html ?? "",
      headings: []
    }))
  });

  // mexico slot을 합성 문서로 갈아끼워 fallback 단계만 관찰한다.
  const descriptionsFor = (chapters: Array<Partial<Chapter>>) => {
    const swapped = new Map(documentDataBySlug);
    swapped.set("mexico", syntheticGuide(chapters));

    const pages = buildStaticPageDefinitions(swapped, reportDocumentDataBySlug, {
      basePath: "/glotm/",
      distDir: "/tmp/glotm-dist",
      siteOrigin: "https://ywkinfo.github.io"
    });

    return chapters.map(
      (chapter, index) =>
        pages.find((page) => page.routePath === `/mexico/chapter/${chapter.slug ?? `ch-${index}`}`)!
          .description
    );
  };

  it("uses body text when a repeated summary has no paragraph to fall back to", () => {
    // 되풀이 요약 + <p> 없음 → extractFirstParagraphText가 ""를 돌려주고 stripHtml(html)로 내려간다.
    const [first, second] = descriptionsFor([
      { slug: "table-only-a", summary: "도입", html: "<table><tr><td>갱신 기한 6개월</td></tr></table>" },
      { slug: "table-only-b", summary: "도입", html: "<table><tr><td>이의신청 2개월</td></tr></table>" }
    ]);

    expect(first).toContain("갱신 기한 6개월");
    expect(second).toContain("이의신청 2개월");
    expect(first).not.toBe(second);
    expect(first).not.toContain("도입 MexTm");
  });

  it("falls back to the product summary when a chapter has neither summary nor body", () => {
    const mexico = liveShellProducts.find((product) => product.slug === "mexico")!;
    const [description] = descriptionsFor([{ slug: "empty-chapter", summary: undefined, html: "" }]);

    expect(description).toContain(mexico.summary.slice(0, 20));
  });

  it("derives distinct descriptions for chapters that carry no summary at all", () => {
    // 요약이 없는 장은 본문 첫 문단으로 서로 다른 description을 받아야 한다.
    // 주의: `collectRepeatedSummaries`의 빈 문자열 스킵 가드는 이 경로로 관찰되지 않는다 —
    // `buildChapterDescription`의 `summary &&` 단락이 이미 빈 요약을 fallback으로 보내기 때문에,
    // 가드를 제거해도 동작이 같다(주입으로 확인). 가드는 set을 깨끗이 유지하는 용도이고,
    // 이 테스트가 잠그는 것은 "요약 없는 장도 고유한 description을 받는다"는 관찰 가능한 계약이다.
    const [first, second] = descriptionsFor([
      { slug: "blank-a", summary: undefined, html: "<p>표장 사용 증거는 채널별로 모은다.</p>" },
      { slug: "blank-b", summary: undefined, html: "<p>세관 등록은 등록증 발급 후 신청한다.</p>" }
    ]);

    expect(first).toContain("표장 사용 증거는 채널별로 모은다.");
    expect(second).toContain("세관 등록은 등록증 발급 후 신청한다.");
    expect(first).not.toBe(second);
  });
});
