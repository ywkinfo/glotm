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
  await expect(
    page.getByText("이용자가 더 빨리 도움을 느낄 수 있는 레인부터 보강합니다")
  ).toBeVisible();
  await expect(
    page.getByText("국가별 guide를 열기 전에 여러 나라에 공통으로 걸리는 판단 질문부터 먼저 보고 싶다면 여기서 시작하면 됩니다.")
  ).toBeVisible();
  await expect(page.getByText("ChaTm은 핵심 내용을 더 쉽게 보이게 다듬었어요")).toBeVisible();
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
      "왜 한국 브랜드는 이제 위조 대응을 사업 전략으로 봐야 하나?"
    )
  ).toBeVisible();
});

test("report archive smoke", async ({ page }) => {
  await page.goto("/reports");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 리포트"
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
  await expect(page.getByText("지금 이 리포트를 먼저 보면 좋은 이유")).toBeVisible();
  await expect(page.getByRole("link", { name: "ChaTm route decision matrix" })).toBeVisible();
});
