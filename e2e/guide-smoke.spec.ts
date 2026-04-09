import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  expectContinueReadingDeepLink,
  expectGuideSmoke,
  installReaderSmokeState,
  mobileReaderViewport,
  readerSearchEmptyStateText,
  readerSmokeCases,
  readerZeroResultQuery,
  type ReaderSmokeCase
} from "./readerSmoke";

const trustLayerRoundtripCases = [
  {
    guideName: "ChaTm",
    guidePath: "/china",
    reportTitle: "브랜드 표장 현지화 vs. 표준화: 글로벌 상표 운영 결정 프레임워크",
    reportPath:
      "/reports/brand-localization-vs-standardization-framework?fromGuide=china",
    returnLinkName: "ChaTm로 돌아가기",
    returnHref:
      "/china/chapter/제2장-브랜드-구조와-중국어-표기-전략#표기-후보를-gorevisehold로-자르는-기준",
    focusPointLinkName: "ChaTm 표기 전략 보기"
  },
  {
    guideName: "MexTm",
    guidePath: "/mexico",
    reportTitle: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
    reportPath: "/reports/global-filing-route-framework?fromGuide=mexico",
    returnLinkName: "MexTm로 돌아가기",
    returnHref:
      "/mexico/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교#buyer-entry-경로-선택표",
    focusPointLinkName: "MexTm buyer-entry 표 보기"
  },
  {
    guideName: "EuTm",
    guidePath: "/europe",
    reportTitle: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
    reportPath: "/reports/global-filing-route-framework?fromGuide=europe",
    returnLinkName: "EuTm로 돌아가기",
    returnHref:
      "/europe/chapter/제5장-출원-경로와-서류-설계#route-pack-lock-board",
    focusPointLinkName: "EuTm lock board 보기"
  }
] as const;

const continueReadingDeepLinkCases = readerSmokeCases.filter(
  (guide) => guide.name === "ChaTm" || guide.name === "MexTm"
);

const skeletonGuideNames = new Set<ReaderSmokeCase["name"]>([
  "UsaTm",
  "JapTm",
  "ChaTm",
  "EuTm",
  "UKTm"
]);

const skeletonGuideZeroResultCases = readerSmokeCases.filter((guide) =>
  skeletonGuideNames.has(guide.name)
);

const mobileSearchGuide = readerSmokeCases.find((guide) => guide.name === "ChaTm");
const mobileActionBarGuide = readerSmokeCases.find((guide) => guide.name === "UKTm");

if (!mobileSearchGuide || !mobileActionBarGuide) {
  throw new Error("Required reader smoke cases are missing.");
}

function buildReaderChapterPath(guide: ReaderSmokeCase) {
  return `${guide.path}/chapter/${guide.bookmarkChapterSlug}`;
}

async function expectTopmostAtCenter(page: Page, locator: Locator) {
  const handle = await locator.elementHandle();

  expect(handle).not.toBeNull();

  if (!handle) {
    return;
  }

  const isTopmost = await page.evaluate((element: Element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const topElement = document.elementFromPoint(x, y);

    return topElement instanceof Element
      && (element === topElement || element.contains(topElement) || topElement.contains(element));
  }, handle);

  expect(isTopmost).toBe(true);
}

async function expectNoOverlap(first: Locator, second: Locator) {
  const [firstBox, secondBox] = await Promise.all([first.boundingBox(), second.boundingBox()]);

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  if (!firstBox || !secondBox) {
    return;
  }

  const overlapWidth = Math.max(
    0,
    Math.min(firstBox.x + firstBox.width, secondBox.x + secondBox.width)
      - Math.max(firstBox.x, secondBox.x)
  );
  const overlapHeight = Math.max(
    0,
    Math.min(firstBox.y + firstBox.height, secondBox.y + secondBox.height)
      - Math.max(firstBox.y, secondBox.y)
  );

  expect(overlapWidth * overlapHeight).toBe(0);
}

for (const guide of readerSmokeCases) {
  test(`${guide.name} reader smoke`, async ({ page }) => {
    await expectGuideSmoke(page, guide);
  });
}

for (const guide of continueReadingDeepLinkCases) {
  test(`${guide.name} continue reading deep-link return`, async ({ page }) => {
    await expectContinueReadingDeepLink(page, guide);
  });
}

