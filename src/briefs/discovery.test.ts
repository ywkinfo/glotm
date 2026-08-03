import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { liveShellProducts } from "../products/registry";
import { buildProductPath } from "../products/shared";
import { briefIssues, getBriefIssueBySlug } from "./archive";
import type { BriefIssue } from "./archive";
import {
  briefCandidates,
  briefDiscoveryStartOn,
  briefSources,
  briefSweepLog,
  canonicalJurisdictions,
  getBriefCandidateById,
  getBriefCandidatesByStatus,
  getBriefSourceById,
  getCanonicalJurisdictions,
  jurisdictionByProductSlug,
  normalizeJurisdictionTag
} from "./discovery";
import type { BriefCandidate, BriefSource, BriefSweep } from "./discovery";
import {
  elapsedUtcDays,
  getIssueProductSlugs,
  resolveProductSlugFromHref,
  summarizeBacklog,
  summarizeCadence,
  summarizeCoverage,
  summarizeSourceSweep
} from "./discoveryReport";

const liveSlugs = new Set(liveShellProducts.map((product) => product.slug));
const canonicalJurisdictionSet = new Set(canonicalJurisdictions);
const discoveryStartAt = Date.parse(briefDiscoveryStartOn);

describe("brief discovery contract", () => {
  it("keeps every registered source resolvable, https, and pointed at live guides", () => {
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();

    for (const source of briefSources) {
      expect(seenIds.has(source.id), `duplicate source id ${source.id}`).toBe(false);
      seenIds.add(source.id);

      expect(seenUrls.has(source.url), `duplicate source url ${source.url}`).toBe(false);
      seenUrls.add(source.url);

      expect(source.label.trim().length).toBeGreaterThan(0);
      expect(source.url.startsWith("https://"), `${source.id} → ${source.url}`).toBe(true);
      expect(() => new URL(source.url)).not.toThrow();

      expect(source.jurisdictions.length).toBeGreaterThan(0);

      for (const jurisdiction of source.jurisdictions) {
        expect(
          canonicalJurisdictionSet.has(jurisdiction),
          `${source.id} → unknown jurisdiction ${jurisdiction}`
        ).toBe(true);
      }

      expect(source.relatedProductSlugs.length).toBeGreaterThan(0);

      for (const slug of source.relatedProductSlugs) {
        expect(liveSlugs.has(slug), `${source.id} → ${slug} is not a live guide`).toBe(true);
      }

      expect(getBriefSourceById(source.id)).toBe(source);
    }
  });

  // 커버리지 바닥: 어떤 가이드도 "볼 곳이 정해지지 않은" 상태로 남지 않는다.
  // 관할까지 대조하는 이유: KIPO·WIPO처럼 7개 가이드 전부를 relatedProductSlugs에 다는 cross-cutting
  // 소스가 있어서, slug 포함만 보면 그 가이드의 관할 기관이 등록부에서 빠져도 바닥이 통과해 버린다.
  it("gives every live guide a primary source that covers its own jurisdiction", () => {
    for (const product of liveShellProducts) {
      const jurisdiction = jurisdictionByProductSlug[product.slug];
      expect(jurisdiction, `${product.slug} has no canonical jurisdiction`).toBeDefined();

      const primarySources = briefSources.filter(
        (source) =>
          source.tier === "primary" &&
          source.relatedProductSlugs.includes(product.slug) &&
          source.jurisdictions.includes(jurisdiction!)
      );

      expect(
        primarySources.length,
        `${product.shortLabel} has no primary source for ${jurisdiction}`
      ).toBeGreaterThan(0);
    }
  });

  it("requires provenance and live-guide routing on every candidate", () => {
    const seenIds = new Set<string>();

    for (const candidate of briefCandidates) {
      expect(seenIds.has(candidate.id), `duplicate candidate id ${candidate.id}`).toBe(false);
      seenIds.add(candidate.id);

      expect(candidate.headline.trim().length).toBeGreaterThan(0);
      expect(candidate.trigger.trim().length, `${candidate.id} has no trigger`).toBeGreaterThan(0);

      const discoveredAt = Date.parse(candidate.discoveredOn);
      expect(Number.isNaN(discoveredAt), `${candidate.id} discoveredOn`).toBe(false);
      expect(discoveredAt).toBeLessThanOrEqual(Date.now());

      expect(candidate.sourceIds.length, `${candidate.id} has no source`).toBeGreaterThan(0);

      for (const sourceId of candidate.sourceIds) {
        expect(
          getBriefSourceById(sourceId),
          `${candidate.id} → unknown source ${sourceId}`
        ).toBeDefined();
      }

      for (const slug of candidate.relatedProductSlugs) {
        expect(liveSlugs.has(slug), `${candidate.id} → ${slug} is not a live guide`).toBe(true);
      }

      // 주제 태그는 자유지만 관할 축은 최소 하나가 정규 어휘여야 커버리지 집계에 잡힌다.
      expect(
        getCanonicalJurisdictions(candidate.jurisdictions).length,
        `${candidate.id} has no canonical jurisdiction`
      ).toBeGreaterThan(0);

      expect(getBriefCandidateById(candidate.id)).toBe(candidate);
    }
  });

  it("closes published candidates onto a real issue and keeps dropped ones explained", () => {
    for (const candidate of briefCandidates) {
      if (candidate.status === "published") {
        expect(candidate.publishedAs, `${candidate.id} is published without a slug`).toBeDefined();

        const issue = getBriefIssueBySlug(candidate.publishedAs!);
        expect(issue, `${candidate.id} → missing issue ${candidate.publishedAs}`).toBeDefined();
        expect(new Date(issue!.publishedAt).getTime()).toBeGreaterThanOrEqual(
          Date.parse(candidate.discoveredOn)
        );
        continue;
      }

      expect(
        candidate.publishedAs,
        `${candidate.id} is ${candidate.status} but points at an issue`
      ).toBeUndefined();

      if (candidate.status === "dropped") {
        expect(
          candidate.droppedReason?.trim().length,
          `${candidate.id} was dropped without a reason`
        ).toBeGreaterThan(0);
      }
    }
  });

  // 역방향 폐합: 하네스 도입 이후 발행된 이슈는 백로그를 우회할 수 없다.
  // 도입 이전 16개 이슈는 소급 대상이 아니다.
  it("traces every issue published after the harness start back to a candidate", () => {
    const publishedCandidateSlugs = new Set(
      getBriefCandidatesByStatus("published").map((candidate) => candidate.publishedAs)
    );

    for (const issue of briefIssues) {
      if (Date.parse(issue.publishedAt) < discoveryStartAt) {
        continue;
      }

      expect(
        publishedCandidateSlugs.has(issue.slug),
        `${issue.slug} was published without a discovery candidate`
      ).toBe(true);
    }
  });

  it("keeps the sweep log newest-first with resolvable ids", () => {
    const timestamps = briefSweepLog.map((sweep) => Date.parse(sweep.sweptOn));

    for (const [index, sweep] of briefSweepLog.entries()) {
      expect(Number.isNaN(timestamps[index]), `${sweep.sweptOn} is not a date`).toBe(false);
      expect(timestamps[index]).toBeLessThanOrEqual(Date.now());

      expect(sweep.sourceIds.length, `${sweep.sweptOn} swept nothing`).toBeGreaterThan(0);

      for (const sourceId of sweep.sourceIds) {
        expect(
          getBriefSourceById(sourceId),
          `${sweep.sweptOn} → unknown source ${sourceId}`
        ).toBeDefined();
      }

      for (const candidateId of sweep.foundCandidateIds) {
        expect(
          getBriefCandidateById(candidateId),
          `${sweep.sweptOn} → unknown candidate ${candidateId}`
        ).toBeDefined();
      }
    }

    expect(timestamps).toEqual([...timestamps].sort((left, right) => right - left));
  });

  // discovery 데이터는 ops 전용이다. 리더 UI·prerender가 이걸 import하기 시작하면 배포 번들에
  // 운영 백로그가 실린다.
  it("keeps discovery data out of the app runtime", () => {
    const srcDir = path.resolve(__dirname, "..");
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walk(entryPath);
          continue;
        }

        if (!/\.tsx?$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) {
          continue;
        }

        if (entryPath.startsWith(path.join(srcDir, "briefs", "discovery"))) {
          continue;
        }

        if (/from "[^"]*\/discovery(Report)?"/.test(readFileSync(entryPath, "utf8"))) {
          offenders.push(path.relative(srcDir, entryPath));
        }
      }
    };

    walk(srcDir);

    expect(offenders).toEqual([]);
  });
});

