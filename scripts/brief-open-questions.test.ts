import path from "node:path";

import { describe, expect, it } from "vitest";

import { briefCandidates } from "../src/briefs/discovery";
import {
  loadOpenQuestionRows,
  summarizeOpenQuestions,
  toClaimMapRelativePath,
  type OpenQuestionRow
} from "./brief-open-questions";
import {
  discoverClaimMapWorkspaces,
  getClaimMapPath,
  readClaimMap
} from "./research-audit/shared";

const rootDir = process.cwd();
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function makeRow(overrides: Partial<OpenQuestionRow["question"]> = {}): OpenQuestionRow {
  return {
    workspace: "MexTm",
    productSlug: "mexico",
    question: {
      id: "MX-OQ-999",
      question: "fixture",
      raisedOn: "2026-08-01",
      claimIds: ["MX-ENF-001"],
      ...overrides
    }
  };
}

// 이 파일이 이 lane의 게이트다. `validateClaimMap`(= audit:facts의 계약)은 openQuestions를 보지
// 않는다 — 두 게이트를 섞으면 fact freshness 점수와 미결 위생이 서로를 가린다.
describe("workspace open question contract", () => {
  it("keeps every recorded open question resolvable and anchored to a real claim", () => {
    const seenIds = new Set<string>();
    const candidateIds = new Set(briefCandidates.map((candidate) => candidate.id));

    for (const workspace of discoverClaimMapWorkspaces(rootDir)) {
      const document = readClaimMap(getClaimMapPath(rootDir, workspace));
      const claimIds = new Set(document.claims.map((claim) => claim.id));

      for (const question of document.openQuestions ?? []) {
        expect(seenIds.has(question.id), `duplicate open question id ${question.id}`).toBe(false);
        seenIds.add(question.id);

        expect(question.question.trim().length, `${question.id} has no question`).toBeGreaterThan(0);
        expect(question.raisedOn, `${question.id} raisedOn`).toMatch(isoDate);

        // 어떤 claim에도 닿지 않는 미결은 이 파일의 것이 아니다. 닿는 claim이 없으면
        // 그 질문은 워크스페이스 안에서 주인이 없어진다.
        expect(question.claimIds.length, `${question.id} has no claimIds`).toBeGreaterThan(0);

        for (const claimId of question.claimIds) {
          expect(claimIds.has(claimId), `${question.id} → unknown claim ${claimId}`).toBe(true);
        }

        // 다리의 반대편. 후보 id를 적어 놓고 그 후보가 실재하지 않으면 "넘어갔다"는 표시가 거짓이 된다.
        if (question.candidateId) {
          expect(
            candidateIds.has(question.candidateId),
            `${question.id} → unknown candidate ${question.candidateId}`
          ).toBe(true);
        }

        if (question.resolvedOn) {
          expect(question.resolvedOn, `${question.id} resolvedOn`).toMatch(isoDate);
          // 무엇으로 닫혔는지 없이 닫으면 같은 질문이 몇 달 뒤 처음부터 다시 올라온다.
          expect(
            question.resolution?.trim().length,
            `${question.id} is resolved without a resolution`
          ).toBeGreaterThan(0);
          expect(
            question.resolvedOn >= question.raisedOn,
            `${question.id} resolved before it was raised`
          ).toBe(true);
        } else {
          expect(question.resolution, `${question.id} is open but carries a resolution`).toBeUndefined();
        }
      }
    }
  });

  it("loads rows from every workspace that has a claim-map", () => {
    const rows = loadOpenQuestionRows(rootDir);
    const workspaces = new Set(rows.map((row) => row.workspace));

    // 시드는 MexTm·ChaTm에만 있다. 나머지 워크스페이스는 기록된 미결이 없다는 뜻이지
    // 로더가 그 워크스페이스를 건너뛴다는 뜻이 아니다 — 목록은 claim-map 실재로 도출된다.
    expect(discoverClaimMapWorkspaces(rootDir).length).toBeGreaterThan(workspaces.size);
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.productSlug.trim().length).toBeGreaterThan(0);
      expect(toClaimMapRelativePath(row.workspace)).toBe(
        path.posix.join(row.workspace, "content/research/claim-map.json")
      );
    }
  });

  it("keeps the Mexican enforcement question wired to the candidate it produced", () => {
    // 이 lane이 왜 생겼는지를 데이터로 잠근다. 2026-08-30 재대조가 남긴 미결이 후보로 넘어간
    // 경로가 사라지면, 진단이 짚은 그 단절이 조용히 되돌아온다.
    const rows = loadOpenQuestionRows(rootDir);
    const mexicoEnforcement = rows.find((row) => row.question.id === "MX-OQ-001");

    expect(mexicoEnforcement?.workspace).toBe("MexTm");
    expect(mexicoEnforcement?.question.claimIds).toContain("MX-ENF-001");
    expect(mexicoEnforcement?.question.candidateId).toBe("2026-09-mexico-lfppi-implementing-rules");
  });
});

describe("open question summary", () => {
  const now = new Date("2026-09-07T00:00:00.000Z");

  it("sorts open questions oldest first and counts age in whole UTC days", () => {
    const summary = summarizeOpenQuestions(
      [makeRow({ id: "new", raisedOn: "2026-09-01" }), makeRow({ id: "old", raisedOn: "2026-04-01" })],
      briefCandidates,
      now
    );

    expect(summary.open.map((entry) => entry.question.id)).toEqual(["old", "new"]);
    expect(summary.open[0].ageDays).toBe(159);
    expect(summary.open[1].ageDays).toBe(6);
  });

  it("drops resolved questions from the list but keeps the count", () => {
    const summary = summarizeOpenQuestions(
      [
        makeRow({ id: "open" }),
        makeRow({ id: "closed", resolvedOn: "2026-08-20", resolution: "1차 출처 대조 완료" })
      ],
      briefCandidates,
      now
    );

    expect(summary.open.map((entry) => entry.question.id)).toEqual(["open"]);
    expect(summary.resolvedCount).toBe(1);
  });

  it("separates the questions that never reached the backlog", () => {
    const linkedId = briefCandidates[0].id;
    const summary = summarizeOpenQuestions(
      [makeRow({ id: "linked", candidateId: linkedId }), makeRow({ id: "unlinked" })],
      briefCandidates,
      now
    );

    expect(summary.unlinked.map((entry) => entry.question.id)).toEqual(["unlinked"]);
    expect(summary.open.find((entry) => entry.question.id === "linked")?.candidate?.id).toBe(linkedId);
    expect(summary.open.find((entry) => entry.question.id === "unlinked")?.candidate).toBeUndefined();
  });

  it("leaves the candidate undefined when the id does not resolve", () => {
    const summary = summarizeOpenQuestions([makeRow({ candidateId: "no-such-candidate" })], briefCandidates, now);

    expect(summary.open[0].candidate).toBeUndefined();
    // unlinked는 "id를 안 적었다"만 센다. 잘못 적은 id는 위 계약 테스트가 잡는다.
    expect(summary.unlinked).toHaveLength(0);
  });
});
