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

  // HIGH risk claim이 소스 하나에만 기대고 있는 자리를 매 회차 보이게 한다. 실패로 올리지 않는 이유는
  // **단일 소스가 전부 결함은 아니기 때문**이다 — 조문·판결·공식 등록부 자체를 근거로 삼은 claim은
  // 소스가 하나인 것이 정확하고, 두 번째를 붙이면 오히려 근거가 안내면 쪽으로 내려간다
  // (EuTm register가 EUIPO 안내면을 EUTMR 조문으로 **대체**한 결정이 그 사례다).
  //
  // 결함은 **안내면 하나**에 기댄 쪽이다. 그 페이지가 사라지거나(`euipo-fees`: 200으로 404) 본문이
  // 비면(`euipo-priority-guidelines`: 2,268바이트 JS 셸) 근거가 0이 된다. 둘을 가르는 것은 사람의
  // 판단이라 게이트가 아니라 목록으로 둔다 — 분류와 조문 큐는 `docs/single-source-high-risk-claims.md`.
  const singleSourceHighRisk = document.claims
    .filter((claim) => claim.riskLevel === "HIGH" && claim.sourceIds.length === 1)
    .map((claim) => `${claim.id}(${claim.sourceIds[0]})`);

  if (singleSourceHighRisk.length > 0) {
    issues.push({
      level: "info",
      audit: "facts",
      message: `단일 소스 HIGH claim ${singleSourceHighRisk.length}건 — ${singleSourceHighRisk.join(", ")} (분류·조문 큐: docs/single-source-high-risk-claims.md)`
    });
  }

  return issues;
}
