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
import { buildProductPath, getJurisdictionLabel } from "../../products/shared";
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

export function GatewayHero() {
  return (
    <section className="gateway-hero gateway-hero--compact">
      <div className="gateway-hero-card">
        <p className="gateway-kicker">GloTm Gateway</p>
        <div className="gateway-copy-stack">
          <h1 className="gateway-title">{gatewayHeroTitle}</h1>
          <p className="gateway-lead">{gatewayHeroLead}</p>
          {gatewayHeroSupportingParagraphs.map((paragraph) => (
            <p key={paragraph} className="gateway-summary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// 국가 진입. 큰 소개 카드가 아니라 간결한 링크 그리드다 — 첫 화면에서 해야 할 일은
// "읽을 나라를 고르는 것" 하나뿐이다.
//
// 순서는 `orderGatewayProducts(liveShellProducts)`를 그대로 소비해 registry의 gatewayOrder에서
// 구조적으로 나온다(드리프트 불가). 이 계약은 App.test.tsx가 DOM 관계로 지킨다.
export function GuideEntryGrid({ view }: SectionProps) {
  return (
    <section className="gateway-guide-entry" data-gateway-section="guide-entry">
      <h2 className="gateway-section-title gateway-guide-entry-title">
        어느 나라부터 보시겠습니까?
      </h2>
      <div className="gateway-guide-entry-grid">
        {view.orderedProducts.map((product) => (
          <FullDocumentLink
            key={product.id}
            className="gateway-guide-entry-link"
            data-guide-entry-slug={product.slug}
            to={buildProductPath(product)}
            onClick={() => {
              trackEngagement(
                "guide_cta_click",
                buildGuideTrackingParams(product, "gateway_guide_entry")
              );
            }}
          >
            <span className="gateway-guide-entry-name">{getJurisdictionLabel(product)}</span>
            <span className="gateway-guide-entry-code">{product.shortLabel}</span>
            <span className="gateway-guide-entry-meta">{product.chapterCount}개 챕터</span>
          </FullDocumentLink>
        ))}
      </div>
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
      {/* 별도 Report 섹션이 최신 리포트를 한 번 더 반복하고 있었다. 그 섹션에서 유일하게
          고유했던 focus point 핸드오프와 아카이브 링크만 여기로 접어 넣고 중복은 없앤다. */}
      {view.leadReport && view.leadReportFocusPoints.length > 0 ? (
        <div className="gateway-card-grid">
          {view.leadReportFocusPoints.map((focusPoint) => (
            <article key={focusPoint.id} className="gateway-card">
              <p className="gateway-kicker">이어 볼 가이드</p>
              <h3 className="gateway-card-title">{focusPoint.title}</h3>
              <p className="gateway-card-copy">{focusPoint.summary}</p>
              <FullDocumentLink
                className="gateway-cta-link"
                to={focusPoint.href}
                onClick={() => {
                  trackEngagement("report_handoff_click", {
                    report_slug: view.leadReport?.slug ?? "none",
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
