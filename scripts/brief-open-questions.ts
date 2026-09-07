// 워크스페이스 claim-map의 미결(`openQuestions`)을 발굴 lane 표면으로 올리는 다리다.
//
// 왜 있는가. 2026-09-07 지연 진단(`docs/briefs-discovery-latency-review.md` 3.1)이 짚은 결함은
// "미결을 못 봤다"가 아니라 **"미결을 적을 자리는 있는데 발굴 lane으로 옮길 통로가 없다"**였다.
// 2026-08-30 MexTm 재대조는 `MX-ENF-001`에 "WIPO Lex 게재본은 2020년 원문이라 2026-04-03 개정
// 반영본이 아니다 — 별도 확인 대상"이라고 정확히 적었고, 그 문장이 가리킨 곳에 실제로 답이 있었다.
// 그런데 그건 JSON `notes` 산문이라 타입도 id도 큐도 표면도 없었고, `discovery.ts`는 워크스페이스
// claim-map을 읽지 않는다. 그래서 8일 뒤 WebSearch triage가 같은 것을 처음부터 다시 발굴했다.
//
// 이 모듈은 **표시 계층이다. 게이트가 아니다** — radar의 다른 블록과 같은 성격이고, 구조 강제는
// `brief-open-questions.test.ts`가 한다. 순수 계산(`summarizeOpenQuestions`)과 I/O(`loadOpenQuestionRows`)를
// 나눠 둔 이유는 `discoveryReport.ts`와 같다: 테스트가 fixture로 계산을 덮을 수 있어야 한다.
//
// `src/briefs/`가 아니라 `scripts/`에 있는 이유: 이 계산은 워크스페이스 claim-map을 읽어야 하는데
// 그건 파일 I/O이고, `src/briefs/discoveryReport.ts`는 I/O 없는 순수 모듈이라는 계약을 지고 있다.

import path from "node:path";

import { briefCandidates } from "../src/briefs/discovery";
import type { BriefCandidate } from "../src/briefs/discovery";
import { elapsedUtcDays } from "../src/briefs/discoveryReport";
import {
  discoverClaimMapWorkspaces,
  getClaimMapPath,
  readClaimMap
} from "./research-audit/shared";
import type { ClaimOpenQuestion } from "./research-audit/shared";

export type OpenQuestionRow = {
  workspace: string;
  productSlug: string;
  question: ClaimOpenQuestion;
};

// claim-map을 가진 워크스페이스를 전부 훑는다. 목록을 하드코딩하지 않는 이유는
// `discoverClaimMapWorkspaces`의 주석에 있다.
export function loadOpenQuestionRows(rootDir = process.cwd()): OpenQuestionRow[] {
  const rows: OpenQuestionRow[] = [];

  for (const workspace of discoverClaimMapWorkspaces(rootDir)) {
    const document = readClaimMap(getClaimMapPath(rootDir, workspace));

    for (const question of document.openQuestions ?? []) {
      rows.push({ workspace, productSlug: document.productSlug, question });
    }
  }

  return rows;
}

export type OpenQuestionEntry = OpenQuestionRow & {
  ageDays: number | null;
  // 발굴 백로그로 넘어갔는가. undefined인 것이 이 표면의 신호다 — 후보가 되지 못한 질문은
  // 워크스페이스 안에서만 늙고, 발굴 회차는 그것을 승계하지 못한다.
  candidate: BriefCandidate | undefined;
};

export type OpenQuestionSummary = {
  // 열린 미결, 오래된 순. 먼저 답하라는 뜻이 아니라 먼저 판단하라는 뜻이다(백로그 정체 표시와 같다).
  open: OpenQuestionEntry[];
  // 열려 있으면서 후보도 없는 것. 다음 sweep이 실제로 주울 대상이다.
  unlinked: OpenQuestionEntry[];
  // 닫힌 것은 목록에서 빼고 수만 남긴다. 안 그러면 이 표면이 영원히 자란다.
  resolvedCount: number;
};

export function summarizeOpenQuestions(
  rows: OpenQuestionRow[] = loadOpenQuestionRows(),
  candidates: BriefCandidate[] = briefCandidates,
  now = new Date()
): OpenQuestionSummary {
  const open: OpenQuestionEntry[] = [];
  let resolvedCount = 0;

  for (const row of rows) {
    if (row.question.resolvedOn) {
      resolvedCount += 1;
      continue;
    }

    open.push({
      ...row,
      ageDays: elapsedUtcDays(row.question.raisedOn, now),
      candidate: candidates.find((candidate) => candidate.id === row.question.candidateId)
    });
  }

  open.sort((left, right) => (right.ageDays ?? 0) - (left.ageDays ?? 0));

  return {
    open,
    unlinked: open.filter((entry) => !entry.question.candidateId),
    resolvedCount
  };
}

// 워크스페이스 이름에서 파생되는 claim-map 경로를 리포트 각주에 쓰기 위한 헬퍼.
export function toClaimMapRelativePath(workspace: string) {
  return path.posix.join(workspace, "content/research/claim-map.json");
}
