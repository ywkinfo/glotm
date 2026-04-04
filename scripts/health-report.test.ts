import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildCliOutput, parseArgs } from "./health-report";

describe("health report CLI", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-04T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts both spaced and equals format flags", () => {
    expect(parseArgs(["--format", "json"]).format).toBe("json");
    expect(parseArgs(["--format=json"]).format).toBe("json");
    expect(parseArgs(["--format", "markdown"]).format).toBe("markdown");
  });

  it("emits machine-readable JSON when the spaced format flag is used", () => {
    const output = buildCliOutput(["--format", "json", "--runtime=pass"], {});
    const report = JSON.parse(output);

    expect(report.root[0]).toMatchObject({
      id: "runtime",
      status: "pass"
    });
    expect(report.products.find((product: { slug: string }) => product.slug === "china")).toMatchObject({
      slug: "china",
      currentLifecycleStatus: "mature"
    });
  });

  it("merges stored lane statuses unless the CLI overrides them", () => {
    const output = buildCliOutput(["--content=fail"], {
      runtime: "pass",
      content: "pass",
      release: "fail"
    });

    expect(output).toContain("| health:runtime | pass |");
    expect(output).toContain("| health:content | fail |");
    expect(output).toContain("| health:release | fail |");
  });
});
