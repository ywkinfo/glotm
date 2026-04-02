import { describe, expect, it } from "vitest";

import { products } from "./registry";
import {
  buildPortfolioHealthReport,
  getLifecycleCriteriaGaps,
  getProductHealthVerdict
} from "./health";

describe("portfolio health helpers", () => {
  it("builds root lane records with explicit statuses", () => {
    const report = buildPortfolioHealthReport(products, {
      runtime: "pass",
      content: "fail"
    });

    expect(report.root).toMatchObject([
      {
        id: "runtime",
        status: "pass"
      },
      {
        id: "content",
        status: "fail"
      },
      {
        id: "release",
        status: "not-run"
      }
    ]);
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
        verificationFreshnessDays: 112,
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
          verificationFreshnessDays: 112,
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

  it("treats the promoted LatTm and EuTm states as hold after the monthly review decision", () => {
    const latam = products.find((product) => product.slug === "latam");
    const europe = products.find((product) => product.slug === "europe");

    expect(latam).toBeDefined();
    expect(europe).toBeDefined();
    expect(getProductHealthVerdict(latam!)).toBe("hold");
    expect(getProductHealthVerdict(europe!)).toBe("hold");
  });

  it("treats the refreshed JapTm pilot state as hold with no current lifecycle gaps", () => {
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
