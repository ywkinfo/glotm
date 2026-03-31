import { describe, expect, it, vi } from "vitest";

import {
  buildProductPath,
  buildSectionLocation,
  buildChapterPath,
  buildGeneratedContentUrl,
  buildRuntimeDocumentTitle,
  createReadingBookmarkStorage,
    createSearchController,
    filterCatalogChapters,
    getRouterBasename,
    getAdjacentChapters,
    getChapterStage,
    getTrackedSectionId,
    normalizeAppHref,
  type Chapter,
  type SearchEntry
} from "./shared";

function createChapter(overrides: Partial<Chapter> = {}): Chapter {
  return {
    id: overrides.id ?? "chapter-1",
    slug: overrides.slug ?? "chapter-1",
    title: overrides.title ?? "제1장. 전략 프레임",
    summary: overrides.summary ?? "중남미 파일럿 전략을 정리합니다.",
    html: overrides.html ?? "<p>전략 프레임 본문</p>",
    headings: overrides.headings ?? [],
    ...overrides
  };
}

function createSearchEntry(overrides: Partial<SearchEntry> = {}): SearchEntry {
  return {
    id: overrides.id ?? "entry-1",
    chapterSlug: overrides.chapterSlug ?? "chapter-1",
    chapterTitle: overrides.chapterTitle ?? "제1장. 전략 프레임",
    sectionId: overrides.sectionId ?? "section-1",
    sectionTitle: overrides.sectionTitle ?? "전략 개요",
    text: overrides.text ?? "전략 프레임과 운영 리스크를 설명합니다.",
    excerpt: overrides.excerpt ?? "전략 프레임과 운영 리스크를 설명합니다.",
    ...overrides
  };
}

