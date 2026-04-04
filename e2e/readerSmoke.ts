import { expect, type Page } from "@playwright/test";

export const readerSmokeCases = [
  {
    name: "LatTm",
    path: "/latam",
    storageKey: "lattm_reading_bookmark",
    homeHeading: "중남미 상표 보호 운영 가이드",
    bookmarkChapterSlug: "제01장-중남미-상표-보호-전략-프레임-전체-구조",
    bookmarkChapterTitle: "제01장. 중남미 상표 보호 전략 프레임 (전체 구조)",
    bookmarkSectionId: "4-국가-선택-decision-box",
    bookmarkSectionTitle: "4. 국가 선택 Decision Box",
    searchQuery: "Decision Box",
    searchResultText: "Decision Box"
  },
  {
    name: "ChaTm",
    path: "/china",
    storageKey: "chatm_reading_bookmark",
    homeHeading: "중국 상표 실무 운영 가이드",
    bookmarkChapterSlug: "제10장-침해-대응-행정-사법-경고장-증거-패키지",
    bookmarkChapterTitle: "제10장. 침해 대응: 행정, 사법, 경고장, 증거 패키지",
    bookmarkSectionId: "출구-선택-매트릭스",
    bookmarkSectionTitle: "출구 선택 매트릭스",
    searchQuery: "heatmap",
    searchResultText: "cancellation heatmap"
  },
  {
    name: "MexTm",
    path: "/mexico",
    storageKey: "mextm_reading_bookmark",
    homeHeading: "멕시코 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교",
    bookmarkChapterTitle: "제4장 출원 경로 선택: 직접출원 vs 마드리드(국제출원) 비교",
    bookmarkSectionId: "buyer-entry-경로-선택표",
    bookmarkSectionTitle: "buyer-entry 경로 선택표",
    searchQuery: "buyer-entry",
    searchResultText: "buyer-entry 경로 선택표"
  },
  {
    name: "EuTm",
    path: "/europe",
    storageKey: "eutm_reading_bookmark",
    homeHeading: "EuTm 유럽 상표 운영 가이드북",
    bookmarkChapterSlug: "제8장-등록-후-사용-갱신-증거-관리",
    bookmarkChapterTitle: "제8장. 등록 후 사용, 갱신, 증거 관리",
    bookmarkSectionId: "distributor--marketplace-seller-evidence-triage",
    bookmarkSectionTitle: "distributor / marketplace seller evidence triage",
    searchQuery: "marketplace seller",
    searchResultText: "distributor / marketplace seller evidence triage"
  },
  {
    name: "UsaTm",
    path: "/usa",
    storageKey: "usatm_reading_bookmark",
    homeHeading: "미국 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "assignment-license-quality-control-실무",
    bookmarkChapterTitle: "Assignment, License, Quality Control 실무",
    bookmarkSectionId: "도입",
    bookmarkSectionTitle: "도입",
    searchQuery: "USPTO",
    searchResultText: "USPTO"
  },
  {
    name: "JapTm",
    path: "/japan",
    storageKey: "japtm_reading_bookmark",
    homeHeading: "일본 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "제10장-세관국경-조치와-물류-통제",
    bookmarkChapterTitle: "제10장 세관·국경 조치와 물류 통제",
    bookmarkSectionId: "도입",
    bookmarkSectionTitle: "도입",
    searchQuery: "JPO",
    searchResultText: "JPO"
  },
  {
    name: "UKTm",
    path: "/uk",
    storageKey: "uktm_reading_bookmark",
    homeHeading: "영국 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "영국-상표-시스템-맵과-ukipo-운영-구조",
    bookmarkChapterTitle: "영국 상표 시스템 맵과 UKIPO 운영 구조",
    bookmarkSectionId: "시작-전-체크리스트",
    bookmarkSectionTitle: "시작 전 체크리스트",
    searchQuery: "시작 전 체크리스트",
    searchResultText: "시작 전 체크리스트"
  }
] as const;

function installBookmark(page: Page, guide: (typeof readerSmokeCases)[number]) {
  return page.addInitScript((bookmark: (typeof readerSmokeCases)[number]) => {
    window.localStorage.setItem(
      bookmark.storageKey,
      JSON.stringify({
        chapterSlug: bookmark.bookmarkChapterSlug,
        chapterTitle: bookmark.bookmarkChapterTitle,
        sectionId: bookmark.bookmarkSectionId,
        sectionTitle: bookmark.bookmarkSectionTitle,
        progress: 55,
        updatedAt: "2026-04-04T09:30:00.000Z"
      })
    );
  }, guide);
}

export async function expectGuideSmoke(page: Page, guide: (typeof readerSmokeCases)[number]) {
  await installBookmark(page, guide);
  await page.goto(guide.path);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: guide.homeHeading
    })
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "검색" })).toBeVisible();
  await expect(page.getByText("Continue Reading")).toBeVisible();
  await expect(page.getByRole("link", { name: "이어 읽기" })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: guide.bookmarkChapterTitle
    })
  ).toBeVisible();

  const searchBox = page.getByRole("combobox", { name: "검색" });
  await searchBox.click();
  await searchBox.fill(guide.searchQuery);
  await expect(page.getByRole("option").first()).toBeVisible();
  await page.getByRole("option").first().click();
  await expect(page).toHaveURL(new RegExp(`${guide.path}/.+#`));
  await expect(page.getByText(guide.searchResultText, { exact: false }).first()).toBeVisible();
}
