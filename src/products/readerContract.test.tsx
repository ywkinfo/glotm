import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  ChinaChapterPage,
  ChinaHomePage,
  ChinaReaderRoot
} from "./china";
import {
  EuropeChapterPage,
  EuropeHomePage,
  EuropeReaderRoot
} from "./europe";
import {
  JapanChapterPage,
  JapanHomePage,
  JapanReaderRoot
} from "./japan";
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
import type { DocumentData, SearchEntry } from "./shared";

const operatorProfileUrl = "https://ywkinfo.github.io";

type OptionalUkModule = {
  UkChapterPage: typeof LatamChapterPage;
  UkHomePage: typeof LatamHomePage;
  UkReaderRoot: typeof LatamReaderRoot;
};

const ukModulePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "uk.tsx"
);
const ukImportPath = "./uk";
const ukModule = existsSync(ukModulePath)
  ? (await import(/* @vite-ignore */ ukImportPath)) as OptionalUkModule
  : null;

type ReaderCase = {
  name: string;
  workspaceName: string;
  productSlug: string;
  basePath: string;
  crossLinkLabel: string;
  crossLinkHref: string;
  storageKey: string;
  homeHeading: string;
  ReaderRoot: typeof LatamReaderRoot;
  HomePage: typeof LatamHomePage;
  ChapterPage: typeof LatamChapterPage;
  documentData: DocumentData;
  firstChapterSlug: string;
  firstChapterTitle: string;
  targetChapterSlug: string;
  targetChapterTitle: string;
  targetSectionId: string;
  targetSectionTitle: string;
  alternateSectionId: string;
  alternateSectionTitle: string;
  thirdChapterSlug: string;
  thirdChapterTitle: string;
  bookmarkChapterSlug: string;
  bookmarkChapterTitle: string;
  bookmarkSectionId: string;
  bookmarkSectionTitle: string;
};