for (const trustLayerCase of trustLayerRoundtripCases) {
  test(`${trustLayerCase.guideName} trust-layer roundtrip from guide home`, async ({ page }) => {
    await page.goto(trustLayerCase.guidePath);

    const handoffSection = page.getByRole("region", { name: "관련 Report / Trust Layer" });
    const handoffCard = handoffSection.locator("article", {
      has: page.getByRole("heading", {
        level: 3,
        name: trustLayerCase.reportTitle
      })
    });
    const handoffLink = handoffCard.getByRole("link", { name: "리포트 보기" });

    await expect(handoffLink).toHaveAttribute("href", trustLayerCase.reportPath);
    await handoffLink.click();

    await expect(page).toHaveURL(trustLayerCase.reportPath);

    const returnLink = page.getByRole("link", { name: trustLayerCase.returnLinkName });

    await expect(returnLink).toHaveAttribute("href", trustLayerCase.returnHref);
    await returnLink.click();
    await expect(page).toHaveURL(trustLayerCase.returnHref);

    await page.goto(trustLayerCase.guidePath);
    await handoffLink.click();
    await expect(page).toHaveURL(trustLayerCase.reportPath);

    const focusPointLink = page.getByRole("link", { name: trustLayerCase.focusPointLinkName });

    await expect(focusPointLink).toHaveAttribute("href", trustLayerCase.returnHref);
    await focusPointLink.click();
    await expect(page).toHaveURL(trustLayerCase.returnHref);
  });
}

test("mobile chapter search stays visible and clickable above sticky layers", async ({ page }) => {
  await page.setViewportSize(mobileReaderViewport);
  await installReaderSmokeState(page, mobileSearchGuide);

  await page.goto(buildReaderChapterPath(mobileSearchGuide));
  await expect(
    page.getByRole("heading", {
      name: mobileSearchGuide.bookmarkChapterTitle
    })
  ).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await expect(page.locator(".reading-progress")).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "맨 위로" })).toBeVisible();

  const searchBox = page.getByRole("combobox", { name: "검색" });
  await searchBox.click();
  await searchBox.fill(mobileSearchGuide.searchQuery);

  const listbox = page.getByRole("listbox", { name: "검색 결과" });
  const firstOption = page.getByRole("option").first();

  await expect(listbox).toBeVisible();
  await expect(firstOption).toBeVisible();
  await expect(firstOption).toContainText(mobileSearchGuide.searchResultText);
  await expectTopmostAtCenter(page, firstOption);

  await firstOption.click();

  await expect(page).toHaveURL(new RegExp(`${mobileSearchGuide.path}/.+#`));

  const sectionId = decodeURIComponent(new URL(page.url()).hash.replace(/^#/, ""));

  await expect(page.locator(`[id="${sectionId}"]`)).toBeVisible();
});

test("mobile action bar stays clear of chapter navigation near the page end", async ({ page }) => {
  await page.setViewportSize(mobileReaderViewport);
  await installReaderSmokeState(page, mobileActionBarGuide);

  await page.goto(buildReaderChapterPath(mobileActionBarGuide));
  await expect(
    page.getByRole("heading", {
      name: mobileActionBarGuide.bookmarkChapterTitle
    })
  ).toBeVisible();

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  const actionBar = page.locator(".reader-action-bar");
  const chapterNav = page.getByRole("navigation", { name: "챕터 탐색" });
  const nextLink = page.getByRole("link", { name: /다음/ });
  const nextHref = await nextLink.getAttribute("href");

  await expect(actionBar).toBeVisible();
  await expect(chapterNav).toBeVisible();
  await expect(nextLink).toBeVisible();
  await expectNoOverlap(actionBar, nextLink);

  await nextLink.click();

  if (nextHref) {
    await expect(page).toHaveURL(nextHref);
  }
});

for (const guide of skeletonGuideZeroResultCases) {
  test(`${guide.name} zero-result search empty state`, async ({ page }) => {
    await installReaderSmokeState(page, guide);
    await page.goto(guide.path);

    const searchBox = page.getByRole("combobox", { name: "검색" });
    const listbox = page.getByRole("listbox", { name: "검색 결과" });

    await searchBox.click();
    await searchBox.fill(readerZeroResultQuery);

    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole("option")).toHaveCount(0);
    await expect(listbox.getByText(readerSearchEmptyStateText)).toBeVisible();
  });
}

test("mobile drawer scrim smoke", async ({ page }) => {
  await page.setViewportSize(mobileReaderViewport);

  await page.goto("/china/chapter/제5장-출원서-작성-실무와-지정상품-설계");
  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "제출 직전 7일 readiness 보드"
    })
  ).toBeVisible();

  await page.getByRole("button", { exact: true, name: "목차" }).click();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  const scrim = page.getByRole("button", { name: "열린 패널 닫기" });
  const box = await scrim.boundingBox();

  expect(box).not.toBeNull();

  if (box) {
    await scrim.click({
      position: {
        x: Math.max(20, box.width - 20),
        y: Math.max(120, Math.min(box.height - 20, box.height / 2))
      }
    });
  }

  await expect(scrim).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});
