import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readStoredRootStatuses, writeStoredRootStatus } from "./health-lane-state";

describe("health lane state helpers", () => {
  let tempDir: string;
  let stateFilePath: string;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00.000Z"));
    tempDir = mkdtempSync(join(tmpdir(), "glotm-health-state-"));
    stateFilePath = join(tempDir, "health-lane-status.json");
  });

  afterEach(() => {
    vi.useRealTimers();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns an empty object when the state file is missing or invalid", () => {
    expect(readStoredRootStatuses(stateFilePath)).toEqual({});

    writeFileSync(stateFilePath, "{ invalid json", "utf8");
    expect(readStoredRootStatuses(stateFilePath)).toEqual({});
  });

  it("writes and merges lane statuses", () => {
    writeStoredRootStatus("runtime", "pass", stateFilePath);
    writeStoredRootStatus("content", "fail", stateFilePath);

    expect(readStoredRootStatuses(stateFilePath)).toEqual({
      runtime: "pass",
      content: "fail"
    });
  });

  it("ignores unknown lanes and statuses from the stored file", () => {
    writeFileSync(
      stateFilePath,
      JSON.stringify({
        updatedAt: "2026-04-04T12:00:00.000Z",
        statuses: {
          runtime: "pass",
          release: "not-run",
          unknown: "pass",
          content: "broken"
        }
      }),
      "utf8"
    );

    expect(readStoredRootStatuses(stateFilePath)).toEqual({
      runtime: "pass",
      release: "not-run"
    });
  });
});
