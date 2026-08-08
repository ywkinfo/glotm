// 브리프 소재 발굴 lane의 advisory 리포트다. `health:report`와 같은 성격으로 읽는다:
// **reporting surface이지 게이트가 아니다.** 구조 위반은 `npm test`의 `brief discovery contract`가
// 잡고, cadence 경과일도 목표선 대비 표시일 뿐 SLA가 아니다(`docs/briefs-lane.md`가 hard SLA 없음을 잠갔다).
//
// 정확히 말하면: **지표는 종료 코드를 바꾸지 않는다.** 어떤 수치가 나빠도 exit 0이다. 다만 이 스크립트
// 자체가 실패하면(데이터 로드 불가, 타입 위반 등) 예외가 그대로 올라가 CI 스텝은 실패한다. 그 둘은
// 다른 사건이다 — 하나는 운영 신호이고 하나는 하네스 고장이다.

import { pathToFileURL } from "node:url";

import { briefCandidateStaleDays } from "../src/briefs/discovery";
import {
  summarizeBacklog,
  summarizeCadence,
  summarizeCoverage,
  summarizeSourceSweep
} from "../src/briefs/discoveryReport";
import type { SourceSweepStatus } from "../src/briefs/discoveryReport";

export type CliFormat = "markdown" | "json";

export function parseArgs(argv: string[]): { format: CliFormat } {
  let format: CliFormat = "markdown";

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--format") {
      const nextArgument = argv[index + 1];

      if (nextArgument === "json" || nextArgument === "markdown") {
        format = nextArgument;
        index += 1;
      }

      continue;
    }

    if (argument === "--format=json") {
      format = "json";
      continue;
    }

    if (argument === "--format=markdown") {
      format = "markdown";
    }
  }

  return { format };
}

function toDay(value: string | null) {
  return value ? value.slice(0, 10) : "—";
}

function toDays(value: number | null) {
  return value === null ? "—" : `${value}d`;
}

function truncate(value: string, limit = 64) {
  return value.length <= limit ? value : `${value.slice(0, limit - 1)}…`;
}

function toGuideList(slugs: string[]) {
  return slugs.length > 0 ? slugs.join(", ") : "—";
}

function sweepStatusLabel(status: SourceSweepStatus) {
  if (status === "never-verified") {
    return "실사 이력 없음";
  }

  return status === "overdue" ? "주기 초과" : "—";
}

export function buildRadar(now = new Date()) {
  return {
    generatedOn: now.toISOString().slice(0, 10),
    cadence: summarizeCadence(undefined, now),
    backlog: summarizeBacklog(undefined, now),
    coverage: summarizeCoverage(undefined, undefined, now),
    sources: summarizeSourceSweep(undefined, undefined, now)
  };
}

