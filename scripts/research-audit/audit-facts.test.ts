import { describe, expect, it } from "vitest";

import { runFactsAudit } from "./audit-facts";
import type { ClaimMapDocument } from "./shared";

const baseDocument: ClaimMapDocument = {
  workspace: "ChaTm",
  productSlug: "china",
  version: 1,
  auditMode: "advisory",
  claims: [
    {
      id: "CN-TEST-001",
      jurisdiction: "CN",
      claim: "test claim",
      chapterRefs: ["Ch1"],
      riskLevel: "HIGH",
      sourceIds: ["source-1"],
      lastVerified: "2026-03-31",
      status: "BODY_READY"
    }
  ]
};

describe("facts audit", () => {
  // 이 표면이 게이트를 움직이면 advisory 계약이 부작용으로 바뀐다. 레벨과 비게이팅을 함께 잠근다.
  it("surfaces single-source HIGH claims as info without touching the gate", () => {
    const issues = runFactsAudit(baseDocument);
    const info = issues.filter((issue) => issue.level === "info");

    expect(info).toHaveLength(1);
    expect(info[0].message).toContain("CN-TEST-001(source-1)");
    expect(issues.some((issue) => issue.level === "error" || issue.level === "warning")).toBe(false);
  });

  // 소스가 둘 이상이면 이 목록에 뜨지 않는다 — 세는 것은 "하나뿐인 자리"이지 소스 개수가 아니다.
  it("does not surface a HIGH claim that carries a second source", () => {
    const issues = runFactsAudit({
      ...baseDocument,
      claims: [{ ...baseDocument.claims[0], sourceIds: ["source-1", "source-2"] }]
    });

    expect(issues.filter((issue) => issue.level === "info")).toEqual([]);
  });

  it("fails when a high-risk claim has no sourceIds", () => {
    const issues = runFactsAudit({
      ...baseDocument,
      claims: [{ ...baseDocument.claims[0], sourceIds: [] }]
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ level: "error", claimId: "CN-TEST-001", message: expect.stringContaining("sourceId") })
    );
  });

  it("fails when a publishable claim is still pending", () => {
    const issues = runFactsAudit({
      ...baseDocument,
      claims: [{ ...baseDocument.claims[0], status: "PENDING" }]
    });

    expect(issues).toContainEqual(
      expect.objectContaining({ level: "error", claimId: "CN-TEST-001", message: expect.stringContaining("잠기지") })
    );
  });
});
