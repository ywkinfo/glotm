import { useEffect, useRef, useState } from "react";

import type { SearchEntry } from "./shared";

type SearchPanelProps = {
  onNavigate: (chapterSlug: string, sectionId?: string) => void;
  searchContent: (rawQuery: string) => Promise<SearchEntry[]>;
  warmSearchContent: () => void;
  onSearchSubmit?: (query: string, resultCount: number) => void;
  onSearchResultSelect?: (result: SearchEntry) => void;
};

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

export function SearchPanel({
  onNavigate,
  searchContent,
  warmSearchContent,
  onSearchSubmit,
  onSearchResultSelect
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

        onSearchSubmit?.(trimmedQuery, nextResults.length);
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
  }, [onSearchSubmit, query, searchContent]);

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
    onSearchResultSelect?.(result);
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
