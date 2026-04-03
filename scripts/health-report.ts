import { products } from "../src/products/registry";
import {
  buildPortfolioHealthReport,
  nonProductHealthLanes,
  type RootHealthLaneId,
  type RootHealthLaneStatus
} from "../src/products/health";

type CliFormat = "markdown" | "json";

function parseArgs(argv: string[]) {
  let format: CliFormat = "markdown";
  const statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> = {};

  for (const argument of argv) {
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

function formatMarkdown(statuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>>) {
  const report = buildPortfolioHealthReport(products, statuses);
  const lines: string[] = [];

  lines.push("# GloTm Health Report");
  lines.push("");
  lines.push("## Root Lanes");
  lines.push("");
  lines.push("| Lane | Status | Command | Notes |");
  lines.push("| --- | --- | --- | --- |");

  for (const lane of report.root) {
    const generatedLabel = lane.includesGeneratedContent ? "generated content 포함" : "pure runtime check";
    lines.push(`| ${lane.label} | ${lane.status} | \`${lane.command}\` | ${lane.proves}; ${generatedLabel} |`);
  }

  lines.push("");
  lines.push("## Product Health");
  lines.push("");
  lines.push("| Guide | Tier | Current | Target | Verdict | Freshness | QA | Gap | Lane |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const product of report.products) {
    lines.push(
      `| ${product.slug} | ${product.portfolioTier} | ${product.currentLifecycleStatus} | ${product.targetLifecycleStatus} | ${product.verdict} | ${product.verificationFreshnessDays}d | ${product.qaLevel} | ${product.highRiskVerificationGapCount} | ${product.lane.label} |`
    );
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

function main() {
  const { format, statuses } = parseArgs(process.argv.slice(2));

  if (format === "json") {
    console.log(JSON.stringify(buildPortfolioHealthReport(products, statuses), null, 2));
    return;
  }

  console.log(formatMarkdown(statuses));
}

main();
