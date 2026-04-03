import { NavLink } from "react-router-dom";

import type { Chapter, SearchEntry } from "./shared";
import { SearchPanel, SidebarNav } from "./components";

const operatorProfileUrl = "https://ywkinfo.github.io";

type ReaderTopbarProps = {
  currentChapterSlug?: string;
  isActionBarDismissed: boolean;
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
  onNavigate: () => void;
  productPath: string;
};

export function ReaderShellTopbar({
  currentChapterSlug,
  isActionBarDismissed,
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
          onClick={onToggleNav}
        >
          목차
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
  onNavigate,
  productPath
}: ReaderSidebarProps) {
  return (
    <aside
      className={`left-rail ${isNavOpen ? "open" : ""}`}
      aria-hidden={isNavOpen ? undefined : true}
    >
      <SidebarNav
        chapters={chapters}
        basePath={productPath}
        currentChapterSlug={currentChapterSlug}
        currentSectionId={currentSectionId}
        onNavigate={onNavigate}
      />
    </aside>
  );
}

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
