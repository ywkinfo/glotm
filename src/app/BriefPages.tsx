import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  briefIssues,
  buildBriefArchivePath,
  buildBriefIssuePath,
  formatBriefDate,
  getBriefIssueBySlug,
  getLatestBriefIssue
} from "../briefs/archive";
import { buildProductPath, setRuntimeDocumentTitle } from "../products/shared";
import {
  BriefGuideLinks,
  BriefIssueCard,
  FullDocumentLink,
  trackEngagement
} from "./appShared";

export function BriefArchivePage() {
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

export function BriefIssuePage() {
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
