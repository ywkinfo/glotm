import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { gitLastModifiedIso } from "./git-last-modified";

import {
  briefIssues,
  buildBriefArchivePath,
  buildBriefDocumentTitle,
  buildBriefIssuePath,
  formatBriefDate,
  getBriefLastModified,
  resolveBriefCorrection,
  type BriefIssue
} from "../src/briefs/archive";
import {
  buildReportArchivePath,
  buildReportDocumentTitle,
  buildReportPath,
  formatReportDate,
  reports,
  type ReportMeta
} from "../src/reports/registry";
import { liveShellProducts } from "../src/products/registry";
import { gatewayHeroSupportingParagraphs } from "../src/content/gateway";
import {
  buildChapterPath,
  buildProductPath,
  buildRuntimeDocumentTitle,
  normalizeBasePath,
  type Chapter,
  type DocumentData,
  type ProductMeta
} from "../src/products/shared";
import {
  formatFactsReviewedNote,
  legalNavLinks,
  legalNoticeBullets,
  legalNoticeSummary,
  legalNoticeTitle,
  legalPages,
  siteAuthor,
  sitePublisher,
  type LegalPageDefinition
} from "../src/trustLegal";

const DEFAULT_SITE_ORIGIN = "https://ywkinfo.github.io";
const DEFAULT_SITE_NAME = "GloTm";
const DEFAULT_SITE_DESCRIPTION =
  "중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다.";
const DEFAULT_GATEWAY_HEADING = "인하우스 팀을 위한 cross-border trademark operating guide";
const DEFAULT_SOCIAL_IMAGE_PATH = "/og/glotm-share-card.svg";
// legalPages 정본. 이 경로가 옮겨가면 legal 3면의 lastmod는 조용히 fallback으로 내려가므로,
// seo.test.ts가 실재를 단정할 수 있도록 내보낸다.
export const LEGAL_SOURCE_PATH = "src/trustLegal.ts";
const DEFAULT_SOCIAL_IMAGE_ALT =
  "GloTm Gateway와 인하우스 팀을 위한 cross-border trademark operating guide를 소개하는 대표 공유 이미지";
const DEFAULT_SOCIAL_IMAGE_WIDTH = 1200;
const DEFAULT_SOCIAL_IMAGE_HEIGHT = 630;

export type StaticPageDefinition = {
  routePath: string;
  outputPath: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogType: "website" | "article";
  lastModified: string;
  bodyHtml: string;
  // 아래는 선택 SEO/구조화 신호. 없으면 렌더에서 안전하게 생략된다.
  structuredData?: Record<string, unknown>[];
  sitemapPriority?: number;
  changeFrequency?: string;
  prevUrl?: string;
  nextUrl?: string;
  // article OG published_time용. 미설정이면 lastModified로 대체한다.
  publishedTime?: string;
};

type JsonLdNode = Record<string, unknown>;

type BreadcrumbEntry = {
  name: string;
  url: string;
};

// Person(저자) 노드. D-a=A: siteAuthor 정본(현재 공개 수준)만 담는다.
function buildAuthorNode(): JsonLdNode {
  return {
    "@type": "Person",
    name: siteAuthor.name,
    alternateName: siteAuthor.alternateName,
    url: siteAuthor.url,
    description: siteAuthor.description
  };
}

// Organization(발행 주체) 노드. 페이지마다 self-contained하도록 @id 참조 대신 인라인한다.
function buildPublisherNode(siteUrl: string, logoUrl: string): JsonLdNode {
  return {
    "@type": "Organization",
    name: sitePublisher.name,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl
    }
  };
}

function buildWebSiteGraph(siteUrl: string, logoUrl: string): JsonLdNode {
  return {
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: sitePublisher.name,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: DEFAULT_SITE_NAME,
        url: siteUrl,
        inLanguage: "ko",
        publisher: { "@id": `${siteUrl}#organization` }
      }
    ]
  };
}

