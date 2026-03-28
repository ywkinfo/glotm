import documentDataJson from "../../content/generated/document-data.json";
import searchEntriesJson from "../../content/generated/search-index.json";

import type { DocumentData, SearchEntry } from "../shared/types/content";

export const documentData = documentDataJson as DocumentData;
export const searchEntries = searchEntriesJson as SearchEntry[];
