import { existsSync, readdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getClaimMapPath, readClaimMap, type ClaimMapEntry } from "./shared";

const rootDir = process.cwd();

// 워크스페이스 목록을 손으로 들고 있으면 새 워크스페이스가 조용히 가드 밖에 남는다.
// 실제로 그렇게 됐다: 이 배열이 JapTm·UsaTm 2개만 담고 있는 동안 ChaTm·MexTm은 register 파일이
// 아예 없었고 EuTm은 sourceId 8개가 표에 없었는데도 `audit:facts`는 factIntegrity=100을 냈다.
// 그래서 목록을 고정하지 않고 claim-map을 가진 워크스페이스를 전부 찾아 register를 요구한다.
function discoverClaimMapWorkspaces() {
  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((name) => existsSync(path.resolve(rootDir, name, "content/research/claim-map.json")))
    .sort();
}

// register 파일명 규약: `<workspace>/content/research/*_source_register.md` 하나.
function findRegisterPath(workspace: string) {
  const researchDir = path.resolve(rootDir, workspace, "content/research");
  const matches = readdirSync(researchDir).filter((name) => name.endsWith("_source_register.md"));

  return matches.length === 1 ? `${workspace}/content/research/${matches[0]}` : null;
}

const workspaces = discoverClaimMapWorkspaces().map((workspace) => ({
  workspace,
  registerPath: findRegisterPath(workspace)
}));

function readRepoFile(relativePath: string) {
  return readFileSync(path.resolve(rootDir, relativePath), "utf8");
}

// source register의 매핑 표는 첫 열이 sourceId이고 같은 행에 URL이 온다.
// `audit:facts`는 HIGH risk claim에 sourceId가 "몇 개 있는지"만 세므로, 실재하지 않는 sourceId를
// 써도 factIntegrity=100이 나온다. 그 빈틈을 여기서 막는다.
function collectRegisteredSources(markdown: string) {
  const sources = new Map<string, string>();

  for (const line of markdown.split("\n")) {
    if (!line.trimStart().startsWith("|")) {
      continue;
    }

    const cells = line.split("|").map((cell) => cell.trim());
    const sourceId = cells[1] ?? "";

    if (!/^[a-z0-9][a-z0-9-]*$/.test(sourceId)) {
      continue;
    }

    sources.set(sourceId, cells.find((cell) => cell.includes("https://")) ?? "");
  }

  return sources;
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
  const registered = collectRegisteredSources(readRepoFile(registerPath as string));

  it("모든 claim sourceId가 source register에 등록돼 있다", () => {
    const missing = claimMap.claims.flatMap((claim) =>
      claim.sourceIds
        .filter((sourceId) => !registered.has(sourceId))
        .map((sourceId) => `${claim.id} → ${sourceId}`)
    );

    expect(missing).toEqual([]);
  });

  it("claim이 참조하는 sourceId는 URL까지 추적된다", () => {
    const untraceable = claimMap.claims.flatMap((claim) =>
      claim.sourceIds
        .filter((sourceId) => !registered.get(sourceId))
        .map((sourceId) => `${claim.id} → ${sourceId}`)
    );

    expect(untraceable).toEqual([]);
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
