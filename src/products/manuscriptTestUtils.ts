import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type HeadingNode = {
  title: string;
  children?: HeadingNode[];
};

export type GeneratedChapter = {
  title: string;
  headings: HeadingNode[];
};

export type GeneratedDocumentData = {
  meta: {
    chapterCount: number;
  };
  chapters: GeneratedChapter[];
};

export type GeneratedSearchEntry = {
  sectionTitle: string;
};

export function flattenHeadingTitles(headings: HeadingNode[] = []): string[] {
  return headings.flatMap((heading) => [
    heading.title,
    ...flattenHeadingTitles(heading.children ?? [])
  ]);
}

export function loadManuscriptData(fromDir: string, relativeWorkspacePath: string) {
  const __dirname = path.dirname(fileURLToPath(fromDir));
  const documentData = JSON.parse(
    readFileSync(path.resolve(__dirname, relativeWorkspacePath, "content/generated/document-data.json"), "utf-8")
  ) as GeneratedDocumentData;
  const searchEntries = JSON.parse(
    readFileSync(path.resolve(__dirname, relativeWorkspacePath, "content/generated/search-index.json"), "utf-8")
  ) as GeneratedSearchEntry[];

  return { documentData, searchEntries };
}
