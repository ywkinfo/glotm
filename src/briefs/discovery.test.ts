import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import ts from "typescript";
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
  hasCanonicalJurisdiction,
  isCanonicalJurisdiction,
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
// `2026-08-02` 또는 `2026년 6월` 형태. 어느 쪽이든 날짜가 실제로 있어야 datable trigger다.
const datePattern = /\d{4}-\d{2}-\d{2}|\d{4}년\s*\d{1,2}월/;

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

      // 넓은 루트 URL은 "무엇을 봐야 sweep이 끝나는가"를 말해 주지 않는다. sweepTarget이 그 정의다.
      expect(
        source.sweepTarget.trim().length,
        `${source.id} does not say what a completed sweep looks like`
      ).toBeGreaterThan(0);

      // event-driven은 주기가 없으므로 무엇이 오면 다시 보는지를 선언해야 한다.
      if (source.sweepCadence === "event-driven") {
        expect(
          source.reviewTrigger?.trim().length,
          `${source.id} is event-driven without a reviewTrigger`
        ).toBeGreaterThan(0);
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

      // "datable public trigger"는 발행 계약과 같은 기준이다. 산문이 비어있지 않은 것만으로는
      // 날짜 있는 트리거가 되지 않으므로 날짜 토큰(ISO 또는 한국어 표기)을 실제로 요구한다.
      expect(
        datePattern.test(candidate.trigger),
        `${candidate.id} trigger carries no date`
      ).toBe(true);

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

      // 어떤 가이드에도 닿지 않는 후보는 커버리지에 잡히지 않아 백로그에서 조용히 늙는다.
      expect(
        candidate.relatedProductSlugs.length,
        `${candidate.id} routes to no guide`
      ).toBeGreaterThan(0);

      for (const slug of candidate.relatedProductSlugs) {
        expect(liveSlugs.has(slug), `${candidate.id} → ${slug} is not a live guide`).toBe(true);
      }

      // 주제 태그는 자유지만 관할 축 하나는 **literal** 정규 어휘여야 한다. 별칭 정규화를 게이트로
      // 쓰면 애초에 문제였던 `UK`·`EU`가 신규 데이터에서도 통과해 드리프트가 계속된다.
      expect(
        hasCanonicalJurisdiction(candidate.jurisdictions),
        `${candidate.id} has no literal canonical jurisdiction (aliases like UK/EU do not count)`
      ).toBe(true);

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
        continue;
      }

      // 되살린 후보에 옛 폐기 사유가 남아 있으면 백로그를 읽는 사람이 상태를 오독한다.
      expect(
        candidate.droppedReason,
        `${candidate.id} is ${candidate.status} but still carries a droppedReason`
      ).toBeUndefined();
    }
  });

  // 도입일을 앞으로 밀면 "발행 이슈는 백로그를 거쳐야 한다"는 게이트가 조용히 사라진다.
  // 값 자체를 고정해, 옮기려면 이 테스트를 의도적으로 고치게 만든다.
  it("pins the harness start date so the backlog gate cannot be retired quietly", () => {
    expect(
      briefDiscoveryStartOn,
      "moving briefDiscoveryStartOn forward retires the backlog-bypass gate — change this test on purpose or not at all"
    ).toBe("2026-08-03");
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
        const candidate = getBriefCandidateById(candidateId);
        expect(candidate, `${sweep.sweptOn} → unknown candidate ${candidateId}`).toBeDefined();

        // 계보: 이 회차에서 나왔다면 그 회차에서 실제로 본 소스 중 하나에서 나왔어야 한다.
        expect(
          candidate!.sourceIds.some((sourceId) => sweep.sourceIds.includes(sourceId)),
          `${sweep.sweptOn} → ${candidateId} cites no source that this sweep covered`
        ).toBe(true);

        // 그리고 그 회차보다 나중에 "발굴"됐을 수는 없다.
        expect(
          Date.parse(candidate!.discoveredOn),
          `${candidateId} was discovered after the sweep that found it`
        ).toBeLessThanOrEqual(Date.parse(sweep.sweptOn));
      }
    }

    expect(timestamps).toEqual([...timestamps].sort((left, right) => right - left));
  });

  // discovery 데이터는 ops 전용이다. 리더 UI·prerender가 이걸 import하기 시작하면 배포 번들에
  // 운영 백로그가 실린다.
  //
  // **역할 분담**: 이건 `src/**`의 직접 import만 보는 빠른 로컬 가드다. 진짜 경계 판정 —
  // 진입점(`index.html`, `build:pages`)에서 시작하는 **재귀** 그래프, `src` 밖 bridge 경유,
  // `.js` extension substitution, 출하 산출물 스캔 — 은 `scripts/module-boundary.test.ts`와
  // `scripts/check-dist-boundary.ts`가 맡는다. 여기서는 아직 아무도 import하지 않는 src 파일이
  // discovery를 끌어 쓰는 것도 실수이므로 그 경우까지 일찍 잡는다.
  it("keeps discovery data out of the app runtime", () => {
    const srcDir = path.resolve(__dirname, "..");
    const discoveryModules = new Set(
      ["discovery.ts", "discoveryReport.ts"].map((name) =>
        path.resolve(srcDir, "briefs", name)
      )
    );
    // 면제는 두 가지뿐이다: discovery 모듈 자신(정확한 경로)과 테스트 파일(번들에 들어가지 않는다).
    // 경로 prefix로 스킵하면 `discoveryWidget.tsx` 같은 새 파일이 통째로 검사망을 빠져나간다.
    const isExempt = (filePath: string) =>
      discoveryModules.has(filePath) || /\.test\.tsx?$/.test(path.basename(filePath));

    const resolveSpecifier = (fromFile: string, specifier: string) => {
      if (!specifier.startsWith(".")) {
        return null;
      }

      const base = path.resolve(path.dirname(fromFile), specifier);

      for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
        const candidatePath = `${base}${suffix}`;

        if (discoveryModules.has(candidatePath)) {
          return candidatePath;
        }
      }

      return null;
    };

    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          walk(entryPath);
          continue;
        }

        if (!/\.tsx?$/.test(entry.name) || isExempt(entryPath)) {
          continue;
        }

        const source = readFileSync(entryPath, "utf8");
        // readImportFiles=true, detectJavaScriptImports=true → import / export-from / import() 전부 수집
        const { importedFiles } = ts.preProcessFile(source, true, true);

        for (const reference of importedFiles) {
          if (resolveSpecifier(entryPath, reference.fileName)) {
            offenders.push(`${path.relative(srcDir, entryPath)} → ${reference.fileName}`);
          }
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

  // 이중 경로가 의도다: 별칭 접기는 legacy 집계에만, literal 일치는 신규 데이터 게이트에만 쓴다.
  // 둘을 섞으면 `UK`·`EU`가 신규 데이터에서도 통과해 애초의 드리프트가 계속된다.
  it("separates alias folding (reporting) from literal matching (gating)", () => {
    expect(isCanonicalJurisdiction("United Kingdom")).toBe(true);
    expect(isCanonicalJurisdiction("UK")).toBe(false);
    expect(isCanonicalJurisdiction("EU")).toBe(false);
    expect(isCanonicalJurisdiction("Counterfeit Damages")).toBe(false);

    // 같은 태그가 집계에서는 접히고 게이트에서는 막힌다.
    expect(getCanonicalJurisdictions(["UK"])).toEqual(["United Kingdom"]);
    expect(hasCanonicalJurisdiction(["UK", "IPEC"])).toBe(false);
    expect(hasCanonicalJurisdiction(["United Kingdom", "IPEC"])).toBe(true);
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

  it("flags overdue sources and keeps never-verified ones visible at any cadence", () => {
    const buildSource = (
      id: string,
      sweepCadence: BriefSource["sweepCadence"]
    ): BriefSource => ({
      id,
      label: id,
      url: `https://example.test/${id}`,
      sweepTarget: "fixture",
      tier: "primary",
      jurisdictions: ["Global"],
      relatedProductSlugs: ["china"],
      sweepCadence,
      ...(sweepCadence === "event-driven" ? { reviewTrigger: "fixture" } : {})
    });

    const sources = [
      buildSource("weekly-late", "weekly"),
      buildSource("monthly-ok", "monthly"),
      buildSource("event-never", "event-driven"),
      buildSource("weekly-never", "weekly"),
      buildSource("backfill-only", "weekly")
    ];

    const sweeps: BriefSweep[] = [
      {
        sweptOn: "2026-07-25",
        kind: "verified",
        sourceIds: ["weekly-late", "monthly-ok"],
        foundCandidateIds: []
      },
      {
        sweptOn: "2026-07-20",
        kind: "repository-backfill",
        sourceIds: ["backfill-only"],
        foundCandidateIds: []
      },
      {
        sweptOn: "2026-07-01",
        kind: "verified",
        sourceIds: ["weekly-late"],
        foundCandidateIds: []
      }
    ];

    const rows = summarizeSourceSweep(sources, sweeps, now);
    const byId = Object.fromEntries(rows.map((row) => [row.source.id, row]));

    // 최신 verified 회차가 먼저 잡힌다(로그 최신순 계약).
    expect(byId["weekly-late"]?.lastVerifiedOn).toBe("2026-07-25");
    expect(byId["weekly-late"]?.daysSinceVerified).toBe(9);
    expect(byId["weekly-late"]?.status).toBe("overdue");
    expect(byId["monthly-ok"]?.status).toBe("ok");

    // event-driven이어도 한 번도 실사되지 않았다면 리포트에서 사라지지 않는다.
    expect(byId["event-never"]?.status).toBe("never-verified");
    expect(byId["weekly-never"]?.status).toBe("never-verified");

    // backfill은 계보로 남지만 freshness를 리셋하지 않는다.
    expect(byId["backfill-only"]?.lastBackfilledOn).toBe("2026-07-20");
    expect(byId["backfill-only"]?.lastVerifiedOn).toBeNull();
    expect(byId["backfill-only"]?.status).toBe("never-verified");
  });

  // KIPO는 2026-08-08 공식 발표를 직접 대조했지만 다른 시드 소스는 여전히 backfill뿐이다.
  // 한 소스의 실사가 나머지 소스 freshness까지 갱신한 것처럼 보이면 안 된다.
  it("reports the verified KIPO sweep while keeping untouched sources never-verified", () => {
    const rows = summarizeSourceSweep(undefined, undefined, new Date("2026-08-08T00:00:00.000Z"));
    const kipo = rows.find((row) => row.source.id === "kipo");
    const untouched = rows.filter((row) => row.source.id !== "kipo");

    expect(kipo?.lastVerifiedOn).toBe("2026-08-08");
    expect(kipo?.status).toBe("ok");
    expect(untouched.every((row) => row.status === "never-verified")).toBe(true);
  });
});
