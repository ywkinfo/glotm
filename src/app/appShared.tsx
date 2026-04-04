import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useHref } from "react-router-dom";

import {
  getGaMeasurementId,
  trackGaEvent
} from "../analytics/ga";
import {
  formatBriefDate,
  buildBriefIssuePath,
  type BriefIssue
} from "../briefs/archive";
import {
  formatReportDate,
  buildReportPath,
  type ReportMeta
} from "../reports/registry";
import { getSearchDensity } from "../products/scorecard";
import {
  buildProductPath,
  type LifecycleStatus,
  type PortfolioTier,
  type ProductMeta,
  type QaLevel
} from "../products/shared";

export const operatorProfileUrl = "https://ywkinfo.github.io";

export function trackEngagement(eventName: string, params: Record<string, string>) {
  const measurementId = getGaMeasurementId();

  if (!measurementId) {
    return;
  }

  trackGaEvent(measurementId, eventName, params);
}

function getCoverageLabel(product: ProductMeta) {
  return product.coverageType === "region" ? "권역 가이드" : "국가 가이드";
}

export function getPortfolioTierLabel(portfolioTier: PortfolioTier) {
  switch (portfolioTier) {
    case "flagship":
      return "Flagship";
    case "growth":
      return "Growth";
    case "validate":
      return "Validate";
    case "incubate":
      return "Incubate";
  }
}

export function getLifecycleStatusLabel(lifecycleStatus: LifecycleStatus) {
  switch (lifecycleStatus) {
    case "pilot":
      return "Pilot";
    case "beta":
      return "Beta";
    case "mature":
      return "Mature";
  }
}

function getQaLevelLabel(qaLevel: QaLevel) {
  switch (qaLevel) {
    case "smoke":
      return "Smoke";
    case "standard":
      return "Standard";
    case "full":
      return "Full";
  }
}

function getAvailabilityLabel(product: ProductMeta) {
  return product.availability === "live_shell"
    ? "라이브 셸 연결"
    : "개발 워크스페이스";
}

export function joinProductLabels(
  productList: ProductMeta[],
  separator = " / "
) {
  return productList.map((product) => product.shortLabel).join(separator);
}

export function orderGatewayProducts(products: ProductMeta[]) {
  const preferredOrder = ["china", "mexico", "europe", "latam", "japan", "uk", "usa"];
  const productIndex = new Map(preferredOrder.map((slug, index) => [slug, index]));

  return [...products].sort((left, right) => {
    const leftIndex = productIndex.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = productIndex.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });
}

const priorityLaneSlugs = ["china", "mexico", "europe"];

function getProductCardCtaClass(product: ProductMeta) {
  return product.portfolioTier === "flagship" || product.portfolioTier === "growth"
    ? "product-card-link"
    : "product-card-link product-card-link--secondary";
}

function getProductCardClass(product: ProductMeta) {
  if (product.portfolioTier === "flagship") {
    return "product-card product-card--focus";
  }

  if (product.portfolioTier === "growth") {
    return "product-card product-card--priority";
  }

  return "product-card";
}

function getProductCardCtaLabel(product: ProductMeta) {
  if (product.slug === "mexico") {
    return "MexTm 먼저 보기";
  }

  if (product.slug === "latam") {
    return "LatTm 기준 프레임 보기";
  }

  return product.primaryCtaLabel;
}

function formatSearchDensity(product: ProductMeta) {
  return getSearchDensity(product).toFixed(1);
}

function getPriorityLaneProducts(products: ProductMeta[]) {
  return priorityLaneSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ProductMeta => Boolean(product));
}

export function buildPriorityLaneLabelSequence(
  products: ProductMeta[],
  separator = " -> "
) {
  return getPriorityLaneProducts(products)
    .map((product) => product.shortLabel)
    .join(separator);
}

export function buildPriorityLaneStatusSummary(products: ProductMeta[]) {
  return getPriorityLaneProducts(products)
    .map(
      (product) =>
        `${product.shortLabel} ${getLifecycleStatusLabel(product.lifecycleStatus)} · QA ${getQaLevelLabel(product.qaLevel)} · gap ${product.highRiskVerificationGapCount}`
    )
    .join(" / ");
}

