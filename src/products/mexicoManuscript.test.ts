import { describe, expect, it } from "vitest";

import {
  flattenHeadingTitles,
  loadManuscriptData
} from "./manuscriptTestUtils";

const { documentData, searchEntries } = loadManuscriptData(import.meta.url, "../../MexTm");

describe("MexTm manuscript", () => {
  it("ships the expected 15-chapter Mexico manuscript structure", () => {
    expect(documentData.meta.chapterCount).toBe(15);
    expect(documentData.chapters.map((chapter) => chapter.title)).toContain(
      "제4장 출원 경로 선택: 직접출원 vs 마드리드(국제출원) 비교"
    );
    expect(documentData.chapters.map((chapter) => chapter.title)).toContain(
      "제11장 도메인(.MX)·디자인·저작권(인다우토르)과의 결합 전략"
    );
    expect(documentData.chapters.map((chapter) => chapter.title)).toContain(
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
    expect(flattenHeadingTitles(overviewChapter?.headings)).toContain("시스템별 owner map");
    expect(flattenHeadingTitles(routeChapter?.headings)).toContain("buyer-entry 경로 선택표");
    expect(flattenHeadingTitles(routeChapter?.headings)).toContain("직접출원 vs 마드리드 readiness 보드");
    expect(flattenHeadingTitles(controlChapter?.headings)).toContain("통제 포트폴리오 보드");
    expect(flattenHeadingTitles(controlChapter?.headings)).toContain("파트너 종료 asset recovery pack");
    expect(flattenHeadingTitles(caseChapter?.headings)).toContain("사례 회수 decision table");
    expect(flattenHeadingTitles(caseChapter?.headings)).toContain("사례별 예방 기준표");
    expect(flattenHeadingTitles(caseChapter?.headings)).toContain("사례 회수 readiness 체크표");
  });

  it("keeps the Mexico search index dense enough for the locked sprint slices", () => {
    expect(searchEntries.length).toBeGreaterThanOrEqual(280);

    const sectionTitles = new Set(searchEntries.map((entry) => entry.sectionTitle));

    expect(sectionTitles.has("buyer-entry decision map")).toBe(true);
    expect(sectionTitles.has("buyer-entry 경로 선택표")).toBe(true);
    expect(sectionTitles.has("통제 포트폴리오 보드")).toBe(true);
    expect(sectionTitles.has("사례 회수 decision table")).toBe(true);
    expect(sectionTitles.has("시스템별 owner map")).toBe(true);
    expect(sectionTitles.has("직접출원 vs 마드리드 readiness 보드")).toBe(true);
    expect(sectionTitles.has("파트너 종료 asset recovery pack")).toBe(true);
  });
});
