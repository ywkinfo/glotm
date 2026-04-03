import { expect, test, type Page } from "@playwright/test";

const readerSmokeCases = [
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
    searchQuery: "불사용취소",
    searchResultText: "불사용취소"
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
        updatedAt: "2026-03-28T09:30:00.000Z"
      })
    );
  }, guide);
}

async function expectGuideSmoke(page: Page, guide: (typeof readerSmokeCases)[number]) {
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

test("gateway smoke", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /cross-border trademark operating guides/i
    })
  ).toBeVisible();
  await expect(page.getByText("Current Build Order")).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /ChaTm 보기|ChaTm · 중국 상표 실무 운영 가이드/
    })
  ).toBeVisible();
});

for (const guide of readerSmokeCases) {
  test(`${guide.name} reader smoke`, async ({ page }) => {
    await expectGuideSmoke(page, guide);
  });
}

test("brief archive smoke", async ({ page }) => {
  await page.goto("/briefs");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 해설합니다"
    })
  ).toBeVisible();
  await expect(
    page.getByText(
      "2026년 3월 Hot Global TM Brief | 중국 진출 직전에는 이름보다 표기·서브클래스 순서를 먼저 잠가야 합니다"
    )
  ).toBeVisible();
});

test("report archive smoke", async ({ page }) => {
  await page.goto("/reports");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트"
    })
  ).toBeVisible();
  await expect(
    page.getByText("글로벌 사용 증거 수집 운영 시스템 구축")
  ).toBeVisible();
});

test("mobile drawer scrim smoke", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/china/chapter/제5장-출원서-작성-실무와-지정상품-설계");
  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "제출 직전 7일 readiness 보드"
    })
  ).toBeVisible();

  await page.locator("button.topbar-button.mobile-only", { hasText: "목차" }).click();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  const scrim = page.locator(".mobile-scrim");
  const box = await scrim.boundingBox();

  expect(box).not.toBeNull();

  await scrim.click({
    force: true,
    position: {
      x: 20,
      y: 20
    }
  });
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("report detail smoke", async ({ page }) => {
  await page.goto("/reports/global-use-evidence-system");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "글로벌 사용 증거 수집 운영 시스템 구축"
    })
  ).toBeVisible();
  await expect(
    page.getByText("최소 운영 구조", { exact: false })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "LatTm 기준 프레임" })).toBeVisible();
});