export function buildTrustLayerGuideGroups(
  report?: ReportMeta,
  orderedProducts: ProductMeta[] = []
) {
  if (!report || report.relatedGuideLinks.length === 0) {
    return {
      priorityGuides: null,
      baselineGuides: null,
      supportingGuides: null
    };
  }

  const relatedGuidePaths = new Set(report.relatedGuideLinks.map((link) => link.href));
  const relatedProducts = orderedProducts.filter((product) =>
    relatedGuidePaths.has(buildProductPath(product))
  );
  const priorityProducts = relatedProducts.filter((product) =>
    priorityLaneSlugs.includes(product.slug)
  );
  const baselineProducts = relatedProducts.filter((product) => product.slug === "latam");
  const supportingProducts = relatedProducts.filter(
    (product) => !priorityLaneSlugs.includes(product.slug) && product.slug !== "latam"
  );

  return {
    priorityGuides:
      priorityProducts.length > 0
        ? joinProductLabels(priorityProducts, " · ")
        : null,
    baselineGuides:
      baselineProducts.length > 0
        ? joinProductLabels(baselineProducts, " · ")
        : null,
    supportingGuides:
      supportingProducts.length > 0
        ? joinProductLabels(supportingProducts, " · ")
        : null
  };
}

export function buildGuideTrackingParams(
  product: ProductMeta,
  surface: string,
  extraParams: Record<string, string> = {}
) {
  return {
    product_slug: product.slug,
    portfolio_tier: product.portfolioTier,
    lifecycle_status: product.lifecycleStatus,
    surface,
    ...extraParams
  };
}

export function getTierComposition(products: ProductMeta[]) {
  const tierCounts = products.reduce(
    (counts, product) => {
      counts[product.portfolioTier] += 1;
      return counts;
    },
    {
      flagship: 0,
      growth: 0,
      validate: 0,
      incubate: 0
    } as Record<PortfolioTier, number>
  );

  return `${tierCounts.flagship} Flagship · ${tierCounts.growth} Growth · ${tierCounts.validate} Validate · ${tierCounts.incubate} Incubate`;
}

type FullDocumentLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  to: string;
};

export const FullDocumentLink = forwardRef<HTMLAnchorElement, FullDocumentLinkProps>(
  function FullDocumentLink({ to, ...props }, ref) {
    const href = useHref(to);
    const normalizedHref =
      to === buildProductPath("/") && href !== "/" && !href.endsWith("/")
        ? `${href}/`
        : href;

    return <a {...props} href={normalizedHref} ref={ref} />;
  }
);

function ProductCard({ product, surface }: { product: ProductMeta; surface: string }) {
  return (
    <article className={getProductCardClass(product)}>
      <div className="product-card-topline">
        <p className="gateway-kicker">{product.shortLabel}</p>
        <span className={`status-pill status-pill--${product.lifecycleTone}`}>
          {getLifecycleStatusLabel(product.lifecycleStatus)}
        </span>
      </div>
      <div>
        <span className="product-card-stage">
          {getPortfolioTierLabel(product.portfolioTier)} · {getCoverageLabel(product)} · {getAvailabilityLabel(product)}
        </span>
        <p className="product-card-metrics">
          총 {product.chapterCount}개 챕터 · 검색 {product.searchEntryCount}개 엔트리 · density {formatSearchDensity(product)}
        </p>
        <p className="product-card-scorecard">
          검증 freshness {product.verificationFreshnessDays}일 · QA {getQaLevelLabel(product.qaLevel)} · 고위험 gap {product.highRiskVerificationGapCount}건
        </p>
        <h3 className="product-card-title">{product.title}</h3>
      </div>
      <p className="product-card-copy">{product.summary}</p>
      {product.maturityNote ? (
        <p className="product-card-note">{product.maturityNote}</p>
      ) : null}
      <p className="product-card-audience">대상: {product.audience}</p>
      <div className="product-card-actions">
        <FullDocumentLink
          className={getProductCardCtaClass(product)}
          to={buildProductPath(product)}
          onClick={() => {
            trackEngagement("guide_cta_click", buildGuideTrackingParams(product, surface));
          }}
        >
          {getProductCardCtaLabel(product)}
        </FullDocumentLink>
      </div>
    </article>
  );
}

