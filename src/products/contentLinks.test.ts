import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { liveShellProducts } from "./registry";
import type { DocumentData } from "./shared";

const generatedProducts = liveShellProducts
  .map((product) => product.shortLabel)
  .filter((productName) =>
    existsSync(path.resolve(process.cwd(), productName, "content/generated/document-data.json"))
  );

function readGeneratedDocument(productName: string) {
  const documentPath = path.resolve(
    process.cwd(),
    productName,
    "content/generated/document-data.json"
  );

  return JSON.parse(readFileSync(documentPath, "utf-8")) as DocumentData;
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
    const documentData = readGeneratedDocument(productName);
    const offendingAnchors = documentData.chapters.flatMap((chapter) => {
      const anchors = chapter.html.match(/<a [^>]*href="([^"]*)"[^>]*>/g) ?? [];

      return anchors
        .filter((anchor) => {
          const href = anchor.match(/href="([^"]*)"/)?.[1] ?? "";

          return !/^(?:https?:\/\/|mailto:|tel:|#)/.test(href);
        })
        .map((anchor) => `${chapter.slug}: ${anchor}`);
    });

    expect(offendingAnchors).toEqual([]);
  });
});
