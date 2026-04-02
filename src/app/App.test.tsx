import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "./App";
import * as ga from "../analytics/ga";
import { briefIssues } from "../briefs/archive";
import { reports } from "../reports/registry";
import { liveShellReaderDefinitions } from "../products/liveShellReaders";
import { liveShellProducts } from "../products/registry";
import type { DocumentData } from "../products/shared";

const operatorProfileUrl = "https://ywkinfo.github.io";

function createMockDocumentData(title: string, chapterTitle: string, slug: string): DocumentData {
  return {
    meta: {
      title,
      builtAt: "2026-03-28T00:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: `${slug}-1`,
        slug,
        title: chapterTitle,
        summary: `${title} 요약`,
        html: '<h2 id="overview">개요</h2><p>기본 구조</p>',
        headings: [
          {
            id: "overview",
            depth: 2,
            title: "개요",
            children: []
          }
        ]
      }
    ]
  };
}

const documentDataByProduct = {
  latam: createMockDocumentData("중남미 상표 보호 운영 가이드", "중남미 제1장. 전략 프레임", "latam-overview"),
  mexico: createMockDocumentData("멕시코 상표 실무 운영 가이드북", "멕시코 제1장. 제도 개요", "mexico-overview"),
  usa: createMockDocumentData("미국 상표 실무 운영 가이드북", "미국 제1장. 제도 개요", "us-overview"),
  japan: createMockDocumentData("일본 상표 실무 운영 가이드북", "일본 제1장. 제도 개요", "japan-overview"),
  china: createMockDocumentData("중국 상표 실무 운영 가이드", "중국 제1장. 제도 개요", "china-overview"),
  europe: createMockDocumentData("EuTm 유럽 상표 운영 가이드북", "유럽 제1장. 제도 개요", "europe-overview"),
  uk: createMockDocumentData("영국 상표 실무 운영 가이드북", "영국 제1장. 제도 개요", "uk-overview")
};

const documentDataByReport = {
  "global-use-evidence-system": {
    meta: {
      title: "글로벌 사용 증거 수집 운영 시스템 구축",
      builtAt: "2026-04-02T09:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: "global-use-evidence-system",
        slug: "global-use-evidence-system",
        title: "글로벌 사용 증거 수집 운영 시스템 구축",
        summary: "여러 국가에서 재사용 가능한 사용 증거 운영 체계를 어떻게 미리 설계할지 정리한 리포트입니다.",
        html: [
          '<p>증거는 나중에 모으면 된다는 접근은 담당자가 바뀌거나 판매 화면이 사라질 때 바로 무너집니다.</p>',
          '<h3 id="최소-운영-구조">최소 운영 구조</h3>',
          '<p>시장별로 같은 폴더 구조와 owner를 두면 미국, 중국, 멕시코 대응에 재사용하기 쉬워집니다.</p>'
        ].join(""),
        headings: [
          {
            id: "최소-운영-구조",
            depth: 3,
            title: "최소 운영 구조",
            children: []
          }
        ]
      }
    ]
  } satisfies DocumentData
};

function installFetchMock() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const reportSlug = Object.keys(documentDataByReport).find((slug) =>
      url.includes(`/generated/reports/${slug}/`)
    );
    const productSlug = Object.keys(documentDataByProduct).find((slug) =>
      url.includes(`/generated/${slug}/`)
    );

    if (url.includes("document-data")) {
      if (reportSlug) {
        return new Response(
          JSON.stringify(documentDataByReport[reportSlug as keyof typeof documentDataByReport]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const documentData =
        documentDataByProduct[productSlug as keyof typeof documentDataByProduct]
        ?? documentDataByProduct.usa;

      return new Response(JSON.stringify(documentData), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  });

  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: fetchMock
  });

  return fetchMock;
}

function LocationProbe() {
  const location = useLocation();

  return (
    <output data-testid="app-location">
      {location.pathname}
      {location.hash}
    </output>
  );
}

