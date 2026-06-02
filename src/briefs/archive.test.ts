import { describe, expect, it } from "vitest";

import { briefIssues, getBriefIssueBySlug, getLatestBriefIssue } from "./archive";

describe("brief archive", () => {
  it("surfaces the newest brief as the latest visible issue", () => {
    expect(getLatestBriefIssue()?.slug).toBe(briefIssues[0]?.slug);
    expect(getLatestBriefIssue()?.slug).toBe("2026-05-k-beauty-counterfeit-platform-evidence");
    expect(getBriefIssueBySlug("2026-05-k-food-buldak-name-rights-structure")?.title).toBe(
      "2026년 5월 Hot Global TM Brief | 글로벌 히트 상품일수록 이름이 유행어가 되기 전에 국문·영문·확장 제품 권리 구조를 먼저 결정해야 합니다"
    );
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

describe("brief lane contract", () => {
  const allowedCadenceLabels = new Set(["주간 브리프", "월간 브리프"]);

  it("keeps slugs unique and date-prefixed to the publish month", () => {
    const seenSlugs = new Set<string>();

    for (const issue of briefIssues) {
      expect(seenSlugs.has(issue.slug)).toBe(false);
      seenSlugs.add(issue.slug);

      const slugMonth = issue.slug.slice(0, 7);
      expect(slugMonth).toMatch(/^\d{4}-\d{2}$/);
      expect(issue.publishedAt.slice(0, 7)).toBe(slugMonth);
    }
  });

  it("requires a valid publish date and an allowed cadence label", () => {
    for (const issue of briefIssues) {
      expect(Number.isNaN(new Date(issue.publishedAt).getTime())).toBe(false);
      expect(allowedCadenceLabels.has(issue.cadenceLabel)).toBe(true);
    }
  });

  it("requires provenance tags and core copy on every issue", () => {
    for (const issue of briefIssues) {
      expect(issue.title.trim().length).toBeGreaterThan(0);
      expect(issue.summary.trim().length).toBeGreaterThan(0);
      expect(issue.jurisdictions.length).toBeGreaterThan(0);
      expect(issue.items.length).toBeGreaterThan(0);

      for (const item of issue.items) {
        expect(item.headline.trim().length).toBeGreaterThan(0);
        expect(item.whatChanged.trim().length).toBeGreaterThan(0);
        expect(item.whoShouldCare.trim().length).toBeGreaterThan(0);
        expect(item.whyItMatters.trim().length).toBeGreaterThan(0);
        expect(item.nextAction.trim().length).toBeGreaterThan(0);

        expect(item.relatedGuideLinks.length).toBeGreaterThan(0);

        for (const link of item.relatedGuideLinks) {
          expect(link.label.trim().length).toBeGreaterThan(0);
          expect(link.href.startsWith("/")).toBe(true);
        }
      }
    }
  });

  it("keeps the archive sorted newest-first with unique publish dates", () => {
    const publishDays = briefIssues.map((issue) => issue.publishedAt.slice(0, 10));
    expect(new Set(publishDays).size).toBe(publishDays.length);

    const timestamps = briefIssues.map((issue) => new Date(issue.publishedAt).getTime());
    const sortedDesc = [...timestamps].sort((left, right) => right - left);
    expect(timestamps).toEqual(sortedDesc);
  });
});