export function formatMarkdown(now = new Date()) {
  const radar = buildRadar(now);
  const lines: string[] = [];

  lines.push("# GloTm Brief Discovery Radar");
  lines.push("");
  lines.push("> advisory 스냅샷이다. 게이트가 아니다 — 구조 위반은 `npm test`의 `brief discovery contract`가 잡는다.");
  lines.push("> cadence는 목표선 대비 경과일일 뿐 SLA가 아니다(`docs/briefs-lane.md`: hard SLA 없음).");
  lines.push("> 지표는 CI를 붉히지 않는다. 다만 이 리포트가 **실행에 실패하면** 그건 하네스 고장이므로 스텝이 실패한다.");
  lines.push("");
  lines.push(`- Generated on: ${radar.generatedOn}`);
  lines.push("- 발행 정본: `src/briefs/archive.ts` · 발굴 정본: `src/briefs/discovery.ts`");
  lines.push("- 계약: `docs/briefs-lane.md`(발행) · `docs/briefs-discovery.md`(발굴)");
  lines.push("");

  lines.push("## Lane Cadence");
  lines.push("");
  lines.push("| 항목 | 값 |");
  lines.push("| --- | --- |");
  lines.push(`| 발행 이슈 수 | ${radar.cadence.issueCount} |`);
  lines.push(`| 최신 이슈 | ${radar.cadence.latestIssueSlug ?? "—"} |`);
  lines.push(`| 최신 발행일 | ${toDay(radar.cadence.latestPublishedAt)} |`);
  lines.push(`| 마지막 발행 후 | ${toDays(radar.cadence.daysSinceLatestIssue)} |`);
  lines.push(
    `| 목표 주기 | ${radar.cadence.targetDays}d (${radar.cadence.beyondTarget ? "목표선 초과 — advisory" : "목표선 이내"}) |`
  );
  lines.push("");

  lines.push("## Backlog");
  lines.push("");
  lines.push("| Status | 건수 |");
  lines.push("| --- | --- |");

  for (const [status, count] of Object.entries(radar.backlog.counts)) {
    lines.push(`| ${status} | ${count} |`);
  }

  lines.push("");
  lines.push("### Ready (발굴 오래된 순)");
  lines.push("");

  if (radar.backlog.ready.length === 0) {
    lines.push("- 없음 — 다음 발행에 바로 쓸 후보가 백로그에 없다.");
  } else {
    lines.push("| Candidate | 발굴 후 | 관련 가이드 | Headline |");
    lines.push("| --- | --- | --- | --- |");

    for (const entry of radar.backlog.ready) {
      lines.push(
        `| ${entry.candidate.id} | ${toDays(entry.ageDays)} | ${toGuideList(entry.candidate.relatedProductSlugs)} | ${truncate(entry.candidate.headline)} |`
      );
    }
  }

  lines.push("");
  lines.push(`### Stalled watching (${briefCandidateStaleDays}일+)`);
  lines.push("");

  if (radar.backlog.stalledWatching.length === 0) {
    lines.push("- 없음");
  } else {
    lines.push("| Candidate | 발굴 후 | 관련 가이드 | Headline |");
    lines.push("| --- | --- | --- | --- |");

    for (const entry of radar.backlog.stalledWatching) {
      lines.push(
        `| ${entry.candidate.id} | ${toDays(entry.ageDays)} | ${toGuideList(entry.candidate.relatedProductSlugs)} | ${truncate(entry.candidate.headline)} |`
      );
    }

    lines.push("");
    lines.push("> 버리라는 신호가 아니라 살릴지 버릴지 한 번 판단하라는 신호다. 버릴 때는 `droppedReason`을 남긴다.");
  }

  lines.push("");
  lines.push("## Guide Coverage");
  lines.push("");
  lines.push("| Guide | 브리프 링크 이슈 | 마지막 등장 | 경과 | 열린 후보 |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const guide of radar.coverage.guides) {
    lines.push(
      `| ${guide.shortLabel} (${guide.slug}) | ${guide.issueCount} | ${toDay(guide.lastPublishedAt)} | ${toDays(guide.daysSinceLastIssue)} | ${guide.openCandidateCount} |`
    );
  }

  lines.push("");
  lines.push("### Jurisdiction tags (정규화 기준)");
  lines.push("");
  lines.push("| Jurisdiction | 이슈 |");
  lines.push("| --- | --- |");

  for (const row of radar.coverage.jurisdictions) {
    lines.push(`| ${row.jurisdiction} | ${row.issueCount} |`);
  }

  lines.push("");
  lines.push("## Source Sweep");
  lines.push("");
  lines.push("| Source | Tier | Cadence | 마지막 verified | 경과 | backfill | 상태 |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");

  for (const row of radar.sources) {
    lines.push(
      `| ${row.source.id} | ${row.source.tier} | ${row.source.sweepCadence} | ${toDay(row.lastVerifiedOn)} | ${toDays(row.daysSinceVerified)} | ${toDay(row.lastBackfilledOn)} | ${sweepStatusLabel(row.status)} |`
    );
  }

  lines.push("");
  lines.push("> `verified`는 소스를 실제로 연 회차만 센다. `repository-backfill`은 후보의 계보 기록이라 freshness를 리셋하지 않는다.");
  lines.push("> `never-verified`는 cadence와 무관하게 표시된다 — event-driven 소스도 한 번은 실사해야 한다.");
  lines.push("> sweep을 돌면 `src/briefs/discovery.ts`의 `briefSweepLog`에 회차를 append한다. 산출이 없어도 기록한다.");

  return lines.join("\n");
}

export function buildCliOutput(argv: string[], now = new Date()) {
  const { format } = parseArgs(argv);

  return format === "json" ? JSON.stringify(buildRadar(now), null, 2) : formatMarkdown(now);
}

const entryArg = process.argv[1];

if (entryArg && import.meta.url === pathToFileURL(entryArg).href) {
  console.log(buildCliOutput(process.argv.slice(2)));
}
