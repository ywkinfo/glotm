import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Deploy 게이트 계약.
//
// 2026-08-31 이전에는 `Deploy GitHub Pages` 가 `push: main` 에서 CI 와 **독립적으로** 떴다.
// 테스트가 붉어도 배포는 그대로 라이브까지 나갔다는 뜻이다. 지금은 CI 성공을 기다리도록 바꿨는데,
// `workflow_run` 배선은 조용히 깨지는 방식이 두 가지라 여기서 그 둘을 못박는다.
//
//   1) 참조하는 워크플로 **이름**이 바뀌면 트리거가 아무 소리 없이 멈춘다 → 배포가 영원히 안 돈다.
//      `ci.yml` 의 `name:` 과 `deploy-pages.yml` 의 `workflows:` 목록이 같아야 한다.
//   2) `workflow_run` 의 체크아웃 기본값은 **트리거한 커밋이 아니라 기본 브랜치 HEAD** 다.
//      `ref` 를 못박지 않으면 CI 가 통과한 커밋과 배포되는 커밋이 갈라질 수 있다.
//
// 둘 다 실패해도 워크플로 문법은 유효하므로 GitHub 은 경고하지 않는다. 그래서 테스트가 잡는다.
const read = (relativePath: string) => readFileSync(path.resolve(relativePath), "utf8");

const CI_WORKFLOW = ".github/workflows/ci.yml";
const DEPLOY_WORKFLOW = ".github/workflows/deploy-pages.yml";

