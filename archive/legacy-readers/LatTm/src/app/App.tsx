import { useDeferredValue, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  HashRouter,
  Link,
  matchPath,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams
} from "react-router-dom";

import { loadDocumentData } from "../content";
import { SidebarNav } from "../features/navigation/components/SidebarNav";
import {
  ChapterOutline,
  flattenOutlineHeadings
} from "../features/reader/components/ChapterOutline";
import { MarkdownArticle } from "../features/reader/components/MarkdownArticle";
import { ReaderActionBar } from "../features/reader/components/ReaderActionBar";
import { ReadingProgressBar } from "../features/reader/components/ReadingProgressBar";
import { getChapterMeta } from "../features/reader/lib/chapterMetrics";
import {
  formatBookmarkTimestamp,
  loadReadingBookmark,
  saveReadingBookmark
} from "../features/reader/lib/readingHistory";
import { getChapterNumber, getChapterStage } from "../shared/lib/chapterMetadata";
import { SearchPanel } from "../features/search/components/SearchPanel";
import type { Chapter, DocumentData, ReadingBookmark } from "../shared/types/content";

const HOME_FILTER_SUGGESTIONS = [
  "전략",
  "출원",
  "분쟁",
  "운영",
  "국가별",
  "실패 사례"
] as const;

