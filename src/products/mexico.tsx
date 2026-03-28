import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import { products } from "./registry";
import {
  buildChapterPath,
  createDocumentResourceLoaders,
  createSearchController,
  getChapterMeta,
  type DocumentData
} from "./shared";
import {
  MarkdownArticle,
  SearchPanel,
  SidebarNav,
  StatusPage
} from "./components";
import documentDataUrl from "../../MexTm/content/generated/document-data.json?url";
import searchEntriesUrl from "../../MexTm/content/generated/search-index.json?url";

const productMeta = products.find((product) => product.slug === "mexico")!;
const { loadDocumentData, loadSearchEntries } = createDocumentResourceLoaders(
  documentDataUrl,
  searchEntriesUrl
);
const searchController = createSearchController(loadSearchEntries);

type MexicoReaderContextValue = {
  documentData: DocumentData;
};

const MexicoReaderContext = createContext<MexicoReaderContextValue | null>(null);

function useMexicoReader() {
  const value = useContext(MexicoReaderContext);

  if (!value) {
    throw new Error("Mexico reader context is unavailable.");
  }

  return value;
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

function MexicoReaderShell() {
  const { documentData } = useMexicoReader();
  const navigate = useNavigate();
  const location = useLocation();
  const chapterMatch = matchPath(`${productMeta.path}/chapter/:chapterSlug`, location.pathname);
  const currentChapterSlug = decodeRouteSegment(chapterMatch?.params.chapterSlug);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname, location.hash]);

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
      document.title = `${productMeta.title} | GloTm`;
    }
  }, [currentChapterSlug]);

  const navigateToSection = (chapterSlug: string, sectionId?: string) => {
    navigate({
      pathname: buildChapterPath(productMeta.path, chapterSlug),
      hash: sectionId ? `#${sectionId}` : ""
    });
  };

  return (
    <div className="reader-shell">
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-brand">
            <span className="topbar-kicker">MexTm Beta</span>
            <NavLink className="brand-link" to={productMeta.path}>
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
          <aside className={`left-rail ${isNavOpen ? "open" : ""}`}>
            <SidebarNav
              chapters={documentData.chapters}
              basePath={productMeta.path}
              currentChapterSlug={currentChapterSlug}
              showSections={false}
              onNavigate={() => setIsNavOpen(false)}
            />
          </aside>

          <main className="content-pane">
            <Outlet />
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

export function MexicoReaderRoot() {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  if (loadError) {
    return (
      <StatusPage
        kicker="MexTm"
        title="문서를 불러오지 못했습니다"
        message={loadError}
      />
    );
  }

  if (!documentData) {
    return (
      <StatusPage
        kicker="MexTm"
        title="문서를 준비하고 있습니다"
        message="멕시코 심화 가이드 콘텐츠를 불러오는 중입니다."
      />
    );
  }

  return (
    <MexicoReaderContext.Provider value={{ documentData }}>
      <MexicoReaderShell />
    </MexicoReaderContext.Provider>
  );
}

export function MexicoHomePage() {
  const { documentData } = useMexicoReader();

  useEffect(() => {
    document.title = `${productMeta.title} | GloTm`;
  }, []);

  return (
    <div className="home-page">
      <section className="hero-card">
        <p className="hero-kicker">멕시코 심화 트랙</p>
        <h1>{documentData.meta.title}</h1>
        <p className="hero-summary">
          멕시코 IMPI 절차와 실무 쟁점을 더 깊게 탐색하기 위한 심화 가이드입니다.
          권역 단위 구조를 먼저 잡고 싶다면 <Link to="/latam">LatTm</Link>에서 큰 흐름을 본 뒤
          이 트랙으로 내려오는 구성이 가장 자연스럽습니다.
        </p>
        <div className="hero-meta">
          <span>총 {documentData.meta.chapterCount}개 챕터</span>
          <span>Beta 상태의 멕시코 단일 시장 심화 가이드</span>
        </div>
      </section>

      <section className="gateway-section">
        <div className="gateway-section-header">
          <div>
            <p className="gateway-kicker">MexTm Positioning</p>
            <h2 className="gateway-section-title">LatTm 다음 단계의 심화 탐색</h2>
          </div>
        </div>
        <p className="reader-product-note">
          현재 MexTm은 독립 제품이기보다 라틴아메리카 파일럿 안에서 멕시코를 우선 시장으로 깊게
          다루는 심화 레이어입니다. 출원 경로, IMPI 대응, 사후 유지관리, 집행 이슈를 멕시코 단일
          시장 기준으로 더 세밀하게 훑는 용도에 맞춰져 있습니다.
        </p>
      </section>

      <section className="chapter-grid">
        {documentData.chapters.map((chapter) => {
          const meta = getChapterMeta(chapter);

          return (
            <NavLink
              key={chapter.slug}
              className="chapter-card chapter-card--filing"
              to={buildChapterPath(productMeta.path, chapter.slug)}
            >
              <div className="chapter-card-header">
                <div className="chapter-card-badges">
                  <span className="chapter-card-stage chapter-card-stage--filing">Mexico</span>
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

export function MexicoChapterPage() {
  const { documentData } = useMexicoReader();
  const { chapterSlug } = useParams();
  const location = useLocation();
  const normalizedChapterSlug = decodeRouteSegment(chapterSlug);
  const chapter = normalizedChapterSlug
    ? documentData.chapters.find((entry) => entry.slug === normalizedChapterSlug)
    : undefined;

  useEffect(() => {
    if (!chapter) {
      return undefined;
    }

    document.title = `${chapter.title} | GloTm`;

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

  if (!normalizedChapterSlug || !chapter) {
    return <Navigate to={productMeta.path} replace />;
  }

  return (
    <div className="chapter-page">
      <section className="chapter-header">
        <p className="chapter-eyebrow">심화 읽기</p>
        <h1>{chapter.title}</h1>
        {chapter.summary ? <p className="chapter-summary">{chapter.summary}</p> : null}
      </section>
      <MarkdownArticle chapter={chapter} />
    </div>
  );
}

export { loadDocumentData, loadSearchEntries, productMeta as mexicoProductMeta };
