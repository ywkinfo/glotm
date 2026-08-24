import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

// 각 워크스페이스 build-content가 찍는 meta.builtAt은 그 가이드 인덱스와 전 챕터의
// sitemap lastmod가 된다(scripts/seo.ts). 빌드 시각을 찍으면 콘텐츠가 그대로여도 배포마다
// 전 코퍼스가 갱신됐다고 신고하므로, 1차 근거는 콘텐츠 소스의 git 커밋일이어야 한다.
//
// 여기서 중요한 것은 **신규 클론**을 재현하는 것이다. 직전 산출물과 비교하는 fallback만으로는
// content/generated 가 gitignore 된 CI에서 비교 대상이 없어 아무 효과가 없다 — 즉 배포되는
// sitemap은 그대로 흔들린다. 그래서 아래 git 케이스들은 산출물을 지우고 다시 빌드한다.

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandboxRoot = path.join(repoRoot, "tmp", "build-content-stability");

const CONTENT_WORKSPACES = [
  "LatTm",
  "MexTm",
  "UsaTm",
  "JapTm",
  "ChaTm",
  "EuTm",
  "UKTm",
  "Reports"
];

// 실제 빌드를 여러 번 도는 테스트라 가장 작은 master.md를 쓴다.
const SAMPLE_GUIDE = "UKTm";
const COMMITTED_AT = "2026-01-02T03:04:05Z";
const COMMITTED_AT_ISO = "2026-01-02T03:04:05.000Z";

function prepareSandbox(label: string) {
  const dir = path.join(sandboxRoot, label);

  rmSync(dir, { recursive: true, force: true });
  mkdirSync(path.join(dir, "scripts"), { recursive: true });
  mkdirSync(path.join(dir, "content", "source"), { recursive: true });
  cpSync(
    path.join(repoRoot, SAMPLE_GUIDE, "scripts", "build-content.ts"),
    path.join(dir, "scripts", "build-content.ts")
  );
  cpSync(
    path.join(repoRoot, SAMPLE_GUIDE, "content", "source", "master.md"),
    path.join(dir, "content", "source", "master.md")
  );

  return dir;
}

// 샌드박스 안에 진짜 git 저장소를 만든다. build-content는 cwd 기준으로 git을 호출하므로
// 바깥 저장소가 아니라 이 안쪽 저장소를 본다(바깥 .gitignore도 여기에는 적용되지 않는다).
function initSandboxRepo(dir: string) {
  const run = (args: string[], env: NodeJS.ProcessEnv = {}) =>
    execFileSync("git", args, { cwd: dir, stdio: "pipe", env: { ...process.env, ...env } });

  run(["init", "--quiet"]);
  run(["config", "user.email", "stability-test@example.com"]);
  run(["config", "user.name", "Stability Test"]);
  run(["add", "content/source/master.md"]);
  run(["commit", "--quiet", "-m", "seed content"], {
    GIT_AUTHOR_DATE: COMMITTED_AT,
    GIT_COMMITTER_DATE: COMMITTED_AT
  });
}

function runBuild(dir: string, env: NodeJS.ProcessEnv = {}) {
  execFileSync("node", ["--import", "tsx", path.join(dir, "scripts", "build-content.ts")], {
    cwd: repoRoot,
    stdio: "pipe",
    env: { ...process.env, ...env }
  });
}

// 저장소가 아예 아닌 환경(배포 아카이브·tarball). 샌드박스는 node_modules 해상도 때문에
// 저장소 안에 있어야 하므로, git이 위로 올라가 바깥 .git을 찾지 못하게 천장을 세운다.
const NON_REPO_ENV = { GIT_CEILING_DIRECTORIES: sandboxRoot };

function readBuiltAt(dir: string) {
  const raw = readFileSync(path.join(dir, "content", "generated", "document-data.json"), "utf-8");

  return (JSON.parse(raw) as { meta: { builtAt: string } }).meta.builtAt;
}

// CI 신규 클론 재현: 생성물은 gitignore 되어 있으므로 체크아웃 직후에는 존재하지 않는다.
function discardGeneratedOutput(dir: string) {
  rmSync(path.join(dir, "content", "generated"), { recursive: true, force: true });
}

afterAll(() => {
  rmSync(sandboxRoot, { recursive: true, force: true });
});

