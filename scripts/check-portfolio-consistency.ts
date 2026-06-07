import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { liveShellProducts, products } from "../src/products/registry";
import type {
  DocumentData,
  LifecycleStatus,
  ProductMeta,
  SearchEntry
} from "../src/products/shared";

// registry.ts(운영 메타데이터 정본)와 파생 산출물/문서가 어긋났는지 검사한다.
// hard: 구조화된 표·생성 산출물의 수치/라벨 불일치 -> exit 1로 게이트한다.
// advisory: 현재상태 서술 문서의 lifecycle 라벨 drift -> 경고만, 게이트하지 않는다.
// 정본은 항상 src/products/registry.ts이며, 불일치 시 문서/산출물을 맞춘다.

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, "..");

export type ConsistencyLevel = "hard" | "advisory";

export type ConsistencyIssue = {
  level: ConsistencyLevel;
  source: string;
  message: string;
};

export type ConsistencyResult = {
  hardFailures: ConsistencyIssue[];
  advisories: ConsistencyIssue[];
};

// 검사에 필요한 registry 필드만 추린 타입. 테스트 fixture를 가볍게 유지한다.
export type PortfolioRow = Pick<
  ProductMeta,
  "shortLabel" | "portfolioTier" | "lifecycleStatus" | "chapterCount" | "searchEntryCount"
>;

const LIFECYCLE_TOKENS: LifecycleStatus[] = ["pilot", "beta", "mature"];

// advisory lifecycle 스캔 대상. 현재상태 buyer-facing 문서만 좁게 본다.
// 역사적 계획서, dated verification log, README, 자유 서술형 workspace 문서는 v1에서 제외한다.
const ADVISORY_SCAN_FILES = ["docs/buyer-narrative.md"];

// ---- 마크다운 테이블 파서 (의존성 없이 인라인 처리) ----

export type TableRow = Record<string, string>;

