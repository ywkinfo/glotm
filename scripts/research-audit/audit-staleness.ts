import type { AuditIssue, ClaimMapDocument } from "./shared";
import { getClaimFreshnessDays } from "./shared";

export function runStalenessAudit(document: ClaimMapDocument, maxFreshnessDays: number): AuditIssue[] {
  const issues: AuditIssue[] = [];

  for (const claim of document.claims) {
    const freshnessDays = getClaimFreshnessDays(claim.lastVerified);

    if (freshnessDays > maxFreshnessDays) {
      issues.push({
        level: "warning",
        audit: "staleness",
        claimId: claim.id,
        message: `claim freshness ${freshnessDays}d가 허용치 ${maxFreshnessDays}d를 넘었습니다.`
      });
    }
  }

  return issues;
}
