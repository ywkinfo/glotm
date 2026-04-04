import { describe, expect, it } from "vitest";

import {
  getGatewayFeaturedReports,
  getPrimaryFocusPointForGuide,
  getReportBySlug,
  getReportsForGuideSlug
} from "./registry";

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

  it("reverse-indexes reports for a priority guide in front-then-supporting order", () => {
    const handoffs = getReportsForGuideSlug("china");

    expect(handoffs.map(({ report }) => report.slug)).toEqual([
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
    expect(handoffs[0]?.focusPoint).toMatchObject({
      id: "china-local-fit",
      title: "ChaTm: local-fit pressure를 먼저 잠근다"
    });
    expect(handoffs[1]?.focusPoint).toMatchObject({
      id: "china-evidence-handoff",
      title: "ChaTm: route와 evidence를 같이 본다"
    });
  });

  it("returns the direct focus point for a guide and specific report slug", () => {
    expect(getPrimaryFocusPointForGuide("mexico", "global-filing-route-framework")).toMatchObject({
      id: "mexico-control",
      ctaLabel: "MexTm buyer-entry 표 보기"
    });
    expect(getPrimaryFocusPointForGuide("europe", "global-use-evidence-system")).toMatchObject({
      id: "europe-evidence-triage",
      ctaLabel: "EuTm evidence triage 보기"
    });
  });
});
