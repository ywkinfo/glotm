import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  LatamChapterPage,
  LatamHomePage,
  LatamReaderRoot
} from "./latam";
import {
  MexicoChapterPage,
  MexicoHomePage,
  MexicoReaderRoot
} from "./mexico";
import {
  UsaChapterPage,
  UsaHomePage,
  UsaReaderRoot
} from "./usa";
import type { DocumentData } from "./shared";

type ReaderCase = {
  name: string;
  basePath: string;
  storageKey: string;
  homeHeading: string;
  ReaderRoot: typeof LatamReaderRoot;
  HomePage: typeof LatamHomePage;
  ChapterPage: typeof LatamChapterPage;
  documentData: DocumentData;
  targetChapterSlug: string;
  targetChapterTitle: string;
  targetSectionId: string;
  targetSectionTitle: string;
  clickedSectionId: string;
  clickedSectionTitle: string;
  prevChapterTitle: string;
  nextChapterTitle: string;
  bookmarkChapterSlug: string;
  bookmarkChapterTitle: string;
  bookmarkSectionId: string;
  bookmarkSectionTitle: string;
};

const latamDocumentData: DocumentData = {
  meta: {
    title: "중남미 상표 보호 운영 가이드",
    builtAt: "2026-03-28T00:00:00.000Z",
    chapterCount: 3
  },
  chapters: [
    {
      id: "latam-1",
      slug: "strategy-frame",
      title: "제1장. 전략 프레임",
      summary: "중남미 진출 우선순위를 잡는 기준을 설명합니다.",
      html: '<h2 id="overview">개요</h2><p>전략 구조</p>',
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
      id: "latam-2",
      slug: "filing-route",
      title: "제4장. 출원 경로 선택",
      summary: "출원 경로와 우선순위를 정리합니다.",
      html: '<h2 id="filing-overview">출원 개요</h2><p>출원 본문</p><h2 id="filing-risk">리스크</h2><p>리스크 본문</p>',
      headings: [
        {
          id: "filing-overview",
          depth: 2,
          title: "출원 개요",
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
      id: "latam-3",
      slug: "enforcement",
      title: "제11장. Enforcement",
      summary: "모니터링과 집행 흐름을 다룹니다.",
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

const mexicoDocumentData: DocumentData = {
  meta: {
    title: "멕시코 상표 실무 운영 가이드북",
    builtAt: "2026-03-28T00:00:00.000Z",
    chapterCount: 3
  },
  chapters: [
    {
      id: "mx-1",
      slug: "mexico-overview",
      title: "멕시코 제1장. 제도 개요",
      summary: "IMPI 운영 구조와 기본 흐름을 설명합니다.",
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
      id: "mx-2",
      slug: "mexico-filing",
      title: "멕시코 제2장. 출원 전략",
      summary: "출원 경로와 클래스 설계를 정리합니다.",
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
      id: "mx-3",
      slug: "mexico-enforcement",
      title: "멕시코 제3장. 집행 운영",
      summary: "모니터링과 집행 대응을 다룹니다.",
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

const usaDocumentData: DocumentData = {
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

const readerCases: ReaderCase[] = [
  {
    name: "Latam",
    basePath: "/latam",
    storageKey: "lattm_reading_bookmark",
    homeHeading: "중남미 상표 보호 운영 가이드",
    ReaderRoot: LatamReaderRoot,
    HomePage: LatamHomePage,
    ChapterPage: LatamChapterPage,
    documentData: latamDocumentData,
    targetChapterSlug: "filing-route",
    targetChapterTitle: "제4장. 출원 경로 선택",
    targetSectionId: "filing-overview",
    targetSectionTitle: "출원 개요",
    clickedSectionId: "filing-risk",
    clickedSectionTitle: "리스크",
    prevChapterTitle: "제1장. 전략 프레임",
    nextChapterTitle: "제11장. Enforcement",
    bookmarkChapterSlug: "enforcement",
    bookmarkChapterTitle: "제11장. Enforcement",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Mexico",
    basePath: "/mexico",
    storageKey: "mextm_reading_bookmark",
    homeHeading: "멕시코 상표 실무 운영 가이드북",
    ReaderRoot: MexicoReaderRoot,
    HomePage: MexicoHomePage,
    ChapterPage: MexicoChapterPage,
    documentData: mexicoDocumentData,
    targetChapterSlug: "mexico-filing",
    targetChapterTitle: "멕시코 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    clickedSectionId: "filing-risk",
    clickedSectionTitle: "리스크",
    prevChapterTitle: "멕시코 제1장. 제도 개요",
    nextChapterTitle: "멕시코 제3장. 집행 운영",
    bookmarkChapterSlug: "mexico-enforcement",
    bookmarkChapterTitle: "멕시코 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Usa",
    basePath: "/usa",
    storageKey: "usatm_reading_bookmark",
    homeHeading: "미국 상표 실무 운영 가이드북",
    ReaderRoot: UsaReaderRoot,
    HomePage: UsaHomePage,
    ChapterPage: UsaChapterPage,
    documentData: usaDocumentData,
    targetChapterSlug: "us-filing",
    targetChapterTitle: "미국 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    clickedSectionId: "filing-risk",
    clickedSectionTitle: "리스크",
    prevChapterTitle: "미국 제1장. 제도 개요",
    nextChapterTitle: "미국 제3장. 집행 운영",
    bookmarkChapterSlug: "us-enforcement",
    bookmarkChapterTitle: "미국 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  }
];

function installFetchMock(documentData: DocumentData) {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);

    if (url.includes("document-data")) {
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

function renderReaderRoute(
  readerCase: ReaderCase,
  initialEntry: string
) {
  const ReaderRootComponent = readerCase.ReaderRoot;
  const HomePageComponent = readerCase.HomePage;
  const ChapterPageComponent = readerCase.ChapterPage;

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Routes>
        <Route path={readerCase.basePath} element={<ReaderRootComponent />}>
          <Route index element={<HomePageComponent />} />
          <Route path="chapter/:chapterSlug" element={<ChapterPageComponent />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function LocationProbe() {
  const location = useLocation();

  return (
    <output data-testid="location-probe">
      {`${location.pathname}${location.hash}`}
    </output>
  );
}

function installNavigationMocks() {
  const scrollIntoViewMock = vi.fn();

  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    writable: true,
    value: scrollIntoViewMock
  });

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});

  return scrollIntoViewMock;
}

describe("Shared reader runtime contract", () => {
  it.each(readerCases)(
    "keeps chapter title, hash outline, and chapter navigation intact for $name",
    async (readerCase) => {
      installFetchMock(readerCase.documentData);
      const scrollIntoViewMock = installNavigationMocks();

      renderReaderRoute(
        readerCase,
        `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.targetSectionId}`
      );

      await screen.findByRole("heading", { name: readerCase.targetChapterTitle });

      await waitFor(() => {
        expect(document.title).toBe(`${readerCase.targetChapterTitle} | GloTm`);
      });
      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });

      const outline = screen.getByRole("heading", { name: "이 장의 섹션 목차" }).closest("section");

      expect(outline).not.toBeNull();
      await waitFor(() => {
        const activeOutlineLink = (outline as HTMLElement).querySelector(".chapter-outline-link.active");

        expect(activeOutlineLink).not.toBeNull();
        expect(activeOutlineLink).toHaveAttribute("aria-current", "location");
      });
      expect(screen.getByRole("link", { name: new RegExp(readerCase.prevChapterTitle) })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: new RegExp(readerCase.nextChapterTitle) })).toBeInTheDocument();
    }
  );

  it.each(readerCases)(
    "updates hash, active outline state, and scrolls when clicking a section outline for $name",
    async (readerCase) => {
      installFetchMock(readerCase.documentData);
      const scrollIntoViewMock = installNavigationMocks();

      renderReaderRoute(readerCase, `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}`);

      await screen.findByRole("heading", { name: readerCase.targetChapterTitle });

      const outline = screen.getByRole("heading", { name: "이 장의 섹션 목차" }).closest("section");

      expect(outline).not.toBeNull();

      fireEvent.click(
        within(outline as HTMLElement).getByRole("link", { name: readerCase.clickedSectionTitle })
      );

      await waitFor(() => {
        expect(screen.getByTestId("location-probe")).toHaveTextContent(
          `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.clickedSectionId}`
        );
        expect(
          within(outline as HTMLElement).getByRole("link", { name: readerCase.clickedSectionTitle })
        ).toHaveAttribute("aria-current", "location");
        expect(scrollIntoViewMock).toHaveBeenCalledWith(
          expect.objectContaining({
            block: "start",
            behavior: "smooth"
          })
        );
      });
    }
  );

  it.each(readerCases)(
    "restores continue reading state on the home page for $name",
    async (readerCase) => {
      installFetchMock(readerCase.documentData);

      window.localStorage.setItem(
        readerCase.storageKey,
        JSON.stringify({
          chapterSlug: readerCase.bookmarkChapterSlug,
          chapterTitle: readerCase.bookmarkChapterTitle,
          sectionId: readerCase.bookmarkSectionId,
          sectionTitle: readerCase.bookmarkSectionTitle,
          progress: 55,
          updatedAt: "2026-03-28T09:30:00.000Z"
        })
      );

      renderReaderRoute(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });
      const continueCard = screen.getByText("Continue Reading").closest("section");

      expect(continueCard).not.toBeNull();
      expect(within(continueCard as HTMLElement).getByRole("heading", { level: 2 })).toHaveTextContent(
        readerCase.bookmarkChapterTitle
      );
      expect(
        within(continueCard as HTMLElement).getByText(
          new RegExp(`최근 읽은 위치: ${readerCase.bookmarkSectionTitle}`)
        )
      ).toBeInTheDocument();
      expect(within(continueCard as HTMLElement).getByRole("link", { name: "이어 읽기" })).toHaveAttribute(
        "href",
        expect.stringContaining(
          `${readerCase.basePath}/chapter/${readerCase.bookmarkChapterSlug}#${readerCase.bookmarkSectionId}`
        )
      );
    }
  );
});
