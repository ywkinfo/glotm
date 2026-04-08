import path from "node:path";
import { fileURLToPath } from "node:url";

import { getLifecycleCriteria } from "../../src/products/scorecard";
import { products } from "../../src/products/registry";
import { runConsistencyAudit } from "./audit-consistency";
import { runFactsAudit } from "./audit-facts";
import { runStalenessAudit } from "./audit-staleness";
import {
  buildResearchSummary,
  getClaimMapPath,
  readClaimMap,
  validateClaimMap,
  type AuditIssue
} from "./shared";

type CliArgs = {
  workspace?: string;
  product?: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");

function parseArgs(argv: string[]): CliArgs {
  const parsed: CliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const nextArgument = argv[index + 1];

    if (argument === "--workspace" && nextArgument) {
      parsed.workspace = nextArgument;
      index += 1;
      continue;
    }

    if (argument === "--product" && nextArgument) {
      parsed.product = nextArgument;
      index += 1;
    }
  }

  return parsed;
}

function printIssues(issues: AuditIssue[]) {
  for (const issue of issues) {
    const level = issue.level.toUpperCase().padEnd(7, " ");
    const claimLabel = issue.claimId ? ` ${issue.claimId}` : "";
    console.log(`${level} [${issue.audit}]${claimLabel} ${issue.message}`);
  }
}

function main() {
  const { workspace, product: productSlug } = parseArgs(process.argv.slice(2));

  if (!workspace || !productSlug) {
    console.error("Usage: node --import tsx scripts/research-audit/run-workspace-audit.ts --workspace <Workspace> --product <slug>");
    process.exitCode = 1;
    return;
  }

  const product = products.find((entry) => entry.slug === productSlug);

  if (!product) {
    console.error(`Unknown product slug: ${productSlug}`);
    process.exitCode = 1;
    return;
  }

  const claimMapPath = getClaimMapPath(rootDir, workspace);

  try {
    const claimMap = readClaimMap(claimMapPath);
    const lifecycleCriteria = getLifecycleCriteria(product.lifecycleStatus);
    const schemaIssues = validateClaimMap(claimMap);
    const issues = schemaIssues.some((issue) => issue.level === "error")
      ? schemaIssues
      : [
          ...schemaIssues,
          ...runFactsAudit(claimMap),
          ...runStalenessAudit(claimMap, lifecycleCriteria.maximumVerificationFreshnessDays),
          ...runConsistencyAudit(claimMap)
        ];
    const summary = buildResearchSummary(claimMap, issues, product, lifecycleCriteria.maximumVerificationFreshnessDays);

    printIssues(issues);
    console.log(
      `${workspace} factual QA: gate=${summary.gate}, factIntegrity=${summary.factIntegrityScore}, consistency=${summary.consistencyScore}, staleHighRisk=${summary.staleHighRiskClaimCount}, effectiveGap=${summary.effectiveHighRiskGapCount}`
    );

    if (issues.some((issue) => issue.level === "error")) {
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR   [facts] claim-map을 읽지 못했습니다: ${message}`);
    process.exitCode = 1;
  }
}

main();
