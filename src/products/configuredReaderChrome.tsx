import { NavLink } from "react-router-dom";

import type { Chapter, SearchEntry } from "./shared";
import { SearchPanel, SidebarNav } from "./components";
import { readerDisclaimerParagraph, siteAuthor } from "../trustLegal";

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
  onSectionJump?: (sectionId: string) => void;
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
  onSectionJump,
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
        onSectionJump={onSectionJump}
      />
    </aside>
  );
}

// 1차 출처 대조 기준일(factsReviewedOn)은 더 이상 여기서 렌더하지 않는다. 독자가 신뢰 여부를
// 판단하는 시점은 읽기 **전**이고, prerender(scripts/seo.ts)도 이미 헤더에 둔다. 미러가 아니라
// SPA를 prerender에 맞춰 챕터 헤더·가이드 홈 히어로로 올렸다(ReaderProvenanceNote).
export function ReaderShellFooter() {
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
        <div className="disclaimer">
          <strong>법적 고지:</strong> {readerDisclaimerParagraph}
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
