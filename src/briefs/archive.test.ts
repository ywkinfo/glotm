import { describe, expect, it } from "vitest";

import { briefIssues, getBriefIssueBySlug, getLatestBriefIssue } from "./archive";

describe("brief archive", () => {
  it("surfaces the newest brief as the latest visible issue", () => {
    expect(getLatestBriefIssue()?.slug).toBe(briefIssues[0]?.slug);
    expect(getLatestBriefIssue()?.slug).toBe("2026-04-seller-evidence-structure");
    expect(getBriefIssueBySlug("2026-04-seller-evidence-structure")?.title).toBe(
      "2026년 4월 Hot Global TM Brief | 플랫폼별 신고보다 판매자 단위 증거 묶음을 먼저 구조화해야 합니다"
    );
  });

  it("drops the route-decision brief from the archive", () => {
    expect(getBriefIssueBySlug("2026-04-filing-route-decision-framework")).toBeUndefined();
    expect(
      briefIssues.some((issue) => issue.slug === "2026-04-filing-route-decision-framework")
    ).toBe(false);
  });
});
