import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { products } from "./registry";
import {
  assessProductLifecycle,
  getLifecycleCriteria,
  getRecommendedLifecycleStatus,
  getSearchDensity,
  meetsLifecycleCriteria
} from "./scorecard";

function daysAgoIso(dayCount: number) {
  const base = new Date("2026-07-20T00:00:00.000Z");
  base.setUTCDate(base.getUTCDate() - dayCount);
  return base.toISOString();
}

describe("portfolio scorecard helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-20T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates search density from chapter and search counts", () => {
    expect(getSearchDensity({ chapterCount: 20, searchEntryCount: 780 })).toBe(39);
    expect(getSearchDensity({ chapterCount: 0, searchEntryCount: 10 })).toBe(0);
  });

  it("keeps the lifecycle thresholds aligned with the portfolio plan", () => {
    expect(getLifecycleCriteria("pilot")).toMatchObject({
      minimumChapterCount: 12,
      minimumSearchDensity: 5,
      maximumVerificationFreshnessDays: 180,
      minimumQaLevel: "smoke"
    });
    expect(getLifecycleCriteria("beta")).toMatchObject({
      minimumChapterCount: 14,
      minimumSearchDensity: 9,
      maximumVerificationFreshnessDays: 150,
      minimumQaLevel: "standard"
    });
    expect(getLifecycleCriteria("mature")).toMatchObject({
      minimumChapterCount: 15,
      minimumSearchDensity: 12,
      maximumVerificationFreshnessDays: 120,
      minimumQaLevel: "full",
      maximumHighRiskVerificationGapCount: 0
    });
  });

  it("classifies sample products into pilot, beta, and mature eligibility", () => {
    expect(
      getRecommendedLifecycleStatus({
        chapterCount: 12,
        searchEntryCount: 72,
        verifiedOn: daysAgoIso(120),
        qaLevel: "smoke",
        highRiskVerificationGapCount: 5
      })
    ).toBe("pilot");

    expect(
      getRecommendedLifecycleStatus({
        chapterCount: 15,
        searchEntryCount: 180,
        verifiedOn: daysAgoIso(75),
        qaLevel: "standard",
        highRiskVerificationGapCount: 2
      })
    ).toBe("beta");

    expect(
      getRecommendedLifecycleStatus({
        chapterCount: 16,
        searchEntryCount: 224,
        verifiedOn: daysAgoIso(45),
        qaLevel: "full",
        highRiskVerificationGapCount: 0
      })
    ).toBe("mature");
  });

  it("requires every registry lifecycle claim to satisfy its scorecard criteria", () => {
    for (const product of products) {
      const assessment = assessProductLifecycle(product);

      expect(
        assessment.meetsCurrentLifecycleStatus,
        `${product.shortLabel} declares ${product.lifecycleStatus}; density=${assessment.searchDensity.toFixed(2)}`
      ).toBe(true);
    }
  });

  it("rejects a mature claim immediately below the density floor", () => {
    const uk = products.find((product) => product.slug === "uk");

    expect(uk).toBeDefined();
    expect(meetsLifecycleCriteria({ ...uk!, searchEntryCount: 180 }, "mature")).toBe(true);
    expect(assessProductLifecycle({ ...uk!, searchEntryCount: 179 })).toMatchObject({
      searchDensity: 179 / 15,
      recommendedLifecycleStatus: "beta",
      meetsCurrentLifecycleStatus: false
    });
  });

  it("requires zero high-risk verification gaps before mature promotion", () => {
    expect(
      meetsLifecycleCriteria(
        {
          chapterCount: 18,
          searchEntryCount: 300,
          verifiedOn: daysAgoIso(35),
          qaLevel: "full",
          highRiskVerificationGapCount: 1
        },
        "mature"
      )
    ).toBe(false);
  });
});
