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
import { liveShellProducts, products } from "../products/registry";
import { gatewayHeroSupportingParagraphs } from "../content/gateway";
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
const orderedLiveGuidePaths = [...liveShellProducts]
  .sort(
    (left, right) =>
      (left.gatewayOrder ?? Number.MAX_SAFE_INTEGER) - (right.gatewayOrder ?? Number.MAX_SAFE_INTEGER)
  )
  .map((product) => `/${product.slug}`);

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
  "hangul-mark-global-protection-framework": {
    meta: {
      title: "한글 표장 글로벌 보호 운영 프레임워크",
      builtAt: "2026-04-15T09:00:00.000Z",
      chapterCount: 1
    },
    chapters: [
      {
        id: "hangul-mark-global-protection-framework",
        slug: "hangul-mark-global-protection-framework",
        title: "한글 표장 글로벌 보호 운영 프레임워크",
        summary:
          "한글을 원표장으로 가진 기업이 한글·로마자·로고 버전을 어떤 순서로 확정하고, 해외 채널에서 무엇을 먼저 보호 자산으로 봐야 하는지 정리한 리포트.",
        html: [
          "<p>한글 표장은 국내에서는 하나의 이름처럼 보이지만, 해외에서는 한글 원표장, 로마자 표기, 로고 또는 결합표장으로 갈라져 움직입니다.</p>",
          '<h3 id="한글-로마자로고-3버전-관리-기준">한글·로마자·로고 3버전 관리 기준</h3>',
          "<p>로마자 표기는 영문으로 적으면 되는 부수 정보가 아니라, 출원형과 사용형을 함께 확정해 두는 공식 입력값으로 보는 편이 맞습니다.</p>"
        ].join(""),
        headings: [
          {
            id: "한글-로마자로고-3버전-관리-기준",
            depth: 3,
            title: "한글·로마자·로고 3버전 관리 기준",
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

// 게이트웨이 구성 계약은 `health:release`(prerender 미러)로 증명되지 않는다. 렌더된 DOM에서
// 두 섹션의 상대 순서를 직접 확인하는 것이 유일한 증명이라 문서 위치를 비교한다.
function expectPrecedes(first: Element, second: Element) {
  expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

  // 의도적으로 갱신한 단정이다. 이전 계약은 약칭 배열(`ChaTm`, `MexTm`, …)이었는데,
  // 이용자는 `중국`을 찾지 `ChaTm`을 찾지 않는다. 보존할 계약은 목적지·순서·활성 상태·
  // 키보드 접근성이고, 표기 자체는 이번 라운드의 변경 대상이다.
  it("orders live guides by jurisdiction name in the current active lane sequence", async () => {
    installFetchMock();

    renderAppRouteTree("/");

    await screen.findByRole("heading", {
      name: "인하우스 팀을 위한 cross-border trademark operating guide"
    });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const navLabels = [...nav.querySelectorAll(".global-nav-label")].map((label) =>
      label.textContent?.trim()
    );

    expect(navLabels).toEqual([
      "Gateway",
      "Brief",
      "Report",
      "중국",
      "멕시코",
      "유럽",
      "중남미",
      "일본",
      "영국",
      "미국"
    ]);

    // 순서는 registry의 gatewayOrder에서 파생되어야 한다 — 표기와 목적지가 따로 놀지 않게.
    const guideHrefs = [...nav.querySelectorAll("a")]
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => orderedLiveGuidePaths.includes(href ?? ""));

    expect(guideHrefs).toEqual(orderedLiveGuidePaths);

    // 약칭은 데스크톱 보조 표기로만 남는다(≤920px에서는 CSS로 숨긴다).
    const shortLabels = [...nav.querySelectorAll(".global-nav-shortlabel")].map((label) =>
      label.textContent?.trim()
    );

    expect(shortLabels).toEqual(["ChaTm", "MexTm", "EuTm", "LatTm", "JapTm", "UKTm", "UsaTm"]);

    // 라이프사이클 pill은 운영 지표라 내비에서 제거했다. 헤더 높이를 늘리고, 그 높이가
    // 그대로 앵커 clearance를 키운다.
    expect(nav.querySelectorAll(".status-pill")).toHaveLength(0);
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
    ["/europe", "Growth tier · Mature lifecycle · Full QA · 권역 가이드"],
    ["/usa", "Growth tier · Mature lifecycle · Full QA · 국가 가이드"],
    ["/japan", "Growth tier · Mature lifecycle · Full QA · 국가 가이드"],
    ["/uk", "Growth tier · Mature lifecycle · Full QA · 국가 가이드"]
  ])("derives reader home status copy from registry truth for %s", async (pathname, statusLabel) => {
    installFetchMock();

    renderAppRouteTree(pathname);

    await screen.findByText(statusLabel);

    expect(screen.getByText(statusLabel)).toBeInTheDocument();
  });

  // 의도적으로 다시 쓴 테스트다. 이전 계약은 "scrollIntoView가 호출된다"였는데, 그 API는
  // 대상의 조상 스크롤 컨테이너를 문서 스크롤포트까지 거슬러 올라가며 스크롤한다. 지켜야 할
  // 계약은 "활성 칩이 내비 안에서 가운데로 온다"이지 "문서를 스크롤한다"가 아니다.
  it("centers the active product chip inside the nav without scrolling the document", async () => {
    installFetchMock();

    const scrollIntoView = vi.fn();

    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: scrollIntoView
    });

    // jsdom에는 레이아웃이 없어 가로 스크롤 상황을 직접 만들어 준다.
    const clientWidthSpy = vi
      .spyOn(Element.prototype, "clientWidth", "get")
      .mockReturnValue(600);
    const scrollWidthSpy = vi
      .spyOn(Element.prototype, "scrollWidth", "get")
      .mockReturnValue(1200);
    const rectSpy = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(function mockRect(this: Element) {
        if (this.classList.contains("global-nav")) {
          return { left: 0, width: 600 } as DOMRect;
        }

        if (
          this.classList.contains("global-nav-link")
          && this.getAttribute("aria-current") === "page"
        ) {
          return { left: 900, width: 100 } as DOMRect;
        }

        return { left: 0, width: 0 } as DOMRect;
      });

    try {
      renderAppRouteTree("/europe");

      await screen.findByRole("heading", { name: "EuTm 유럽 상표 운영 가이드북" });

      const nav = screen.getByRole("navigation", { name: "제품 전환" });

      // 활성 칩(900..1000)을 폭 600 컨테이너 가운데로: 900 - 0 - (600 - 100) / 2 = 650
      await waitFor(() => {
        expect(nav.scrollLeft).toBe(650);
      });

      // 문서 스크롤을 건드리는 경로는 남아 있으면 안 된다.
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      rectSpy.mockRestore();
      scrollWidthSpy.mockRestore();
      clientWidthSpy.mockRestore();
    }
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

  // 히어로의 CTA 버튼 3개는 바로 아래 국가 진입 그리드와 같은 목적지를 중복해서 가리켰다.
  // 히어로를 제목 + 짧은 문단으로 줄이면서 그 역할은 진입 그리드로 넘겼다. 지켜야 할 계약
  // (전체 문서 href)은 이제 진입 그리드가 진다.
  it("renders full document hrefs for the gateway guide entry links", async () => {
    installFetchMock();
    renderAppRouteTree("/");

    const guideEntry = document.querySelector('[data-gateway-section="guide-entry"]');

    expect(guideEntry).not.toBeNull();
    expect(
      (guideEntry as HTMLElement).querySelector('[data-guide-entry-slug="china"]')
    ).toHaveAttribute("href", "/china");
    expect(
      (guideEntry as HTMLElement).querySelector('[data-guide-entry-slug="usa"]')
    ).toHaveAttribute("href", "/usa");

    // 히어로에는 같은 목적지를 반복하는 버튼이 남아 있으면 안 된다.
    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(within(gatewayHero as HTMLElement).queryByRole("link", { name: "ChaTm 보기" })).toBeNull();
  });

  it.each([
    {
      path: "/china",
      title: "중국 상표 실무 운영 가이드",
      summary: "중국은 상거소나 영업소가 없는 외국기업이 자격을 갖춘 상표대리기구에 위임해야 하므로, 넘기기 전 handoff 메모를 먼저 표준화합니다.",
      expectedReportSlugs: [
        "global-local-agent-selection-framework",
        "global-goods-services-class-framework"
      ]
    },
    {
      path: "/mexico",
      title: "멕시코 상표 실무 운영 가이드북",
      summary: "멕시코는 국내 통지 주소가 요건이고 대리는 별개 문제이므로, 위임장과 서명·제출 권한을 내부에서 먼저 정리합니다.",
      expectedReportSlugs: [
        "global-local-agent-selection-framework",
        "global-goods-services-class-framework",
        "hangul-mark-global-protection-framework"
      ]
    },
    {
      path: "/europe",
      title: "EuTm 유럽 상표 운영 가이드북",
      summary: "EU는 EEA 기준으로 대리 의무가 갈리고 출원 행위에는 예외가 있으므로, 대표자와 대리인 handoff 규칙을 먼저 확인합니다.",
      expectedReportSlugs: [
        "global-local-agent-selection-framework",
        "global-goods-services-class-framework",
        "global-filing-priority-framework"
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

  it("renders EuTm home copy for the growth lane", async () => {
    installFetchMock();

    renderAppRouteTree("/europe");

    await screen.findByRole("heading", { name: "EuTm 유럽 상표 운영 가이드북" });

    expect(
      screen.getByText(
        /유럽은 EU-wide, core-state, UK split을 같은 운영 표에서 잠그고 evidence triage까지 이어 읽기 위한 growth guide입니다\./
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /현재 EuTm은 claim-map과 핵심 장 보강을 바탕으로 rights·route·evidence handoff를 EU\+UK scope 안에서 정리한 growth guide입니다\./
      )
    ).toBeInTheDocument();
  });

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

  // 문구를 여기 다시 적지 않고 정본(`src/content/gateway.ts`)에서 파생한다. 그 파일은
  // `scripts/seo.ts`도 함께 import하므로, SPA와 prerender가 같은 문구를 쓴다는 계약이
  // 문구를 고칠 때마다 자동으로 유지된다.
  it("renders the gateway intro from the shared hero copy canon", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(gatewayHero).not.toBeNull();
    expect(
      within(gatewayHero as HTMLElement).getByText(
        "중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다."
      )
    ).toBeInTheDocument();

    const summaryParagraphs = [...(gatewayHero as HTMLElement).querySelectorAll(".gateway-summary")].map(
      (paragraph) => paragraph.textContent?.trim()
    );

    expect(summaryParagraphs).toEqual([...gatewayHeroSupportingParagraphs]);
    // 히어로는 짧게 유지한다 — 길어지면 국가 진입이 첫 화면 밖으로 밀린다.
    expect(summaryParagraphs.length).toBeLessThanOrEqual(2);
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
    expect(within(copyStack as HTMLElement).getByText("중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다.")).toBeInTheDocument();
    expect((copyStack as HTMLElement).querySelectorAll(".gateway-summary")).toHaveLength(
      gatewayHeroSupportingParagraphs.length
    );
  });

  // `Recommended Start` 섹션은 국가 진입 그리드에 흡수됐다. "어디부터 볼지"를 산문으로
  // 설명하는 대신 고를 수 있는 목록 자체를 앞에 둔다. 지켜야 할 계약은 진입 수단이 위험
  // 설명 섹션보다 앞에 온다는 것이고, 그건 그대로 유지한다.
  it("places the guide entry above the risk section", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const guideEntry = document.querySelector('[data-gateway-section="guide-entry"]');
    const whyLateHeading = screen.getByRole("heading", { name: "상표 리스크는 늦게 보일수록 비싸집니다" });

    expect(guideEntry).not.toBeNull();
    expectPrecedes(guideEntry as Element, whyLateHeading);

    // 히어로 바로 다음이어야 한다 — 사이에 다른 섹션이 끼면 첫 화면에서 밀려난다.
    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect((gatewayHero as HTMLElement).nextElementSibling).toBe(guideEntry);
  });

  it("does not render an empty Incubate roadmap card when no incubate-tier guides exist", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const roadmapTitles = Array.from(
      document.querySelectorAll(".gateway-card-grid .gateway-card-title")
    ).map((el) => el.textContent?.trim() ?? "");

    expect(roadmapTitles.length).toBeGreaterThan(0);
    expect(roadmapTitles.some((title) => /Incubate/i.test(title))).toBe(false);
    expect(roadmapTitles.some((title) => /^·\s*Incubate$/.test(title))).toBe(false);
  });

  // 최신 브리프는 이제 이 배너 한 곳에서만 노출된다(별도 Latest Brief 섹션이 같은 내용을
  // 반복했다). 그래서 배너가 아카이브 링크까지 함께 져야 한다.
  it("surfaces the latest brief once, after the guide entry, with primary and archive CTAs", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const banner = screen.getByRole("region", { name: "최신 브리프 배너" });
    const guideEntry = document.querySelector('[data-gateway-section="guide-entry"]');

    expect(within(banner).getByRole("heading", { name: briefIssues[0]?.title ?? "" })).toBeInTheDocument();
    expect(within(banner).getByRole("link", { name: "최신 이슈 보기" })).toHaveAttribute(
      "href",
      `/briefs/${briefIssues[0]?.slug}`
    );
    expect(within(banner).getByRole("link", { name: "브리프 전체 보기" })).toHaveAttribute(
      "href",
      "/briefs"
    );

    // 이용자의 첫 업무(읽을 나라 고르기)가 브리프보다 앞이다.
    expectPrecedes(guideEntry as Element, banner);

    // 최신 이슈 제목이 게이트웨이에 두 번 이상 나오면 중복이 되살아난 것이다.
    expect(screen.getAllByRole("heading", { name: briefIssues[0]?.title ?? "" })).toHaveLength(1);
  });

  it("leads the gateway with the latest brief banner above the latest reports trust layer", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const latestReportsSection = screen
      .getByRole("heading", { name: "최신 리포트 2개에서 세 가이드의 공통 질문을 함께 살펴봅니다" })
      .closest("section");
    const briefBanner = screen.getByRole("region", { name: "최신 브리프 배너" });

    expect(latestReportsSection).not.toBeNull();
    expect(latestReportsSection).toHaveClass("gateway-section--trust-layer");
    expect((latestReportsSection as HTMLElement).querySelector(".brief-card-grid")).toHaveClass("brief-card-grid--trust-layer");
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
      (briefBanner as HTMLElement).compareDocumentPosition(latestReportsSection as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
  });

  // 별도 Report 섹션은 최신 리포트를 세 번째로 반복했다(히어로 CTA · 트러스트 레이어 ·
  // 이 섹션). 고유했던 focus point 핸드오프와 아카이브 링크만 트러스트 레이어로 접어 넣고
  // 중복 섹션은 없앴다. 지켜야 할 계약(핸드오프 목적지)은 그대로 유지한다.
  it("folds the report handoffs into the single latest-reports section", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const reportSection = screen
      .getByRole("heading", { name: "최신 리포트 2개에서 세 가이드의 공통 질문을 함께 살펴봅니다" })
      .closest("section");

    expect(reportSection).not.toBeNull();
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" })
    ).toHaveAttribute("href", "/reports");
    expect(
      within(reportSection as HTMLElement).getByRole("heading", { name: "ChaTm: 대리인 handoff 메모부터 표준화한다" })
    ).toBeInTheDocument();
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "ChaTm handoff 메모 보기" })
    ).toHaveAttribute(
      "href",
      "/china/chapter/제5장-출원서-작성-실무와-지정상품-설계#대리인-handoff-메모"
    );
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "MexTm 권한·대리 실무 보기" })
    ).toHaveAttribute(
      "href",
      "/mexico/chapter/제5장-출원서-작성-실무-제출서류권한전자출원pase#4-권한-및-대리-실무"
    );
    expect(
      within(reportSection as HTMLElement).getByRole("link", { name: "EuTm handoff 규칙 보기" })
    ).toHaveAttribute(
      "href",
      "/europe/chapter/제5장-출원-경로와-서류-설계#대표자대리인-handoff-규칙"
    );

    // 최신 리포트 제목이 게이트웨이에 두 번 이상 나오면 중복이 되살아난 것이다.
    expect(screen.getAllByRole("heading", { name: latestReport?.title ?? "" })).toHaveLength(1);

    // 운영 상태(우선 레인 요약)는 독자용 정보가 아니라 운영 정보라 접힌 운영 영역으로 내렸다.
    const operationsPanel = document.querySelector('[data-gateway-section="operations"]');

    expect(operationsPanel).not.toBeNull();
    expect(operationsPanel?.textContent).toContain("현재 우선 레인 상태:");
    expect(reportSection?.textContent).not.toContain("현재 우선 레인 상태:");
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

  it("groups the portfolio cards by tier and exposes priority-lane maturity notes", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "포트폴리오를 flagship, growth, validate, incubate로 운영합니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Flagship" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "Growth" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).queryByRole("heading", { name: "Validate" })).toBeNull();
    expect(within(currentPilotScope as HTMLElement).queryByRole("heading", { name: "Incubate" })).toBeNull();
    expect(
      within(currentPilotScope as HTMLElement).getByText("mature 승격 반영 · Sprint 2 저밀도 9장 보강 · reader/search QA 정렬 완료")
    ).toBeInTheDocument();
    expect(
      within(currentPilotScope as HTMLElement).getByText(
        "EU-wide·core-state·UK split과 evidence triage를 EU+UK 범위에서 두껍게 다루는 growth regional guide입니다."
      )
    ).toBeInTheDocument();
    expect(
      within(currentPilotScope as HTMLElement).getByText(
        "mature 승급 · Ch3/6/10/14·부록 보강 · 2026-06-10 법률 사실정정(UK fee·우선권·comparable·Brexit 날짜) 및 claim-map 10건 반영"
      )
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

  it("does not emit a separate guide_open custom event on product routes", async () => {
    installFetchMock();
    const measurementSpy = vi.spyOn(ga, "getGaMeasurementId").mockReturnValue("G-TEST123");
    const trackEventSpy = vi.spyOn(ga, "trackGaEvent").mockReturnValue(true);

    renderAppRouteTree("/china");

    await screen.findByRole("heading", { name: "중국 상표 실무 운영 가이드" });

    expect(trackEventSpy).not.toHaveBeenCalled();

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

    // 아카이브 CTA와 리포트 카드가 이제 같은 트러스트 레이어 섹션에 있다.
    const reportSection = screen
      .getByRole("heading", { name: "최신 리포트 2개에서 세 가이드의 공통 질문을 함께 살펴봅니다" })
      .closest("section");

    clickTrackedLink(within(reportSection as HTMLElement).getByRole("link", { name: "리포트 전체 보기" }));

    const reportPrimaryLink = within(reportSection as HTMLElement)
      .getAllByRole("link", { name: "리포트 보기" })
      .at(0);

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
        report_slug: latestGatewayReports[0]?.slug,
        surface: "gateway_latest_reports"
      })
    );

    measurementSpy.mockRestore();
    trackEventSpy.mockRestore();
  });

  // 별도 Latest Brief 섹션은 히어로 아래 배너와 같은 이슈를 다시 보여줬다. 배너 하나로
  // 통합하고, 그 배너가 아카이브 진입까지 함께 진다.
  it("surfaces the brief exactly once on the gateway, with archive and latest-issue links", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const banner = screen.getByRole("region", { name: "최신 브리프 배너" });

    expect(within(banner).getByRole("link", { name: "브리프 전체 보기" })).toHaveAttribute(
      "href",
      "/briefs"
    );
    expect(within(banner).getByRole("link", { name: "최신 이슈 보기" })).toHaveAttribute(
      "href",
      `/briefs/${briefIssues[0]?.slug}`
    );
    expect(within(banner).getByRole("heading", { name: briefIssues[0]?.title ?? "" })).toBeInTheDocument();

    // 중복 섹션이 되살아나면 아카이브 링크가 둘이 된다.
    expect(screen.getAllByRole("link", { name: "브리프 전체 보기" })).toHaveLength(1);
    expect(
      screen.queryByRole("heading", {
        name: "지난 1주일간 가장 중요한 한국 기업 브랜드 이슈를 빠르게 정리합니다"
      })
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
    const latestBriefCard = issueHeadings[0]?.closest("article");
    const previousBriefCard = issueHeadings[1]?.closest("article");

    expect(issueHeadings[0]).toHaveTextContent(briefIssues[0]?.title ?? "");
    expect(issueHeadings[1]).toHaveTextContent(briefIssues[1]?.title ?? "");
    expect(latestBriefCard).not.toBeNull();
    expect(previousBriefCard).not.toBeNull();
    expect(within(latestBriefCard as HTMLElement).getByText("Latest Brief")).toBeInTheDocument();
    expect(within(previousBriefCard as HTMLElement).queryByText("Latest Brief")).toBeNull();
    expect(within(previousBriefCard as HTMLElement).getByText("Brief")).toBeInTheDocument();
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
      screen.queryByText(/ChaTm · MexTm · EuTm에서 이미 다룬 출원 우선순위와 표장 우선순위 질문을 이 리포트에서 한 번에 다시 정리했습니다\./)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/ChaTm · MexTm · EuTm에서 이미 다룬 현지 대리인 선임 요건과 위임 구조 판단을 이 리포트에서 한 번에 다시 정리했습니다\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `현재 공통 정렬 순서는 ${priorityLaneLabelSequence} -> ${latestReport?.gatewayBridgeLabel}입니다. guide 3개를 잠근 뒤, 최신 리포트와 Gateway handoff를 같은 순서로 이어 보는 단계입니다.`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `ChaTm · MexTm · EuTm에서 이미 다룬 현지 대리인 선임 요건과 위임 구조 판단을 이 리포트에서 한 번에 다시 정리했습니다\\..*JapTm · UKTm · UsaTm은 필요할 때 이어서 보면 됩니다\\.`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/니스 45류는 공통 언어일 뿐, 실제 보호범위는 관할별 심사언어/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/대상: 여러 나라에 같은 브랜드로 출원하며 상품·서비스 명세를 먼저 표준화해야 하는 브랜드 관리자, 인하우스 IP 팀, 글로벌 사업 리드/)
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
    expect(screen.getByRole("heading", { name: "EuTm: EU+UK evidence handoff를 고정한다" })).toBeInTheDocument();
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

    clickTrackedLink(screen.getByRole("link", { name: "ChaTm handoff 메모 보기" }));

    expect(trackEventSpy).toHaveBeenCalledWith(
      "G-TEST123",
      "report_handoff_click",
      expect.objectContaining({
        report_slug: latestReport?.slug,
        guide_slug: "china",
        surface: "gateway_section",
        target_path: "/china/chapter/제5장-출원서-작성-실무와-지정상품-설계#대리인-handoff-메모"
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

  // 브라우저 자동 스크롤 복원은 새로고침 직후 문서가 아직 짧은 시점의 오프셋을 잡아 뒀다가,
  // 앱이 앵커로 이동한 **뒤에** 지연 적용되며 되돌린다(`/glotm/` 실측 12/30 실패).
  // 해시가 있는 동안에는 위치 소유권을 앱이 가진다.
  it("hands scroll restoration to the app only while a hash route is active", async () => {
    installFetchMock();

    const originalDescriptor = Object.getOwnPropertyDescriptor(
      window.history,
      "scrollRestoration"
    );

    // jsdom에는 history.scrollRestoration이 없다. 앱은 미지원 환경에서 조용히 넘어가야 하므로
    // (그 자체는 scrollRestoration.test.ts가 검증한다) 여기서는 지원 환경을 만들어 배선을 본다.
    let scrollRestorationValue: ScrollRestoration = "auto";

    Object.defineProperty(window.history, "scrollRestoration", {
      configurable: true,
      get: () => scrollRestorationValue,
      set: (next: ScrollRestoration) => {
        scrollRestorationValue = next;
      }
    });

    try {
      renderAppRouteTree("/china/chapter/china-overview#overview");

      await waitFor(() => {
        expect(window.history.scrollRestoration).toBe("manual");
      });

      const hashlessRender = renderAppRouteTree("/");

      await waitFor(() => {
        expect(window.history.scrollRestoration).toBe("auto");
      });

      hashlessRender.unmount();
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(window.history, "scrollRestoration", originalDescriptor);
      } else {
        delete (window.history as Partial<History>).scrollRestoration;
      }
    }
  });

  it("puts the guide entry section ahead of the report section on the gateway", async () => {
    installFetchMock();

    renderAppRouteTree("/");

    await screen.findByRole("heading", {
      name: "인하우스 팀을 위한 cross-border trademark operating guide"
    });

    const guideEntrySection = document.querySelector('[data-gateway-section="guide-entry"]');
    const reportSection = document.querySelector('[data-gateway-section="reports"]');

    expect(guideEntrySection).not.toBeNull();
    expect(reportSection).not.toBeNull();
    expectPrecedes(guideEntrySection as Element, reportSection as Element);
  });

  it("leads the gateway guide entry with china, mexico, europe and reaches every live guide", async () => {
    installFetchMock();

    renderAppRouteTree("/");

    await screen.findByRole("heading", {
      name: "인하우스 팀을 위한 cross-border trademark operating guide"
    });

    const entryHrefs = [
      ...document.querySelectorAll('[data-gateway-section="guide-entry"] [data-guide-entry-slug]')
    ].map((link) => link.getAttribute("href"));

    // PROJECT-OVERVIEW.md가 산문으로만 약속하던 우선 순서를 기계 검증 계약으로 바꾼다.
    expect(entryHrefs.slice(0, 3)).toEqual(["/china", "/mexico", "/europe"]);
    // 순서는 registry의 gatewayOrder에서 구조적으로 파생되어야 한다(드리프트 불가).
    expect(entryHrefs).toEqual(orderedLiveGuidePaths);
    // 신규 국가 추가는 owner 결정 사항이라, 개수 변화는 의도적으로 이 테스트를 깨야 한다.
    expect(entryHrefs).toHaveLength(7);
  });
});

describe("brief time-sensitive notice", () => {
  // 시계를 고정하지 않으면 이 단정들은 달력이 지나가면서 조용히 뒤집힌다 —
  // "만료 전"을 확인하는 테스트는 closesOn이 지나는 순간 의미를 잃는다.
  // Date만 가짜로 쓴다(setTimeout까지 바꾸면 Testing Library의 대기가 멎는다).
  const openWindowAt = new Date("2026-09-20T00:00:00.000Z");
  const closedWindowAt = new Date("2026-10-01T00:00:00.000Z");
  const issueSlug = "2026-09-uspto-madrid-efiling-cutover";

  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState({}, "", "/");
  });

  function freezeAt(instant: Date) {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(instant);
  }

  it("says nothing while the window is still open", () => {
    freezeAt(openWindowAt);

    renderAppRouteTree(`/briefs/${issueSlug}`);

    expect(screen.queryByLabelText("시한이 지난 소재 고지")).not.toBeInTheDocument();
    expect(screen.queryByText("마감 지남")).not.toBeInTheDocument();
  });

  it("leads the issue with an expiry notice once the window has closed", () => {
    freezeAt(closedWindowAt);

    renderAppRouteTree(`/briefs/${issueSlug}`);

    const notice = screen.getByLabelText("시한이 지난 소재 고지");

    expect(within(notice).getByText(/TEASi와 Madrid e-Filing 병행 기간/)).toBeInTheDocument();
    expect(within(notice).getByText(/Madrid e-Filing으로만 접수됩니다/)).toBeInTheDocument();

    // 고지는 본문보다 먼저 나와야 한다 — 검색으로 도착한 독자가 지난 시한을 본문보다 늦게 알면
    // 장치가 있으나 마나다.
    const heading = screen.getByRole("heading", { level: 1 });
    expect(
      notice.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("badges the expired issue in the archive listing", () => {
    freezeAt(closedWindowAt);

    renderAppRouteTree("/briefs");

    expect(screen.getAllByText("마감 지남").length).toBeGreaterThan(0);
  });
});
