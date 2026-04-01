import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  briefIssues,
  buildBriefArchivePath,
  buildBriefDocumentTitle,
  buildBriefIssuePath,
  formatBriefDate,
  type BriefIssue
} from "../src/briefs/archive";
import { liveShellProducts } from "../src/products/registry";
import {
  buildChapterPath,
  buildProductPath,
  buildRuntimeDocumentTitle,
  normalizeBasePath,
  type Chapter,
  type DocumentData,
  type ProductMeta
} from "../src/products/shared";

const DEFAULT_SITE_ORIGIN = "https://ywkinfo.github.io";
const DEFAULT_SITE_DESCRIPTION =
  "해외 진출 브랜드를 위한 글로벌 상표 지식베이스 GloTm. 권역형·국가형 상표 운영 가이드를 한곳에서 탐색할 수 있습니다.";

export type StaticPageDefinition = {
  routePath: string;
  outputPath: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: "website" | "article";
  lastModified: string;
  bodyHtml: string;
};

type SeoRuntimeOptions = {
  basePath?: string;
  distDir?: string;
  siteOrigin?: string;
};

type PageLink = {
  href: string;
  label: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function trimDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function ensureIsoDate(value?: string) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function getSeoRuntimeOptions(options: SeoRuntimeOptions = {}) {
  const basePath = normalizeBasePath(options.basePath ?? process.env.PAGES_BASE_PATH ?? "/");
  const siteOrigin = (options.siteOrigin ?? process.env.PAGES_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN)
    .replace(/\/+$/, "");
  const distDir = path.resolve(options.distDir ?? "dist");

  return {
    basePath,
    siteOrigin,
    distDir
  };
}

function buildOutputPath(routePath: string, distDir: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.replace(/^\//, ""), "index.html");
}

export function buildPublicHref(routePath: string, basePath = "") {
  if (routePath === "/") {
    return basePath ? `${basePath}/` : "/";
  }

  return `${basePath}${routePath}`;
}

export function buildCanonicalUrl(routePath: string, siteOrigin: string, basePath = "") {
  return `${siteOrigin}${buildPublicHref(routePath, basePath)}`;
}

function renderLinkList(title: string, links: PageLink[], ordered = false) {
  const TagName = ordered ? "ol" : "ul";

  return `
    <section>
      <h2>${escapeHtml(title)}</h2>
      <${TagName}>
        ${links
          .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
          .join("")}
      </${TagName}>
    </section>
  `;
}

function renderGatewayBody(basePath: string) {
  const productLinks = liveShellProducts.map((product) => ({
    href: buildPublicHref(buildProductPath(product), basePath),
    label: `${product.shortLabel} · ${product.title}`
  }));
  const latestBrief = briefIssues[0];

  return `
    <main>
      <header>
        <p>GloTm Gateway</p>
        <h1>글로벌 상표 지식베이스</h1>
        <p>${escapeHtml(DEFAULT_SITE_DESCRIPTION)}</p>
      </header>
      ${latestBrief
        ? `
      <section>
        <h2>Hot Global TM Brief</h2>
        <p>지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 골라 짧고 밀도 있게 해설하는 주간 브리프를 함께 운영합니다.</p>
        <p><a href="${escapeHtml(buildPublicHref(buildBriefArchivePath(), basePath))}">브리프 아카이브 보기</a></p>
      </section>
      `
        : ""}
      <section>
        <h2>라이브 가이드 포트폴리오</h2>
        <p>현재 ${liveShellProducts.length}개의 권역형·국가형 상표 운영 가이드를 공개하고 있습니다.</p>
      </section>
      ${renderLinkList("가이드 목록", productLinks)}
    </main>
  `;
}

function renderProductBody(product: ProductMeta, documentData: DocumentData, basePath: string) {
  const chapterLinks = documentData.chapters.map((chapter) => ({
    href: buildPublicHref(buildChapterPath(product.path, chapter.slug), basePath),
    label: chapter.summary ? `${chapter.title} — ${chapter.summary}` : chapter.title
  }));

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
      </nav>
      <header>
        <p>${escapeHtml(product.shortLabel)}</p>
        <h1>${escapeHtml(product.title)}</h1>
        <p>${escapeHtml(product.summary)}</p>
        <p>${documentData.chapters.length}개 챕터로 구성된 ${escapeHtml(product.title)} 전체 목차입니다.</p>
      </header>
      ${renderLinkList("챕터 목록", chapterLinks, true)}
    </main>
  `;
}

function renderChapterBody(
  product: ProductMeta,
  documentData: DocumentData,
  chapter: Chapter,
  basePath: string
) {
  const currentIndex = documentData.chapters.findIndex((entry) => entry.slug === chapter.slug);
  const previousChapter = currentIndex > 0 ? documentData.chapters[currentIndex - 1] : undefined;
  const nextChapter =
    currentIndex >= 0 && currentIndex < documentData.chapters.length - 1
      ? documentData.chapters[currentIndex + 1]
      : undefined;
  const chapterNavLinks: PageLink[] = [];

  if (previousChapter) {
    chapterNavLinks.push({
      href: buildPublicHref(buildChapterPath(product.path, previousChapter.slug), basePath),
      label: `이전 챕터: ${previousChapter.title}`
    });
  }

  if (nextChapter) {
    chapterNavLinks.push({
      href: buildPublicHref(buildChapterPath(product.path, nextChapter.slug), basePath),
      label: `다음 챕터: ${nextChapter.title}`
    });
  }

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
        <span> / </span>
        <a href="${escapeHtml(buildPublicHref(buildProductPath(product), basePath))}">${escapeHtml(product.title)}</a>
      </nav>
      <article>
        <header>
          <p>${escapeHtml(product.shortLabel)} 챕터</p>
          <h1>${escapeHtml(chapter.title)}</h1>
          ${chapter.summary ? `<p>${escapeHtml(chapter.summary)}</p>` : ""}
        </header>
        ${chapter.html}
      </article>
      ${chapterNavLinks.length > 0 ? renderLinkList("다음 읽기", chapterNavLinks) : ""}
    </main>
  `;
}

function renderBriefArchiveBody(basePath: string) {
  const issueLinks = briefIssues.map((issue) => ({
    href: buildPublicHref(buildBriefIssuePath(issue.slug), basePath),
    label: `${formatBriefDate(issue.publishedAt)} · ${issue.title}`
  }));

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
      </nav>
      <header>
        <p>Hot Global TM Brief</p>
        <h1>지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 해설하는 브리프 아카이브</h1>
        <p>해외 상표 뉴스를 그대로 모으는 대신, 한국 기업이 이번 주 바로 점검해야 할 브랜드 이슈를 골라 짧고 밀도 있게 정리합니다.</p>
      </header>
      ${renderLinkList("브리프 이슈 목록", issueLinks, true)}
    </main>
  `;
}

function renderBriefIssueBody(issue: BriefIssue, basePath: string) {
  const bodyParagraphs = issue.bodyParagraphs?.length
    ? `
        <section>
          ${issue.bodyParagraphs
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join("")}
        </section>
      `
    : "";
  const issueSections = issue.items
    .map(
      (item) => `
        <section>
          <h2>${escapeHtml(item.headline)}</h2>
          <p>${escapeHtml(item.whatChanged)}</p>
          <p><strong>누가 신경 써야 하는가:</strong> ${escapeHtml(item.whoShouldCare)}</p>
          <p><strong>실무 영향:</strong> ${escapeHtml(item.whyItMatters)}</p>
          <p><strong>지금 체크할 것:</strong> ${escapeHtml(item.nextAction)}</p>
          ${renderLinkList(
            "관련 GloTm 가이드",
            item.relatedGuideLinks.map((link) => ({
              href: buildPublicHref(link.href, basePath),
              label: link.label
            }))
          )}
        </section>
      `
    )
    .join("");

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
        <span> / </span>
        <a href="${escapeHtml(buildPublicHref(buildBriefArchivePath(), basePath))}">Hot Global TM Brief</a>
      </nav>
      <article>
        <header>
          <p>${escapeHtml(formatBriefDate(issue.publishedAt))}</p>
          <h1>${escapeHtml(issue.title)}</h1>
          <p>${escapeHtml(issue.summary)}</p>
          <p>관할: ${escapeHtml(issue.jurisdictions.join(" · "))}</p>
        </header>
        ${bodyParagraphs}
        ${issueSections}
      </article>
    </main>
  `;
}

function buildGatewayPage(
  basePath: string,
  siteOrigin: string,
  lastModified: string
): StaticPageDefinition {
  return {
    routePath: "/",
    outputPath: buildOutputPath("/", path.resolve("dist")),
    title: buildRuntimeDocumentTitle(),
    description: DEFAULT_SITE_DESCRIPTION,
    canonicalUrl: buildCanonicalUrl("/", siteOrigin, basePath),
    ogType: "website",
    lastModified: ensureIsoDate(lastModified),
    bodyHtml: renderGatewayBody(basePath)
  };
}

function buildBriefArchiveDescription() {
  return trimDescription(
    "Hot Global TM Brief 아카이브. 지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 골라, 기업이 바로 점검할 운영 포인트와 방어 체계를 정리합니다."
  );
}

function buildBriefIssueDescription(issue: BriefIssue) {
  return trimDescription(
    `${issue.summary} ${issue.jurisdictions.join(", ")} 관할을 중심으로 운영 포인트를 정리한 Hot Global TM Brief 이슈입니다.`
  );
}

function buildProductDescription(product: ProductMeta, documentData: DocumentData) {
  return trimDescription(
    `${product.summary} 현재 ${documentData.chapters.length}개 챕터로 구성된 ${product.title}를 GloTm에서 바로 읽을 수 있습니다.`
  );
}

function buildChapterDescription(product: ProductMeta, chapter: Chapter) {
  const summarySource = chapter.summary || stripHtml(chapter.html) || product.summary;

  return trimDescription(`${summarySource} ${product.shortLabel} 가이드 챕터.`);
}

export function buildStaticPageDefinitions(
  documentDataBySlug: Map<string, DocumentData>,
  options: SeoRuntimeOptions = {}
) {
  const { basePath, siteOrigin, distDir } = getSeoRuntimeOptions(options);
  const gatewayLastModified = [
    ...Array.from(documentDataBySlug.values()).map((documentData) => ensureIsoDate(documentData.meta.builtAt)),
    ...briefIssues.map((issue) => ensureIsoDate(issue.publishedAt))
  ]
    .sort()
    .at(-1) ?? new Date().toISOString();
  const pages: StaticPageDefinition[] = [
    {
      ...buildGatewayPage(basePath, siteOrigin, gatewayLastModified),
      outputPath: buildOutputPath("/", distDir)
    }
  ];

  const briefArchivePath = buildBriefArchivePath();
  const latestBriefPublishedAt = briefIssues[0]?.publishedAt ?? gatewayLastModified;

  pages.push({
    routePath: briefArchivePath,
    outputPath: buildOutputPath(briefArchivePath, distDir),
    title: buildBriefDocumentTitle(),
    description: buildBriefArchiveDescription(),
    canonicalUrl: buildCanonicalUrl(briefArchivePath, siteOrigin, basePath),
    ogType: "website",
    lastModified: ensureIsoDate(latestBriefPublishedAt),
    bodyHtml: renderBriefArchiveBody(basePath)
  });

  for (const issue of briefIssues) {
    const issueRoutePath = buildBriefIssuePath(issue.slug);

    pages.push({
      routePath: issueRoutePath,
      outputPath: buildOutputPath(issueRoutePath, distDir),
      title: buildBriefDocumentTitle(issue),
      description: buildBriefIssueDescription(issue),
      canonicalUrl: buildCanonicalUrl(issueRoutePath, siteOrigin, basePath),
      ogType: "article",
      lastModified: ensureIsoDate(issue.publishedAt),
      bodyHtml: renderBriefIssueBody(issue, basePath)
    });
  }

  for (const product of liveShellProducts) {
    const documentData = documentDataBySlug.get(product.slug);

    if (!documentData) {
      throw new Error(`Missing generated document data for ${product.slug}.`);
    }

    const productRoutePath = buildProductPath(product);

    pages.push({
      routePath: productRoutePath,
      outputPath: buildOutputPath(productRoutePath, distDir),
      title: buildRuntimeDocumentTitle(product.title),
      description: buildProductDescription(product, documentData),
      canonicalUrl: buildCanonicalUrl(productRoutePath, siteOrigin, basePath),
      ogType: "website",
      lastModified: ensureIsoDate(documentData.meta.builtAt),
      bodyHtml: renderProductBody(product, documentData, basePath)
    });

    for (const chapter of documentData.chapters) {
      const chapterRoutePath = buildChapterPath(product.path, chapter.slug);

      pages.push({
        routePath: chapterRoutePath,
        outputPath: buildOutputPath(chapterRoutePath, distDir),
        title: buildRuntimeDocumentTitle(chapter.title),
        description: buildChapterDescription(product, chapter),
        canonicalUrl: buildCanonicalUrl(chapterRoutePath, siteOrigin, basePath),
        ogType: "article",
        lastModified: ensureIsoDate(documentData.meta.builtAt),
        bodyHtml: renderChapterBody(product, documentData, chapter, basePath)
      });
    }
  }

  return pages;
}

function stripManagedHeadTags(templateHtml: string) {
  return templateHtml
    .replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+name="robots"[^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "\n")
    .replace(/\s*<link\s+rel="canonical"[^>]*>\s*/gi, "\n");
}

export function renderStaticHtml(templateHtml: string, page: StaticPageDefinition) {
  const cleanedTemplate = stripManagedHeadTags(templateHtml).replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(page.title)}</title>`
  );
  const seoHead = [
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(page.canonicalUrl)}" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(page.canonicalUrl)}" />`
  ].join("\n    ");

  return cleanedTemplate
    .replace("<div id=\"root\"></div>", `<div id="root">${page.bodyHtml}</div>`)
    .replace("</head>", `    ${seoHead}\n  </head>`);
}

