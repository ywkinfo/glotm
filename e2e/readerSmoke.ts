import { expect, type Page } from "@playwright/test";

export const mobileReaderViewport = {
  width: 390,
  height: 844
} as const;

export const readerActionBarHiddenStorageKey = "glotm_reader_action_bar_hidden";
export const readerSearchEmptyStateText = "일치하는 섹션을 찾지 못했습니다.";
export const readerZeroResultQuery = "픞쀍궭홝987654321";

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
    bookmarkSectionId: "owner-chain-recordation-workflow",
    bookmarkSectionTitle: "owner-chain recordation workflow",
    searchQuery: "USPTO",
    searchResultText: "USPTO"
  },
  {
    name: "JapTm",
    path: "/japan",
    storageKey: "japtm_reading_bookmark",
    homeHeading: "일본 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "제7장-등록-후-유지관리-갱신권리-유지-캘린더",
    bookmarkChapterTitle: "제7장 등록 후 유지관리: 갱신·권리 유지 캘린더",
    bookmarkSectionId: "evidence-hygiene-quick-check",
    bookmarkSectionTitle: "evidence hygiene quick check",
    searchQuery: "route memo board",
    searchResultText: "route memo board"
  },
  {
    name: "UKTm",
    path: "/uk",
    storageKey: "uktm_reading_bookmark",
    homeHeading: "영국 상표 실무 운영 가이드북",
    bookmarkChapterSlug: "등록-후-유지관리와-갱신-체계",
    bookmarkChapterTitle: "등록 후 유지관리와 갱신 체계",
    bookmarkSectionId: "maintenance-owner-board",
    bookmarkSectionTitle: "maintenance owner board",
    searchQuery: "online incident quick board",
    searchResultText: "online incident quick board"
  }
] as const;

export type ReaderSmokeCase = (typeof readerSmokeCases)[number];

export function installReaderSmokeState(page: Page, guide: ReaderSmokeCase) {
  return page.addInitScript(
    ({ actionBarStorageKey, bookmark }: { actionBarStorageKey: string; bookmark: ReaderSmokeCase }) => {
      window.localStorage.removeItem(actionBarStorageKey);

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
    },
    {
      actionBarStorageKey: readerActionBarHiddenStorageKey,
      bookmark: guide
    }
  );
}

export async function expectContinueReadingDeepLink(
  page: Page,
  guide: ReaderSmokeCase
) {
  const expectedChapterPath = `${guide.path}/chapter/${guide.bookmarkChapterSlug}`;
  const expectedSectionPath = `${expectedChapterPath}#${guide.bookmarkSectionId}`;

  await installReaderSmokeState(page, guide);
  await page.goto(guide.path);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: guide.homeHeading
    })
  ).toBeVisible();

  const continueLink = page.getByRole("link", { name: "이어 읽기" });

  await expect(page.getByText("Continue Reading")).toBeVisible();
  await expect(continueLink).toHaveAttribute("href", expectedSectionPath);
  await continueLink.click();

  await expect(page).toHaveURL(expectedSectionPath);
  await expect(page.getByRole("heading", { name: guide.bookmarkChapterTitle })).toBeVisible();
  await expect(page.locator(`[id="${guide.bookmarkSectionId}"]`)).toBeVisible();

  const chapterOutline = page.locator(".chapter-outline");
  const activeOutlineLink = chapterOutline.getByRole("link", {
    name: guide.bookmarkSectionTitle,
    exact: true
  });

  await expect(chapterOutline).toBeVisible();
  await expect(activeOutlineLink).toHaveAttribute("href", expectedSectionPath);
  await expect(activeOutlineLink).toHaveAttribute("aria-current", "location");
}

