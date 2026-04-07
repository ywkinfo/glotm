import { NavLink } from "react-router-dom";

import {
  buildReportOpenLabel,
  buildReportPath,
  type GuideReportHandoff
} from "../reports/registry";
import { trackEngagement } from "../app/appShared";
import {
  buildChapterPath,
  buildSectionLocation,
  getChapterMeta,
  type Chapter,
  type ReadingBookmark
} from "./shared";

type ContinueReadingCardProps = {
  continueChapter: Chapter;
  continueTimestamp: string;
  productPath: string;
  readingBookmark: ReadingBookmark;
};

type ConfiguredChapterGridProps = {
  chapterBadge: string;
  chapters: Chapter[];
  productPath: string;
};

type GuideReportHandoffSectionProps = {
  guideSlug: string;
  reportHandoffs?: GuideReportHandoff[];
};

export function ContinueReadingCard({
  continueChapter,
  continueTimestamp,
  productPath,
  readingBookmark
}: ContinueReadingCardProps) {
  return (
    <section className="continue-card">
      <div className="continue-copy">
        <p className="continue-kicker">Continue Reading</p>
        <h2 className="continue-title">{continueChapter.title}</h2>
        <p className="continue-section">
          {readingBookmark.sectionTitle
            ? `최근 읽은 위치: ${readingBookmark.sectionTitle}`
            : "최근 읽던 위치에서 바로 심화 읽기를 이어갈 수 있습니다."}
        </p>
        <div className="continue-meta">
          <span>{Math.max(0, Math.min(100, readingBookmark.progress))}% 읽음</span>
          <span>{getChapterMeta(continueChapter).readingMinutes}분 분량</span>
          {continueTimestamp ? <span>마지막 열람 {continueTimestamp}</span> : null}
        </div>
      </div>
      <NavLink
        className="continue-link"
        to={buildSectionLocation(
          productPath,
          continueChapter.slug,
          readingBookmark.sectionId
        )}
      >
        이어 읽기
      </NavLink>
    </section>
  );
}

export function DraftNotice() {
  return (
    <div className="draft-notice" role="note" aria-label="콘텐츠 준비 중 안내">
      <span className="draft-notice-icon" aria-hidden="true">⚠</span>
      <p className="draft-notice-text">
        이 가이드는 현재 콘텐츠를 작성 중입니다. 일부 챕터는 개요 수준으로만 제공될 수 있으며, 순차적으로 보강될 예정입니다.
      </p>
    </div>
  );
}

export function GuideReportHandoffSection({
  guideSlug,
  reportHandoffs
}: GuideReportHandoffSectionProps) {
  if (!reportHandoffs || reportHandoffs.length === 0) {
    return null;
  }

  return (
    <section className="gateway-section" aria-label="관련 Report / Trust Layer">
      <div className="gateway-section-header">
        <div>
          <p className="gateway-kicker">Trust Layer Handoff</p>
          <h2 className="gateway-section-title">관련 Report / Trust Layer</h2>
        </div>
      </div>
      <p className="reader-product-note">
        현재 가이드에서 잠근 실행 질문을 교차 관할권 report로 다시 묶어 보려면 아래 trust layer부터
        이어 읽으면 됩니다.
      </p>
      <div className="gateway-card-grid">
        {reportHandoffs.map(({ report, focusPoint }) => (
          <article key={report.slug} className="gateway-card">
            <p className="gateway-kicker">Report</p>
            <h3 className="gateway-card-title">{report.title}</h3>
            {focusPoint ? (
              <p className="gateway-card-copy">이 가이드 연결: {focusPoint.title}</p>
            ) : null}
            <p className="gateway-card-copy">{focusPoint?.summary ?? report.summary}</p>
            <NavLink
              className="gateway-cta-link"
              to={buildReportPath(report.slug)}
              onClick={() => {
                trackEngagement("report_open", {
                  report_slug: report.slug,
                  guide_slug: guideSlug,
                  surface: "guide_home_handoff"
                });
              }}
            >
              {buildReportOpenLabel(report)}
            </NavLink>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ConfiguredChapterGrid({
  chapterBadge,
  chapters,
  productPath
}: ConfiguredChapterGridProps) {
  return (
    <section className="chapter-grid">
      {chapters.map((chapter) => {
        const meta = getChapterMeta(chapter);

        return (
          <NavLink
            key={chapter.slug}
            className="chapter-card chapter-card--filing"
            to={buildChapterPath(productPath, chapter.slug)}
          >
            <div className="chapter-card-header">
              <div className="chapter-card-badges">
                <span className="chapter-card-stage chapter-card-stage--filing">
                  {chapterBadge}
                </span>
              </div>
            </div>
            <strong className="chapter-card-title">{chapter.title}</strong>
            <p className="chapter-card-summary">
              {chapter.summary ?? "이 장의 핵심 실무 포인트를 탐색할 수 있습니다."}
            </p>
            <div className="chapter-card-meta">
              <span>{meta.sectionCount}개 섹션</span>
              <span>약 {meta.readingMinutes}분</span>
            </div>
          </NavLink>
        );
      })}
    </section>
  );
}
