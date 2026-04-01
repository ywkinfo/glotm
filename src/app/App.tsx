import {
  forwardRef,
  useEffect,
  useRef,
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
  liveShellProducts
} from "../products/registry";
import { liveShellReaderEntries } from "../products/liveShellReaders";
import {
  buildProductPath,
  getRouterBasename,
  setRuntimeDocumentTitle,
  type ProductMeta
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
  const preferredOrder = ["mexico", "latam", "usa", "japan", "china", "europe", "uk"];
  const productIndex = new Map(preferredOrder.map((slug, index) => [slug, index]));

  return [...products].sort((left, right) => {
    const leftIndex = productIndex.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = productIndex.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return leftIndex - rightIndex;
  });
}

function getProductCardCtaClass(product: ProductMeta) {
  return product.slug === "latam" || product.slug === "mexico"
    ? "product-card-link"
    : "product-card-link product-card-link--secondary";
}

function getProductCardClass(product: ProductMeta) {
  return product.slug === "latam" || product.slug === "mexico"
    ? "product-card product-card--focus"
    : "product-card";
}

function getProductCardCtaLabel(product: ProductMeta) {
  if (product.slug === "mexico") {
    return "MexTm 먼저 보기";
  }

  if (product.slug === "latam") {
    return "LatTm 전체 흐름 보기";
  }

  return product.primaryCtaLabel;
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

function ProductCard({ product }: { product: ProductMeta }) {
  return (
    <article className={getProductCardClass(product)}>
      <div className="product-card-topline">
        <p className="gateway-kicker">{product.shortLabel}</p>
        <span className={`status-pill status-pill--${product.statusTone}`}>
          {product.status}
        </span>
      </div>
      <div>
        <span className="product-card-stage">
          {getCoverageLabel(product)} · {getAvailabilityLabel(product)}
        </span>
        <p className="product-card-metrics">
          총 {product.chapterCount}개 챕터 · 검색 {product.searchEntryCount}개 엔트리
        </p>
        <h3 className="product-card-title">{product.title}</h3>
      </div>
      <p className="product-card-copy">{product.summary}</p>
      {product.maturityNote ? (
        <p className="product-card-note">{product.maturityNote}</p>
      ) : null}
      <p className="product-card-audience">대상: {product.audience}</p>
      <div className="product-card-actions">
        <FullDocumentLink className={getProductCardCtaClass(product)} to={buildProductPath(product)}>
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
};

function ProductGroup({ title, description, products }: ProductGroupProps) {
  return (
    <div className="product-group">
      <div className="product-group-header">
        <h3 className="product-group-title">{title}</h3>
        <p className="product-group-copy">{description}</p>
      </div>
      <div className="product-card-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
          <p className="global-tagline">해외 진출 브랜드를 위한 글로벌 상표 지식베이스 파일럿</p>
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
                <span className={`status-pill status-pill--${product.statusTone}`}>
                  {product.status}
                </span>
              </FullDocumentLink>
            );
          })}
        </nav>

        <div className="global-status-panel">
          {activeProduct ? (
            <span className={`status-pill status-pill--${activeProduct.statusTone}`}>
              {activeProduct.stageLabel}
            </span>
          ) : isBriefActive ? (
            <span className="status-pill status-pill--neutral">
              Hot Global TM Brief
            </span>
          ) : (
            <span className="status-pill status-pill--neutral">
              라이브 {liveShellProducts.length}개 가이드
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
  const pilotScope = getIntroSection("현재 파일럿 범위");
  const regionProducts = liveShellProducts.filter((product) => product.coverageType === "region");
  const countryProducts = liveShellProducts.filter((product) => product.coverageType === "country");
  const regionProductCount = regionProducts.length;
  const countryProductCount = countryProducts.length;
  const liveProductCount = liveShellProducts.length;
  const liveChapterCount = liveShellProducts.reduce((total, product) => total + product.chapterCount, 0);
  const liveSearchEntryCount = liveShellProducts.reduce(
    (total, product) => total + product.searchEntryCount,
    0
  );
  const latamProduct = liveShellProducts.find((product) => product.slug === "latam") ?? liveShellProducts[0];
  const mexicoProduct = liveShellProducts.find((product) => product.slug === "mexico") ?? liveShellProducts[0];
  const ukEarlyTrackProduct = countryProducts.find((product) => product.slug === "uk");
  const coreCountryProducts = countryProducts.filter((product) => product.slug !== "uk");
  const focusProducts = [mexicoProduct, latamProduct].filter(
    (product): product is ProductMeta => Boolean(product)
  );
  const supportingRegionProducts = regionProducts.filter(
    (product) => product.slug !== "latam" && product.slug !== "mexico"
  );
  const supportingCountryProducts = countryProducts.filter(
    (product) => product.slug !== "mexico" && product.slug !== "latam"
  );
  const liveProductCommaList = liveShellProducts.map((product) => product.shortLabel).join(", ");
  const whyLateParagraphs = whyLate?.paragraphs ?? [];
  const heroTitle = "중남미 진출 전, 상표 출원 판단을 먼저 정리하세요";
  const heroLead = "로펌에 바로 묻기 전에, 멕시코와 라틴아메리카 시장에서 무엇을 먼저 확인해야 하는지 구조적으로 정리할 수 있습니다.";
  const heroSummaryParagraphs = [
    "검색 결과를 여기저기 모으거나 일반적인 AI 답변을 그대로 믿기 어려운 담당자를 위해 만든 실무 가이드입니다.",
    "지금은 LatTm과 MexTm을 중심으로 가장 중요한 의사결정 흐름부터 빠르게 확인할 수 있고, 다른 시장 가이드는 후속 확장 방향을 함께 보여줍니다."
  ];
  const featuredBriefs = briefIssues.slice(0, 2);
  const latestBrief = getLatestBriefIssue();
  const latestBriefJurisdictions = latestBrief?.jurisdictions.slice(0, 4) ?? [];

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
              >
                MexTm 먼저 보기
              </FullDocumentLink>
              {latamProduct ? (
                <FullDocumentLink
                  className="gateway-button gateway-button--secondary"
                  to={buildProductPath(latamProduct)}
                >
                  LatTm에서 전체 흐름 보기
                </FullDocumentLink>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="gateway-panel-card">
          <p className="gateway-kicker">Pilot Snapshot</p>
          <div className="gateway-hero-metrics">
            <div className="gateway-metric">
              <span className="gateway-metric-label">Flow</span>
              <strong className="gateway-metric-value">중남미 프레임 → 멕시코 심화 → 시장별 확장</strong>
              <p className="gateway-metric-note">
                현재는 LatTm과 MexTm을 중심으로 읽기 흐름을 시작하고, 필요한 시장으로 이어서 내려가는 구성이 가장 자연스럽습니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Portfolio</span>
              <strong className="gateway-metric-value">{liveProductCount} Live Guides</strong>
              <p className="gateway-metric-note">
                라틴아메리카 기준 제품과 멕시코 심화 트랙을 우선 제공하고, 다른 시장 가이드는 확장 포트폴리오로 함께 연결합니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Proof</span>
              <strong className="gateway-metric-value">{liveChapterCount} Chapters · {liveSearchEntryCount} Search Entries</strong>
              <p className="gateway-metric-note">
                권역형 {regionProductCount}개와 국가형 {countryProductCount}개를 하나의 셸에서 운영하며, 현재는 실제 읽기 경험과 탐색 흐름을 먼저 검증하고 있습니다.
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
        <p className="gateway-kicker">Suggested Reading Flow</p>
        <h2 className="gateway-cta-title">처음이라면 MexTm 또는 LatTm부터 시작하세요</h2>
        <p className="gateway-cta-copy">
          멕시코 진출 검토가 가장 급하다면 MexTm에서 바로 실무 쟁점을 확인하고, 중남미 전체 우선순위를 먼저 잡고 싶다면 LatTm에서 시작하는 구성이 가장 자연스럽습니다.
        </p>
        <div className="gateway-cta-actions">
          <a className="gateway-cta-link" href="#current-pilot-scope">
            LatTm/MexTm 중심으로 보기
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
            <h2 className="gateway-section-title">법률 자문 전에 필요한 판단의 빈칸을 메웁니다</h2>
          </div>
          <p className="gateway-section-copy">GloTm은 법률 자문을 대체하려는 서비스가 아니라, 법률 자문 전에 무엇을 먼저 판단하고 어떤 질문을 준비해야 하는지 정리하도록 돕는 운영 가이드입니다.</p>
        </div>
        <p className="gateway-section-copy">
          국가별 제도를 단순히 설명하는 대신, 출원 경로, 검색과 충돌 위험, 증거와 사용 관리, 이후 운영 흐름까지 실무 기준으로 묶어 보여줍니다.
        </p>
        <ul className="gateway-bullet-list">
          {[
            "어느 시장부터 먼저 출원할지 우선순위를 잡을 수 있습니다",
            "멕시코와 라틴아메리카 시장에서 어떤 위험을 먼저 봐야 하는지 정리할 수 있습니다",
            "외부 자문 전에 내부 판단과 질문을 구조화할 수 있습니다",
            "검색, 유지, 증거, 분쟁까지 운영 흐름을 한 번에 볼 수 있습니다"
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

      <section id="current-pilot-scope" className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Current Pilot Scope</p>
            <h2 className="gateway-section-title">지금은 LatTm과 MexTm을 중심으로 파일럿을 검증하고 있습니다</h2>
          </div>
          <p className="gateway-section-copy">
            {pilotScope?.paragraphs[0]
              ?? `현재 GloTm에는 ${liveProductCommaList}이 모두 루트 셸에 연결되어 있지만, 실제 파일럿의 중심은 LatTm과 MexTm입니다. 다른 시장 가이드는 포트폴리오의 확장 방향과 구조적 신뢰를 보여주는 보조 트랙으로 함께 탐색할 수 있습니다.`}
          </p>
        </div>
        <div className="product-group-stack">
          <ProductGroup
            title="지금 가장 먼저 볼 가이드"
            description="MexTm은 가장 급한 단일 시장 판단을 바로 돕고, LatTm은 중남미 전체 우선순위와 운영 흐름을 먼저 잡는 기준 제품입니다."
            products={focusProducts}
          />
          {supportingRegionProducts.length > 0 ? (
            <ProductGroup
              title="추가 권역 가이드"
              description="EuTm은 권역 단위에서 어떤 시장부터 보고 어떤 운영 순서로 접근할지 큰 프레임을 확장해서 비교할 때 함께 읽는 가이드입니다."
              products={supportingRegionProducts}
            />
          ) : null}
          {supportingCountryProducts.length > 0 ? (
            <ProductGroup
              title="후속 시장 검토용 국가 가이드"
              description={
                ukEarlyTrackProduct
                  ? `${joinProductLabels(coreCountryProducts.filter((product) => product.slug !== "mexico"), " · ")}은 후속 시장 검토용 단일국가 가이드로 연결합니다. ${ukEarlyTrackProduct.shortLabel}은 draft 공개본 성격의 early track으로 함께 제공합니다.`
                  : `${joinProductLabels(supportingCountryProducts, " · ")}은 후속 시장 검토용 단일국가 가이드로 연결합니다.`
              }
              products={supportingCountryProducts}
            />
          ) : null}
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
          GloTm은 해외 진출 과정에서 무엇을 먼저 확인하고 어떤 운영 판단을 준비해야 하는지를, 20년 이상 축적된 상표 실무 경험을 바탕으로 실무 중심으로 정리한 가이드입니다.
        </p>
        <p className="gateway-section-copy">
          지금은 중남미와 멕시코 진출 준비 단계에서 가장 자주 부딪히는 질문부터 구조적으로 풀어내는 데 집중하고 있습니다.
        </p>
        <p className="gateway-section-copy gateway-section-copy--spaced">
          문의, 강연 요청, 심층 연구 안내는{" "}
          <a
            className="gateway-inline-link"
            href={operatorProfileUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            ywkinfo.github.io
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </section>
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
