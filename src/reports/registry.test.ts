import { describe, expect, it } from "vitest";

import { getGatewayFeaturedReports, getReportBySlug } from "./registry";

describe("report registry", () => {
  it("keeps the gateway featured order pinned to front then supporting trust layers", () => {
    expect(getGatewayFeaturedReports(2).map((report) => report.slug)).toEqual([
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
  });

  it("pins the supporting evidence report to the EuTm evidence handoff anchor", () => {
    const report = getReportBySlug("global-use-evidence-system");

    expect(report?.gatewayPlacement).toBe("supporting");
    expect(report?.trustLayerSummaryObject).toBe("evidence owner와 evidence vault 구조를");
    expect(report?.focusPoints.map((focusPoint) => focusPoint.id)).toContain("europe-evidence-triage");
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "europe-evidence-triage")).toMatchObject({
      title: "EuTm: validate evidence handoff를 고정한다",
      href: "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage",
      guideSlug: "europe",
      ctaLabel: "EuTm evidence triage 보기"
    });
    expect(report?.relatedGuideLinks).toContainEqual({
      label: "EuTm evidence triage",
      href: "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage"
    });
  });
});
