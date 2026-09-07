import {
  buildBriefArchivePath,
  buildBriefIssuePath
} from "../../briefs/archive";
import {
  buildReportArchivePath,
  buildReportOpenLabel,
  buildReportPath,
  reportExperienceMeta
} from "../../reports/registry";
import {
  BriefIssueCard,
  FullDocumentLink,
  ProductGroup,
  ReportCard,
  joinProductLabels,
  operatorProfileUrl,
  trackEngagement
} from "../appShared";
import type { GatewayViewModel } from "./gatewayData";

type SectionProps = {
  view: GatewayViewModel;
};

export function BriefSection({ view }: SectionProps) {
  const { latestBrief, featuredBriefs } = view;

  return (
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
          <BriefIssueCard
            key={issue.slug}
            issue={issue}
            isLatest={issue.slug === latestBrief?.slug}
            surface="gateway"
          />
        ))}
      </div>
    </section>
  );
}

export function ReportSection({ view }: SectionProps) {
  const { leadReport, leadReportFocusPoints } = view;

  return (
    <section className="gateway-section">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Report</p>
          <h2 className="gateway-section-title">여러 나라 공통 판단은 Report에서 따로 다룹니다</h2>
        </div>
      </div>
      {leadReport && leadReportFocusPoints.length > 0 ? (
        <div className="gateway-card-grid">
          {leadReportFocusPoints.map((focusPoint) => (
            <article key={focusPoint.id} className="gateway-card">
              <p className="gateway-kicker">이어 볼 가이드</p>
              <h3 className="gateway-card-title">{focusPoint.title}</h3>
              <p className="gateway-card-copy">{focusPoint.summary}</p>
              <FullDocumentLink
                className="gateway-cta-link"
                to={focusPoint.href}
                onClick={() => {
                  trackEngagement("report_handoff_click", {
                    report_slug: leadReport.slug,
                    target_path: focusPoint.href,
                    guide_slug: focusPoint.guideSlug ?? "none",
                    surface: "gateway_section"
                  });
                }}
              >
                {focusPoint.ctaLabel}
              </FullDocumentLink>
            </article>
          ))}
        </div>
      ) : null}
      <ul className="gateway-bullet-list">
        <li>{view.priorityLaneProgressNote}</li>
        <li>현재 우선 레인 상태: {view.priorityLaneStatusSummary}</li>
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
          {reportExperienceMeta.archiveCtaLabel}
        </FullDocumentLink>
        {leadReport ? (
          <FullDocumentLink
            className="gateway-cta-link gateway-cta-link--secondary"
            to={buildReportPath(leadReport.slug)}
            onClick={() => {
              trackEngagement("report_open", {
                report_slug: leadReport.slug,
                surface: "gateway_section"
              });
            }}
          >
            {buildReportOpenLabel(leadReport)}
          </FullDocumentLink>
        ) : null}
      </div>
      {leadReport ? (
        <div className="brief-card-grid">
          <ReportCard report={leadReport} surface="gateway_section" />
        </div>
      ) : null}
    </section>
  );
}

export function PortfolioFocus({ view }: SectionProps) {
  const { flagshipProducts, growthProducts, validateProducts, incubateProducts } = view;

  return (
    <section id="portfolio-focus" className="gateway-section" data-gateway-section="operations">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Portfolio Focus</p>
          <h2 className="gateway-section-title">포트폴리오를 flagship, growth, validate, incubate로 운영합니다</h2>
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

export function CurrentBuildOrder({ view }: SectionProps) {
  return (
    <section className="gateway-section">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Current Build Order</p>
          <h2 className="gateway-section-title">지금은 가장 얇은 가이드보다, 이용자가 더 빨리 도움을 느낄 수 있는 레인부터 보강합니다</h2>
        </div>
        <p className="gateway-section-copy">
          현재 우선순위는 이용자가 바로 체감하는 가치, 전체 구성의 균형, 아직 내용이 덜 채워진 정도를 함께 보고 정합니다. 그래서 growth와 validate 레인을 먼저 더 보기 좋게 다듬고, incubate 레인은 가볍게 유지합니다.
        </p>
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
