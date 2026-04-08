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
