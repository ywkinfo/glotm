import { describe, expect, it } from "vitest";

import { briefIssues, getBriefIssueBySlug, getLatestBriefIssue } from "./archive";

describe("brief archive", () => {
  it("keeps the earlier brief as the latest visible issue", () => {
    expect(getLatestBriefIssue()?.slug).toBe("2026-04-k-brand-counterfeit-strategy");
    expect(briefIssues[0]?.slug).toBe("2026-04-k-brand-counterfeit-strategy");
  });

  it("drops the route-decision brief from the archive", () => {
    expect(getBriefIssueBySlug("2026-04-filing-route-decision-framework")).toBeUndefined();
    expect(
      briefIssues.some((issue) => issue.slug === "2026-04-filing-route-decision-framework")
    ).toBe(false);
  });
});
