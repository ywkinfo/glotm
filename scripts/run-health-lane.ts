import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

import type { RootHealthLaneId, RootHealthLaneStatus } from "../src/products/health";
import { writeStoredRootStatus } from "./health-lane-state";

function isRootHealthLaneId(value?: string): value is RootHealthLaneId {
  return value === "runtime" || value === "content" || value === "release";
}

type RunHealthLaneOptions = {
  cwd?: string;
  stateFilePath?: string;
};

export function runHealthLane(
  laneId: RootHealthLaneId,
  command: string,
  options: RunHealthLaneOptions = {}
) {
  return new Promise<number>((resolveExitCode) => {
    const child = spawn(command, {
      cwd: options.cwd ?? process.cwd(),
      shell: true,
      stdio: "inherit"
    });

    child.on("error", () => {
      writeStoredRootStatus(laneId, "fail", options.stateFilePath);
      resolveExitCode(1);
    });

    child.on("exit", (code, signal) => {
      const exitCode = typeof code === "number" ? code : signal ? 1 : 0;
      const status: RootHealthLaneStatus = exitCode === 0 ? "pass" : "fail";

      writeStoredRootStatus(laneId, status, options.stateFilePath);
      resolveExitCode(exitCode);
    });
  });
}

async function main() {
  const [laneId, ...commandParts] = process.argv.slice(2);

  if (!isRootHealthLaneId(laneId) || commandParts.length === 0) {
    console.error("Usage: node --import tsx scripts/run-health-lane.ts <runtime|content|release> <command>");
    process.exitCode = 1;
    return;
  }

  const exitCode = await runHealthLane(laneId, commandParts.join(" "));
  process.exitCode = exitCode;
}

const entryArg = process.argv[1];

if (entryArg && import.meta.url === pathToFileURL(entryArg).href) {
  void main();
}
