import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

import {
  buildReportArchivePath,
  buildReportOpenLabel,
  buildReportPath,
  formatReportDate,
  getLatestReport,
  getPrimaryFocusPointForGuide,
  getReportBySlug,
  reportExperienceMeta,
  reports
} from "../reports/registry";
import { MarkdownArticle, StatusPage } from "../products/components";
import { getProductBySlug, liveShellProducts } from "../products/registry";
import {
  buildGeneratedContentUrl,
  buildProductPath,
  createDocumentResourceLoaders,
  setRuntimeDocumentTitle,
  type DocumentData
} from "../products/shared";
import {
  FullDocumentLink,
  ReportCard,
  buildPriorityLaneProgressNote,
  buildPriorityLaneLabelSequence,
  buildTrustLayerGuideSummary,
  getTrustLayerSummaryFallback,
  orderGatewayProducts,
  trackEngagement
} from "./appShared";

export function ReportArchivePage() {
  const leadReport = getLatestReport();
  const orderedProducts = orderGatewayProducts(liveShellProducts);
  const priorityLaneLabelSequence = buildPriorityLaneLabelSequence(orderedProducts);
  const priorityLaneProgressNote = leadReport
    ? buildPriorityLaneProgressNote(orderedProducts, leadReport)
    : null;
  const trustLayerGuideSummary =
    buildTrustLayerGuideSummary(leadReport, orderedProducts, {
      laneLabelSequence: priorityLaneLabelSequence,
      includeLaneBridge: true
    });

  useEffect(() => {
    setRuntimeDocumentTitle("Report");
  }, []);

  return (
    <div className="gateway-page">
      <section className="brief-hero">
        <div className="brief-hero-card">
          <p className="gateway-kicker">{reportExperienceMeta.archiveHeroKicker}</p>
          <h1 className="gateway-title">{reportExperienceMeta.archiveHeroTitle}</h1>
          <p className="gateway-lead">{reportExperienceMeta.archiveHeroLead}</p>
          <p className="gateway-summary">{reportExperienceMeta.archiveHeroSummary}</p>
          <p className="gateway-summary gateway-summary--supporting">
            {trustLayerGuideSummary || getTrustLayerSummaryFallback()}
          </p>
          {priorityLaneProgressNote ? (
            <p className="gateway-summary gateway-summary--supporting">
              {priorityLaneProgressNote}
            </p>
          ) : null}
          {leadReport?.whyNow ? (
            <p className="gateway-summary gateway-summary--supporting">
              {leadReport.whyNow}
            </p>
          ) : null}
          <div className="gateway-actions">
            {leadReport ? (
              <FullDocumentLink className="gateway-button gateway-button--primary" to={buildReportPath(leadReport.slug)}>
                {buildReportOpenLabel(leadReport)}
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
            <p className="gateway-kicker">{reportExperienceMeta.archiveSectionKicker}</p>
            <h2 className="gateway-section-title">{reportExperienceMeta.archiveSectionTitle}</h2>
          </div>
          <p className="gateway-section-copy">{reportExperienceMeta.archiveSectionSummary}</p>
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

export function ReportPage() {
  const params = useParams<{ reportSlug: string }>();
  const [searchParams] = useSearchParams();
  const report = params.reportSlug ? getReportBySlug(params.reportSlug) : undefined;
  const sourceGuideSlug = searchParams.get("fromGuide") ?? undefined;
  const orderedProducts = orderGatewayProducts(liveShellProducts);
  const priorityLaneLabelSequence = buildPriorityLaneLabelSequence(orderedProducts);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sourceGuide = sourceGuideSlug ? getProductBySlug(sourceGuideSlug) : undefined;
  const sourceGuideFocusPoint = report && sourceGuideSlug
    ? getPrimaryFocusPointForGuide(sourceGuideSlug, report.slug)
    : undefined;
  const orderedFocusPoints = sourceGuideFocusPoint && report
    ? [
        sourceGuideFocusPoint,
        ...report.focusPoints.filter((focusPoint) => focusPoint.id !== sourceGuideFocusPoint.id)
      ]
    : report?.focusPoints ?? [];
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
        kicker="Report"
        title="리포트를 불러오지 못했습니다"
        message={loadError}
      />
    );
  }

  if (!documentData) {
    return (
      <StatusPage
        kicker="Report"
        title="리포트를 준비하고 있습니다"
        message="리포트 데이터를 불러오는 중입니다."
      />
    );
  }

  const chapter = documentData.chapters[0];

  if (!chapter) {
    return (
      <StatusPage
        kicker="Report"
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
          <FullDocumentLink to={buildReportArchivePath()}>Report</FullDocumentLink>
        </div>
        <div className="brief-issue-header">
          <p className="gateway-kicker">Report</p>
          <p className="brief-card-date">{formatReportDate(report.publishedAt)}</p>
          <h1 className="gateway-title">{report.title}</h1>
          <p className="gateway-lead">{report.summary}</p>
          <p className="brief-issue-note">대상: {report.audience}</p>
          <div className="brief-chip-row" aria-label="리포트 관할 목록">
            {report.jurisdictions.map((jurisdiction) => (
              <span key={jurisdiction} className="brief-chip">
                {jurisdiction}
              </span>
            ))}
          </div>
          <p className="brief-issue-note">
            {buildTrustLayerGuideSummary(report, orderedProducts, {
              laneLabelSequence: priorityLaneLabelSequence,
              includeLaneBridge: true
            }) || getTrustLayerSummaryFallback()}
          </p>
          {sourceGuide && sourceGuideFocusPoint ? (
            <>
              <p className="brief-issue-note">
                {`${sourceGuide.shortLabel} 홈의 trust layer handoff에서 넘어왔다면, 아래 CTA로 방금 보던 guide deep link로 바로 돌아갈 수 있습니다.`}
              </p>
              <div className="gateway-actions">
                <FullDocumentLink
                  className="gateway-button gateway-button--secondary"
                  to={sourceGuideFocusPoint.href}
                  onClick={() => {
                    trackEngagement("report_guide_click", {
                      report_slug: report.slug,
                      target_path: sourceGuideFocusPoint.href,
                      guide_slug: sourceGuide.slug,
                      surface: "report_detail_return"
                    });
                  }}
                >
                  {`${sourceGuide.shortLabel}로 돌아가기`}
                </FullDocumentLink>
              </div>
            </>
          ) : null}
        </div>

        <div className="brief-item-stack">
          <article className="brief-item-card">
            <div className="brief-item-header">
              <span className="brief-item-index">01</span>
              <div>
                <h2 className="brief-item-title">왜 지금 이 리포트를 먼저 읽는가</h2>
                <p className="brief-item-copy">{report.whyNow}</p>
              </div>
            </div>
            <ul className="brief-card-list">
              {report.trustLayerChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          {orderedFocusPoints.length > 0 ? (
            <article className="brief-item-card">
              <div className="brief-item-header">
                <span className="brief-item-index">02</span>
                <div>
                  <h2 className="brief-item-title">가이드로 이어 보기</h2>
                  <p className="brief-item-copy">
                    리포트에서 큰 질문을 먼저 정리한 뒤, 아래 링크로 들어가 각 guide의 실행 기준을 바로 이어서 볼 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="gateway-card-grid">
                {orderedFocusPoints.map((focusPoint) => (
                  <article key={focusPoint.id} className="gateway-card">
                    <p className="gateway-kicker">이어 볼 가이드</p>
                    <h3 className="gateway-card-title">{focusPoint.title}</h3>
                    <p className="gateway-card-copy">{focusPoint.summary}</p>
                    <FullDocumentLink
                      className="gateway-cta-link"
                      to={focusPoint.href}
                      onClick={() => {
                        trackEngagement("report_guide_click", {
                          report_slug: report.slug,
                          target_path: focusPoint.href,
                          guide_slug: focusPoint.guideSlug ?? "none",
                          surface: "report_detail_focus"
                        });
                      }}
                    >
                      {focusPoint.ctaLabel}
                    </FullDocumentLink>
                  </article>
                ))}
              </div>
            </article>
          ) : null}
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
                <FullDocumentLink
                  key={link.href}
                  className="brief-guide-link"
                  to={link.href}
                  onClick={() => {
                    trackEngagement("report_guide_click", {
                      report_slug: report.slug,
                      target_path: link.href,
                      surface: "report_detail_related"
                    });
                  }}
                >
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
