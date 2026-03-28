import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchPanel } from "./components";
import type { SearchEntry } from "./shared";

const searchResult: SearchEntry = {
  id: "mx-result",
  chapterSlug: "mexico-operating",
  chapterTitle: "멕시코 운영 가이드",
  sectionId: "impi-response",
  sectionTitle: "IMPI 대응",
  text: "IMPI 거절이유와 대응 전략을 설명합니다.",
  excerpt: "IMPI 거절이유와 대응 전략"
};

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
