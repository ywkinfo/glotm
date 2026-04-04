import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { RootHealthLaneId, RootHealthLaneStatus } from "../src/products/health";

type StoredHealthLaneState = {
  updatedAt: string;
  statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>>;
};

export const healthLaneStateFilePath = resolve(process.cwd(), ".omx/state/health-lane-status.json");

function isRootHealthLaneStatus(value: string): value is RootHealthLaneStatus {
  return value === "not-run" || value === "pass" || value === "fail";
}

export function readStoredRootStatuses(
  filePath = healthLaneStateFilePath
): Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> {
  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredHealthLaneState>;
    const statuses = parsed.statuses ?? {};

    return Object.fromEntries(
      Object.entries(statuses).filter((entry): entry is [RootHealthLaneId, RootHealthLaneStatus] => {
        const [laneId, status] = entry;

        return (
          (laneId === "runtime" || laneId === "content" || laneId === "release")
          && typeof status === "string"
          && isRootHealthLaneStatus(status)
        );
      })
    );
  } catch {
    return {};
  }
}

export function writeStoredRootStatus(
  laneId: RootHealthLaneId,
  status: RootHealthLaneStatus,
  filePath = healthLaneStateFilePath
) {
  const nextState: StoredHealthLaneState = {
    updatedAt: new Date().toISOString(),
    statuses: {
      ...readStoredRootStatuses(filePath),
      [laneId]: status
    }
  };

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");

  return nextState;
}
