import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

type HeadingNode = {
  title: string;
  children?: HeadingNode[];
};

type GeneratedChapter = {
  title: string;
  headings: HeadingNode[];
};

type GeneratedDocumentData = {
  meta: {
    chapterCount: number;
  };
  chapters: GeneratedChapter[];
};

type GeneratedSearchEntry = {
  sectionTitle: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const documentData = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../EuTm/content/generated/document-data.json"), "utf-8")
) as GeneratedDocumentData;
const searchEntries = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../EuTm/content/generated/search-index.json"), "utf-8")
) as GeneratedSearchEntry[];

function flattenHeadingTitles(headings: HeadingNode[] = []): string[] {
  return headings.flatMap((heading) => [
    heading.title,
    ...flattenHeadingTitles(heading.children ?? [])
  ]);
}

describe("EuTm manuscript", () => {
  it("ships the expected 14-chapter Europe manuscript structure", () => {
    expect(documentData.meta.chapterCount).toBe(14);
    expect(documentData.chapters.map((chapter: { title: string }) => chapter.title)).toContain(
      "제2장. 권리 선택: EUTM, 개별국, 영국 병행"
    );
    expect(documentData.chapters.map((chapter: { title: string }) => chapter.title)).toContain(
      "제8장. 등록 후 사용, 갱신, 증거 관리"
    );
  });

  it("preserves the validate stabilization sections in Europe priority chapters", () => {
    const rightSelectionChapter = documentData.chapters.find(
      (chapter: GeneratedChapter) => chapter.title === "제2장. 권리 선택: EUTM, 개별국, 영국 병행"
    );
    const evidenceChapter = documentData.chapters.find(
      (chapter: GeneratedChapter) => chapter.title === "제8장. 등록 후 사용, 갱신, 증거 관리"
    );

    expect(flattenHeadingTitles(rightSelectionChapter?.headings)).toContain("회원국별 clearance 편차 메모");
    expect(flattenHeadingTitles(rightSelectionChapter?.headings)).toContain("EU / UK launch split memo");
    expect(flattenHeadingTitles(evidenceChapter?.headings)).toContain("distributor / marketplace seller evidence triage");
    expect(flattenHeadingTitles(evidenceChapter?.headings)).toContain("EU / UK 분기 캘린더");
  });

  it("keeps the Europe search index dense enough for validate navigation", () => {
    expect(searchEntries.length).toBeGreaterThanOrEqual(200);

    const sectionTitles = new Set(searchEntries.map((entry: { sectionTitle: string }) => entry.sectionTitle));

    expect(sectionTitles.has("회원국별 clearance 편차 메모")).toBe(true);
    expect(sectionTitles.has("EU / UK launch split memo")).toBe(true);
    expect(sectionTitles.has("distributor / marketplace seller evidence triage")).toBe(true);
  });
});