function decodeRouteSegment(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getChapterSearchMatch(chapter: Chapter, rawQuery: string) {
  const query = normalizeSearchText(rawQuery);

  if (!query) {
    return {
      matches: true,
      matchedHeadingTitle: undefined as string | undefined
    };
  }

  const titleMatch = normalizeSearchText(chapter.title).includes(query);
  const summaryMatch = normalizeSearchText(chapter.summary ?? "").includes(query);

  if (titleMatch || summaryMatch) {
    return {
      matches: true,
      matchedHeadingTitle: undefined
    };
  }

  const matchedHeading = flattenOutlineHeadings(chapter.headings).find((item) =>
    normalizeSearchText(item.title).includes(query)
  );

  return {
    matches: Boolean(matchedHeading),
    matchedHeadingTitle: matchedHeading?.title
  };
}

type ReaderShellOutletContext = {
  syncCurrentSectionId: (sectionId?: string) => void;
};

function getTrackedSectionId(targets: HTMLElement[]) {
  const threshold = window.innerWidth <= 640 ? 144 : 168;
  const viewportFloor = window.innerHeight - Math.min(112, window.innerHeight * 0.16);
  const headingPositions = targets.map((target) => ({
    id: target.id,
    top: target.getBoundingClientRect().top
  }));
  const firstVisibleHeading = headingPositions.find(
    (heading) => heading.top >= threshold && heading.top <= viewportFloor
  );

  if (firstVisibleHeading) {
    return firstVisibleHeading.id;
  }

  for (let index = headingPositions.length - 1; index >= 0; index -= 1) {
    const heading = headingPositions[index];

    if (heading && heading.top <= threshold) {
      return heading.id;
    }
  }

  return headingPositions[0]?.id;
}

function ReaderShell({ documentData }: { documentData: DocumentData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const chapters = documentData.chapters;
  const chapterMatch = matchPath("/chapter/:chapterSlug", location.pathname);
  const currentChapterSlug = decodeRouteSegment(chapterMatch?.params.chapterSlug);
  const routeSectionId = decodeRouteSegment(location.hash.replace(/^#/, "")) || undefined;
  const [currentSectionId, setCurrentSectionId] = useState<string | undefined>(routeSectionId);

  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!currentChapterSlug) {
      setCurrentSectionId(undefined);
      return;
    }

    if (routeSectionId) {
      setCurrentSectionId(routeSectionId);
    }
  }, [currentChapterSlug, routeSectionId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const isMobileViewport = window.matchMedia("(max-width: 920px)").matches;

    if (!isMobileViewport) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isNavOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNavOpen]);

  const navigateToSection = (chapterSlug: string, sectionId?: string) => {
    navigate({
      pathname: `/chapter/${chapterSlug}`,
      hash: sectionId ? `#${sectionId}` : ""
    });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-kicker">중남미 상표 실무 가이드</span>
          <NavLink className="brand-link" to="/">
            {documentData.meta.title}
          </NavLink>
        </div>
        <div className="topbar-actions">
          <button
            className="topbar-button mobile-only"
            type="button"
            onClick={() => setIsNavOpen((open) => !open)}
          >
            목차
          </button>
          <SearchPanel onNavigate={navigateToSection} />
        </div>
      </header>

      <div className="reader-layout">
        <aside
          className={`left-rail ${isNavOpen ? "open" : ""}`}
          aria-hidden={isNavOpen ? undefined : true}
        >
          <SidebarNav
            chapters={chapters}
            currentChapterSlug={currentChapterSlug}
            currentSectionId={currentSectionId}
            onNavigate={() => setIsNavOpen(false)}
          />
        </aside>

        <main className="content-pane">
          <Outlet context={{ syncCurrentSectionId: setCurrentSectionId }} />
          <footer className="reader-layout" style={{ paddingTop: 0 }}>
            <div />
            <div>
              <div className="disclaimer">
                <strong>법적 고지:</strong> 이 가이드는 일반적인 정보 제공 목적이며 법률 자문이 아닙니다.
                수록된 정보는 작성 시점 기준이며, 법령·판례 변경에 따라 내용이 달라질 수 있습니다.
                구체적인 법률 문제는 자격 있는 변호사 또는 변리사에게 문의하시기 바랍니다.
                저자와 독자 사이에는 변호사·의뢰인 관계가 성립하지 않습니다.
              </div>
            </div>
          </footer>
        </main>
      </div>

      {isNavOpen && (
        <button
          className="mobile-scrim"
          type="button"
          aria-label="열린 패널 닫기"
          onClick={() => {
            setIsNavOpen(false);
          }}
        />
      )}
    </div>
  );
}

type HomePageProps = {
  documentData: DocumentData;
  readingBookmark: ReadingBookmark | null;
};

function HomePage({ documentData, readingBookmark }: HomePageProps) {
  const chapters = documentData.chapters;
  const [catalogQuery, setCatalogQuery] = useState("");
  const deferredCatalogQuery = useDeferredValue(catalogQuery);
  const continueChapter = readingBookmark
    ? chapters.find((chapter) => chapter.slug === readingBookmark.chapterSlug)
    : undefined;
  const continueTimestamp = readingBookmark
    ? formatBookmarkTimestamp(readingBookmark.updatedAt)
    : "";
  const filteredChapters = chapters
    .map((chapter) => {
      const match = getChapterSearchMatch(chapter, deferredCatalogQuery);

      return {
        chapter,
        meta: getChapterMeta(chapter),
        match
      };
    })
    .filter((entry) => entry.match.matches);

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
            to={{
              pathname: `/chapter/${continueChapter.slug}`,
              hash: readingBookmark.sectionId ? `#${readingBookmark.sectionId}` : ""
            }}
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
            {filteredChapters.length} / {chapters.length}개 챕터
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
                to={`/chapter/${chapter.slug}`}
              >
                <div className="chapter-card-header">
                  <div className="chapter-card-badges">
                    <span className="chapter-card-number">
                      {chapterNumber ?? "A"}
                    </span>
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

type ChapterPageProps = {
  documentData: DocumentData;
  onReadingBookmarkChange: (bookmark: ReadingBookmark) => void;
};

function ChapterPage({ documentData, onReadingBookmarkChange }: ChapterPageProps) {
  const { chapterSlug } = useParams();
  const location = useLocation();
  const { syncCurrentSectionId } = useOutletContext<ReaderShellOutletContext>();
  const chapters = documentData.chapters;
  const normalizedChapterSlug = decodeRouteSegment(chapterSlug);
  const articleRef = useRef<HTMLElement | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(
    () => location.hash.replace(/^#/, "") || undefined
  );
  const [readingProgress, setReadingProgress] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  const chapter = normalizedChapterSlug
    ? chapters.find((entry) => entry.slug === normalizedChapterSlug)
    : undefined;
  const outlineItems = chapter ? flattenOutlineHeadings(chapter.headings) : [];
  const firstOutlineId = outlineItems[0]?.id;
  const outlineSignature = outlineItems.map((item) => item.id).join("|");
  const chapterMeta = chapter ? getChapterMeta(chapter) : null;
  const chapterStage = chapter ? getChapterStage(chapter.title) : null;
  const chapterNumber = chapter ? getChapterNumber(chapter.title) : null;
  const progressBucket = Math.round(readingProgress / 5) * 5;
  const activeOutlineItem = outlineItems.find((item) => item.id === activeSectionId);
  const commitReadingBookmark = useEffectEvent((bookmark: ReadingBookmark) => {
    onReadingBookmarkChange(bookmark);
  });
  const handleScrollToTop = useEffectEvent(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  const handleCopyCurrentLink = useEffectEvent(async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  });

  useEffect(() => {
    if (!chapter) {
      return undefined;
    }

    const anchor = location.hash.replace(/^#/, "");

    if (!anchor) {
      window.scrollTo({ top: 0 });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(anchor);
      target?.scrollIntoView({ block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [chapter, normalizedChapterSlug, location.hash]);

  useEffect(() => {
    if (!chapter) {
      setActiveSectionId(undefined);
      return;
    }

    const anchor = location.hash.replace(/^#/, "");

    if (anchor) {
      setActiveSectionId(anchor);
      return;
    }

    setActiveSectionId(firstOutlineId);
  }, [chapter, firstOutlineId, location.hash, normalizedChapterSlug]);

  useEffect(() => {
    if (!chapter) {
      return undefined;
    }

    let frameId = 0;
    let timeoutId = 0;

    const collectTargets = () =>
      outlineItems
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => Boolean(element));

    const updateActiveSection = () => {
      const targets = collectTargets();

      if (targets.length === 0) {
        return;
      }

      const nextActiveSectionId = getTrackedSectionId(targets);

      if (nextActiveSectionId) {
        setActiveSectionId(nextActiveSectionId);
      }
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateActiveSection, 120);
    };

    updateActiveSection();
    timeoutId = window.setTimeout(updateActiveSection, 180);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [chapter, outlineSignature]);

  useEffect(() => {
    syncCurrentSectionId(activeSectionId);
  }, [activeSectionId, syncCurrentSectionId]);

  useEffect(() => {
    if (!chapter) {
      setReadingProgress(0);
      return undefined;
    }

    let frameId = 0;

    const updateProgress = () => {
      const articleElement = articleRef.current;

      if (!articleElement) {
        setReadingProgress(0);
        return;
      }

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const maxScrollableDistance = Math.max(articleHeight - viewportHeight * 0.45, 1);
      const nextProgress = ((scrollTop - articleTop + viewportHeight * 0.22) / maxScrollableDistance) * 100;

      setReadingProgress(Math.max(0, Math.min(100, nextProgress)));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [chapter]);

  useEffect(() => {
    if (copyState === "idle") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyState]);

  useEffect(() => {
    if (!chapter) {
      return;
    }

    commitReadingBookmark({
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      sectionId: activeSectionId,
      sectionTitle: activeOutlineItem?.title,
      progress: Math.max(0, Math.min(100, progressBucket)),
      updatedAt: new Date().toISOString()
    });
  }, [activeOutlineItem?.title, activeSectionId, chapter, outlineSignature, progressBucket]);

  if (!normalizedChapterSlug || !chapter) {
    return <Navigate to="/" replace />;
  }

  const currentIndex = chapters.findIndex((c) => c.slug === normalizedChapterSlug);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="chapter-page">
      <ReadingProgressBar progress={readingProgress} />
      <section className="chapter-header">
        <div className="chapter-header-grid">
          <div className="chapter-header-copy">
            <div className="chapter-header-topline">
              <p className="chapter-eyebrow">읽는 중</p>
              {chapterStage ? (
                <span className={`chapter-stage-chip chapter-stage-chip--${chapterStage.key}`}>
                  {chapterStage.label}
                </span>
              ) : null}
            </div>
            <h1>{chapter.title}</h1>
            {chapter.summary ? <p className="chapter-summary">{chapter.summary}</p> : null}
          </div>
          {chapterMeta ? (
            <div className="chapter-header-stats" aria-label="챕터 메타 정보">
              <div className="chapter-stat-card">
                <span className="chapter-stat-label">순서</span>
                <strong className="chapter-stat-value">
                  {chapterNumber ?? currentIndex + 1} / {chapters.length}
                </strong>
              </div>
              <div className="chapter-stat-card">
                <span className="chapter-stat-label">섹션</span>
                <strong className="chapter-stat-value">{chapterMeta.sectionCount}개</strong>
              </div>
              <div className="chapter-stat-card">
                <span className="chapter-stat-label">읽기 시간</span>
                <strong className="chapter-stat-value">약 {chapterMeta.readingMinutes}분</strong>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <ChapterOutline
        chapterSlug={chapter.slug}
        headings={chapter.headings}
        activeSectionId={activeSectionId}
      />
      <MarkdownArticle chapter={chapter} articleRef={articleRef} />
      <ReaderActionBar
        activeSectionTitle={activeOutlineItem?.title}
        copyState={copyState}
        onCopyLink={handleCopyCurrentLink}
        onScrollToTop={handleScrollToTop}
        visible={readingProgress >= 20}
      />
      <nav className="chapter-nav" aria-label="챕터 탐색">
        {prevChapter ? (
          <Link className="chapter-nav-btn" to={`/chapter/${prevChapter.slug}`}>
            <span className="chapter-nav-label">← 이전</span>
            <span className="chapter-nav-title">{prevChapter.title}</span>
          </Link>
        ) : <div />}
        {nextChapter ? (
          <Link className="chapter-nav-btn chapter-nav-btn--next" to={`/chapter/${nextChapter.slug}`}>
            <span className="chapter-nav-label">다음 →</span>
            <span className="chapter-nav-title">{nextChapter.title}</span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}

type StatusPageProps = {
  title: string;
  message: string;
};

function StatusPage({ title, message }: StatusPageProps) {
  return (
    <div className="status-page">
      <section className="status-card">
        <p className="hero-kicker">LatTm Reader</p>
        <h1 className="status-title">{title}</h1>
        <p className="status-message">{message}</p>
      </section>
    </div>
  );
}

export default function App() {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [readingBookmark, setReadingBookmark] = useState<ReadingBookmark | null>(null);

  useEffect(() => {
    let isCancelled = false;

    loadDocumentData()
      .then((nextDocumentData) => {
        if (isCancelled) {
          return;
        }

        setDocumentData(nextDocumentData);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "문서 데이터를 불러오지 못했습니다."
        );
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    setReadingBookmark(loadReadingBookmark());
  }, []);

  const handleReadingBookmarkChange = (bookmark: ReadingBookmark) => {
    saveReadingBookmark(bookmark);
    setReadingBookmark(bookmark);
  };

  if (loadError) {
    return (
      <StatusPage
        title="문서를 불러오지 못했습니다"
        message={loadError}
      />
    );
  }

  if (!documentData) {
    return (
      <StatusPage
        title="문서를 준비하고 있습니다"
        message="로컬 콘텐츠와 목차를 불러오는 중입니다."
      />
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<ReaderShell documentData={documentData} />}>
          <Route
            index
            element={
              <HomePage
                documentData={documentData}
                readingBookmark={readingBookmark}
              />
            }
          />
          <Route
            path="chapter/:chapterSlug"
            element={
              <ChapterPage
                documentData={documentData}
                onReadingBookmarkChange={handleReadingBookmarkChange}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
