import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import type { LifecycleStatus, ProductMeta } from "../../src/products/shared";

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

// 워크스페이스가 "이건 아직 확인 못 했다"를 적는 자리다. 종전에는 claim의 `notes` 산문에만 있었고,
// 그래서 발굴 lane이 읽을 수 없었다 — 2026-09-07 지연 진단이 짚은 결함이다
// (`docs/briefs-discovery-latency-review.md` 3.1: 8/30 재대조가 답을 가리키는 문장을 적고도
// 큐로 넘기지 못했다). 구조 강제는 `scripts/brief-open-questions.test.ts`가 하고,
// `validateClaimMap`(= audit:facts의 계약)은 이 필드를 보지 않는다. 두 게이트를 섞지 않는다.
export type ClaimOpenQuestion = {
  // 워크스페이스 안에서 고유. claim id와 같은 형태를 쓴다(예: MX-OQ-001).
  id: string;
  // 무엇을 확인해야 닫히는가. "확인 필요" 같은 말이 아니라 확인 대상을 적는다.
  question: string;
  raisedOn: string;
  // 이 미결이 걸려 있는 claim. 최소 1개 — 어떤 claim에도 닿지 않는 미결은 이 파일의 것이 아니다.
  claimIds: string[];
  // 발굴 백로그로 넘어갔으면 그 후보 id. 비어 있는 것이 이 표면의 신호다.
  candidateId?: string;
  resolvedOn?: string;
  // resolvedOn이 있으면 필수. 무엇으로 닫혔는지 없이 닫으면 같은 질문이 몇 달 뒤 다시 올라온다.
  resolution?: string;
};

export type ClaimMapDocument = {
  workspace: string;
  productSlug: string;
  version: number;
  auditMode: "advisory";
  claims: ClaimMapEntry[];
  openQuestions?: ClaimOpenQuestion[];
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

// 워크스페이스 목록을 손으로 들고 있으면 새 워크스페이스가 조용히 가드 밖에 남는다 —
// `claim-source-register.test.ts`가 실제로 그 사고를 겪고 이 방식으로 바꿨다. 그 발견을
// 테스트 안에 가둬 두면 다음 소비자가 같은 실수를 반복하므로 여기로 올려 공유한다.
export function discoverClaimMapWorkspaces(rootDir: string) {
  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((name) => existsSync(getClaimMapPath(rootDir, name)))
    .sort();
}

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

// Fact-claim staleness 임계값. scorecard의 lane freshness와 분리된 fact-currency 기준이다.
// lane 윈도(pilot 180 / beta 150 / mature 120)를 완화해도 claim staleness 보고가 흔들리지 않도록
// 별도 값으로 고정한다. 값 자체는 이전 lane 윈도(120/90/60)를 그대로 이어받아 보고 강도를 보존한다.
const claimStalenessDaysByLifecycle: Record<LifecycleStatus, number> = {
  pilot: 120,
  beta: 90,
  mature: 60
};

export function getCriticalClaimStalenessDays(lifecycleStatus: LifecycleStatus): number {
  return claimStalenessDaysByLifecycle[lifecycleStatus];
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