describe("shared product helpers", () => {
  it("builds product chapter paths without changing the slug", () => {
    expect(buildProductPath("/")).toBe("/");
    expect(buildProductPath("/latam/")).toBe("/latam");
    expect(buildChapterPath("/latam", "제01장-전략-프레임")).toBe("/latam/chapter/제01장-전략-프레임");
    expect(buildChapterPath("/mexico/", "capitulo-01")).toBe("/mexico/chapter/capitulo-01");
    expect(buildSectionLocation("/mexico/", "capitulo-01", "overview")).toEqual({
      pathname: "/mexico/chapter/capitulo-01",
      hash: "#overview"
    });
  });

  it("normalizes router basename and app hrefs for subpath deployments", () => {
    expect(getRouterBasename("/glotm/")).toBe("/glotm");
    expect(buildGeneratedContentUrl("latam", "document-data.json", "/glotm/")).toBe(
      "/glotm/generated/latam/document-data.json"
    );
    expect(buildGeneratedContentUrl("latam", "search-index.json", "/")).toBe(
      "/generated/latam/search-index.json"
    );
    expect(getRouterBasename("/")).toBeUndefined();
    expect(
      normalizeAppHref("https://example.com/glotm/latam/chapter/strategy#overview", {
        baseUrl: "/glotm/",
        currentOrigin: "https://example.com",
        currentPathname: "/glotm/latam"
      })
    ).toBe("/latam/chapter/strategy#overview");
    expect(
      normalizeAppHref("/glotm/mexico/chapter/filing#risk", {
        baseUrl: "/glotm/",
        currentOrigin: "https://example.com",
        currentPathname: "/glotm/latam"
      })
    ).toBe("/mexico/chapter/filing#risk");
    expect(
      normalizeAppHref("#overview", {
        baseUrl: "/glotm/",
        currentOrigin: "https://example.com",
        currentPathname: "/glotm/latam"
      })
    ).toBe("#overview");
    expect(
      normalizeAppHref("/glotm/latam/chapter/enforcement#%EB%A7%88%EC%A7%80%EB%A7%89%EC%9C%BC%EB%A1%9C", {
        baseUrl: "/glotm/",
        currentOrigin: "https://example.com",
        currentPathname: "/glotm/latam"
      })
    ).toBe("/latam/chapter/enforcement#%EB%A7%88%EC%A7%80%EB%A7%89%EC%9C%BC%EB%A1%9C");
    expect(
      normalizeAppHref("https://outside.example/path", {
        baseUrl: "/glotm/",
        currentOrigin: "https://example.com",
        currentPathname: "/glotm/latam"
      })
    ).toBeNull();
  });

  it("builds runtime document titles for gateway and product pages", () => {
    expect(buildRuntimeDocumentTitle()).toBe("GloTm | 글로벌 상표 지식베이스");
    expect(buildRuntimeDocumentTitle("중남미 상표 보호 운영 가이드")).toBe(
      "중남미 상표 보호 운영 가이드 | GloTm"
    );
  });

  it("filters LatTm catalog chapters by summary and heading matches", () => {
    const chapters = [
      createChapter({
        id: "latam-strategy",
        slug: "latam-strategy",
        title: "제1장. 전략 프레임",
        summary: "우선 국가와 포트폴리오 기준을 정리합니다.",
        headings: [
          {
            id: "country-priority",
            depth: 3,
            title: "국가 우선순위",
            children: []
          }
        ]
      }),
      createChapter({
        id: "latam-evidence",
        slug: "latam-evidence",
        title: "제8장. 사용 증거 관리",
        summary: "사용 자료와 증거 보전 체계를 다룹니다.",
        headings: [
          {
            id: "evidence-control",
            depth: 3,
            title: "증거 보전",
            children: []
          }
        ]
      })
    ];

    expect(filterCatalogChapters(chapters, "").map((entry) => entry.chapter.slug)).toEqual([
      "latam-strategy",
      "latam-evidence"
    ]);
    expect(filterCatalogChapters(chapters, "증거").map((entry) => entry.chapter.slug)).toEqual([
      "latam-evidence"
    ]);
    expect(filterCatalogChapters(chapters, "국가 우선순위")[0]?.match.matchedHeadingTitle).toBe(
      "국가 우선순위"
    );
  });

  it("returns previous and next chapters for reader navigation", () => {
    const chapters = [
      createChapter({ id: "chapter-1", slug: "chapter-1", title: "제1장. 전략 프레임" }),
      createChapter({ id: "chapter-2", slug: "chapter-2", title: "제2장. 포트폴리오 설계" }),
      createChapter({ id: "chapter-3", slug: "chapter-3", title: "제3장. 검색·충돌 분석" })
    ];

    expect(getAdjacentChapters(chapters, "chapter-2")).toMatchObject({
      currentIndex: 1,
      prevChapter: { slug: "chapter-1" },
      nextChapter: { slug: "chapter-3" }
    });
    expect(getAdjacentChapters(chapters, "missing")).toEqual({
      currentIndex: -1,
      prevChapter: null,
      nextChapter: null
    });
  });

  it("tracks the section nearest the reading threshold", () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    const first = document.createElement("h2");
    const second = document.createElement("h2");

    first.id = "first";
    second.id = "second";
    first.getBoundingClientRect = () => ({ top: 220 } as DOMRect);
    second.getBoundingClientRect = () => ({ top: 560 } as DOMRect);

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900
    });

    try {
      expect(getTrackedSectionId([first, second])).toBe("first");
    } finally {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: originalInnerWidth
      });
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: originalInnerHeight
      });
    }
  });

  it("treats chapter 20 and later as appendix until the stage map expands", () => {
    expect(getChapterStage("제19장. 운영 시스템 구축 가이드")).toEqual({
      key: "operations",
      label: "운영 체계"
    });
    expect(getChapterStage("제20장. 후속 확장")).toEqual({
      key: "appendix",
      label: "부록"
    });
  });

  it("falls back safely when bookmark storage contains invalid JSON", () => {
    const storage = createReadingBookmarkStorage("bookmark-invalid");
    window.localStorage.setItem("bookmark-invalid", "{broken json");

    expect(storage.loadReadingBookmark()).toBeNull();
  });

  it("round-trips a valid reading bookmark", () => {
    const storage = createReadingBookmarkStorage("bookmark-valid");

    storage.saveReadingBookmark({
      chapterSlug: "제8장-사용-증거",
      chapterTitle: "제8장. 사용 증거 관리",
      sectionId: "증거-보전",
      sectionTitle: "증거 보전",
      progress: 55,
      updatedAt: "2026-03-28T00:00:00.000Z"
    });

    expect(storage.loadReadingBookmark()).toEqual({
      chapterSlug: "제8장-사용-증거",
      chapterTitle: "제8장. 사용 증거 관리",
      sectionId: "증거-보전",
      sectionTitle: "증거 보전",
      progress: 55,
      updatedAt: "2026-03-28T00:00:00.000Z"
    });
  });

  it("merges indexed and fallback search results without duplicates and caps the list", async () => {
    const searchEntries = [
      createSearchEntry({
        id: "fallback-only",
        chapterSlug: "post-registration",
        chapterTitle: "Post Registration",
        sectionTitle: "운영 개요",
        text: "등록 후 운영을 정리합니다.",
        excerpt: "등록 후 운영"
      }),
      createSearchEntry({
        id: "dedupe-entry",
        chapterSlug: "operating-risk",
        chapterTitle: "Operating Risk",
        sectionTitle: "운영 리스크",
        text: "운영 리스크와 분쟁 통제를 정리합니다.",
        excerpt: "운영 리스크"
      }),
      ...Array.from({ length: 30 }, (_, index) =>
        createSearchEntry({
          id: `limit-${index}`,
          chapterSlug: `limit-${index}`,
          chapterTitle: `Risk ${index}`,
          sectionTitle: "리스크",
          text: `limit token ${index} 리스크 통제 운영`,
          excerpt: `limit token ${index}`
        })
      )
    ];
    const loadSearchEntries = vi.fn().mockResolvedValue(searchEntries);
    const controller = createSearchController(loadSearchEntries);

    const fallbackResults = await controller.searchContent("st reg");
    const dedupedResults = await controller.searchContent("operating");
    const limitedResults = await controller.searchContent("limit");

    expect(loadSearchEntries).toHaveBeenCalledTimes(1);
    expect(fallbackResults.some((entry) => entry.id === "fallback-only")).toBe(true);
    expect(dedupedResults.filter((entry) => entry.id === "dedupe-entry")).toHaveLength(1);
    expect(limitedResults).toHaveLength(24);
  });
});
