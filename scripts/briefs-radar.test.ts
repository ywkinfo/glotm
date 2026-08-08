import { describe, expect, it } from "vitest";

import { buildCliOutput, buildRadar, formatMarkdown, parseArgs } from "./briefs-radar";

// 시계를 고정해도 아카이브·백로그가 자라면 수치는 바뀐다. 그래서 이 테스트는 수치를 단정하지 않고
// 리포트 골격과 CLI 계약만 잠근다. 계산 자체는 `src/briefs/discovery.test.ts`가 fixture로 덮는다.
const now = new Date("2026-08-03T00:00:00.000Z");

describe("briefs radar cli", () => {
  it("defaults to markdown and accepts both --format spellings", () => {
    expect(parseArgs([])).toEqual({ format: "markdown" });
    expect(parseArgs(["--format", "json"])).toEqual({ format: "json" });
    expect(parseArgs(["--format=json"])).toEqual({ format: "json" });
    expect(parseArgs(["--format=markdown"])).toEqual({ format: "markdown" });
    expect(parseArgs(["--format", "yaml"])).toEqual({ format: "markdown" });
  });

  it("renders every radar block", () => {
    const output = formatMarkdown(now);

    expect(output).toContain("# GloTm Brief Discovery Radar");
    expect(output).toContain("## Lane Cadence");
    expect(output).toContain("## Backlog");
    expect(output).toContain("## Guide Coverage");
    expect(output).toContain("## Source Sweep");
  });

  // 이 리포트가 게이트로 오해되면 cadence가 사실상 SLA가 된다. 면책 문구를 계약으로 잠근다.
  it("says out loud that it does not gate", () => {
    const output = formatMarkdown(now);

    expect(output).toContain("advisory 스냅샷이다. 게이트가 아니다");
    expect(output).toContain("hard SLA 없음");
  });

  it("emits parseable json with the same blocks", () => {
    const parsed = JSON.parse(buildCliOutput(["--format=json"], now)) as ReturnType<
      typeof buildRadar
    >;

    expect(Object.keys(parsed).sort()).toEqual([
      "backlog",
      "cadence",
      "coverage",
      "generatedOn",
      "sources"
    ]);
    expect(parsed.generatedOn).toBe("2026-08-03");
    expect(parsed.cadence.targetDays).toBe(7);
    expect(parsed.coverage.guides.length).toBeGreaterThan(0);
  });
});
