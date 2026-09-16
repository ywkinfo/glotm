import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  readStoredRootLaneRecords,
  readStoredRootStatuses,
  writeStoredRootStatus
} from "./health-lane-state";

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

  it("records when and at which commit a lane result was produced", () => {
    writeStoredRootStatus("runtime", "pass", stateFilePath, () => "b".repeat(40));

    expect(readStoredRootLaneRecords(stateFilePath)).toEqual({
      runtime: {
        status: "pass",
        recordedAt: "2026-04-04T12:00:00.000Z",
        commit: "b".repeat(40)
      }
    });
  });

  it("leaves the commit empty rather than inventing one when git cannot answer", () => {
    writeStoredRootStatus("release", "fail", stateFilePath, () => undefined);

    expect(readStoredRootLaneRecords(stateFilePath).release).toEqual({
      status: "fail",
      recordedAt: "2026-04-04T12:00:00.000Z",
      commit: undefined
    });
  });

  it("keeps reading lane results written before provenance existed", () => {
    // 옛 파일은 상태 문자열만 들고 있다. 거부하면 이 변경 직후 첫 리포트가 lane을 통째로 잃는다.
    writeFileSync(
      stateFilePath,
      JSON.stringify({
        updatedAt: "2026-04-04T12:00:00.000Z",
        statuses: { runtime: "pass", content: "fail" }
      }),
      "utf8"
    );

    expect(readStoredRootStatuses(stateFilePath)).toEqual({ runtime: "pass", content: "fail" });
    expect(readStoredRootLaneRecords(stateFilePath)).toEqual({
      runtime: { status: "pass" },
      content: { status: "fail" }
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
