import { expect, test } from "@playwright/test";

import {
  expectAnchorArrival,
  installReaderSmokeState,
  measureAnchorArrival,
  mobileReaderViewport,
  readerSmokeCases,
  waitForScrollToSettle
} from "./readerSmoke";

// 앵커 도착은 `toBeVisible()`로 증명되지 않는다 — 스크롤이 전혀 없어도, 고정 헤더에 완전히
// 가려져 있어도 통과한다. 여기서는 스크롤이 멎을 때까지 기다린 뒤 실제 좌표를 단정한다.
//
// 이 스펙이 잡는 회귀:
//   - 아예 이동하지 않음(scrollY === 0)
//   - 제목이 전역 topbar / 진행률 바 뒤로 들어감
//   - 과도한 오버슈트(제목이 화면 절반 아래)

const priorityGuides = readerSmokeCases.filter((guide) =>
  ["ChaTm", "MexTm", "EuTm"].includes(guide.name)
);

function buildSectionUrl(guide: (typeof readerSmokeCases)[number]) {
  return `${guide.path}/chapter/${guide.bookmarkChapterSlug}#${guide.bookmarkSectionId}`;
}

test.describe("anchor arrival", () => {
  for (const guide of readerSmokeCases) {
    test(`lands a direct deep link on the target section for ${guide.name}`, async ({ page }) => {
      await page.goto(buildSectionUrl(guide));
      await page.locator(`[id="${guide.bookmarkSectionId}"]`).waitFor({ state: "attached" });
      await waitForScrollToSettle(page);

      expectAnchorArrival(await measureAnchorArrival(page, guide.bookmarkSectionId));
    });
  }

  for (const guide of priorityGuides) {
    test(`lands a direct deep link on a 390x844 viewport for ${guide.name}`, async ({ page }) => {
      await page.setViewportSize(mobileReaderViewport);
      await page.goto(buildSectionUrl(guide));
      await page.locator(`[id="${guide.bookmarkSectionId}"]`).waitFor({ state: "attached" });
      await waitForScrollToSettle(page);

      expectAnchorArrival(await measureAnchorArrival(page, guide.bookmarkSectionId));
    });

    // 다른 장으로 가는 검색 결과 클릭. pathname이 함께 바뀌는 유일한 이동 경로라,
    // 전역 내비의 활성 칩 정렬 effect와 앵커 이동이 같은 프레임 근처에서 겹친다.
    test(`lands a cross-chapter search result for ${guide.name}`, async ({ page }) => {
      await installReaderSmokeState(page, guide);
      await page.goto(guide.path);

      await expect(page.getByRole("heading", { level: 1, name: guide.homeHeading })).toBeVisible();

      const searchBox = page.getByRole("combobox", { name: "검색" });

      await searchBox.click();
      await searchBox.fill(guide.searchQuery);

      const firstOption = page.getByRole("option").first();

      await expect(firstOption).toBeVisible();
      await firstOption.click();

      await page.waitForFunction(() => window.location.hash.length > 1);

      const sectionId = decodeURIComponent(
        new URL(page.url()).hash.replace(/^#/, "")
      );

      expect(sectionId.length).toBeGreaterThan(0);

      await page.locator(`[id="${sectionId}"]`).waitFor({ state: "attached" });
      await waitForScrollToSettle(page);

      expectAnchorArrival(await measureAnchorArrival(page, sectionId));
    });

    test(`lands an outline click inside the current chapter for ${guide.name}`, async ({ page }) => {
      await page.goto(`${guide.path}/chapter/${guide.bookmarkChapterSlug}`);

      const outlineLinks = page.locator(".chapter-outline-link");

      await expect(outlineLinks.first()).toBeVisible();

      // 첫 항목은 이미 상단이라 이동이 없을 수 있다. 중간 지점을 고른다.
      const linkCount = await outlineLinks.count();
      const targetLink = outlineLinks.nth(Math.min(linkCount - 1, Math.floor(linkCount / 2)));
      const href = await targetLink.getAttribute("href");
      const sectionId = decodeURIComponent((href ?? "").split("#")[1] ?? "");

      expect(sectionId.length).toBeGreaterThan(0);

      await targetLink.click();
      await waitForScrollToSettle(page);

      expectAnchorArrival(await measureAnchorArrival(page, sectionId));
    });

    // 문서 마지막 절. 모든 제목을 clearance 선까지 올릴 수는 없으므로(더 스크롤할 여지가 없다)
    // 도착 판정은 최대 스크롤 위치를 반영해야 한다. 그렇지 않으면 여기서 영구히 실패한다.
    test(`stops at the document end for the last section of ${guide.name}`, async ({ page }) => {
      await page.goto(`${guide.path}/chapter/${guide.bookmarkChapterSlug}`);

      const outlineLinks = page.locator(".chapter-outline-link");

      await expect(outlineLinks.first()).toBeVisible();

      const lastLink = outlineLinks.last();
      const href = await lastLink.getAttribute("href");
      const sectionId = decodeURIComponent((href ?? "").split("#")[1] ?? "");

      expect(sectionId.length).toBeGreaterThan(0);

      await lastLink.click();
      await waitForScrollToSettle(page);

      const arrival = await measureAnchorArrival(page, sectionId);

      expect(arrival.headingTop).not.toBeNull();

      const headingTop = arrival.headingTop as number;

      expect(arrival.scrollY).toBeGreaterThan(0);
      // 마지막 절은 clearance 선까지 못 올라갈 수 있다. 그 경우 문서 끝에 닿아 있어야 하고,
      // 어느 쪽이든 제목은 뷰포트 안에 남아 있어야 한다.
      const hasReachedDocumentEnd = arrival.scrollY >= arrival.maxScrollTop - 2;

      expect(hasReachedDocumentEnd || headingTop >= arrival.stickyBottom - 1).toBeTruthy();
      expect(headingTop).toBeGreaterThanOrEqual(0);
      expect(headingTop).toBeLessThan(arrival.viewportHeight);
    });
  }
});
