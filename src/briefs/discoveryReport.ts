// 발굴 lane의 파생 계산. I/O 없는 순수 함수만 두고, 테스트와 `scripts/briefs-radar.ts`가 같은 함수를
// 공유한다(`archive.ts`의 resolveBriefCorrection을 UI·prerender·테스트가 함께 쓰는 방식과 같다).
//
// 여기서 나오는 값은 전부 advisory다. 어떤 함수도 pass/fail 판정을 만들지 않는다.
// 구조 위반은 `discovery.test.ts`가 게이트하고, cadence는 `docs/briefs-lane.md`가 hard SLA를
// 두지 않기로 잠갔다.

import { liveShellProducts } from "../products/registry";
import { buildProductPath, startOfUtcDay } from "../products/shared";
import { briefIssues } from "./archive";
import type { BriefIssue } from "./archive";
import {
  briefCadenceTargetDays,
  briefCandidateStaleDays,
  briefCandidates,
  briefSources,
  briefSweepLog,
  getCanonicalJurisdictions
} from "./discovery";
import type {
  BriefCandidate,
  BriefCandidateStatus,
  BriefSource,
  BriefSweep,
  BriefSweepCadence
} from "./discovery";

export const candidateStatuses: BriefCandidateStatus[] = [
  "watching",
  "ready",
  "published",
  "dropped"
];

// sweepCadence별 "이 정도 지나면 다시 볼 때"의 기준선. event-driven은 정해진 주기가 없다.
const sweepIntervalDays: Record<BriefSweepCadence, number | null> = {
  weekly: 7,
  monthly: 30,
  "event-driven": null
};

export function elapsedUtcDays(isoDate: string, now = new Date()) {
  const from = Date.parse(isoDate);
  const to = now.getTime();

  if (Number.isNaN(from) || Number.isNaN(to)) {
    return null;
  }

  return Math.max(0, Math.floor((startOfUtcDay(to) - startOfUtcDay(from)) / 86_400_000));
}

export type CadenceSummary = {
  issueCount: number;
  latestIssueSlug: string | null;
  latestPublishedAt: string | null;
  daysSinceLatestIssue: number | null;
  targetDays: number;
  // 목표 주기를 넘겼는지. 표시용 boolean이며 게이팅에 쓰지 않는다.
  beyondTarget: boolean;
};

export function summarizeCadence(
  issues: BriefIssue[] = briefIssues,
  now = new Date()
): CadenceSummary {
  const latest = issues[0];
  const daysSinceLatestIssue = latest ? elapsedUtcDays(latest.publishedAt, now) : null;

  return {
    issueCount: issues.length,
    latestIssueSlug: latest?.slug ?? null,
    latestPublishedAt: latest?.publishedAt ?? null,
    daysSinceLatestIssue,
    targetDays: briefCadenceTargetDays,
    beyondTarget:
      daysSinceLatestIssue !== null && daysSinceLatestIssue > briefCadenceTargetDays
  };
}

export type BacklogEntry = {
  candidate: BriefCandidate;
  ageDays: number | null;
};

export type BacklogSummary = {
  counts: Record<BriefCandidateStatus, number>;
  // 오래 기다린 순. 먼저 쓰라는 뜻이 아니라 먼저 판단하라는 뜻이다.
  ready: BacklogEntry[];
  // watching으로 briefCandidateStaleDays를 넘긴 후보. 살릴지 버릴지 결정 대상.
  stalledWatching: BacklogEntry[];
};

function toBacklogEntry(candidate: BriefCandidate, now: Date): BacklogEntry {
  return { candidate, ageDays: elapsedUtcDays(candidate.discoveredOn, now) };
}

function byAgeDescending(left: BacklogEntry, right: BacklogEntry) {
  return (right.ageDays ?? 0) - (left.ageDays ?? 0);
}

export function summarizeBacklog(
  candidates: BriefCandidate[] = briefCandidates,
  now = new Date()
): BacklogSummary {
  const counts = Object.fromEntries(
    candidateStatuses.map((status) => [
      status,
      candidates.filter((candidate) => candidate.status === status).length
    ])
  ) as Record<BriefCandidateStatus, number>;

  const ready = candidates
    .filter((candidate) => candidate.status === "ready")
    .map((candidate) => toBacklogEntry(candidate, now))
    .sort(byAgeDescending);

  const stalledWatching = candidates
    .filter((candidate) => candidate.status === "watching")
    .map((candidate) => toBacklogEntry(candidate, now))
    .filter((entry) => (entry.ageDays ?? 0) >= briefCandidateStaleDays)
    .sort(byAgeDescending);

  return { counts, ready, stalledWatching };
}

