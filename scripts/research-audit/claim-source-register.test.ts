import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  discoverClaimMapWorkspaces,
  getClaimMapPath,
  readClaimMap,
  type ClaimMapEntry
} from "./shared";
import { parseSourceRegister } from "./source-register";

const rootDir = process.cwd();

// register 파일명 규약: `<workspace>/content/research/*_source_register.md` 하나.
function findRegisterPath(workspace: string) {
  const researchDir = path.resolve(rootDir, workspace, "content/research");
  const matches = readdirSync(researchDir).filter((name) => name.endsWith("_source_register.md"));

  return matches.length === 1 ? `${workspace}/content/research/${matches[0]}` : null;
}

const workspaces = discoverClaimMapWorkspaces(rootDir).map((workspace) => ({
  workspace,
  registerPath: findRegisterPath(workspace)
}));

function readRepoFile(relativePath: string) {
  return readFileSync(path.resolve(rootDir, relativePath), "utf8");
}

function findClaim(claims: ClaimMapEntry[], claimId: string) {
  const claim = claims.find((entry) => entry.id === claimId);

  if (!claim) {
    throw new Error(`claim-map에 ${claimId}이 없습니다.`);
  }

  return claim;
}

it("claim-map을 가진 워크스페이스는 전부 source register를 갖는다", () => {
  const withoutRegister = workspaces.filter((entry) => entry.registerPath === null);

  expect(withoutRegister.map((entry) => entry.workspace)).toEqual([]);
});

// register가 없는 워크스페이스는 위 테스트가 이미 실패로 잡는다. 여기서 또 터뜨리면
// collection 단계에서 파일 전체가 죽어 나머지 가드까지 못 돌린다.
const workspacesWithRegister = workspaces.filter((entry) => entry.registerPath !== null);

