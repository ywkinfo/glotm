import type {
  LifecycleStatus,
  ProductMeta,
  QaLevel
} from "./shared";
import { getVerificationFreshnessDays } from "./shared";

type DensityInput = Pick<ProductMeta, "chapterCount" | "searchEntryCount">;

type LifecycleScorecardInput = Pick<
  ProductMeta,
  | "chapterCount"
  | "searchEntryCount"
  | "verifiedOn"
  | "qaLevel"
  | "highRiskVerificationGapCount"
>;

export type LifecycleCriteria = {
  lifecycleStatus: LifecycleStatus;
  minimumChapterCount: number;
  minimumSearchDensity: number;
  maximumVerificationFreshnessDays: number;
  minimumQaLevel: QaLevel;
  maximumHighRiskVerificationGapCount?: number;
};

const qaLevelRank: Record<QaLevel, number> = {
  smoke: 0,
  standard: 1,
  full: 2
};

const lifecycleCriteriaByStatus: Record<LifecycleStatus, LifecycleCriteria> = {
  pilot: {
    lifecycleStatus: "pilot",
    minimumChapterCount: 12,
    minimumSearchDensity: 5,
    maximumVerificationFreshnessDays: 120,
    minimumQaLevel: "smoke"
  },
  beta: {
    lifecycleStatus: "beta",
    minimumChapterCount: 14,
    minimumSearchDensity: 9,
    maximumVerificationFreshnessDays: 90,
    minimumQaLevel: "standard"
  },
  mature: {
    lifecycleStatus: "mature",
    minimumChapterCount: 15,
    minimumSearchDensity: 12,
    maximumVerificationFreshnessDays: 60,
    minimumQaLevel: "full",
    maximumHighRiskVerificationGapCount: 0
  }
};

export function getSearchDensity({ chapterCount, searchEntryCount }: DensityInput) {
  if (chapterCount <= 0) {
    return 0;
  }

  return searchEntryCount / chapterCount;
}

export function getLifecycleCriteria(status: LifecycleStatus) {
  return lifecycleCriteriaByStatus[status];
}

export function doesQaLevelMeetMinimum(qaLevel: QaLevel, minimumQaLevel: QaLevel) {
  return qaLevelRank[qaLevel] >= qaLevelRank[minimumQaLevel];
}

export function meetsLifecycleCriteria(
  input: LifecycleScorecardInput,
  lifecycleStatus: LifecycleStatus
) {
  const criteria = getLifecycleCriteria(lifecycleStatus);

  if (input.chapterCount < criteria.minimumChapterCount) {
    return false;
  }

  if (getSearchDensity(input) < criteria.minimumSearchDensity) {
    return false;
  }

  if (getVerificationFreshnessDays(input) > criteria.maximumVerificationFreshnessDays) {
    return false;
  }

  if (!doesQaLevelMeetMinimum(input.qaLevel, criteria.minimumQaLevel)) {
    return false;
  }

  if (
    typeof criteria.maximumHighRiskVerificationGapCount === "number"
    && input.highRiskVerificationGapCount > criteria.maximumHighRiskVerificationGapCount
  ) {
    return false;
  }

  return true;
}

export function getRecommendedLifecycleStatus(input: LifecycleScorecardInput): LifecycleStatus {
  if (meetsLifecycleCriteria(input, "mature")) {
    return "mature";
  }

  if (meetsLifecycleCriteria(input, "beta")) {
    return "beta";
  }

  return "pilot";
}

export function assessProductLifecycle(product: ProductMeta) {
  const searchDensity = getSearchDensity(product);
  const recommendedLifecycleStatus = getRecommendedLifecycleStatus(product);
  const meetsCurrentLifecycleStatus = meetsLifecycleCriteria(product, product.lifecycleStatus);

  return {
    searchDensity,
    recommendedLifecycleStatus,
    meetsCurrentLifecycleStatus
  };
}
