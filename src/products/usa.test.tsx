import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  UsaChapterPage,
  UsaHomePage,
  UsaReaderRoot
} from "./usa";
import type { DocumentData } from "./shared";

const mockDocumentData: DocumentData = {
  meta: {
    title: "미국 상표 실무 운영 가이드북",
    builtAt: "2026-03-28T00:00:00.000Z",
    chapterCount: 3
  },
  chapters: [
    {
      id: "us-1",
      slug: "us-overview",
      title: "미국 제1장. 제도 개요",
      summary: "USPTO 운영 구조와 기본 흐름을 설명합니다.",
      html: '<h2 id="overview">개요</h2><p>기본 구조</p>',
      headings: [
        {
          id: "overview",
          depth: 2,
          title: "개요",
          children: []
        }
      ]
    },
    {
      id: "us-2",
      slug: "us-filing",
      title: "미국 제2장. 출원 전략",
      summary: "filing basis와 specimen 설계를 정리합니다.",
      html: '<h2 id="filing">출원 전략</h2><p>전략 본문</p><h2 id="filing-risk">리스크</h2><p>리스크 본문</p>',
      headings: [
        {
          id: "filing",
          depth: 2,
          title: "출원 전략",
          children: []
        },
        {
          id: "filing-risk",
          depth: 2,
          title: "리스크",
          children: []
        }
      ]
    },
    {
      id: "us-3",
      slug: "us-enforcement",
      title: "미국 제3장. 집행 운영",
      summary: "marketplace와 분쟁 대응을 다룹니다.",
      html: '<h2 id="monitoring">모니터링</h2><p>집행 본문</p>',
      headings: [
        {
          id: "monitoring",
          depth: 2,
          title: "모니터링",
          children: []
        }
      ]
    }
  ]
};

function installFetchMock() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);

    if (url.includes("document-data")) {
      return new Response(JSON.stringify(mockDocumentData), {
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

function renderUsaRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/usa" element={<UsaReaderRoot />}>
          <Route index element={<UsaHomePage />} />
          <Route path="chapter/:chapterSlug" element={<UsaChapterPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Usa reader", () => {
  it("loads a chapter route, sets the title, scrolls to the hash target, and renders chapter navigation", async () => {
    installFetchMock();
    const scrollIntoViewMock = vi.mocked(HTMLElement.prototype.scrollIntoView);

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    renderUsaRoute("/usa/chapter/us-filing#filing");

    await screen.findByRole("heading", { name: "미국 제2장. 출원 전략" });

    await waitFor(() => {
      expect(document.title).toBe("미국 제2장. 출원 전략 | GloTm");
    });
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });

    expect(screen.getByRole("link", { name: /미국 제1장. 제도 개요/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /미국 제3장. 집행 운영/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "이 장의 섹션 목차" })).toBeInTheDocument();
  });

  it("restores the continue reading card from bookmark storage on the home page", async () => {
    installFetchMock();

    window.localStorage.setItem(
      "usatm_reading_bookmark",
      JSON.stringify({
        chapterSlug: "us-enforcement",
        chapterTitle: "미국 제3장. 집행 운영",
        sectionId: "monitoring",
        sectionTitle: "모니터링",
        progress: 55,
        updatedAt: "2026-03-28T09:30:00.000Z"
      })
    );

    renderUsaRoute("/usa");

    await screen.findByRole("heading", { name: "미국 상표 실무 운영 가이드북" });
    const continueCard = screen.getByText("Continue Reading").closest("section");

    expect(continueCard).not.toBeNull();
    expect(within(continueCard as HTMLElement).getByRole("heading", { level: 2 })).toHaveTextContent(
      "미국 제3장. 집행 운영"
    );
    expect(within(continueCard as HTMLElement).getByText(/최근 읽은 위치: 모니터링/)).toBeInTheDocument();
    expect(within(continueCard as HTMLElement).getByRole("link", { name: "이어 읽기" })).toHaveAttribute(
      "href",
      expect.stringContaining("/usa/chapter/us-enforcement#monitoring")
    );
  });
});
