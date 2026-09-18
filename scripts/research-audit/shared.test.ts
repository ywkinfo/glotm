import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getCriticalClaimStalenessDays, isFutureUtcDate, readClaimMap, validateClaimMap, type ClaimMapDocument } from "./shared";

const tempDirs: string[] = [];

function createTempFile(contents: string) {
  const directory = mkdtempSync(path.join(tmpdir(), "glotm-research-"));
  const filePath = path.join(directory, "claim-map.json");
  tempDirs.push(directory);
  writeFileSync(filePath, contents, "utf8");
  return filePath;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

describe("research audit shared helpers", () => {
  it("reads a valid claim map", () => {
    const filePath = createTempFile(JSON.stringify({
      workspace: "ChaTm",
      productSlug: "china",
      version: 1,
      auditMode: "advisory",
      claims: [
        {
          id: "CN-TEST-001",
          jurisdiction: "CN",
          claim: "test claim",
          chapterRefs: ["Ch1"],
          riskLevel: "HIGH",
          sourceIds: ["source-1"],
          lastVerified: "2026-03-31",
          status: "BODY_READY"
        }
      ]
    }));

    const document = readClaimMap(filePath);
    expect(document.workspace).toBe("ChaTm");
    expect(validateClaimMap(document)).toEqual([]);
  });

  it("rejects duplicate claim ids", () => {
    const document: ClaimMapDocument = {
      workspace: "ChaTm",
      productSlug: "china",
      version: 1,
      auditMode: "advisory",
      claims: [
        {
          id: "CN-TEST-001",
          jurisdiction: "CN",
          claim: "first",
          chapterRefs: ["Ch1"],
          riskLevel: "HIGH",
          sourceIds: ["source-1"],
          lastVerified: "2026-03-31",
          status: "BODY_READY"
        },
        {
          id: "CN-TEST-001",
          jurisdiction: "CN",
          claim: "second",
          chapterRefs: ["Ch2"],
          riskLevel: "MEDIUM",
          sourceIds: ["source-2"],
          lastVerified: "2026-03-31",
          status: "VERIFIED"
        }
      ]
    };

    expect(validateClaimMap(document)).toContainEqual(
      expect.objectContaining({ claimId: "CN-TEST-001", message: expect.stringContaining("중복") })
    );
  });

  it("rejects unknown status values", () => {
    const filePath = createTempFile(JSON.stringify({
      workspace: "ChaTm",
      productSlug: "china",
      version: 1,
      auditMode: "advisory",
      claims: [
        {
          id: "CN-TEST-001",
          jurisdiction: "CN",
          claim: "test claim",
          chapterRefs: ["Ch1"],
          riskLevel: "HIGH",
          sourceIds: ["source-1"],
          lastVerified: "2026-03-31",
          status: "INVALID"
        }
      ]
    }));
    const document = readClaimMap(filePath);

    expect(validateClaimMap(document)).toContainEqual(
      expect.objectContaining({ claimId: "CN-TEST-001", message: expect.stringContaining("status") })
    );
  });

  // `getClaimFreshnessDays`가 `Math.max(0, …)`으로 클램프하기 때문에 미래 일자는 freshness 0으로
  // 읽히고 staleness 경고도 나지 않는다. 즉 하루 더 신선해 보이는 값이 조용히 통과한다.
  // 저장소 데이터에 대한 계약은 `claim-verification-date.test.ts`가, 판정 자체는 여기가 잠근다.
  it("reads a lastVerified as future only when it passes today's UTC day", () => {
    // 2026-09-17 09:00 KST = 2026-09-17 00:00Z — KST 오전에 찍은 그날 날짜는 미래가 아니다.
    expect(isFutureUtcDate("2026-09-17", new Date("2026-09-17T00:00:00.000Z"))).toBe(false);
    // 같은 값을 KST 저녁(= UTC 전날)에 찍으면 미래다. 2026-09-17 회차 10건이 이 경로였다.
    expect(isFutureUtcDate("2026-09-17", new Date("2026-09-16T22:00:00.000Z"))).toBe(true);
    expect(isFutureUtcDate("2026-09-16", new Date("2026-09-16T22:00:00.000Z"))).toBe(false);
    expect(isFutureUtcDate("not-a-date", new Date("2026-09-16T22:00:00.000Z"))).toBe(false);
  });

  it("keeps claim staleness thresholds decoupled from lane freshness", () => {
    // fact-claim staleness는 scorecard의 lane freshness(180/150/120)와 분리돼야 한다.
    // lane 윈도를 완화해도 이 값은 이전 기준(120/90/60)을 유지한다.
    expect(getCriticalClaimStalenessDays("pilot")).toBe(120);
    expect(getCriticalClaimStalenessDays("beta")).toBe(90);
    expect(getCriticalClaimStalenessDays("mature")).toBe(60);
  });
});
