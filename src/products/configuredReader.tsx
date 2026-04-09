import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import {
  Link,
  Navigate,
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams
} from "react-router-dom";

import {
  getGaMeasurementId,
  trackGaEvent
} from "../analytics/ga";
import {
  getReportsForGuideSlug,
  type GuideReportHandoff
} from "../reports/registry";
import {
  useChapterBookmark,
  useReadingProgress,
  useTrackedActiveSection
} from "./configuredReaderChapterHooks";
import {
  ReaderShellFooter,
  ReaderShellScrim,
  ReaderShellSidebar,
  ReaderShellTopbar
} from "./configuredReaderChrome";
import {
  ConfiguredChapterGrid,
  ContinueReadingCard,
  GuideReportHandoffSection,
  DraftNotice
} from "./configuredReaderHomeSections";
import { products } from "./registry";
import {
  buildProductStatusLabel,
  buildChapterPath,
  buildProductPath,
  buildSectionLocation,
  createDocumentResourceLoaders,
  createReadingBookmarkStorage,
  createSearchController,
  formatBookmarkTimestamp,
  getAdjacentChapters,
  getChapterMeta,
  isPriorityLaneProduct,
  setRuntimeDocumentTitle,
  type Chapter,
  type DocumentData,
  type ProductMeta,
  type ReadingBookmark,
  type SearchEntry
} from "./shared";
import {
  ChapterOutline,
  MarkdownArticle,
  ReaderActionBar,
  ReadingProgressBar,
  StatusPage,
  flattenOutlineHeadings
} from "./components";

type ReaderShellOutletContext = {
  dismissActionBar: () => void;
  isActionBarDismissed: boolean;
  restoreActionBar: () => void;
  syncCurrentSectionId: (sectionId?: string) => void;
  jumpToSection: (sectionId: string) => void;
};

type ReaderContextValue = {
  documentData: DocumentData;
  readingBookmark: ReadingBookmark | null;
  onReadingBookmarkChange: (bookmark: ReadingBookmark) => void;
};

export type ReaderHomePageProps = {
  continueChapter?: Chapter;
  continueTimestamp: string;
  documentData: DocumentData;
  productMeta: ProductMeta;
  readingBookmark: ReadingBookmark | null;
  reportHandoffs?: GuideReportHandoff[];
};

export type ReaderChapterPresentationProps = {
  chapter: Chapter;
  chapterMeta: ReturnType<typeof getChapterMeta>;
  chapters: Chapter[];
  currentIndex: number;
};

type ReaderRuntimeConfig = {
  productSlug: string;
  documentDataUrl: string;
  searchEntriesUrl: string;
  storageKey: string;
  topbarKicker: string;
  loadingMessage: string;
  HomePageComponent: ComponentType<ReaderHomePageProps>;
  renderChapterHeaderTopline?: (props: ReaderChapterPresentationProps) => ReactNode;
  renderChapterOrderValue?: (props: ReaderChapterPresentationProps) => ReactNode;
};

type ReaderConfig = {
  productSlug: string;
  documentDataUrl: string;
  searchEntriesUrl: string;
  storageKey: string;
  topbarKicker: string;
  loadingMessage: string;
  homeHeroKicker: string;
  homeSummary: ReactNode;
  positioningKicker: string;
  positioningTitle: string;
  positioningNote: ReactNode;
  chapterBadge: string;
  chapterEyebrow: string;
  contentStatus?: "draft";
};

const readerActionBarHiddenStorageKey = "glotm_reader_action_bar_hidden";

function loadReaderActionBarDismissed() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(readerActionBarHiddenStorageKey) === "true";
  } catch {
    return false;
  }
}

function saveReaderActionBarDismissed(isDismissed: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (isDismissed) {
      window.localStorage.setItem(readerActionBarHiddenStorageKey, "true");
      return;
    }

    window.localStorage.removeItem(readerActionBarHiddenStorageKey);
  } catch {
    // Ignore storage failures so reading continues uninterrupted.
  }
}

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

