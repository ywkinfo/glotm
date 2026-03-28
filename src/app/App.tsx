import { useEffect } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import { getIntroSection, introDocument } from "../content/intro";
import { products } from "../products/registry";
import { setRuntimeDocumentTitle } from "../products/shared";
import {
  LatamChapterPage,
  LatamHomePage,
  LatamReaderRoot
} from "../products/latam";
import {
  MexicoChapterPage,
  MexicoHomePage,
  MexicoReaderRoot
} from "../products/mexico";

function AppLayout() {
  const location = useLocation();
  const activeProduct = products.find(
    (product) =>
      location.pathname === product.path
      || location.pathname.startsWith(`${product.path}/`)
  );

  return (
    <div className="glotm-app">
      <header className="global-topbar">
        <div className="global-topbar-brand">
          <NavLink className="global-brand" to="/">
            GloTm
          </NavLink>
          <p className="global-tagline">해외 진출 브랜드를 위한 글로벌 상표 지식베이스 파일럿</p>
        </div>

        <nav className="global-nav" aria-label="제품 전환">
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? "global-nav-link active" : "global-nav-link"}
          >
            <span className="global-nav-label">Gateway</span>
          </NavLink>
          {products.map((product) => (
            <NavLink
              key={product.id}
              to={product.path}
              className={({ isActive }) => isActive ? "global-nav-link active" : "global-nav-link"}
            >
              <span className="global-nav-label">
                {product.slug === "latam" ? "LatTm" : "MexTm"}
              </span>
              <span className={`status-pill status-pill--${product.statusTone}`}>
                {product.status}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="global-status-panel">
          {activeProduct ? (
            <span className={`status-pill status-pill--${activeProduct.statusTone}`}>
              {activeProduct.stageLabel}
            </span>
          ) : (
            <span className="status-pill status-pill--neutral">LatTm 중심 파일럿</span>
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

  useEffect(() => {
    setRuntimeDocumentTitle();
  }, []);

  return (
    <div className="gateway-page">
      <section className="gateway-hero">
        <div className="gateway-hero-card">
          <p className="gateway-kicker">GloTm Gateway</p>
          <h1 className="gateway-title">{introDocument.title}</h1>
          <p className="gateway-lead">
            {introDocument.quote[0]
              ?? "해외 진출 단계에서 상표 이슈가 언제 사업 리스크로 커지는지, 그리고 로펌 연결 전에 무엇을 먼저 판단해야 하는지를 정리한 관문 랜딩입니다."}
          </p>
          {introDocument.quote.slice(1, 2).map((paragraph) => (
            <p key={paragraph} className="gateway-summary">
              {paragraph}
            </p>
          ))}
          {whyLate?.paragraphs.slice(0, 1).map((paragraph) => (
            <p key={paragraph} className="gateway-summary">
              {paragraph}
            </p>
          ))}
          <div className="gateway-actions">
            <NavLink className="gateway-button gateway-button--primary" to="/latam">
              LatTm 시작
            </NavLink>
            <NavLink className="gateway-button gateway-button--secondary" to="/mexico">
              MexTm 심화
            </NavLink>
          </div>
        </div>

        <aside className="gateway-panel-card">
          <p className="gateway-kicker">Pilot Stack</p>
          <div className="gateway-hero-metrics">
            <div className="gateway-metric">
              <span className="gateway-metric-label">Flow</span>
              <strong className="gateway-metric-value">GloTm → LatTm → MexTm</strong>
              <p className="gateway-metric-note">권역 구조를 먼저 잡고 멕시코로 더 깊게 내려갑니다.</p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Pilot Scope</span>
              <strong className="gateway-metric-value">LatAm + Mexico</strong>
              <p className="gateway-metric-note">라틴아메리카 파일럿으로 구조를 검증하는 단계입니다.</p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Primary Audience</span>
              <strong className="gateway-metric-value">Brand + In-house IP</strong>
              <p className="gateway-metric-note">로펌 선임 전 기초 판단에 필요한 신뢰 정보를 지향합니다.</p>
            </div>
            <div className="gateway-metric">
              <span className="gateway-metric-label">Current Status</span>
              <strong className="gateway-metric-value">Single Shell Pilot</strong>
              <p className="gateway-metric-note">두 리더를 하나의 제품 셸 아래에서 연결해 보여줍니다.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Why It Surfaces Late</p>
            <h2 className="gateway-section-title">상표 리스크는 늦게 보일수록 비싸집니다</h2>
          </div>
          <p className="gateway-section-copy">
            {whyLate?.paragraphs[1] ?? whyLate?.paragraphs[0]}
          </p>
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

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">Current Pilot Scope</p>
            <h2 className="gateway-section-title">현재는 LatTm을 기준 제품으로, MexTm을 심화 트랙으로 봅니다</h2>
          </div>
          <p className="gateway-section-copy">
            {pilotScope?.paragraphs[0]
              ?? "라틴아메리카 파일럿을 통해 구조를 검증하고, 멕시코를 우선 심화 시장으로 연결합니다."}
          </p>
        </div>
        <div className="product-card-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-card-topline">
                <p className="gateway-kicker">{product.slug === "latam" ? "LatTm" : "MexTm"}</p>
                <span className={`status-pill status-pill--${product.statusTone}`}>
                  {product.status}
                </span>
              </div>
              <div>
                <span className="product-card-stage">{product.stageLabel}</span>
                <h3 className="product-card-title">{product.title}</h3>
              </div>
              <p className="product-card-copy">{product.summary}</p>
              <p className="product-card-audience">대상: {product.audience}</p>
              <div className="product-card-actions">
                <NavLink
                  className={
                    product.slug === "latam"
                      ? "product-card-link"
                      : "product-card-link product-card-link--secondary"
                  }
                  to={product.path}
                >
                  {product.primaryCtaLabel}
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gateway-cta-card">
        <p className="gateway-kicker">Suggested Reading Flow</p>
        <h2 className="gateway-cta-title">권역 구조는 LatTm에서, 멕시코 심화는 MexTm에서 이어집니다</h2>
        <p className="gateway-cta-copy">
          먼저 LatTm에서 국가 우선순위, 출원 이후 운영, 증거 관리, 모니터링과 집행의 큰 흐름을 잡고,
          멕시코 단일 시장 이슈가 중요해지는 순간 MexTm으로 내려가는 구성이 현재 파일럿의 기본 독서
          동선입니다.
        </p>
        <div className="gateway-cta-actions">
          <NavLink className="gateway-button gateway-button--primary" to="/latam">
            LatTm부터 보기
          </NavLink>
          <NavLink className="gateway-button gateway-button--secondary" to="/mexico">
            MexTm 바로 열기
          </NavLink>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<GatewayLandingPage />} />
          <Route path="latam" element={<LatamReaderRoot />}>
            <Route index element={<LatamHomePage />} />
            <Route path="chapter/:chapterSlug" element={<LatamChapterPage />} />
          </Route>
          <Route path="mexico" element={<MexicoReaderRoot />}>
            <Route index element={<MexicoHomePage />} />
            <Route path="chapter/:chapterSlug" element={<MexicoChapterPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