function createReaderDocumentData(config: {
  title: string;
  firstChapterSlug: string;
  firstChapterTitle: string;
  secondChapterSlug: string;
  secondChapterTitle: string;
  thirdChapterSlug: string;
  thirdChapterTitle: string;
}) {
  return {
    meta: {
      title: config.title,
      builtAt: "2026-03-28T00:00:00.000Z",
      chapterCount: 3
    },
    chapters: [
      {
        id: `${config.firstChapterSlug}-1`,
        slug: config.firstChapterSlug,
        title: config.firstChapterTitle,
        summary: `${config.firstChapterTitle} 요약`,
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
        id: `${config.secondChapterSlug}-2`,
        slug: config.secondChapterSlug,
        title: config.secondChapterTitle,
        summary: `${config.secondChapterTitle} 요약`,
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
        id: `${config.thirdChapterSlug}-3`,
        slug: config.thirdChapterSlug,
        title: config.thirdChapterTitle,
        summary: `${config.thirdChapterTitle} 요약`,
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
  } satisfies DocumentData;
}

const readerCases: ReaderCase[] = [
  {
    name: "Latam",
    workspaceName: "LatTm",
    productSlug: "latam",
    basePath: "/latam",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "lattm_reading_bookmark",
    homeHeading: "중남미 상표 보호 운영 가이드",
    ReaderRoot: LatamReaderRoot,
    HomePage: LatamHomePage,
    ChapterPage: LatamChapterPage,
    documentData: createReaderDocumentData({
      title: "중남미 상표 보호 운영 가이드",
      firstChapterSlug: "strategy-frame",
      firstChapterTitle: "제1장. 전략 프레임",
      secondChapterSlug: "filing-route",
      secondChapterTitle: "제4장. 출원 경로 선택",
      thirdChapterSlug: "enforcement",
      thirdChapterTitle: "제11장. Enforcement"
    }),
    firstChapterSlug: "strategy-frame",
    firstChapterTitle: "제1장. 전략 프레임",
    targetChapterSlug: "filing-route",
    targetChapterTitle: "제4장. 출원 경로 선택",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "enforcement",
    thirdChapterTitle: "제11장. Enforcement",
    bookmarkChapterSlug: "enforcement",
    bookmarkChapterTitle: "제11장. Enforcement",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Mexico",
    workspaceName: "MexTm",
    productSlug: "mexico",
    basePath: "/mexico",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "mextm_reading_bookmark",
    homeHeading: "멕시코 상표 실무 운영 가이드북",
    ReaderRoot: MexicoReaderRoot,
    HomePage: MexicoHomePage,
    ChapterPage: MexicoChapterPage,
    documentData: createReaderDocumentData({
      title: "멕시코 상표 실무 운영 가이드북",
      firstChapterSlug: "mexico-overview",
      firstChapterTitle: "멕시코 제1장. 제도 개요",
      secondChapterSlug: "mexico-filing",
      secondChapterTitle: "멕시코 제2장. 출원 전략",
      thirdChapterSlug: "mexico-enforcement",
      thirdChapterTitle: "멕시코 제3장. 집행 운영"
    }),
    firstChapterSlug: "mexico-overview",
    firstChapterTitle: "멕시코 제1장. 제도 개요",
    targetChapterSlug: "mexico-filing",
    targetChapterTitle: "멕시코 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "mexico-enforcement",
    thirdChapterTitle: "멕시코 제3장. 집행 운영",
    bookmarkChapterSlug: "mexico-enforcement",
    bookmarkChapterTitle: "멕시코 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Usa",
    workspaceName: "UsaTm",
    productSlug: "usa",
    basePath: "/usa",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "usatm_reading_bookmark",
    homeHeading: "미국 상표 실무 운영 가이드북",
    ReaderRoot: UsaReaderRoot,
    HomePage: UsaHomePage,
    ChapterPage: UsaChapterPage,
    documentData: createReaderDocumentData({
      title: "미국 상표 실무 운영 가이드북",
      firstChapterSlug: "us-overview",
      firstChapterTitle: "미국 제1장. 제도 개요",
      secondChapterSlug: "us-filing",
      secondChapterTitle: "미국 제2장. 출원 전략",
      thirdChapterSlug: "us-enforcement",
      thirdChapterTitle: "미국 제3장. 집행 운영"
    }),
    firstChapterSlug: "us-overview",
    firstChapterTitle: "미국 제1장. 제도 개요",
    targetChapterSlug: "us-filing",
    targetChapterTitle: "미국 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "us-enforcement",
    thirdChapterTitle: "미국 제3장. 집행 운영",
    bookmarkChapterSlug: "us-enforcement",
    bookmarkChapterTitle: "미국 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Japan",
    workspaceName: "JapTm",
    productSlug: "japan",
    basePath: "/japan",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "japtm_reading_bookmark",
    homeHeading: "일본 상표 실무 운영 가이드북",
    ReaderRoot: JapanReaderRoot,
    HomePage: JapanHomePage,
    ChapterPage: JapanChapterPage,
    documentData: createReaderDocumentData({
      title: "일본 상표 실무 운영 가이드북",
      firstChapterSlug: "japan-overview",
      firstChapterTitle: "일본 제1장. 제도 개요",
      secondChapterSlug: "japan-filing",
      secondChapterTitle: "일본 제2장. 출원 전략",
      thirdChapterSlug: "japan-enforcement",
      thirdChapterTitle: "일본 제3장. 집행 운영"
    }),
    firstChapterSlug: "japan-overview",
    firstChapterTitle: "일본 제1장. 제도 개요",
    targetChapterSlug: "japan-filing",
    targetChapterTitle: "일본 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "japan-enforcement",
    thirdChapterTitle: "일본 제3장. 집행 운영",
    bookmarkChapterSlug: "japan-enforcement",
    bookmarkChapterTitle: "일본 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "China",
    workspaceName: "ChaTm",
    productSlug: "china",
    basePath: "/china",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "chatm_reading_bookmark",
    homeHeading: "중국 상표 실무 운영 가이드",
    ReaderRoot: ChinaReaderRoot,
    HomePage: ChinaHomePage,
    ChapterPage: ChinaChapterPage,
    documentData: createReaderDocumentData({
      title: "중국 상표 실무 운영 가이드",
      firstChapterSlug: "china-overview",
      firstChapterTitle: "중국 제1장. 제도 개요",
      secondChapterSlug: "china-filing",
      secondChapterTitle: "중국 제2장. 출원 전략",
      thirdChapterSlug: "china-enforcement",
      thirdChapterTitle: "중국 제3장. 집행 운영"
    }),
    firstChapterSlug: "china-overview",
    firstChapterTitle: "중국 제1장. 제도 개요",
    targetChapterSlug: "china-filing",
    targetChapterTitle: "중국 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "china-enforcement",
    thirdChapterTitle: "중국 제3장. 집행 운영",
    bookmarkChapterSlug: "china-enforcement",
    bookmarkChapterTitle: "중국 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  {
    name: "Europe",
    workspaceName: "EuTm",
    productSlug: "europe",
    basePath: "/europe",
    crossLinkLabel: "LatTm",
    crossLinkHref: "/latam",
    storageKey: "eutm_reading_bookmark",
    homeHeading: "EuTm 유럽 상표 운영 가이드북",
    ReaderRoot: EuropeReaderRoot,
    HomePage: EuropeHomePage,
    ChapterPage: EuropeChapterPage,
    documentData: createReaderDocumentData({
      title: "EuTm 유럽 상표 운영 가이드북",
      firstChapterSlug: "europe-overview",
      firstChapterTitle: "유럽 제1장. 제도 개요",
      secondChapterSlug: "europe-filing",
      secondChapterTitle: "유럽 제2장. 출원 전략",
      thirdChapterSlug: "europe-enforcement",
      thirdChapterTitle: "유럽 제3장. 집행 운영"
    }),
    firstChapterSlug: "europe-overview",
    firstChapterTitle: "유럽 제1장. 제도 개요",
    targetChapterSlug: "europe-filing",
    targetChapterTitle: "유럽 제2장. 출원 전략",
    targetSectionId: "filing",
    targetSectionTitle: "출원 전략",
    alternateSectionId: "filing-risk",
    alternateSectionTitle: "리스크",
    thirdChapterSlug: "europe-enforcement",
    thirdChapterTitle: "유럽 제3장. 집행 운영",
    bookmarkChapterSlug: "europe-enforcement",
    bookmarkChapterTitle: "유럽 제3장. 집행 운영",
    bookmarkSectionId: "monitoring",
    bookmarkSectionTitle: "모니터링"
  },
  ...(
    ukModule
      ? [{
          name: "Uk",
          workspaceName: "UKTm",
          productSlug: "uk",
          basePath: "/uk",
          crossLinkLabel: "EuTm",
          crossLinkHref: "/europe",
          storageKey: "uktm_reading_bookmark",
          homeHeading: "영국 상표 실무 운영 가이드북",
          ReaderRoot: ukModule.UkReaderRoot,
          HomePage: ukModule.UkHomePage,
          ChapterPage: ukModule.UkChapterPage,
          documentData: createReaderDocumentData({
            title: "영국 상표 실무 운영 가이드북",
            firstChapterSlug: "uk-overview",
            firstChapterTitle: "영국 제1장. 제도 개요",
            secondChapterSlug: "uk-filing",
            secondChapterTitle: "영국 제2장. 출원 전략",
            thirdChapterSlug: "uk-enforcement",
            thirdChapterTitle: "영국 제3장. 집행 운영"
          }),
          firstChapterSlug: "uk-overview",
          firstChapterTitle: "영국 제1장. 제도 개요",
          targetChapterSlug: "uk-filing",
          targetChapterTitle: "영국 제2장. 출원 전략",
          targetSectionId: "filing",
          targetSectionTitle: "출원 전략",
          alternateSectionId: "filing-risk",
          alternateSectionTitle: "리스크",
          thirdChapterSlug: "uk-enforcement",
          thirdChapterTitle: "영국 제3장. 집행 운영",
          bookmarkChapterSlug: "uk-enforcement",
          bookmarkChapterTitle: "영국 제3장. 집행 운영",
          bookmarkSectionId: "monitoring",
          bookmarkSectionTitle: "모니터링"
        } satisfies ReaderCase]
      : []
  )
];

const latamCase = readerCases[0]!;
const configuredReaderCases = readerCases.filter((readerCase) => readerCase.name !== "Latam");

function createSearchEntries(readerCase: ReaderCase): SearchEntry[] {
  return [
    {
      id: `${readerCase.name}-monitoring`,
      chapterSlug: readerCase.thirdChapterSlug,
      chapterTitle: readerCase.thirdChapterTitle,
      sectionId: readerCase.bookmarkSectionId,
      sectionTitle: readerCase.bookmarkSectionTitle,
      text: `${readerCase.bookmarkSectionTitle} 대응 흐름`,
      excerpt: `${readerCase.bookmarkSectionTitle} 대응 흐름`
    }
  ];
}

function installFetchMock() {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const readerCase = readerCases.find(
      (entry) => url.includes(entry.workspaceName) || url.includes(`/generated/${entry.productSlug}/`)
    );

    if (!readerCase) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    if (url.includes("document-data")) {
      return new Response(JSON.stringify(readerCase.documentData), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    if (url.includes("search-index")) {
      return new Response(JSON.stringify(createSearchEntries(readerCase)), {
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

function LocationProbe() {
  const location = useLocation();

  return (
    <output data-testid="reader-location">
      {location.pathname}
      {location.hash}
    </output>
  );
}

function renderReaderCase(
  readerCase: ReaderCase,
  initialEntry: string,
  extraCases: ReaderCase[] = []
) {
  const cases = [readerCase, ...extraCases.filter((entry) => entry.basePath !== readerCase.basePath)];

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        {cases.map((entry) => {
          const ReaderRootComponent = entry.ReaderRoot;
          const HomePageComponent = entry.HomePage;
          const ChapterPageComponent = entry.ChapterPage;

          return (
            <Route key={entry.basePath} path={entry.basePath} element={<ReaderRootComponent />}>
              <Route index element={<HomePageComponent />} />
              <Route path="chapter/:chapterSlug" element={<ChapterPageComponent />} />
            </Route>
          );
        })}
      </Routes>
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("Shared reader runtime contract", () => {
  it.each(readerCases)(
    "renders home chapter-card link contracts for $name",
    async (readerCase) => {
      installFetchMock();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      const chapterCard = screen
        .getByText(readerCase.firstChapterTitle, { selector: ".chapter-card-title" })
        .closest("a");

      expect(chapterCard).not.toBeNull();
      expect(chapterCard).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.firstChapterSlug}`
      );
    }
  );

  it.each(readerCases)(
    "restores continue-reading link contracts for $name",
    async (readerCase) => {
      installFetchMock();
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

      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      const continueCard = screen.getByText("Continue Reading").closest("section");

      expect(continueCard).not.toBeNull();
      expect(within(continueCard as HTMLElement).getByRole("link", { name: "이어 읽기" })).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.bookmarkChapterSlug}#${readerCase.bookmarkSectionId}`
      );
    }
  );

  it.each(readerCases)(
    "navigates from search results into chapter hash routes for $name",
    async (readerCase) => {
      const user = userEvent.setup();

      installFetchMock();
      installNavigationMocks();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      const input = screen.getByRole("combobox", { name: "검색" });
      await user.click(input);
      await user.type(input, readerCase.bookmarkSectionTitle);

      const option = await screen.findByRole("option", { name: new RegExp(readerCase.bookmarkSectionTitle) });
      await user.click(option);

      await screen.findByRole("heading", { name: readerCase.bookmarkChapterTitle });
      await waitFor(() => {
        expect(screen.getByTestId("reader-location")).toHaveTextContent(
          `${readerCase.basePath}/chapter/${readerCase.bookmarkChapterSlug}#${readerCase.bookmarkSectionId}`
        );
      });
    }
  );

  it.each(configuredReaderCases)(
    "keeps the configured inline cross-link on $name home aligned with the registry path",
    async (readerCase) => {
      installFetchMock();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      expect(screen.getByRole("link", { name: readerCase.crossLinkLabel })).toHaveAttribute(
        "href",
        readerCase.crossLinkHref
      );
    }
  );

  it.each([
    {
      readerCase: readerCases.find((readerCase) => readerCase.productSlug === "china")!,
      expectedSummary: "중문 표기, 상품·서비스 적합성, 권리자 구성이 직접출원 쪽으로 기우는지부터 보고 출원 경로 메모를 정리합니다."
    },
    {
      readerCase: readerCases.find((readerCase) => readerCase.productSlug === "mexico")!,
      expectedSummary: "멕시코의 실행 흐름과 혼합 경로 기준으로, 현지 실행 통제가 묶음 효율보다 먼저인지 정리합니다."
    },
    {
      readerCase: readerCases.find((readerCase) => readerCase.productSlug === "europe")!,
      expectedSummary: "권역형 가이드답게 누가 출원 기준을 정하고, 출원 뒤 증거 관리까지 어떻게 이어지는지 먼저 확인합니다."
    }
  ])(
    "surfaces trust-layer report handoffs on $readerCase.name home without breaking base reader contracts",
    async ({ readerCase, expectedSummary }) => {
      installFetchMock();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      const handoffSection = screen.getByRole("region", { name: "관련 Report / Trust Layer" });

      expect(within(handoffSection).getByRole("link", { name: "Front Report 보기" })).toHaveAttribute(
        "href",
        "/reports/global-filing-route-framework"
      );
      expect(within(handoffSection).getByRole("link", { name: "Supporting Report 보기" })).toHaveAttribute(
        "href",
        "/reports/global-use-evidence-system"
      );
      expect(within(handoffSection).getByText(expectedSummary)).toBeInTheDocument();
    }
  );

  it.each(
    readerCases.filter((readerCase) => !["china", "mexico", "europe"].includes(readerCase.productSlug))
  )(
    "does not show trust-layer handoffs on non-priority $name home",
    async (readerCase) => {
      installFetchMock();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      expect(screen.queryByRole("heading", { name: "관련 Report / Trust Layer" })).toBeNull();
    }
  );

  it.each(readerCases)(
    "renders the operator profile note ahead of the legal disclaimer for $name",
    async (readerCase) => {
      installFetchMock();
      renderReaderCase(readerCase, readerCase.basePath);

      await screen.findByRole("heading", { name: readerCase.homeHeading });

      const profileNote = screen.getByText(/운영자 소개·문의·강연 요청·심층 연구 안내:/);
      const profileLink = within(profileNote).getByRole("link", { name: "ywkinfo.github.io" });
      const disclaimer = screen.getByText(/법적 고지:/);

      expect(profileLink).toHaveAttribute("href", operatorProfileUrl);
      expect(profileLink).toHaveAttribute("target", "_blank");
      expect(profileLink).toHaveAttribute("rel", "noreferrer noopener");
      expect(
        profileNote.compareDocumentPosition(disclaimer) & Node.DOCUMENT_POSITION_FOLLOWING
      ).not.toBe(0);
    }
  );

  it("filters LatTm home cards through the finder and resets back to the full catalog", async () => {
    const user = userEvent.setup();

    installFetchMock();
    renderReaderCase(latamCase, latamCase.basePath);

    await screen.findByRole("heading", { name: latamCase.homeHeading });

    await user.click(screen.getByRole("button", { name: "전략" }));
    expect(screen.getByRole("link", { name: /제1장. 전략 프레임/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /제11장. Enforcement/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "전체 보기" }));
    expect(screen.getByRole("link", { name: /제11장. Enforcement/ })).toBeInTheDocument();
  });

  it.each(readerCases)(
    "boots deep chapter routes and preserves navigation contracts for $name",
    async (readerCase) => {
      installFetchMock();
      const scrollIntoViewMock = installNavigationMocks();

      renderReaderCase(
        readerCase,
        `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.targetSectionId}`
      );

      await screen.findByRole(
        "heading",
        { name: readerCase.targetChapterTitle },
        { timeout: 10000 }
      );
      await waitFor(() => {
        expect(document.title).toBe(`${readerCase.targetChapterTitle} | GloTm`);
      });
      await waitFor(() => {
        expect(screen.getByTestId("reader-location")).toHaveTextContent(
          `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.targetSectionId}`
        );
      });
      expect(scrollIntoViewMock).toHaveBeenCalled();

      const sidebar = document.querySelector(".sidebar-nav");
      const outline = screen.getByRole("heading", { name: "이 장의 섹션 목차" }).closest("section");
      const prevLink = screen.getByRole("link", { name: /이전/ });
      const nextLink = screen.getByRole("link", { name: /다음/ });

      expect(sidebar).not.toBeNull();
      expect(outline).not.toBeNull();
      const sectionList = (sidebar as HTMLElement).querySelector(".sidebar-section-list");
      expect(sectionList).not.toBeNull();
      const sidebarSectionLink = within(sectionList as HTMLElement)
        .getByText(readerCase.alternateSectionTitle)
        .closest("a");

      expect(sidebarSectionLink).not.toBeNull();
      expect(sidebarSectionLink).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.alternateSectionId}`
      );
      expect(
        within(outline as HTMLElement).getByRole("link", { name: readerCase.alternateSectionTitle })
      ).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.alternateSectionId}`
      );
      expect(prevLink).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.firstChapterSlug}`
      );
      expect(nextLink).toHaveAttribute(
        "href",
        `${readerCase.basePath}/chapter/${readerCase.thirdChapterSlug}`
      );
    }
  );

  it.each(readerCases)(
    "redirects invalid chapter slugs back to the product home for $name",
    async (readerCase) => {
      installFetchMock();
      installNavigationMocks();
      const escapedBasePath = readerCase.basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      renderReaderCase(readerCase, `${readerCase.basePath}/chapter/missing-chapter`);

      await waitFor(() => {
        expect(screen.getByTestId("reader-location")).toHaveTextContent(
          new RegExp(`^${escapedBasePath}$`)
        );
      });
      expect(
        screen.getByRole("link", { name: readerCase.homeHeading })
      ).toHaveAttribute("href", readerCase.basePath);
    }
  );

  it.each([latamCase, readerCases[1]!])(
    "handles in-chapter section hash clicks without runtime loops for $name",
    async (readerCase) => {
      const user = userEvent.setup();
      const scrollIntoViewMock = installNavigationMocks();
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      installFetchMock();
      renderReaderCase(
        readerCase,
        `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}`
      );

      await screen.findByRole("heading", { name: readerCase.targetChapterTitle });

      await user.click(screen.getByRole("link", { name: readerCase.alternateSectionTitle }));

      await waitFor(() => {
        expect(screen.getByTestId("reader-location")).toHaveTextContent(
          `${readerCase.basePath}/chapter/${readerCase.targetChapterSlug}#${readerCase.alternateSectionId}`
        );
      });
      expect(scrollIntoViewMock).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("Maximum update depth exceeded")
      );

      consoleErrorSpy.mockRestore();
    }
  );

});
