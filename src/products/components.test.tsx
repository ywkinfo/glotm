import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ReaderActionBar, SearchPanel, SidebarNav } from "./components";
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
});

describe("ReaderActionBar", () => {
  it("shows the current section and keeps only the scroll-to-top action", async () => {
    const user = userEvent.setup();
    const onScrollToTop = vi.fn();
    const onCopyLink = vi.fn();

    render(
      <ReaderActionBar
        activeSectionTitle="부서별 책임 배분"
        copyState="idle"
        onCopyLink={onCopyLink}
        onScrollToTop={onScrollToTop}
        visible
      />
    );

    expect(screen.getByText("부서별 책임 배분")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "현재 위치 링크" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "맨 위로" }));

    expect(onScrollToTop).toHaveBeenCalledTimes(1);
    expect(onCopyLink).not.toHaveBeenCalled();
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
