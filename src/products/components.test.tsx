import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  ChapterOutline,
  MarkdownArticle,
  ReaderActionBar,
  SearchPanel,
  SidebarNav
} from "./components";
import type { Chapter, SearchEntry } from "./shared";

const searchResult: SearchEntry = {
  id: "mx-result",
  chapterSlug: "mexico-operating",
  chapterTitle: "멕시코 운영 가이드",
  sectionId: "impi-response",
  sectionTitle: "IMPI 대응",
  text: "IMPI 거절이유와 대응 전략을 설명합니다.",
  excerpt: "IMPI 거절이유와 대응 전략"
};

function createDeferredPromise<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, resolve, reject };
}

const sidebarChapters: Chapter[] = [
  {
    id: "chapter-1",
    slug: "chapter-1",
    title: "제1장. 전략 프레임",
    summary: "전략 구조를 설명합니다.",
    html: '<h2 id="overview">개요</h2>',
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
    id: "chapter-2",
    slug: "chapter-2",
    title: "제2장. 출원 전략",
    summary: "출원 전략을 설명합니다.",
    html: '<h2 id="filing">출원 전략</h2><h2 id="filing-risk">리스크</h2>',
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
  }
];

function LocationProbe() {
  const location = useLocation();

  return (
    <output data-testid="component-location">
      {location.pathname}
      {location.hash}
    </output>
  );
}

function createWideTableHtml() {
  return `
    <div
      class="table-shell table-shell--wide"
      data-table-scroll-root=""
      data-has-overflow="false"
      data-can-scroll-left="false"
      data-can-scroll-right="false"
    >
      <button
        type="button"
        class="table-scroll-button table-scroll-button--left"
        data-table-scroll-button="left"
        aria-label="표를 왼쪽으로 스크롤"
        disabled
      >
        ←
      </button>
      <div
        class="table-scroll table-scroll--wide"
        data-table-scroll-viewport=""
      >
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>브라질</th>
              <th>멕시코</th>
              <th>콜롬비아</th>
              <th>아르헨티나</th>
              <th>칠레</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>출원 언어</td>
              <td>포르투갈어</td>
              <td>스페인어</td>
              <td>스페인어</td>
              <td>스페인어</td>
              <td>스페인어</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        class="table-scroll-button table-scroll-button--right"
        data-table-scroll-button="right"
        aria-label="표를 오른쪽으로 스크롤"
        disabled
      >
        →
      </button>
    </div>
  `;
}

function mockViewportMetrics(
  element: HTMLElement,
  metrics: {
    clientWidth: number;
    scrollWidth: number;
    scrollLeft: number;
  }
) {
  Object.defineProperties(element, {
    clientWidth: {
      configurable: true,
      get: () => metrics.clientWidth
    },
    scrollWidth: {
      configurable: true,
      get: () => metrics.scrollWidth
    },
    scrollLeft: {
      configurable: true,
      get: () => metrics.scrollLeft,
      set: (value: number) => {
        metrics.scrollLeft = value;
      }
    }
  });
}

function stubResizeObserverForTest(value: typeof ResizeObserver | undefined) {
  const original = globalThis.ResizeObserver;

  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value
  });

  return () => {
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: original
    });
  };
}

