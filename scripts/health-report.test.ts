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
    const researchProducts = report.products
      .filter((product: { slug: string; research?: unknown }) => product.research)
      .map((product: { slug: string }) => product.slug);

    expect(report.root[0]).toMatchObject({
      id: "runtime",
      status: "pass"
    });
    expect(researchProducts).toEqual(["china", "mexico"]);
    expect(report.products.find((product: { slug: string }) => product.slug === "china")).toMatchObject({
      slug: "china",
      currentLifecycleStatus: "mature",
      verification: {
        mode: "root-full-pipeline",
        scopeLabel: "root full pipeline",
        reportSummary: "root content full pipeline"
      },
      research: {
        auditMode: "advisory",
        factIntegrityScore: 100,
        consistencyScore: 100,
        staleHighRiskClaimCount: 0,
        gate: "pass"
      }
    });
    expect(report.products.find((product: { slug: string }) => product.slug === "mexico")).toMatchObject({
      slug: "mexico",
      currentLifecycleStatus: "mature",
      verification: {
        mode: "root-full-pipeline",
        scopeLabel: "root full pipeline",
        reportSummary: "root content full pipeline"
      },
      research: {
        auditMode: "advisory",
        factIntegrityScore: 100,
        consistencyScore: 100,
        staleHighRiskClaimCount: 0,
        gate: "pass"
      }
    });
    expect(report.root.find((lane: { id: string }) => lane.id === "content")).toMatchObject({
      verification: {
        fullPipelineProductSlugs: ["latam", "mexico", "china", "europe", "uk"],
        shortcutProductSlugs: ["usa", "japan"]
      }
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
    expect(output).toContain("verification scope: full pipeline: latam, mexico, china, europe, uk; shortcut refresh: usa, japan");
    expect(output).toContain("| usa | incubate | beta | beta | hold | root content shortcut refresh only |");
    expect(output).toContain("## Research Coverage");
    expect(output).toContain("| china | advisory | 100 | 100 | 4d | 0 | 0 | pass |");
    expect(output).toContain("| mexico | advisory | 100 | 100 | 3d | 0 | 0 | pass |");
    expect(output).not.toContain("| europe | advisory |");
    expect(output).not.toContain("| usa | advisory |");
  });
});