describe("brief discovery jurisdiction vocabulary", () => {
  it("folds the aliases the archive already uses", () => {
    expect(normalizeJurisdictionTag("UK")).toBe("United Kingdom");
    expect(normalizeJurisdictionTag("United Kingdom")).toBe("United Kingdom");
    expect(normalizeJurisdictionTag("EU")).toBe("Europe");
    expect(normalizeJurisdictionTag("europe")).toBe("Europe");
    expect(normalizeJurisdictionTag("United States")).toBe("United States");
  });

  it("treats unknown tags as topic tags rather than jurisdictions", () => {
    expect(normalizeJurisdictionTag("Counterfeit Damages")).toBeUndefined();
    expect(getCanonicalJurisdictions(["UK", "IPEC", "United Kingdom"])).toEqual(["United Kingdom"]);
  });

  it("covers every live guide with a canonical jurisdiction label", () => {
    for (const product of liveShellProducts) {
      const label = normalizeJurisdictionTag(product.slug === "latam" ? "latam" : product.slug);
      expect(label, `${product.slug} has no canonical jurisdiction`).toBeDefined();
      expect(canonicalJurisdictionSet.has(label!)).toBe(true);
    }
  });
});

// ---- 파생 계산 (fixture 기반) ----
//
// 실제 데이터는 위 contract가 검증하고, 여기서는 계산 자체를 고정 입력으로 확인한다.
// published·dropped 분기는 현재 실데이터에 없으므로 fixture로만 덮인다.

