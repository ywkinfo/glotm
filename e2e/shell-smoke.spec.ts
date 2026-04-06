import { expect, test } from "@playwright/test";

test("gateway smoke", async ({ page }) => {
  await page.goto("/");

  const gatewayHero = page.locator(".gateway-hero");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /cross-border trademark operating guide/i
    })
  ).toBeVisible();
  await expect(page.getByText("Current Build Order")).toBeVisible();
  await expect(
    gatewayHero.getByRole("link", {
      name: "ChaTm 보기"
    })
  ).toBeVisible();
});

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
      "2026년 4월 Hot Global TM Brief | 중국·멕시코·유럽에서 출원 경로를 같은 질문으로 보면 무엇이 달라지나"
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
    page.getByText("출원 경로 결정 프레임워크: 직접출원 vs 마드리드")
  ).toBeVisible();
});

test("report detail smoke", async ({ page }) => {
  await page.goto("/reports/global-filing-route-framework");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드"
    })
  ).toBeVisible();
  await expect(page.getByText("route memo 1-page 템플릿")).toBeVisible();
  await expect(page.getByRole("link", { name: "ChaTm route decision matrix" })).toBeVisible();
});
