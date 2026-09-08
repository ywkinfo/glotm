import { expect, test } from "@playwright/test";

test("gateway smoke", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /cross-border trademark operating guide/i
    })
  ).toBeVisible();

  // 국가 진입이 게이트웨이의 1차 표면이다.
  const guideEntry = page.locator('[data-gateway-section="guide-entry"]');

  await expect(guideEntry).toBeVisible();
  await expect(guideEntry.locator("[data-guide-entry-slug]")).toHaveCount(7);
  await expect(guideEntry.getByRole("link", { name: /중국/ })).toHaveAttribute("href", "/china");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "최신 리포트 2개에서 세 가이드의 공통 질문을 함께 살펴봅니다"
    })
  ).toBeVisible();

  // 운영 체계(tier · 빌드 순서 · 스냅샷)는 삭제가 아니라 강등이다. 기본 접힘이고, 펼치면 남아 있다.
  const operationsPanel = page.locator('[data-gateway-section="operations"]');
  const buildOrderCard = page.getByRole("heading", { level: 3, name: "ChaTm · Growth Mature" });

  await expect(operationsPanel).toBeVisible();
  await expect(buildOrderCard).toBeHidden();

  await operationsPanel.getByRole("group").or(operationsPanel.locator("summary")).first().click();

  await expect(buildOrderCard).toBeVisible();
  await expect(page.getByText("Portfolio Snapshot")).toBeVisible();
});

// 이 라운드의 실사용 합격 기준: 390x844에서 첫 국가 선택이 추가 스크롤 없이 보이고,
// 7개 국가·권역에 모두 바로 접근 가능해야 한다.
test("gateway offers a country choice within the first mobile screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const guideEntry = page.locator('[data-gateway-section="guide-entry"]');
  const entryLinks = guideEntry.locator("[data-guide-entry-slug]");

  await expect(entryLinks).toHaveCount(7);

  // 스크롤하지 않은 상태에서 7개 선택지가 모두 뷰포트 안에 들어와야 한다.
  const firstScreen = await page.evaluate(() => {
    const links = [...document.querySelectorAll("[data-guide-entry-slug]")];

    return {
      scrollY: window.scrollY,
      firstTop: links[0]?.getBoundingClientRect().top ?? -1,
      fullyVisible: links.filter(
        (link) => link.getBoundingClientRect().bottom <= window.innerHeight
      ).length
    };
  });

  expect(firstScreen.scrollY).toBe(0);
  expect(firstScreen.firstTop).toBeGreaterThan(0);
  expect(firstScreen.fullyVisible).toBe(7);

  // 7개 모두 실제로 눌러서 갈 수 있어야 한다(숨김·잘림 없이).
  for (const slug of ["china", "mexico", "europe", "latam", "japan", "uk", "usa"]) {
    await expect(guideEntry.locator(`[data-guide-entry-slug="${slug}"]`)).toHaveAttribute(
      "href",
      `/${slug}`
    );
  }

  // 우선 순서는 registry gatewayOrder에서 나온다.
  const orderedSlugs = await entryLinks.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-guide-entry-slug"))
  );

  expect(orderedSlugs.slice(0, 3)).toEqual(["china", "mexico", "europe"]);
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
