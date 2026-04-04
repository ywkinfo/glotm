import { expect, test } from "@playwright/test";

import {
  expectGuideSmoke,
  readerSmokeCases
} from "./readerSmoke";

for (const guide of readerSmokeCases) {
  test(`${guide.name} reader smoke`, async ({ page }) => {
    await expectGuideSmoke(page, guide);
  });
}

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
