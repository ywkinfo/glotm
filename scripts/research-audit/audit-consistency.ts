import type { AuditIssue, ClaimMapDocument, ClaimNormalized } from "./shared";

function isNormalizedComplete(normalized?: ClaimNormalized) {
  if (!normalized) {
    return false;
  }

  return [normalized.trigger, normalized.value, normalized.unit].every((value) => typeof value === "string" && value.trim() !== "");
}

function buildSignature(normalized: ClaimNormalized) {
  return JSON.stringify({
    trigger: normalized.trigger ?? null,
    value: normalized.value ?? null,
    unit: normalized.unit ?? null,
    expression: normalized.expression ?? null
  });
}

const trackedConcepts = new Set([
  "opposition_period",
  "renewal_term",
  "use_requirement",
  "filing_route"
]);

export function runConsistencyAudit(document: ClaimMapDocument): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const seenSignatures = new Map<string, string>();

  for (const claim of document.claims) {
    if (!claim.conceptKey || !trackedConcepts.has(claim.conceptKey)) {
      continue;
    }

    if (!isNormalizedComplete(claim.normalized)) {
      issues.push({
        level: "warning",
        audit: "consistency",
        claimId: claim.id,
        message: `conceptKey ${claim.conceptKey}에는 완전한 normalized tuple이 필요합니다.`
      });
      continue;
    }

    const groupKey = `${claim.jurisdiction}:${claim.conceptKey}:${claim.normalized?.trigger}`;
    const signature = buildSignature(claim.normalized as ClaimNormalized);
    const existingSignature = seenSignatures.get(groupKey);

    if (existingSignature && existingSignature !== signature) {
      issues.push({
        level: "warning",
        audit: "consistency",
        claimId: claim.id,
        message: `${claim.conceptKey} normalized tuple이 같은 jurisdiction 안에서 충돌합니다.`
      });
      continue;
    }

    seenSignatures.set(groupKey, signature);
  }

  return issues;
}
