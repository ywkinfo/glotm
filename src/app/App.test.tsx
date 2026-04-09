import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "./App";
import * as ga from "../analytics/ga";
import { briefIssues } from "../briefs/archive";
import {
  buildReportOpenLabel,
  getLatestReport,
  getLatestReports,
  getReportBySlug,
  getReportsForGuideSlug,
  reportExperienceMeta,
  reports
} from "../reports/registry";
import { products } from "../products/registry";
import {
  isBaselineLaneProduct,
  isPriorityLaneProduct,
  type DocumentData
} from "../products/shared";

const operatorProfileUrl = "https://ywkinfo.github.io";
const latestReport = getLatestReport();
const routeDecisionReport = getReportBySlug("global-filing-route-framework");
const evidenceReport = getReportBySlug("global-use-evidence-system");
const primaryChinaGuideHandoffReport = getReportsForGuideSlug("china")[0]?.report;
const latestGatewayReports = getLatestReports(2);
const orderedProducts = [...products].sort(
  (left, right) => (left.gatewayOrder ?? Number.MAX_SAFE_INTEGER) - (right.gatewayOrder ?? Number.MAX_SAFE_INTEGER)
);
const priorityLaneLabelSequence = orderedProducts
  .filter(isPriorityLaneProduct)
  .map((product) => product.shortLabel)
  .join(" -> ");
