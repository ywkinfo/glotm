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
    // 워크스페이스별로 손으로 블록을 쓰면 새로 승격된 가이드가 조용히 빠진다.
    // 실제로 japan·uk는 존재 목록에만 있고 research gate가 한 번도 단정된 적이 없었다.
    for (const slug of researchProducts) {
      expect(
        report.products.find((product: { slug: string }) => product.slug === slug),
        `${slug} research summary`
      ).toMatchObject({
        slug,
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
    }
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
    expect(markdown).toContain("| china | recorded | 2026-07-21 | 0d | non-gating |");
    expect(markdown).toContain("| mexico | recorded | 2026-07-21 | 0d | non-gating |");
    expect(markdown).toContain("| uk | recorded | 2026-07-22 | 0d | non-gating |");

    const json = JSON.parse(buildCliOutput(["--format", "json"], {}));
    const china = json.products.find((product: { slug: string }) => product.slug === "china");

    expect(china.factReview).toMatchObject({
      track: "fact-review",
      gating: false,
      status: "recorded",
      reviewedOn: "2026-07-21T00:00:00.000Z",
      freshnessDays: 0
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
    expect(output).toContain("| usa | advisory | 100 | 100 | 0d | 60d left | 0 | 0 | pass |");
    expect(output).toContain("| china | advisory | 100 | 100 | 0d | 60d left | 0 | 0 | pass |");
    expect(output).toContain("| mexico | advisory | 100 | 100 | 0d | 60d left | 0 | 0 | pass |");
    expect(output).toContain("| europe | advisory | 100 | 100 | 1d | 59d left | 0 | 0 | pass |");
  });
});

// 위 describe는 markdown 문자열(`0d`, `1d`)을 단정해야 해서 시계를 2026-06-10에 고정한다.
// 그 결과 claim freshness가 늘 "방금 검증됨"으로 계산돼, 리포트가 실제 경과일을 반영하는지는
// 어느 테스트도 확인하지 않았다. 이 블록은 실시계로 돌려 그 계산 경로를 살려 둔다.
// 게이팅은 하지 않는다 — fact-review는 monthly-review-template.md에서 advisory·non-gating으로 잠긴 트랙이다.
describe("health report against the real clock", () => {
  const claimMapSlugs = ["china", "mexico", "europe", "usa", "japan", "uk"];

  it("computes claim freshness from the real date, not a frozen one", () => {
    const report = JSON.parse(buildCliOutput(["--format", "json"], {}));

    for (const slug of claimMapSlugs) {
      const product = report.products.find((entry: { slug: string }) => entry.slug === slug);

      expect(product?.research, `${slug} research summary`).toBeDefined();
      expect(
        typeof product.research.criticalClaimFreshnessDays,
        `${slug} criticalClaimFreshnessDays`
      ).toBe("number");
      expect(product.research.criticalClaimFreshnessDays).toBeGreaterThanOrEqual(0);
    }

    // EuTm은 현재 포트폴리오에서 가장 오래된 HIGH claim을 들고 있다. 고정 시계였다면 1d로 보고된다.
    const europe = report.products.find((entry: { slug: string }) => entry.slug === "europe");
    expect(europe.research.criticalClaimFreshnessDays).toBeGreaterThan(1);
  });

  it("reports every claim-map workspace without a schema drop", () => {
    const report = JSON.parse(buildCliOutput(["--format", "json"], {}));
    const reported = report.products
      .filter((entry: { research?: unknown }) => entry.research)
      .map((entry: { slug: string }) => entry.slug);

    expect(reported).toEqual(claimMapSlugs);
  });
});
