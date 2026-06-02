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

// maximumVerificationFreshnessDays 는 verifiedOn(= shared root lane 재검증 시점)으로부터의
// 경과일 상한이다. 이것은 lane freshness 게이트이지, 1차 출처 대조(fact freshness) 게이트가 아니다.
// 사실 재대조 cadence는 tier를 게이팅하지 않으며 docs/monthly-review-template.md에서 별도로 본다.
// 윈도는 dormant(Phase 2.5) 솔로 운영 기준 ~분기 1회 lane 재검증을 가정해 잡았다(pilot 180 / beta 150 / mature 120일).
const lifecycleCriteriaByStatus: Record<LifecycleStatus, LifecycleCriteria> = {
  pilot: {
    lifecycleStatus: "pilot",
    minimumChapterCount: 12,
    minimumSearchDensity: 5,
    maximumVerificationFreshnessDays: 180,
    minimumQaLevel: "smoke"
  },
  beta: {
    lifecycleStatus: "beta",
    minimumChapterCount: 14,
    minimumSearchDensity: 9,
    maximumVerificationFreshnessDays: 150,
    minimumQaLevel: "standard"
  },
  mature: {
    lifecycleStatus: "mature",
    minimumChapterCount: 15,
    minimumSearchDensity: 12,
    maximumVerificationFreshnessDays: 120,
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
