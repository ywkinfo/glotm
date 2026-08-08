import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 정적 면의 lastmod를 그 면의 소스가 마지막으로 바뀐 커밋에서 끌어오기 위한 공용 조회.
// 워크스페이스 build-content.ts에도 같은 규칙이 있지만 그쪽은 각자 self-contained라
// (저장소 전체에 cross-workspace import가 없다) 의도적으로 공유하지 않는다.
//
// git이 정직하게 답할 수 없으면 undefined를 준다. 호출자가 fallback을 고르게 두는 편이
// 그럴듯하게 틀린 날짜를 발행하는 것보다 낫다.
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function gitLastModifiedIso(repoRelativePath: string) {
  const runGit = (args: string[]) =>
    execFileSync("git", args, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();

  try {
    if (runGit(["rev-parse", "--is-inside-work-tree"]) !== "true") {
      return undefined;
    }

    // shallow clone에서는 모든 경로의 마지막 커밋이 체크아웃 커밋 하나로 붕괴돼 배포 시각과 다를 바 없다.
    // 워크플로는 fetch-depth: 0을 쓰지만, 그 설정이 사라지면 조용히 틀리는 대신 fallback으로 내려간다.
    if (runGit(["rev-parse", "--is-shallow-repository"]) !== "false") {
      return undefined;
    }

    // 커밋되지 않은 편집이 있으면 커밋일은 지금 렌더하는 내용을 설명하지 못한다. 거짓 날짜 대신 fallback.
    if (runGit(["status", "--porcelain", "--", repoRelativePath]) !== "") {
      return undefined;
    }

    const committedAt = runGit(["log", "-1", "--format=%cI", "--", repoRelativePath]);

    return committedAt ? new Date(committedAt).toISOString() : undefined;
  } catch {
    return undefined;
  }
}