// href → live guide slug 역매핑. archive.test.ts가 relatedGuideLinks를 검증할 때 쓰는 규칙과 같다.
// 가이드 홈과 챕터·섹션 deep link를 모두 같은 guide로 접는다.
export function resolveProductSlugFromHref(href: string) {
  const match = liveShellProducts.find((product) => {
    const productPath = buildProductPath(product);
    return href === productPath || href.startsWith(`${productPath}/`);
  });

  return match?.slug;
}

export function getIssueProductSlugs(issue: BriefIssue) {
  const slugs = issue.items
    .flatMap((item) => item.relatedGuideLinks)
    .map((link) => resolveProductSlugFromHref(link.href))
    .filter((slug): slug is string => Boolean(slug));

  return [...new Set(slugs)];
}

export type GuideCoverageRow = {
  slug: string;
  shortLabel: string;
  issueCount: number;
  lastIssueSlug: string | null;
  lastPublishedAt: string | null;
  daysSinceLastIssue: number | null;
  // watching + ready 후보 수. 0이면 이 가이드에 댈 소재가 백로그에 없다는 뜻이다.
  openCandidateCount: number;
};

export type JurisdictionCoverageRow = {
  jurisdiction: string;
  issueCount: number;
};

export type CoverageSummary = {
  guides: GuideCoverageRow[];
  jurisdictions: JurisdictionCoverageRow[];
};

export function summarizeCoverage(
  issues: BriefIssue[] = briefIssues,
  candidates: BriefCandidate[] = briefCandidates,
  now = new Date()
): CoverageSummary {
  const openCandidates = candidates.filter(
    (candidate) => candidate.status === "watching" || candidate.status === "ready"
  );

  const guides = liveShellProducts.map((product) => {
    const matched = issues.filter((issue) => getIssueProductSlugs(issue).includes(product.slug));
    // issues는 최신순 정렬 계약을 갖는다(archive.test.ts). 첫 항목이 가장 최근 등장이다.
    const last = matched[0];

    return {
      slug: product.slug,
      shortLabel: product.shortLabel,
      issueCount: matched.length,
      lastIssueSlug: last?.slug ?? null,
      lastPublishedAt: last?.publishedAt ?? null,
      daysSinceLastIssue: last ? elapsedUtcDays(last.publishedAt, now) : null,
      openCandidateCount: openCandidates.filter((candidate) =>
        candidate.relatedProductSlugs.includes(product.slug)
      ).length
    };
  });

  const jurisdictionCounts = new Map<string, number>();

  for (const issue of issues) {
    for (const jurisdiction of getCanonicalJurisdictions(issue.jurisdictions)) {
      jurisdictionCounts.set(jurisdiction, (jurisdictionCounts.get(jurisdiction) ?? 0) + 1);
    }
  }

  const jurisdictions = [...jurisdictionCounts.entries()]
    .map(([jurisdiction, issueCount]) => ({ jurisdiction, issueCount }))
    .sort(
      (left, right) =>
        right.issueCount - left.issueCount || left.jurisdiction.localeCompare(right.jurisdiction)
    );

  return { guides, jurisdictions };
}

export type SourceSweepRow = {
  source: BriefSource;
  lastSweptOn: string | null;
  daysSinceSweep: number | null;
  intervalDays: number | null;
  // 주기가 있는 소스가 그 주기를 넘겼거나 한 번도 sweep되지 않은 경우.
  overdue: boolean;
};

export function summarizeSourceSweep(
  sources: BriefSource[] = briefSources,
  sweeps: BriefSweep[] = briefSweepLog,
  now = new Date()
): SourceSweepRow[] {
  return sources.map((source) => {
    // sweeps는 최신순 계약이므로 첫 매치가 마지막 sweep이다.
    const lastSweep = sweeps.find((sweep) => sweep.sourceIds.includes(source.id));
    const lastSweptOn = lastSweep?.sweptOn ?? null;
    const daysSinceSweep = lastSweptOn ? elapsedUtcDays(lastSweptOn, now) : null;
    const intervalDays = sweepIntervalDays[source.sweepCadence];

    return {
      source,
      lastSweptOn,
      daysSinceSweep,
      intervalDays,
      overdue:
        intervalDays !== null &&
        (daysSinceSweep === null || daysSinceSweep > intervalDays)
    };
  });
}
