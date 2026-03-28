import MiniSearch from "minisearch";

export type HeadingNode = {
  id: string;
  depth: number;
  title: string;
  children: HeadingNode[];
};

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  html: string;
  headings: HeadingNode[];
};

export type DocumentMeta = {
  title: string;
  builtAt: string;
  chapterCount: number;
};

export type DocumentData = {
  meta: DocumentMeta;
  chapters: Chapter[];
};

export type SearchEntry = {
  id: string;
  chapterSlug: string;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  text: string;
  excerpt: string;
};

export type ReadingBookmark = {
  chapterSlug: string;
  chapterTitle: string;
  sectionId?: string;
  sectionTitle?: string;
  progress: number;
  updatedAt: string;
};

export type ChapterCatalogMatch = {
  matches: boolean;
  matchedHeadingTitle?: string;
};

export type FilteredCatalogChapter = {
  chapter: Chapter;
  match: ChapterCatalogMatch;
};

export type ProductMeta = {
  id: string;
  shortLabel: string;
  slug: string;
  path: string;
  title: string;
  summary: string;
  status: string;
  statusTone: "pilot" | "beta" | "neutral";
  audience: string;
  primaryCtaLabel: string;
  stageLabel: string;
  coverageType: "region" | "country";
  availability: "live_shell" | "developed_workspace";
};

type SearchIndexData = {
  index: MiniSearch<SearchEntry>;
  entryMap: Map<string, SearchEntry>;
  searchEntries: SearchEntry[];
};

const CHARACTERS_PER_MINUTE = 850;
const ROOT_DOCUMENT_TITLE = "GloTm | 글로벌 상표 지식베이스";