describe("SearchPanel", () => {
  it("warms the search index on focus and navigates to the chosen chapter hash", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const warmSearchContent = vi.fn();
    const searchContent = vi.fn().mockResolvedValue([searchResult]);

    render(
      <SearchPanel
        onNavigate={onNavigate}
        searchContent={searchContent}
        warmSearchContent={warmSearchContent}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.click(input);
    expect(warmSearchContent).toHaveBeenCalledTimes(1);

    await user.type(input, "IMPI");

    const option = await screen.findByRole("option", { name: /IMPI 대응/ });
    await user.click(option);

    expect(onNavigate).toHaveBeenCalledWith("mexico-operating", "impi-response");
    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("supports keyboard selection through the result list", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const warmSearchContent = vi.fn();
    const searchContent = vi.fn().mockResolvedValue([
      {
        ...searchResult,
        id: "mx-result-1",
        sectionId: "overview",
        sectionTitle: "개요"
      },
      {
        ...searchResult,
        id: "mx-result-2",
        sectionId: "filing",
        sectionTitle: "출원 전략"
      }
    ]);

    render(
      <SearchPanel
        onNavigate={onNavigate}
        searchContent={searchContent}
        warmSearchContent={warmSearchContent}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.click(input);
    await user.type(input, "전략");
    await screen.findByRole("option", { name: /개요/ });
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onNavigate).toHaveBeenCalledWith("mexico-operating", "filing");
  });

  it("renders results for numeric queries once search completes", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const warmSearchContent = vi.fn();
    const searchContent = vi.fn().mockImplementation(async (query: string) => {
      if (query === "2") {
        return [
          {
            ...searchResult,
            id: "mx-result-2",
            sectionId: "step-2",
            sectionTitle: "2. 출원 전략 수립"
          }
        ];
      }

      return [];
    });

    render(
      <SearchPanel
        onNavigate={onNavigate}
        searchContent={searchContent}
        warmSearchContent={warmSearchContent}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.type(input, "2");

    expect(await screen.findByRole("option", { name: /2\. 출원 전략 수립/ })).toBeInTheDocument();
    expect(screen.queryByText("일치하는 섹션을 찾지 못했습니다.")).not.toBeInTheDocument();
  });

  it("shows a loading message instead of an empty state while search is pending", async () => {
    const user = userEvent.setup();
    const deferredSearch = createDeferredPromise<SearchEntry[]>();
    const searchContent = vi.fn().mockReturnValue(deferredSearch.promise);

    render(
      <SearchPanel
        onNavigate={vi.fn()}
        searchContent={searchContent}
        warmSearchContent={vi.fn()}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.type(input, "2");

    expect(await screen.findByText("검색 인덱스를 불러오는 중입니다.")).toBeInTheDocument();
    expect(screen.queryByText("일치하는 섹션을 찾지 못했습니다.")).not.toBeInTheDocument();

    deferredSearch.resolve([
      {
        ...searchResult,
        id: "mx-result-pending",
        sectionTitle: "2. 검색 완료"
      }
    ]);

    expect(await screen.findByRole("option", { name: /2\. 검색 완료/ })).toBeInTheDocument();
  });

  it("shows the empty state only after the active query resolves with no results", async () => {
    const user = userEvent.setup();
    const deferredSearch = createDeferredPromise<SearchEntry[]>();
    const searchContent = vi.fn().mockReturnValue(deferredSearch.promise);

    render(
      <SearchPanel
        onNavigate={vi.fn()}
        searchContent={searchContent}
        warmSearchContent={vi.fn()}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.type(input, "없는 검색어");

    expect(await screen.findByText("검색 인덱스를 불러오는 중입니다.")).toBeInTheDocument();
    expect(screen.queryByText("일치하는 섹션을 찾지 못했습니다.")).not.toBeInTheDocument();

    deferredSearch.resolve([]);

    expect(await screen.findByText("일치하는 섹션을 찾지 못했습니다.")).toBeInTheDocument();
  });

  it("keeps only the latest query results when requests resolve out of order", async () => {
    const user = userEvent.setup();
    const requests = new Map<string, ReturnType<typeof createDeferredPromise<SearchEntry[]>>>();
    const searchContent = vi.fn().mockImplementation((query: string) => {
      const deferredSearch = createDeferredPromise<SearchEntry[]>();

      requests.set(query, deferredSearch);

      return deferredSearch.promise;
    });

    render(
      <SearchPanel
        onNavigate={vi.fn()}
        searchContent={searchContent}
        warmSearchContent={vi.fn()}
      />
    );

    const input = screen.getByRole("combobox", { name: "검색" });

    await user.type(input, "1");
    await waitFor(() => {
      expect(requests.has("1")).toBe(true);
    });

    await user.type(input, "2");
    await waitFor(() => {
      expect(requests.has("12")).toBe(true);
    });

    requests.get("12")!.resolve([
      {
        ...searchResult,
        id: "latest-result",
        sectionTitle: "12. 최신 결과"
      }
    ]);

    expect(await screen.findByRole("option", { name: /12\. 최신 결과/ })).toBeInTheDocument();

    requests.get("1")!.resolve([
      {
        ...searchResult,
        id: "stale-result",
        sectionTitle: "1. 이전 결과"
      }
    ]);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /12\. 최신 결과/ })).toBeInTheDocument();
      expect(screen.queryByRole("option", { name: /1\. 이전 결과/ })).not.toBeInTheDocument();
    });
  });
});

