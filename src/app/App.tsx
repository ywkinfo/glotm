import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef
} from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
  useHref,
  useLocation
} from "react-router-dom";

import {
  getGaMeasurementId,
  initializeGa,
  trackGaEvent,
  trackGaPageView
} from "../analytics/ga";
import {
  briefIssues,
  buildBriefArchivePath,
  buildBriefIssuePath,
  formatBriefDate,
  getBriefIssueBySlug,
  getLatestBriefIssue,
  type BriefIssue
} from "../briefs/archive";
import { getIntroSection } from "../content/intro";
import {
  buildReportArchivePath,
  buildReportPath,
  formatReportDate,
  getLatestReport,
  getReportBySlug,
  reports,
  type ReportMeta
} from "../reports/registry";
import {
  MarkdownArticle,
  StatusPage
} from "../products/components";
import {
  liveShellProducts
} from "../products/registry";
import { liveShellReaderEntries } from "../products/liveShellReaders";
import { getSearchDensity } from "../products/scorecard";
import {
  buildProductPath,
  buildGeneratedContentUrl,
  createDocumentResourceLoaders,
  getRouterBasename,
  setRuntimeDocumentTitle,
  type DocumentData,
  type LifecycleStatus,
  type PortfolioTier,
  type ProductMeta,
  type QaLevel
} from "../products/shared";

const operatorProfileUrl = "https://ywkinfo.github.io";

function trackEngagement(eventName: string, params: Record<string, string>) {
  const measurementId = getGaMeasurementId();

  if (!measurementId) {
    return;
  }

  trackGaEvent(measurementId, eventName, params);
}

function getCoverageLabel(product: ProductMeta) {
  return product.coverageType === "region" ? "권역 가이드" : "국가 가이드";
}

function getPortfolioTierLabel(portfolioTier: PortfolioTier) {
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

function getLifecycleStatusLabel(lifecycleStatus: LifecycleStatus) {
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

function joinProductLabels(
  productList: ProductMeta[],
  separator = " / "
) {
  return productList.map((product) => product.shortLabel).join(separator);
}

function orderGatewayProducts(products: ProductMeta[]) {
  const preferredOrder = ["latam", "mexico", "china", "europe", "usa", "japan", "uk"];
  const productIndex = new Map(preferredOrder.map((slug, index) => [slug, index]));

  return [...products].sort((left, right) => {
    const leftIndex = productIndex.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = productIndex.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });
}

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
  const prioritySlugs = ["china", "mexico", "europe"];

  return prioritySlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ProductMeta => Boolean(product));
}

function buildPriorityLaneStatusSummary(products: ProductMeta[]) {
  return getPriorityLaneProducts(products)
    .map(
      (product) =>
        `${product.shortLabel} ${getLifecycleStatusLabel(product.lifecycleStatus)} · QA ${getQaLevelLabel(product.qaLevel)} · gap ${product.highRiskVerificationGapCount}`
    )
    .join(" / ");
}

function buildRelatedGuideSummary(report?: ReportMeta) {
  if (!report || report.relatedGuideLinks.length === 0) {
    return "";
  }

  return report.relatedGuideLinks.map((link) => link.label).join(" · ");
}

