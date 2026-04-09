import { describe, expect, it } from "vitest";

import {
  defaultReportBridgeLabel,
  getLatestReport,
  getLatestReports,
  getPrimaryFocusPointForGuide,
  getReportBySlug,
  getReportsForGuideSlug
} from "./registry";

describe("report registry", () => {
  it("returns the latest reports in publishedAt order", () => {
    expect(getLatestReports(2).map((report) => report.slug)).toEqual([
      "global-filing-priority-framework",
      "brand-localization-vs-standardization-framework"
    ]);
  });

  it("keeps the full report list sorted only by publishedAt", () => {
    expect(getLatestReports(4).map((report) => report.slug)).toEqual([
      "global-filing-priority-framework",
      "brand-localization-vs-standardization-framework",
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
  });

  it("pins the latest gateway report to the newest report entry", () => {
    expect(getLatestReport()?.slug).toBe("global-filing-priority-framework");
    expect(getLatestReport()?.gatewayBridgeLabel).toBe(defaultReportBridgeLabel);
  });

  it("pins the priority report to the China sequencing anchor and cross-market guide set", () => {
    const report = getReportBySlug("global-filing-priority-framework");

    expect(report?.trustLayerSummaryObject).toBe("출원 우선순위와 표장 우선순위 질문을");
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "china-launch-sequencing")).toMatchObject({
      title: "ChaTm: 중국 launch sequencing부터 적는다",
      href: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#launch-market-우선순위를-먼저-적는다",
      guideSlug: "china",
      ctaLabel: "ChaTm sequencing 보기"
    });
    expect(report?.relatedGuideLinks).toContainEqual({
      label: "LatTm priority matrix",
      href: "/latam/chapter/제01장-중남미-상표-보호-전략-프레임-전체-구조#국가-우선순위-결정-매트릭스"
    });
  });

  it("keeps the evidence report pinned to the EuTm evidence handoff anchor", () => {
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
      "global-filing-priority-framework",
      "brand-localization-vs-standardization-framework",
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
    expect(handoffs[0]?.focusPoint).toMatchObject({
      id: "china-launch-sequencing",
      title: "ChaTm: 중국 launch sequencing부터 적는다"
    });
    expect(handoffs[1]?.focusPoint).toMatchObject({
      id: "china-local-name-portfolio",
      title: "ChaTm: 중국어 표기 포트폴리오부터 잠근다"
    });
  });

  it("returns the direct focus point for a guide and specific report slug", () => {
    expect(getPrimaryFocusPointForGuide("china", "global-filing-priority-framework")).toMatchObject({
      id: "china-launch-sequencing",
      ctaLabel: "ChaTm sequencing 보기"
    });
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