function renderAppRouteTree(initialEntry: string, basename?: string) {
  return render(
    <MemoryRouter basename={basename} initialEntries={[initialEntry]}>
      <AppRoutes />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("App portfolio shell", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });

  it("keeps live product metadata aligned with live reader definitions", () => {
    expect(liveShellProducts.map((product) => product.slug)).toEqual(
      liveShellReaderDefinitions.map((definition) => definition.slug)
    );
  });

  it("shows all live guides on the gateway and in top navigation", () => {
    installFetchMock();

    renderAppRouteTree("/");

    const nav = screen.getByRole("navigation", { name: "제품 전환" });

    expect(within(nav).getByRole("link", { name: /Gateway/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /Brief/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /Report/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /LatTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /MexTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /UsaTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /JapTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /ChaTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /EuTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /UKTm/ })).toBeInTheDocument();

    expect(screen.getByText("중남미 상표 보호 운영 가이드")).toBeInTheDocument();
    expect(screen.getByText("멕시코 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("미국 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("일본 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("중국 상표 실무 운영 가이드")).toBeInTheDocument();
    expect(screen.getByText("EuTm 유럽 상표 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("영국 상표 실무 운영 가이드북")).toBeInTheDocument();

    expect(within(nav).getByRole("link", { name: /Gateway/ })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: /Brief/ })).toHaveAttribute("href", "/briefs");
    expect(within(nav).getByRole("link", { name: /Report/ })).toHaveAttribute("href", "/reports");
    expect(within(nav).getByRole("link", { name: /LatTm/ })).toHaveAttribute("href", "/latam");
    expect(within(nav).getByRole("link", { name: /MexTm/ })).toHaveAttribute("href", "/mexico");
    expect(within(nav).getByRole("link", { name: /UsaTm/ })).toHaveAttribute("href", "/usa");
    expect(document.querySelector('a[href="/japan"]')).not.toBeNull();
    expect(document.querySelector('a[href="/china"]')).not.toBeNull();
    expect(document.querySelector('a[href="/europe"]')).not.toBeNull();
    expect(document.querySelector('a[href="/uk"]')).not.toBeNull();
  });

  it.each([
    ["/latam", "중남미 상표 보호 운영 가이드", /LatTm/],
    ["/mexico", "멕시코 상표 실무 운영 가이드북", /MexTm/],
    ["/usa", "미국 상표 실무 운영 가이드북", /UsaTm/],
    ["/japan", "일본 상표 실무 운영 가이드북", /JapTm/],
    ["/china", "중국 상표 실무 운영 가이드", /ChaTm/],
    ["/europe", "EuTm 유럽 상표 운영 가이드북", /EuTm/],
    ["/uk", "영국 상표 실무 운영 가이드북", /UKTm/]
  ])("marks %s as an active live route", async (pathname, heading, navLabel) => {
    installFetchMock();

    renderAppRouteTree(pathname);

    await screen.findByRole("heading", { name: heading });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const activeLink = within(nav).getByRole("link", { name: navLabel });
    const latamLink = within(nav).getByRole("link", { name: /LatTm/ });

    expect(activeLink).toHaveClass("active");
    if (pathname !== "/latam") {
      expect(latamLink).not.toHaveClass("active");
    }
  });

  it("scrolls the active product chip into view on route changes", async () => {
    installFetchMock();
    const scrollIntoView = vi.fn();

    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView
    });

    renderAppRouteTree("/europe");

    await screen.findByRole("heading", { name: "EuTm 유럽 상표 운영 가이드북" });

    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("renders full document hrefs for top navigation and brand links", async () => {
    installFetchMock();
    renderAppRouteTree("/");

    await screen.findByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guides" });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });

    expect(screen.getByRole("link", { name: "GloTm" })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: /Gateway/ })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: /Brief/ })).toHaveAttribute("href", "/briefs");
    expect(within(nav).getByRole("link", { name: /Report/ })).toHaveAttribute("href", "/reports");
    expect(within(nav).getByRole("link", { name: /MexTm/ })).toHaveAttribute("href", "/mexico");
  });

  it("renders a full document href for the gateway hero CTA", async () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(gatewayHero).not.toBeNull();
    expect(within(gatewayHero as HTMLElement).queryByRole("link", { name: "UsaTm 보기" })).toBeNull();
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "MexTm 먼저 보기" })).toHaveAttribute(
      "href",
      "/mexico"
    );
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "LatTm 기준 프레임 보기" })).toHaveAttribute(
      "href",
      "/latam"
    );
  });

  it("renders the refreshed gateway intro as one lead and two summary paragraphs", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");
    const expectedSummaryParagraphs = [
      "검색 결과를 짜깁기하거나 일반 AI 답변을 그대로 믿기 전에, 내부 판단에 필요한 운영 질문을 빠르게 구조화할 수 있습니다.",
      "지금은 ChaTm -> MexTm -> EuTm -> Brief/Gateway 순서로 buyer-facing 밀도를 먼저 끌어올리고, LatTm은 기준선 보호, incubate 레인은 선택 보강으로 유지합니다."
    ];

    expect(gatewayHero).not.toBeNull();
    expect(
      within(gatewayHero as HTMLElement).getByText(
        "여러 국가·권역에서 시장 우선순위, 출원 경로, 유지·집행 판단을 하나의 셸과 검색 리더 경험으로 정리합니다."
      )
    ).toBeInTheDocument();
    expectedSummaryParagraphs.forEach((paragraph) => {
      expect(within(gatewayHero as HTMLElement).getByText(paragraph)).toBeInTheDocument();
    });
    expect((gatewayHero as HTMLElement).querySelectorAll(".gateway-summary")).toHaveLength(2);
  });

  it("renders wrap-safe separators in the coverage and current status metrics", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const livePortfolioPanel = screen.getByText("Portfolio Snapshot").closest("aside");

    expect(livePortfolioPanel).not.toBeNull();
    expect(
      within(livePortfolioPanel as HTMLElement).getByText(
        "권역형 2개와 국가형 5개를 운영하며, monthly scorecard로 search density, verification freshness, QA를 함께 관리합니다."
      )
    ).toBeInTheDocument();
  });

  it("groups the gateway hero title and intro copy into one shared content rail", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");
    const copyStack = (gatewayHero as HTMLElement | null)?.querySelector(".gateway-copy-stack");

    expect(gatewayHero).not.toBeNull();
    expect(copyStack).not.toBeNull();
    expect(within(copyStack as HTMLElement).getByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guides" })).toBeInTheDocument();
    expect((copyStack as HTMLElement).querySelectorAll(".gateway-summary")).toHaveLength(2);
    expect(within(copyStack as HTMLElement).queryByRole("link", { name: "MexTm 먼저 보기" })).toBeNull();
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "MexTm 먼저 보기" })).toBeInTheDocument();
  });

  it("places the reading flow above the risk section and links to the grouped portfolio", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const readingFlowHeading = screen.getByRole("heading", {
      name: "LatTm과 MexTm부터 보면 전체 구조와 즉시 실행 질문이 함께 잡힙니다"
    });
    const whyLateHeading = screen.getByRole("heading", { name: "상표 리스크는 늦게 보일수록 비싸집니다" });

    expect(
      readingFlowHeading.compareDocumentPosition(whyLateHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
    expect(
      screen.getByText(/LatTm은 cross-border 우선순위의 flagship이고, MexTm은 가장 빠르게 buyer entry value를 만드는 growth guide입니다\./)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "포트폴리오 우선 가이드 보기" })).toHaveAttribute(
      "href",
      "#portfolio-focus"
    );
  });

  it("surfaces the latest brief banner ahead of the reading flow with primary and archive CTAs", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const banner = screen.getByRole("region", { name: "최신 브리프 배너" });
    const readingFlowHeading = screen.getByRole("heading", {
      name: "LatTm과 MexTm부터 보면 전체 구조와 즉시 실행 질문이 함께 잡힙니다"
    });

    expect(within(banner).getByRole("heading", { name: briefIssues[0]?.title ?? "" })).toBeInTheDocument();
    expect(within(banner).getByRole("link", { name: "최신 이슈 보기" })).toHaveAttribute(
      "href",
      `/briefs/${briefIssues[0]?.slug}`
    );
    expect(within(banner).getByRole("link", { name: "브리프 전체 보기" })).toHaveAttribute(
      "href",
      "/briefs"
    );
    expect(
      banner.compareDocumentPosition(readingFlowHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
  });

  it("applies the centered header modifier only to the why-late section", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const whyLateSection = screen
      .getByRole("heading", { name: "상표 리스크는 늦게 보일수록 비싸집니다" })
      .closest("section");
    const productIntentSection = screen
      .getByRole("heading", { name: "시장 우선순위, 출원 경로, 유지·집행 판단을 한 번에 묶습니다" })
      .closest("section");
    const currentPilotScopeSection = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(
      (whyLateSection as HTMLElement | null)?.querySelector(".gateway-section-header")
    ).toHaveClass("gateway-section-header--centered");
    expect(
      (productIntentSection as HTMLElement | null)?.querySelector(".gateway-section-header")
    ).not.toHaveClass("gateway-section-header--centered");
    expect(
      (currentPilotScopeSection as HTMLElement | null)?.querySelector(".gateway-section-header")
    ).not.toHaveClass("gateway-section-header--centered");
  });

  it("groups the portfolio cards by tier and exposes the ChaTm maturity note", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Flagship" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Growth" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Validate" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Incubate" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByText("지속 업데이트 중")).toBeInTheDocument();
  });

  it("renders the operator intro section after the pilot scope with an external profile link", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");
    const operatorSection = screen
      .getByRole("heading", { name: "20년+ 상표 실무 경험을 바탕으로 먼저 봐야 할 판단을 정리합니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();
    expect(operatorSection).not.toBeNull();
    expect(
      (currentPilotScope as HTMLElement).compareDocumentPosition(operatorSection as HTMLElement)
      & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);

    const operatorLink = within(operatorSection as HTMLElement).getByRole("link", {
      name: "ywkinfo.github.io"
    });

    expect(operatorLink).toHaveAttribute("href", operatorProfileUrl);
    expect(operatorLink).toHaveAttribute("target", "_blank");
    expect(operatorLink).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("tracks guide opens on product routes", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree("/china");

    await screen.findByRole("heading", { name: "중국 상표 실무 운영 가이드" });

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "guide_open",
      expect.objectContaining({
        product_slug: "china",
        portfolio_tier: "growth",
        lifecycle_status: "beta",
        route_kind: "home"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  it("tracks portfolio CTA clicks and operator link clicks", () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree("/");

    fireEvent.click(screen.getByRole("link", { name: "ChaTm 보기" }));
    fireEvent.click(screen.getByRole("link", { name: "ywkinfo.github.io" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "guide_cta_click",
      expect.objectContaining({
        product_slug: "china",
        portfolio_tier: "growth",
        lifecycle_status: "beta",
        surface: "portfolio_growth"
      })
    );
    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "operator_link_click",
      expect.objectContaining({
        surface: "gateway_operator_section"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  it("surfaces the brief archive on the gateway with links to the archive and latest issue", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const briefSection = screen
      .getByRole("heading", { name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 빠르게 정리합니다" })
      .closest("section");

    expect(briefSection).not.toBeNull();
    expect(
      within(briefSection as HTMLElement).getByRole("link", { name: "브리프 전체 보기" })
    ).toHaveAttribute("href", "/briefs");
    expect(
      within(briefSection as HTMLElement).getByRole("link", { name: "이번 주 브리프 보기" })
    ).toHaveAttribute("href", `/briefs/${briefIssues[0]?.slug}`);
    expect(within(briefSection as HTMLElement).getByText(briefIssues[0]?.title ?? "")).toBeInTheDocument();
    expect(
      within(briefSection as HTMLElement).getByText(
        "Hot Global TM Brief는 해외 상표 뉴스를 길게 모아두는 피드가 아니라, 한국 기업이 이번 주 먼저 확인해야 할 브랜드 이슈 하나를 골라 짧고 밀도 있게 해설하는 운영 브리프입니다."
      )
    ).toBeInTheDocument();
    expect(
      within(briefSection as HTMLElement).queryByText(
        /이메일 게이트 없이 먼저 on-site archive로 축적하고/
      )
    ).toBeNull();
  });

  it("renders full document hrefs for grouped pilot scope cards", async () => {
    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();
    expect(within(currentPilotScope as HTMLElement).getByRole("link", { name: "MexTm 먼저 보기" })).toHaveAttribute(
      "href",
      "/mexico"
    );
    expect(within(currentPilotScope as HTMLElement).getByRole("link", { name: "LatTm 기준 프레임 보기" })).toHaveAttribute(
      "href",
      "/latam"
    );
    expect(within(currentPilotScope as HTMLElement).getByRole("link", { name: "ChaTm 보기" })).toHaveAttribute(
      "href",
      "/china"
    );
    expect(within(currentPilotScope as HTMLElement).getByRole("link", { name: "EuTm 보기" })).toHaveAttribute(
      "href",
      "/europe"
    );
    expect(within(currentPilotScope as HTMLElement).getByRole("link", { name: "UKTm 보기" })).toHaveAttribute(
      "href",
      "/uk"
    );
  });

  it("redirects unknown routes back to the gateway", async () => {
    installFetchMock();

    renderAppRouteTree("/missing");

    await screen.findByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guides" });
    expect(screen.getByTestId("app-location")).toHaveTextContent("/");
  });

  it("marks the brief archive as an active route", async () => {
    installFetchMock();

    renderAppRouteTree("/briefs");

    await screen.findByRole("heading", { name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 해설합니다" });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const activeLink = within(nav).getByRole("link", { name: /Brief/ });

    expect(activeLink).toHaveClass("active");
  });

  it("marks the report archive as an active route", async () => {
    installFetchMock();

    renderAppRouteTree("/reports");

    await screen.findByRole("heading", { name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트" });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const activeLink = within(nav).getByRole("link", { name: /Report/ });

    expect(activeLink).toHaveClass("active");
  });

  it("renders brief archive issues in latest-first order", async () => {
    installFetchMock();

    renderAppRouteTree("/briefs");

    await screen.findByRole("heading", { name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 해설합니다" });

    const archiveSection = screen
      .getByRole("heading", { name: "최신순으로 브리프 이슈를 모아 둡니다" })
      .closest("section");
    const issueHeadings = within(archiveSection as HTMLElement).getAllByRole("heading", { level: 3 });

    expect(issueHeadings[0]).toHaveTextContent(briefIssues[0]?.title ?? "");
    expect(issueHeadings[1]).toHaveTextContent(briefIssues[1]?.title ?? "");
  });

  it("renders brief issue pages with related guide links and tracks guide CTA clicks", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree(`/briefs/${briefIssues[0]?.slug}`);

    await screen.findByRole("heading", { name: briefIssues[0]?.title ?? "" });

    expect(
      screen.getByText(
        /위조 대응은 판매가 커진 뒤 뒤늦게 처리하는 법무 문제가 아니라, 해외 진출을 준비할 때부터 함께 설계해야 하는 사업 운영 문제입니다\./
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/2025년 K-화장품 수출이 114억3000만 달러/)).toBeInTheDocument();

    const guideLink = screen.getByRole("link", { name: "ChaTm 운영 가이드" });

    expect(guideLink).toHaveAttribute("href", "/china");
    fireEvent.click(guideLink);

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "brief_guide_click",
      expect.objectContaining({
        issue_slug: briefIssues[0]?.slug,
        item_id: "k-brand-counterfeit-strategy",
        target_path: "/china"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  it("renders report archive cards and links to the latest report", async () => {
    installFetchMock();

    renderAppRouteTree("/reports");

    await screen.findByRole("heading", { name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트" });

    const archiveSection = screen
      .getByRole("heading", { name: "최신순으로 스페셜 리포트를 모아 둡니다" })
      .closest("section");

    expect(archiveSection).not.toBeNull();
    expect(within(archiveSection as HTMLElement).getByRole("heading", { name: reports[0]?.title ?? "" })).toBeInTheDocument();
    expect(within(archiveSection as HTMLElement).getByRole("link", { name: "리포트 읽기" })).toHaveAttribute(
      "href",
      `/reports/${reports[0]?.slug}`
    );
    expect(screen.getByRole("link", { name: "최신 리포트 보기" })).toHaveAttribute(
      "href",
      `/reports/${reports[0]?.slug}`
    );
  });

  it("renders report detail pages with generated article content and related guide links", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${reports[0]?.slug}`);

    await screen.findByRole("heading", { name: reports[0]?.title ?? "" });

    expect(screen.getByText(/증거는 나중에 모으면 된다는 접근은 담당자가 바뀌거나 판매 화면이 사라질 때 바로 무너집니다\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LatTm 기준 프레임" })).toHaveAttribute("href", "/latam");
    expect(screen.getByRole("link", { name: "ChaTm 운영 가이드" })).toHaveAttribute("href", "/china");
  });

  it("respects a deployment basename for deep links and rendered hrefs", async () => {
    installFetchMock();

    renderAppRouteTree("/glotm/japan", "/glotm");

    await screen.findByRole("heading", { name: "일본 상표 실무 운영 가이드북" });
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/japan");
    });

    expect(document.querySelector('a[href="/glotm/"]')).not.toBeNull();
    expect(document.querySelector('a[href="/glotm/latam"]')).not.toBeNull();
    expect(document.querySelector('a[href="/glotm/reports"]')).not.toBeNull();
    expect(document.querySelector('a[href="/glotm/japan"]')).not.toBeNull();
    expect(document.querySelector('a[href="/glotm/europe"]')).not.toBeNull();
    expect(document.querySelector('a[href="/glotm/uk"]')).not.toBeNull();
  });
});