// 줄 앞/뒤의 파이프를 먼저 제거한 뒤 분리한다. 단순 split("|")은 edge pipe 때문에
// 빈 셀이 생기고 정렬 변형에 취약하므로 leading/trailing pipe를 명시적으로 떼어낸다.
export function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function stripCellMarkup(cell: string): string {
  return cell.replace(/`/g, "").trim();
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")));
}

// requiredHeaders를 모두 포함하는 첫 표를 찾아 행을 header-keyed 객체로 돌려준다.
export function parseMarkdownTable(markdown: string, requiredHeaders: string[]): TableRow[] | null {
  const lines = markdown.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const headerLine = lines[index];

    if (!headerLine || !headerLine.includes("|")) {
      continue;
    }

    const headers = splitTableRow(headerLine).map(stripCellMarkup);

    if (!requiredHeaders.every((header) => headers.includes(header))) {
      continue;
    }

    const rows: TableRow[] = [];

    for (let rowIndex = index + 1; rowIndex < lines.length; rowIndex += 1) {
      const rowLine = lines[rowIndex];

      // 표는 모든 행에 파이프가 있으므로, 파이프 없는 줄을 만나면 표 경계로 본다.
      if (!rowLine || !rowLine.includes("|")) {
        break;
      }

      const cells = splitTableRow(rowLine);

      if (isSeparatorRow(cells)) {
        continue;
      }

      const row: TableRow = {};

      headers.forEach((header, headerIndex) => {
        row[header] = stripCellMarkup(cells[headerIndex] ?? "");
      });

      rows.push(row);
    }

    return rows;
  }

  return null;
}

// ---- 순수 비교 로직 (테스트가 fixture로 직접 호출) ----

function pushMismatch(
  issues: ConsistencyIssue[],
  source: string,
  label: string,
  field: string,
  actual: string | undefined,
  expected: string
): void {
  if (actual !== expected) {
    issues.push({
      level: "hard",
      source,
      message: `${label} ${field}: 문서 "${actual ?? "(없음)"}" !== registry "${expected}"`
    });
  }
}

export function compareGeneratedCounts(
  product: PortfolioRow,
  actualChapterCount: number,
  actualSearchEntryCount: number
): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  const source = `generated:${product.shortLabel}`;

  if (actualChapterCount !== product.chapterCount) {
    issues.push({
      level: "hard",
      source,
      message: `chapter count ${actualChapterCount} !== registry ${product.chapterCount}`
    });
  }

  if (actualSearchEntryCount !== product.searchEntryCount) {
    issues.push({
      level: "hard",
      source,
      message: `search entry count ${actualSearchEntryCount} !== registry ${product.searchEntryCount}`
    });
  }

  return issues;
}

export function compareOverviewRows(rows: TableRow[], portfolio: PortfolioRow[]): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  for (const product of portfolio) {
    const row = rows.find((entry) => entry["가이드"] === product.shortLabel);

    if (!row) {
      issues.push({
        level: "hard",
        source: "project-overview",
        message: `${product.shortLabel} 행을 포트폴리오 표에서 찾지 못함`
      });
      continue;
    }

    pushMismatch(issues, "project-overview", product.shortLabel, "tier", row["전략 tier"], product.portfolioTier);
    pushMismatch(issues, "project-overview", product.shortLabel, "lifecycle", row["lifecycle"], product.lifecycleStatus);
    pushMismatch(issues, "project-overview", product.shortLabel, "chapters", row["챕터 수"], String(product.chapterCount));
    pushMismatch(issues, "project-overview", product.shortLabel, "search", row["검색 엔트리"], String(product.searchEntryCount));
  }

  return issues;
}

export function compareScorecardRows(rows: TableRow[], portfolio: PortfolioRow[]): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  for (const product of portfolio) {
    const row = rows.find((entry) => entry["Guide"] === product.shortLabel);

    if (!row) {
      issues.push({
        level: "hard",
        source: "scorecard",
        message: `${product.shortLabel} 행을 Current assignments 표에서 찾지 못함`
      });
      continue;
    }

    pushMismatch(issues, "scorecard", product.shortLabel, "tier", row["Tier"], product.portfolioTier);
    pushMismatch(issues, "scorecard", product.shortLabel, "lifecycle", row["Lifecycle"], product.lifecycleStatus);
  }

  return issues;
}

// 한 줄에서 registry와 모순되는 lifecycle 라벨을 advisory로 찾는다.
// 올바른 토큰이 같은 줄에 함께 있으면(전이/설명 줄) 건너뛰어 노이즈를 줄인다.
export function scanLineForLifecycleDrift(
  source: string,
  line: string,
  portfolio: PortfolioRow[]
): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  for (const product of portfolio) {
    if (!line.includes(product.shortLabel)) {
      continue;
    }

    const correctToken = product.lifecycleStatus;

    if (new RegExp(`\\b${correctToken}\\b`, "i").test(line)) {
      continue;
    }

    const wrongTokens = LIFECYCLE_TOKENS.filter(
      (token) => token !== correctToken && new RegExp(`\\b${token}\\b`, "i").test(line)
    );

    if (wrongTokens.length === 0) {
      continue;
    }

    issues.push({
      level: "advisory",
      source,
      message: `${product.shortLabel} 줄에 "${wrongTokens.join(", ")}" 표기 (registry=${correctToken})`
    });
  }

  return issues;
}

// ---- 파일 I/O 래퍼 ----

function checkGeneratedCounts(): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  for (const product of liveShellProducts) {
    const generatedDir = path.resolve(rootDir, product.shortLabel, "content/generated");
    const documentPath = path.join(generatedDir, "document-data.json");
    const searchIndexPath = path.join(generatedDir, "search-index.json");

    // generated 산출물은 gitignored 빌드 결과물이다. 없으면 skip한다(contentLinks.test.ts와 동일).
    // health:content는 content:prepare 뒤에 돌므로 그 lane에서는 항상 존재한다.
    if (!existsSync(documentPath) || !existsSync(searchIndexPath)) {
      continue;
    }

    const documentData = JSON.parse(readFileSync(documentPath, "utf-8")) as DocumentData;
    const searchEntries = JSON.parse(readFileSync(searchIndexPath, "utf-8")) as SearchEntry[];

    issues.push(...compareGeneratedCounts(product, documentData.chapters.length, searchEntries.length));
  }

  return issues;
}

function checkOverviewTable(): ConsistencyIssue[] {
  const markdown = readFileSync(path.resolve(rootDir, "PROJECT-OVERVIEW.md"), "utf-8");
  const rows = parseMarkdownTable(markdown, ["가이드", "전략 tier", "lifecycle", "챕터 수", "검색 엔트리"]);

  if (!rows) {
    return [
      {
        level: "hard",
        source: "project-overview",
        message: "포트폴리오 표를 찾지 못함 (헤더 시그니처 불일치 — 표 구조가 바뀌었는지 확인)"
      }
    ];
  }

  return compareOverviewRows(rows, products);
}

function checkScorecardTable(): ConsistencyIssue[] {
  const markdown = readFileSync(path.resolve(rootDir, "docs/portfolio-scorecard.md"), "utf-8");
  const rows = parseMarkdownTable(markdown, ["Guide", "Tier", "Lifecycle"]);

  if (!rows) {
    return [
      {
        level: "hard",
        source: "scorecard",
        message: "Current assignments 표를 찾지 못함 (헤더 시그니처 불일치)"
      }
    ];
  }

  return compareScorecardRows(rows, products);
}

function checkLifecycleScan(): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  for (const relativePath of ADVISORY_SCAN_FILES) {
    const absolutePath = path.resolve(rootDir, relativePath);

    if (!existsSync(absolutePath)) {
      continue;
    }

    const lines = readFileSync(absolutePath, "utf-8").split("\n");

    lines.forEach((line, lineIndex) => {
      issues.push(...scanLineForLifecycleDrift(`scan:${relativePath}:${lineIndex + 1}`, line, products));
    });
  }

  return issues;
}

export function runCheck(): ConsistencyResult {
  const allIssues = [
    ...checkGeneratedCounts(),
    ...checkOverviewTable(),
    ...checkScorecardTable(),
    ...checkLifecycleScan()
  ];

  return {
    hardFailures: allIssues.filter((issue) => issue.level === "hard"),
    advisories: allIssues.filter((issue) => issue.level === "advisory")
  };
}

function main(): void {
  const { hardFailures, advisories } = runCheck();

  for (const issue of hardFailures) {
    console.error(`[HARD]     [${issue.source}] ${issue.message}`);
  }

  for (const issue of advisories) {
    console.log(`[ADVISORY] [${issue.source}] ${issue.message}`);
  }

  console.log("");
  console.log(`check:consistency → ${hardFailures.length} hard / ${advisories.length} advisory`);

  // hard 실패가 advisory 노이즈에 묻히지 않도록, 실패가 있으면 마지막에 한 번 더 모아 출력한다.
  if (hardFailures.length > 0) {
    console.error("");
    console.error(`${hardFailures.length} hard failure(s) — registry.ts 정본과 파생 문서/산출물이 어긋났습니다:`);
    for (const issue of hardFailures) {
      console.error(`  - [${issue.source}] ${issue.message}`);
    }
    process.exitCode = 1;
  }
}

const entryArg = process.argv[1];

if (entryArg && import.meta.url === pathToFileURL(entryArg).href) {
  main();
}
