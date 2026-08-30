import { NavLink } from "react-router-dom";

import type { Chapter, SearchEntry } from "./shared";
import { SearchPanel, SidebarNav } from "./components";
import { formatFactsReviewedNote, siteAuthor } from "../trustLegal";

// operatorProfileUrl은 siteAuthor(trustLegal.ts) 정본에서 파생한다(단일 소스).
const operatorProfileUrl = siteAuthor.url;

type ReaderTopbarProps = {
  currentChapterSlug?: string;
  isActionBarDismissed: boolean;
  isNavOpen: boolean;
  onRestoreActionBar: () => void;
  onSearchResultSelect: (result: SearchEntry) => void;
  onSearchSubmit: (query: string, resultCount: number) => void;
  onToggleNav: () => void;
  productPath: string;
  searchContent: (rawQuery: string) => Promise<SearchEntry[]>;
  title: string;
  topbarKicker: string;
  warmSearchContent: () => void;
  onNavigateToSection: (
    chapterSlug: string,
    sectionId?: string,
    behavior?: ScrollBehavior
  ) => void;
};

type ReaderSidebarProps = {
  chapters: Chapter[];
  currentChapterSlug?: string;
  currentSectionId?: string;
  isNavOpen: boolean;
  mobileTopOffset?: string;
  onClose: () => void;
  onNavigate: () => void;
  productPath: string;
};

export function ReaderShellTopbar({
  currentChapterSlug,
  isActionBarDismissed,
  isNavOpen,
  onRestoreActionBar,
  onSearchResultSelect,
  onSearchSubmit,
  onToggleNav,
  productPath,
  searchContent,
  title,
  topbarKicker,
  warmSearchContent,
  onNavigateToSection
}: ReaderTopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-kicker">{topbarKicker}</span>
        <NavLink className="brand-link" to={productPath}>
          {title}
        </NavLink>
      </div>
      <div className="topbar-actions">
        <button
          className="topbar-button mobile-only"
          type="button"
          aria-expanded={isNavOpen}
          aria-controls="reader-sidebar-navigation"
          onClick={onToggleNav}
        >
          {isNavOpen ? "목차 닫기" : "목차"}
        </button>
        {currentChapterSlug && isActionBarDismissed ? (
          <button
            className="topbar-button reader-action-restore"
            type="button"
            onClick={onRestoreActionBar}
          >
            맨 위로 버튼 표시
          </button>
        ) : null}
        <SearchPanel
          onNavigate={onNavigateToSection}
          onSearchResultSelect={onSearchResultSelect}
          onSearchSubmit={onSearchSubmit}
          searchContent={searchContent}
          warmSearchContent={warmSearchContent}
        />
      </div>
    </header>
  );
}

export function ReaderShellSidebar({
  chapters,
  currentChapterSlug,
  currentSectionId,
  isNavOpen,
  mobileTopOffset,
  onClose,
  onNavigate,
  productPath
}: ReaderSidebarProps) {
  // 이 사이드바에는 aria-hidden을 걸지 않는다. `isNavOpen`은 모바일 드로어 상태라 데스크톱에서는 항상
  // false인데, 데스크톱 `.left-rail`은 sticky로 계속 보인다 — aria-hidden을 걸면 화면에 보이는 목차
  // (챕터 링크 20여 개)가 보조기술에서 통째로 사라지고, 포커스 가능한 링크가 aria-hidden 컨테이너
  // 안에 들어가 WAI-ARIA 위반이 된다. 모바일에서 닫힌 드로어는 CSS가 이미
  // `display: none; visibility: hidden`으로 접근성 트리와 포커스 순서에서 제거하므로
  // (`LatTm/src/styles.css`의 `@media (max-width: 920px)`) 속성이 따로 필요하지 않다.
  return (
    <aside
      id="reader-sidebar-navigation"
      className={`left-rail ${isNavOpen ? "open" : ""}`}
      style={isNavOpen && mobileTopOffset
        ? {
            top: mobileTopOffset,
            bottom: "auto",
            height: `calc(100dvh - ${mobileTopOffset} - 16px)`
          }
        : undefined}
    >
      <SidebarNav
        chapters={chapters}
        basePath={productPath}
        currentChapterSlug={currentChapterSlug}
        currentSectionId={currentSectionId}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    </aside>
  );
}

export function ReaderShellFooter({ factsReviewedOn }: { factsReviewedOn?: string }) {
  // factsReviewedOn(1차 출처 대조 기준일)이 기록된 가이드에만 정직한 provenance 라인을 노출한다.
  // 정확성 '보증'이 아니라 '대조 기준일' 표기이며, 위 법적 고지와 의미가 충돌하지 않는다.
  const factsReviewedNote = formatFactsReviewedNote(factsReviewedOn);

  return (
    <footer className="reader-layout" style={{ paddingTop: 0 }}>
      <div />
      <div>
        <p className="reader-product-note reader-footer-note">
          운영자 소개·문의·강연 요청·심층 연구 안내:{" "}
          <a href={operatorProfileUrl} target="_blank" rel="noreferrer noopener">
            ywkinfo.github.io
          </a>
        </p>
        {factsReviewedNote ? (
          <p className="reader-product-note reader-footer-note" data-provenance="facts-reviewed">
            {factsReviewedNote}
          </p>
        ) : null}
        <div className="disclaimer">
          <strong>법적 고지:</strong> 이 가이드는 일반적인 정보 제공 목적이며 법률 자문이 아닙니다.
          수록된 정보는 작성 시점 기준이며, 법령·판례 변경에 따라 내용이 달라질 수 있습니다.
          구체적인 법률 문제는 자격 있는 변호사 또는 변리사에게 문의하시기 바랍니다.
          저자와 독자 사이에는 변호사·의뢰인 관계가 성립하지 않습니다.
        </div>
        <p className="copyright-notice">© 2026 GloTm. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function ReaderShellScrim({ isNavOpen, onClose }: { isNavOpen: boolean; onClose: () => void }) {
  if (!isNavOpen) {
    return null;
  }

  return (
    <button
      className="mobile-scrim"
      type="button"
      aria-label="열린 패널 닫기"
      onClick={onClose}
    />
  );
}
