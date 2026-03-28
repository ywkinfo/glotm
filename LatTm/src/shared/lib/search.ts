import MiniSearch from "minisearch";

import { loadSearchEntries } from "../../content";
import type { SearchEntry } from "../types/content";

type SearchIndexData = {
  index: MiniSearch<SearchEntry>;
  entryMap: Map<string, SearchEntry>;
  searchEntries: SearchEntry[];
};

let searchIndexPromise: Promise<SearchIndexData> | undefined;

async function getSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = loadSearchEntries()
      .then((searchEntries) => {
        const index = new MiniSearch<SearchEntry>({
          fields: ["chapterTitle", "sectionTitle", "text"],
          storeFields: ["id", "chapterSlug", "chapterTitle", "sectionId", "sectionTitle", "text", "excerpt"],
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
}

export function warmSearchContent() {
  void getSearchIndex();
}

export async function searchContent(rawQuery: string) {
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
