import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildCliOutput, parseArgs } from "./health-report";

describe("health report CLI", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00.000Z"));
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

    expect(report.meta).toMatchObject({
      summaryKind: "recent-lane-state-provenance-summary",
      interpretation: "operational-snapshot",
      isEndToEndVerificationProof: false,
      provenanceLevels: ["live", "cached", "partial", "inferred"]
    });
    expect(report.root[0]).toMatchObject({
      id: "runtime",
      status: "pass"
    });
    expect(researchProducts).toEqual(["china", "mexico", "europe", "usa", "japan", "uk"]);
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
    expect(report.products.find((product: { slug: string }) => product.slug === "europe")).toMatchObject({
      slug: "europe",
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
    expect(report.products.find((product: { slug: string }) => product.slug === "usa")).toMatchObject({
      slug: "usa",
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
        fullPipelineProductSlugs: ["latam", "mexico", "usa", "japan", "china", "europe", "uk"],
        shortcutProductSlugs: []
      }
    });
  });

  it("surfaces fact-review as an advisory non-gating section", () => {
    const markdown = buildCliOutput([], {});

    expect(markdown).toContain("## Fact-Review (advisory, non-gating)");
    expect(markdown).toContain("| china | unrecorded | — | unrecorded | non-gating |");

    const json = JSON.parse(buildCliOutput(["--format", "json"], {}));
    const china = json.products.find((product: { slug: string }) => product.slug === "china");

    expect(china.factReview).toMatchObject({
      track: "fact-review",
      gating: false,
      status: "unrecorded"
    });
  });

  it("merges stored lane statuses unless the CLI overrides them", () => {
    const output = buildCliOutput(["--content=fail"], {
      runtime: "pass",
      content: "pass",
      release: "fail"
    });

    expect(output).toContain("This report is a recent lane-state provenance summary");
    expect(output).toContain("## Report Semantics");
    expect(output).toContain("- Summary kind: `recent-lane-state-provenance-summary`");
    expect(output).toContain("- Interpretation: `operational-snapshot`");
    expect(output).toContain("- Provenance levels: `live`, `cached`, `partial`, `inferred`");
    expect(output).toContain("| health:runtime | pass |");
    expect(output).toContain("| health:content | fail |");
    expect(output).toContain("| health:release | fail |");
    expect(output).toContain("verification scope: full pipeline: latam, mexico, usa, japan, china, europe, uk");
    expect(output).toContain("| usa | growth | mature | mature | hold | root content full pipeline |");
    expect(output).toContain("## Research Coverage");
    expect(output).toContain("| usa | advisory | 100 | 100 | 0d | 0 | 0 | pass |");
    expect(output).toContain("| china | advisory | 100 | 100 | 0d | 0 | 0 | pass |");
    expect(output).toContain("| mexico | advisory | 100 | 100 | 0d | 0 | 0 | pass |");
    expect(output).toContain("| europe | advisory | 100 | 100 | 1d | 0 | 0 | pass |");
  });
});