describe("ReaderActionBar", () => {
  it("renders the compact scroll-to-top control without visible section text", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onScrollToTop = vi.fn();

    render(
      <ReaderActionBar
        activeSectionTitle="부서별 책임 배분"
        onDismiss={onDismiss}
        onScrollToTop={onScrollToTop}
        visible
      />
    );

    expect(screen.queryByText("부서별 책임 배분")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "맨 위로" }));
    await user.click(screen.getByRole("button", { name: "맨 위로 버튼 숨기기" }));

    expect(onScrollToTop).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("SidebarNav", () => {
  it("routes current-chapter section clicks through the shared jump callback", async () => {
    const user = userEvent.setup();
    const onSectionJump = vi.fn();
    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <SidebarNav
          chapters={sidebarChapters}
          basePath="/latam"
          currentChapterSlug="chapter-2"
          currentSectionId="filing"
          onSectionJump={onSectionJump}
          onNavigate={onNavigate}
        />
      </MemoryRouter>
    );

    const sectionList = screen.getByRole("list", { name: "제2장. 출원 전략 섹션 목차" });
    const riskLink = within(sectionList).getByRole("link", { name: "리스크" });

    expect(riskLink).toHaveAttribute("href", "/latam/chapter/chapter-2#filing-risk");

    await user.click(riskLink);

    expect(onSectionJump).toHaveBeenCalledWith("filing-risk");
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});

describe("ChapterOutline", () => {
  it("routes outline clicks through the shared jump callback while preserving hash hrefs", async () => {
    const user = userEvent.setup();
    const onSectionJump = vi.fn();

    render(
      <MemoryRouter>
        <ChapterOutline
          basePath="/latam"
          chapterSlug="chapter-2"
          headings={sidebarChapters[1]!.headings}
          activeSectionId="filing"
          onSectionJump={onSectionJump}
        />
      </MemoryRouter>
    );

    const outline = screen.getByRole("heading", { name: "이 장의 섹션 목차" }).closest("section");

    expect(outline).not.toBeNull();

    const riskLink = within(outline as HTMLElement).getByRole("link", { name: "리스크" });

    expect(riskLink).toHaveAttribute("href", "/latam/chapter/chapter-2#filing-risk");

    await user.click(riskLink);

    expect(onSectionJump).toHaveBeenCalledWith("filing-risk");
  });
});

describe("MarkdownArticle", () => {
  it("normalizes official external links with safe attributes", async () => {
    render(
      <MemoryRouter initialEntries={["/latam/chapter/chapter-2"]}>
        <MarkdownArticle
          chapter={{
            ...sidebarChapters[1]!,
            html: '<p><a href="https://example.com/guide">공식 가이드</a></p>'
          }}
        />
      </MemoryRouter>
    );

    const externalLink = screen.getByRole("link", { name: "공식 가이드" });

    await waitFor(() => {
      expect(externalLink).toHaveAttribute("target", "_blank");
      expect(externalLink).toHaveAttribute("rel", "noreferrer noopener");
    });
  });

  it("routes internal article links through the SPA contract", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/latam/chapter/chapter-2"]}>
        <MarkdownArticle
          chapter={{
            ...sidebarChapters[1]!,
            html: '<p><a href="/latam/chapter/chapter-1#overview">개요로 이동</a></p>'
          }}
        />
        <LocationProbe />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("link", { name: "개요로 이동" }));

    await waitFor(() => {
      expect(screen.getByTestId("component-location")).toHaveTextContent(
        "/latam/chapter/chapter-1#overview"
      );
    });
  });

  it("renders wide-table scroll buttons and syncs their state with viewport overflow", async () => {
    const restoreResizeObserver = stubResizeObserverForTest(undefined);

    try {
      render(
        <MemoryRouter initialEntries={["/latam/chapter/chapter-2"]}>
          <MarkdownArticle
            chapter={{
              ...sidebarChapters[1]!,
              html: createWideTableHtml()
            }}
          />
        </MemoryRouter>
      );

      const root = document.querySelector<HTMLElement>("[data-table-scroll-root]");
      const viewport = document.querySelector<HTMLElement>("[data-table-scroll-viewport]");
      const leftButton = screen.getByRole("button", { name: "표를 왼쪽으로 스크롤" });
      const rightButton = screen.getByRole("button", { name: "표를 오른쪽으로 스크롤" });

      expect(root).not.toBeNull();
      expect(viewport).not.toBeNull();

      const metrics = {
        clientWidth: 400,
        scrollWidth: 900,
        scrollLeft: 0
      };

      mockViewportMetrics(viewport!, metrics);
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(root).toHaveAttribute("data-has-overflow", "true");
        expect(root).toHaveAttribute("data-can-scroll-left", "false");
        expect(root).toHaveAttribute("data-can-scroll-right", "true");
        expect(leftButton).toBeDisabled();
        expect(rightButton).not.toBeDisabled();
      });

      metrics.scrollLeft = 500;
      viewport!.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(root).toHaveAttribute("data-can-scroll-left", "true");
        expect(root).toHaveAttribute("data-can-scroll-right", "false");
        expect(leftButton).not.toBeDisabled();
        expect(rightButton).toBeDisabled();
      });

      metrics.scrollWidth = 400;
      metrics.scrollLeft = 0;
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(root).toHaveAttribute("data-has-overflow", "false");
        expect(leftButton).toBeDisabled();
        expect(rightButton).toBeDisabled();
      });
    } finally {
      restoreResizeObserver();
    }
  });

  it("scrolls the nearest wide-table viewport when the control buttons are clicked", async () => {
    const restoreResizeObserver = stubResizeObserverForTest(undefined);
    const user = userEvent.setup();

    try {
      render(
        <MemoryRouter initialEntries={["/latam/chapter/chapter-2"]}>
          <MarkdownArticle
            chapter={{
              ...sidebarChapters[1]!,
              html: createWideTableHtml()
            }}
          />
        </MemoryRouter>
      );

      const viewport = document.querySelector<HTMLElement>("[data-table-scroll-viewport]");

      expect(viewport).not.toBeNull();

      const metrics = {
        clientWidth: 400,
        scrollWidth: 900,
        scrollLeft: 200
      };

      mockViewportMetrics(viewport!, metrics);

      const scrollBy = vi.fn();
      Object.defineProperty(viewport!, "scrollBy", {
        configurable: true,
        value: scrollBy
      });

      window.dispatchEvent(new Event("resize"));

      const leftButton = screen.getByRole("button", { name: "표를 왼쪽으로 스크롤" });
      const rightButton = screen.getByRole("button", { name: "표를 오른쪽으로 스크롤" });

      await waitFor(() => {
        expect(leftButton).not.toBeDisabled();
        expect(rightButton).not.toBeDisabled();
      });

      await user.click(rightButton);
      await user.click(leftButton);

      expect(scrollBy).toHaveBeenNthCalledWith(1, {
        left: 288,
        behavior: "smooth"
      });
      expect(scrollBy).toHaveBeenNthCalledWith(2, {
        left: -288,
        behavior: "smooth"
      });
    } finally {
      restoreResizeObserver();
    }
  });
});
