import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { products } from "./registry";
import { getVerificationFreshnessDays } from "./shared";
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

// 이 블록은 의도적으로 fake timer 밖에 둔다. 위 describe는 daysAgoIso 픽스처를 위해 시계를 2026-07-20에
// 고정하는데, registry 전수 가드가 그 안에 있으면 `maximumVerificationFreshnessDays`(mature 120일)가
// 영원히 고정 경과일로 평가돼 lane freshness 차원만 사실상 검사되지 않는다. 실시계로 돌려야
// verifiedOn이 실제로 창을 넘어갈 때 test:runtime이 붉어진다.
describe("registry lifecycle claims against the real clock", () => {
  it("requires every registry lifecycle claim to satisfy its scorecard criteria", () => {
    for (const product of products) {
      const assessment = assessProductLifecycle(product);
      const criteria = getLifecycleCriteria(product.lifecycleStatus);

      expect(
        assessment.meetsCurrentLifecycleStatus,
        `${product.shortLabel} declares ${product.lifecycleStatus}; `
          + `density=${assessment.searchDensity.toFixed(2)} (min ${criteria.minimumSearchDensity}); `
          + `verifiedOn=${product.verifiedOn.slice(0, 10)} is `
          + `${getVerificationFreshnessDays(product)}d old (max ${criteria.maximumVerificationFreshnessDays}d)`
      ).toBe(true);
    }
  });

  // 미래 일자는 freshness를 **만료시키지 않고 침묵시킨다.** `getVerificationFreshnessDays`와
  // `getFactReviewFreshnessDays`는 둘 다 `Math.max(0, …)`으로 clamp하므로(shared.ts), verifiedOn에
  // 2099년이 들어가면 경과일이 영원히 0이 되고 위 lifecycle 가드도 `health:report`의 Freshness 열도
  // 다시는 붉어지지 않는다. 오타 하나로 재검증 계약 전체가 조용히 꺼지는 모양이다.
  //
  // 브리프 lane은 같은 모양을 이미 막고 있다(`src/briefs/archive.test.ts`의 미래 발행일 금지).
  // registry 쪽에는 그 짝이 없어서 여기에 둔다 — fake timer 밖이라야 "지금"이 진짜 지금이다.
  it("refuses a future-dated verifiedOn or factsReviewedOn", () => {
    const now = Date.now();

    for (const product of products) {
      expect(
        Date.parse(product.verifiedOn),
        `${product.shortLabel} verifiedOn=${product.verifiedOn.slice(0, 10)} is in the future; `
          + "freshness clamps to 0 and the lane-freshness criterion stops gating"
      ).toBeLessThanOrEqual(now);

      if (!product.factsReviewedOn) {
        continue;
      }

      expect(
        Date.parse(product.factsReviewedOn),
        `${product.shortLabel} factsReviewedOn=${product.factsReviewedOn.slice(0, 10)} is in the future; `
          + "fact freshness clamps to 0 and health:report reports it as just-reviewed"
      ).toBeLessThanOrEqual(now);
    }
  });
});
