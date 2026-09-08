import { expect, test } from "@playwright/test";

import { expectAnchorArrivalEventually, readerSmokeCases } from "../readerSmoke";

// 배포 경로 검증.
//
// 기본 Playwright project의 webServer는 `npm run build && npm run preview` = **루트 경로 빌드**라,
// 실제 배포 형태인 `/glotm/` basename에서의 딥링크·새로고침·hash 진입이 로컬 e2e에 전혀 없었다.
// 이 project는 `build:pages:glotm` 산출물을 subpath로 서빙해 그 구멍을 메운다.
// 비용을 고려해 `e2e:smoke`가 아니라 `health:release`에 건다.

const subpathGuides = readerSmokeCases.filter((guide) =>
  ["ChaTm", "MexTm", "EuTm"].includes(guide.name)
);

test("serves the gateway from the /glotm/ base path", async ({ page }) => {
  await page.goto("./");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /cross-border trademark operating guide/i
    })
  ).toBeVisible();

  // 내부 링크가 basename을 포함해야 새로고침이 살아난다. 라벨이 아니라 목적지를 단정한다
  // (내비 표기 계약은 App.test.tsx가 따로 지킨다).
  const gatewayNav = page.getByRole("navigation", { name: "제품 전환" });

  await expect(gatewayNav.locator('a[href="/glotm/china"]')).toHaveCount(1);
  await expect(gatewayNav.locator('a[href="/glotm/"]')).toHaveCount(1);
});

for (const guide of subpathGuides) {
  const chapterPath = `${guide.path}/chapter/${guide.bookmarkChapterSlug}`;
  const sectionPath = `${chapterPath}#${guide.bookmarkSectionId}`;

  test(`lands a /glotm/ deep link on the target section for ${guide.name}`, async ({ page }) => {
    await page.goto(`.${sectionPath}`);
    await page.locator(`[id="${guide.bookmarkSectionId}"]`).waitFor({ state: "attached" });

    expect(decodeURIComponent(new URL(page.url()).pathname)).toBe(`/glotm${chapterPath}`);
    await expectAnchorArrivalEventually(page, guide.bookmarkSectionId);
  });

  test(`survives a reload on a /glotm/ hash route for ${guide.name}`, async ({ page }) => {
    await page.goto(`.${sectionPath}`);
    await page.locator(`[id="${guide.bookmarkSectionId}"]`).waitFor({ state: "attached" });

    // GitHub Pages는 알 수 없는 경로를 404.html로 넘기고, 그 문서가 SPA를 다시 부팅한다.
    // 새로고침 후에도 같은 장·같은 섹션에 도착해야 한다.
    await page.reload();

    // SPA가 본문을 렌더한 뒤에 재야 한다. 새로고침 직후에는 정적 셸만 있어 좌표가 의미 없다.
    await expect(
      page.getByRole("heading", { level: 1, name: guide.bookmarkChapterTitle })
    ).toBeVisible();

    expect(decodeURIComponent(new URL(page.url()).pathname)).toBe(`/glotm${chapterPath}`);
    await expectAnchorArrivalEventually(page, guide.bookmarkSectionId);
  });
}
