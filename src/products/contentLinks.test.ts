import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { briefIssues } from "../briefs/archive";
import { reports } from "../reports/registry";
import { liveShellProducts } from "./registry";
import type { DocumentData } from "./shared";

const generatedProducts = liveShellProducts
  .map((product) => product.shortLabel)
  .filter((productName) =>
    existsSync(path.resolve(process.cwd(), productName, "content/generated/document-data.json"))
  );

// Reports는 liveShellProducts에 없고 생성물 경로도 `Reports/generated/<slug>/`로 달라서,
// 위 가이드 목록만 도는 검사에서 구조적으로 빠져 있었다(2026-08-02 라이브 404 17건의 원인).
// 같은 앵커 규칙을 받도록 별도 목록으로 편입한다.
const generatedReportSlugs = reports
  .map((report) => report.slug)
  .filter((slug) =>
    existsSync(path.resolve(process.cwd(), "Reports/generated", slug, "document-data.json"))
  );

function readGeneratedDocument(productName: string) {
  const documentPath = path.resolve(
    process.cwd(),
    productName,
    "content/generated/document-data.json"
  );

  return JSON.parse(readFileSync(documentPath, "utf-8")) as DocumentData;
}

function readGeneratedReport(reportSlug: string) {
  const documentPath = path.resolve(
    process.cwd(),
    "Reports/generated",
    reportSlug,
    "document-data.json"
  );

  return JSON.parse(readFileSync(documentPath, "utf-8")) as DocumentData;
}

function collectNonAbsoluteAnchors(documentData: DocumentData) {
  return documentData.chapters.flatMap((chapter) => {
    const anchors = chapter.html.match(/<a [^>]*href="([^"]*)"[^>]*>/g) ?? [];

    return anchors
      .filter((anchor) => {
        const href = anchor.match(/href="([^"]*)"/)?.[1] ?? "";

        return !/^(?:https?:\/\/|mailto:|tel:|#)/.test(href);
      })
      .map((anchor) => `${chapter.slug}: ${anchor}`);
  });
}

describe("generated content link smoke", () => {
  it.each(generatedProducts)("keeps safe external-link attributes for %s", (productName) => {
    const documentData = readGeneratedDocument(productName);
    const chapterHtml = documentData.chapters.map((chapter) => chapter.html).join("\n");
    const anchors = chapterHtml.match(/<a [^>]+>/g) ?? [];
    const internalAppAnchors = anchors.filter((anchor) =>
      /href="\/(?:latam|mexico|usa|japan|china|europe|uk)(?:[\/#?"]|$)/.test(anchor)
    );

    if (anchors.length > 0) {
      expect(
        anchors.some(
          (anchor) =>
            anchor.includes('target="_blank"')
            && anchor.includes('rel="noreferrer noopener"')
        )
      ).toBe(true);
    }
    expect(internalAppAnchors).toHaveLength(0);
  });

  // Markdown placeholder가 링크로 오파싱되면 상대 href 앵커가 생긴다(2026-06-21 LatTm `[본사명](이하 "허락자")` 사례).
  // rehype가 비-ASCII href를 퍼센트 인코딩하므로 실제 산출물은 `href="%EC%9D%B4%ED%95%98"` 형태다.
  // 문자열 grep으로는 잡히지 않아 href를 파싱해 형태로 판별한다.
  // 현재 전 워크스페이스 앵커는 모두 절대 http(s)이므로 예외 없이 막는다.
  it.each(generatedProducts)("keeps every anchor href absolute for %s", (productName) => {
    expect(collectNonAbsoluteAnchors(readGeneratedDocument(productName))).toEqual([]);
  });

  // 리포트 본문의 root-relative 링크는 Pages subpath 배포(`/glotm/`)에서 그대로 404가 된다.
  // 2026-08-02에 라이브 리포트 4개에서 17건이 확인됐고, 위 가이드 전용 목록이 Reports를 보지 않아
  // 게이트가 전부 green이었다. 같은 규칙을 리포트 생성물에도 적용한다.
  it.each(generatedReportSlugs)("keeps every anchor href absolute for report %s", (reportSlug) => {
    expect(collectNonAbsoluteAnchors(readGeneratedReport(reportSlug))).toEqual([]);
  });
});

// 리포트·브리프가 가이드 챕터로 넘기는 deep link는 registry에 손으로 적힌 문자열이라,
// 챕터 slug나 heading id가 재생성되며 바뀌어도 아무 게이트가 붉어지지 않았다.
// 실제로 `#launch-wave-기준으로-우선순위를-나눈다`가 존재하지 않는 앵커를 가리킨 채
// registry.test.ts가 그 값을 정답으로 고정하고 있었다(2026-08-02 확인).
describe("cross-surface guide deep links resolve", () => {
  const headingIdsByProductAndChapter = new Map<string, Set<string>>();

  for (const product of liveShellProducts) {
    const documentPath = path.resolve(
      process.cwd(),
      product.shortLabel,
      "content/generated/document-data.json"
    );

    if (!existsSync(documentPath)) {
      continue;
    }

    for (const chapter of readGeneratedDocument(product.shortLabel).chapters) {
      const ids = new Set<string>();
      const walk = (headings: { id: string; children?: unknown }[] | undefined) => {
        for (const heading of headings ?? []) {
          ids.add(heading.id);
          walk(heading.children as { id: string; children?: unknown }[] | undefined);
        }
      };
      walk(chapter.headings as { id: string; children?: unknown }[] | undefined);
      headingIdsByProductAndChapter.set(`${product.path}/chapter/${chapter.slug}`, ids);
    }
  }

  const deepLinks: { source: string; href: string }[] = [
    ...reports.flatMap((report) => [
      ...(report.focusPoints ?? []).map((point) => ({
        source: `report ${report.slug} focusPoint ${point.id}`,
        href: point.href
      })),
      ...(report.relatedGuideLinks ?? []).map((link) => ({
        source: `report ${report.slug} relatedGuideLink ${link.label}`,
        href: link.href
      }))
    ]),
    ...briefIssues.flatMap((issue) =>
      issue.items.flatMap((item) =>
        item.relatedGuideLinks.map((link) => ({
          source: `brief ${issue.slug} item ${item.id} link ${link.label}`,
          href: link.href
        }))
      )
    )
  ];

  it("has deep links to check", () => {
    expect(deepLinks.length).toBeGreaterThan(0);
  });

  it("resolves every chapter path and #fragment against generated content", () => {
    const unresolved = deepLinks
      .filter(({ href }) => href.includes("/chapter/"))
      .flatMap(({ source, href }) => {
        const hashIndex = href.indexOf("#");
        const chapterPath = hashIndex === -1 ? href : href.slice(0, hashIndex);
        const fragment = hashIndex === -1 ? "" : href.slice(hashIndex + 1);
        const headingIds = headingIdsByProductAndChapter.get(chapterPath);

        if (!headingIds) {
          return [`${source}: unknown chapter path ${chapterPath}`];
        }

        if (fragment && !headingIds.has(fragment)) {
          return [`${source}: missing heading #${fragment} in ${chapterPath}`];
        }

        return [];
      });

    expect(unresolved).toEqual([]);
  });
});
