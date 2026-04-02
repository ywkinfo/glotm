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

  it("marks grandfathered beta products that miss current criteria as verification refresh candidates", () => {
    const usa = products.find((product) => product.slug === "usa");
    const japan = products.find((product) => product.slug === "japan");

    expect(usa).toBeDefined();
    expect(japan).toBeDefined();
    expect(getProductHealthVerdict(usa!)).toBe("verification-refresh-needed");
    expect(getProductHealthVerdict(japan!)).toBe("verification-refresh-needed");
  });

  it("surfaces upgrade-ready products without auto-promoting them", () => {
    const latam = products.find((product) => product.slug === "latam");
    const europe = products.find((product) => product.slug === "europe");

    expect(latam).toBeDefined();
    expect(europe).toBeDefined();
    expect(getProductHealthVerdict(latam!)).toBe("upgrade-ready");
    expect(getProductHealthVerdict(europe!)).toBe("upgrade-ready");
  });

  it("explains the concrete lifecycle gaps for products that fail their current lane", () => {
    const usa = products.find((product) => product.slug === "usa");

    expect(usa).toBeDefined();
    expect(getLifecycleCriteriaGaps(usa!, usa!.lifecycleStatus)).toEqual([
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
});
