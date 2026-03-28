import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
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

const documentDataByWorkspace = {
  LatTm: createMockDocumentData("중남미 상표 보호 운영 가이드", "중남미 제1장. 전략 프레임", "latam-overview"),
  MexTm: createMockDocumentData("멕시코 상표 실무 운영 가이드북", "멕시코 제1장. 제도 개요", "mexico-overview"),
  UsaTm: createMockDocumentData("미국 상표 실무 운영 가이드북", "미국 제1장. 제도 개요", "us-overview"),
  JapTm: createMockDocumentData("일본 상표 실무 운영 가이드북", "일본 제1장. 제도 개요", "japan-overview"),
  ChaTm: createMockDocumentData("중국 상표 실무 운영 가이드", "중국 제1장. 제도 개요", "china-overview"),
  EuTm: createMockDocumentData("EuTm 유럽 상표 운영 가이드북", "유럽 제1장. 제도 개요", "europe-overview")
};

function installFetchMock() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);

    if (url.includes("document-data")) {
      const documentData = Object.entries(documentDataByWorkspace).find(([workspace]) =>
        url.includes(workspace)
      )?.[1] ?? documentDataByWorkspace.UsaTm;

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

    render(<App />);

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
    window.history.replaceState({}, "", pathname);
    installFetchMock();

    render(<App />);

    await screen.findByRole("heading", { name: heading });

    const nav = screen.getByRole("navigation", { name: "제품 전환" });
    const activeLink = within(nav).getByRole("link", { name: navLabel });
    const latamLink = within(nav).getByRole("link", { name: /LatTm/ });

    expect(activeLink).toHaveClass("active");
    if (pathname !== "/latam") {
      expect(latamLink).not.toHaveClass("active");
    }
  });
});
