import type { ReadingBookmark } from "../../../shared/types/content";

const STORAGE_KEY = "lattm_reading_bookmark";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function loadReadingBookmark() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as unknown;

    if (!isRecord(parsed) || typeof parsed.chapterSlug !== "string" || typeof parsed.chapterTitle !== "string") {
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
}

export function saveReadingBookmark(bookmark: ReadingBookmark) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmark));
  } catch {
    // Ignore storage failures so reading continues uninterrupted.
  }
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
