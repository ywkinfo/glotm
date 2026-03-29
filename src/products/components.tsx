import {
  useEffect,
  useRef,
  useState,
  type Ref
} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  type Chapter,
  type HeadingNode,
  type SearchEntry,
  buildChapterPath,
  buildProductPath,
  buildSectionLocation,
  isSafeExternalHref,
  normalizeAppHref
} from "./shared";
import { liveShellProducts } from "./registry";

type SidebarNavProps = {
  chapters: Chapter[];
  basePath: string;
  currentChapterSlug?: string;
  currentSectionId?: string;
  onSectionJump?: (sectionId: string) => void;
  onNavigate?: () => void;
  showSections?: boolean;
};

type SearchPanelProps = {
  onNavigate: (chapterSlug: string, sectionId?: string) => void;
  searchContent: (rawQuery: string) => Promise<SearchEntry[]>;
  warmSearchContent: () => void;
};

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

type MarkdownArticleProps = {
  chapter: Chapter;
  articleRef?: Ref<HTMLElement>;
};

type ChapterOutlineProps = {
  basePath: string;
  chapterSlug: string;
  headings: HeadingNode[];
  activeSectionId?: string;
  onSectionJump: (sectionId: string) => void;
};

type ReaderActionBarProps = {
  activeSectionTitle?: string;
  onDismiss: () => void;
  onScrollToTop: () => void;
  visible: boolean;
};

type StatusPageProps = {
  kicker: string;
  title: string;
  message: string;
};

type OutlineItem = {
  id: string;
  title: string;
  level: number;
};

