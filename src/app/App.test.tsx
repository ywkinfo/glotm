import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "./App";
import { liveShellReaderDefinitions } from "../products/liveShellReaders";
import { liveShellProducts } from "../products/registry";
import type { DocumentData } from "../products/shared";

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
  europe: createMockDocumentData("EuTm 유럽 상표 운영 가이드북", "유럽 제1장. 제도 개요", "europe-overview")
};

function installFetchMock() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const productSlug = Object.keys(documentDataByProduct).find((slug) =>
      url.includes(`/generated/${slug}/`)
    );

    if (url.includes("document-data")) {
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
  });

  it("keeps live product metadata aligned with live reader definitions", () => {
    expect(liveShellProducts.map((product) => product.slug)).toEqual(
      liveShellReaderDefinitions.map((definition) => definition.slug)
    );
  });

  it("shows all six live guides on the gateway and in top navigation", () => {
    installFetchMock();

    renderAppRouteTree("/");

    const nav = screen.getByRole("navigation", { name: "제품 전환" });

    expect(within(nav).getByRole("link", { name: /Gateway/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /LatTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /MexTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /UsaTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /JapTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /ChaTm/ })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /EuTm/ })).toBeInTheDocument();

    expect(screen.getByText("중남미 상표 보호 운영 가이드")).toBeInTheDocument();
    expect(screen.getByText("멕시코 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("미국 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("일본 상표 실무 운영 가이드북")).toBeInTheDocument();
    expect(screen.getByText("중국 상표 실무 운영 가이드")).toBeInTheDocument();
    expect(screen.getByText("EuTm 유럽 상표 운영 가이드북")).toBeInTheDocument();

    expect(document.querySelector('a[href="/japan"]')).not.toBeNull();
    expect(document.querySelector('a[href="/china"]')).not.toBeNull();
    expect(document.querySelector('a[href="/europe"]')).not.toBeNull();
  });

  it.each([
    ["/latam", "중남미 상표 보호 운영 가이드", /LatTm/],
    ["/mexico", "멕시코 상표 실무 운영 가이드북", /MexTm/],
    ["/usa", "미국 상표 실무 운영 가이드북", /UsaTm/],
    ["/japan", "일본 상표 실무 운영 가이드북", /JapTm/],
    ["/china", "중국 상표 실무 운영 가이드", /ChaTm/],
    ["/europe", "EuTm 유럽 상표 운영 가이드북", /EuTm/]
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

  it("navigates through top navigation and brand links on click", async () => {
    const user = userEvent.setup();

    installFetchMock();
    renderAppRouteTree("/");

    await user.click(
      within(screen.getByRole("navigation", { name: "제품 전환" })).getByRole("link", {
        name: /MexTm/
      })
    );
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/mexico");
    });

    await user.click(screen.getByRole("link", { name: "GloTm" }));
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/");
    });
  });

  it("navigates through the gateway hero CTA into LatTm", async () => {
    const user = userEvent.setup();

    installFetchMock();
    renderAppRouteTree("/");

    const gatewayHero = screen.getByText("GloTm Gateway").closest("section");

    expect(gatewayHero).not.toBeNull();
    expect(within(gatewayHero as HTMLElement).queryByRole("link", { name: "UsaTm 보기" })).toBeNull();

    await user.click(within(gatewayHero as HTMLElement).getByRole("link", { name: "LatTm 시작" }));
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/latam");
    });
  });

  it("places the reading flow above the risk section and links to the grouped portfolio", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const readingFlowHeading = screen.getByRole("heading", {
      name: "이제 권역형과 국가형 6개 가이드를 모두 같은 셸에서 바로 읽을 수 있습니다"
    });
    const whyLateHeading = screen.getByRole("heading", { name: "상표 리스크는 늦게 보일수록 비싸집니다" });

    expect(
      readingFlowHeading.compareDocumentPosition(whyLateHeading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).not.toBe(0);
    expect(screen.getByRole("link", { name: "전체 가이드 보기" })).toHaveAttribute(
      "href",
      "#current-pilot-scope"
    );
  });

  it("groups the pilot scope cards and exposes the ChaTm maturity note", () => {
    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "현재 GloTm에는 6개의 live shell guide가 연결되어 있습니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "권역 가이드" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByRole("heading", { name: "국가 가이드" })).toBeInTheDocument();
    expect(within(currentPilotScope as HTMLElement).getByText("지속 업데이트 중")).toBeInTheDocument();
  });

  it("navigates through the grouped pilot scope card into ChaTm", async () => {
    const user = userEvent.setup();

    installFetchMock();
    renderAppRouteTree("/");

    const currentPilotScope = screen
      .getByRole("heading", { name: "현재 GloTm에는 6개의 live shell guide가 연결되어 있습니다" })
      .closest("section");

    expect(currentPilotScope).not.toBeNull();

    await user.click(within(currentPilotScope as HTMLElement).getByRole("link", { name: "ChaTm 보기" }));
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/china");
    });
  });

  it("redirects unknown routes back to the gateway", async () => {
    installFetchMock();

    renderAppRouteTree("/missing");

    await screen.findByRole("heading", { name: "해외 진출에서 상표가 늦게 문제 되는 이유" });
    expect(screen.getByTestId("app-location")).toHaveTextContent("/");
  });

  it("respects a deployment basename for deep links and rendered hrefs", async () => {
    installFetchMock();

    renderAppRouteTree("/GloTm/japan", "/GloTm");

    await screen.findByRole("heading", { name: "일본 상표 실무 운영 가이드북" });
    await waitFor(() => {
      expect(screen.getByTestId("app-location")).toHaveTextContent("/japan");
    });

    expect(document.querySelector('a[href="/GloTm/latam"]')).not.toBeNull();
    expect(document.querySelector('a[href="/GloTm/japan"]')).not.toBeNull();
    expect(document.querySelector('a[href="/GloTm/europe"]')).not.toBeNull();
  });
});