export function render404Html(templateHtml: string) {
  const cleanedTemplate = stripManagedHeadTags(templateHtml).replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(buildRuntimeDocumentTitle("찾을 수 없는 페이지"))}</title>`
  );

  return cleanedTemplate.replace(
    "</head>",
    [
      '    <meta name="description" content="GloTm에서 요청한 페이지를 찾을 수 없습니다." />',
      '    <meta name="robots" content="noindex, nofollow" />',
      "  </head>"
    ].join("\n")
  );
}

export async function loadDocumentDataBySlug(options: SeoRuntimeOptions = {}) {
  const { distDir } = getSeoRuntimeOptions(options);
  const entries = await Promise.all(
    liveShellProducts.map(async (product) => {
      const documentPath = path.join(distDir, "generated", product.slug, "document-data.json");
      const rawDocument = await readFile(documentPath, "utf8");

      return [product.slug, JSON.parse(rawDocument) as DocumentData] as const;
    })
  );

  return new Map(entries);
}

export function buildSitemapXml(pages: StaticPageDefinition[]) {
  const urlEntries = pages
    .map(
      (page) => [
        "  <url>",
        `    <loc>${escapeHtml(page.canonicalUrl)}</loc>`,
        `    <lastmod>${escapeHtml(page.lastModified)}</lastmod>`,
        "  </url>"
      ].join("\n")
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    "</urlset>"
  ].join("\n");
}

export function buildRobotsTxt(siteOrigin: string, basePath = "") {
  const sitemapUrl = `${siteOrigin}${buildPublicHref("/sitemap.xml", basePath)}`;

  return [`User-agent: *`, `Allow: /`, `Sitemap: ${sitemapUrl}`].join("\n");
}

export async function writeStaticPageFiles(templateHtml: string, pages: StaticPageDefinition[]) {
  await Promise.all(
    pages.map(async (page) => {
      await mkdir(path.dirname(page.outputPath), { recursive: true });
      await writeFile(page.outputPath, renderStaticHtml(templateHtml, page));
    })
  );
}
