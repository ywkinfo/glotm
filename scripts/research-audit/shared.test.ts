import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { readClaimMap, validateClaimMap, type ClaimMapDocument } from "./shared";

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
});
