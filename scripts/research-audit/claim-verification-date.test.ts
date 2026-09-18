import { describe, expect, it } from "vitest";

import {
  discoverClaimMapWorkspaces,
  getClaimMapPath,
  isFutureUtcDate,
  readClaimMap
} from "./shared";

const rootDir = process.cwd();
const workspaces = discoverClaimMapWorkspaces(rootDir);

// **내일 확인한 claim은 없다.** 그런데 그 값이 들어와도 아무것도 울지 않았다 —
// `getClaimFreshnessDays`가 `Math.max(0, …)`으로 클램프해서 미래 일자는 freshness 0으로 읽히고,
// staleness 경고도 나지 않으며, `validateClaimMap`은 비어 있는지만 본다. 즉 **하루 더 신선해 보이는
// 값이 조용히 통과한다.**
//
// 실제로 그 경로로 들어왔다. 2026-09-17 회차가 조문 앵커 10건을 stamp하면서 자기 지역 날짜(KST)를
// 적었는데 그 시각 UTC는 2026-09-16이었다. 저장소의 날짜 계산은 전부 UTC이므로
// (`startOfUtcDay`·`elapsedUtcDays`) 기준도 UTC로 잠근다.
//
// 이 검사는 `audit:facts` 파이프라인이 아니라 여기 있다. 그쪽 `validateClaimMap`은 `health-report`가
// **시계를 고정한 채로도** 부르고(그 테스트는 2026-06-10에 멈춘다) schema 에러가 나면 워크스페이스를
// 리포트에서 통째로 빼기 때문에, 시간 의존 검사를 거기 두면 고정 시계 아래서 리포트가 비어 버린다.
describe("claim lastVerified는 UTC 오늘을 넘지 않는다", () => {
  it.each(workspaces)("%s", (workspace) => {
    const claimMap = readClaimMap(getClaimMapPath(rootDir, workspace));
    const future = claimMap.claims
      .filter((claim) => isFutureUtcDate(claim.lastVerified))
      .map((claim) => `${claim.id} → ${claim.lastVerified}`);

    expect(future).toEqual([]);
  });

  // 워크스페이스가 하나도 안 잡히면 위 `it.each`가 0건으로 통과해 버린다.
  it("적어도 한 워크스페이스를 실제로 검사한다", () => {
    expect(workspaces.length).toBeGreaterThan(0);
  });
});
