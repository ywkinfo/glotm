import { describe, expect, it } from "vitest";

import { runConsistencyAudit } from "./audit-consistency";
import type { ClaimMapDocument } from "./shared";

describe("consistency audit", () => {
  it("warns when normalized tuples conflict", () => {
    const document: ClaimMapDocument = {
      workspace: "ChaTm",
      productSlug: "china",
      version: 1,
      auditMode: "advisory",
      claims: [
        {
          id: "CN-TEST-001",
          jurisdiction: "CN",
          claim: "first claim",
          chapterRefs: ["Ch1"],
          riskLevel: "HIGH",
          sourceIds: ["source-1"],
          lastVerified: "2026-03-31",
          status: "BODY_READY",
          conceptKey: "filing_route",
          normalized: {
            trigger: "direct_filing",
            value: "accepted naming required",
            unit: "rule",
            expression: "accepted naming required"
          }
        },
        {
          id: "CN-TEST-002",
          jurisdiction: "CN",
          claim: "second claim",
          chapterRefs: ["Ch2"],
          riskLevel: "HIGH",
          sourceIds: ["source-2"],
          lastVerified: "2026-03-31",
          status: "BODY_READY",
          conceptKey: "filing_route",
          normalized: {
            trigger: "direct_filing",
            value: "domestic law governs",
            unit: "rule",
            expression: "domestic law governs"
          }
        }
      ]
    };

    const issues = runConsistencyAudit(document);

    expect(issues).toContainEqual(
      expect.objectContaining({ level: "warning", claimId: "CN-TEST-002", message: expect.stringContaining("충돌") })
    );
  });
});
