import {
  buildBuildOrderCopy,
  buildPortfolioFocusTitle
} from "../../content/gateway";
import { buildReportArchivePath, reportExperienceMeta } from "../../reports/registry";
import {
  FullDocumentLink,
  ProductGroup,
  getTierComposition,
  joinProductLabels,
  operatorProfileUrl,
  trackEngagement
} from "../appShared";
import type { GatewayViewModel } from "./gatewayData";

type SectionProps = {
  view: GatewayViewModel;
};

function PortfolioFocus({ view }: SectionProps) {
  const { flagshipProducts, growthProducts, validateProducts, incubateProducts } = view;

  return (
    <section id="portfolio-focus" className="gateway-section">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Portfolio Focus</p>
          <h2 className="gateway-section-title">{buildPortfolioFocusTitle(view.orderedProducts)}</h2>
        </div>
        <p className="gateway-section-copy">
          모든 가이드는 하나의 체계로 운영해 안내하되, 각 가이드의 단계별 안내 수준과 확대 기준은 다르게 운영합니다. 신규 시장 추가보다 기존 포트폴리오의 freshness, density, QA 정렬을 먼저 끌어올립니다.
        </p>
      </div>
      <div className="product-group-stack">
        {flagshipProducts.length > 0 ? (
          <ProductGroup
            title="Flagship"
            description="기준 프레임을 책임지는 레인입니다. 신규 시장 확장보다 freshness, search density, reader QA를 먼저 높입니다."
            products={flagshipProducts}
            surface="portfolio_flagship"
          />
        ) : null}
        {growthProducts.length > 0 ? (
          <ProductGroup
            title="Growth"
            description="buyer entry 가치와 실무 밀도를 빠르게 끌어올리는 레인입니다. 각 guide 카드의 maturity note와 QA 상태를 기준으로 우선순위를 관리합니다."
            products={growthProducts}
            surface="portfolio_growth"
          />
        ) : null}
        {validateProducts.length > 0 ? (
          <ProductGroup
            title="Validate"
            description="범위 확대보다 verification, 문서 정합성, 기준선 안정화를 우선하는 레인입니다."
            products={validateProducts}
            surface="portfolio_validate"
          />
        ) : null}
        {incubateProducts.length > 0 ? (
          <ProductGroup
            title="Incubate"
            description={`${joinProductLabels(incubateProducts, " · ")}은 lighter track으로 유지하며 verification refresh, reader utility, 문서 정합성을 우선합니다.`}
            products={incubateProducts}
            surface="portfolio_incubate"
          />
        ) : null}
      </div>
    </section>
  );
}

function CurrentBuildOrder({ view }: SectionProps) {
  return (
    <section className="gateway-section">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Current Build Order</p>
          <h2 className="gateway-section-title">지금은 가장 얇은 가이드보다, 이용자가 더 빨리 도움을 느낄 수 있는 레인부터 보강합니다</h2>
        </div>
        <p className="gateway-section-copy">{buildBuildOrderCopy(view.orderedProducts)}</p>
      </div>
      <div className="gateway-card-grid">
        {view.priorityRoadmap.map((lane, index) => (
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
  );
}

export function OperatorSection({ view }: SectionProps) {
  return (
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
        지금은 {view.priorityLaneProgressNote}
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
  );
}

// 운영 영역 — 삭제가 아니라 강등이다.
//
// Portfolio Snapshot · tier 구성 · Current Build Order는 게이트웨이의 문서화된
// "portfolio tier + trust formation" 역할을 지탱하는 정보라 남긴다. 다만 이용자의 첫 업무
// (읽을 나라 고르기)보다 앞에 서면 안 되므로 기본 접힘 상태로 내린다.
export function GatewayOperationsPanel({ view }: SectionProps) {
  return (
    <details className="gateway-ops" data-gateway-section="operations">
      <summary className="gateway-ops-summary">
        포트폴리오 운영 현황 (tier · 빌드 순서 · 스냅샷)
      </summary>

      <aside className="gateway-panel-card gateway-panel-card--supporting">
        <p className="gateway-kicker">Portfolio Snapshot</p>
        <div className="gateway-hero-metrics">
          <div className="gateway-metric">
            <span className="gateway-metric-label">Positioning</span>
            <strong className="gateway-metric-value">
              Cross-border operating guides for in-house teams
            </strong>
            <p className="gateway-metric-note">
              GloTm은 일반 법률 정보 사이트가 아니라, 시장 우선순위와 출원·유지·집행 판단을 돕는 운영형 포트폴리오입니다.
            </p>
          </div>
          <div className="gateway-metric">
            <span className="gateway-metric-label">Portfolio</span>
            <strong className="gateway-metric-value">{getTierComposition(view.orderedProducts)}</strong>
            <p className="gateway-metric-note">
              {view.liveProductCount}개 가이드를 하나의 체계로 운영해 안내하되, 각 가이드의 단계별 안내 수준과 확대 기준은 다르게 운영합니다.
            </p>
          </div>
          <div className="gateway-metric">
            <span className="gateway-metric-label">Proof</span>
            <strong className="gateway-metric-value">
              {view.liveChapterCount} Chapters · {view.liveSearchEntryCount} Search Entries
            </strong>
            <p className="gateway-metric-note">
              권역형 {view.regionProductCount}개와 국가형 {view.countryProductCount}개를 운영하며, monthly health review와 scorecard로 search density, verification freshness, QA를 함께 관리합니다.
            </p>
          </div>
        </div>
      </aside>

      <ul className="gateway-bullet-list">
        <li>{view.priorityLaneProgressNote}</li>
        <li>현재 우선 레인 상태: {view.priorityLaneStatusSummary}</li>
      </ul>

      <PortfolioFocus view={view} />
      <CurrentBuildOrder view={view} />
    </details>
  );
}
