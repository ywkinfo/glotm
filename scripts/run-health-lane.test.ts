import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readStoredRootStatuses } from "./health-lane-state";
import { runHealthLane } from "./run-health-lane";

describe("run health lane", () => {
  let tempDir: string;
  let stateFilePath: string;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00.000Z"));
    tempDir = mkdtempSync(join(tmpdir(), "glotm-health-runner-"));
    stateFilePath = join(tempDir, "health-lane-status.json");
  });

  afterEach(() => {
    vi.useRealTimers();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("stores a pass status when the command succeeds", async () => {
    const exitCode = await runHealthLane("runtime", "node -e \"process.exit(0)\"", {
      cwd: tempDir,
      stateFilePath
    });

    expect(exitCode).toBe(0);
    expect(readStoredRootStatuses(stateFilePath)).toEqual({
      runtime: "pass"
    });
  });

  it("stores a fail status when the command fails", async () => {
    const exitCode = await runHealthLane("release", "node -e \"process.exit(2)\"", {
      cwd: tempDir,
      stateFilePath
    });

    expect(exitCode).toBe(2);
    expect(readStoredRootStatuses(stateFilePath)).toEqual({
      release: "fail"
    });
  });
});