function readWorkflowName(relativePath: string) {
  const match = read(relativePath).match(/^name:\s*(.+)$/m);

  if (!match) {
    throw new Error(`${relativePath} 에 최상위 name: 이 없다`);
  }

  return match[1]!.trim().replace(/^["']|["']$/g, "");
}

describe("deploy gate contract", () => {
  it("배포가 CI 성공에만 뒤따른다 — push 트리거로 되돌아가지 않는다", () => {
    const deploy = read(DEPLOY_WORKFLOW);
    const triggerBlock = deploy.slice(deploy.indexOf("\non:"), deploy.indexOf("\nenv:"));

    expect(triggerBlock).toContain("workflow_run:");
    expect(triggerBlock).toContain("types: [completed]");
    // 이것이 원래 결함이다. push 로 돌아가면 게이트가 사라진다.
    expect(triggerBlock).not.toMatch(/^\s{2}push:/m);
  });

  it("참조하는 워크플로 이름이 ci.yml 의 실제 name 과 일치한다", () => {
    const ciName = readWorkflowName(CI_WORKFLOW);
    const deploy = read(DEPLOY_WORKFLOW);

    // 이름이 갈리면 트리거가 조용히 멈춘다 — 배포 실패가 아니라 배포 부재로 나타난다.
    expect(deploy).toContain(`workflows: ["${ciName}"]`);
  });

  it("CI 가 success 로 끝났을 때만 build 가 돈다", () => {
    const deploy = read(DEPLOY_WORKFLOW);

    expect(deploy).toContain("github.event.workflow_run.conclusion == 'success'");
    // 수동 override 경로는 남겨 두되 명시적이어야 한다.
    expect(deploy).toContain("github.event_name == 'workflow_dispatch'");
    expect(deploy).toContain("workflow_dispatch:");
  });

  // 이 저장소는 public + allow_forking=true 이고 ci.yml 은 `pull_request` 에서도 돈다.
  // `workflow_run` 의 `branches` 필터는 트리거한 run 의 head_branch 를 보므로, 포크의 브랜치 이름이
  // `main` 이면 그 필터를 통과한다. `event == 'push'` 가 빠지면 **머지 없이 외부 커밋이 라이브로 나간다.**
  // 이 두 줄이 이 파일에서 가장 중요한 방어다.
  it("포크 PR 이 프로덕션 배포를 트리거할 수 없다", () => {
    const deploy = read(DEPLOY_WORKFLOW);

    expect(deploy).toContain("github.event.workflow_run.event == 'push'");
    expect(deploy).toContain(
      "github.event.workflow_run.head_repository.full_name == github.repository"
    );
    expect(deploy).toContain("github.event.workflow_run.head_branch == 'main'");
  });

  // 체크아웃이 "push 이벤트 + 브랜치 ref" 에서 "workflow_run + bare SHA" 로 바뀌었다.
  // shallow 로 떨어지면 sitemap lastmod 147건이 조용히 배포 시각이 되고, 사이트는 초록인 채로
  // 전 코퍼스가 매 배포마다 갱신됐다는 거짓 신호를 낸다. 런타임에 확인해 붉게 만든다.
  it("shallow clone 을 런타임에 붉힌다", () => {
    const deploy = read(DEPLOY_WORKFLOW);

    expect(deploy).toContain("git rev-parse --is-shallow-repository");
    expect(deploy).toContain("exit 1");
  });

  // 진행 중인 Pages 배포를 자르면 프로덕션이 중간 상태로 남을 수 있다(GitHub 공식 템플릿도 금지한다).
  // 게이트를 붙인 뒤로는 더 나쁘다 — CI 가 붉어 skip 될 run 도 같은 concurrency 그룹에 들어오므로,
  // true 였다면 skip 될 run 이 진행 중인 정상 배포를 죽인다.
  it("진행 중인 배포를 취소하지 않는다", () => {
    const deploy = read(DEPLOY_WORKFLOW);
    // 설정 블록만 본다 — 주석에는 왜 true 가 아닌지를 설명하느라 그 문자열이 등장한다.
    const concurrency = deploy.slice(deploy.indexOf("\nconcurrency:"), deploy.indexOf("\njobs:"));

    expect(concurrency).toContain("group: pages");
    expect(concurrency).toContain("cancel-in-progress: false");
    expect(concurrency).not.toContain("cancel-in-progress: true");
  });

  // ci.yml 의 `push: main` 이 사라지면 workflow_run 이 영원히 안 뜨고, 배포는 실패가 아니라
  // **부재** 로 나타난다. 다른 테스트는 전부 green 인 채로다.
  it("ci.yml 이 main push 에서 계속 돈다 — 트리거 출처가 사라지지 않는다", () => {
    const ci = read(CI_WORKFLOW);
    const triggerBlock = ci.slice(ci.indexOf("\non:"), ci.indexOf("\nenv:"));

    expect(triggerBlock).toContain("push:");
    expect(triggerBlock).toMatch(/branches:\s*\n\s*-\s*main/);

    // deploy 쪽 branches 필터와 짝이 맞아야 한다. 기본 브랜치 이름이 바뀌면 둘 다 고쳐야 하고,
    // 한쪽만 고치면 이 테스트가 잡는다.
    expect(read(DEPLOY_WORKFLOW)).toContain('branches: ["main"]');
  });

  it("CI 가 통과한 바로 그 커밋을 체크아웃한다", () => {
    const deploy = read(DEPLOY_WORKFLOW);

    expect(deploy).toContain("ref: ${{ github.event.workflow_run.head_sha || github.ref }}");
    // sitemap lastmod 가 배포 시각으로 붕괴되지 않도록 full history 가 필요하다(ci.yml 주석 참조).
    expect(deploy).toContain("fetch-depth: 0");
  });

  it("CI 가 배포 전에 실제로 게이트를 다 돈다", () => {
    const ci = read(CI_WORKFLOW);

    // 이 목록이 얇아지면 배포 게이트도 같이 얇아진다.
    for (const command of [
      "npm run health:runtime",
      "npm run health:content",
      "npm run health:release",
      "npm run check:consistency"
    ]) {
      expect(ci, `ci.yml 에 ${command} 가 없다`).toContain(command);
    }
  });
});
