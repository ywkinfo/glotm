import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { products } from "./registry";
import {
  buildPortfolioHealthReport,
  buildProductVerificationRecord,
  getLifecycleCriteriaGaps,
  getProductHealthVerdict
} from "./health";

function daysAgoIso(dayCount: number) {
  const base = new Date("2026-04-04T00:00:00.000Z");
  base.setUTCDate(base.getUTCDate() - dayCount);
  return base.toISOString();
}

describe("portfolio health helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds root lane records with explicit statuses", () => {
    const report = buildPortfolioHealthReport(products, {
      runtime: "pass",
      content: "fail"
    });

    expect(report.meta).toMatchObject({
      summaryKind: "recent-lane-state-provenance-summary",
      interpretation: "operational-snapshot",
      isEndToEndVerificationProof: false,
      provenanceLevels: ["live", "cached", "partial", "inferred"]
    });
    expect(report.root).toMatchObject([
      {
        id: "runtime",
        status: "pass"
      },
      {
        id: "content",
        status: "fail",
        verification: expect.objectContaining({
          fullPipelineProductSlugs: ["latam", "mexico", "china", "europe", "uk"],
          shortcutProductSlugs: ["usa", "japan"]
        })
      },
      {
        id: "release",
        status: "not-run"
      }
    ]);
  });

  it("makes root shortcut verification scope explicit for UsaTm and JapTm", () => {
    expect(buildProductVerificationRecord({ slug: "usa" })).toEqual({
      mode: "root-shortcut-refresh",
      scopeLabel: "root shortcut refresh",
      reportSummary: "root content shortcut refresh only"
    });
    expect(buildProductVerificationRecord({ slug: "japan" })).toEqual({
      mode: "root-shortcut-refresh",
      scopeLabel: "root shortcut refresh",
      reportSummary: "root content shortcut refresh only"
    });
    expect(buildProductVerificationRecord({ slug: "uk" })).toEqual({
      mode: "root-full-pipeline",
      scopeLabel: "root full pipeline",
      reportSummary: "root content full pipeline"
    });
  });

  it("marks grandfathered beta snapshots as verification refresh candidates", () => {
    const usa = products.find((product) => product.slug === "usa");
    const japan = products.find((product) => product.slug === "japan");

    expect(usa).toBeDefined();
    expect(japan).toBeDefined();
    expect(
      getProductHealthVerdict({
        ...usa!,
        lifecycleStatus: "beta",
        lifecycleTone: "beta",
        verifiedOn: daysAgoIso(112),
        qaLevel: "smoke"
      })
    ).toBe("verification-refresh-needed");
    expect(getProductHealthVerdict(japan!)).toBe("hold");
  });

  it("surfaces upgrade-ready products without auto-promoting them", () => {
    const latam = products.find((product) => product.slug === "latam");

    expect(latam).toBeDefined();
    expect(
      getProductHealthVerdict({
        ...latam!,
        lifecycleStatus: "pilot",
        lifecycleTone: "pilot"
      })
    ).toBe("upgrade-ready");
  });

  it("explains the concrete lifecycle gaps for products that fail their current lane", () => {
    const usa = products.find((product) => product.slug === "usa");

    expect(usa).toBeDefined();
    expect(
      getLifecycleCriteriaGaps(
        {
          ...usa!,
          verifiedOn: daysAgoIso(112),
          qaLevel: "smoke"
        },
        "beta"
      )
    ).toEqual([
      "verification freshness 112d > 90d",
      "qa level smoke < standard"
    ]);
  });

  it("keeps the health report ordered by the agreed execution plan", () => {
    const report = buildPortfolioHealthReport(products);

    expect(report.products.map((product) => product.slug)).toEqual([
      "latam",
      "china",
      "mexico",
      "europe",
      "japan",
      "uk",
      "usa"
    ]);
  });

  it("adds optional research data without changing product verdicts", () => {
    const report = buildPortfolioHealthReport(products, {}, {
      china: {
        auditMode: "advisory",
        factIntegrityScore: 100,
        consistencyScore: 100,
        criticalClaimFreshnessDays: 4,
        staleHighRiskClaimCount: 0,
        effectiveHighRiskGapCount: 0,
        gate: "pass"
      },
      mexico: {
        auditMode: "advisory",
        factIntegrityScore: 100,
        consistencyScore: 100,
        criticalClaimFreshnessDays: 3,
        staleHighRiskClaimCount: 0,
        effectiveHighRiskGapCount: 0,
        gate: "pass"
      }
    });
    const china = report.products.find((product) => product.slug === "china");
    const mexico = report.products.find((product) => product.slug === "mexico");

    expect(china).toBeDefined();
    expect(mexico).toBeDefined();
    expect(china?.verdict).toBe("hold");
    expect(mexico?.verdict).toBe("hold");
    expect(china?.research).toMatchObject({
      auditMode: "advisory",
      factIntegrityScore: 100,
      gate: "pass"
    });
    expect(mexico?.research).toMatchObject({
      auditMode: "advisory",
      factIntegrityScore: 100,
      gate: "pass"
    });
    expect(report.products.find((product) => product.slug === "latam")?.research).toBeUndefined();
    expect(report.products.find((product) => product.slug === "europe")?.research).toBeUndefined();
    expect(report.products.find((product) => product.slug === "usa")?.research).toBeUndefined();
  });

  it("treats the promoted LatTm and EuTm states as hold after the monthly review decision", () => {
    const latam = products.find((product) => product.slug === "latam");
    const europe = products.find((product) => product.slug === "europe");
    const china = products.find((product) => product.slug === "china");

    expect(latam).toBeDefined();
    expect(europe).toBeDefined();
    expect(china).toBeDefined();
    expect(getProductHealthVerdict(latam!)).toBe("hold");
    expect(getProductHealthVerdict(europe!)).toBe("hold");
    expect(getProductHealthVerdict(china!)).toBe("hold");
  });

  it("treats the refreshed JapTm beta state as hold with no current lifecycle gaps", () => {
    const japan = products.find((product) => product.slug === "japan");

    expect(japan).toBeDefined();
    expect(getProductHealthVerdict(japan!)).toBe("hold");
    expect(getLifecycleCriteriaGaps(japan!, japan!.lifecycleStatus)).toEqual([]);
  });

  it("treats the refreshed UsaTm beta state as hold after the verification refresh", () => {
    const usa = products.find((product) => product.slug === "usa");

    expect(usa).toBeDefined();
    expect(getProductHealthVerdict(usa!)).toBe("hold");
    expect(getLifecycleCriteriaGaps(usa!, usa!.lifecycleStatus)).toEqual([]);
  });

  it("treats the refreshed UKTm pilot state as hold with no current lifecycle gaps", () => {
    const uk = products.find((product) => product.slug === "uk");

    expect(uk).toBeDefined();
    expect(getProductHealthVerdict(uk!)).toBe("hold");
    expect(getLifecycleCriteriaGaps(uk!, uk!.lifecycleStatus)).toEqual([]);
  });
});
