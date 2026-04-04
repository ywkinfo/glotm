import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "./App";
import * as ga from "../analytics/ga";
import { briefIssues } from "../briefs/archive";
import { getGatewayFeaturedReports, getPrimaryGatewayReport, getReportBySlug, reports } from "../reports/registry";
import type { DocumentData } from "../products/shared";

const operatorProfileUrl = "https://ywkinfo.github.io";
const primaryGatewayReport = getPrimaryGatewayReport();
const supportingGatewayReport = getReportBySlug("global-use-evidence-system");
const gatewayFeaturedReports = getGatewayFeaturedReports(2);

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
  "global-filing-route-framework": {
    meta: {
      title: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
      builtAt: "2026-04-04T12:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: "global-filing-route-framework",
        slug: "global-filing-route-framework",
        title: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
        summary: "direct filing vs Madrid를 local-fit, owner split, route switch 기준으로 다시 정리한 리포트입니다.",
        html: [
          "<p>직접출원과 마드리드 비교에서 먼저 잠가야 하는 것은 local-fit pressure, central-management confidence, owner split, switch trigger입니다.</p>",
          '<h3 id="route-memo-1-page-템플릿">route memo 1-page 템플릿</h3>',
          "<p>메모는 길 필요가 없고, launch priority와 handoff owner가 보이면 충분합니다.</p>"
        ].join(""),
        headings: [
          {
            id: "route-memo-1-page-템플릿",
            depth: 3,
            title: "route memo 1-page 템플릿",
            children: []
          }
        ]
      }
    ]
  } satisfies DocumentData,
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

function clickTrackedLink(link: HTMLElement) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  }, { once: true });

  fireEvent.click(link);
}

