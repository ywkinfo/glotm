import documentDataUrl from "../../content/generated/document-data.json?url";
import searchEntriesUrl from "../../content/generated/search-index.json?url";

import type { DocumentData, SearchEntry } from "../shared/types/content";

let documentDataPromise: Promise<DocumentData> | undefined;
let searchEntriesPromise: Promise<SearchEntry[]> | undefined;

async function loadJson<T>(url: string, label: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${label} 파일을 불러오지 못했습니다. (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function loadDocumentData() {
  if (!documentDataPromise) {
    documentDataPromise = loadJson<DocumentData>(documentDataUrl, "문서 데이터").catch(
      (error) => {
        documentDataPromise = undefined;
        throw error;
      }
    );
  }

  return documentDataPromise;
}

export function loadSearchEntries() {
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
