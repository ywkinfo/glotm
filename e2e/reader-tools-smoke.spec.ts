import { expect, test } from "@playwright/test";

import {
  expectAnchorArrivalEventually,
  mobileReaderViewport,
  readerSmokeCases,
  waitForScrollToSettle
} from "./readerSmoke";

// 링크 복사와 인쇄.
//
// 인쇄는 호출 횟수 단정으로는 부족하다(`window.print()`가 불렸다고 출력이 읽을 만하다는 뜻이
// 아니다). Playwright에서 진짜 `window.print()`는 헤드리스를 멈추므로 부르지 않고,
// `emulateMedia({ media: "print" })`로 **실제 인쇄 렌더링**을 확인한다.

const toolsGuide = readerSmokeCases.find((guide) => guide.name === "MexTm")!;
const chapterPath = `${toolsGuide.path}/chapter/${toolsGuide.bookmarkChapterSlug}`;

test("copies a link to the section actually being read", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(chapterPath);

  const tools = page.locator("[data-reader-chapter-tools]");

  // 읽기 바(readingProgress >= 20)와 달리 진행률 0%에서도 보여야 한다.
  await expect(tools).toBeVisible();
  await expect(page.locator(".reader-action-bar")).toHaveCount(0);

  // 본문을 한참 읽어 내려간 뒤에도 스크롤 없이 닿을 수 있어야 한다.
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: "instant" }));
  await waitForScrollToSettle(page);
  await expect(tools).toBeInViewport();

  // 목차에서 한 섹션으로 이동한 뒤 복사하면, 진입 주소가 아니라 지금 위치를 가리켜야 한다.
  const outlineLinks = page.locator(".chapter-outline-link");
  const linkCount = await outlineLinks.count();
  const targetLink = outlineLinks.nth(Math.min(linkCount - 1, Math.floor(linkCount / 2)));
  const expectedSectionId = decodeURIComponent(
    ((await targetLink.getAttribute("href")) ?? "").split("#")[1] ?? ""
  );

  expect(expectedSectionId.length).toBeGreaterThan(0);

  await targetLink.click();
  await waitForScrollToSettle(page);

  // 도구는 sticky라 읽던 자리를 떠나지 않고 쓸 수 있어야 한다. 클릭이 페이지를 움직이면
  // "지금 읽는 섹션"이 달라지고, 그게 CI에서 이 테스트를 깨뜨렸던 결함이다.
  const scrollBeforeCopy = await page.evaluate(() => window.scrollY);

  await tools.getByRole("button", { name: "이 위치 링크 복사" }).click();

  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBeforeCopy);

  await expect(tools.getByRole("status")).toContainText("링크를 복사했습니다");

  const copied = await page.evaluate(() => navigator.clipboard.readText());

  expect(decodeURIComponent(copied)).toBe(
    `${new URL(page.url()).origin}${decodeURIComponent(chapterPath)}#${expectedSectionId}`
  );

  // 주소가 맞다는 것만으로는 부족하다 — 그 링크를 실제로 열었을 때 그 섹션에 도착해야 한다.
  await page.goto(copied);
  await page.locator(`[id="${expectedSectionId}"]`).waitFor({ state: "attached" });
  await expectAnchorArrivalEventually(page, expectedSectionId);
});

// 목차 접기 컨트롤은 640px 이하에서만 노출된다(`LatTm/src/styles.css`). 즉 "접힌 목차를
// 인쇄한다"는 상황은 모바일에서만 생기고, 인쇄 override가 필요한 것도 정확히 그 경우다.
test("renders a readable page under print media with a collapsed outline", async ({ page }) => {
  await page.setViewportSize(mobileReaderViewport);
  await page.goto(chapterPath);

  const outline = page.locator(".chapter-outline");
  const outlineList = page.locator("#chapter-outline-list");

  await expect(outline).toBeVisible();

  // 모바일에서는 목차가 접힌 상태로 시작한다. 이 상태 그대로 인쇄하는 경우를 본다.
  await expect(outlineList).toHaveClass(/collapsed/);
  await expect(outlineList).toBeHidden();

  await page.emulateMedia({ media: "print" });

  // 접힌 목차가 인쇄에서는 펼쳐져야 한다. `.chapter-outline`만 되살리면
  // `.chapter-outline-list.collapsed { display: none }`이 그대로 걸린다.
  await expect(outline).toBeVisible();
  await expect(outlineList).toBeVisible();
  await expect(page.locator(".chapter-outline-link").first()).toBeVisible();

  // 화면 전용 크롬은 인쇄에서 사라져야 한다.
  await expect(page.locator("[data-reader-chapter-tools]")).toBeHidden();
  await expect(page.locator(".global-topbar")).toBeHidden();
  await expect(page.locator(".reading-progress")).toBeHidden();

  // 넓은 표가 가로로 잘리지 않아야 한다.
  const tableOverflow = await page.evaluate(() => {
    const shells = [...document.querySelectorAll(".article .table-scroll")];

    return shells.map((shell) => shell.scrollWidth - shell.clientWidth);
  });

  for (const overflow of tableOverflow) {
    expect(overflow).toBeLessThanOrEqual(1);
  }

  // 인쇄에서는 본문 링크의 주소를 함께 찍는다. 긴 URL이 지면을 가로로 밀어내면 안 된다.
  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );

  expect(horizontalOverflow).toBeLessThanOrEqual(1);

  // 본문이 여러 페이지 분량으로 남아 있어야 한다(인쇄에서 잘려 나가지 않았다는 뜻).
  const articleHeight = await page
    .locator(".article")
    .evaluate((element) => element.getBoundingClientRect().height);

  expect(articleHeight).toBeGreaterThan(2000);

  // 인쇄 전용 출처 표기가 붙는다.
  await expect(page.locator(".chapter-page")).toHaveAttribute(
    "data-print-source",
    decodeURIComponent(chapterPath)
  );
});