describe("App portfolio shell", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });

  it(
    "shows all live guides on the gateway and in top navigation",
    async () => {
    installFetchMock();

    renderAppRouteTree("/");

    await screen.findByRole("heading", {
      name: "인하우스 팀을 위한 cross-border trademark operating guides"
    });

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
    },
    30000
  );

  it("orders live guides in the current active lane sequence after utility routes", async () => {
    installFetchMock();

    renderAppRouteTree("/");

    await screen.findByRole("heading", {
      name: "인하우스 팀을 위한 cross-border trademark operating guides"
    });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const navLabels = [...nav.querySelectorAll(".global-nav-label")].map((label) => label.textContent?.trim());

    expect(navLabels).toEqual([
      "Gateway",
      "Brief",
      "Report",
      "ChaTm",
      "MexTm",
      "EuTm",
      "LatTm",
      "JapTm",
      "UKTm",
      "UsaTm"
    ]);
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

  it.each([
    ["/china", "Growth tier · Mature lifecycle · Full QA · 단일 시장 가이드"],
    ["/mexico", "Growth tier · Mature lifecycle · Full QA · 단일 시장 가이드"],
    ["/europe", "Validate tier · Beta lifecycle · Standard QA · 권역 가이드"],
    ["/usa", "Incubate tier · Beta lifecycle · Standard QA · 단일 시장 가이드"],
    ["/japan", "Incubate tier · Beta lifecycle · Standard QA · 단일 시장 가이드"],
    ["/uk", "Incubate tier · Pilot lifecycle · Smoke QA · 단일 시장 가이드"]
  ])("derives reader home status copy from registry truth for %s", async (pathname, statusLabel) => {
    installFetchMock();

    renderAppRouteTree(pathname);

    await screen.findByText(statusLabel);

    expect(screen.getByText(statusLabel)).toBeInTheDocument();
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
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "ChaTm 보기" })).toHaveAttribute(
      "href",
      "/china"
    );
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "MexTm 먼저 보기" })).toHaveAttribute(
      "href",
      "/mexico"
    );
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "Front Report 보기" })).toHaveAttribute(
      "href",
      `/reports/${primaryGatewayReport?.slug}`
    );
  });

  it("renders the refreshed gateway intro as one lead and two summary paragraphs", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(gatewayHero).not.toBeNull();
    expect(
      within(gatewayHero as HTMLElement).getByText(
        "여러 국가·권역에서 시장 우선순위, 출원 경로, 유지·집행 판단을 하나의 셸과 검색 리더 경험으로 정리합니다."
      )
    ).toBeInTheDocument();
    const summaryParagraphs = [...(gatewayHero as HTMLElement).querySelectorAll(".gateway-summary")].map(
      (paragraph) => paragraph.textContent?.trim()
    );
    expect(summaryParagraphs).toHaveLength(2);
    expect(summaryParagraphs[0]).toBe(
      "검색 결과를 짜깁기하거나 일반 AI 답변을 그대로 믿기 전에, 내부 판단에 필요한 운영 질문을 빠르게 구조화할 수 있습니다."
    );
    expect(summaryParagraphs[1]).toContain("ChaTm");
    expect(summaryParagraphs[1]).toContain("MexTm");
    expect(summaryParagraphs[1]).toContain("front/supporting report를 포함한 Gateway trust layer");
  });

  it("renders wrap-safe separators in the coverage and current status metrics", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const livePortfolioPanel = screen.getByText("Portfolio Snapshot").closest("aside");

    expect(livePortfolioPanel).not.toBeNull();
    expect(
      within(livePortfolioPanel as HTMLElement).getByText(
        "권역형 2개와 국가형 5개를 운영하며, monthly health review와 scorecard로 search density, verification freshness, QA를 함께 관리합니다."
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
    expect(within(copyStack as HTMLElement).queryByRole("link", { name: "ChaTm 보기" })).toBeNull();
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "ChaTm 보기" })).toBeInTheDocument();
  });

  it("places the reading flow above the risk section and links to the grouped portfolio", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const readingFlowHeading = screen.getByRole("heading", {
      name: "ChaTm과 MexTm부터 보면 현재 우선 레인과 실행 질문이 함께 잡힙니다"
    });
    const whyLateHeading = screen.getByRole("heading", { name: "상표 리스크는 늦게 보일수록 비싸집니다" });

    expect(
      readingFlowHeading.compareDocumentPosition(whyLateHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
    expect(
      screen.getByText(/ChaTm은 지금 growth lane의 mature baseline으로 승격 반영된 최우선 guide이고, MexTm은 buyer-entry 기준의 mature country baseline입니다\./)
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
      name: "ChaTm과 MexTm부터 보면 현재 우선 레인과 실행 질문이 함께 잡힙니다"
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

  it("brings front reports above the latest brief banner on the gateway", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const frontReportsSection = screen
      .getByRole("heading", { name: "지금 읽어야 할 Report를 Gateway 첫 화면에서 바로 엽니다" })
      .closest("section");
    const briefBanner = screen.getByRole("region", { name: "최신 브리프 배너" });

    expect(frontReportsSection).not.toBeNull();
    expect(
      within(frontReportsSection as HTMLElement).getAllByRole("heading", { name: primaryGatewayReport?.title ?? "" }).length
    ).toBeGreaterThan(0);
    expect(
      within(frontReportsSection as HTMLElement).getAllByRole("heading", { name: gatewayFeaturedReports[1]?.title ?? "" }).length
    ).toBeGreaterThan(0);
    expect(
      within(frontReportsSection as HTMLElement).getByRole("link", { name: "Front Report 바로 보기" })
    ).toHaveAttribute("href", `/reports/${primaryGatewayReport?.slug}`);
    expect(
      within(frontReportsSection as HTMLElement).getAllByRole("link", { name: "Supporting Report 보기" }).at(0)
    ).toHaveAttribute("href", `/reports/${gatewayFeaturedReports[1]?.slug}`);
    expect(
      within(frontReportsSection as HTMLElement).getAllByText(
        /대상: 다국가 launch sequencing과 filing route를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀/
      ).length
    ).toBeGreaterThan(0);
    expect(
      (frontReportsSection as HTMLElement).compareDocumentPosition(briefBanner) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
  });

  it("introduces report as a separate cross-jurisdiction lane between the brief section and portfolio focus", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const briefSection = screen
      .getByRole("heading", { name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 빠르게 정리합니다" })
      .closest("section");
    const reportSection = screen
      .getByRole("heading", { name: "교차 관할권 운영 판단은 Report 레인에서 따로 다룹니다" })
      .closest("section");
    const portfolioSection = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(reportSection).not.toBeNull();
    expect(
      within(reportSection as HTMLElement).getByText(
        /guide가 국가별 실행 맥락을 정리하고 brief가 주간 이슈를 빠르게 해설한다면, report는 여러 시장에 공통으로 반복되는 운영 질문을 한 문서로 구조화하는 레인입니다\./
      )
    ).toBeInTheDocument();
    expect(within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" })).toHaveAttribute(
      "href",
      "/reports"
    );
    expect(within(reportSection as HTMLElement).getAllByRole("link", { name: "Front Report 보기" }).at(0)).toHaveAttribute(
      "href",
      `/reports/${primaryGatewayReport?.slug}`
    );
    expect(
      within(reportSection as HTMLElement).getByRole("heading", { name: primaryGatewayReport?.title ?? "" })
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByText(
        /ChaTm · MexTm · EuTm에서 이미 잠근 route decision 질문을 교차 관할권 trust layer로 다시 묶습니다\. LatTm은 flagship baseline reference로 유지합니다\. JapTm은 supporting reference로만 이어 읽히게 둡니다\./
      )
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByText(
        /ChaTm은 growth lane의 mature baseline으로 잠겼고, MexTm은 Sprint 2로 filing·maintenance·enforcement handoff까지 운영 문법을 더 선명하게 만들었습니다\./
      )
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByRole("heading", { name: "ChaTm: local-fit pressure를 먼저 잠근다" })
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "ChaTm 판단표 보기" })
    ).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
    );
    expect(
      within(reportSection as HTMLElement).getAllByText(
        /현재 우선 레인 상태: ChaTm Mature · QA Full · gap 0 \/ MexTm Mature · QA Full · gap 0 \/ EuTm Beta · QA Standard · gap 0/
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(reportSection as HTMLElement).getByText(
        "현재 우선 레인 상태: ChaTm Mature · QA Full · gap 0 / MexTm Mature · QA Full · gap 0 / EuTm Beta · QA Standard · gap 0. 다음은 Front trust layer / Gateway trust layer입니다."
      )
    ).toBeInTheDocument();
    expect(
      (briefSection as HTMLElement).compareDocumentPosition(reportSection as HTMLElement)
      & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
    expect(
      (reportSection as HTMLElement).compareDocumentPosition(portfolioSection as HTMLElement)
      & Node.DOCUMENT_POSITION_FOLLOWING
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
    expect(
      within(currentPilotScope as HTMLElement).getByText("mature 승격 반영 · Sprint 2 저밀도 9장 보강 · reader/search QA 정렬 완료")
    ).toBeInTheDocument();
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
        lifecycle_status: "mature",
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

    const portfolioSection = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    clickTrackedLink(within(portfolioSection as HTMLElement).getByRole("link", { name: "ChaTm 보기" }));
    clickTrackedLink(screen.getByRole("link", { name: "ywkinfo.github.io" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "guide_cta_click",
      expect.objectContaining({
        product_slug: "china",
        portfolio_tier: "growth",
        lifecycle_status: "mature",
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

  it("tracks report archive and latest report opens from the gateway", () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree("/");
    const reportSection = screen
      .getByRole("heading", { name: "교차 관할권 운영 판단은 Report 레인에서 따로 다룹니다" })
      .closest("section");

    clickTrackedLink(within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" }));
    const reportPrimaryLink = within(reportSection as HTMLElement).getAllByRole("link", { name: "Front Report 보기" }).at(0);
    expect(reportPrimaryLink).toBeDefined();
    clickTrackedLink(reportPrimaryLink as HTMLElement);

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_archive_open",
      expect.objectContaining({
        surface: "gateway_section"
      })
    );
    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_open",
      expect.objectContaining({
        report_slug: primaryGatewayReport?.slug,
        surface: "gateway_section"
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
        /이번 브리프의 목적은 어느 경로가 원칙적으로 더 좋다고 말하는 데 있지 않습니다\./
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/route memo부터 작성하게 하는 데 있습니다\./)).toBeInTheDocument();

    const guideLink = screen.getByRole("link", { name: "ChaTm route decision matrix" });

    expect(guideLink).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
    );
    clickTrackedLink(guideLink);

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "brief_guide_click",
      expect.objectContaining({
        issue_slug: briefIssues[0]?.slug,
        item_id: "global-route-decision-questions",
        target_path: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
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
    expect(within(archiveSection as HTMLElement).getAllByRole("link", { name: "Front Report 보기" }).at(0)).toHaveAttribute(
      "href",
      `/reports/${reports[0]?.slug}`
    );
    expect(screen.getAllByRole("link", { name: "Front Report 보기" }).at(0)).toHaveAttribute(
      "href",
      `/reports/${primaryGatewayReport?.slug}`
    );
    expect(
      screen.getByText(
        /ChaTm · MexTm · EuTm에서 이미 잠근 route decision 질문을 교차 관할권 trust layer로 다시 묶습니다\. ChaTm -> MexTm -> EuTm 다음 레인에서 buyer-facing 설명과 scorecard truth를 같은 문법으로 연결합니다\. LatTm은 flagship baseline reference로 유지합니다\. JapTm은 supporting reference로만 이어 읽히게 둡니다\. 현재 우선 레인 상태는 ChaTm Mature · QA Full · gap 0 \/ MexTm Mature · QA Full · gap 0 \/ EuTm Beta · QA Standard · gap 0입니다\./
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /ChaTm은 growth lane의 mature baseline으로 잠겼고, MexTm은 Sprint 2로 filing·maintenance·enforcement handoff까지 운영 문법을 더 선명하게 만들었습니다\./
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /대상: 다국가 launch sequencing과 filing route를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀/
      )
    ).toBeInTheDocument();
  });

  it("renders report detail pages with trust-layer handoff cards and related guide links", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${primaryGatewayReport?.slug}`);

    await screen.findByRole("heading", { name: primaryGatewayReport?.title ?? "" });

    expect(screen.getByRole("heading", { name: "왜 지금 이 리포트를 먼저 읽는가" })).toBeInTheDocument();
    expect(
      screen.getByText(
        /대상: 다국가 launch sequencing과 filing route를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /ChaTm은 growth lane의 mature baseline으로 잠겼고, MexTm은 Sprint 2로 filing·maintenance·enforcement handoff까지 운영 문법을 더 선명하게 만들었습니다\./
      )
    ).toBeInTheDocument();
    expect(screen.getByText("어느 시장에서 local-fit pressure가 더 강한지 먼저 적는다.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Priority Guide Handoff" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "MexTm: bundle보다 execution control을 본다" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EuTm lock board 보기" })).toHaveAttribute(
      "href",
      "/europe/chapter/제5장-출원-경로와-서류-설계#route-pack-lock-board"
    );
    expect(screen.getByText(/직접출원과 마드리드 비교에서 먼저 잠가야 하는 것은 local-fit pressure, central-management confidence, owner split, switch trigger입니다\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LatTm route decision box" })).toHaveAttribute(
      "href",
      "/latam/chapter/제04장-filing-전략-출원-경로-선택-직접출원-vs-마드리드#4-decision-box-출원-경로-선택"
    );
    expect(screen.getByRole("link", { name: "ChaTm route decision matrix" })).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
    );
  });

  it("renders supporting report detail with evidence-specific trust summary and EuTm handoff", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${supportingGatewayReport?.slug}`);

    await screen.findByRole("heading", { name: supportingGatewayReport?.title ?? "" });

    expect(
      screen.getByText(/ChaTm · MexTm · EuTm에서 이미 잠근 evidence owner와 evidence vault 구조를 교차 관할권 trust layer로 다시 묶습니다\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Supporting trust layer \/ Gateway trust layer입니다\./)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EuTm: validate evidence handoff를 고정한다" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EuTm evidence triage 보기" })).toHaveAttribute(
      "href",
      "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage"
    );
    expect(screen.getByRole("link", { name: "EuTm evidence triage" })).toHaveAttribute(
      "href",
      "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage"
    );
  });

  it("tracks trust-layer handoff clicks from the gateway and report detail", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    const gatewayRender = renderAppRouteTree("/");

    clickTrackedLink(screen.getByRole("link", { name: "ChaTm 판단표 보기" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_handoff_click",
      expect.objectContaining({
        report_slug: primaryGatewayReport?.slug,
        guide_slug: "china",
        surface: "gateway_section",
        target_path: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
      })
    );

    gatewayRender.unmount();

    renderAppRouteTree(`/reports/${primaryGatewayReport?.slug}`);

    await screen.findByRole("heading", { name: primaryGatewayReport?.title ?? "" });

    clickTrackedLink(screen.getByRole("link", { name: "EuTm lock board 보기" }));
    clickTrackedLink(screen.getByRole("link", { name: "LatTm route decision box" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_guide_click",
      expect.objectContaining({
        report_slug: primaryGatewayReport?.slug,
        guide_slug: "europe",
        surface: "report_detail_focus",
        target_path: "/europe/chapter/제5장-출원-경로와-서류-설계#route-pack-lock-board"
      })
    );
    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_guide_click",
      expect.objectContaining({
        report_slug: primaryGatewayReport?.slug,
        surface: "report_detail_related",
        target_path: "/latam/chapter/제04장-filing-전략-출원-경로-선택-직접출원-vs-마드리드#4-decision-box-출원-경로-선택"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
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
