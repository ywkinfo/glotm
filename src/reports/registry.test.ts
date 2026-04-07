import { describe, expect, it } from "vitest";

import {
  getGatewayLandingReports,
  getGatewayFeaturedReports,
  getPrimaryFocusPointForGuide,
  getPrimaryGatewayReport,
  getReportBySlug,
  getReportsForGuideSlug
} from "./registry";

describe("report registry", () => {
  it("limits the gateway landing surface to front and supporting reports", () => {
    expect(getGatewayLandingReports(3).map((report) => report.slug)).toEqual([
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
  });

  it("keeps the gateway featured order pinned to placement, priority, then publishedAt", () => {
    expect(getGatewayFeaturedReports(2).map((report) => report.slug)).toEqual([
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
  });

  it("extends the gateway report lane with archive-only reports after front and supporting entries", () => {
    expect(getGatewayFeaturedReports(3).map((report) => report.slug)).toEqual([
      "global-filing-route-framework",
      "global-use-evidence-system",
      "brand-localization-vs-standardization-framework"
    ]);
  });

  it("pins the primary gateway report to the front trust-layer entry", () => {
    expect(getPrimaryGatewayReport()?.slug).toBe("global-filing-route-framework");
  });

  it("pins the supporting evidence report to the EuTm evidence handoff anchor", () => {
    const report = getReportBySlug("global-use-evidence-system");

    expect(report?.trustLayerSummaryObject).toBe("사용 증거 운영 구조를");
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

  it("reverse-indexes reports for a priority guide in latest-first order", () => {
    const handoffs = getReportsForGuideSlug("china");

    expect(handoffs.map(({ report }) => report.slug)).toEqual([
      "brand-localization-vs-standardization-framework",
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
    expect(handoffs[0]?.focusPoint).toMatchObject({
      id: "china-local-name-portfolio",
      title: "ChaTm: 중국어 표기 포트폴리오부터 잠근다"
    });
    expect(handoffs[1]?.focusPoint).toMatchObject({
      id: "china-local-fit",
      title: "ChaTm: 현지 맞춤 필요성을 먼저 본다"
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