function buildBreadcrumbNode(items: BreadcrumbEntry[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Article 노드. 날짜는 호출부가 넘긴 실제 값에서만 파생한다(날조 금지).
// datePublished는 진짜 게시일이 있는 글(브리프·리포트)에만 넣는다. 가이드 챕터의 builtAt은
// '재생성 시각'이라 게시일로 오인될 수 있어 생략하고 dateModified만 둔다(안정적 최초 게시일 필드 도입 전까지).
function buildArticleNode(input: {
  headline: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished?: string;
  dateModified: string;
  siteUrl: string;
  logoUrl: string;
}): JsonLdNode {
  return {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    inLanguage: "ko",
    url: input.url,
    mainEntityOfPage: input.url,
    image: input.imageUrl,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified,
    author: buildAuthorNode(),
    publisher: buildPublisherNode(input.siteUrl, input.logoUrl)
  };
}

type SeoRuntimeOptions = {
  basePath?: string;
  distDir?: string;
  siteOrigin?: string;
  // 테스트가 git 조회를 우회하도록 주입하는 값. 미지정이면 src/trustLegal.ts의 커밋일을 쓴다.
  legalLastModified?: string;
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

  const fullPath = `${basePath}${routePath}`;

  const hashIndex = fullPath.indexOf("#");
  const pathPart = hashIndex >= 0 ? fullPath.slice(0, hashIndex) : fullPath;
  const hashPart = hashIndex >= 0 ? fullPath.slice(hashIndex) : "";

  const lastSegment = pathPart.split("/").pop() ?? "";
  if (lastSegment.includes(".")) {
    return fullPath;
  }

  const normalizedPath = pathPart.endsWith("/") ? pathPart : `${pathPart}/`;
  return `${normalizedPath}${hashPart}`;
}

export function buildCanonicalUrl(routePath: string, siteOrigin: string, basePath = "") {
  return `${siteOrigin}${buildPublicHref(routePath, basePath)}`;
}

function buildDefaultSocialImage(siteOrigin: string, basePath: string) {
  return {
    ogImageUrl: buildCanonicalUrl(DEFAULT_SOCIAL_IMAGE_PATH, siteOrigin, basePath),
    ogImageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
    ogImageWidth: DEFAULT_SOCIAL_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_SOCIAL_IMAGE_HEIGHT
  };
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

function renderTrustLegalNotice(basePath: string) {
  const legalLinks = legalNavLinks
    .map(
      (link) =>
        `<a href="${escapeHtml(buildPublicHref(link.path, basePath))}">${escapeHtml(link.label)}</a>`
    )
    .join("");

  return `
      <aside aria-label="GloTm legal notice">
        <p>${escapeHtml(legalNoticeTitle)}</p>
        <p>${escapeHtml(legalNoticeSummary)}</p>
        <ul>
          ${legalNoticeBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <nav aria-label="GloTm legal links">${legalLinks}</nav>
      </aside>
  `;
}

// 가이드/챕터 본문에 1차 출처 대조 기준일을 사람이 읽는 문구로 노출한다(crawler·no-JS 대상).
// factsReviewedOn 미기록이면 빈 문자열을 돌려 아무것도 렌더하지 않는다.
function renderFactsReviewedNote(product: ProductMeta) {
  const note = formatFactsReviewedNote(product.factsReviewedOn);

  return note ? `<p data-provenance="facts-reviewed">${escapeHtml(note)}</p>` : "";
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
        <h1>${escapeHtml(DEFAULT_GATEWAY_HEADING)}</h1>
        <p>${escapeHtml(DEFAULT_SITE_DESCRIPTION)}</p>
        ${gatewayHeroSupportingParagraphs.map(
          (paragraph) => `<p>${escapeHtml(paragraph)}</p>`
        ).join("\n        ")}
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
        <h2>운영 가이드 포트폴리오</h2>
        <p>현재 ${liveShellProducts.length}개의 권역형·국가형 guide를 flagship, growth, validate, incubate 구조로 운영하고 있습니다.</p>
      </section>
      ${renderLinkList("가이드 목록", productLinks)}
      ${renderTrustLegalNotice(basePath)}
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
        ${renderFactsReviewedNote(product)}
      </header>
      ${renderLinkList("챕터 목록", chapterLinks, true)}
      ${renderTrustLegalNotice(basePath)}
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
          ${renderFactsReviewedNote(product)}
        </header>
        ${chapter.html}
      </article>
      ${chapterNavLinks.length > 0 ? renderLinkList("다음 읽기", chapterNavLinks) : ""}
      ${renderTrustLegalNotice(basePath)}
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
      ${renderTrustLegalNotice(basePath)}
    </main>
  `;
}

function renderBriefIssueBody(issue: BriefIssue, basePath: string) {
  const correction = resolveBriefCorrection(issue);
  // 정정 고지는 본문보다 먼저 나와야 한다. prerender HTML만 읽는 크롤러와 첫 페인트 독자가
  // 정정 사실을 지난 이슈 본문보다 먼저 만나야 하기 때문이다.
  const correctionNotice = correction
    ? `
        <section>
          <p><strong>이후 이슈에서 정정됨:</strong> ${escapeHtml(correction.note)}</p>
          <p><a href="${escapeHtml(buildPublicHref(buildBriefIssuePath(correction.replacement.slug), basePath))}">${escapeHtml(formatBriefDate(correction.replacement.publishedAt))} 이슈에서 확인하기</a></p>
        </section>
      `
    : "";
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
          <p><time datetime="${escapeHtml(ensureIsoDate(issue.publishedAt))}">${escapeHtml(formatBriefDate(issue.publishedAt))}</time></p>
          <h1>${escapeHtml(issue.title)}</h1>
          <p>${escapeHtml(issue.summary)}</p>
          <p>관할: ${escapeHtml(issue.jurisdictions.join(" · "))}</p>
        </header>
        ${correctionNotice}
        ${bodyParagraphs}
        ${issueSections}
      </article>
      ${renderTrustLegalNotice(basePath)}
    </main>
  `;
}

function renderReportArchiveBody(basePath: string) {
  const reportLinks = reports.map((report) => ({
    href: buildPublicHref(buildReportPath(report.slug), basePath),
    label: `${formatReportDate(report.publishedAt)} · ${report.title}`
  }));

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
      </nav>
      <header>
        <p>Report</p>
        <h1>개별 guide를 넘어 교차 관할권 운영 판단을 다루는 리포트</h1>
        <p>특정 국가 하나의 절차 요약보다, 여러 관할에서 공통으로 반복되는 운영 질문을 한 문서로 정리하고 최신순으로 보여주는 리포트 아카이브입니다.</p>
      </header>
      ${renderLinkList("리포트 목록", reportLinks, true)}
      ${renderTrustLegalNotice(basePath)}
    </main>
  `;
}

function renderReportBody(report: ReportMeta, documentData: DocumentData, basePath: string) {
  const chapter = documentData.chapters[0];

  if (!chapter) {
    throw new Error(`Missing report body chapter for ${report.slug}.`);
  }

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
        <span> / </span>
        <a href="${escapeHtml(buildPublicHref(buildReportArchivePath(), basePath))}">Report</a>
      </nav>
      <article>
        <header>
          <p><time datetime="${escapeHtml(ensureIsoDate(report.publishedAt))}">${escapeHtml(formatReportDate(report.publishedAt))}</time></p>
          <h1>${escapeHtml(report.title)}</h1>
          <p>${escapeHtml(report.summary)}</p>
          <p>관할: ${escapeHtml(report.jurisdictions.join(" · "))}</p>
        </header>
        ${chapter.html}
        ${renderLinkList(
          "관련 GloTm 가이드",
          report.relatedGuideLinks.map((link) => ({
            href: buildPublicHref(link.href, basePath),
            label: link.label
          }))
        )}
      </article>
      ${renderTrustLegalNotice(basePath)}
    </main>
  `;
}

function buildGatewayPage(
  basePath: string,
  siteOrigin: string,
  lastModified: string
): StaticPageDefinition {
  const siteUrl = buildCanonicalUrl("/", siteOrigin, basePath);
  const logoUrl = buildCanonicalUrl(DEFAULT_SOCIAL_IMAGE_PATH, siteOrigin, basePath);

  return {
    routePath: "/",
    outputPath: buildOutputPath("/", path.resolve("dist")),
    title: buildRuntimeDocumentTitle(),
    description: DEFAULT_SITE_DESCRIPTION,
    canonicalUrl: siteUrl,
    ...buildDefaultSocialImage(siteOrigin, basePath),
    ogType: "website",
    lastModified: ensureIsoDate(lastModified),
    bodyHtml: renderGatewayBody(basePath),
    structuredData: [buildWebSiteGraph(siteUrl, logoUrl)],
    sitemapPriority: 1,
    changeFrequency: "weekly"
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

function buildReportArchiveDescription() {
  return trimDescription(
    "Report 아카이브. 개별 국가 guide를 넘어, 여러 관할에서 반복되는 운영 질문과 대응 체계를 최신순으로 정리한 GloTm 리포트입니다."
  );
}

function buildReportDescription(report: ReportMeta) {
  return trimDescription(
    `${report.summary} ${report.jurisdictions.join(", ")} 관할을 함께 보는 교차 관할권 운영 리포트입니다.`
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

function buildLegalPageDescription(page: LegalPageDefinition) {
  return trimDescription(page.summary);
}

function renderLegalBody(page: LegalPageDefinition, basePath: string) {
  const relatedLinks = legalPages
    .filter((entry) => entry.slug !== page.slug)
    .map((entry) => ({
      href: buildPublicHref(entry.path, basePath),
      label: entry.navLabel
    }));
  const sectionsHtml = page.sections
    .map(
      (section) => `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("\n        ")}
      </section>`
    )
    .join("\n");

  return `
    <main>
      <nav>
        <a href="${escapeHtml(buildPublicHref("/", basePath))}">GloTm Gateway</a>
      </nav>
      <header>
        <p>${escapeHtml(page.kicker)}</p>
        <h1>${escapeHtml(page.title)}</h1>
        <p>${escapeHtml(page.summary)}</p>
      </header>
      ${sectionsHtml}
      ${renderLinkList("관련 고지", relatedLinks)}
    </main>
  `;
}

export function buildStaticPageDefinitions(
  documentDataBySlug: Map<string, DocumentData>,
  reportDocumentDataBySlugOrOptions: Map<string, DocumentData> | SeoRuntimeOptions = new Map(),
  maybeOptions: SeoRuntimeOptions = {}
) {
  const reportDocumentDataBySlug = reportDocumentDataBySlugOrOptions instanceof Map
    ? reportDocumentDataBySlugOrOptions
    : new Map<string, DocumentData>();
  const options = reportDocumentDataBySlugOrOptions instanceof Map
    ? maybeOptions
    : reportDocumentDataBySlugOrOptions;
  const { basePath, siteOrigin, distDir } = getSeoRuntimeOptions(options);
  const siteUrl = buildCanonicalUrl("/", siteOrigin, basePath);
  const logoUrl = buildCanonicalUrl(DEFAULT_SOCIAL_IMAGE_PATH, siteOrigin, basePath);
  const gatewayCrumb: BreadcrumbEntry = { name: `${DEFAULT_SITE_NAME} Gateway`, url: siteUrl };
  const gatewayLastModified = [
    ...Array.from(documentDataBySlug.values()).map((documentData) => ensureIsoDate(documentData.meta.builtAt)),
    ...Array.from(reportDocumentDataBySlug.values()).map((documentData) => ensureIsoDate(documentData.meta.builtAt)),
    ...reports.map((report) => ensureIsoDate(report.updatedAt ?? report.publishedAt)),
    ...briefIssues.map((issue) => ensureIsoDate(getBriefLastModified(issue)))
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
  const reportArchivePath = buildReportArchivePath();
  const latestReportPublishedAt = reports[0]?.updatedAt ?? reports[0]?.publishedAt ?? gatewayLastModified;

  const briefArchiveUrl = buildCanonicalUrl(briefArchivePath, siteOrigin, basePath);
  pages.push({
    routePath: briefArchivePath,
    outputPath: buildOutputPath(briefArchivePath, distDir),
    title: buildBriefDocumentTitle(),
    description: buildBriefArchiveDescription(),
    canonicalUrl: briefArchiveUrl,
    ...buildDefaultSocialImage(siteOrigin, basePath),
    ogType: "website",
    lastModified: ensureIsoDate(latestBriefPublishedAt),
    bodyHtml: renderBriefArchiveBody(basePath),
    structuredData: [
      buildBreadcrumbNode([gatewayCrumb, { name: "Hot Global TM Brief", url: briefArchiveUrl }])
    ],
    sitemapPriority: 0.9,
    changeFrequency: "weekly"
  });

  const reportArchiveUrl = buildCanonicalUrl(reportArchivePath, siteOrigin, basePath);
  pages.push({
    routePath: reportArchivePath,
    outputPath: buildOutputPath(reportArchivePath, distDir),
    title: buildReportDocumentTitle(),
    description: buildReportArchiveDescription(),
    canonicalUrl: reportArchiveUrl,
    ...buildDefaultSocialImage(siteOrigin, basePath),
    ogType: "website",
    lastModified: ensureIsoDate(latestReportPublishedAt),
    bodyHtml: renderReportArchiveBody(basePath),
    structuredData: [
      buildBreadcrumbNode([gatewayCrumb, { name: "Report", url: reportArchiveUrl }])
    ],
    sitemapPriority: 0.9,
    changeFrequency: "weekly"
  });

  // 법적고지·개인정보·문의 3면의 내용은 src/trustLegal.ts가 정본이고, 브리프나 리포트가
  // 나간다고 바뀌지 않는다. gatewayLastModified를 물려받으면 발행 때마다 이 3면도 갱신됐다고
  // 신고하게 되므로(가이드 코퍼스에서 방금 고친 것과 같은 거짓 신선도), 자기 소스의 커밋일을 쓴다.
  // git을 쓸 수 없으면 종전 동작인 gatewayLastModified로 내려간다.
  const legalLastModified =
    options.legalLastModified ?? gitLastModifiedIso(LEGAL_SOURCE_PATH) ?? gatewayLastModified;

  for (const legalPage of legalPages) {
    const legalUrl = buildCanonicalUrl(legalPage.path, siteOrigin, basePath);
    pages.push({
      routePath: legalPage.path,
      outputPath: buildOutputPath(legalPage.path, distDir),
      title: buildRuntimeDocumentTitle(legalPage.title),
      description: buildLegalPageDescription(legalPage),
      canonicalUrl: legalUrl,
      ...buildDefaultSocialImage(siteOrigin, basePath),
      ogType: "website",
      lastModified: ensureIsoDate(legalLastModified),
      bodyHtml: renderLegalBody(legalPage, basePath),
      structuredData: [
        buildBreadcrumbNode([gatewayCrumb, { name: legalPage.navLabel, url: legalUrl }])
      ],
      sitemapPriority: 0.3,
      changeFrequency: "yearly"
    });
  }

  for (const issue of briefIssues) {
    const issueRoutePath = buildBriefIssuePath(issue.slug);
    const issueUrl = buildCanonicalUrl(issueRoutePath, siteOrigin, basePath);
    const issuePublishedIso = ensureIsoDate(issue.publishedAt);
    // 정정 포인터가 붙으면 페이지 내용이 실제로 바뀐다. 재크롤 신호가 남도록 lastModified/dateModified를 분리한다.
    const issueModifiedIso = ensureIsoDate(getBriefLastModified(issue));
    const socialImage = buildDefaultSocialImage(siteOrigin, basePath);

    pages.push({
      routePath: issueRoutePath,
      outputPath: buildOutputPath(issueRoutePath, distDir),
      title: buildBriefDocumentTitle(issue),
      description: buildBriefIssueDescription(issue),
      canonicalUrl: issueUrl,
      ...socialImage,
      ogType: "article",
      lastModified: issueModifiedIso,
      publishedTime: issuePublishedIso,
      bodyHtml: renderBriefIssueBody(issue, basePath),
      structuredData: [
        buildArticleNode({
          headline: issue.title,
          description: buildBriefIssueDescription(issue),
          url: issueUrl,
          imageUrl: socialImage.ogImageUrl,
          datePublished: issuePublishedIso,
          dateModified: issueModifiedIso,
          siteUrl,
          logoUrl
        }),
        buildBreadcrumbNode([
          gatewayCrumb,
          { name: "Hot Global TM Brief", url: briefArchiveUrl },
          { name: issue.title, url: issueUrl }
        ])
      ],
      sitemapPriority: 0.7,
      changeFrequency: "monthly"
    });
  }

  for (const report of reports) {
    const reportDocumentData = reportDocumentDataBySlug.get(report.slug);

    if (!reportDocumentData) {
      throw new Error(`Missing generated report document data for ${report.slug}.`);
    }

    const reportRoutePath = buildReportPath(report.slug);
    const reportUrl = buildCanonicalUrl(reportRoutePath, siteOrigin, basePath);
    const reportPublishedIso = ensureIsoDate(report.publishedAt);
    const reportModifiedIso = ensureIsoDate(report.updatedAt ?? reportDocumentData.meta.builtAt);
    const reportSocialImage = buildDefaultSocialImage(siteOrigin, basePath);

    pages.push({
      routePath: reportRoutePath,
      outputPath: buildOutputPath(reportRoutePath, distDir),
      title: buildReportDocumentTitle(report),
      description: buildReportDescription(report),
      canonicalUrl: reportUrl,
      ...reportSocialImage,
      ogType: "article",
      lastModified: reportModifiedIso,
      publishedTime: reportPublishedIso,
      bodyHtml: renderReportBody(report, reportDocumentData, basePath),
      structuredData: [
        buildArticleNode({
          headline: report.title,
          description: buildReportDescription(report),
          url: reportUrl,
          imageUrl: reportSocialImage.ogImageUrl,
          datePublished: reportPublishedIso,
          dateModified: reportModifiedIso,
          siteUrl,
          logoUrl
        }),
        buildBreadcrumbNode([
          gatewayCrumb,
          { name: "Report", url: reportArchiveUrl },
          { name: report.title, url: reportUrl }
        ])
      ],
      sitemapPriority: 0.7,
      changeFrequency: "monthly"
    });
  }

  for (const product of liveShellProducts) {
    const documentData = documentDataBySlug.get(product.slug);

    if (!documentData) {
      throw new Error(`Missing generated document data for ${product.slug}.`);
    }

    const productRoutePath = buildProductPath(product);
    const productUrl = buildCanonicalUrl(productRoutePath, siteOrigin, basePath);
    const productCrumb: BreadcrumbEntry = { name: product.title, url: productUrl };
    const productBuiltIso = ensureIsoDate(documentData.meta.builtAt);

    pages.push({
      routePath: productRoutePath,
      outputPath: buildOutputPath(productRoutePath, distDir),
      title: buildRuntimeDocumentTitle(product.title),
      description: buildProductDescription(product, documentData),
      canonicalUrl: productUrl,
      ...buildDefaultSocialImage(siteOrigin, basePath),
      ogType: "website",
      lastModified: productBuiltIso,
      bodyHtml: renderProductBody(product, documentData, basePath),
      structuredData: [buildBreadcrumbNode([gatewayCrumb, productCrumb])],
      sitemapPriority: 0.8,
      changeFrequency: "monthly"
    });

    for (let index = 0; index < documentData.chapters.length; index += 1) {
      const chapter = documentData.chapters[index]!;
      const chapterRoutePath = buildChapterPath(product.path, chapter.slug);
      const chapterUrl = buildCanonicalUrl(chapterRoutePath, siteOrigin, basePath);
      const chapterSocialImage = buildDefaultSocialImage(siteOrigin, basePath);
      const previousChapter = index > 0 ? documentData.chapters[index - 1] : undefined;
      const nextChapter =
        index < documentData.chapters.length - 1 ? documentData.chapters[index + 1] : undefined;

      pages.push({
        routePath: chapterRoutePath,
        outputPath: buildOutputPath(chapterRoutePath, distDir),
        title: buildRuntimeDocumentTitle(chapter.title),
        description: buildChapterDescription(product, chapter),
        canonicalUrl: chapterUrl,
        ...chapterSocialImage,
        ogType: "article",
        lastModified: productBuiltIso,
        // 가이드 챕터는 안정적 최초 게시일 필드가 없으므로 publishedTime을 두지 않는다(dateModified만).
        bodyHtml: renderChapterBody(product, documentData, chapter, basePath),
        prevUrl: previousChapter
          ? buildCanonicalUrl(buildChapterPath(product.path, previousChapter.slug), siteOrigin, basePath)
          : undefined,
        nextUrl: nextChapter
          ? buildCanonicalUrl(buildChapterPath(product.path, nextChapter.slug), siteOrigin, basePath)
          : undefined,
        structuredData: [
          buildArticleNode({
            headline: chapter.title,
            description: buildChapterDescription(product, chapter),
            url: chapterUrl,
            imageUrl: chapterSocialImage.ogImageUrl,
            dateModified: productBuiltIso,
            siteUrl,
            logoUrl
          }),
          buildBreadcrumbNode([
            gatewayCrumb,
            productCrumb,
            { name: chapter.title, url: chapterUrl }
          ])
        ],
        sitemapPriority: 0.6,
        changeFrequency: "monthly"
      });
    }
  }

  return pages;
}

function stripManagedHeadTags(templateHtml: string) {
  return templateHtml
    .replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+name="robots"[^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "\n")
    .replace(/\s*<link\s+rel="canonical"[^>]*>\s*/gi, "\n");
}

// JSON-LD를 <script>에 안전하게 넣기 위해 '<'를 유니코드 이스케이프한다(</script> 조기 종료 방지).
function serializeJsonLd(node: Record<string, unknown>) {
  return JSON.stringify({ "@context": "https://schema.org", ...node }).replace(/</g, "\\u003c");
}

function renderStructuredDataScripts(page: StaticPageDefinition) {
  if (!page.structuredData?.length) {
    return "";
  }

  return page.structuredData
    .map((node) => `<script type="application/ld+json">${serializeJsonLd(node)}</script>`)
    .join("\n    ");
}

export function renderStaticHtml(templateHtml: string, page: StaticPageDefinition) {
  const cleanedTemplate = stripManagedHeadTags(templateHtml).replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(page.title)}</title>`
  );
  const headEntries = [
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(page.canonicalUrl)}" />`,
    `<meta property="og:site_name" content="${DEFAULT_SITE_NAME}" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(page.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(page.ogImageUrl)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(page.ogImageAlt)}" />`,
    `<meta property="og:image:width" content="${String(page.ogImageWidth)}" />`,
    `<meta property="og:image:height" content="${String(page.ogImageHeight)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(page.ogImageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(page.ogImageAlt)}" />`
  ];

  if (page.ogType === "article") {
    // published_time은 진짜 게시일(publishedTime)이 있을 때만 노출한다.
    // 가이드 챕터처럼 게시일이 없으면 modified_time만 둔다(재생성 시각을 게시일로 오인시키지 않기 위함).
    if (page.publishedTime) {
      headEntries.push(
        `<meta property="article:published_time" content="${escapeHtml(page.publishedTime)}" />`
      );
    }

    headEntries.push(
      `<meta property="article:modified_time" content="${escapeHtml(page.lastModified)}" />`
    );
  }

  if (page.prevUrl) {
    headEntries.push(`<link rel="prev" href="${escapeHtml(page.prevUrl)}" />`);
  }

  if (page.nextUrl) {
    headEntries.push(`<link rel="next" href="${escapeHtml(page.nextUrl)}" />`);
  }

  const structuredDataScripts = renderStructuredDataScripts(page);

  if (structuredDataScripts) {
    headEntries.push(structuredDataScripts);
  }

  const seoHead = headEntries.join("\n    ");

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

export async function loadReportDocumentDataBySlug(options: SeoRuntimeOptions = {}) {
  const { distDir } = getSeoRuntimeOptions(options);
  const entries = await Promise.all(
    reports.map(async (report) => {
      const documentPath = path.join(
        distDir,
        "generated",
        "reports",
        report.slug,
        "document-data.json"
      );
      const rawDocument = await readFile(documentPath, "utf8");

      return [report.slug, JSON.parse(rawDocument) as DocumentData] as const;
    })
  );

  return new Map(entries);
}

export function buildSitemapXml(pages: StaticPageDefinition[]) {
  const urlEntries = pages
    .map((page) => {
      const lines = [
        "  <url>",
        `    <loc>${escapeHtml(page.canonicalUrl)}</loc>`,
        `    <lastmod>${escapeHtml(page.lastModified)}</lastmod>`
      ];

      if (page.changeFrequency) {
        lines.push(`    <changefreq>${escapeHtml(page.changeFrequency)}</changefreq>`);
      }

      if (typeof page.sitemapPriority === "number") {
        lines.push(`    <priority>${page.sitemapPriority.toFixed(1)}</priority>`);
      }

      lines.push("  </url>");

      return lines.join("\n");
    })
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
