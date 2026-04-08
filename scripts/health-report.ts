import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { products } from "../src/products/registry";
import { getLifecycleCriteria } from "../src/products/scorecard";
import {
  buildPortfolioHealthReport,
  nonProductHealthLanes,
  type ProductResearchRecord,
  type RootHealthLaneId,
  type RootHealthLaneStatus
} from "../src/products/health";
import { readStoredRootStatuses } from "./health-lane-state";
import { runConsistencyAudit } from "./research-audit/audit-consistency";
import { runFactsAudit } from "./research-audit/audit-facts";
import { runStalenessAudit } from "./research-audit/audit-staleness";
import {
  buildResearchSummary,
  claimMapExists,
  getClaimMapPath,
  readClaimMap,
  validateClaimMap
} from "./research-audit/shared";

export type CliFormat = "markdown" | "json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pilotWorkspaceBySlug: Partial<Record<string, string>> = {
  china: "ChaTm",
  mexico: "MexTm"
};

function loadResearchBySlug() {
  const researchBySlug: Partial<Record<string, ProductResearchRecord>> = {};

  for (const product of products) {
    const workspaceName = pilotWorkspaceBySlug[product.slug];

    if (!workspaceName) {
      continue;
    }

    const claimMapPath = getClaimMapPath(rootDir, workspaceName);

    if (!claimMapExists(claimMapPath)) {
      continue;
    }

    try {
      const claimMap = readClaimMap(claimMapPath);
      const lifecycleCriteria = getLifecycleCriteria(product.lifecycleStatus);
      const schemaIssues = validateClaimMap(claimMap);

      if (schemaIssues.some((issue) => issue.level === "error")) {
        continue;
      }

      const issues = [
        ...schemaIssues,
        ...runFactsAudit(claimMap),
        ...runStalenessAudit(claimMap, lifecycleCriteria.maximumVerificationFreshnessDays),
        ...runConsistencyAudit(claimMap)
      ];

      researchBySlug[product.slug] = buildResearchSummary(
        claimMap,
        issues,
        product,
        lifecycleCriteria.maximumVerificationFreshnessDays
      );
    } catch {
      continue;
    }
  }

  return researchBySlug;
}

export function parseArgs(argv: string[]) {
  let format: CliFormat = "markdown";
  const statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--format") {
      const nextArgument = argv[index + 1];

      if (nextArgument === "json" || nextArgument === "markdown") {
        format = nextArgument;
        index += 1;
        continue;
      }
    }

    if (argument === "--format=json") {
      format = "json";
      continue;
    }

    if (argument === "--format=markdown") {
      format = "markdown";
      continue;
    }

    const match = argument.match(/^--(runtime|content|release)=(not-run|pass|fail)$/);

    if (match) {
      const [, lane, status] = match;
      statuses[lane as RootHealthLaneId] = status as RootHealthLaneStatus;
    }
  }

  return {
    format,
    statuses
  };
}

export function formatMarkdown(statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>>) {
  const report = buildPortfolioHealthReport(products, statuses, loadResearchBySlug());
  const lines: string[] = [];

  lines.push("# GloTm Health Report");
  lines.push("");
  lines.push("## Root Lanes");
  lines.push("");
  lines.push("| Lane | Status | Command | Notes |");
  lines.push("| --- | --- | --- | --- |");

  for (const lane of report.root) {
    const generatedLabel = lane.includesGeneratedContent ? "generated content 포함" : "pure runtime check";
    const verificationSummary = lane.verification
      ? `; verification scope: ${lane.verification.reportSummary}`
      : "";
    lines.push(`| ${lane.label} | ${lane.status} | \`${lane.command}\` | ${lane.proves}; ${generatedLabel}${verificationSummary} |`);
  }

  lines.push("");
  lines.push("## Product Health");
  lines.push("");
  lines.push("| Guide | Tier | Current | Target | Verdict | Verification | Freshness | QA | Gap | Lane |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const product of report.products) {
    lines.push(
      `| ${product.slug} | ${product.portfolioTier} | ${product.currentLifecycleStatus} | ${product.targetLifecycleStatus} | ${product.verdict} | ${product.verification.reportSummary} | ${product.verificationFreshnessDays}d | ${product.qaLevel} | ${product.highRiskVerificationGapCount} | ${product.lane.label} |`
    );
  }

  lines.push("");
  lines.push("## Research Coverage");
  lines.push("");

  const researchProducts = report.products.filter((product) => product.research);

  if (researchProducts.length === 0) {
    lines.push("- none");
  } else {
    lines.push("| Guide | Audit Mode | Fact Integrity | Consistency | Critical Freshness | Stale High-Risk | Effective Gap | Gate |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");

    for (const product of researchProducts) {
      lines.push(
        `| ${product.slug} | ${product.research?.auditMode} | ${product.research?.factIntegrityScore} | ${product.research?.consistencyScore} | ${product.research?.criticalClaimFreshnessDays}d | ${product.research?.staleHighRiskClaimCount} | ${product.research?.effectiveHighRiskGapCount} | ${product.research?.gate} |`
      );
    }
  }

  lines.push("");
  lines.push("## Current Non-Product Lane");
  lines.push("");
  lines.push("| Lane | Order | Notes |");
  lines.push("| --- | --- | --- |");

  for (const lane of nonProductHealthLanes) {
    lines.push(`| ${lane.label} | ${lane.order} | ${lane.notes} |`);
  }

  lines.push("");
  lines.push("## Products Needing Verification Refresh");
  lines.push("");

  const refreshNeeded = report.products.filter((product) => product.verdict === "verification-refresh-needed");

  if (refreshNeeded.length === 0) {
    lines.push("- none");
  } else {
    for (const product of refreshNeeded) {
      const gapText = product.currentLifecycleGaps.length > 0
        ? product.currentLifecycleGaps.join("; ")
        : "current lifecycle evidence gap";
      lines.push(`- \`${product.slug}\`: ${gapText}`);
    }
  }

  lines.push("");
  lines.push("## Products Upgrade-Ready For Monthly Review");
  lines.push("");

  const upgradeReady = report.products.filter((product) => product.verdict === "upgrade-ready");

  if (upgradeReady.length === 0) {
    lines.push("- none");
  } else {
    for (const product of upgradeReady) {
      lines.push(`- \`${product.slug}\`: ${product.currentLifecycleStatus} -> ${product.targetLifecycleStatus}`);
    }
  }

  return lines.join("\n");
}

export function buildCliOutput(
  argv: string[],
  storedStatuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> = readStoredRootStatuses()
) {
  const { format, statuses } = parseArgs(argv);
  const resolvedStatuses = {
    ...storedStatuses,
    ...statuses
  };
  const researchBySlug = loadResearchBySlug();

  if (format === "json") {
    return JSON.stringify(buildPortfolioHealthReport(products, resolvedStatuses, researchBySlug), null, 2);
  }

  return formatMarkdown(resolvedStatuses);
}

function main() {
  console.log(buildCliOutput(process.argv.slice(2)));
}

const entryArg = process.argv[1];

if (entryArg && import.meta.url === pathToFileURL(entryArg).href) {
  main();
}
