import { useDeferredValue, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  createReaderRuntime,
  type ReaderHomePageProps
} from "./configuredReader";
import {
  buildGeneratedContentUrl,
  buildChapterPath,
  buildProductPath,
  buildSectionLocation,
  filterCatalogChapters,
  getChapterMeta,
  getChapterNumber,
  getChapterStage,
  normalizeSearchText
} from "./shared";

const documentDataUrl = buildGeneratedContentUrl("latam", "document-data.json");
const searchEntriesUrl = buildGeneratedContentUrl("latam", "search-index.json");

const HOME_FILTER_SUGGESTIONS = [
  "전략",
  "출원",
  "분쟁",
  "운영",
  "국가별",
  "실패 사례"
] as const;

function LatamHomeContent({
  continueChapter,
  continueTimestamp,
  documentData,
  productMeta,
  readingBookmark
}: ReaderHomePageProps) {
  const chapters = documentData.chapters;
  const productPath = buildProductPath(productMeta);
  const [catalogQuery, setCatalogQuery] = useState("");
  const deferredCatalogQuery = useDeferredValue(catalogQuery);
  const matchingChapters = filterCatalogChapters(chapters, deferredCatalogQuery);
  const filteredChapters = matchingChapters.map(({ chapter, match }) => ({
    chapter,
    meta: getChapterMeta(chapter),
    match
  }));

  return (
    <div className="home-page">
      <section className="hero-card">
        <p className="hero-kicker">중남미 상표 실무 가이드</p>
        <h1>{documentData.meta.title}</h1>
        <p className="hero-summary">
          중남미에 진출하는 기업의 브랜드 관리자·인하우스 IP 담당자를 위한
          상표 출원·유지·집행 운영 가이드입니다. 로펌 상담 전 기초 판단을
          위한 구조화된 실무 정보를 제공합니다.
        </p>
        <div className="hero-meta">
          <span>총 {documentData.meta.chapterCount}개 챕터</span>
          <span>전략부터 집행까지 한 흐름으로 구성</span>
        </div>
      </section>

      {continueChapter && readingBookmark ? (
        <section className="continue-card">
          <div className="continue-copy">
            <p className="continue-kicker">Continue Reading</p>
            <h2 className="continue-title">{continueChapter.title}</h2>
            <p className="continue-section">
              {readingBookmark.sectionTitle
                ? `최근 읽은 위치: ${readingBookmark.sectionTitle}`
                : "최근 읽던 위치에서 다시 이어볼 수 있습니다."}
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
      ) : null}

      <section className="catalog-panel" aria-labelledby="catalog-panel-title">
        <div className="catalog-panel-header">
          <div>
            <p className="catalog-panel-kicker">Chapter Finder</p>
            <h2 id="catalog-panel-title" className="catalog-panel-title">
              원하는 주제부터 바로 찾기
            </h2>
          </div>
          <p className="catalog-panel-meta">
            {matchingChapters.length} / {chapters.length}개 챕터
          </p>
        </div>

        <div className="catalog-toolbar">
          <label className="search-label" htmlFor="chapter-catalog-search">
            챕터 필터
          </label>
          <input
            id="chapter-catalog-search"
            className="catalog-input"
            type="search"
            value={catalogQuery}
            placeholder="예: 출원, 분쟁, 사용증거, 국가별"
            onChange={(event) => {
              setCatalogQuery(event.target.value);
            }}
          />
          {catalogQuery.trim() ? (
            <button
              className="catalog-clear-button"
              type="button"
              onClick={() => {
                setCatalogQuery("");
              }}
            >
              전체 보기
            </button>
          ) : null}
        </div>

        <div className="catalog-chip-row" aria-label="추천 탐색 키워드">
          {HOME_FILTER_SUGGESTIONS.map((suggestion) => {
            const isActive = normalizeSearchText(catalogQuery) === normalizeSearchText(suggestion);

            return (
              <button
                key={suggestion}
                className={isActive ? "catalog-chip active" : "catalog-chip"}
                type="button"
                onClick={() => {
                  setCatalogQuery(suggestion);
                }}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      </section>

      <section className="chapter-grid">
        {filteredChapters.length > 0 ? (
          filteredChapters.map(({ chapter, meta, match }) => {
            const chapterNumber = getChapterNumber(chapter.title);
            const chapterStage = getChapterStage(chapter.title);

            return (
              <NavLink
                key={chapter.slug}
                className={`chapter-card chapter-card--${chapterStage.key}`}
                to={buildChapterPath(productPath, chapter.slug)}
              >
                <div className="chapter-card-header">
                  <div className="chapter-card-badges">
                    <span className="chapter-card-number">{chapterNumber ?? "A"}</span>
                    <span
                      className={`chapter-card-stage chapter-card-stage--${chapterStage.key}`}
                    >
                      {chapterStage.label}
                    </span>
                  </div>
                </div>
                <strong className="chapter-card-title">{chapter.title}</strong>
                <p className="chapter-card-summary">
                  {chapter.summary ?? "이 장의 핵심 운영 포인트를 확인할 수 있습니다."}
                </p>
                {match.matchedHeadingTitle ? (
                  <p className="chapter-card-match">섹션 일치: {match.matchedHeadingTitle}</p>
                ) : null}
                <div className="chapter-card-meta">
                  <span>{meta.sectionCount}개 섹션</span>
                  <span>약 {meta.readingMinutes}분</span>
                </div>
              </NavLink>
            );
          })
        ) : (
          <section className="catalog-empty-state">
            <p className="catalog-empty-kicker">No Match</p>
            <h3 className="catalog-empty-title">조건에 맞는 챕터를 찾지 못했습니다</h3>
            <p className="catalog-empty-message">
              다른 키워드를 입력하거나 추천 탐색 키워드를 눌러 다시 살펴보세요.
            </p>
            <button
              className="catalog-clear-button"
              type="button"
              onClick={() => {
                setCatalogQuery("");
              }}
            >
              전체 챕터 보기
            </button>
          </section>
        )}
      </section>
    </div>
  );
}

const {
  ReaderRoot: LatamReaderRoot,
  HomePage: LatamHomePage,
  ChapterPage: LatamChapterPage,
  loadDocumentData,
  loadSearchEntries,
  productMeta: latamProductMeta
} = createReaderRuntime({
  productSlug: "latam",
  documentDataUrl,
  searchEntriesUrl,
  storageKey: "lattm_reading_bookmark",
  topbarKicker: "Pilot Track",
  loadingMessage: "로컬 콘텐츠와 목차를 불러오는 중입니다.",
  HomePageComponent: LatamHomeContent,
  renderChapterHeaderTopline: ({ chapter }) => {
    const chapterStage = getChapterStage(chapter.title);

    return (
      <>
        <p className="chapter-eyebrow">읽는 중</p>
        <span className={`chapter-stage-chip chapter-stage-chip--${chapterStage.key}`}>
          {chapterStage.label}
        </span>
      </>
    );
  },
  renderChapterOrderValue: ({ chapter, currentIndex }) =>
    getChapterNumber(chapter.title) ?? currentIndex + 1
});

export {
  LatamChapterPage,
  LatamHomePage,
  LatamReaderRoot,
  loadDocumentData,
  loadSearchEntries,
  latamProductMeta
};
