import type { AuditIssue, ClaimMapDocument } from "./shared";
import { isUnresolvedStatus } from "./shared";

export function runFactsAudit(document: ClaimMapDocument): AuditIssue[] {
  const issues: AuditIssue[] = [];

  for (const claim of document.claims) {
    if (claim.riskLevel === "HIGH" && claim.sourceIds.length === 0) {
      issues.push({
        level: "error",
        audit: "facts",
        claimId: claim.id,
        message: "HIGH risk claim에는 최소 1개의 sourceId가 필요합니다."
      });
    }

    if (isUnresolvedStatus(claim.status)) {
      issues.push({
        level: "error",
        audit: "facts",
        claimId: claim.id,
        message: `출판 대상 claim status가 아직 잠기지 않았습니다: ${claim.status}`
      });
    }

    if (claim.status === "CONDITIONAL" && !claim.notes?.trim()) {
      issues.push({
        level: "warning",
        audit: "facts",
        claimId: claim.id,
        message: "CONDITIONAL claim에는 설명 note가 필요합니다."
      });
    }

    if (claim.chapterRefs.length === 0) {
      issues.push({
        level: "warning",
        audit: "facts",
        claimId: claim.id,
        message: "chapterRefs가 비어 있습니다."
      });
    }
  }

  return issues;
}
