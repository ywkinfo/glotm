import { describe, expect, it } from "vitest";

import { briefIssues, getBriefIssueBySlug, getLatestBriefIssue } from "./archive";

describe("brief archive", () => {
  it("surfaces the newest brief as the latest visible issue", () => {
    expect(getLatestBriefIssue()?.slug).toBe(briefIssues[0]?.slug);
    expect(getLatestBriefIssue()?.slug).toBe("2026-04-collab-brand-exit-control");
    expect(getBriefIssueBySlug("2026-04-collab-brand-exit-control")?.title).toBe(
      "2026년 4월 Hot Global TM Brief | 성공한 협업 브랜드일수록 계약 종료 전에 권리 귀속·사용 주체·종료 후 회수 기준을 정리해 둬야 합니다"
    );
  });

  it("drops the route-decision brief from the archive", () => {
    expect(getBriefIssueBySlug("2026-04-filing-route-decision-framework")).toBeUndefined();
    expect(
      briefIssues.some((issue) => issue.slug === "2026-04-filing-route-decision-framework")
    ).toBe(false);
  });
});
