import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  buildReportArchivePath,
  buildReportPath,
  formatReportDate,
  getLatestReport,
  getReportBySlug,
  reports
} from "../reports/registry";
import { MarkdownArticle, StatusPage } from "../products/components";
import { liveShellProducts } from "../products/registry";
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
  buildPriorityLaneStatusSummary,
  buildRelatedGuideSummary,
  orderGatewayProducts
} from "./appShared";

export function ReportArchivePage() {
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

export function ReportPage() {
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
