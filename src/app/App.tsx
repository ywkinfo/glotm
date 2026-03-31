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
  useHref,
  useLocation
} from "react-router-dom";

import { getIntroSection, introDocument } from "../content/intro";
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

function getProductCardCtaClass(product: ProductMeta) {
  return product.coverageType === "region"
    ? "product-card-link"
    : "product-card-link product-card-link--secondary";
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
    <article className="product-card">
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
          {product.primaryCtaLabel}
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

function AppLayout() {
  const location = useLocation();
  const activeNavItemRef = useRef<HTMLAnchorElement | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const activeProduct = liveShellProducts.find(
    (product) =>
      location.pathname === buildProductPath(product)
      || location.pathname.startsWith(`${buildProductPath(product)}/`)
  );
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
          {liveShellProducts.map((product) => {
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
  const productIntent = getIntroSection("GloTm은 무엇을 하려는가");
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
  const primaryProduct = liveShellProducts.find((product) => product.slug === "latam") ?? liveShellProducts[0];
  const liveProductSlashList = joinProductLabels(liveShellProducts);
  const liveProductCommaList = liveShellProducts.map((product) => product.shortLabel).join(", ");
  const liveProductDotList = joinProductLabels(liveShellProducts, " · ");
  const introSummaryParagraphs = introDocument.quote.slice(1, 3);
  const whyLateParagraphs = whyLate?.paragraphs ?? [];

  useEffect(() => {
    setRuntimeDocumentTitle();
  }, []);

  return (
    <div className="gateway-page">
      <section className="gateway-hero">
        <div className="gateway-hero-card">
          <p className="gateway-kicker">GloTm Gateway</p>
          <div className="gateway-copy-stack">
            <h1 className="gateway-title">{introDocument.title}</h1>
            <p className="gateway-lead">
              {introDocument.quote[0]
                ?? "해외 진출 단계에서 상표 이슈가 언제 사업 리스크로 커지는지, 그리고 로펌 연결 전에 무엇을 먼저 판단해야 하는지를 정리한 관문 랜딩입니다."}
            </p>
            {introSummaryParagraphs.map((paragraph) => (
              <p key={paragraph} className="gateway-summary">
                {paragraph}
              </p>
            ))}
          </div>
          {primaryProduct ? (
            <div className="gateway-actions">
              <FullDocumentLink
                className="gateway-button gateway-button--primary"
                to={buildProductPath(primaryProduct)}
              >
                {primaryProduct.primaryCtaLabel}
              </FullDocumentLink>
            </div>
          ) : null}
        </div>

        <aside className="gateway-panel-card">
          <p className="gateway-kicker">Live Portfolio</p>
          <div className="gateway-hero-metrics">
            <div className="gateway-metric">
              <span className="gateway-metric-label">Flow</span>
              <strong className="gateway-metric-value">
                {`GloTm → ${liveProductSlashList}`}
              </strong>
              <p className="gateway-metric-note">
                현재 루트 셸에서 {liveProductCount}개 가이드를 모두 직접 열 수 있습니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Portfolio</span>
              <strong className="gateway-metric-value">{liveProductCount} Live Guides</strong>
              <p className="gateway-metric-note">
                권역형 {regionProductCount}개와 단일국가형 {countryProductCount}개를 하나의 셸에서 함께 관리합니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Coverage</span>
              <strong className="gateway-metric-value">
                {regionProductCount} Regional + {countryProductCount} Country
              </strong>
              <p className="gateway-metric-note">
                권역형은 {joinProductLabels(regionProducts, " · ")}, 국가형은 {joinProductLabels(countryProducts, " · ")}으로 구분됩니다.
              </p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Current Status</span>
              <strong className="gateway-metric-value">
                {liveProductCount} Live Guides
              </strong>
              <p className="gateway-metric-note">
                현재 라이브 포트폴리오는 {liveProductDotList}로 구성됩니다.
              </p>
              <p className="gateway-metric-note">
                운영 메타데이터 기준 총 {liveChapterCount}개 챕터와 검색 {liveSearchEntryCount}개 엔트리를 관리합니다.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="gateway-cta-card">
        <p className="gateway-kicker">Suggested Reading Flow</p>
        <h2 className="gateway-cta-title">
          이제 권역형과 국가형 {liveProductCount}개 가이드를 모두 같은 셸에서 바로 읽을 수 있습니다
        </h2>
        <p className="gateway-cta-copy">
          먼저 LatTm에서 국가 우선순위, 출원 이후 운영, 증거 관리, 모니터링과 집행의 큰 흐름을 잡고,
          {joinProductLabels(countryProducts, " · ")} 단일 시장 쟁점이 중요해지는 순간 각 country
          guide로 내려가며, 권역 운영 구조가 필요할 때는 {joinProductLabels(regionProducts, " · ")}
          으로 이어지는 구성이 현재 live shell의 기본 독서 동선입니다.
        </p>
        <div className="gateway-cta-actions">
          <a className="gateway-cta-link" href="#current-pilot-scope">
            전체 가이드 보기
          </a>
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header gateway-section-header--centered">
          <div>
            <p className="gateway-kicker">Why It Surfaces Late</p>
            <h2 className="gateway-section-title">상표 리스크는 늦게 보일수록 비싸집니다</h2>
          </div>
          <div className="gateway-section-copy-stack">
            {(whyLateParagraphs.length > 0
              ? whyLateParagraphs
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
            <h2 className="gateway-section-title">출원 설명이 아니라 운영 판단의 빈칸을 메웁니다</h2>
          </div>
          <p className="gateway-section-copy">
            {productIntent?.paragraphs[0] ?? "국가별 제도를 단순 나열하기보다, 무엇을 먼저 보고 어떤 운영 시스템을 깔아야 하는지 실무 흐름으로 정리합니다."}
          </p>
        </div>
        {productIntent?.paragraphs.slice(1, 2).map((paragraph) => (
          <p key={paragraph} className="gateway-section-copy">
            {paragraph}
          </p>
        ))}
        <ul className="gateway-bullet-list">
          {(productIntent?.bullets ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="current-pilot-scope" className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Current Pilot Scope</p>
            <h2 className="gateway-section-title">
              현재 GloTm에는 {liveProductCount}개의 live shell guide가 연결되어 있습니다
            </h2>
          </div>
          <p className="gateway-section-copy">
            {pilotScope?.paragraphs[0]
              ?? `현재는 ${liveProductCommaList}이 모두 루트 셸에 연결되어 있으며, LatTm 중심 우선순위는 유지한 채 전체 포트폴리오를 바로 탐색할 수 있습니다.`}
          </p>
        </div>
        <div className="product-group-stack">
          <ProductGroup
            title="권역 가이드"
            description="LatTm과 EuTm은 권역 단위 운영 프레임과 우선순위를 먼저 잡는 데 맞춰져 있습니다."
            products={regionProducts}
          />
          <ProductGroup
            title="국가 가이드"
            description={`${joinProductLabels(countryProducts, " · ")}은 단일 시장별 절차와 운영 쟁점을 더 깊게 따라가는 트랙입니다.`}
            products={countryProducts}
          />
        </div>
      </section>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<GatewayLandingPage />} />
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
  );
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <AppRoutes />
    </BrowserRouter>
  );
}