describe.each(workspacesWithRegister)("$workspace claim-map ↔ source register", ({ workspace, registerPath }) => {
  const claimMap = readClaimMap(getClaimMapPath(rootDir, workspace));
  const register = parseSourceRegister(readRepoFile(registerPath as string));
  const claimById = new Map(claimMap.claims.map((claim) => [claim.id, claim]));

  // `audit:facts`는 HIGH risk claim에 sourceId가 "몇 개 있는지"만 세므로, 실재하지 않는 sourceId를
  // 써도 factIntegrity=100이 나온다. 그 빈틈을 여기서 막는다.
  //
  // 폐기된 sourceId도 여기서 걸린다. 폐기 행은 URL이 없어 index에 들어가지 않기 때문이다 —
  // 종전 파서는 표 행이기만 하면 등록으로 쳐서, 폐기된 id를 참조해도 "등록돼 있다"를 통과하고
  // 다음 가드에서 URL이 비었다는 엉뚱한 이유로 터졌다.
  it("모든 claim sourceId가 source register index에 등록돼 있다", () => {
    const missing = claimMap.claims.flatMap((claim) =>
      claim.sourceIds
        .filter((sourceId) => !register.index.has(sourceId))
        .map((sourceId) => {
          const substitution = register.substitutions.find((entry) => entry.sourceId === sourceId);

          return substitution
            ? `${claim.id} → ${sourceId} (폐기됨 · 대체: ${substitution.replacementIds.join(", ") || "미지정"})`
            : `${claim.id} → ${sourceId}`;
        })
    );

    expect(missing).toEqual([]);
  });

  // 종료 점검의 본체. register가 "이 sourceId 말고 저것이 실제 근거였다"를 적어 두면, 그 claim이
  // 실제로 저것을 들고 있는지를 여기서 강제한다.
  //
  // 2026-09-13이 `euipo-fees`를 폐기하며 `EU-FEE-001`의 근거를 `eutmr-consolidated`로 옮긴다고
  // 적고 sourceIds 정리를 빠뜨린 것이 이 가드가 겨누는 실패다. 그때는 claim에 남은 죽은 id 덕분에
  // 위 가드가 대신 잡았지만, 하루 뒤 `EU-PRIO-001`에서는 죽은 id가 없어(URL은 살아 있고 본문만
  // JS 셸이었다) 아무 게이트도 울지 않았다.
  //
  // `A / B` 처럼 갈래로 적힌 행이 있으므로 **전부가 아니라 하나 이상**을 요구한다 — 어느 갈래로
  // 옮겼는지는 claim마다 다르다.
  it("대체 행이 지정한 claim은 그 대체 근거를 sourceIds에 갖는다", () => {
    const unlinked = register.substitutions.flatMap((substitution) =>
      substitution.claimIds
        .map((claimId) => claimById.get(claimId))
        .filter((claim): claim is ClaimMapEntry => claim !== undefined)
        .filter(
          (claim) =>
            !substitution.replacementIds.some((sourceId) => claim.sourceIds.includes(sourceId))
        )
        .map(
          (claim) =>
            `${registerPath}:${substitution.line} ${substitution.sourceId} → ${claim.id} (대체: ${substitution.replacementIds.join(", ")})`
        )
    );

    expect(unlinked).toEqual([]);
  });

  // claim을 지정해 놓고 대체 근거가 하나도 해석되지 않으면 위 가드가 아무것도 강제하지 않는다.
  // 오타 하나로 의무가 조용히 사라지는 것을 막는다.
  it("claim을 지정한 대체 행은 index에서 해석되는 대체 근거를 갖는다", () => {
    const vacuous = register.substitutions
      .filter(
        (substitution) =>
          substitution.claimIds.length > 0 && substitution.replacementIds.length === 0
      )
      .map((substitution) => `${registerPath}:${substitution.line} ${substitution.sourceId}`);

    expect(vacuous).toEqual([]);
  });

  // claim이 사라졌거나 id가 바뀌었는데 대체 행이 옛 id를 붙들고 있으면, 그 행은 아무 claim도
  // 지키지 않으면서 지키는 것처럼 보인다.
  it("대체 행이 가리키는 claim id가 claim-map에 실재한다", () => {
    const dangling = register.substitutions.flatMap((substitution) =>
      substitution.claimIds
        .filter((claimId) => !claimById.has(claimId))
        .map((claimId) => `${registerPath}:${substitution.line} ${substitution.sourceId} → ${claimId}`)
    );

    expect(dangling).toEqual([]);
  });
});

describe("JapTm 법령 소스 최신성", () => {
  // 2026-08-15 확인: 3047/en은 "Last Version: Act No. 55 of 2015" 번역이라 2023년 개정(법률 제51호)으로
  // 신설된 상표법 제4조 제4항(병존동의)이 아예 없다. JP-CONSENT-001의 근거가 될 수 없는 소스였다.
  // 2149/en도 같은 이유로 현행 부정경쟁방지법을 뒷받침하지 못한다.
  //
  // 스킴이 붙은 형태만 막는다. 이 URL들이 왜 부적격이었는지 기록한 fact log의 서술
  // (백틱 안의 호스트명 표기)까지 지우면, 다음 세션이 같은 번역본을 다시 주워 온다.
  const staleTranslationUrls = [
    "https://www.japaneselawtranslation.go.jp/en/laws/view/3047/en",
    "https://www.japaneselawtranslation.go.jp/en/laws/view/2149/en"
  ];

  const japanFiles = [
    "JapTm/content/research/jp_tm_source_register.md",
    "JapTm/content/research/jp_tm_fact_verification_log.md",
    "JapTm/content/research/jp_tm_accuracy_completeness_review.md",
    "JapTm/content/source/chapters/11-domain-design-copyright-unfair-competition.md"
  ];

  it.each(japanFiles)("%s가 구 영문 법령 번역을 출처로 걸지 않는다", (relativePath) => {
    const contents = readRepoFile(relativePath);
    const stale = staleTranslationUrls.filter((staleUrl) => contents.includes(staleUrl));

    expect(stale).toEqual([]);
  });

  it.each([
    "https://laws.e-gov.go.jp/law/334AC0000000127",
    "https://laws.e-gov.go.jp/law/405AC0000000047",
    "https://www.japaneselawtranslation.go.jp/en/laws/view/4764/en",
    "https://www.japaneselawtranslation.go.jp/en/laws/view/4709/en",
    "https://www.jpo.go.jp/system/trademark/gaiyo/consent/index.html"
  ])("현행 1차 출처 %s가 source register에 등록돼 있다", (url) => {
    expect(readRepoFile("JapTm/content/research/jp_tm_source_register.md")).toContain(url);
  });

  it("JP-REP-001의 chapterRefs가 실제 인용 장(Ch1·Ch5)을 가리킨다", () => {
    const claim = findClaim(readClaimMap(getClaimMapPath(rootDir, "JapTm")).claims, "JP-REP-001");

    expect(claim.chapterRefs).toEqual(["Ch1", "Ch5"]);
  });
});

