import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { liveShellProducts } from "./registry";
import type { DocumentData } from "./shared";

const generatedProducts = liveShellProducts.map((product) => product.shortLabel);

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
      /href="\/(?:latam|mexico|usa|japan|china|europe)(?:[\/#?"]|$)/.test(anchor)
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
});