const now = new Date("2026-08-03T00:00:00.000Z");

function buildIssue(overrides: Partial<BriefIssue> & Pick<BriefIssue, "slug" | "publishedAt">) {
  return {
    title: "fixture",
    summary: "fixture",
    cadenceLabel: "주간 브리프",
    jurisdictions: ["Global"],
    items: [],
    ...overrides
  } satisfies BriefIssue;
}

function buildCandidate(overrides: Partial<BriefCandidate> & Pick<BriefCandidate, "id">) {
  return {
    headline: "fixture",
    trigger: "fixture",
    discoveredOn: "2026-08-01",
    sourceIds: ["kipo"],
    jurisdictions: ["Global"],
    relatedProductSlugs: [],
    status: "watching",
    ...overrides
  } satisfies BriefCandidate;
}

describe("brief discovery report", () => {
  it("counts elapsed days in whole UTC days and never goes negative", () => {
    expect(elapsedUtcDays("2026-07-20T00:00:00.000Z", now)).toBe(14);
    expect(elapsedUtcDays("2026-08-03T00:00:00.000Z", now)).toBe(0);
    expect(elapsedUtcDays("2026-08-10T00:00:00.000Z", now)).toBe(0);
    expect(elapsedUtcDays("not-a-date", now)).toBeNull();
  });

  it("reports cadence without turning it into a verdict", () => {
    const summary = summarizeCadence(
      [
        buildIssue({ slug: "b", publishedAt: "2026-07-20T00:00:00.000Z" }),
        buildIssue({ slug: "a", publishedAt: "2026-07-11T00:00:00.000Z" })
      ],
      now
    );

    expect(summary.issueCount).toBe(2);
    expect(summary.latestIssueSlug).toBe("b");
    expect(summary.daysSinceLatestIssue).toBe(14);
    expect(summary.targetDays).toBe(7);
    expect(summary.beyondTarget).toBe(true);

    const fresh = summarizeCadence(
      [buildIssue({ slug: "c", publishedAt: "2026-08-01T00:00:00.000Z" })],
      now
    );
    expect(fresh.beyondTarget).toBe(false);
  });

  it("splits the backlog by status and surfaces stalled watching candidates", () => {
    const summary = summarizeBacklog(
      [
        buildCandidate({ id: "ready-old", status: "ready", discoveredOn: "2026-06-01" }),
        buildCandidate({ id: "ready-new", status: "ready", discoveredOn: "2026-08-01" }),
        buildCandidate({ id: "watch-fresh", discoveredOn: "2026-07-25" }),
        buildCandidate({ id: "watch-stale", discoveredOn: "2026-06-20" }),
        buildCandidate({ id: "done", status: "published", publishedAs: "issue-slug" }),
        buildCandidate({ id: "gone", status: "dropped", droppedReason: "발효 전 철회" })
      ],
      now
    );

    expect(summary.counts).toEqual({ watching: 2, ready: 2, published: 1, dropped: 1 });
    expect(summary.ready.map((entry) => entry.candidate.id)).toEqual(["ready-old", "ready-new"]);
    expect(summary.ready[0]?.ageDays).toBe(63);
    expect(summary.stalledWatching.map((entry) => entry.candidate.id)).toEqual(["watch-stale"]);
  });

  it("maps guide deep links back to their guide", () => {
    const ukPath = buildProductPath(
      liveShellProducts.find((product) => product.slug === "uk")!
    );

    expect(resolveProductSlugFromHref(ukPath)).toBe("uk");
    expect(resolveProductSlugFromHref(`${ukPath}/chapter/08_use-nonuse#section`)).toBe("uk");
    expect(resolveProductSlugFromHref("/briefs")).toBeUndefined();
  });

  it("counts guide coverage from issue links and open candidates", () => {
    const europePath = buildProductPath(
      liveShellProducts.find((product) => product.slug === "europe")!
    );

    const issues = [
      buildIssue({
        slug: "recent-europe",
        publishedAt: "2026-07-20T00:00:00.000Z",
        jurisdictions: ["UK", "Europe"],
        items: [
          {
            id: "item",
            headline: "h",
            whatChanged: "w",
            whoShouldCare: "w",
            whyItMatters: "w",
            nextAction: "n",
            relatedGuideLinks: [
              { label: "EuTm", href: `${europePath}/chapter/08_use#anchor` },
              { label: "EuTm home", href: europePath }
            ]
          }
        ]
      })
    ];

    const summary = summarizeCoverage(
      issues,
      [
        buildCandidate({ id: "open", relatedProductSlugs: ["europe"] }),
        buildCandidate({
          id: "closed",
          status: "published",
          publishedAs: "x",
          relatedProductSlugs: ["europe"]
        })
      ],
      now
    );

    const europe = summary.guides.find((guide) => guide.slug === "europe");
    expect(europe?.issueCount).toBe(1);
    expect(europe?.daysSinceLastIssue).toBe(14);
    // 링크가 2개여도 이슈는 1건으로 센다.
    expect(europe?.openCandidateCount).toBe(1);

    const japan = summary.guides.find((guide) => guide.slug === "japan");
    expect(japan?.issueCount).toBe(0);
    expect(japan?.lastPublishedAt).toBeNull();

    // `UK`와 `Europe`이 각각 정규 관할로 접힌다.
    expect(summary.jurisdictions).toEqual([
      { jurisdiction: "Europe", issueCount: 1 },
      { jurisdiction: "United Kingdom", issueCount: 1 }
    ]);

    expect(getIssueProductSlugs(issues[0]!)).toEqual(["europe"]);
  });

  it("flags sources past their sweep interval and leaves event-driven ones alone", () => {
    const sources: BriefSource[] = [
      {
        id: "weekly-late",
        label: "weekly",
        url: "https://example.test/weekly",
        tier: "primary",
        jurisdictions: ["Global"],
        relatedProductSlugs: ["china"],
        sweepCadence: "weekly"
      },
      {
        id: "monthly-ok",
        label: "monthly",
        url: "https://example.test/monthly",
        tier: "primary",
        jurisdictions: ["Global"],
        relatedProductSlugs: ["china"],
        sweepCadence: "monthly"
      },
      {
        id: "event-never",
        label: "event",
        url: "https://example.test/event",
        tier: "primary",
        jurisdictions: ["Global"],
        relatedProductSlugs: ["china"],
        sweepCadence: "event-driven"
      },
      {
        id: "weekly-never",
        label: "never swept",
        url: "https://example.test/never",
        tier: "primary",
        jurisdictions: ["Global"],
        relatedProductSlugs: ["china"],
        sweepCadence: "weekly"
      }
    ];

    const sweeps: BriefSweep[] = [
      { sweptOn: "2026-07-25", sourceIds: ["weekly-late", "monthly-ok"], foundCandidateIds: [] },
      { sweptOn: "2026-07-01", sourceIds: ["weekly-late"], foundCandidateIds: [] }
    ];

    const rows = summarizeSourceSweep(sources, sweeps, now);
    const byId = Object.fromEntries(rows.map((row) => [row.source.id, row]));

    // 최신 sweep이 먼저 잡힌다(로그 최신순 계약).
    expect(byId["weekly-late"]?.lastSweptOn).toBe("2026-07-25");
    expect(byId["weekly-late"]?.daysSinceSweep).toBe(9);
    expect(byId["weekly-late"]?.overdue).toBe(true);
    expect(byId["monthly-ok"]?.overdue).toBe(false);
    expect(byId["event-never"]?.overdue).toBe(false);
    expect(byId["weekly-never"]?.lastSweptOn).toBeNull();
    expect(byId["weekly-never"]?.overdue).toBe(true);
  });
});
