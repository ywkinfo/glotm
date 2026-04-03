import type {
  LifecycleStatus,
  ProductMeta
} from "./shared";
import {
  assessProductLifecycle,
  getLifecycleCriteria,
  getSearchDensity
} from "./scorecard";

export type RootHealthLaneId = "runtime" | "content" | "release";

export type RootHealthLaneStatus = "not-run" | "pass" | "fail";

export type ProductHealthVerdict = "hold" | "upgrade-ready" | "verification-refresh-needed";

export type RootHealthLaneRecord = {
  id: RootHealthLaneId;
  label: string;
  command: string;
  proves: string;
  includesGeneratedContent: boolean;
};

export type ProductHealthLaneId =
  | "latam-baseline"
  | "cha-priority"
  | "mex-priority"
  | "eu-priority"
  | "brief-gateway"
  | "incubate-pack";

export type ProductHealthLane = {
  id: ProductHealthLaneId;
  label: string;
  order: number;
  notes: string;
};

export type ProductHealthRecord = {
  slug: string;
  title: string;
  portfolioTier: ProductMeta["portfolioTier"];
  currentLifecycleStatus: LifecycleStatus;
  targetLifecycleStatus: LifecycleStatus;
  verdict: ProductHealthVerdict;
  meetsCurrentLifecycleStatus: boolean;
  searchDensity: number;
  verificationFreshnessDays: number;
  qaLevel: ProductMeta["qaLevel"];
  highRiskVerificationGapCount: number;
  currentLifecycleGaps: string[];
  lane: ProductHealthLane;
};

export type RootHealthRecord = RootHealthLaneRecord & {
  status: RootHealthLaneStatus;
};

export type PortfolioHealthReport = {
  root: RootHealthRecord[];
  products: ProductHealthRecord[];
};

const lifecycleRank: Record<LifecycleStatus, number> = {
  pilot: 0,
  beta: 1,
  mature: 2
};

const qaLevelRank: Record<ProductMeta["qaLevel"], number> = {
  smoke: 0,
  standard: 1,
  full: 2
};

export const rootHealthLanes: RootHealthLaneRecord[] = [
  {
    id: "runtime",
    label: "health:runtime",
    command: "npm run health:runtime",
    proves: "typecheck, unit tests, runtime smoke, and shell routing stability",
    includesGeneratedContent: false
  },
  {
    id: "content",
    label: "health:content",
    command: "npm run health:content",
    proves: "root content refresh plus full-pipeline reproducibility for ChaTm, MexTm, and EuTm",
    includesGeneratedContent: true
  },
  {
    id: "release",
    label: "health:release",
    command: "npm run health:release",
    proves: "build + Pages subpath release-readiness",
    includesGeneratedContent: true
  }
];

export const productHealthLaneBySlug: Record<string, ProductHealthLane> = {
  latam: {
    id: "latam-baseline",
    label: "LatTm baseline reference",
    order: 0,
    notes: "Flagship protection lane. Use as the baseline reference rather than the primary rewrite target."
  },
  china: {
    id: "cha-priority",
    label: "Priority 1 · ChaTm",
    order: 1,
    notes: "Growth baseline lane. Standard verification should become repeatable here first."
  },
  mexico: {
    id: "mex-priority",
    label: "Priority 2 · MexTm",
    order: 2,
    notes: "Release-readiness template lane for the strongest country-specific buyer entry guide."
  },
  europe: {
    id: "eu-priority",
    label: "Priority 3 · EuTm",
    order: 3,
    notes: "Validate lane. Stabilize docs sync, Ch2/Ch8, and the remaining controlled gap."
  },
  usa: {
    id: "incubate-pack",
    label: "Priority 5 · Incubate health pack",
    order: 5,
    notes: "Lighter-track verification refresh pack shared with JapTm and UKTm."
  },
  japan: {
    id: "incubate-pack",
    label: "Priority 5 · Incubate health pack",
    order: 5,
    notes: "Lighter-track verification refresh pack shared with UsaTm and UKTm."
  },
  uk: {
    id: "incubate-pack",
    label: "Priority 5 · Incubate health pack",
    order: 5,
    notes: "Lighter-track verification refresh pack shared with UsaTm and JapTm."
  }
};