function buildGuideTrackingParams(
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

function getTierComposition(products: ProductMeta[]) {
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

const FullDocumentLink = forwardRef<HTMLAnchorElement, FullDocumentLinkProps>(
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

function ProductGroup({ title, description, products, surface }: ProductGroupProps) {
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

function BriefIssueCard({ issue, surface }: BriefIssueCardProps) {
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

function BriefGuideLinks({
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

function ReportCard({ report, surface }: { report: ReportMeta; surface?: string }) {
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

function AppLayout() {
  const location = useLocation();
  const activeNavItemRef = useRef<HTMLAnchorElement | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const orderedNavProducts = orderGatewayProducts(liveShellProducts);
  const activeProduct = liveShellProducts.find(
    (product) =>
      location.pathname === buildProductPath(product)
      || location.pathname.startsWith(`${buildProductPath(product)}/`)
  );
  const isBriefActive =
    location.pathname === buildBriefArchivePath()
    || location.pathname.startsWith(`${buildBriefArchivePath()}/`);
  const isReportActive =
    location.pathname === buildReportArchivePath()
    || location.pathname.startsWith(`${buildReportArchivePath()}/`);
  const isGatewayActive = location.pathname === buildProductPath("/");
  const getGlobalNavClassName = (isActive: boolean) =>
    isActive ? "global-nav-link active" : "global-nav-link";

  useEffect(() => {
    activeNavItemRef.current?.scrollIntoView?.({
      block: "nearest",
      inline: "center"
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    trackEngagement(
      "guide_open",
      buildGuideTrackingParams(activeProduct, "route", {
        route_kind:
          location.pathname === buildProductPath(activeProduct)
            ? "home"
            : "reader"
      })
    );
  }, [activeProduct, location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const rootElement = document.documentElement;
    const topbarElement = topbarRef.current;

    if (!topbarElement) {
      return undefined;
    }

    const updateTopbarHeight = () => {
      rootElement.style.setProperty(
        "--global-topbar-height",
        `${topbarElement.getBoundingClientRect().height}px`
      );
    };

    updateTopbarHeight();
    window.addEventListener("resize", updateTopbarHeight);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", updateTopbarHeight);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateTopbarHeight();
    });

    resizeObserver.observe(topbarElement);

    return () => {
      window.removeEventListener("resize", updateTopbarHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="glotm-app">
      <header ref={topbarRef} className="global-topbar">
        <div className="global-topbar-brand">
          <FullDocumentLink className="global-brand" to={buildProductPath("/")}>
            GloTm
          </FullDocumentLink>
          <p className="global-tagline">인하우스 팀을 위한 cross-border trademark operating guides</p>
        </div>

        <nav className="global-nav" aria-label="제품 전환">
          <FullDocumentLink
            to={buildProductPath("/")}
            ref={isGatewayActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isGatewayActive)}
            aria-current={isGatewayActive ? "page" : undefined}
          >
            <span className="global-nav-label">Gateway</span>
          </FullDocumentLink>
          <FullDocumentLink
            to={buildBriefArchivePath()}
            ref={isBriefActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isBriefActive)}
            aria-current={isBriefActive ? "page" : undefined}
          >
            <span className="global-nav-label">Brief</span>
          </FullDocumentLink>
          <FullDocumentLink
            to={buildReportArchivePath()}
            ref={isReportActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isReportActive)}
            aria-current={isReportActive ? "page" : undefined}
          >
            <span className="global-nav-label">Report</span>
          </FullDocumentLink>
          {orderedNavProducts.map((product) => {
            const isProductActive = activeProduct?.id === product.id;

            return (
              <FullDocumentLink
                key={product.id}
                to={buildProductPath(product)}
                ref={isProductActive ? activeNavItemRef : undefined}
                className={getGlobalNavClassName(isProductActive)}
                aria-current={isProductActive ? "page" : undefined}
              >
                <span className="global-nav-label">{product.shortLabel}</span>
                <span className={`status-pill status-pill--${product.lifecycleTone}`}>
                  {getLifecycleStatusLabel(product.lifecycleStatus)}
                </span>
              </FullDocumentLink>
            );
          })}
        </nav>

        <div className="global-status-panel">
          {activeProduct ? (
            <span className="status-pill status-pill--neutral">
              {getPortfolioTierLabel(activeProduct.portfolioTier)}
            </span>
          ) : isReportActive ? (
            <span className="status-pill status-pill--neutral">
              Special Report
            </span>
          ) : isBriefActive ? (
            <span className="status-pill status-pill--neutral">
              Hot Global TM Brief
            </span>
          ) : (
            <span className="status-pill status-pill--neutral">
              4-tier operating guide portfolio
            </span>
          )}
        </div>
      </header>

      <main className="glotm-main">
        <Outlet />
      </main>
    </div>
  );
}

function GatewayLandingPage() {
  const whyLate = getIntroSection("왜 상표 이슈는 늦게 드러나는가");
  const riskPatterns = getIntroSection("사업 리스크로 전환되는 대표 패턴");
  const orderedProducts = orderGatewayProducts(liveShellProducts);
  const regionProducts = orderedProducts.filter((product) => product.coverageType === "region");
  const countryProducts = orderedProducts.filter((product) => product.coverageType === "country");
  const flagshipProducts = orderedProducts.filter((product) => product.portfolioTier === "flagship");
  const growthProducts = orderedProducts.filter((product) => product.portfolioTier === "growth");
  const validateProducts = orderedProducts.filter((product) => product.portfolioTier === "validate");
  const incubateProducts = orderedProducts.filter((product) => product.portfolioTier === "incubate");
  const regionProductCount = regionProducts.length;
  const countryProductCount = countryProducts.length;
  const liveProductCount = orderedProducts.length;
  const liveChapterCount = orderedProducts.reduce((total, product) => total + product.chapterCount, 0);
  const liveSearchEntryCount = orderedProducts.reduce(
    (total, product) => total + product.searchEntryCount,
    0
  );
  const latamProduct = orderedProducts.find((product) => product.slug === "latam") ?? orderedProducts[0];
  const mexicoProduct = orderedProducts.find((product) => product.slug === "mexico") ?? orderedProducts[0];
  const whyLateParagraphs = whyLate?.paragraphs ?? [];
  const heroTitle = "인하우스 팀을 위한 cross-border trademark operating guides";
  const heroLead = "여러 국가·권역에서 시장 우선순위, 출원 경로, 유지·집행 판단을 하나의 셸과 검색 리더 경험으로 정리합니다.";
  const heroSummaryParagraphs = [
    "검색 결과를 짜깁기하거나 일반 AI 답변을 그대로 믿기 전에, 내부 판단에 필요한 운영 질문을 빠르게 구조화할 수 있습니다.",
    "ChaTm은 Sprint 1 reader smoke QA까지 잠갔고, MexTm은 buyer next action이 바로 보이도록 잠금 4장을 마감했습니다. EuTm 안정화 이후 다음 active lane은 Report / Gateway trust layer입니다."
  ];
  const featuredBriefs = briefIssues.slice(0, 2);
  const latestBrief = getLatestBriefIssue();
  const latestReport = getLatestReport();
  const priorityLaneStatusSummary = buildPriorityLaneStatusSummary(orderedProducts);
  const latestReportGuideSummary = buildRelatedGuideSummary(latestReport);
  const latestBriefJurisdictions = latestBrief?.jurisdictions.slice(0, 4) ?? [];
  const priorityRoadmap = [
    {
      id: "china",
      title: "ChaTm Sprint 1 + reader smoke QA 완료",
      copy:
        "중국어 표기, 서브클래스, 출원 실무, 심사·집행 경로를 잠금 6장 기준으로 심화해 growth lane의 reader 밀도를 먼저 끌어올렸습니다.",
      note: "제2장, 제3장, 제5장, 제6장, 제7장, 제10장 정렬 + smoke QA 완료",
      href: buildProductPath("/china")
    },
    {
      id: "mexico",
      title: "MexTm Sprint 1 buyer-entry 심화 마감",
      copy:
        "이미 강한 baseline 위에서 buyer entry 가치가 큰 잠금 4장을 더 두껍게 만들어, 단일국가 실행 질문이 바로 보이게 정리했습니다.",
      note: "제1장, 제4장, 제11장, 제13장 정렬 + next action 메모 강화",
      href: buildProductPath("/mexico")
    },
    {
      id: "europe",
      title: "EuTm 핵심 6장 안정화 완료",
      copy:
        "범위 확대보다 문서 정합성, 권리 선택, 등록 후 사용·갱신 운영 구조를 먼저 고정해 validate lane의 core six를 안정화했습니다.",
      note: "README, Harness sync + 핵심 6장 정렬 완료",
      href: buildProductPath("/europe")
    },
    {
      id: "report-gateway",
      title: "Report / Gateway trust layer",
      copy:
        "교차 관할권 운영 판단을 Report 레인에서 설명하고, Gateway에서는 현재 우선순위와 상태를 실제 메타데이터 기준으로 잠그는 다음 active lane입니다.",
      note: "next active lane · report front placement + gateway state sync",
      href: buildReportArchivePath()
    },
    {
      id: "incubate",
      title: "Incubate 선택 유지보수",
      copy:
        "JapTm -> UKTm -> UsaTm 순서로 freshness, verification, smoke QA 위주 보강만 수행하고 대형 재작성은 뒤로 미룹니다.",
      note: "lighter track 유지",
      href: buildProductPath("/japan")
    }
  ];

  useEffect(() => {
    setRuntimeDocumentTitle();
  }, []);

  return (
    <div className="gateway-page">
      <section className="gateway-hero">
        <div className="gateway-hero-card">
          <p className="gateway-kicker">GloTm Gateway</p>
          <div className="gateway-copy-stack">
            <h1 className="gateway-title">{heroTitle}</h1>
            <p className="gateway-lead">{heroLead}</p>
            {heroSummaryParagraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? "gateway-summary" : "gateway-summary gateway-summary--supporting"}
              >
                {paragraph}
              </p>
            ))}
          </div>
          {mexicoProduct ? (
            <div className="gateway-actions">
              <FullDocumentLink
                className="gateway-button gateway-button--primary"
                to={buildProductPath(mexicoProduct)}
                onClick={() => {
                  trackEngagement("guide_cta_click", buildGuideTrackingParams(mexicoProduct, "gateway_hero"));
                }}
              >
                MexTm 먼저 보기
              </FullDocumentLink>
              {latamProduct ? (
                <FullDocumentLink
                  className="gateway-button gateway-button--secondary"
                  to={buildProductPath(latamProduct)}
                  onClick={() => {
                    trackEngagement("guide_cta_click", buildGuideTrackingParams(latamProduct, "gateway_hero"));
                  }}
                >
                  LatTm 기준 프레임 보기
                </FullDocumentLink>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="gateway-panel-card">
          <p className="gateway-kicker">Portfolio Snapshot</p>
          <div className="gateway-hero-metrics">
            <div className="gateway-metric">
              <span className="gateway-metric-label">Positioning</span>
              <strong className="gateway-metric-value">Cross-border operating guides for in-house teams</strong>
              <p className="gateway-metric-note">
                GloTm은 일반 법률 정보 사이트가 아니라, 시장 우선순위와 출원·유지·집행 판단을 돕는 운영형 포트폴리오입니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Portfolio</span>
              <strong className="gateway-metric-value">{getTierComposition(orderedProducts)}</strong>
              <p className="gateway-metric-note">
                {liveProductCount}개 live guide를 하나의 셸에서 운영하되, 투자 강도와 승격 기준은 tier별로 다르게 관리합니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Proof</span>
              <strong className="gateway-metric-value">{liveChapterCount} Chapters · {liveSearchEntryCount} Search Entries</strong>
              <p className="gateway-metric-note">
                권역형 {regionProductCount}개와 국가형 {countryProductCount}개를 운영하며, monthly health review와 scorecard로 search density, verification freshness, QA를 함께 관리합니다.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {latestBrief ? (
        <section className="latest-brief-banner" aria-label="최신 브리프 배너">
          <div className="latest-brief-banner-copy">
            <p className="gateway-kicker">Latest Brief</p>
            <h2 className="latest-brief-banner-title">{latestBrief.title}</h2>
            <p className="latest-brief-banner-summary">
              지난 1주일간 한국 기업 브랜드 보호 전략에 바로 영향을 주는 변화만 추렸습니다.
            </p>
          </div>
          <div className="latest-brief-banner-meta">
            <p className="brief-card-date">{formatBriefDate(latestBrief.publishedAt)}</p>
            <div className="brief-chip-row" aria-label="최신 브리프 관할 목록">
              {latestBriefJurisdictions.map((jurisdiction) => (
                <span key={jurisdiction} className="brief-chip">
                  {jurisdiction}
                </span>
              ))}
            </div>
          </div>
          <div className="latest-brief-banner-actions">
            <FullDocumentLink
              className="gateway-button gateway-button--primary"
              to={buildBriefIssuePath(latestBrief.slug)}
              onClick={() => {
                trackEngagement("brief_issue_open", {
                  issue_slug: latestBrief.slug,
                  surface: "gateway_banner"
                });
              }}
            >
              최신 이슈 보기
            </FullDocumentLink>
            <FullDocumentLink
              className="gateway-button gateway-button--secondary"
              to={buildBriefArchivePath()}
              onClick={() => {
                trackEngagement("brief_archive_open", {
                  surface: "gateway_banner"
                });
              }}
            >
              브리프 전체 보기
            </FullDocumentLink>
          </div>
        </section>
      ) : null}

      <section className="gateway-cta-card">
        <p className="gateway-kicker">Recommended Start</p>
        <h2 className="gateway-cta-title">LatTm과 MexTm부터 보면 전체 구조와 즉시 실행 질문이 함께 잡힙니다</h2>
        <p className="gateway-cta-copy">
          LatTm은 cross-border 우선순위의 flagship이고, MexTm은 가장 빠르게 buyer entry value를 만드는 growth guide입니다. 두 가이드에서 큰 프레임과 단일 시장 실행 질문을 함께 잡는 흐름이 가장 자연스럽습니다.
        </p>
        <div className="gateway-cta-actions">
          <a className="gateway-cta-link" href="#portfolio-focus">
            포트폴리오 우선 가이드 보기
          </a>
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header gateway-section-header--centered">
          <div>
            <p className="gateway-kicker">Why It Matters Early</p>
            <h2 className="gateway-section-title">상표 리스크는 늦게 보일수록 비싸집니다</h2>
          </div>
          <div className="gateway-section-copy-stack">
            {(
              whyLateParagraphs.length > 0
                ? [
                    "상표 문제는 사업이 커진 뒤에야 드러나는 것처럼 보이지만, 실제로는 진출 준비 단계에서 먼저 정리할수록 비용과 시행착오를 줄일 수 있습니다.",
                    "특히 멕시코와 라틴아메리카처럼 시장별 차이가 큰 지역에서는, 출원 전 판단을 늦출수록 일정과 예산, 유통 전략까지 함께 흔들릴 수 있습니다."
                  ]
                : ["상표 리스크는 발생하지 않는 것이 아니라, 사업이 본격화된 뒤 더 비싼 문제로 가시화되기 쉽습니다."]
            ).map((paragraph) => (
              <p key={paragraph} className="gateway-section-copy">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="gateway-card-grid">
          {riskPatterns?.subsections.map((pattern) => (
            <article key={pattern.title} className="gateway-card">
              <p className="gateway-kicker">Risk Pattern</p>
              <h3 className="gateway-card-title">{pattern.title}</h3>
              {pattern.paragraphs.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className="gateway-card-copy">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">What GloTm Solves</p>
            <h2 className="gateway-section-title">시장 우선순위, 출원 경로, 유지·집행 판단을 한 번에 묶습니다</h2>
          </div>
          <p className="gateway-section-copy">GloTm은 법률 자문을 대체하려는 서비스가 아니라, 자문 전에 내부 팀이 어떤 순서로 판단하고 어떤 질문을 준비해야 하는지 정리하도록 돕는 운영 가이드 포트폴리오입니다.</p>
        </div>
        <p className="gateway-section-copy">
          국가별 제도를 백과사전처럼 늘어놓는 대신, 출원 경로, 검색과 충돌 위험, 증거와 사용 관리, 플랫폼·세관·분쟁 대응까지 운영 흐름으로 묶어 보여줍니다.
        </p>
        <ul className="gateway-bullet-list">
          {[
            "어느 시장부터 먼저 들어가고 출원할지 우선순위를 잡을 수 있습니다",
            "어떤 출원 경로와 준비 질문이 필요한지 빠르게 정리할 수 있습니다",
            "유지, 증거, 플랫폼, 집행까지 이어지는 운영 흐름을 한 번에 볼 수 있습니다",
            "외부 자문 전에 내부 판단과 질문을 구조화할 수 있습니다"
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Latest Brief</p>
            <h2 className="gateway-section-title">지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 빠르게 정리합니다</h2>
          </div>
          <p className="gateway-section-copy">
            Hot Global TM Brief는 해외 상표 뉴스를 길게 모아두는 피드가 아니라, 한국 기업이 이번 주 먼저 확인해야 할 브랜드 이슈 하나를 골라 짧고 밀도 있게 해설하는 운영 브리프입니다.
          </p>
        </div>
        <p className="gateway-section-copy">
          배경 뉴스 요약에 그치지 않고, 왜 중요한지와 기업이 지금 바로 점검할 방어 포인트까지 함께 보여드립니다.
        </p>
        <p className="gateway-section-copy gateway-section-copy--spaced">
          위조, 모방, 상표 선점, 플랫폼 대응처럼 한국 브랜드의 신뢰와 매출에 직접 영향을 주는 주제를 중심으로 다룹니다.
        </p>
        <div className="gateway-cta-actions">
          <FullDocumentLink
            className="gateway-cta-link"
            to={buildBriefArchivePath()}
            onClick={() => {
              trackEngagement("brief_archive_open", {
                surface: "gateway_section"
              });
            }}
          >
            브리프 전체 보기
          </FullDocumentLink>
          {latestBrief ? (
            <FullDocumentLink
              className="gateway-cta-link gateway-cta-link--secondary"
              to={buildBriefIssuePath(latestBrief.slug)}
              onClick={() => {
                trackEngagement("brief_issue_open", {
                  issue_slug: latestBrief.slug,
                  surface: "gateway_section"
                });
              }}
            >
              이번 주 브리프 보기
            </FullDocumentLink>
          ) : null}
        </div>
        <div className="brief-card-grid">
          {featuredBriefs.map((issue) => (
            <BriefIssueCard key={issue.slug} issue={issue} surface="gateway" />
          ))}
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Special Report</p>
            <h2 className="gateway-section-title">교차 관할권 운영 판단은 Report 레인에서 따로 다룹니다</h2>
          </div>
          <p className="gateway-section-copy">
            guide가 국가별 실행 맥락을 정리하고 brief가 주간 이슈를 빠르게 해설한다면, report는 여러 시장에 공통으로 반복되는 운영 질문을 한 문서로 구조화하는 레인입니다.
          </p>
        </div>
        <p className="gateway-section-copy">
          사용 증거, 플랫폼 대응, 긴급 의사결정처럼 한 국가만 봐서는 답이 약해지는 주제는 report에서 먼저 큰 구조를 잡고, 필요할 때 각 guide의 실행 맥락으로 이어서 보는 편이 가장 자연스럽습니다.
        </p>
        {latestReportGuideSummary ? (
          <p className="gateway-section-copy gateway-section-copy--spaced">
            현재 front report인 {latestReport?.title}은 {latestReportGuideSummary}와 바로 이어 읽히도록 배치해, 공통 운영 질문이 guide 바깥에서 따로 놀지 않게 잠그는 다음 active 레인으로 두고 있습니다.
          </p>
        ) : null}
        <ul className="gateway-bullet-list">
          <li>{"현재 우선순위: ChaTm -> MexTm -> EuTm 정렬 완료, 다음은 Report / Gateway trust layer"}</li>
          <li>현재 우선 레인 상태: {priorityLaneStatusSummary}</li>
        </ul>
        <div className="gateway-cta-actions">
          <FullDocumentLink
            className="gateway-cta-link"
            to={buildReportArchivePath()}
            onClick={() => {
              trackEngagement("report_archive_open", {
                surface: "gateway_section"
              });
            }}
          >
            리포트 전체 보기
          </FullDocumentLink>
          {latestReport ? (
            <FullDocumentLink
              className="gateway-cta-link gateway-cta-link--secondary"
              to={buildReportPath(latestReport.slug)}
              onClick={() => {
                trackEngagement("report_open", {
                  report_slug: latestReport.slug,
                  surface: "gateway_section"
                });
              }}
            >
              최신 리포트 보기
            </FullDocumentLink>
          ) : null}
        </div>
        {latestReport ? (
          <div className="brief-card-grid">
            <ReportCard report={latestReport} surface="gateway_section" />
          </div>
        ) : null}
      </section>

      <section id="portfolio-focus" className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Portfolio Focus</p>
            <h2 className="gateway-section-title">포트폴리오를 flagship, growth, validate, incubate로 운영합니다</h2>
          </div>
          <p className="gateway-section-copy">
            모든 guide는 하나의 셸에서 열리지만, 투자 강도와 승격 기준은 tier별로 다르게 운영합니다. 신규 시장 추가보다 기존 포트폴리오의 freshness, density, QA 정렬을 먼저 끌어올립니다.
          </p>
        </div>
        <div className="product-group-stack">
          {flagshipProducts.length > 0 ? (
            <ProductGroup
              title="Flagship"
              description="LatTm은 cross-border 우선순위와 운영 흐름의 기준 제품입니다. 신규 시장 확장보다 freshness, search density, reader QA를 먼저 높입니다."
              products={flagshipProducts}
              surface="portfolio_flagship"
            />
          ) : null}
          {growthProducts.length > 0 ? (
            <ProductGroup
              title="Growth"
              description="ChaTm 잠금 6장과 MexTm 잠금 4장의 buyer-facing 정렬을 마친 성장 트랙입니다. 다음 판단은 이 결과를 Report/Gateway trust layer에서 어떻게 보여 줄지로 이어집니다."
              products={growthProducts}
              surface="portfolio_growth"
            />
          ) : null}
          {validateProducts.length > 0 ? (
            <ProductGroup
              title="Validate"
              description="EuTm은 범위 확대보다 docs sync와 EU/UK 기준선 고정을 우선하는 권역 validate 가이드이며, core six 안정화까지 마친 상태입니다."
              products={validateProducts}
              surface="portfolio_validate"
            />
          ) : null}
          {incubateProducts.length > 0 ? (
            <ProductGroup
              title="Incubate"
              description={`${joinProductLabels(incubateProducts, " · ")}은 verification refresh, 문서 정합성, smoke QA를 우선하는 lighter track입니다.`}
              products={incubateProducts}
              surface="portfolio_incubate"
            />
          ) : null}
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Current Build Order</p>
            <h2 className="gateway-section-title">지금은 가장 얇은 가이드보다 가장 가치가 빨리 커지는 레인부터 보강합니다</h2>
          </div>
          <p className="gateway-section-copy">
            현재 정렬 기준은 `buyer impact + 포트폴리오 전략 + 실제 콘텐츠 밀도 부족`입니다. 그래서 growth와 validate 레인의 체감 가치를 먼저 키우고, incubate 레인은 가볍게 유지합니다.
          </p>
        </div>
        <div className="gateway-card-grid">
          {priorityRoadmap.map((lane, index) => (
            <article key={lane.id} className="gateway-card">
              <p className="gateway-kicker">Priority {index + 1}</p>
              <h3 className="gateway-card-title">{lane.title}</h3>
              <p className="gateway-card-copy">{lane.copy}</p>
              <p className="gateway-card-copy">{lane.note}</p>
              <FullDocumentLink
                className="gateway-cta-link"
                to={lane.href}
                onClick={() => {
                  trackEngagement("priority_cta_click", {
                    priority_lane: lane.id,
                    target_path: lane.href
                  });
                }}
              >
                자세히 보기
              </FullDocumentLink>
            </article>
          ))}
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">운영자 소개</p>
            <h2 className="gateway-section-title">20년+ 상표 실무 경험을 바탕으로 먼저 봐야 할 판단을 정리합니다</h2>
          </div>
        </div>
        <p className="gateway-section-copy">
          GloTm은 해외 진출 과정에서 무엇을 먼저 확인하고 어떤 운영 판단을 준비해야 하는지를, 20년 이상 축적된 상표 실무 경험을 바탕으로 구조화한 cross-border operating guide portfolio입니다.
        </p>
        <p className="gateway-section-copy">
          지금은 LatTm flagship을 보호하면서, ChaTm·MexTm growth lane과 EuTm validate stabilization을 정렬했고, 다음으로 Report / Gateway trust layer에서 buyer-facing 설명을 현재 truth에 맞추는 데 집중하고 있습니다.
        </p>
        <p className="gateway-section-copy gateway-section-copy--spaced">
          문의, 강연 요청, 심층 연구 안내는{" "}
          <a
            className="gateway-inline-link"
            href={operatorProfileUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => {
              trackEngagement("operator_link_click", {
                surface: "gateway_operator_section"
              });
            }}
          >
            ywkinfo.github.io
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </section>

      <footer className="gateway-copyright">
        <p>© 2026 GloTm. All rights reserved.</p>
      </footer>
    </div>
  );
}

function BriefArchivePage() {
  useEffect(() => {
    setRuntimeDocumentTitle("Hot Global TM Brief");
  }, []);

  const latestIssue = getLatestBriefIssue();

  return (
    <div className="gateway-page">
      <section className="brief-hero">
        <div className="brief-hero-card">
          <p className="gateway-kicker">Hot Global TM Brief</p>
          <h1 className="gateway-title">지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 해설합니다</h1>
          <p className="gateway-lead">
            속보를 많이 모으는 대신, 글로벌 시장에서 한국 기업 브랜드에 직접 영향을 주는 뉴스 하나를 골라 짧고 밀도 있게 분석하는 주간 브리프 아카이브입니다.
          </p>
          <p className="gateway-summary">
            정책은 배경으로 두고, 기업이 지금 무엇을 먼저 점검하고 어떻게 방어 체계를 설계해야 하는지에 초점을 맞춥니다.
          </p>
          <div className="gateway-actions">
            {latestIssue ? (
              <FullDocumentLink
                className="gateway-button gateway-button--primary"
                to={buildBriefIssuePath(latestIssue.slug)}
                onClick={() => {
                  trackEngagement("brief_issue_open", {
                    issue_slug: latestIssue.slug,
                    surface: "archive_hero"
                  });
                }}
              >
                최신 이슈 보기
              </FullDocumentLink>
            ) : null}
            <FullDocumentLink className="gateway-button gateway-button--secondary" to={buildProductPath("/")}>
              Gateway로 돌아가기
            </FullDocumentLink>
          </div>
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Archive</p>
            <h2 className="gateway-section-title">최신순으로 브리프 이슈를 모아 둡니다</h2>
          </div>
          <p className="gateway-section-copy">
            각 이슈는 지난 1주일간 가장 중요한 한국 기업 브랜드 이슈 하나를 골라, 왜 중요한지와 기업이 바로 점검할 항목을 함께 정리합니다.
          </p>
        </div>
        <div className="brief-card-grid">
          {briefIssues.map((issue) => (
            <BriefIssueCard key={issue.slug} issue={issue} surface="archive" />
          ))}
        </div>
      </section>
    </div>
  );
}

function BriefIssuePage() {
  const params = useParams<{ issueSlug: string }>();
  const issue = params.issueSlug ? getBriefIssueBySlug(params.issueSlug) : undefined;

  useEffect(() => {
    if (!issue) {
      return;
    }

    setRuntimeDocumentTitle(issue.title);
  }, [issue]);

  if (!issue) {
    return <Navigate to={buildBriefArchivePath()} replace />;
  }

  return (
    <div className="gateway-page">
      <section className="brief-issue-shell">
        <div className="brief-breadcrumb">
          <FullDocumentLink to={buildProductPath("/")}>Gateway</FullDocumentLink>
          <span>/</span>
          <FullDocumentLink to={buildBriefArchivePath()}>Hot Global TM Brief</FullDocumentLink>
        </div>
        <div className="brief-issue-header">
          <p className="gateway-kicker">Issue</p>
          <p className="brief-card-date">{formatBriefDate(issue.publishedAt)}</p>
          <h1 className="gateway-title">{issue.title}</h1>
          <p className="gateway-lead">{issue.summary}</p>
          <div className="brief-chip-row" aria-label="관할 목록">
            {issue.jurisdictions.map((jurisdiction) => (
              <span key={jurisdiction} className="brief-chip">
                {jurisdiction}
              </span>
            ))}
          </div>
          <p className="brief-issue-note">
            이 브리프는 법률 자문이 아니라, 이번 주 기업이 무엇을 먼저 확인하고 어떤 방어 체계를 점검해야 하는지 정리하는 운영 메모입니다.
          </p>
        </div>

        {issue.bodyParagraphs?.length ? (
          <div className="brief-article-body">
            {issue.bodyParagraphs.map((paragraph) => (
              <p key={paragraph} className="brief-article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        <div className="brief-item-stack">
          {issue.items.map((item, index) => (
            <article key={item.id} className="brief-item-card">
              <div className="brief-item-header">
                <span className="brief-item-index">{index + 1}</span>
                <div>
                  <h2 className="brief-item-title">{item.headline}</h2>
                  <p className="brief-item-copy">{item.whatChanged}</p>
                </div>
              </div>
              <div className="brief-item-grid">
                <section>
                  <h3 className="brief-item-label">누가 신경 써야 하는가</h3>
                  <p className="brief-item-copy">{item.whoShouldCare}</p>
                </section>
                <section>
                  <h3 className="brief-item-label">실무 영향</h3>
                  <p className="brief-item-copy">{item.whyItMatters}</p>
                </section>
                <section>
                  <h3 className="brief-item-label">지금 체크할 것</h3>
                  <p className="brief-item-copy">{item.nextAction}</p>
                </section>
              </div>
              <div>
                <h3 className="brief-item-label">관련 GloTm 가이드</h3>
                <BriefGuideLinks issue={issue} itemId={item.id} links={item.relatedGuideLinks} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportArchivePage() {
  const latestReport = getLatestReport();
  const orderedProducts = orderGatewayProducts(liveShellProducts);
  const priorityLaneStatusSummary = buildPriorityLaneStatusSummary(orderedProducts);
  const latestReportGuideSummary = buildRelatedGuideSummary(latestReport);

  useEffect(() => {
    setRuntimeDocumentTitle("Special Report");
  }, []);

  return (
    <div className="gateway-page">
      <section className="brief-hero">
        <div className="brief-hero-card">
          <p className="gateway-kicker">Special Report</p>
          <h1 className="gateway-title">개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트</h1>
          <p className="gateway-lead">
            특정 국가 하나의 절차 요약보다, 여러 관할에서 반복해서 부딪히는 운영 질문을 한 문서로 정리하는 심화 리포트 아카이브입니다.
          </p>
          <p className="gateway-summary">
            가이드가 국가별 실행 맥락을 정리한다면, 리포트는 사용 증거, 플랫폼 대응, 긴급 의사결정처럼 교차 관할권 문제를 별도 레인으로 묶어 보여줍니다.
          </p>
          <p className="gateway-summary gateway-summary--supporting">
            ChaTm·MexTm·EuTm의 buyer-facing 밀도 정렬을 마쳤고, report는 {latestReportGuideSummary || "관련 live guide"}에 공통으로 걸리는 운영 질문을 front placement하는 다음 active 레인입니다. 현재 우선 레인 상태는 {priorityLaneStatusSummary}입니다.
          </p>
          <div className="gateway-actions">
            {latestReport ? (
              <FullDocumentLink className="gateway-button gateway-button--primary" to={buildReportPath(latestReport.slug)}>
                최신 리포트 보기
              </FullDocumentLink>
            ) : null}
            <FullDocumentLink className="gateway-button gateway-button--secondary" to={buildProductPath("/")}>
              Gateway로 돌아가기
            </FullDocumentLink>
          </div>
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Archive</p>
            <h2 className="gateway-section-title">최신순으로 스페셜 리포트를 모아 둡니다</h2>
          </div>
          <p className="gateway-section-copy">
            각 리포트는 특정 국가 하나를 길게 요약하기보다, 여러 시장에서 공통으로 반복되는 운영 질문을 먼저 구조화하고 관련 guide로 바로 이어지게 만듭니다.
          </p>
        </div>
        <div className="brief-card-grid">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} surface="report_archive" />
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportPage() {
  const params = useParams<{ reportSlug: string }>();
  const report = params.reportSlug ? getReportBySlug(params.reportSlug) : undefined;
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const resourceLoaders = useMemo(() => {
    if (!report) {
      return null;
    }

    const reportContentSlug = `reports/${report.slug}`;

    return createDocumentResourceLoaders(
      buildGeneratedContentUrl(reportContentSlug, "document-data.json"),
      buildGeneratedContentUrl(reportContentSlug, "search-index.json")
    );
  }, [report]);

  useEffect(() => {
    if (!report) {
      return;
    }

    setRuntimeDocumentTitle(report.title);
  }, [report]);

  useEffect(() => {
    if (!resourceLoaders) {
      return;
    }

    let isCancelled = false;

    setDocumentData(null);
    setLoadError(null);

    resourceLoaders.loadDocumentData()
      .then((nextDocumentData) => {
        if (!isCancelled) {
          setDocumentData(nextDocumentData);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "리포트 데이터를 불러오지 못했습니다."
          );
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [resourceLoaders]);

  if (!report) {
    return <Navigate to={buildReportArchivePath()} replace />;
  }

  if (loadError) {
    return (
      <StatusPage
        kicker="Special Report"
        title="리포트를 불러오지 못했습니다"
        message={loadError}
      />
    );
  }

  if (!documentData) {
    return (
      <StatusPage
        kicker="Special Report"
        title="리포트를 준비하고 있습니다"
        message="리포트 데이터를 불러오는 중입니다."
      />
    );
  }

  const chapter = documentData.chapters[0];

  if (!chapter) {
    return (
      <StatusPage
        kicker="Special Report"
        title="리포트를 불러오지 못했습니다"
        message="리포트 본문이 비어 있습니다."
      />
    );
  }

  return (
    <div className="gateway-page">
      <section className="brief-issue-shell">
        <div className="brief-breadcrumb">
          <FullDocumentLink to={buildProductPath("/")}>Gateway</FullDocumentLink>
          <span>/</span>
          <FullDocumentLink to={buildReportArchivePath()}>Special Report</FullDocumentLink>
        </div>
        <div className="brief-issue-header">
          <p className="gateway-kicker">Special Report</p>
          <p className="brief-card-date">{formatReportDate(report.publishedAt)}</p>
          <h1 className="gateway-title">{report.title}</h1>
          <p className="gateway-lead">{report.summary}</p>
          <div className="brief-chip-row" aria-label="리포트 관할 목록">
            {report.jurisdictions.map((jurisdiction) => (
              <span key={jurisdiction} className="brief-chip">
                {jurisdiction}
              </span>
            ))}
          </div>
          <p className="brief-issue-note">
            이 리포트는 특정 국가의 절차 요약보다, 여러 관할에서 공통으로 반복되는 운영 판단과 문서 체계를 먼저 정리하는 심화 문서입니다.
          </p>
        </div>

        <MarkdownArticle chapter={chapter} />

        <div className="brief-item-stack">
          <article className="brief-item-card">
            <div className="brief-item-header">
              <span className="brief-item-index">↗</span>
              <div>
                <h2 className="brief-item-title">관련 GloTm 가이드</h2>
                <p className="brief-item-copy">
                  리포트에서 정리한 판단을 각 관할 guide의 실제 실행 맥락으로 바로 이어서 볼 수 있습니다.
                </p>
              </div>
            </div>
            <div className="brief-link-row">
              {report.relatedGuideLinks.map((link) => (
                <FullDocumentLink key={link.href} className="brief-guide-link" to={link.href}>
                  {link.label}
                </FullDocumentLink>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const measurementId = getGaMeasurementId();

    if (!measurementId) {
      return;
    }

    initializeGa(measurementId);
  }, []);

  useEffect(() => {
    const measurementId = getGaMeasurementId();

    if (!measurementId || typeof window === "undefined") {
      return undefined;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    const timeoutId = window.setTimeout(() => {
      trackGaPageView(measurementId, pagePath, document.title);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export function AppRoutes() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<GatewayLandingPage />} />
          <Route path={buildBriefArchivePath().replace(/^\//, "")} element={<BriefArchivePage />} />
          <Route path={`${buildBriefArchivePath().replace(/^\//, "")}/:issueSlug`} element={<BriefIssuePage />} />
          <Route path={buildReportArchivePath().replace(/^\//, "")} element={<ReportArchivePage />} />
          <Route path={`${buildReportArchivePath().replace(/^\//, "")}/:reportSlug`} element={<ReportPage />} />
          {liveShellReaderEntries.map(({ product, ReaderRoot, HomePage, ChapterPage }) => (
            <Route
              key={product.slug}
              path={buildProductPath(product).replace(/^\//, "")}
              element={<ReaderRoot />}
            >
              <Route index element={<HomePage />} />
              <Route path="chapter/:chapterSlug" element={<ChapterPage />} />
            </Route>
          ))}
          <Route path="*" element={<Navigate to={buildProductPath("/")} replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <AppRoutes />
    </BrowserRouter>
  );
}