const baselineGuide = orderedProducts.find(isBaselineLaneProduct);

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
  "global-filing-priority-framework": {
    meta: {
      title: "글로벌 상표 출원 우선순위 결정 프레임워크",
      builtAt: "2026-04-09T09:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: "global-filing-priority-framework",
        slug: "global-filing-priority-framework",
        title: "글로벌 상표 출원 우선순위 결정 프레임워크",
        summary:
          "매출 순서보다 출시 순서, 어떤 표장을 먼저 챙길지, 파트너 리스크, 권리 공백 비용을 기준으로 어느 국가에 먼저 출원할지 정리한 리포트입니다.",
        html: [
          "<p>출원 우선순위는 예산표가 아니라 launch sequencing memo에 가깝고, 국가 우선순위와 표장 우선순위를 같은 표에서 잠그는 편이 실수가 적습니다.</p>",
          '<h3 id="시장-크기보다-먼저-잠가야-하는-하드-트리거">시장 크기보다 먼저 잠가야 하는 하드 트리거</h3>',
          "<p>출시 직전 채널 노출, 파트너 계약, 현지 문자 표기, 위조 리스크가 붙는 국가는 점수 계산 전에 먼저 올려 보는 편이 실무적입니다.</p>"
        ].join(""),
        headings: [
          {
            id: "시장-크기보다-먼저-잠가야-하는-하드-트리거",
            depth: 3,
            title: "시장 크기보다 먼저 잠가야 하는 하드 트리거",
            children: []
          }
        ]
      }
    ]
  } satisfies DocumentData,
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
        summary: "직접출원과 마드리드를 비교할 때 먼저 봐야 할 판단 기준을 다시 정리한 리포트입니다.",
        html: [
          "<p>직접출원과 마드리드 비교에서 먼저 정리해야 하는 것은 현지 맞춤 필요성, 중앙 관리 적합성, 권리자 구분, 경로 재검토 기준입니다.</p>",
          '<h3 id="출원-경로-판단-메모-템플릿">출원 경로 판단 메모 템플릿</h3>',
          "<p>메모는 길 필요가 없고, 우선 시장과 출원 준비 책임자가 보이면 충분합니다.</p>"
        ].join(""),
        headings: [
          {
            id: "출원-경로-판단-메모-템플릿",
            depth: 3,
            title: "출원 경로 판단 메모 템플릿",
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
  } satisfies DocumentData,
  "brand-localization-vs-standardization-framework": {
    meta: {
      title: "브랜드 표장 현지화 vs. 표준화: 글로벌 상표 운영 결정 프레임워크",
      builtAt: "2026-04-07T00:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: "brand-localization-vs-standardization-framework",
        slug: "brand-localization-vs-standardization-framework",
        title: "브랜드 표장 현지화 vs. 표준화: 글로벌 상표 운영 결정 프레임워크",
        summary:
          "글로벌 표장과 현지 문자 표장을 어떻게 나눠 설계할지, 어떤 시장에서 현지 표장이 실제 운영 자산이 되는지를 정리한 리포트입니다.",
        html: [
          "<p>글로벌 표장은 브랜드 일관성과 본사 통제를 담당하고, 현지 표장은 검색·호명·유통이 현지 문자에 기대는 시장에서 별도 운영 자산으로 관리해야 합니다.</p>",
          '<h3 id="포트폴리오-설계-네-가지-옵션">포트폴리오 설계: 네 가지 옵션</h3>',
          "<p>대부분의 기업에는 글로벌 표장과 현지 음역을 함께 보는 옵션 B가 기본값에 가깝습니다.</p>"
        ].join(""),
        headings: [
          {
            id: "포트폴리오-설계-네-가지-옵션",
            depth: 3,
            title: "포트폴리오 설계: 네 가지 옵션",
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
      name: "인하우스 팀을 위한 cross-border trademark operating guide"
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
      name: "인하우스 팀을 위한 cross-border trademark operating guide"
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
    ["/china", "Growth tier · Mature lifecycle · Full QA · 국가 가이드"],
    ["/mexico", "Growth tier · Mature lifecycle · Full QA · 국가 가이드"],
    ["/europe", "Validate tier · Beta lifecycle · Standard QA · 권역 가이드"],
    ["/usa", "Incubate tier · Beta lifecycle · Standard QA · 국가 가이드"],
    ["/japan", "Incubate tier · Beta lifecycle · Standard QA · 국가 가이드"],
    ["/uk", "Incubate tier · Pilot lifecycle · Smoke QA · 국가 가이드"]
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

    await screen.findByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guide" });

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
    expect(within(gatewayHero as HTMLElement).getByRole("link", { name: "리포트 보기" })).toHaveAttribute(
      "href",
      `/reports/${latestReport?.slug}`
    );
  });

  it.each([
    {
      path: "/china",
      title: "중국 상표 실무 운영 가이드",
      summary: "중국이 첫 출시국인지, 중국어 표기를 언제 잠글지, direct/Madrid 판단이 언제 갈리는지 readiness 보드에서 먼저 정리합니다.",
      expectedReportSlugs: [
        "global-filing-priority-framework",
        "brand-localization-vs-standardization-framework"
      ]
    },
    {
      path: "/mexico",
      title: "멕시코 상표 실무 운영 가이드북",
      summary: "멕시코의 실행 흐름과 혼합 경로 기준으로, 현지 실행 통제가 묶음 효율보다 먼저인지 정리합니다.",
      expectedReportSlugs: [
        "global-filing-route-framework",
        "global-use-evidence-system"
      ]
    },
    {
      path: "/europe",
      title: "EuTm 유럽 상표 운영 가이드북",
      summary: "권역형 가이드답게 누가 출원 기준을 정하고, 출원 뒤 증거 관리까지 어떻게 이어지는지 먼저 확인합니다.",
      expectedReportSlugs: [
        "global-filing-route-framework",
        "global-use-evidence-system"
      ]
    }
  ])(
    "shows report handoff cards on priority guide home $path",
    async ({ path, title, summary, expectedReportSlugs }) => {
      installFetchMock();

      renderAppRouteTree(path);

      await screen.findByRole("heading", { name: title });

      const handoffSection = screen.getByRole("region", { name: "관련 Report / Trust Layer" });
      const reportLinks = within(handoffSection).getAllByRole("link", { name: "리포트 보기" });
      const expectedGuideSlug = path.replace(/^\//, "");

      expect(reportLinks.at(0)).toHaveAttribute("href", `/reports/${expectedReportSlugs[0]}?fromGuide=${expectedGuideSlug}`);
      expect(reportLinks.at(1)).toHaveAttribute("href", `/reports/${expectedReportSlugs[1]}?fromGuide=${expectedGuideSlug}`);
      expect(within(handoffSection).getByText(summary)).toBeInTheDocument();
    }
  );

  it("tracks report opens from the priority guide home handoff cards", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree("/china");

    await screen.findByRole("heading", { name: "중국 상표 실무 운영 가이드" });

    const handoffSection = screen.getByRole("region", { name: "관련 Report / Trust Layer" });
    const reportLink = within(handoffSection).getAllByRole("link", { name: "리포트 보기" }).at(0);

    clickTrackedLink(reportLink as HTMLElement);

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_open",
      expect.objectContaining({
        report_slug: primaryChinaGuideHandoffReport?.slug,
        guide_slug: "china",
        surface: "guide_home_handoff"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  it("renders the refreshed gateway intro as one lead and two summary paragraphs", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(gatewayHero).not.toBeNull();
    expect(
      within(gatewayHero as HTMLElement).getByText(
        "여러 국가·권역의 시장 우선순위, 출원 경로, 브랜드 포트폴리오 관리, 침해 대응, 집행 판단에 필요한 정보를 한곳에 모아 제공합니다."
      )
    ).toBeInTheDocument();
    const summaryParagraphs = [...(gatewayHero as HTMLElement).querySelectorAll(".gateway-summary")].map(
      (paragraph) => paragraph.textContent?.trim()
    );
    expect(summaryParagraphs).toHaveLength(2);
    expect(summaryParagraphs[0]).toBe(
      "검색 결과를 그대로 믿기 전에, 내부 판단에 필요한 운영 질문을 빠르게 구조화하고 비교할 수 있습니다."
    );
    expect(summaryParagraphs[1]).toBe(
      "제공 정보는 참고용이며, 최신성 및 정확성은 각국 법령과 실무 변화에 따라 달라질 수 있으므로 현지 대리인 확인 후 활용하시기 바랍니다."
    );
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
    expect(within(copyStack as HTMLElement).getByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guide" })).toBeInTheDocument();
    expect(within(copyStack as HTMLElement).getByText("여러 국가·권역의 시장 우선순위, 출원 경로, 브랜드 포트폴리오 관리, 침해 대응, 집행 판단에 필요한 정보를 한곳에 모아 제공합니다.")).toBeInTheDocument();
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
      screen.getByText(
        `현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${latestReport?.gatewayBridgeLabel}입니다. guide 3개를 잠근 뒤, 최신 리포트와 Gateway handoff를 같은 순서로 이어 보는 단계입니다. 큰 그림이 필요할 때는 ${baselineGuide?.shortLabel}을 기준 프레임으로 함께 보면 좋습니다.`
      )
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

  it("brings the latest reports above the latest brief banner on the gateway", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const latestReportsSection = screen
      .getByRole("heading", { name: "Gateway 첫 화면에서는 최신 리포트 2개를 먼저 보여줍니다" })
      .closest("section");
    const briefBanner = screen.getByRole("region", { name: "최신 브리프 배너" });

    expect(latestReportsSection).not.toBeNull();
    expect(
      within(latestReportsSection as HTMLElement).getAllByRole("heading", { name: latestGatewayReports[0]?.title ?? "" }).length
    ).toBeGreaterThan(0);
    expect(
      within(latestReportsSection as HTMLElement).getAllByRole("heading", { name: latestGatewayReports[1]?.title ?? "" }).length
    ).toBeGreaterThan(0);
    expect(
      within(latestReportsSection as HTMLElement).queryByRole("heading", { name: reports[2]?.title ?? "" })
    ).toBeNull();
    expect(
      within(latestReportsSection as HTMLElement).queryByRole("link", { name: "리포트 바로 보기" })
    ).toBeNull();
    const reportLinks = within(latestReportsSection as HTMLElement).getAllByRole("link", { name: "리포트 보기" });
    expect(reportLinks.at(0)).toHaveAttribute("href", `/reports/${latestGatewayReports[0]?.slug}`);
    expect(reportLinks.at(1)).toHaveAttribute("href", `/reports/${latestGatewayReports[1]?.slug}`);
    expect(reportLinks).toHaveLength(2);
    expect(
      within(latestReportsSection as HTMLElement).getByText(reportExperienceMeta.gatewaySectionSummary)
    ).toBeInTheDocument();
    expect(
      within(latestReportsSection as HTMLElement).queryByText("Front")
    ).toBeNull();
    expect(
      within(latestReportsSection as HTMLElement).queryByText(
        "Supporting"
      )
    ).toBeNull();
    expect(
      within(latestReportsSection as HTMLElement).queryByText(
        "Archive"
      )
    ).toBeNull();
    expect(
      within(latestReportsSection as HTMLElement).queryByText(
        /현재 두 개의 리포트가 준비되어 있습니다\. 첫 번째 리포트는 출원 경로 결정을 위한 프레임워크로, 직접출원 vs 마드리드 출원에 대한 내용을 다룹니다\. 이 리포트는 ChaTm · MexTm · EuTm 등에서 이미 정리한 출원 경로 판단 질문을 여러 나라에서 함께 볼 수 있는 공통 판단 기준으로 다시 정리해 보여줍니다\./
      )
    ).toBeNull();
    expect(
      (latestReportsSection as HTMLElement).compareDocumentPosition(briefBanner) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
  });

  it("introduces report as a separate cross-jurisdiction lane between the brief section and portfolio focus", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const briefSection = screen
      .getByRole("heading", { name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 빠르게 정리합니다" })
      .closest("section");
    const reportSection = screen
      .getByRole("heading", { name: "여러 나라 공통 판단은 Report에서 따로 다룹니다" })
      .closest("section");
    const portfolioSection = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(reportSection).not.toBeNull();
    expect(
      within(reportSection as HTMLElement).queryByText(
        /guide가 국가별 실행 맥락을 정리하고 brief가 주간 이슈를 빠르게 해설한다면, report는 여러 시장에 공통으로 반복되는 운영 질문을 한 문서로 묶어 보는 영역입니다\./
      )
    ).toBeNull();
    expect(within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" })).toHaveAttribute(
      "href",
      "/reports"
    );
    expect(within(reportSection as HTMLElement).getAllByRole("link", { name: "리포트 보기" }).at(0)).toHaveAttribute(
      "href",
      `/reports/${latestReport?.slug}`
    );
    expect(
      within(reportSection as HTMLElement).getByRole("heading", { name: latestReport?.title ?? "" })
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).queryByText(
        /ChaTm에서 이미 다룬 출원 우선순위와 표장 우선순위 질문을 이 리포트에서 한 번에 다시 정리했습니다\. LatTm은 전체 기준을 잡을 때 참고하면 좋습니다\. JapTm · UsaTm은 필요할 때 이어서 보면 됩니다\./
      )
    ).toBeNull();
    expect(
      within(reportSection as HTMLElement).queryByRole("heading", { name: "ChaTm: 중국어 표기 포트폴리오부터 잠근다" })
    ).toBeNull();
    expect(
      within(reportSection as HTMLElement).getByRole("heading", { name: "ChaTm: 중국 launch sequencing부터 적는다" })
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "ChaTm sequencing 보기" })
    ).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#launch-market-우선순위를-먼저-적는다"
    );
    expect(
      within(reportSection as HTMLElement).queryByText(latestReport?.whyNow ?? "")
    ).toBeNull();
    expect(
      within(reportSection as HTMLElement).queryByText(
        /출원 경로, 권리자 구분, 혼합 경로 같은 질문처럼 한 국가만 봐서는 답이 약해지는 주제는 report에서 먼저 큰 구조를 잡고, 필요할 때 각 guide의 실행 맥락으로 이어서 보는 편이 가장 자연스럽습니다\./
      )
    ).toBeNull();
    expect(
      within(reportSection as HTMLElement).queryByText(
        /그래서 여기서 나온 실행 질문을 Gateway와 Report에서 같은 기준으로 읽히게 하는 것이 지금의 다음 단계입니다\./
      )
    ).toBeNull();
    expect(
      within(reportSection as HTMLElement).getAllByText(
        /현재 우선 레인 상태: ChaTm Mature · QA Full · gap 0 \/ MexTm Mature · QA Full · gap 0 \/ EuTm Beta · QA Standard · gap 0/
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(reportSection as HTMLElement).getByText(
        `현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${latestReport?.gatewayBridgeLabel}입니다. guide 3개를 잠근 뒤, 최신 리포트와 Gateway handoff를 같은 순서로 이어 보는 단계입니다.`
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
      .getByRole("heading", { name: "여러 나라 공통 판단은 Report에서 따로 다룹니다" })
      .closest("section");

    clickTrackedLink(within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" }));
    const reportPrimaryLink = within(reportSection as HTMLElement).getAllByRole("link", { name: "리포트 보기" }).at(0);
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
        report_slug: latestReport?.slug,
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

    await screen.findByRole("heading", { name: "인하우스 팀을 위한 cross-border trademark operating guide" });
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

    await screen.findByRole("heading", { name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 리포트" });

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
    const firstBriefItem = briefIssues[0]?.items[0];
    const firstGuideLink = firstBriefItem?.relatedGuideLinks[0];

    renderAppRouteTree(`/briefs/${briefIssues[0]?.slug}`);

    await screen.findByRole("heading", { name: briefIssues[0]?.title ?? "" });

    expect(
      screen.getByText(briefIssues[0]?.summary ?? "")
    ).toBeInTheDocument();
    expect(
      screen.getByText(firstBriefItem?.whatChanged ?? "")
    ).toBeInTheDocument();

    const guideLink = screen.getByRole("link", { name: firstGuideLink?.label ?? "" });

    expect(guideLink).toHaveAttribute(
      "href",
      firstGuideLink?.href
    );
    clickTrackedLink(guideLink);

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "brief_guide_click",
      expect.objectContaining({
        issue_slug: briefIssues[0]?.slug,
        item_id: firstBriefItem?.id,
        target_path: firstGuideLink?.href
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  it("renders report archive cards and links to the latest report", async () => {
    installFetchMock();

    renderAppRouteTree("/reports");

    await screen.findByRole("heading", { name: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 리포트" });

    const archiveSection = screen
      .getByRole("heading", { name: "최신 리포트를 먼저 보여줍니다" })
      .closest("section");

    expect(archiveSection).not.toBeNull();
    expect(within(archiveSection as HTMLElement).getByRole("heading", { name: reports[0]?.title ?? "" })).toBeInTheDocument();
    expect(
      within(archiveSection as HTMLElement).getAllByRole("link", { name: buildReportOpenLabel(reports[0]!) }).at(0)
    ).toHaveAttribute(
      "href",
      `/reports/${reports[0]?.slug}`
    );
    expect(screen.getAllByRole("link", { name: "리포트 보기" }).at(0)).toHaveAttribute(
      "href",
      `/reports/${latestReport?.slug}`
    );
    expect(
      screen.getByText(/ChaTm에서 이미 다룬 출원 우선순위와 표장 우선순위 질문을 이 리포트에서 한 번에 다시 정리했습니다\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${latestReport?.gatewayBridgeLabel}입니다. guide 3개를 잠근 뒤, 최신 리포트와 Gateway handoff를 같은 순서로 이어 보는 단계입니다.`
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        new RegExp(
          `ChaTm에서 이미 다룬 출원 우선순위와 표장 우선순위 질문을 이 리포트에서 한 번에 다시 정리했습니다\\. 현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${latestReport?.gatewayBridgeLabel?.replace("/", "\\/")}입니다\\.`
        )
      )
    ).toBeNull();
    expect(
      screen.getByText(/매출 순서보다 출시 순서, 어떤 표장을 먼저 챙길지, 파트너 리스크, 권리 공백 비용을 기준으로 어느 국가에 먼저 출원할지 정리한 리포트입니다\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/대상: 여러 나라 진입 순서와 출원 우선순위를 먼저 정해야 하는 브랜드 관리자, 인하우스 IP 팀, 글로벌 사업 리드/)
    ).toBeInTheDocument();
  });

  it("renders report detail pages with trust-layer handoff cards and related guide links", async () => {
    installFetchMock();

    const reportRender = renderAppRouteTree(`/reports/${routeDecisionReport?.slug}`);

    await screen.findByRole("heading", { name: routeDecisionReport?.title ?? "" });

    expect(screen.getByRole("heading", { name: "왜 지금 이 리포트를 먼저 읽는가" })).toBeInTheDocument();
    expect(
      screen.getByText(/대상: 여러 나라의 출원 경로를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/여러 나라에 동시에 출원할 때 먼저 필요한 판단 기준을 한 문서에 모았습니다\./)
    ).toBeInTheDocument();
    expect(screen.getByText("어느 시장에서 현지 맞춤이 더 많이 필요한지 먼저 적는다.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "가이드로 이어 보기" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ChaTm: 현지 맞춤 필요성을 먼저 본다" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ChaTm 판단표 보기" })).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
    );
    expect(
      screen.getByText(/ChaTm, MexTm, EuTm에서 이미 다룬 출원 경로 판단을 한 번에 다시 정리해, 여러 나라를 비교할 때 바로 참고할 수 있게 만든 리포트입니다\./)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LatTm route decision box" })).toHaveAttribute(
      "href",
      "/latam/chapter/제04장-filing-전략-출원-경로-선택-직접출원-vs-마드리드#4-decision-box-출원-경로-선택"
    );
    expect(screen.getByRole("link", { name: "ChaTm route decision matrix" })).toHaveAttribute(
      "href",
      "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
    );
  });

  it("restores the matching guide return CTA when a report opens from a guide handoff", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${routeDecisionReport?.slug}?fromGuide=mexico`);

    await screen.findByRole("heading", { name: routeDecisionReport?.title ?? "" });

    expect(
      screen.getByText("MexTm 홈의 trust layer handoff에서 넘어왔다면, 아래 CTA로 방금 보던 guide deep link로 바로 돌아갈 수 있습니다.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MexTm로 돌아가기" })).toHaveAttribute(
      "href",
      "/mexico/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교#buyer-entry-경로-선택표"
    );
    expect(screen.getAllByRole("heading", { name: "MexTm: 일괄 출원보다 현지 실행 통제를 먼저 본다" }).at(0)).toBeInTheDocument();
  });

  it("renders evidence report detail with evidence-specific trust summary and EuTm handoff", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${evidenceReport?.slug}`);

    await screen.findByRole("heading", { name: evidenceReport?.title ?? "" });

    expect(
      screen.getByText(
        new RegExp(
          `ChaTm · MexTm · EuTm에서 이미 다룬 사용 증거 운영 구조를 이 리포트에서 한 번에 다시 정리했습니다\\. 현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${evidenceReport?.gatewayBridgeLabel?.replace("/", "\\/")}입니다\\. ${baselineGuide?.shortLabel}은 전체 기준을 잡을 때 참고하면 좋습니다\\.`
        )
      )
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

  it("restores a deep-link return CTA for evidence reports opened from a MexTm handoff", async () => {
    installFetchMock();

    renderAppRouteTree(`/reports/${evidenceReport?.slug}?fromGuide=mexico`);

    await screen.findByRole("heading", { name: evidenceReport?.title ?? "" });

    expect(screen.getByRole("link", { name: "MexTm로 돌아가기" })).toHaveAttribute(
      "href",
      "/mexico/chapter/제7장-등록-후-의무-사용-선언갱신권리-유지-캘린더#declarationrenewal-handoff-memo"
    );
    expect(screen.getAllByRole("heading", { name: "MexTm: 사용·갱신 owner를 함께 본다" }).at(0)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MexTm 운영 가이드 보기" })).toHaveAttribute(
      "href",
      "/mexico/chapter/제7장-등록-후-의무-사용-선언갱신권리-유지-캘린더#declarationrenewal-handoff-memo"
    );
  });

  it("tracks trust-layer handoff clicks from the gateway and report detail", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    const gatewayRender = renderAppRouteTree("/");

    clickTrackedLink(screen.getByRole("link", { name: "ChaTm sequencing 보기" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_handoff_click",
      expect.objectContaining({
        report_slug: latestReport?.slug,
        guide_slug: "china",
        surface: "gateway_section",
        target_path: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#launch-market-우선순위를-먼저-적는다"
      })
    );

    gatewayRender.unmount();

    const reportRender = renderAppRouteTree(`/reports/${routeDecisionReport?.slug}`);

    await screen.findByRole("heading", { name: routeDecisionReport?.title ?? "" });

    clickTrackedLink(screen.getByRole("link", { name: "ChaTm 판단표 보기" }));
    clickTrackedLink(screen.getByRole("link", { name: "LatTm route decision box" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_guide_click",
      expect.objectContaining({
        report_slug: routeDecisionReport?.slug,
        guide_slug: "china",
        surface: "report_detail_focus",
        target_path: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#출원-경로-시나리오별-판단표"
      })
    );
    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_guide_click",
      expect.objectContaining({
        report_slug: routeDecisionReport?.slug,
        surface: "report_detail_related",
        target_path: "/latam/chapter/제04장-filing-전략-출원-경로-선택-직접출원-vs-마드리드#4-decision-box-출원-경로-선택"
      })
    );

    reportRender.unmount();

    renderAppRouteTree(`/reports/${routeDecisionReport?.slug}?fromGuide=mexico`);

    await screen.findByRole("heading", { name: routeDecisionReport?.title ?? "" });

    clickTrackedLink(screen.getByRole("link", { name: "MexTm로 돌아가기" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_guide_click",
      expect.objectContaining({
        report_slug: routeDecisionReport?.slug,
        guide_slug: "mexico",
        surface: "report_detail_return",
        target_path: "/mexico/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교#buyer-entry-경로-선택표"
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
