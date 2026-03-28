import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState
} from "react";

import { searchContent, warmSearchContent } from "../../../shared/lib/search";
import type { SearchEntry } from "../../../shared/types/content";

type SearchPanelProps = {
  onNavigate: (chapterSlug: string, sectionId?: string) => void;
};

export function SearchPanel({ onNavigate }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const deferredQuery = useDeferredValue(query);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const trimmedQuery = deferredQuery.trim();
    let isCancelled = false;

    if (!trimmedQuery) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
       setHighlightedIndex(-1);
      return undefined;
    }

    setIsSearching(true);
    setSearchError(null);

    searchContent(trimmedQuery)
      .then((nextResults) => {
        if (isCancelled) {
          return;
        }

        startTransition(() => {
          setResults(nextResults);
          setIsSearching(false);
          setHighlightedIndex(nextResults.length > 0 ? 0 : -1);
        });
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setResults([]);
        setIsSearching(false);
        setSearchError("검색 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setHighlightedIndex(-1);
      });

    return () => {
      isCancelled = true;
    };
  }, [deferredQuery]);

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
          {isSearching ? (
            <div className="search-empty">검색 인덱스를 불러오는 중입니다.</div>
          ) : searchError ? (
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
          ) : (
            <div className="search-empty">일치하는 섹션을 찾지 못했습니다.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
