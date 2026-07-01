import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Contract guards for the Hermes governance docs. These keep the P2 advisor's
// status/header/authority boundaries internally consistent as the docs evolve.
const read = (p: string) => readFileSync(path.resolve(p), "utf8");

describe("hermes docs contract", () => {
  it("1. skill draft documents the live read-only/request-only header shape", () => {
    const s = read("docs/hermes-report-only-skill-draft.md");
    expect(s).toContain("Context: read-only checkout");
    expect(s).toContain("Refreshed: <last successful sync run timestamp or unknown>");
    expect(s).toContain("Sync: <manual | request-only | unknown>");
    expect(s).toContain("Sync: manual");
    expect(s).toContain("Sync: request-only");
    expect(s).toContain("Mode: P2.5 request-only refresh; no SSH relay; no repo write access");
    expect(s).toContain("Header source guard");
    expect(s).toContain("Never use `/opt/hermes`, `/opt/hermes/.git`, `/opt/hermes/.hermes_build_sha`");
    expect(s).toContain("`Sync` is exactly one of `manual`, `request-only`, or `unknown`");
    expect(s).not.toContain("Freshness: <fresh | stale | unknown>");
    expect(s).not.toContain("Snapshot: <timestamp or unknown>");
  });

  it("2. runbook keeps the /opt/hermes warning AND marks P2.5 as task-execution-incapable", () => {
    const s = read("docs/hermes-operations-runbook.md");
    expect(s).toContain("/opt/hermes");
    expect(s).toContain("실행 능력이 없는 advisor");
    expect(s).toContain("request-only broker");
    expect(s).toContain("bounded task 실행 트리거가 아니다");
    expect(s).toContain("channel allowlist는 request payload sanity check");
    expect(s).toContain("security boundary가 아니다");
    expect(s).toContain("`.tmp` 파일에 완성 JSON을 쓴 뒤 마지막에 `.json`으로 atomic rename");
    expect(s).toContain("[sandbox_workspace_write] writable_roots");
    expect(s).toContain("REPORT_CONTEXT_REFRESH_USER");
    expect(s).toContain("`/opt/hermes/.git`, `/opt/hermes/.hermes_build_sha`는 Hermes Agent runtime 정보");
    expect(s).toContain("`Sync` 값은 `manual` / `request-only` / `unknown`만");
  });

  it("3. AGENTS.md lists Slack @Hermes as a P2.5 request-only refresh actor", () => {
    const s = read("AGENTS.md");
    expect(s).toContain("Slack @Hermes");
    expect(s).toContain("P2.5 request-only refresh");
    expect(s).toContain("brokered read-only checkout");
    expect(s).toContain("2026-06-29 P2.5 request-broker 계약");
    expect(s).toContain("/opt/glotm-context:ro");
    expect(s).toContain("/opt/glotm-refresh-requests/inbox");
  });

  it("4. charter distinguishes read-grounded / lane-verified / 미검증", () => {
    const s = read("Harness/Hermes-Operating-Charter.md");
    expect(s).toContain("read-grounded");
    expect(s).toContain("lane-verified");
    expect(s).toContain("미검증");
  });

  it("5. relay design keeps P4 auto-relay out of scope / on hold", () => {
    const s = read("docs/hermes-slack-relay-design.md");
    expect(s).toContain("P4");
    expect(s).toContain("비범위");
    expect(s).toContain("보류");
  });

  it("6. the live read-only context is active and no longer marked pending", () => {
    const skill = read("docs/hermes-report-only-skill-draft.md");
    const relay = read("docs/hermes-slack-relay-design.md");
    const runbook = read("docs/hermes-operations-runbook.md");

    expect(skill).toContain("## Active live read-only context");
    expect(skill).not.toContain("Pending: live read-only context");
    expect(relay).toContain("4.1 Active: live read-only checkout");
    expect(relay).not.toContain("4.1 Pending: live read-only checkout");
    expect(runbook).not.toContain("report-context read-only root mount *(pending)*");
  });

  it("7. the whole context root is mounted read-only and both leaf paths stay explicit", () => {
    const runbook = read("docs/hermes-operations-runbook.md");
    const relay = read("docs/hermes-slack-relay-design.md");
    const skill = read("docs/hermes-report-only-skill-draft.md");

    expect(runbook).toContain("host `/srv/hermes/report-context` → 컨테이너 `/opt/glotm-context:ro`");
    expect(relay).toContain("`/srv/hermes/report-context` 전체 → `/opt/glotm-context:ro`");
    expect(relay).toContain("safe.directory=/opt/glotm-context/repo");
    expect(relay).toContain("`GIT_OPTIONAL_LOCKS=0`");
    expect(skill).toContain("`/opt/glotm-context/repo`");
    expect(skill).toContain("`/opt/glotm-context/metadata.json`");

    const repoOnlyMount = "`/srv/hermes/report-context/repo` → `/opt/glotm-context:ro`";
    expect(runbook).not.toContain(repoOnlyMount);
    expect(relay).not.toContain(repoOnlyMount);
  });

  it("8. the active request-only contract has no timer cadence or freshness header", () => {
    const skill = read("docs/hermes-report-only-skill-draft.md");
    const relay = read("docs/hermes-slack-relay-design.md");
    const runbook = read("docs/hermes-operations-runbook.md");
    const activeSkill = skill.split("## P2 Verification")[0];

    for (const text of [activeSkill, relay, runbook]) {
      expect(text).not.toMatch(/\b15\s*-?\s*min(ute)?s?\b/i);
      expect(text).not.toMatch(/\b30\s*-?\s*min(ute)?s?\b/i);
      expect(text).not.toContain("Freshness: <fresh | stale | unknown>");
    }

    expect(relay).toContain("`Context` · `Commit` · `Refreshed` · `Sync` · `Mode`");
    expect(relay).toContain("`/opt/hermes/.git`, `/opt/hermes/.hermes_build_sha`는 Hermes Agent runtime 정보");
    expect(relay).toContain("`Mode`는 `P2.5 request-only refresh; no SSH relay; no repo write access` 그대로");
    expect(runbook).toContain("`glotm-report-context-refresh.service` (owner/admin fallback one-shot)");
    expect(runbook).toContain("`glotm-report-context-refresh-broker.path`");
    expect(runbook).toContain("`glotm-report-context-refresh-broker.service`");
    expect(runbook).toContain("sudo systemctl start glotm-report-context-refresh.service");
    expect(runbook).toContain("sudo rm -f /etc/systemd/system/glotm-report-context-refresh.timer");
  });

  it("9. the active spec records the manual baseline, P2.5 pending canary, and superseded canary", () => {
    const skill = read("docs/hermes-report-only-skill-draft.md");
    expect(skill).toContain("Superseded: 2026-06-25 periodic-sync header canary");
    expect(skill).toContain("old `Freshness: fresh` field");
    expect(skill).toContain("Active: 2026-06-26 manual-sync canary");
    expect(skill).toContain("Pending runtime canary: P2.5 request-only broker");
    expect(skill).toContain("Read-grounded canary");
    expect(skill).toContain("Evidence-boundary canary");
    expect(skill).toContain("Refusal canary");
    expect(skill).toContain("`Sync: manual`");
    expect(skill).toContain("`Sync: request-only`");
    expect(skill).toContain("no new bounded-operator run or worktree");
    expect(skill).toContain("20분 이상 자동 service activation 없음");
  });
});
