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
      "hangul-mark-global-protection-framework",
      "global-filing-priority-framework"
    ]);
  });

  it("keeps the full report list sorted only by publishedAt", () => {
    expect(getLatestReports(5).map((report) => report.slug)).toEqual([
      "hangul-mark-global-protection-framework",
      "global-filing-priority-framework",
      "brand-localization-vs-standardization-framework",
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
  });

  it("pins the latest gateway report to the newest report entry", () => {
    expect(getLatestReport()?.slug).toBe("hangul-mark-global-protection-framework");
    expect(getLatestReport()?.gatewayBridgeLabel).toBe(defaultReportBridgeLabel);
  });

  it("pins the priority report to the current priority-lane anchors and baseline handoff", () => {
    const report = getReportBySlug("global-filing-priority-framework");

    expect(report?.trustLayerSummaryObject).toBe("출원 우선순위와 표장 우선순위 질문을");
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "china-launch-sequencing")).toMatchObject({
      title: "ChaTm: 중국 launch sequencing부터 적는다",
      href: "/china/chapter/제4장-출원-경로-선택-직접출원-vs-마드리드#launch-market-우선순위를-먼저-적는다",
      guideSlug: "china",
      ctaLabel: "ChaTm sequencing 보기"
    });
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "mexico-launch-control")).toMatchObject({
      title: "MexTm: buyer-entry 14일 control부터 잠근다",
      href: "/mexico/chapter/제1장-멕시코-상표-제도-개요와-impi-운영-구조#launch-직전-14일-control-board",
      guideSlug: "mexico",
      ctaLabel: "MexTm control board 보기"
    });
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "europe-launch-priority")).toMatchObject({
      title: "EuTm: launch wave 기준으로 우선순위를 나눈다",
      href: "/europe/chapter/제3장-포트폴리오-설계와-우선순위#launch-wave-기준으로-우선순위를-나눈다",
      guideSlug: "europe",
      ctaLabel: "EuTm 우선순위 보기"
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
      summary:
        "EuTm은 validate baseline을 controlled EU+UK scope로 잠근 상태이므로, 유통사·마켓플레이스·판매자 증거를 어떤 순서로 넘길지 권역 기준선으로 바로 확인합니다.",
      href: "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage",
      guideSlug: "europe",
      ctaLabel: "EuTm evidence triage 보기"
    });
    expect(report?.relatedGuideLinks).toContainEqual({
      label: "EuTm evidence triage",
      href: "/europe/chapter/제8장-등록-후-사용-갱신-증거-관리#distributor--marketplace-seller-evidence-triage"
    });
  });

  it("adds the hangul protection report between priority and localization lanes", () => {
    const report = getReportBySlug("hangul-mark-global-protection-framework");

    expect(report?.trustLayerSummaryObject).toBe("한글 표장 보호 판단을");
    expect(report?.jurisdictions).toEqual(["Global", "China", "Japan", "Mexico"]);
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "china-hangul-handoff-lock")).toMatchObject({
      title: "ChaTm: 표기 결정과 handoff 논리",
      href: "/china/chapter/제2장-브랜드-구조와-중국어-표기-전략",
      guideSlug: "china",
      ctaLabel: "ChaTm 표기 결정 보기"
    });
    expect(report?.focusPoints.find((focusPoint) => focusPoint.id === "mexico-mark-version-alignment")).toMatchObject({
      title: "MexTm: 출원서 작성 및 제출",
      href: "/mexico/chapter/제5장-출원서-작성-실무-제출서류권한전자출원pase",
      guideSlug: "mexico",
      ctaLabel: "MexTm 출원 실무 보기"
    });
    expect(report?.relatedGuideLinks).toContainEqual({
      label: "브랜드 표장 현지화 vs. 표준화 프레임워크",
      href: "/reports/brand-localization-vs-standardization-framework"
    });
  });

  it("reverse-indexes reports for a priority guide in latest-first order", () => {
    const handoffs = getReportsForGuideSlug("china");

    expect(handoffs.map(({ report }) => report.slug)).toEqual([
      "hangul-mark-global-protection-framework",
      "global-filing-priority-framework",
      "brand-localization-vs-standardization-framework",
      "global-filing-route-framework",
      "global-use-evidence-system"
    ]);
    expect(handoffs[0]?.focusPoint).toMatchObject({
      id: "china-hangul-handoff-lock",
      title: "ChaTm: 표기 결정과 handoff 논리"
    });
    expect(handoffs[1]?.focusPoint).toMatchObject({
      id: "china-launch-sequencing",
      title: "ChaTm: 중국 launch sequencing부터 적는다"
    });
    expect(handoffs[2]?.focusPoint).toMatchObject({
      id: "china-local-name-portfolio",
      title: "ChaTm: 중국어 표기 포트폴리오부터 잠근다"
    });
  });

  it("returns the direct focus point for a guide and specific report slug", () => {
    expect(getPrimaryFocusPointForGuide("china", "global-filing-priority-framework")).toMatchObject({
      id: "china-launch-sequencing",
      ctaLabel: "ChaTm sequencing 보기"
    });
    expect(getPrimaryFocusPointForGuide("mexico", "global-filing-priority-framework")).toMatchObject({
      id: "mexico-launch-control",
      ctaLabel: "MexTm control board 보기"
    });
    expect(getPrimaryFocusPointForGuide("europe", "global-filing-priority-framework")).toMatchObject({
      id: "europe-launch-priority",
      ctaLabel: "EuTm 우선순위 보기"
    });
    expect(getPrimaryFocusPointForGuide("mexico", "global-filing-route-framework")).toMatchObject({
      id: "mexico-control",
      ctaLabel: "MexTm buyer-entry 표 보기"
    });
    expect(getPrimaryFocusPointForGuide("mexico", "hangul-mark-global-protection-framework")).toMatchObject({
      id: "mexico-mark-version-alignment",
      ctaLabel: "MexTm 출원 실무 보기"
    });
    expect(getPrimaryFocusPointForGuide("europe", "global-use-evidence-system")).toMatchObject({
      id: "europe-evidence-triage",
      ctaLabel: "EuTm evidence triage 보기"
    });
  });
});