export async function expectGuideSmoke(page: Page, guide: ReaderSmokeCase) {
  await installReaderSmokeState(page, guide);
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

// 스크롤이 멎을 때까지 기다린다. `toBeVisible()`은 스크롤이 전혀 없어도 통과하고,
// 고정 헤더에 가려진 제목도 "보인다"고 판정하므로 앵커 도착의 증명이 되지 못한다.
// 실제 좌표를 재려면 먼저 이동이 끝나야 한다.
//
// 문서 높이도 함께 본다. 새로고침 직후에는 SPA가 부팅하는 동안 scrollY가 0에 머무르고
// 문서 높이만 373 -> 533 -> 15126px로 자라는 구간이 있는데, 스크롤만 보면 이 정적 구간을
// "멎었다"로 오판해 이동 전 좌표를 재게 된다. 높이가 함께 안정돼야 실제로 멎은 것이다.
export async function waitForScrollToSettle(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        let lastScrollY = window.scrollY;
        let lastScrollHeight = document.documentElement.scrollHeight;
        let stableFrames = 0;

        const tick = () => {
          const scrollHeight = document.documentElement.scrollHeight;

          if (window.scrollY === lastScrollY && scrollHeight === lastScrollHeight) {
            stableFrames += 1;
          } else {
            stableFrames = 0;
            lastScrollY = window.scrollY;
            lastScrollHeight = scrollHeight;
          }

          if (stableFrames >= 12) {
            resolve(true);
            return;
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }),
    null,
    { timeout: 15_000 }
  );
}

export type AnchorArrival = {
  scrollY: number;
  maxScrollTop: number;
  viewportHeight: number;
  headingTop: number | null;
  stickyBottom: number;
};

// 앵커 도착을 좌표로 재고, 상단에 붙은 고정 크롬(전역 topbar + 진행률 바)의 아래 끝을 함께 돌려준다.
export async function measureAnchorArrival(page: Page, sectionId: string): Promise<AnchorArrival> {
  return page.evaluate((targetSectionId: string) => {
    const target = document.getElementById(targetSectionId);
    const stickyBottoms: number[] = [];
    const topbar = document.querySelector(".global-topbar");

    if (topbar) {
      stickyBottoms.push(topbar.getBoundingClientRect().bottom);
    }

    const progress = document.querySelector(".reading-progress");

    if (progress) {
      const progressStyle = window.getComputedStyle(progress);
      const progressRect = progress.getBoundingClientRect();

      // 진행률 바는 sticky라 문서 위쪽에서는 본문 흐름에 있다. 상단에 실제로 붙어 있을 때만
      // 본문을 가리는 요소로 센다.
      if (
        (progressStyle.position === "sticky" || progressStyle.position === "fixed")
        && progressRect.top < window.innerHeight * 0.5
      ) {
        stickyBottoms.push(progressRect.bottom);
      }
    }

    return {
      scrollY: window.scrollY,
      maxScrollTop: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      viewportHeight: window.innerHeight,
      headingTop: target ? target.getBoundingClientRect().top : null,
      stickyBottom: stickyBottoms.length > 0 ? Math.max(...stickyBottoms) : 0
    };
  }, sectionId);
}

// 앵커 도착 검사 정본.
//
// 두 단계로 본다. (1) 도착할 때까지 재시도하고 — 새로고침 직후처럼 SPA 부팅·데이터 fetch가
// 끼는 경로에서는 이동이 수백 ms 뒤에 일어나며, 그 사이 scrollY와 문서 높이가 모두 정지한
// 구간이 있어 "멎었다"만으로는 이동 전 좌표를 재게 된다. (2) 그 뒤 실제로 멎을 때까지 기다려
// 한 번 더 단정한다 — 잠깐 맞았다가 밀리는 경우를 걸러낸다.
//
// 앱이 아예 이동하지 않으면 (1)에서 타임아웃으로 실패하므로 진짜 결함은 그대로 잡힌다.
export async function expectAnchorArrivalEventually(page: Page, sectionId: string) {
  await expect(async () => {
    expectAnchorArrival(await measureAnchorArrival(page, sectionId));
  }).toPass({ timeout: 10_000 });

  await waitForScrollToSettle(page);
  expectAnchorArrival(await measureAnchorArrival(page, sectionId));
}

// 좌표 단정 정본. 세 가지를 한 번에 본다:
//   1) 아예 이동하지 않음   2) 고정 크롬에 가림   3) 과도한 오버슈트
export function expectAnchorArrival(arrival: AnchorArrival) {
  expect(arrival.headingTop).not.toBeNull();

  const headingTop = arrival.headingTop as number;

  expect(arrival.scrollY).toBeGreaterThan(0);
  // 서브픽셀 반올림 여유 1px.
  expect(headingTop).toBeGreaterThanOrEqual(arrival.stickyBottom - 1);
  expect(headingTop).toBeLessThan(arrival.viewportHeight * 0.5);
}
