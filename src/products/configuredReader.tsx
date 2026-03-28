import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams
} from "react-router-dom";

import { products } from "./registry";
import {
  buildChapterPath,
  buildProductPath,
  buildSectionLocation,
  createDocumentResourceLoaders,
  createReadingBookmarkStorage,
  createSearchController,
  formatBookmarkTimestamp,
  getAdjacentChapters,
  getChapterMeta,
  getTrackedSectionId,
  setRuntimeDocumentTitle,
  type Chapter,
  type DocumentData,
  type ProductMeta,
  type ReadingBookmark
} from "./shared";
import {
  ChapterOutline,
  MarkdownArticle,
  ReaderActionBar,
  ReadingProgressBar,
  SearchPanel,
  SidebarNav,
  StatusPage,
  flattenOutlineHeadings
} from "./components";

type ReaderShellOutletContext = {
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
  homeStatusLabel: string;
  positioningKicker: string;
  positioningTitle: string;
  positioningNote: ReactNode;
  chapterBadge: string;
  chapterEyebrow: string;
};

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

  function useReader() {
    const value = useContext(ReaderContext);

    if (!value) {
      throw new Error(`${productMeta.shortLabel} reader context is unavailable.`);
    }

    return value;
  }

  function scrollToSection(sectionId: string, behavior: ScrollBehavior) {
    if (typeof document === "undefined") {
      return;
    }

    const scrollTarget = () => {
      const target = document.getElementById(sectionId);

      if (!target) {
        return false;
      }

      target.scrollIntoView({
        block: "start",
        behavior
      });

      return true;
    };

    if (scrollTarget() || typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollTarget();
    });
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

      setIsNavOpen(false);
      navigate(sectionLocation);

      if (sectionId) {
        scrollToSection(sectionId, behavior);
      } else if (typeof window !== "undefined") {
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

    const closeNavigation = useEffectEvent(() => {
      setIsNavOpen(false);
    });

    return (
      <div className="reader-shell">
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-brand">
              <span className="topbar-kicker">{config.topbarKicker}</span>
              <NavLink className="brand-link" to={productPath}>
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
              <SearchPanel
                onNavigate={navigateToSection}
                searchContent={searchController.searchContent}
                warmSearchContent={searchController.warmSearchContent}
              />
            </div>
          </header>

          <div className="reader-layout">
            <aside
              className={`left-rail ${isNavOpen ? "open" : ""}`}
              aria-hidden={isNavOpen ? undefined : true}
            >
              <SidebarNav
                chapters={chapters}
                basePath={productPath}
                currentChapterSlug={currentChapterSlug}
                currentSectionId={currentSectionId}
                onSectionJump={jumpToSection}
                onNavigate={closeNavigation}
              />
            </aside>

            <main className="content-pane">
              <Outlet
                context={{
                  syncCurrentSectionId: setCurrentSectionId,
                  jumpToSection
                }}
              />
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

          {isNavOpen ? (
            <button
              className="mobile-scrim"
              type="button"
              aria-label="열린 패널 닫기"
              onClick={() => {
                setIsNavOpen(false);
              }}
            />
          ) : null}
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
      />
    );
  }

  function ChapterPage() {
    const { documentData, onReadingBookmarkChange } = useReader();
    const { chapterSlug } = useParams();
    const location = useLocation();
    const { syncCurrentSectionId, jumpToSection } = useOutletContext<ReaderShellOutletContext>();
    const chapters = documentData.chapters;
    const normalizedChapterSlug = decodeRouteSegment(chapterSlug);
    const articleRef = useRef<HTMLElement | null>(null);
    const [activeSectionId, setActiveSectionId] = useState<string | undefined>(
      () => location.hash.replace(/^#/, "") || undefined
    );
    const [readingProgress, setReadingProgress] = useState(0);

    const chapter = normalizedChapterSlug
      ? chapters.find((entry) => entry.slug === normalizedChapterSlug)
      : undefined;
    const productPath = buildProductPath(productMeta);
    const outlineItems = chapter ? flattenOutlineHeadings(chapter.headings) : [];
    const firstOutlineId = outlineItems[0]?.id;
    const outlineSignature = outlineItems.map((item) => item.id).join("|");
    const chapterMeta = chapter ? getChapterMeta(chapter) : null;
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
    const handleSectionJump = useEffectEvent((sectionId: string) => {
      setActiveSectionId(sectionId);
      jumpToSection(sectionId);
    });

    useEffect(() => {
      if (!chapter) {
        return undefined;
      }

      setRuntimeDocumentTitle(chapter.title);

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
    }, [chapter, location.hash]);

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
    }, [chapter, outlineItems, outlineSignature]);

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
        const nextProgress =
          ((scrollTop - articleTop + viewportHeight * 0.22) / maxScrollableDistance) * 100;

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
    }, [activeOutlineItem?.title, activeSectionId, chapter, commitReadingBookmark, progressBucket]);

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
          onSectionJump={handleSectionJump}
        />
        <MarkdownArticle chapter={chapter} articleRef={articleRef} />
        <ReaderActionBar
          activeSectionTitle={activeOutlineItem?.title}
          onScrollToTop={handleScrollToTop}
          visible={readingProgress >= 20}
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
    readingBookmark
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
            <span>{config.homeStatusLabel}</span>
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
        ) : null}

        <section className="gateway-section">
          <div className="gateway-section-header">
            <div>
              <p className="gateway-kicker">{config.positioningKicker}</p>
              <h2 className="gateway-section-title">{config.positioningTitle}</h2>
            </div>
          </div>
          <p className="reader-product-note">{config.positioningNote}</p>
        </section>

        <section className="chapter-grid">
          {documentData.chapters.map((chapter) => {
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
                      {config.chapterBadge}
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
