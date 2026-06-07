import { describe, expect, it } from "vitest";

import {
  compareGeneratedCounts,
  compareOverviewRows,
  compareScorecardRows,
  parseMarkdownTable,
  runCheck,
  scanLineForLifecycleDrift,
  splitTableRow,
  type PortfolioRow,
  type TableRow
} from "./check-portfolio-consistency";

const chinaRow: PortfolioRow = {
  shortLabel: "ChaTm",
  portfolioTier: "growth",
  lifecycleStatus: "mature",
  chapterCount: 15,
  searchEntryCount: 358
};

const ukRow: PortfolioRow = {
  shortLabel: "UKTm",
  portfolioTier: "incubate",
  lifecycleStatus: "beta",
  chapterCount: 14,
  searchEntryCount: 128
};

describe("markdown table parser", () => {
  it("strips edge pipes, backticks, and separator rows", () => {
    const markdown = [
      "앞의 서술 문단",
      "| 가이드 | 전략 tier | lifecycle | 챕터 수 | 검색 엔트리 |",
      "|------|------|------|------|------|",
      "| `ChaTm` | growth | mature | 15 | 358 |",
      "",
      "표 뒤의 문단"
    ].join("\n");

    const rows = parseMarkdownTable(markdown, ["가이드", "전략 tier", "lifecycle", "챕터 수", "검색 엔트리"]);

    expect(rows).not.toBeNull();
    expect(rows).toHaveLength(1);
    expect(rows?.[0]).toMatchObject({
      "가이드": "ChaTm",
      "전략 tier": "growth",
      lifecycle: "mature",
      "챕터 수": "15",
      "검색 엔트리": "358"
    });
  });

  it("ignores leading/trailing pipes so no empty cells appear", () => {
    expect(splitTableRow("| a | b | c |")).toEqual(["a", "b", "c"]);
  });

  it("returns null when the header signature is absent", () => {
    expect(parseMarkdownTable("표가 없는 문서", ["가이드", "전략 tier"])).toBeNull();
  });
});

describe("hard checks against registry", () => {
  it("passes when an overview row matches registry", () => {
    const rows: TableRow[] = [
      { "가이드": "ChaTm", "전략 tier": "growth", lifecycle: "mature", "챕터 수": "15", "검색 엔트리": "358" }
    ];

    expect(compareOverviewRows(rows, [chinaRow])).toHaveLength(0);
  });

  it("fails when the overview chapter count is stale after a registry change", () => {
    const rows: TableRow[] = [
      { "가이드": "ChaTm", "전략 tier": "growth", lifecycle: "mature", "챕터 수": "14", "검색 엔트리": "358" }
    ];

    const issues = compareOverviewRows(rows, [chinaRow]);

    expect(issues).toHaveLength(1);
    expect(issues[0]?.level).toBe("hard");
    expect(issues[0]?.message).toContain("chapters");
  });

  it("detects a wrong lifecycle in the current-state scorecard table", () => {
    const rows: TableRow[] = [{ Guide: "ChaTm", Tier: "growth", Lifecycle: "beta" }];

    const issues = compareScorecardRows(rows, [chinaRow]);

    expect(issues).toHaveLength(1);
    expect(issues[0]?.level).toBe("hard");
    expect(issues[0]?.message).toContain("lifecycle");
  });

  it("flags a missing row as a hard failure", () => {
    expect(compareScorecardRows([], [chinaRow])).toHaveLength(1);
  });

  it("flags generated chapter/search drift and passes when aligned", () => {
    expect(compareGeneratedCounts(chinaRow, 15, 358)).toHaveLength(0);
    expect(compareGeneratedCounts(chinaRow, 14, 358)).toHaveLength(1);
    expect(compareGeneratedCounts(chinaRow, 15, 999)).toHaveLength(1);
  });
});

describe("advisory lifecycle scan", () => {
  it("flags a current-state line that calls a beta guide 'pilot'", () => {
    const issues = scanLineForLifecycleDrift("scan:test:1", "UKTm은 pilot 공개본이다", [ukRow]);

    expect(issues).toHaveLength(1);
    expect(issues[0]?.level).toBe("advisory");
  });

  it("allows a historical/transition line that also names the correct lifecycle", () => {
    const issues = scanLineForLifecycleDrift("scan:test:2", "UKTm은 pilot에서 beta로 승급했다", [ukRow]);

    expect(issues).toHaveLength(0);
  });

  it("ignores lines that do not mention the guide", () => {
    expect(scanLineForLifecycleDrift("scan:test:3", "pilot 단계 일반 서술", [ukRow])).toHaveLength(0);
  });
});

describe("live repository consistency", () => {
  it("has zero hard failures against the current registry (derived snapshots are in sync)", () => {
    expect(runCheck().hardFailures).toEqual([]);
  });
});
