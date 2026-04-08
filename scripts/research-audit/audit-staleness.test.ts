import { describe, expect, it, vi } from "vitest";

import { runStalenessAudit } from "./audit-staleness";
import type { ClaimMapDocument } from "./shared";

describe("staleness audit", () => {
  it("warns on stale claims", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00.000Z"));

    const document: ClaimMapDocument = {
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
          lastVerified: "2025-12-01",
          status: "BODY_READY"
        }
      ]
    };

    const issues = runStalenessAudit(document, 60);

    expect(issues).toContainEqual(
      expect.objectContaining({ level: "warning", claimId: "CN-TEST-001", message: expect.stringContaining("허용치") })
    );

    vi.useRealTimers();
  });
});