describe("UsaTm 고위험 claim 정정 회귀 가드", () => {
  const claims = readClaimMap(getClaimMapPath(rootDir, "UsaTm")).claims;

  // 15 U.S.C. §1064(3)이 열거하는 것은 §1054 위반과 §1052의 (a)·(b)·(c)항 위반이다.
  // "§1052 위반"으로 뭉뚱그리면 5년 뒤에는 다툴 수 없는 §1052(d)(혼동)나 §1052(e)(기술적 표장)까지
  // 취소 사유인 것처럼 읽힌다.
  it("USA-CANC-001이 5년 후 사유를 §1052(a)-(c)로 좁힌다", () => {
    const claim = findClaim(claims, "USA-CANC-001");

    expect(claim.claim).toContain("§1052(a)");
    expect(claim.claim).not.toMatch(/§1054\s*\/\s*§1052\s*위반/);
  });

  // §1064(6): 등록 3년 경과 후에는 "상업적 사용이 전혀 없었던" 것 자체가 별도 취소 사유다.
  // 5년 축만 적으면 3년 축이 통째로 빠진다.
  it("USA-CANC-001이 §1064(6) never-used 경로를 함께 적는다", () => {
    const claim = findClaim(claims, "USA-CANC-001");

    expect(claim.claim).toContain("§1064(6)");
    expect(claim.claim).toMatch(/3년/);
  });

  // 19 CFR §133.25(a)는 §§133.22·133.23에만 적용되고, 그 30일은 "상품 제시일" 기산이며
  // good cause가 있으면 연장된다. §133.21(g)의 30일은 "압수 통지" 기산인 전혀 다른 시계다.
  it("USA-CBP-002가 두 30일의 기산점을 구분한다", () => {
    const claim = findClaim(claims, "USA-CBP-002");
    const text = `${claim.claim} ${claim.notes ?? ""}`;

    expect(text).toContain("133.25");
    expect(text).toContain("good cause");
    expect(text).toMatch(/제시(일|한)/);
    expect(text).toContain("압수 통지");
  });

  it("USA-CBP-002가 §133.25를 sourceIds로 추적한다", () => {
    const claim = findClaim(claims, "USA-CBP-002");

    expect(claim.sourceIds).toContain("cfr-19-133-25");
  });

  it("12장이 두 30일을 '같은 시계'로 묶지 않고 good cause 연장을 적는다", () => {
    const chapter = readRepoFile("UsaTm/content/source/chapters/12_monitoring-marketplace-domain-cbp.md");

    expect(chapter).not.toContain("어느 쪽이든 30일이라는 같은 시계");
    expect(chapter).toContain("같은 시계가 아니다");
    expect(chapter).toContain("133.25");
    expect(chapter).toContain("good cause");
  });
});