function loadJson<T>(url: string, label: string) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${label} 파일을 불러오지 못했습니다. (${response.status})`);
    }

    return response.json() as Promise<T>;
  });
}

export function createDocumentResourceLoaders(documentUrl: string, searchEntriesUrl: string) {
  let documentDataPromise: Promise<DocumentData> | undefined;
  let searchEntriesPromise: Promise<SearchEntry[]> | undefined;

  return {
    loadDocumentData() {
      if (!documentDataPromise) {
        documentDataPromise = loadJson<DocumentData>(documentUrl, "문서 데이터").catch((error) => {
          documentDataPromise = undefined;
          throw error;
        });
      }

      return documentDataPromise;
    },
    loadSearchEntries() {
      if (!searchEntriesPromise) {
        searchEntriesPromise = loadJson<SearchEntry[]>(searchEntriesUrl, "검색 인덱스").catch(
          (error) => {
            searchEntriesPromise = undefined;
            throw error;
          }
        );
      }

      return searchEntriesPromise;
    }
  };
}

export function createSearchController(loadSearchEntries: () => Promise<SearchEntry[]>) {
  let searchIndexPromise: Promise<SearchIndexData> | undefined;

  const getSearchIndex = () => {
    if (!searchIndexPromise) {
      searchIndexPromise = loadSearchEntries()
        .then((searchEntries) => {
          const index = new MiniSearch<SearchEntry>({
            fields: ["chapterTitle", "sectionTitle", "text"],
            storeFields: [
              "id",
              "chapterSlug",
              "chapterTitle",
              "sectionId",
              "sectionTitle",
              "text",
              "excerpt"
            ],
            searchOptions: {
              boost: {
                chapterTitle: 4,
                sectionTitle: 2
              },
              prefix: true
            }
          });

          index.addAll(searchEntries);

          return {
            index,
            entryMap: new Map(searchEntries.map((entry) => [entry.id, entry])),
            searchEntries
          };
        })
        .catch((error) => {
          searchIndexPromise = undefined;
          throw error;
        });
    }

    return searchIndexPromise;
  };

  return {
    warmSearchContent() {
      void getSearchIndex();
    },
    async searchContent(rawQuery: string) {
      const query = rawQuery.trim();

      if (!query) {
        return [];
      }

      const { index, entryMap, searchEntries } = await getSearchIndex();
      const indexedResults = index.search(query, {
        prefix: true,
        fuzzy: query.length >= 4 ? 0.2 : false,
        boost: {
          chapterTitle: 4,
          sectionTitle: 2
        }
      });
      const results = indexedResults
        .map((result) => entryMap.get(result.id))
        .filter((entry): entry is SearchEntry => Boolean(entry));

      const normalizedQuery = query.toLowerCase();
      const fallback = searchEntries.filter((entry) =>
        [entry.chapterTitle, entry.sectionTitle, entry.text].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      );

      const merged = new Map<string, SearchEntry>();

      for (const result of [...results, ...fallback]) {
        if (!merged.has(result.id)) {
          merged.set(result.id, result);
        }
      }

      return [...merged.values()].slice(0, 24);
    }
  };
}

export function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function flattenHeadingTitles(headings: HeadingNode[]): string[] {
  return headings.flatMap((heading) => [heading.title, ...flattenHeadingTitles(heading.children)]);
}

export function getChapterCatalogSearchMatch(
  chapter: Chapter,
  rawQuery: string
): ChapterCatalogMatch {
  const query = normalizeSearchText(rawQuery);

  if (!query) {
    return {
      matches: true,
      matchedHeadingTitle: undefined
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

  const matchedHeadingTitle = flattenHeadingTitles(chapter.headings).find((title) =>
    normalizeSearchText(title).includes(query)
  );

  return {
    matches: Boolean(matchedHeadingTitle),
    matchedHeadingTitle
  };
}

export function filterCatalogChapters(chapters: Chapter[], rawQuery: string): FilteredCatalogChapter[] {
  return chapters
    .map((chapter) => ({
      chapter,
      match: getChapterCatalogSearchMatch(chapter, rawQuery)
    }))
    .filter((entry) => entry.match.matches);
}

export function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") {
    return "";
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

export function buildChapterPath(basePath: string, chapterSlug: string) {
  return `${normalizeBasePath(basePath)}/chapter/${chapterSlug}`;
}

export function buildRuntimeDocumentTitle(pageTitle?: string) {
  if (!pageTitle) {
    return ROOT_DOCUMENT_TITLE;
  }

  return `${pageTitle} | GloTm`;
}

export function setRuntimeDocumentTitle(pageTitle?: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.title = buildRuntimeDocumentTitle(pageTitle);
}

export function formatBookmarkTimestamp(updatedAt: string) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createReadingBookmarkStorage(storageKey: string) {
  return {
    loadReadingBookmark() {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const rawValue = window.localStorage.getItem(storageKey);

        if (!rawValue) {
          return null;
        }

        const parsed = JSON.parse(rawValue) as unknown;

        if (
          !isRecord(parsed)
          || typeof parsed.chapterSlug !== "string"
          || typeof parsed.chapterTitle !== "string"
        ) {
          return null;
        }

        return {
          chapterSlug: parsed.chapterSlug,
          chapterTitle: parsed.chapterTitle,
          sectionId: typeof parsed.sectionId === "string" ? parsed.sectionId : undefined,
          sectionTitle: typeof parsed.sectionTitle === "string" ? parsed.sectionTitle : undefined,
          progress: typeof parsed.progress === "number" ? parsed.progress : 0,
          updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString()
        } satisfies ReadingBookmark;
      } catch {
        return null;
      }
    },
    saveReadingBookmark(bookmark: ReadingBookmark) {
      if (typeof window === "undefined") {
        return;
      }

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(bookmark));
      } catch {
        // Ignore storage failures so reading continues uninterrupted.
      }
    }
  };
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function getEstimatedReadingMinutes(html: string) {
  const plainText = stripHtml(html);

  if (!plainText) {
    return 1;
  }

  return Math.max(1, Math.round(plainText.length / CHARACTERS_PER_MINUTE));
}

export function getChapterMeta(chapter: Chapter) {
  return {
    sectionCount: chapter.headings.length,
    readingMinutes: getEstimatedReadingMinutes(chapter.html)
  };
}

export function getAdjacentChapters(chapters: Chapter[], currentChapterSlug?: string) {
  if (!currentChapterSlug) {
    return {
      currentIndex: -1,
      prevChapter: null,
      nextChapter: null
    };
  }

  const currentIndex = chapters.findIndex((chapter) => chapter.slug === currentChapterSlug);

  if (currentIndex < 0) {
    return {
      currentIndex,
      prevChapter: null,
      nextChapter: null
    };
  }

  return {
    currentIndex,
    prevChapter: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  };
}

const STAGE_ORDER = [
  { min: 1, max: 1, key: "strategy", label: "전략 프레임" },
  { min: 2, max: 3, key: "prefiling", label: "Pre-filing" },
  { min: 4, max: 6, key: "filing", label: "출원·심사" },
  { min: 7, max: 9, key: "postreg", label: "등록 후 운영" },
  { min: 10, max: 14, key: "enforcement", label: "모니터링·집행" },
  { min: 15, max: 19, key: "operations", label: "운영 체계" }
] as const;

export function getChapterNumber(title: string) {
  const match = title.match(/제(\d+)장/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

export function getChapterStage(title: string) {
  const chapterNumber = getChapterNumber(title);

  if (chapterNumber === null) {
    return {
      key: "appendix",
      label: "부록"
    };
  }

  const stage = STAGE_ORDER.find(
    (entry) => chapterNumber >= entry.min && chapterNumber <= entry.max
  );

  if (!stage) {
    return {
      key: "appendix",
      label: "부록"
    };
  }

  return {
    key: stage.key,
    label: stage.label
  };
}

export function getTrackedSectionId(targets: HTMLElement[]) {
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
