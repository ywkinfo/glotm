const STAGE_ORDER = [
  { min: 1, max: 1, key: "strategy", label: "전략 프레임" },
  { min: 2, max: 3, key: "prefiling", label: "Pre-filing" },
  { min: 4, max: 6, key: "filing", label: "출원·심사" },
  { min: 7, max: 9, key: "postreg", label: "등록 후 운영" },
  { min: 10, max: 14, key: "enforcement", label: "모니터링·집행" },
  { min: 15, max: 19, key: "operations", label: "운영 체계" }
] as const;

export type ChapterStageKey = (typeof STAGE_ORDER)[number]["key"] | "appendix";

export function getChapterNumber(title: string) {
  const match = title.match(/제(\d+)장/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

export function getChapterStage(title: string): {
  key: ChapterStageKey;
  label: string;
} {
  const chapterNumber = getChapterNumber(title);

  if (chapterNumber === null) {
    return {
      key: "appendix",
      label: "부록"
    };
  }

  const stage = STAGE_ORDER.find(
    (entry) => chapterNumber >= entry.min && chapterNumber <= entry.max
  );

  if (!stage) {
    return {
      key: "appendix",
      label: "부록"
    };
  }

  return {
    key: stage.key,
    label: stage.label
  };
}
