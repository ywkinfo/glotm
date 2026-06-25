import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// Contract guards for the Hermes governance docs. These keep the P2 advisor's
// status/header/authority boundaries internally consistent as the docs evolve.
// The "live read-only context" work lands as `pending` first; these expectations
// flip to active only in the post-canary promotion PR.
const read = (p: string) => readFileSync(path.resolve(p), "utf8");

describe("hermes docs contract", () => {
  it("1. skill draft documents the live read-only header shape", () => {
    const s = read("docs/hermes-report-only-skill-draft.md");
    expect(s).toContain("Context: read-only checkout");
    expect(s).toContain("Refreshed: <timestamp or unknown>");
    expect(s).toContain("Freshness: <fresh | stale | unknown>");
    expect(s).toContain("Mode: P2 report-only; no SSH relay; no repo write access");
  });

  it("2. runbook keeps the /opt/hermes warning AND marks P2 as an execution-incapable advisor", () => {
    const s = read("docs/hermes-operations-runbook.md");
    expect(s).toContain("/opt/hermes");
    expect(s).toContain("실행 능력이 없는 advisor");
    expect(s).toContain("ssh-only");
  });

  it("3. AGENTS.md lists Slack @Hermes as a canary-gated P2 report-only actor", () => {
    const s = read("AGENTS.md");
    expect(s).toContain("Slack @Hermes");
    expect(s).toContain("P2 report-only");
    expect(s).toContain("canary");
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

  it("6. the live read-only context is marked pending (not active) in both docs", () => {
    expect(read("docs/hermes-report-only-skill-draft.md")).toContain("Pending: live read-only context");
    expect(read("docs/hermes-slack-relay-design.md")).toContain("4.1 Pending: live read-only checkout");
  });
});
