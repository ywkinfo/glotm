import type { Chapter } from "../../../shared/types/content";

const CHARACTERS_PER_MINUTE = 850;

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