function isOwnedAppHref(href: string) {
  if (href.startsWith("#")) {
    return true;
  }

  const [pathname] = href.split(/[?#]/, 1);

  if (!pathname) {
    return false;
  }

  if (pathname === buildProductPath("/")) {
    return true;
  }

  return liveShellProducts.some((product) => {
    const productPath = buildProductPath(product);

    return pathname === productPath || pathname.startsWith(`${productPath}/`);
  });
}

function mergeArticleRefs(
  articleRef: Ref<HTMLElement> | undefined,
  node: HTMLElement | null
) {
  if (!articleRef) {
    return;
  }

  if (typeof articleRef === "function") {
    articleRef(node);
    return;
  }

  (articleRef as { current: HTMLElement | null }).current = node;
}

export function StatusPage({ kicker, title, message }: StatusPageProps) {
  return (
    <div className="status-page">
      <section className="status-card">
        <p className="gateway-kicker">{kicker}</p>
        <h1 className="status-title">{title}</h1>
        <p className="status-message">{message}</p>
      </section>
    </div>
  );
}

export function flattenOutlineHeadings(
  headings: HeadingNode[],
  level = 0
): OutlineItem[] {
  const items: OutlineItem[] = [];

  for (const heading of headings) {
    items.push({
      id: heading.id,
      title: heading.title,
      level
    });
    items.push(...flattenOutlineHeadings(heading.children, level + 1));
  }

  return items;
}

export function SidebarNav({
  chapters,
  basePath,
  currentChapterSlug,
  currentSectionId,
  onSectionJump,
  onNavigate,
  showSections = true
}: SidebarNavProps) {
  return (
    <nav className="sidebar-nav" aria-label="전체 문서 목차">
      <div className="sidebar-eyebrow">문서 구조</div>
      <ul className="sidebar-list">
        {chapters.map((chapter) => {
          const isActive = chapter.slug === currentChapterSlug;
          const sectionItems = isActive && showSections
            ? flattenOutlineHeadings(chapter.headings)
            : [];

          return (
            <li key={chapter.slug} className="sidebar-item">
              <NavLink
                to={buildChapterPath(basePath, chapter.slug)}
                className={({ isActive: routeActive }) =>
                  routeActive || isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={onNavigate}
              >
                {chapter.title}
              </NavLink>
              {sectionItems.length > 0 ? (
                <ul className="sidebar-section-list" aria-label={`${chapter.title} 섹션 목차`}>
                  {sectionItems.map((section) => {
                    const isCurrentSection = section.id === currentSectionId;

                    return (
                      <li key={section.id}>
                        <Link
                          to={buildSectionLocation(basePath, chapter.slug, section.id)}
                          className={
                            isCurrentSection
                              ? "sidebar-section-link active"
                              : "sidebar-section-link"
                          }
                          onClick={(event) => {
                            if (onSectionJump) {
                              event.preventDefault();
                              onSectionJump(section.id);
                            }
                            onNavigate?.();
                          }}
                          style={{ paddingInlineStart: `${0.85 + section.level * 0.85}rem` }}
                          aria-current={isCurrentSection ? "location" : undefined}
                        >
                          {section.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SearchPanel({
  onNavigate,
  searchContent,
  warmSearchContent
}: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchRequestIdRef = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const requestId = searchRequestIdRef.current + 1;

    searchRequestIdRef.current = requestId;

    if (!trimmedQuery) {
      setResults([]);
      setStatus("idle");
      setSearchError(null);
      setHighlightedIndex(-1);
      return undefined;
    }

    setResults([]);
    setStatus("loading");
    setSearchError(null);
    setHighlightedIndex(-1);

    searchContent(trimmedQuery)
      .then((nextResults) => {
        if (searchRequestIdRef.current !== requestId) {
          return;
        }

        setResults(nextResults);
        setStatus(nextResults.length > 0 ? "success" : "empty");
        setHighlightedIndex(nextResults.length > 0 ? 0 : -1);
      })
      .catch(() => {
        if (searchRequestIdRef.current !== requestId) {
          return;
        }

        setResults([]);
        setStatus("error");
        setSearchError("검색 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setHighlightedIndex(-1);
      });
  }, [query, searchContent]);

  useEffect(() => {
    const activeResult = resultRefs.current[highlightedIndex];

    activeResult?.scrollIntoView({
      block: "nearest"
    });
  }, [highlightedIndex]);

  const activeResult =
    highlightedIndex >= 0 && highlightedIndex < results.length
      ? results[highlightedIndex]
      : undefined;

  const navigateToResult = (result: SearchEntry) => {
    onNavigate(result.chapterSlug, result.sectionId || undefined);
    setQuery("");
    setResults([]);
    setStatus("idle");
    setSearchError(null);
    setHighlightedIndex(-1);
  };

  return (
    <div className="search-shell">
      <label className="search-label" htmlFor="reader-search">
        검색
      </label>
      <input
        id="reader-search"
        className="search-input"
        type="search"
        value={query}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={query.trim() ? true : false}
        aria-controls="reader-search-results"
        aria-activedescendant={activeResult ? `search-result-${activeResult.id}` : undefined}
        placeholder="장 제목, 섹션 제목, 본문 검색"
        onFocus={() => {
          warmSearchContent();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
            setResults([]);
            setStatus("idle");
            setSearchError(null);
            setHighlightedIndex(-1);
            return;
          }

          if (results.length === 0) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((index) =>
              index < results.length - 1 ? index + 1 : 0
            );
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((index) =>
              index > 0 ? index - 1 : results.length - 1
            );
            return;
          }

          if (event.key === "Enter" && activeResult) {
            event.preventDefault();
            navigateToResult(activeResult);
          }
        }}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
      {query.trim() ? (
        <div
          id="reader-search-results"
          className="search-results"
          role="listbox"
          aria-label="검색 결과"
        >
          {status === "loading" ? (
            <div className="search-empty">검색 인덱스를 불러오는 중입니다.</div>
          ) : status === "error" && searchError ? (
            <div className="search-empty">{searchError}</div>
          ) : results.length > 0 ? (
            results.map((result, index) => {
              const isActive = index === highlightedIndex;

              return (
                <button
                  key={result.id}
                  id={`search-result-${result.id}`}
                  ref={(element) => {
                    resultRefs.current[index] = element;
                  }}
                  className={isActive ? "search-result active" : "search-result"}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => {
                    setHighlightedIndex(index);
                  }}
                  onClick={() => {
                    navigateToResult(result);
                  }}
                >
                  <span className="search-result-meta">{result.chapterTitle}</span>
                  <strong className="search-result-title">{result.sectionTitle}</strong>
                  <span className="search-result-excerpt">{result.excerpt}</span>
                </button>
              );
            })
          ) : status === "empty" ? (
            <div className="search-empty">일치하는 섹션을 찾지 못했습니다.</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function MarkdownArticle({ chapter, articleRef }: MarkdownArticleProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const articleElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const articleElement = articleElementRef.current;

    if (!articleElement || typeof window === "undefined") {
      return;
    }

    for (const anchor of articleElement.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const rawHref = anchor.getAttribute("href")?.trim();

      if (!rawHref) {
        continue;
      }

      const normalizedHref = normalizeAppHref(rawHref, {
        baseUrl: import.meta.env.BASE_URL ?? "/",
        currentOrigin: window.location.origin,
        currentPathname: `${location.pathname}${location.search}`
      });

      if (normalizedHref && isOwnedAppHref(normalizedHref)) {
        anchor.setAttribute("href", normalizedHref);
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
        continue;
      }

      if (isSafeExternalHref(rawHref)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noreferrer noopener");
        continue;
      }

      if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(rawHref) && !/^mailto:|^tel:/i.test(rawHref)) {
        anchor.removeAttribute("href");
      }
    }
  }, [chapter.html, location.pathname, location.search]);

  return (
    <article
      ref={(node) => {
        articleElementRef.current = node;
        mergeArticleRefs(articleRef, node);
      }}
      className="article"
      onClick={(event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
          return;
        }

        const anchor = target.closest("a[href]");

        if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") {
          return;
        }

        if (
          event.metaKey
          || event.ctrlKey
          || event.shiftKey
          || event.altKey
          || anchor.hasAttribute("download")
        ) {
          return;
        }

        const rawHref = anchor.getAttribute("href");

        if (!rawHref) {
          return;
        }

        const normalizedHref = normalizeAppHref(rawHref, {
          baseUrl: import.meta.env.BASE_URL ?? "/",
          currentOrigin: window.location.origin,
          currentPathname: `${location.pathname}${location.search}`
        });

        if (!normalizedHref || !isOwnedAppHref(normalizedHref)) {
          return;
        }

        event.preventDefault();

        if (normalizedHref.startsWith("#")) {
          navigate({
            pathname: location.pathname,
            search: location.search,
            hash: normalizedHref
          });
          return;
        }

        navigate(normalizedHref);
      }}
      dangerouslySetInnerHTML={{ __html: chapter.html }}
    />
  );
}

export function ChapterOutline({
  basePath,
  chapterSlug,
  headings,
  activeSectionId,
  onSectionJump
}: ChapterOutlineProps) {
  const items = flattenOutlineHeadings(headings);
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return !window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setIsExpanded(!window.matchMedia("(max-width: 640px)").matches);
  }, [chapterSlug]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="chapter-outline" aria-labelledby="chapter-outline-title">
      <div className="chapter-outline-header">
        <div>
          <p className="chapter-outline-kicker">Quick Jump</p>
          <h2 id="chapter-outline-title" className="chapter-outline-title">
            이 장의 섹션 목차
          </h2>
        </div>
        <div className="chapter-outline-actions">
          <p className="chapter-outline-meta">총 {items.length}개 섹션</p>
          <button
            className="chapter-outline-toggle"
            type="button"
            aria-expanded={isExpanded}
            aria-controls="chapter-outline-list"
            onClick={() => {
              setIsExpanded((expanded) => !expanded);
            }}
          >
            {isExpanded ? "목차 접기" : "목차 펼치기"}
          </button>
        </div>
      </div>

      <div
        id="chapter-outline-list"
        className={isExpanded ? "chapter-outline-list" : "chapter-outline-list collapsed"}
      >
        {items.map((item) => {
          const isActive = item.id === activeSectionId;

          return (
            <Link
              key={item.id}
              to={buildSectionLocation(basePath, chapterSlug, item.id)}
              className={isActive ? "chapter-outline-link active" : "chapter-outline-link"}
              aria-current={isActive ? "location" : undefined}
              style={{ paddingInlineStart: `${1 + item.level}rem` }}
              onClick={(event) => {
                event.preventDefault();
                onSectionJump(item.id);
              }}
            >
              <span className="chapter-outline-link-title">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ReaderActionBar({
  activeSectionTitle,
  onDismiss,
  onScrollToTop,
  visible
}: ReaderActionBarProps) {
  if (!visible) {
    return null;
  }

  const sectionLabel = activeSectionTitle ? `현재 섹션: ${activeSectionTitle}` : undefined;

  return (
    <aside className="reader-action-bar" aria-label="읽기 도구">
      <button
        className="reader-action-button"
        type="button"
        title={sectionLabel}
        onClick={onScrollToTop}
      >
        맨 위로
      </button>
      <button
        className="reader-action-dismiss"
        type="button"
        aria-label="맨 위로 버튼 숨기기"
        onClick={onDismiss}
      >
        x
      </button>
    </aside>
  );
}

export function ReadingProgressBar({ progress }: { progress: number }) {
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="reading-progress" aria-label="읽기 진행률">
      <div
        className="reading-progress-bar"
        style={{ width: `${normalizedProgress}%` }}
      />
      <span className="reading-progress-label">{Math.round(normalizedProgress)}% 읽음</span>
    </div>
  );
}
