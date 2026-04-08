import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { ProductMeta } from "../../src/products/shared";

export type ClaimStatus =
  | "VERIFIED"
  | "BODY_READY"
  | "PENDING"
  | "NEEDS_UPDATE"
  | "CONFLICT"
  | "CONDITIONAL"
  | "DEPRECATED";

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type AuditName = "facts" | "staleness" | "consistency";

export type ClaimNormalized = {
  trigger?: string | null;
  value?: string | null;
  unit?: string | null;
  expression?: string | null;
};

export type ClaimMapEntry = {
  id: string;
  jurisdiction: string;
  claim: string;
  chapterRefs: string[];
  riskLevel: RiskLevel;
  sourceIds: string[];
  lastVerified: string;
  status: ClaimStatus;
  conceptKey?: string;
  normalized?: ClaimNormalized;
  notes?: string;
};

export type ClaimMapDocument = {
  workspace: string;
  productSlug: string;
  version: number;
  auditMode: "advisory";
  claims: ClaimMapEntry[];
};

export type AuditIssue = {
  level: "error" | "warning";
  audit: AuditName;
  message: string;
  claimId?: string;
};

export type WorkspaceResearchSummary = {
  auditMode: "advisory";
  factIntegrityScore: number;
  consistencyScore: number;
  criticalClaimFreshnessDays: number;
  staleHighRiskClaimCount: number;
  effectiveHighRiskGapCount: number;
  gate: "pass" | "warn" | "fail";
};

const allowedStatuses = new Set<ClaimStatus>([
  "VERIFIED",
  "BODY_READY",
  "PENDING",
  "NEEDS_UPDATE",
  "CONFLICT",
  "CONDITIONAL",
  "DEPRECATED"
]);

const allowedRiskLevels = new Set<RiskLevel>(["HIGH", "MEDIUM", "LOW"]);

const unresolvedStatuses = new Set<ClaimStatus>(["PENDING", "NEEDS_UPDATE", "CONFLICT"]);

export function getClaimMapPath(rootDir: string, workspaceName: string) {
  return path.resolve(rootDir, workspaceName, "content", "research", "claim-map.json");
}

export function readClaimMap(filePath: string) {
  return JSON.parse(readFileSync(filePath, "utf8")) as ClaimMapDocument;
}

export function claimMapExists(filePath: string) {
  return existsSync(filePath);
}

export function validateClaimMap(document: ClaimMapDocument): AuditIssue[] {
  const issues: AuditIssue[] = [];

  if (!document.workspace?.trim()) {
    issues.push({ level: "error", audit: "facts", message: "claim-map workspace가 비어 있습니다." });
  }

  if (!document.productSlug?.trim()) {
    issues.push({ level: "error", audit: "facts", message: "claim-map productSlug가 비어 있습니다." });
  }

  if (document.version !== 1) {
    issues.push({ level: "error", audit: "facts", message: `claim-map version은 1이어야 합니다. 현재 ${String(document.version)}입니다.` });
  }

  if (document.auditMode !== "advisory") {
    issues.push({ level: "error", audit: "facts", message: "claim-map auditMode는 advisory여야 합니다." });
  }

  if (!Array.isArray(document.claims)) {
    issues.push({ level: "error", audit: "facts", message: "claim-map claims는 배열이어야 합니다." });
    return issues;
  }

  const seenIds = new Set<string>();

  for (const claim of document.claims) {
    if (!claim.id?.trim()) {
      issues.push({ level: "error", audit: "facts", message: "claim id가 비어 있습니다." });
      continue;
    }

    if (seenIds.has(claim.id)) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: `중복 claim id가 있습니다: ${claim.id}` });
    }
    seenIds.add(claim.id);

    if (!claim.claim?.trim()) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: "claim 본문이 비어 있습니다." });
    }

    if (!claim.jurisdiction?.trim()) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: "jurisdiction이 비어 있습니다." });
    }

    if (!Array.isArray(claim.chapterRefs)) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: "chapterRefs는 배열이어야 합니다." });
    }

    if (!Array.isArray(claim.sourceIds)) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: "sourceIds는 배열이어야 합니다." });
    }

    if (!allowedRiskLevels.has(claim.riskLevel)) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: `지원하지 않는 riskLevel입니다: ${String(claim.riskLevel)}` });
    }

    if (!allowedStatuses.has(claim.status)) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: `지원하지 않는 status입니다: ${String(claim.status)}` });
    }

    if (!claim.lastVerified?.trim()) {
      issues.push({ level: "error", audit: "facts", claimId: claim.id, message: "lastVerified가 비어 있습니다." });
    }
  }

  return issues;
}

export function getClaimFreshnessDays(lastVerified: string, now = new Date()) {
  const verifiedAt = new Date(lastVerified);

  if (Number.isNaN(verifiedAt.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  const diffMs = now.getTime() - verifiedAt.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function isUnresolvedStatus(status: ClaimStatus) {
  return unresolvedStatuses.has(status);
}

export function buildResearchSummary(
  document: ClaimMapDocument,
  issues: AuditIssue[],
  product: Pick<ProductMeta, "highRiskVerificationGapCount">,
  maxFreshnessDays: number
): WorkspaceResearchSummary {
  const totalClaims = document.claims.length;
  const factErrorClaimIds = new Set(
    issues
      .filter((issue) => issue.audit === "facts" && issue.level === "error" && issue.claimId)
      .map((issue) => issue.claimId as string)
  );
  const consistencyClaimIds = new Set(
    issues
      .filter((issue) => issue.audit === "consistency" && issue.claimId)
      .map((issue) => issue.claimId as string)
  );
  const mappedConsistencyClaims = document.claims.filter((claim) => Boolean(claim.conceptKey));
  const highRiskClaims = document.claims.filter((claim) => claim.riskLevel === "HIGH");
  const criticalClaimFreshnessDays = highRiskClaims.reduce((maxDays, claim) => {
    return Math.max(maxDays, getClaimFreshnessDays(claim.lastVerified));
  }, 0);
  const staleHighRiskClaimCount = highRiskClaims.filter((claim) => getClaimFreshnessDays(claim.lastVerified) > maxFreshnessDays).length;
  const unresolvedHighRiskGapCount = highRiskClaims.filter((claim) => isUnresolvedStatus(claim.status)).length;
  const factIntegrityScore = totalClaims === 0
    ? 100
    : Math.max(0, Math.round(((totalClaims - factErrorClaimIds.size) / totalClaims) * 100));
  const consistencyScore = mappedConsistencyClaims.length === 0
    ? 100
    : Math.max(0, Math.round(((mappedConsistencyClaims.length - consistencyClaimIds.size) / mappedConsistencyClaims.length) * 100));
  const hasErrors = issues.some((issue) => issue.level === "error");
  const hasWarnings = issues.some((issue) => issue.level === "warning");

  return {
    auditMode: "advisory",
    factIntegrityScore,
    consistencyScore,
    criticalClaimFreshnessDays,
    staleHighRiskClaimCount,
    effectiveHighRiskGapCount: Math.max(product.highRiskVerificationGapCount, unresolvedHighRiskGapCount),
    gate: hasErrors ? "fail" : hasWarnings ? "warn" : "pass"
  };
}
