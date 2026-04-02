import documentData from "../generated/global-use-evidence-system/document-data.json";
import searchEntries from "../generated/global-use-evidence-system/search-index.json";
import { describe, expect, it } from "vitest";

describe("report build output", () => {
  it("emits a single-document report with search entries", () => {
    expect(documentData.meta.title).toBe("글로벌 사용 증거 수집 운영 시스템 구축");
    expect(documentData.meta.chapterCount).toBe(1);
    expect(documentData.chapters[0]).toMatchObject({
      slug: "global-use-evidence-system",
      title: "글로벌 사용 증거 수집 운영 시스템 구축"
    });
    expect(documentData.chapters[0]?.headings.length).toBeGreaterThan(0);
    expect(searchEntries.length).toBeGreaterThan(0);
    expect(searchEntries[0]).toEqual(
      expect.objectContaining({
        chapterSlug: "global-use-evidence-system"
      })
    );
  });
});