type ProductGroupProps = {
  title: string;
  description: string;
  products: ProductMeta[];
  surface: string;
};

export function ProductGroup({ title, description, products, surface }: ProductGroupProps) {
  return (
    <div className="product-group">
      <div className="product-group-header">
        <h3 className="product-group-title">{title}</h3>
        <p className="product-group-copy">{description}</p>
      </div>
      <div className="product-card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} surface={surface} />
        ))}
      </div>
    </div>
  );
}

type BriefIssueCardProps = {
  issue: BriefIssue;
  surface: "gateway" | "archive";
};

export function BriefIssueCard({ issue, surface }: BriefIssueCardProps) {
  return (
    <article className="brief-card">
      <div className="brief-card-topline">
        <p className="gateway-kicker">Latest Brief</p>
        <span className="status-pill status-pill--neutral">{issue.cadenceLabel}</span>
      </div>
      <p className="brief-card-date">{formatBriefDate(issue.publishedAt)}</p>
      <h3 className="brief-card-title">{issue.title}</h3>
      <p className="brief-card-summary">{issue.summary}</p>
      <div className="brief-chip-row" aria-label="관할 목록">
        {issue.jurisdictions.map((jurisdiction) => (
          <span key={jurisdiction} className="brief-chip">
            {jurisdiction}
          </span>
        ))}
      </div>
      <ul className="brief-card-list">
        {issue.items.slice(0, 2).map((item) => (
          <li key={item.id}>{item.headline}</li>
        ))}
      </ul>
      <div className="brief-card-actions">
        <FullDocumentLink
          className="product-card-link"
          to={buildBriefIssuePath(issue.slug)}
          onClick={() => {
            trackEngagement("brief_issue_open", {
              issue_slug: issue.slug,
              surface
            });
          }}
        >
          이번 이슈 보기
        </FullDocumentLink>
      </div>
    </article>
  );
}

export function BriefGuideLinks({
  issue,
  itemId,
  links
}: {
  issue: BriefIssue;
  itemId: string;
  links: BriefIssue["items"][number]["relatedGuideLinks"];
}) {
  return (
    <div className="brief-link-row">
      {links.map((link) => (
        <FullDocumentLink
          key={`${itemId}-${link.href}`}
          className="brief-guide-link"
          to={link.href}
          onClick={() => {
            trackEngagement("brief_guide_click", {
              issue_slug: issue.slug,
              item_id: itemId,
              target_path: link.href
            });
          }}
        >
          {link.label}
        </FullDocumentLink>
      ))}
    </div>
  );
}

export function ReportCard({ report, surface }: { report: ReportMeta; surface?: string }) {
  return (
    <article className="brief-card">
      <div className="brief-card-topline">
        <p className="gateway-kicker">Special Report</p>
        <span className="status-pill status-pill--neutral">{report.tags[0] ?? "Report"}</span>
      </div>
      <p className="brief-card-date">{formatReportDate(report.publishedAt)}</p>
      <h3 className="brief-card-title">{report.title}</h3>
      <p className="brief-card-summary">{report.summary}</p>
      <div className="brief-chip-row" aria-label="리포트 관할 목록">
        {report.jurisdictions.map((jurisdiction) => (
          <span key={jurisdiction} className="brief-chip">
            {jurisdiction}
          </span>
        ))}
      </div>
      <div className="brief-card-actions">
        <FullDocumentLink
          className="product-card-link"
          to={buildReportPath(report.slug)}
          onClick={() => {
            if (!surface) {
              return;
            }

            trackEngagement("report_open", {
              report_slug: report.slug,
              surface
            });
          }}
        >
          리포트 읽기
        </FullDocumentLink>
      </div>
    </article>
  );
}