export function createReaderRuntime(config: ReaderRuntimeConfig) {
  const productMeta = products.find((product) => product.slug === config.productSlug)!;
  const storage = createReadingBookmarkStorage(config.storageKey);
  const { loadDocumentData, loadSearchEntries } = createDocumentResourceLoaders(
    config.documentDataUrl,
    config.searchEntriesUrl
  );
  const searchController = createSearchController(loadSearchEntries);
  const ReaderContext = createContext<ReaderContextValue | null>(null);
  let programmaticScrollResetId = 0;
  let isProgrammaticScrollActive = false;

  function useReader() {
    const value = useContext(ReaderContext);

    if (!value) {
      throw new Error(`${productMeta.shortLabel} reader context is unavailable.`);
    }

    return value;
  }

  function scrollToSection(sectionId: string, behavior: ScrollBehavior) {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const targetTopThreshold = window.innerWidth <= 640 ? 104 : 136;
    const targetBottomThreshold = Math.max(targetTopThreshold + 24, window.innerHeight * 0.42);

    window.clearTimeout(programmaticScrollResetId);
    isProgrammaticScrollActive = true;

    const isTargetInView = () => {
      const target = document.getElementById(sectionId);

      if (!target) {
        return false;
      }

      const { top } = target.getBoundingClientRect();

      return top >= targetTopThreshold && top <= targetBottomThreshold;
    };

    const scrollTarget = () => {
      const target = document.getElementById(sectionId);

      if (!target) {
        return false;
      }

      target.scrollIntoView({
        block: "start",
        behavior
      });

      return isTargetInView();
    };

    const releaseProgrammaticScroll = (delayMs: number) => {
      window.clearTimeout(programmaticScrollResetId);
      programmaticScrollResetId = window.setTimeout(() => {
        isProgrammaticScrollActive = false;
      }, delayMs);
    };

    const retryScroll = (remainingAttempts: number, shouldReissueScroll: boolean) => {
      const reachedTarget = shouldReissueScroll ? scrollTarget() : isTargetInView();

      if (reachedTarget || remainingAttempts <= 0) {
        releaseProgrammaticScroll(behavior === "smooth" ? 420 : 120);
        return;
      }

      window.requestAnimationFrame(() => {
        retryScroll(remainingAttempts - 1, false);
      });
    };

    retryScroll(8, true);
  }

  function ReaderShell() {
    const { documentData } = useReader();
    const navigate = useNavigate();
    const location = useLocation();
    const chapters = documentData.chapters;
    const productPath = buildProductPath(productMeta);
    const chapterMatch = matchPath(`${productPath}/chapter/:chapterSlug`, location.pathname);
    const currentChapterSlug = decodeRouteSegment(chapterMatch?.params.chapterSlug);
    const routeSectionId = decodeRouteSegment(location.hash.replace(/^#/, "")) || undefined;
    const [currentSectionId, setCurrentSectionId] = useState<string | undefined>(routeSectionId);
    const [isActionBarDismissed, setIsActionBarDismissed] = useState(loadReaderActionBarDismissed);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [mobileNavTopOffset, setMobileNavTopOffset] = useState<string>();

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

      const mobileViewportQuery =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(max-width: 920px)")
          : undefined;
      const isMobileViewport = mobileViewportQuery?.matches ?? false;

      if (!isMobileViewport) {
        return undefined;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = isNavOpen ? "hidden" : previousOverflow;

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, [isNavOpen]);

    useEffect(() => {
      if (!isNavOpen || typeof window === "undefined") {
        return undefined;
      }

      const syncMobileNavTopOffset = () => {
        const isMobileViewport =
          typeof window.matchMedia === "function"
          && window.matchMedia("(max-width: 920px)").matches;

        if (!isMobileViewport) {
          setMobileNavTopOffset(undefined);
          return;
        }

        const globalTopbar = document.querySelector(".global-topbar");

        if (!(globalTopbar instanceof HTMLElement)) {
          setMobileNavTopOffset(undefined);
          return;
        }

        setMobileNavTopOffset(`${Math.ceil(globalTopbar.getBoundingClientRect().bottom + 8)}px`);
      };

      const resizeHandler = () => {
        syncMobileNavTopOffset();
      };
      const frameId = window.requestAnimationFrame(syncMobileNavTopOffset);

      window.addEventListener("resize", resizeHandler);

      return () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resizeHandler);
      };
    }, [isNavOpen, location.pathname]);

    useEffect(() => {
      if (!isNavOpen || typeof window === "undefined") {
        return undefined;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsNavOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isNavOpen]);

    useEffect(() => {
      if (!currentChapterSlug) {
        setRuntimeDocumentTitle(productMeta.title);
      }
    }, [currentChapterSlug]);

    const navigateToSection = (
      chapterSlug: string,
      sectionId?: string,
      behavior: ScrollBehavior = "auto"
    ) => {
      const sectionLocation = buildSectionLocation(productPath, chapterSlug, sectionId);
      const isSameLocation =
        location.pathname === sectionLocation.pathname
        && location.hash === sectionLocation.hash;

      setIsNavOpen(false);

      if (isSameLocation) {
        if (sectionId) {
          scrollToSection(sectionId, behavior);
        } else if (typeof window !== "undefined") {
          window.scrollTo({
            top: 0,
            behavior
          });
        }

        return;
      }

      navigate(sectionLocation);

      if (!sectionId && typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior
        });
      }
    };
    const jumpToSection = useEffectEvent((sectionId: string) => {
      if (!currentChapterSlug) {
        return;
      }

      setCurrentSectionId(sectionId);
      navigateToSection(currentChapterSlug, sectionId, "smooth");
    });
    const trackReaderSearchEvent = useEffectEvent(
      (eventName: string, params: Record<string, string | number | boolean | undefined>) => {
        const measurementId = getGaMeasurementId();

        if (!measurementId) {
          return;
        }

        trackGaEvent(measurementId, eventName, {
          product_slug: productMeta.slug,
          surface: "reader_search",
          ...params
        });
      }
    );
    const handleSearchSubmit = useEffectEvent((query: string, resultCount: number) => {
      trackReaderSearchEvent("search_submit", {
        query_length: query.length,
        result_count: resultCount
      });

      if (resultCount === 0) {
        trackReaderSearchEvent("search_zero_result", {
          query_length: query.length
        });
      }
    });
    const handleSearchResultSelect = useEffectEvent((result: SearchEntry) => {
      trackReaderSearchEvent("search_result_click", {
        chapter_slug: result.chapterSlug,
        section_id: result.sectionId,
        section_title: result.sectionTitle
      });
    });

    const closeNavigation = useEffectEvent(() => {
      setIsNavOpen(false);
    });
    const dismissActionBar = () => {
      setIsActionBarDismissed(true);
      saveReaderActionBarDismissed(true);
    };
    const restoreActionBar = () => {
      setIsActionBarDismissed(false);
      saveReaderActionBarDismissed(false);
    };

    return (
      <div className="reader-shell">
        <div className="app-shell">
          <ReaderShellTopbar
              currentChapterSlug={currentChapterSlug}
              isActionBarDismissed={isActionBarDismissed}
              isNavOpen={isNavOpen}
              onRestoreActionBar={restoreActionBar}
              onSearchResultSelect={handleSearchResultSelect}
              onSearchSubmit={handleSearchSubmit}
            onToggleNav={() => setIsNavOpen((open) => !open)}
            productPath={productPath}
            searchContent={searchController.searchContent}
            title={documentData.meta.title}
            topbarKicker={config.topbarKicker}
            warmSearchContent={searchController.warmSearchContent}
            onNavigateToSection={navigateToSection}
          />

          <div className="reader-layout">
            <ReaderShellSidebar
              chapters={chapters}
              currentChapterSlug={currentChapterSlug}
              currentSectionId={currentSectionId}
              mobileTopOffset={mobileNavTopOffset}
              onClose={closeNavigation}
              isNavOpen={isNavOpen}
              onNavigate={closeNavigation}
              productPath={productPath}
            />

            <main className="content-pane">
              <Outlet
                context={{
                  dismissActionBar,
                  isActionBarDismissed,
                  restoreActionBar,
                  syncCurrentSectionId: setCurrentSectionId,
                  jumpToSection
                }}
              />
              <ReaderShellFooter />
            </main>
          </div>

          <ReaderShellScrim isNavOpen={isNavOpen} onClose={closeNavigation} />
        </div>
      </div>
    );
  }

  function ReaderRoot() {
    const [documentData, setDocumentData] = useState<DocumentData | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [readingBookmark, setReadingBookmark] = useState<ReadingBookmark | null>(null);

    useEffect(() => {
      let isCancelled = false;

      loadDocumentData()
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
                : "문서 데이터를 불러오지 못했습니다."
            );
          }
        });

      return () => {
        isCancelled = true;
      };
    }, []);

    useEffect(() => {
      setReadingBookmark(storage.loadReadingBookmark());
    }, []);

    if (loadError) {
      return (
        <StatusPage
          kicker={productMeta.shortLabel}
          title="문서를 불러오지 못했습니다"
          message={loadError}
        />
      );
    }

    if (!documentData) {
      return (
        <StatusPage
          kicker={productMeta.shortLabel}
          title="문서를 준비하고 있습니다"
          message={config.loadingMessage}
        />
      );
    }

    const handleReadingBookmarkChange = (bookmark: ReadingBookmark) => {
      storage.saveReadingBookmark(bookmark);
      setReadingBookmark(bookmark);
    };

    return (
      <ReaderContext.Provider
        value={{
          documentData,
          readingBookmark,
          onReadingBookmarkChange: handleReadingBookmarkChange
        }}
      >
        <ReaderShell />
      </ReaderContext.Provider>
    );
  }

  function HomePage() {
    const { documentData, readingBookmark } = useReader();
    const continueChapter = readingBookmark
      ? documentData.chapters.find((chapter) => chapter.slug === readingBookmark.chapterSlug)
      : undefined;
    const continueTimestamp = readingBookmark
      ? formatBookmarkTimestamp(readingBookmark.updatedAt)
      : "";
    const reportHandoffs = isPriorityLaneProduct(productMeta)
      ? getReportsForGuideSlug(productMeta.slug).slice(0, 2)
      : [];

    useEffect(() => {
      setRuntimeDocumentTitle(productMeta.title);
    }, []);

    return (
      <config.HomePageComponent
        continueChapter={continueChapter}
        continueTimestamp={continueTimestamp}
        documentData={documentData}
        productMeta={productMeta}
        readingBookmark={readingBookmark}
        reportHandoffs={reportHandoffs}
      />
    );
  }

  function ChapterPage() {
    const { documentData, onReadingBookmarkChange } = useReader();
    const { chapterSlug } = useParams();
    const location = useLocation();
    const {
      dismissActionBar,
      isActionBarDismissed,
      syncCurrentSectionId,
      jumpToSection
    } = useOutletContext<ReaderShellOutletContext>();
    const chapters = documentData.chapters;
    const normalizedChapterSlug = decodeRouteSegment(chapterSlug);
    const articleRef = useRef<HTMLElement | null>(null);
    const routeSectionId = decodeRouteSegment(location.hash.replace(/^#/, "")) || undefined;

    const chapter = normalizedChapterSlug
      ? chapters.find((entry) => entry.slug === normalizedChapterSlug)
      : undefined;
    const productPath = buildProductPath(productMeta);
    const outlineItems = useMemo(
      () => (chapter ? flattenOutlineHeadings(chapter.headings) : []),
      [chapter]
    );
    const firstOutlineId = outlineItems[0]?.id;
    const outlineSignature = outlineItems.map((item) => item.id).join("|");
    const chapterMeta = chapter ? getChapterMeta(chapter) : null;
    const [activeSectionId] = useTrackedActiveSection({
      chapter,
      firstOutlineId,
      hasLocationHash: Boolean(location.hash),
      initialSectionId: routeSectionId,
      isProgrammaticScrollActive,
      outlineItems,
      outlineSignature,
      syncCurrentSectionId
    });
    const readingProgress = useReadingProgress({
      articleRef,
      chapter
    });
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
    useEffect(() => {
      if (!chapter) {
        return undefined;
      }

      setRuntimeDocumentTitle(chapter.title);

      const anchor = decodeRouteSegment(location.hash.replace(/^#/, "")) || "";

      if (!anchor) {
        window.scrollTo({ top: 0 });
        return;
      }

      scrollToSection(anchor, "auto");
    }, [chapter, location.hash]);
    useChapterBookmark({
      activeSectionId,
      activeSectionTitle: activeOutlineItem?.title,
      chapter,
      commitReadingBookmark,
      progressBucket
    });

    if (!normalizedChapterSlug || !chapter) {
      return <Navigate to={buildProductPath(productMeta)} replace />;
    }

    const { currentIndex, prevChapter, nextChapter } = getAdjacentChapters(
      chapters,
      normalizedChapterSlug
    );
    const chapterPresentation = {
      chapter,
      chapterMeta: chapterMeta ?? getChapterMeta(chapter),
      chapters,
      currentIndex
    };
    const chapterHeaderTopline = config.renderChapterHeaderTopline?.(chapterPresentation);
    const chapterOrderValue =
      config.renderChapterOrderValue?.(chapterPresentation) ?? currentIndex + 1;

    return (
      <div className="chapter-page">
        <ReadingProgressBar progress={readingProgress} />
        <section className="chapter-header">
          <div className="chapter-header-grid">
            <div className="chapter-header-copy">
              <div className="chapter-header-topline">{chapterHeaderTopline}</div>
              <h1>{chapter.title}</h1>
              {chapter.summary ? <p className="chapter-summary">{chapter.summary}</p> : null}
            </div>
            {chapterMeta ? (
              <div className="chapter-header-stats" aria-label="챕터 메타 정보">
                <div className="chapter-stat-card">
                  <span className="chapter-stat-label">순서</span>
                  <strong className="chapter-stat-value">
                    {chapterOrderValue} / {chapters.length}
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
          basePath={productPath}
          chapterSlug={chapter.slug}
          headings={chapter.headings}
          activeSectionId={activeSectionId}
        />
        <MarkdownArticle chapter={chapter} articleRef={articleRef} />
        <ReaderActionBar
          activeSectionTitle={activeOutlineItem?.title}
          onDismiss={dismissActionBar}
          onScrollToTop={handleScrollToTop}
          visible={readingProgress >= 20 && !isActionBarDismissed}
        />
        <nav className="chapter-nav" aria-label="챕터 탐색">
          {prevChapter ? (
            <Link className="chapter-nav-btn" to={buildChapterPath(productPath, prevChapter.slug)}>
              <span className="chapter-nav-label">← 이전</span>
              <span className="chapter-nav-title">{prevChapter.title}</span>
            </Link>
          ) : <div />}
          {nextChapter ? (
            <Link
              className="chapter-nav-btn chapter-nav-btn--next"
              to={buildChapterPath(productPath, nextChapter.slug)}
            >
              <span className="chapter-nav-label">다음 →</span>
              <span className="chapter-nav-title">{nextChapter.title}</span>
            </Link>
          ) : null}
        </nav>
      </div>
    );
  }

  return {
    ReaderRoot,
    HomePage,
    ChapterPage,
    loadDocumentData,
    loadSearchEntries,
    productMeta
  };
}

export function createConfiguredReader(config: ReaderConfig) {
  function ConfiguredHomePage({
    continueChapter,
    continueTimestamp,
    documentData,
    productMeta,
    readingBookmark,
    reportHandoffs
  }: ReaderHomePageProps) {
    const productPath = buildProductPath(productMeta);

    return (
      <div className="home-page">
        <section className="hero-card">
          <p className="hero-kicker">{config.homeHeroKicker}</p>
          <h1>{documentData.meta.title}</h1>
          <p className="hero-summary">{config.homeSummary}</p>
          <div className="hero-meta">
            <span>총 {documentData.meta.chapterCount}개 챕터</span>
            <span>{buildProductStatusLabel(productMeta)}</span>
          </div>
        </section>

        {continueChapter && readingBookmark ? (
          <ContinueReadingCard
            continueChapter={continueChapter}
            continueTimestamp={continueTimestamp}
            productPath={productPath}
            readingBookmark={readingBookmark}
          />
        ) : null}

        {config.contentStatus === "draft" ? <DraftNotice /> : null}

        <GuideReportHandoffSection
          guideSlug={productMeta.slug}
          reportHandoffs={reportHandoffs}
        />

        <section className="gateway-section">
          <div className="gateway-section-header">
            <div>
              <p className="gateway-kicker">{config.positioningKicker}</p>
              <h2 className="gateway-section-title">{config.positioningTitle}</h2>
            </div>
          </div>
          <p className="reader-product-note">{config.positioningNote}</p>
        </section>

        <ConfiguredChapterGrid
          chapterBadge={config.chapterBadge}
          chapters={documentData.chapters}
          productPath={productPath}
        />
      </div>
    );
  }

  return createReaderRuntime({
    productSlug: config.productSlug,
    documentDataUrl: config.documentDataUrl,
    searchEntriesUrl: config.searchEntriesUrl,
    storageKey: config.storageKey,
    topbarKicker: config.topbarKicker,
    loadingMessage: config.loadingMessage,
    HomePageComponent: ConfiguredHomePage,
    renderChapterHeaderTopline: () => (
      <p className="chapter-eyebrow">{config.chapterEyebrow}</p>
    )
  });
}