describe("generated content builtAt stability", () => {
  it(
    "stamps builtAt from the content source commit, not the build clock",
    () => {
      const dir = prepareSandbox("git-committed");

      initSandboxRepo(dir);
      runBuild(dir);

      expect(readBuiltAt(dir)).toBe(COMMITTED_AT_ISO);
    },
    120_000
  );

  it(
    "keeps builtAt on a fresh clone that has no previous generated output",
    () => {
      const dir = prepareSandbox("git-fresh-clone");

      initSandboxRepo(dir);
      runBuild(dir);
      const first = readBuiltAt(dir);

      // 직전 산출물 비교 fallback이 걸릴 수 없는 상태 — CI가 매 배포마다 놓이는 상태다.
      discardGeneratedOutput(dir);
      runBuild(dir);

      expect(
        readBuiltAt(dir),
        "a fresh clone must not restamp the sitemap lastmod with the build time"
      ).toBe(first);
      expect(first).toBe(COMMITTED_AT_ISO);
    },
    120_000
  );

  it(
    "advances builtAt when the committed content actually changes",
    () => {
      const dir = prepareSandbox("git-changed");

      initSandboxRepo(dir);
      runBuild(dir);

      const sourcePath = path.join(dir, "content", "source", "master.md");
      writeFileSync(
        sourcePath,
        `${readFileSync(sourcePath, "utf-8")}\n회귀 테스트가 추가한 문단이다.\n`,
        "utf-8"
      );
      execFileSync("git", ["commit", "--quiet", "-am", "change content"], {
        cwd: dir,
        stdio: "pipe",
        env: {
          ...process.env,
          GIT_AUTHOR_DATE: "2026-03-04T05:06:07Z",
          GIT_COMMITTER_DATE: "2026-03-04T05:06:07Z"
        }
      });
      discardGeneratedOutput(dir);
      runBuild(dir);

      expect(
        readBuiltAt(dir),
        "a real content change must still refresh the sitemap lastmod stamp"
      ).toBe("2026-03-04T05:06:07.000Z");
    },
    120_000
  );

  it(
    "does not claim the last commit date while the content source is uncommitted",
    () => {
      const dir = prepareSandbox("git-dirty");

      initSandboxRepo(dir);

      const sourcePath = path.join(dir, "content", "source", "master.md");
      writeFileSync(
        sourcePath,
        `${readFileSync(sourcePath, "utf-8")}\n아직 커밋되지 않은 편집이다.\n`,
        "utf-8"
      );
      runBuild(dir);

      expect(
        readBuiltAt(dir),
        "an uncommitted edit must not be reported as last changed at the previous commit"
      ).not.toBe(COMMITTED_AT_ISO);
    },
    120_000
  );

  it(
    "refuses the collapsed commit date a shallow clone reports",
    () => {
      // shallow clone에서는 콘텐츠를 건드리지 않은 커밋도 그 경로의 "마지막 커밋"으로 보고된다.
      // 틀린 날짜를 그럴듯하게 쓰는 것보다 fallback이 낫다 — 이 케이스가 workflow의
      // fetch-depth: 0 이 없으면 안 되는 이유이고, 없을 때 조용히 틀리지 않는다는 보장이다.
      const origin = prepareSandbox(path.join("shallow", "origin"));

      initSandboxRepo(origin);
      writeFileSync(path.join(origin, "NOTES.md"), "콘텐츠와 무관한 커밋이다.\n", "utf-8");
      execFileSync("git", ["add", "NOTES.md"], { cwd: origin, stdio: "pipe" });
      execFileSync("git", ["commit", "--quiet", "-m", "unrelated change"], {
        cwd: origin,
        stdio: "pipe",
        env: {
          ...process.env,
          GIT_AUTHOR_DATE: "2026-05-05T05:05:05Z",
          GIT_COMMITTER_DATE: "2026-05-05T05:05:05Z"
        }
      });

      const shallow = path.join(sandboxRoot, "shallow", "clone");
      rmSync(shallow, { recursive: true, force: true });
      execFileSync("git", ["clone", "--depth", "1", "--quiet", `file://${origin}`, shallow], {
        stdio: "pipe"
      });
      mkdirSync(path.join(shallow, "scripts"), { recursive: true });
      cpSync(
        path.join(repoRoot, SAMPLE_GUIDE, "scripts", "build-content.ts"),
        path.join(shallow, "scripts", "build-content.ts")
      );

      // `%cI`가 UTC를 찍는 표기는 git 버전마다 다르다(2.43은 `+00:00`, CI 러너의 2.54는 `Z`).
      // 문자열로 단정하면 이 전제 검사가 git 버전에 묶여, 검증 대상과 무관한 이유로 로컬에서만
      // 붉어진다. 여기서 확인하려는 것은 표기가 아니라 "어느 커밋으로 붕괴했는가"이므로 시각으로 본다.
      const collapsedCommitAt = execFileSync(
        "git",
        ["log", "-1", "--format=%cI", "--", "content/source"],
        { cwd: shallow, encoding: "utf-8" }
      ).trim();

      expect(
        new Date(collapsedCommitAt).getTime(),
        `the shallow clone must actually collapse the path history for this test to mean anything (git reported ${collapsedCommitAt})`
      ).toBe(new Date("2026-05-05T05:05:05Z").getTime());

      runBuild(shallow);

      expect(
        readBuiltAt(shallow),
        "a shallow clone's collapsed commit date must not be published as lastmod"
      ).not.toBe("2026-05-05T05:05:05.000Z");
    },
    120_000
  );

  it(
    "falls back instead of crashing when the tree is not a git repository at all",
    () => {
      const dir = prepareSandbox("non-repo");

      runBuild(dir, NON_REPO_ENV);
      const first = readBuiltAt(dir);

      expect(first, "a non-git archive must still produce a usable stamp").toBeTruthy();

      runBuild(dir, NON_REPO_ENV);

      expect(
        readBuiltAt(dir),
        "the no-op-rebuild fallback must still hold when git is absent"
      ).toBe(first);
    },
    120_000
  );

  it(
    "keeps builtAt when git is unavailable and a rebuild produces identical content",
    () => {
      // git 저장소가 아닌 환경(비-git 아카이브·shallow clone)의 2차 방어 경로.
      const dir = prepareSandbox("no-git-unchanged");

      runBuild(dir);
      const first = readBuiltAt(dir);
      runBuild(dir);

      expect(first).toBeTruthy();
      expect(readBuiltAt(dir), "unchanged content must not advance the sitemap lastmod stamp").toBe(
        first
      );
    },
    120_000
  );

  it(
    "advances builtAt without git when the source content actually changes",
    () => {
      const dir = prepareSandbox("no-git-changed");
      const sourcePath = path.join(dir, "content", "source", "master.md");

      runBuild(dir);
      const first = readBuiltAt(dir);

      writeFileSync(
        sourcePath,
        `${readFileSync(sourcePath, "utf-8")}\n회귀 테스트가 추가한 문단이다.\n`,
        "utf-8"
      );
      runBuild(dir);

      expect(
        readBuiltAt(dir),
        "a real content change must still refresh the sitemap lastmod stamp"
      ).not.toBe(first);
    },
    120_000
  );

  it("every content workspace resolves builtAt from git and keeps a fallback", () => {
    for (const workspace of CONTENT_WORKSPACES) {
      const source = readFileSync(
        path.join(repoRoot, workspace, "scripts", "build-content.ts"),
        "utf-8"
      );
      const mentions = source.split("gitLastModifiedIso(").length - 1;

      expect(mentions, `${workspace} must define gitLastModifiedIso`).toBeGreaterThan(0);
      // 정의만 있고 호출되지 않으면 builtAt은 그대로 빌드 시각이다. 실제로 한 번 그 형태로 새어나갔고,
      // 그때 정의 유무만 보던 검사는 통과했다.
      expect(
        mentions,
        `${workspace} must actually call gitLastModifiedIso, not merely define it`
      ).toBeGreaterThan(1);
      expect(
        source,
        `${workspace} must keep a no-op-rebuild fallback for non-git environments`
      ).toMatch(/(async )?function (withStableBuiltAt|buildStableDocumentData)\(/);
      // 호출 자체는 남아 있어도 write 경로가 resolver를 우회하면 builtAt은 다시 빌드 시각이 된다.
      // 행위 테스트는 SAMPLE_GUIDE 하나만 실제로 빌드하므로, 나머지 워크스페이스는 이 검사가 지킨다.
      expect(
        source,
        `${workspace} must route the document-data write through the git-aware resolver`
      ).toMatch(
        /await resolveBuiltAt\(documentData\)|buildStableDocumentData\([\s\S]{0,240}?gitLastModifiedIso\(/
      );
    }
  });

  it("release workflows fetch full history so the git stamp survives CI", () => {
    // shallow clone에서는 모든 경로의 마지막 커밋이 체크아웃 커밋 하나로 붕괴돼
    // build-content가 fallback으로 내려가고, lastmod는 다시 배포 시각이 된다.
    for (const workflow of ["ci.yml", "deploy-pages.yml", "verify-release.yml"]) {
      const source = readFileSync(path.join(repoRoot, ".github", "workflows", workflow), "utf-8");

      expect(source, `${workflow} must check out with fetch-depth: 0`).toMatch(
        /uses:\s*actions\/checkout@[^\n]*\n(\s*#[^\n]*\n)*\s*with:\s*\n\s*fetch-depth:\s*0/
      );
    }
  });
});
