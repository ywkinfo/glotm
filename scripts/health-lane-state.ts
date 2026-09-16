import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { RootHealthLaneId, RootHealthLaneStatus } from "../src/products/health";

// lane 결과는 파일에 남아 다음 `health:report`가 읽는다. 그 자체는 의도된 설계지만,
// 저장된 결과가 **언제 · 어느 트리에서** 나왔는지를 기록하지 않으면 리포트는 코드가 바뀐
// 뒤에도 같은 green을 계속 출력한다. 무효화 조건이 하나도 없기 때문이다.
//
// 그래서 lane마다 `recordedAt`과 `commit`을 함께 남긴다. 이건 무효화가 아니라 **표시**다 —
// 리포트는 여전히 "recent lane-state provenance summary"이고, 판단은 읽는 사람이 한다.
// 자동으로 지우면 방금 돌린 lane이 사라지는 쪽이 더 나쁘다.
export type StoredHealthLaneRecord = {
  status: RootHealthLaneStatus;
  recordedAt?: string;
  commit?: string;
};

type StoredHealthLaneState = {
  updatedAt: string;
  statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus | StoredHealthLaneRecord>>;
};

export const healthLaneStateFilePath = resolve(process.cwd(), ".omx/state/health-lane-status.json");

function isRootHealthLaneStatus(value: unknown): value is RootHealthLaneStatus {
  return value === "not-run" || value === "pass" || value === "fail";
}

function isRootHealthLaneId(value: string): value is RootHealthLaneId {
  return value === "runtime" || value === "content" || value === "release";
}

// 저장된 항목은 두 모양 중 하나다. 옛 파일은 상태 문자열만 들고 있고(provenance 없음),
// 새 파일은 레코드다. 옛 모양을 거부하면 이 변경 직후 첫 리포트가 lane을 통째로 잃는다.
function normalizeEntry(value: unknown): StoredHealthLaneRecord | null {
  if (isRootHealthLaneStatus(value)) {
    return { status: value };
  }

  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Partial<StoredHealthLaneRecord>;

  if (!isRootHealthLaneStatus(record.status)) {
    return null;
  }

  return {
    status: record.status,
    recordedAt: typeof record.recordedAt === "string" ? record.recordedAt : undefined,
    commit: typeof record.commit === "string" ? record.commit : undefined
  };
}

export function readStoredRootLaneRecords(
  filePath = healthLaneStateFilePath
): Partial<Record<RootHealthLaneId, StoredHealthLaneRecord>> {
  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredHealthLaneState>;
    const statuses = parsed.statuses ?? {};
    const records: Partial<Record<RootHealthLaneId, StoredHealthLaneRecord>> = {};

    for (const [laneId, value] of Object.entries(statuses)) {
      if (!isRootHealthLaneId(laneId)) {
        continue;
      }

      const record = normalizeEntry(value);

      if (record) {
        records[laneId] = record;
      }
    }

    return records;
  } catch {
    return {};
  }
}

export function readStoredRootStatuses(
  filePath = healthLaneStateFilePath
): Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> {
  return Object.fromEntries(
    Object.entries(readStoredRootLaneRecords(filePath)).map(([laneId, record]) => [
      laneId,
      record.status
    ])
  );
}

// 커밋을 못 읽으면 자리를 비워 둔다. 그럴듯한 값을 지어내면 리포트가 하지 않은 대조를
// 주장하게 된다(`git-last-modified.ts`가 날짜에 대해 지키는 규칙과 같다).
export function resolveCurrentCommit(cwd = process.cwd()): string | undefined {
  try {
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();

    return /^[0-9a-f]{40}$/.test(commit) ? commit : undefined;
  } catch {
    return undefined;
  }
}

// 커밋은 값이 아니라 **조회 함수**로 받는다. 기본 인자에 `resolveCurrentCommit()`를 두면
// 호출자가 undefined를 넘겨도 기본값이 발동해, "git이 답하지 못하는 상태"를 표현할 방법이 없다.
export function writeStoredRootStatus(
  laneId: RootHealthLaneId,
  status: RootHealthLaneStatus,
  filePath = healthLaneStateFilePath,
  resolveCommit: () => string | undefined = resolveCurrentCommit
) {
  const commit = resolveCommit();
  const recordedAt = new Date().toISOString();
  const nextState: StoredHealthLaneState = {
    updatedAt: recordedAt,
    statuses: {
      ...readStoredRootLaneRecords(filePath),
      [laneId]: { status, recordedAt, commit }
    }
  };

  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");

  return nextState;
}
