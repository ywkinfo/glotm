import { useEffect } from "react";

import { briefIssues, buildBriefArchivePath, buildBriefIssuePath, formatBriefDate, getLatestBriefIssue } from "../briefs/archive";
import { getIntroSection } from "../content/intro";
import {
  buildReportArchivePath,
  buildReportOpenLabel,
  buildReportPath,
  getGatewayFeaturedReports,
  getPrimaryGatewayReport,
  reportExperienceMeta
} from "../reports/registry";
import { liveShellProducts } from "../products/registry";
import { buildProductPath, setRuntimeDocumentTitle } from "../products/shared";
import {
  BriefIssueCard,
  FullDocumentLink,
  ProductGroup,
  ReportCard,
  buildGuideTrackingParams,
  buildPriorityLaneProgressNote,
  buildPriorityLaneStatusSummary,
  getTierComposition,
  joinProductLabels,
  operatorProfileUrl,
  orderGatewayProducts,
  trackEngagement
} from "./appShared";

export function GatewayLandingPage() {
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
  const chinaProduct = orderedProducts.find((product) => product.slug === "china") ?? orderedProducts[0];
  const latamProduct = orderedProducts.find((product) => product.slug === "latam") ?? orderedProducts[0];
  const mexicoProduct = orderedProducts.find((product) => product.slug === "mexico") ?? orderedProducts[0];
  const featuredBriefs = briefIssues.slice(0, 2);
  const latestBrief = getLatestBriefIssue();
  const leadReport = getPrimaryGatewayReport();
  const featuredReports = getGatewayFeaturedReports(3);
  const priorityLaneStatusSummary = buildPriorityLaneStatusSummary(orderedProducts);
  const priorityLaneProgressNote = buildPriorityLaneProgressNote(orderedProducts, leadReport ?? undefined);
  const leadReportFocusPoints = leadReport?.focusPoints.slice(0, 3) ?? [];
  const whyLateParagraphs = whyLate?.paragraphs ?? [];
  const heroTitle = "인하우스 팀을 위한 cross-border trademark operating guide";
  const heroLead = "여러 국가·권역의 시장 우선순위, 출원 경로, 브랜드 포트폴리오 관리, 침해 대응, 집행 판단에 필요한 정보를 한곳에 모아 제공합니다.";
  const heroSummaryParagraphs = [
    "검색 결과를 그대로 믿기 전에, 내부 판단에 필요한 운영 질문을 빠르게 구조화하고 비교할 수 있습니다.",
    "제공 정보는 참고용이며, 최신성 및 정확성은 각국 법령과 실무 변화에 따라 달라질 수 있으므로 현지 대리인 확인 후 활용하시기 바랍니다."
  ];
  const latestBriefJurisdictions = latestBrief?.jurisdictions.slice(0, 4) ?? [];
  const priorityRoadmap = [
    {
      id: "china",
      title: "ChaTm은 핵심 내용을 더 쉽게 보이게 다듬었어요",
      copy:
        "자주 쓰는 흐름부터 먼저 정리해, 필요한 내용을 빠르게 찾기 쉽게 만들었습니다.",
      note: "출원, 무효, 라이선스, 통관, 운영 기준을 한 번에 볼 수 있게 정리",
      href: buildProductPath("/china")
    },
    {
      id: "mexico",
      title: "MexTm은 다음 단계로 이어받기 쉽게 정리했어요",
      copy:
        "출원 서류부터 담당자 역할까지 한 흐름으로 맞춰, 다음 작업을 바로 이어가기 쉽게 했습니다.",
      note: "출원 서류, 갱신과 유지 책임, 국경 대응 자료를 한 흐름으로 정리",
      href: buildProductPath("/mexico")
    },
    {
      id: "europe",
      title: "EuTm은 꼭 필요한 6가지를 먼저 안정시켰어요",
      copy:
        "범위를 넓히기보다, 문서와 기준을 먼저 맞춰서 더 믿고 볼 수 있게 했습니다.",
      note: "핵심 기준과 안내 구조를 먼저 정리",
      href: buildProductPath("/europe")
    },
    {
      id: "report-gateway",
      title: "리포트와 Gateway를 한 흐름으로 이어뒀어요",
      copy:
        "출원 경로를 볼 때는 판단용 리포트를, 사용 증거를 볼 때는 운영용 리포트를 연결해서 한 번에 읽기 쉽게 만들었습니다.",
      note: "경로 판단 리포트, 사용 증거 리포트, Gateway 상태를 함께 연결",
      href: buildReportArchivePath()
    },
    {
      id: "incubate",
      title: "Incubate는 필요한 부분만 가볍게 다듬고 있어요",
      copy:
        "JapTm, UKTm, UsaTm은 큰 개편보다 기본 확인과 작은 보완부터 차근차근 진행합니다.",
      note: "가벼운 유지보수 중심",
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
          {chinaProduct ? (
            <div className="gateway-actions">
              <FullDocumentLink
                className="gateway-button gateway-button--primary"
                to={buildProductPath(chinaProduct)}
                onClick={() => {
                  trackEngagement("guide_cta_click", buildGuideTrackingParams(chinaProduct, "gateway_hero"));
                }}
              >
                ChaTm 보기
              </FullDocumentLink>
              {mexicoProduct ? (
                <FullDocumentLink
                  className="gateway-button gateway-button--secondary"
                  to={buildProductPath(mexicoProduct)}
                  onClick={() => {
                    trackEngagement("guide_cta_click", buildGuideTrackingParams(mexicoProduct, "gateway_hero"));
                  }}
                >
                  MexTm 먼저 보기
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
                {liveProductCount}개 가이드를 하나의 체계로 운영해 안내하되, 각 가이드의 단계별 안내 수준과 확대 기준은 다르게 운영합니다.
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

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">{reportExperienceMeta.gatewaySectionKicker}</p>
            <h2 className="gateway-section-title">{reportExperienceMeta.gatewaySectionTitle}</h2>
          </div>
        </div>
        {featuredReports.length > 0 ? (
          <div className="brief-card-grid">
            {featuredReports.map((report) => (
              <ReportCard key={report.id} report={report} surface="gateway_front_reports" />
            ))}
          </div>
        ) : null}
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
        <h2 className="gateway-cta-title">ChaTm과 MexTm부터 보면 현재 우선 레인과 실행 질문이 함께 잡힙니다</h2>
        <p className="gateway-cta-copy">
          {"ChaTm은 지금 가장 먼저 볼 guide이고, MexTm은 멕시코 운영 기준 guide입니다. 큰 그림이 필요할 때는 LatTm을 기준 프레임으로 함께 보되, 지금 추천 시작은 ChaTm -> MexTm 흐름입니다."}
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
          <li>{priorityLaneProgressNote}</li>
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

      <section id="portfolio-focus" className="gateway-section">
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
              description="LatTm은 cross-border 우선순위와 운영 흐름의 기준 제품입니다. 신규 시장 확장보다 freshness, search density, reader QA를 먼저 높입니다."
              products={flagshipProducts}
              surface="portfolio_flagship"
            />
          ) : null}
          {growthProducts.length > 0 ? (
            <ProductGroup
              title="Growth"
              description="ChaTm은 mature 승격을 반영했고 MexTm은 mature baseline을 유지합니다. 이제 growth 결과를 route decision report와 Gateway copy로 다시 묶는 단계입니다."
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
            <h2 className="gateway-section-title">지금은 가장 얇은 가이드보다, 이용자가 더 빨리 도움을 느낄 수 있는 레인부터 보강합니다</h2>
          </div>
          <p className="gateway-section-copy">
            현재 우선순위는 이용자가 바로 체감하는 가치, 전체 구성의 균형, 아직 내용이 덜 채워진 정도를 함께 보고 정합니다. 그래서 growth와 validate 레인을 먼저 더 보기 좋게 다듬고, incubate 레인은 가볍게 유지합니다.
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
          지금은 LatTm flagship을 보호하면서 {priorityLaneProgressNote.replace("현재 우선 레인 상태: ", "").replace("입니다.", "에 집중하고 있습니다.")}
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
