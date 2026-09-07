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
  DraftNotice,
  ReaderProvenanceNote
} from "./configuredReaderHomeSections";
import { products } from "./registry";
import {
  buildProductStatusLabel,
  buildChapterPageTitle,
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
  let activeScrollGeneration = 0;
  let activeScrollFrameId = 0;
  let releaseActiveScrollCorrection: (() => void) | null = null;
  // 이동 원인은 `behavior` 인자만으로 구분되지 않는다. 목차 클릭은 hash를 바꾸고, 그 hash 변경이
  // ChapterPage의 같은 effect로 흘러 들어오기 때문이다. 그래서 원인을 표시해 두고 effect가 소비한다.
  let requestedScrollBehavior: ScrollBehavior | null = null;

  function useReader() {
    const value = useContext(ReaderContext);

    if (!value) {
      throw new Error(`${productMeta.shortLabel} reader context is unavailable.`);
    }

    return value;
  }

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined"
      && typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // `behavior: "auto"`는 `html { scroll-behavior: smooth }`(LatTm/src/styles.css) 아래에서
  // 여전히 애니메이션으로 해석된다. 즉시 이동이 필요한 경로는 "instant"를 명시해야 한다.
  function resolveScrollBehavior(behavior: ScrollBehavior): ScrollBehavior {
    return prefersReducedMotion() ? "instant" : behavior;
  }

  function requestScrollBehavior(behavior: ScrollBehavior) {
    requestedScrollBehavior = behavior;
  }

  function consumeRequestedScrollBehavior(): ScrollBehavior {
    const behavior = requestedScrollBehavior ?? "instant";

    requestedScrollBehavior = null;

    return behavior;
  }

  // 도착 기준선은 대상 제목에 적용된 `scroll-margin-top`을 그대로 읽는다. 브라우저가 실제
  // 스크롤에 쓰는 값과 판정 값이 정의상 같아져서, CSS와 JS가 다시 어긋날 수 없다.
  function getAnchorClearance(target: HTMLElement) {
    const parsed = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function isDocumentScrolledToEnd() {
    const maxScrollTop = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

    return window.scrollY >= maxScrollTop - 1;
  }

  function hasReachedSection(target: HTMLElement) {
    const clearance = getAnchorClearance(target);
    const { top } = target.getBoundingClientRect();
    // 서브픽셀 오차 + 스크롤 앵커링 여유.
    const arrivalBand = Math.max(48, window.innerHeight * 0.25);

    if (top >= clearance - 2 && top <= clearance + arrivalBand) {
      return true;
    }

    // 문서 끝에서는 모든 제목을 clearance 선까지 올릴 수 없다. 더 스크롤할 여지가 없으면
    // 그 자리가 도달 가능한 최선이므로 도착으로 본다(마지막 절에서 영구 실패하지 않게).
    return isDocumentScrolledToEnd() && top <= clearance + arrivalBand;
  }

  function cancelActiveScrollCorrection() {
    activeScrollGeneration += 1;

    if (typeof window !== "undefined") {
      window.cancelAnimationFrame(activeScrollFrameId);
    }

    releaseActiveScrollCorrection?.();
    releaseActiveScrollCorrection = null;
  }

  function scrollToSection(sectionId: string, behavior: ScrollBehavior) {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    cancelActiveScrollCorrection();

    const generation = activeScrollGeneration;
    const resolvedBehavior = resolveScrollBehavior(behavior);
    // 보정에 쓸 수 있는 최대 시간. 이 안에 못 맞추면 더 매달리지 않고 종료한다.
    const correctionDeadline =
      performance.now() + (resolvedBehavior === "smooth" ? 1200 : 600);

    let isCancelled = false;
    let previousScrollY = Number.NaN;
    let hasCheckedAfterFonts = false;

    const abortOnUserScroll = () => {
      // 사용자가 직접 스크롤을 시작하면 자동 보정은 그 자리에서 멈춘다.
      isCancelled = true;
    };
    const abortOnScrollKey = (event: KeyboardEvent) => {
      const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar"
      ];

      if (scrollKeys.includes(event.key)) {
        isCancelled = true;
      }
    };

    window.addEventListener("wheel", abortOnUserScroll, { passive: true });
    window.addEventListener("touchstart", abortOnUserScroll, { passive: true });
    window.addEventListener("keydown", abortOnScrollKey);

    const detachAbortListeners = () => {
      window.removeEventListener("wheel", abortOnUserScroll);
      window.removeEventListener("touchstart", abortOnUserScroll);
      window.removeEventListener("keydown", abortOnScrollKey);
    };

    releaseActiveScrollCorrection = detachAbortListeners;

    const releaseProgrammaticScroll = (delayMs: number) => {
      window.clearTimeout(programmaticScrollResetId);
      programmaticScrollResetId = window.setTimeout(() => {
        isProgrammaticScrollActive = false;
      }, delayMs);
    };

    const finish = () => {
      detachAbortListeners();

      if (releaseActiveScrollCorrection === detachAbortListeners) {
        releaseActiveScrollCorrection = null;
      }

      releaseProgrammaticScroll(resolvedBehavior === "smooth" ? 420 : 120);
    };

    const issueScroll = (target: HTMLElement) => {
      target.scrollIntoView({
        block: "start",
        behavior: resolvedBehavior
      });
    };

    // 폰트 swap은 재시도 종료 뒤에도 일어나 레이아웃을 밀 수 있다. `document.fonts.ready`
    // (표준 API, 의존성 0) 이후 **1회만** 다시 확인하고, 그 뒤로는 보정하지 않는다.
    const recheckAfterFonts = () => {
      if (hasCheckedAfterFonts || isCancelled || generation !== activeScrollGeneration) {
        return;
      }

      hasCheckedAfterFonts = true;

      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;

      if (!fonts?.ready) {
        return;
      }

      fonts.ready
        .then(() => {
          if (isCancelled || generation !== activeScrollGeneration) {
            return;
          }

          const target = document.getElementById(sectionId);

          if (target && !hasReachedSection(target)) {
            target.scrollIntoView({ block: "start", behavior: "instant" });
          }
        })
        .catch(() => {
          // 폰트 로딩 실패는 읽기를 막지 않는다.
        });
    };

    isProgrammaticScrollActive = true;

    const step = () => {
      if (isCancelled || generation !== activeScrollGeneration) {
        finish();
        return;
      }

      const target = document.getElementById(sectionId);

      if (!target) {
        finish();
        return;
      }

      if (hasReachedSection(target)) {
        finish();
        recheckAfterFonts();
        return;
      }

      if (performance.now() >= correctionDeadline) {
        finish();
        recheckAfterFonts();
        return;
      }

      const currentScrollY = window.scrollY;
      const hasScrollSettled = currentScrollY === previousScrollY;

      previousScrollY = currentScrollY;

      // 진행 중인 스크롤 애니메이션을 매 프레임 재발행하면 애니메이션이 계속 처음부터 다시
      // 시작한다. 멎었는데도 도착하지 않은 경우에만 다시 발행한다.
      if (hasScrollSettled) {
        issueScroll(target);
      }

      activeScrollFrameId = window.requestAnimationFrame(step);
    };

    const target = document.getElementById(sectionId);

    if (!target) {
      finish();
      return;
    }

    issueScroll(target);
    activeScrollFrameId = window.requestAnimationFrame(step);
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

      const body = document.body;
      const previousOverflow = document.body.style.overflow;
      const previousOverscrollBehavior = document.body.style.overscrollBehavior;
      if (isNavOpen) {
        body.classList.add("reader-mobile-nav-open");
        body.style.overflow = "hidden";
        body.style.overscrollBehavior = "none";
      }

      return () => {
        body.classList.remove("reader-mobile-nav-open");
        body.style.overflow = previousOverflow;
        body.style.overscrollBehavior = previousOverscrollBehavior;
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

    // 기본값은 즉시 이동이다. 직접 URL, 검색 결과, 이어 읽기, 리포트 딥링크는 모두 "도착"이
    // 목적이라 애니메이션이 이득이 없다. 부드러운 이동은 사용자가 목차를 눌러 현재 문서 안에서
    // 위치를 옮길 때만 쓴다(jumpToSection).
    const navigateToSection = (
      chapterSlug: string,
      sectionId?: string,
      behavior: ScrollBehavior = "instant"
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
            behavior: resolveScrollBehavior(behavior)
          });
        }

        return;
      }

      // hash가 바뀌면 ChapterPage의 앵커 effect가 이동을 수행한다. behavior 인자만으로는
      // 목차 클릭과 딥링크가 구분되지 않으므로 이동 원인을 남겨 effect가 소비하게 한다.
      requestScrollBehavior(behavior);
      navigate(sectionLocation);

      if (!sectionId && typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: resolveScrollBehavior(behavior)
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
              onSectionJump={jumpToSection}
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
      isProgrammaticScrollActive: () => isProgrammaticScrollActive,
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

      // prerender와 같은 제목을 만든다. 여기서 chapter.title만 쓰면 hydration 직후 SPA가
      // 관할 라벨이 붙은 prerender 제목을 덮어써서 중복 제목이 되살아난다.
      setRuntimeDocumentTitle(buildChapterPageTitle(productMeta, chapter));

      const anchor = decodeRouteSegment(location.hash.replace(/^#/, "")) || "";

      if (!anchor) {
        cancelActiveScrollCorrection();
        window.scrollTo({ top: 0 });
        return undefined;
      }

      scrollToSection(anchor, consumeRequestedScrollBehavior());

      // 새 이동·장 전환·언마운트 시 이전 보정 루프(rAF와 이벤트 리스너)를 반드시 취소한다.
      return () => {
        cancelActiveScrollCorrection();
      };
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
              <ReaderProvenanceNote factsReviewedOn={productMeta.factsReviewedOn} />
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
          onSectionJump={jumpToSection}
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
        <section className="hero-card" data-reader-home-section="hero">
          <p className="hero-kicker">{config.homeHeroKicker}</p>
          <h1>{documentData.meta.title}</h1>
          <p className="hero-summary">{config.homeSummary}</p>
          <div className="hero-meta">
            <span>총 {documentData.meta.chapterCount}개 챕터</span>
            <span>{buildProductStatusLabel(productMeta)}</span>
          </div>
          <ReaderProvenanceNote factsReviewedOn={productMeta.factsReviewedOn} />
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

        {/* 이 가이드에 온 사람의 첫 업무는 "읽을 장을 고르는 것"이다. 챕터 목록이 먼저 오고,
            포지셔닝 설명과 교차 관할 리포트 핸드오프가 그 뒤를 잇는다. 이전에는 리포트
            핸드오프가 챕터 목록보다 위에 있어, 이 가이드를 보러 온 사람에게 다른 문서를
            먼저 권하는 순서였다. */}
        <ConfiguredChapterGrid
          chapterBadge={config.chapterBadge}
          chapters={documentData.chapters}
          productPath={productPath}
        />

        <section className="gateway-section" data-reader-home-section="positioning">
          <div className="gateway-section-header">
            <div>
              <p className="gateway-kicker">{config.positioningKicker}</p>
              <h2 className="gateway-section-title">{config.positioningTitle}</h2>
            </div>
          </div>
          <p className="reader-product-note">{config.positioningNote}</p>
        </section>

        <GuideReportHandoffSection
          guideSlug={productMeta.slug}
          reportHandoffs={reportHandoffs}
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
