import { describe, expect, it } from "vitest";

import {
  flattenHeadingTitles,
  loadManuscriptData
} from "./manuscriptTestUtils";

const { documentData, searchEntries } = loadManuscriptData(import.meta.url, "../../ChaTm");

describe("ChaTm final manuscript", () => {
  it("ships the expanded 15-chapter China manuscript structure", () => {
    expect(documentData.meta.chapterCount).toBe(15);
    expect(documentData.chapters.map((chapter) => chapter.title)).toEqual([
      "서문",
      "제1장. 중국 상표제도 구조와 판단 프레임",
      "제2장. 브랜드 구조와 중국어 표기 전략",
      "제3장. 검색, 분류, 서브클래스 리스크 분석",
      "제4장. 출원 경로 선택: 직접출원 vs 마드리드",
      "제5장. 출원서 작성 실무와 지정상품 설계",
      "제6장. 심사, 공고, 이의와 거절 대응",
      "제7장. 등록 후 유지와 사용 증거",
      "제8장. 불사용취소, 무효와 취소 리스크",
      "제9장. 라이선스, 유통, OEM/제조 구조 통제",
      "제10장. 침해 대응: 행정, 사법, 경고장, 증거 패키지",
      "제11장. 플랫폼, 도메인, 저작권, 부정경쟁 결합 대응",
      "제12장. 세관, 국경조치, 물류 통제",
      "제13장. 모니터링, 내부통제, RACI",
      "제14장. 사례, 실패 패턴, 부록"
    ]);
  });

  it("preserves the key final-manuscript sections that drive China reader navigation", () => {
    const routeChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제4장. 출원 경로 선택: 직접출원 vs 마드리드"
    );
    const examinationChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제6장. 심사, 공고, 이의와 거절 대응"
    );
    const appendixChapter = documentData.chapters.find(
      (chapter) => chapter.title === "제14장. 사례, 실패 패턴, 부록"
    );

    expect(routeChapter?.headings.map((heading) => heading.title)).toEqual([
      "직접출원 vs 마드리드 readiness 보드",
      "출원 경로 시나리오별 판단표",
      "직접출원이 유리한 경우",
      "마드리드가 유리한 경우",
      "중국어 표기 전략과 경로 선택의 연결 고리",
      "경로를 고르기 전에 확인할 것",
      "경로 선택 메모를 남기는 방식"
    ]);
    expect(flattenHeadingTitles(examinationChapter?.headings)).toContain(
      "사건 기록 보드는 반드시 표준화한다"
    );
    expect(flattenHeadingTitles(examinationChapter?.headings)).toContain(
      "공식 기한 잠금표"
    );
    expect(appendixChapter?.headings.map((heading) => heading.title)).toContain(
      "부록 D. 2026-03-31 검증 메모"
    );
    expect(appendixChapter?.headings.map((heading) => heading.title)).toContain(
      "부록 E. 용어 표준화 초안"
    );
    expect(appendixChapter?.headings.map((heading) => heading.title)).toContain(
      "부록 F. 2026-04-03 release-readiness 메모"
    );
  });

  it("keeps the China search index dense enough for final-manuscript navigation", () => {
    expect(searchEntries.length).toBeGreaterThanOrEqual(175);

    const sectionTitles = new Set(searchEntries.map((entry) => entry.sectionTitle));

    expect(sectionTitles.has("개요")).toBe(true);
    expect(sectionTitles.has("마드리드가 유리한 경우")).toBe(true);
    expect(sectionTitles.has("거절 대응은 사건별이 아니라 포트폴리오 기준으로 본다")).toBe(true);
    expect(sectionTitles.has("출구 선택 매트릭스")).toBe(true);
    expect(sectionTitles.has("2개월 제출 패킷 표준안")).toBe(true);
    expect(sectionTitles.has("행정·플랫폼·세관·사법 quick route map")).toBe(true);
    expect(sectionTitles.has("부록 D. 2026-03-31 검증 메모")).toBe(true);
  });
});
