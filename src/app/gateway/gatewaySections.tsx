import {
  buildBriefArchivePath,
  buildBriefIssuePath,
  formatBriefDate
} from "../../briefs/archive";
import { gatewayHeroSupportingParagraphs } from "../../content/gateway";
import {
  buildReportArchivePath,
  buildReportOpenLabel,
  buildReportPath,
  reportExperienceMeta
} from "../../reports/registry";
import { buildProductPath } from "../../products/shared";
import {
  BriefIssueCard,
  FullDocumentLink,
  ProductGroup,
  ReportCard,
  buildGuideTrackingParams,
  getTierComposition,
  joinProductLabels,
  operatorProfileUrl,
  trackEngagement
} from "../appShared";
import { gatewayHeroLead, gatewayHeroTitle, type GatewayViewModel } from "./gatewayData";

type SectionProps = {
  view: GatewayViewModel;
};

export function GatewayHero({ view }: SectionProps) {
  const { leadGuide, secondGuide, leadReport } = view;

  return (
    <section className="gateway-hero">
      <div className="gateway-hero-card">
        <p className="gateway-kicker">GloTm Gateway</p>
        <div className="gateway-copy-stack">
          <h1 className="gateway-title">{gatewayHeroTitle}</h1>
          <p className="gateway-lead">{gatewayHeroLead}</p>
          {gatewayHeroSupportingParagraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0 ? "gateway-summary" : "gateway-summary gateway-summary--supporting"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
        {leadGuide ? (
          <div className="gateway-actions">
            <FullDocumentLink
              className="gateway-button gateway-button--primary"
              to={buildProductPath(leadGuide)}
              onClick={() => {
                trackEngagement(
                  "guide_cta_click",
                  buildGuideTrackingParams(leadGuide, "gateway_hero")
                );
              }}
            >
              {leadGuide.primaryCtaLabel}
            </FullDocumentLink>
            {secondGuide ? (
              <FullDocumentLink
                className="gateway-button gateway-button--secondary"
                to={buildProductPath(secondGuide)}
                onClick={() => {
                  trackEngagement(
                    "guide_cta_click",
                    buildGuideTrackingParams(secondGuide, "gateway_hero")
                  );
                }}
              >
                {secondGuide.primaryCtaLabel}
              </FullDocumentLink>
            ) : null}
            {leadReport ? (
              <FullDocumentLink
                className="gateway-button gateway-button--secondary"
                to={buildReportPath(leadReport.slug)}
                onClick={() => {
                  trackEngagement("report_open", {
                    report_slug: leadReport.slug,
                    surface: "gateway_hero"
                  });
                }}
              >
                {buildReportOpenLabel(leadReport)}
              </FullDocumentLink>
            ) : null}
          </div>
        ) : null}
      </div>

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
            <strong className="gateway-metric-value">
              {getTierComposition(view.orderedProducts)}
            </strong>
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
    </section>
  );
}

export function LatestBriefBanner({ view }: SectionProps) {
  const { latestBrief, latestBriefJurisdictions } = view;

  if (!latestBrief) {
    return null;
  }

  return (
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
  );
}

export function TrustLayerReports({ view }: SectionProps) {
  return (
    <section
      className="gateway-section gateway-section--trust-layer"
      data-gateway-section="reports"
    >
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">{reportExperienceMeta.gatewaySectionKicker}</p>
          <h2 className="gateway-section-title">{reportExperienceMeta.gatewaySectionTitle}</h2>
        </div>
        <p className="gateway-section-copy">{reportExperienceMeta.gatewaySectionSummary}</p>
      </div>
      {view.featuredReports.length > 0 ? (
        <div className="brief-card-grid brief-card-grid--trust-layer">
          {view.featuredReports.map((report) => (
            <ReportCard key={report.id} report={report} surface="gateway_latest_reports" />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function RecommendedStart({ view }: SectionProps) {
  return (
    <section className="gateway-cta-card">
      <p className="gateway-kicker">Recommended Start</p>
      <h2 className="gateway-cta-title">{view.recommendedStartTitle}</h2>
      <p className="gateway-cta-copy">{view.recommendedStartCopy}</p>
      <div className="gateway-cta-actions">
        <a className="gateway-cta-link" href="#portfolio-focus">
          포트폴리오 우선 가이드 보기
        </a>
      </div>
    </section>
  );
}

export function WhyItMattersEarly({ view }: SectionProps) {
  return (
    <section className="gateway-section">
      <div className="gateway-section-header gateway-section-header--centered">
        <div>
          <p className="gateway-kicker">Why It Matters Early</p>
          <h2 className="gateway-section-title">상표 리스크는 늦게 보일수록 비싸집니다</h2>
        </div>
        <div className="gateway-section-copy-stack">
          {(
            view.whyLateParagraphs.length > 0
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
        {view.riskPatterns?.subsections.map((pattern) => (
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
  );
}

export function WhatGloTmSolves() {
  return (
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
  );
}