export const nonProductHealthLanes = [
  {
    id: "brief-gateway",
    label: "Priority 4 · Report / Gateway trust layer",
    order: 4,
    notes: "Align buyer-facing Report and Gateway messaging with actual scorecard, verification state, and current landing order."
  }
] as const;

export function getLifecycleCriteriaGaps(product: Pick<
  ProductMeta,
  "chapterCount" | "searchEntryCount" | "verificationFreshnessDays" | "qaLevel" | "highRiskVerificationGapCount"
>, lifecycleStatus: LifecycleStatus) {
  const criteria = getLifecycleCriteria(lifecycleStatus);
  const gaps: string[] = [];
  const searchDensity = getSearchDensity(product);

  if (product.chapterCount < criteria.minimumChapterCount) {
    gaps.push(`chapter count ${product.chapterCount} < ${criteria.minimumChapterCount}`);
  }

  if (searchDensity < criteria.minimumSearchDensity) {
    gaps.push(`search density ${searchDensity.toFixed(1)} < ${criteria.minimumSearchDensity.toFixed(1)}`);
  }

  if (product.verificationFreshnessDays > criteria.maximumVerificationFreshnessDays) {
    gaps.push(
      `verification freshness ${product.verificationFreshnessDays}d > ${criteria.maximumVerificationFreshnessDays}d`
    );
  }

  if (criteria.minimumQaLevel !== product.qaLevel && qaLevelRank[criteria.minimumQaLevel] > qaLevelRank[product.qaLevel]) {
    gaps.push(`qa level ${product.qaLevel} < ${criteria.minimumQaLevel}`);
  }

  if (
    typeof criteria.maximumHighRiskVerificationGapCount === "number"
    && product.highRiskVerificationGapCount > criteria.maximumHighRiskVerificationGapCount
  ) {
    gaps.push(
      `high-risk gap ${product.highRiskVerificationGapCount} > ${criteria.maximumHighRiskVerificationGapCount}`
    );
  }

  return gaps;
}

export function getProductHealthVerdict(product: ProductMeta): ProductHealthVerdict {
  const assessment = assessProductLifecycle(product);

  if (!assessment.meetsCurrentLifecycleStatus) {
    return "verification-refresh-needed";
  }

  if (lifecycleRank[assessment.recommendedLifecycleStatus] > lifecycleRank[product.lifecycleStatus]) {
    return "upgrade-ready";
  }

  return "hold";
}

export function buildProductHealthRecord(product: ProductMeta): ProductHealthRecord {
  const assessment = assessProductLifecycle(product);

  return {
    slug: product.slug,
    title: product.title,
    portfolioTier: product.portfolioTier,
    currentLifecycleStatus: product.lifecycleStatus,
    targetLifecycleStatus: assessment.recommendedLifecycleStatus,
    verdict: getProductHealthVerdict(product),
    meetsCurrentLifecycleStatus: assessment.meetsCurrentLifecycleStatus,
    searchDensity: assessment.searchDensity,
    verificationFreshnessDays: product.verificationFreshnessDays,
    qaLevel: product.qaLevel,
    highRiskVerificationGapCount: product.highRiskVerificationGapCount,
    currentLifecycleGaps: getLifecycleCriteriaGaps(product, product.lifecycleStatus),
    lane: productHealthLaneBySlug[product.slug] ?? {
      id: "latam-baseline",
      label: "LatTm baseline reference",
      order: 0,
      notes: "Baseline reference lane."
    }
  };
}

export function buildPortfolioHealthReport(
  products: ProductMeta[],
  rootStatuses: Partial<Record<RootHealthLaneId, RootHealthLaneStatus>> = {}
): PortfolioHealthReport {
  return {
    root: rootHealthLanes.map((lane) => ({
      ...lane,
      status: rootStatuses[lane.id] ?? "not-run"
    })),
    products: [...products]
      .map((product) => buildProductHealthRecord(product))
      .sort((left, right) => {
        if (left.lane.order !== right.lane.order) {
          return left.lane.order - right.lane.order;
        }

        return left.slug.localeCompare(right.slug);
      })
  };
}
