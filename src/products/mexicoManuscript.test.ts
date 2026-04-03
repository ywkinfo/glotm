import { describe, expect, it } from "vitest";

import documentData from "../../MexTm/content/generated/document-data.json";
import searchEntries from "../../MexTm/content/generated/search-index.json";

type HeadingNode = {
  title: string;
  children?: HeadingNode[];
};

function flattenHeadingTitles(headings: HeadingNode[] = []): string[] {
  return headings.flatMap((heading) => [
    heading.title,
    ...flattenHeadingTitles(heading.children ?? [])
  ]);
}

describe("MexTm manuscript", () => {
  it("ships the expected 15-chapter Mexico manuscript structure", () => {
    expect(documentData.meta.chapterCount).toBe(15);
    expect(documentData.chapters.map((chapter: { title: string }) => chapter.title)).toContain(
      "제4장 출원 경로 선택: 직접출원 vs 마드리드(국제출원) 비교"
    );
    expect(documentData.chapters.map((chapter: { title: string }) => chapter.title)).toContain(
      "제11장 도메인(.MX)·디자인·저작권(인다우토르)과의 결합 전략"
    );
    expect(documentData.chapters.map((chapter: { title: string }) => chapter.title)).toContain(
      "제13장 실무 사례·판례 요약: 한국 기업이 멕시코 상표 분쟁에서 배워야 할 것"
    );
  });

  it("preserves the buyer-entry sections in the locked Mexico chapters", () => {
    const overviewChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제1장 멕시코 상표 제도 개요와 IMPI 운영 구조"
    );
    const routeChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제4장 출원 경로 선택: 직접출원 vs 마드리드(국제출원) 비교"
    );
    const controlChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제11장 도메인(.MX)·디자인·저작권(인다우토르)과의 결합 전략"
    );
    const caseChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제13장 실무 사례·판례 요약: 한국 기업이 멕시코 상표 분쟁에서 배워야 할 것"
    );

    expect(flattenHeadingTitles(overviewChapter?.headings)).toContain("buyer-entry decision map");
    expect(flattenHeadingTitles(routeChapter?.headings)).toContain("buyer-entry 경로 선택표");
    expect(flattenHeadingTitles(controlChapter?.headings)).toContain("통제 포트폴리오 보드");
    expect(flattenHeadingTitles(caseChapter?.headings)).toContain("사례 회수 decision table");
    expect(flattenHeadingTitles(caseChapter?.headings)).toContain("사례별 예방 기준표");
  });

  it("keeps the Mexico search index dense enough for the locked sprint slices", () => {
    expect(searchEntries.length).toBeGreaterThanOrEqual(280);

    const sectionTitles = new Set(searchEntries.map((entry: { sectionTitle: string }) => entry.sectionTitle));

    expect(sectionTitles.has("buyer-entry decision map")).toBe(true);
    expect(sectionTitles.has("buyer-entry 경로 선택표")).toBe(true);
    expect(sectionTitles.has("통제 포트폴리오 보드")).toBe(true);
    expect(sectionTitles.has("사례 회수 decision table")).toBe(true);
  });
});
