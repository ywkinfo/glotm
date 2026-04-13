# GloTm factual QA rollout plan

## Purpose

This document captures the reviewed rollout plan for expanding factual QA in `GloTm` without changing the current root health contract, scorecard source of truth, or workspace execution model.

The plan is intentionally narrow. Factual QA enters first as helper audits under `health:content`, starts with structured claim maps in the highest-value workspaces, and stays advisory until the repo has enough stable evidence to connect any of it to lifecycle review.

## Repo facts this plan assumes

- The root verification contract stays at 3 execution lanes: `health:runtime`, `health:content`, `health:release`.
- `health:report` remains the reporting surface that summarizes lane state and advisory research status.
- Lifecycle truth stays in `src/products/registry.ts` and `src/products/scorecard.ts`.
- Health report shape stays in `src/products/health.ts` and `scripts/health-report.ts`.
- No new npm dependency should be required for v1. Use Node, `tsx`, and the existing test stack.
- The current root content lane already mixes full-pipeline and shortcut refresh behavior by workspace.
- `ChaTm`, `MexTm`, and `EuTm` currently align best with full-pipeline content verification at the root.
- `UsaTm` and `JapTm` currently remain root shortcut-refresh exceptions.
- Workspace content facts already live in workspace-local `content/research/` directories, mostly as markdown fact verification logs and, in some workspaces, source registers.

## Goals

1. Add factual QA in a way that strengthens `health:content` without introducing a fourth top-level lane.
2. Create one boring, repeatable structured artifact for claim-level coverage: `claim-map.json`.
3. Start with `ChaTm` and `MexTm`, where the repo already has strong full-pipeline patterns and mature growth-lane pressure.
4. Let migrated products expose an advisory `research` block in the health report before any scorecard coupling.
5. Preserve current lifecycle review inputs while building a safer path from legacy registry metadata toward future claim-backed metrics.

## Non-goals

- No new top-level root health lane.
- No immediate scorecard rewrite.
- No claim that research JSON becomes the scorecard source of truth in v1.
- No forced uniformity across all workspaces on day one.
- No repo-wide requirement that every workspace must adopt `source-registry.json` in the first pass.
- No change to product lifecycle verdict rules in `src/products/scorecard.ts` during the initial rollout.

## Current constraints

### 1. Health contract constraint

`src/products/health.ts` defines the root contract as `runtime | content | release`. The rollout must fit inside `health:content`, because that lane already owns generated-content verification and workspace content reproducibility.

### 2. Lifecycle truth constraint

`src/products/registry.ts` remains the stored lifecycle and portfolio metadata source. `src/products/scorecard.ts` remains the place where thresholds and lifecycle recommendations are computed. Factual QA can inform later edits to those fields, but it does not replace them in v1.

### 3. Report contract constraint

`src/products/health.ts` defines the report object shape, and `scripts/health-report.ts` renders that shape. Any early factual QA reporting must fit as additive, advisory metadata. It must not change existing verdict semantics of `hold`, `upgrade-ready`, or `verification-refresh-needed`.

### 4. Workspace heterogeneity constraint

The repo is not fully uniform:

- `ChaTm`, `MexTm`, `EuTm`, `UKTm`, and `LatTm` currently participate in root full-pipeline content refresh.
- `UsaTm` and `JapTm` remain root shortcut-refresh workspaces.
- Some workspaces already have source register files, others do not.
- Fact verification logs exist today, but structured claim coverage does not yet appear to be standardized.

The rollout has to respect that uneven state instead of pretending every workspace can move together.

## Proposed v1 model

### Entry point

Factual QA enters as helper audits inside `health:content`.

That means:

- `health:runtime` stays focused on runtime safety and shell behavior.
- `health:release` stays focused on build and Pages release readiness.
- `health:content` keeps ownership of content-backed evidence checks, including any new factual QA helpers.

Initial helper audits:

- `audit:facts`
- `audit:staleness`
- `audit:consistency`
- `audit:sources`, adopted workspaces only

These run under the existing content lane. They do not create a fourth root lane.

### First structured artifact

The first structured artifact is `claim-map.json`, introduced per workspace under `content/research/`.

Initial rollout targets:

- `ChaTm/content/research/claim-map.json`
- `MexTm/content/research/claim-map.json`
- `EuTm/content/research/claim-map.json`

Early follow-ons:

- `UKTm/content/research/claim-map.json`
- `UsaTm/content/research/claim-map.json`
- `JapTm/content/research/claim-map.json`
- `LatTm/content/research/claim-map.json`

### Optional companion artifact

`source-registry.json` is optional in v1 and introduced only where it clearly reduces repeated manual lookup work.

This is phased because the repo already has mixed source-register patterns:

- `EuTm`, `UKTm`, `UsaTm`, and `JapTm` already expose source register style research files.
- `ChaTm`, `MexTm`, and `LatTm` do not need to block on source-registry normalization before claim mapping starts.

### Health report exposure

Migrated products may expose an advisory `research` block in the health report before any scorecard coupling.

That block is informational only in v1. It can surface facts like:

- whether a `claim-map.json` exists
- how many claims are in scope
- how many claims are verified
- whether required fields are present
- whether unresolved conflicts exist

It must not directly change product verdicts or lifecycle targets in the first rollout.

## v1 data contracts

### `claim-map.json`

Purpose: provide a machine-checkable list of publication-relevant factual claims and their evidence state for one workspace.

Recommended location:

- `<workspace>/content/research/claim-map.json`

Minimum top-level shape:

```json
{
  "workspace": "ChaTm",
  "productSlug": "china",
  "version": 1,
  "auditMode": "advisory",
  "claims": []
}
```

Minimum per-claim fields:

```json
{
  "id": "CN-FIL-001",
  "jurisdiction": "CN",
  "claim": "중국 출원에서는 类似商品和服务区分表 기준과 수리가능 명칭 원칙을 함께 봐야 한다",
  "chapterRefs": ["Ch3", "Ch5"],
  "riskLevel": "HIGH",
  "sourceIds": ["cnipa-guide-2025-classes"],
  "lastVerified": "2026-04-07",
  "status": "BODY_READY",
  "conceptKey": "filing_route",
  "normalized": {
    "trigger": "direct_filing",
    "value": "goods-services naming must follow CNIPA accepted naming rules",
    "unit": null,
    "expression": "accepted_naming_rule"
  },
  "notes": "Derived from markdown fact log during migration"
}
```

Allowed canonical statuses:

- `VERIFIED`
- `BODY_READY`
- `PENDING`
- `NEEDS_UPDATE`
- `CONFLICT`
- `CONDITIONAL`
- `DEPRECATED`

Rules:

- `id` must be stable inside one workspace.
- `claim` should describe a publishable fact, not a broad editorial theme.
- `chapterRefs` should align to the workspace's existing chapter naming convention.
- `riskLevel` should start with a small vocabulary: `HIGH | MEDIUM | LOW`.
- `sourceIds` may point to markdown-backed sources during migration.
- `conceptKey` and `normalized` are optional per claim, but required for consistency-audit coverage once that concept is opted in.
- A claim can be present in the map before the workspace has a normalized source registry.

### Optional `source-registry.json`

Purpose: normalize repeated source references only after a workspace has enough verified claims to justify it.

Recommended location:

- `<workspace>/content/research/source-registry.json`

This file is optional in v1. No workspace should fail migration simply because it still relies on markdown source registers or inline evidence references.

Recommended per-source fields once introduced:

```json
{
  "id": "cnipa-guide-2025-classes",
  "type": "official-guidance",
  "url": "https://sbj.cnipa.gov.cn/...",
  "jurisdiction": "CN",
  "lastChecked": "2026-04-07",
  "validity": "active",
  "authorityLevel": "official"
}
```

### Advisory `research` block in health report

Purpose: expose structured factual QA coverage without changing lifecycle logic.

Illustrative shape:

```json
{
  "research": {
    "mode": "advisory",
    "claimMap": "present",
    "auditMode": "advisory",
    "factIntegrityScore": 92,
    "officialSourceCoverage": 88,
    "consistencyScore": 100,
    "criticalClaimFreshnessDays": 21,
    "staleHighRiskClaimCount": 0,
    "effectiveHighRiskGapCount": 1,
    "gate": "warn"
  }
}
```

Rules:

- The block is omitted for unmigrated products.
- The block is advisory only in v1.
- Existing health report consumers must still work if the block is absent.
- `effectiveHighRiskGapCount` is report-only in v1 and should be computed as `max(registry highRiskVerificationGapCount, derived unresolved claim gap)` for migrated workspaces.

## Gate model

### `audit:facts`

Fail conditions for adopted workspaces:

1. `claim-map.json` exists but is not valid JSON.
2. Required top-level fields are missing.
3. A claim entry is missing required keys such as `id`, `claim`, `status`, or `lastVerified`.
4. Duplicate `id` values exist in the same workspace.
5. A claim uses an unknown status value.
6. A `HIGH` risk claim has no `sourceIds`.
7. A claim promoted to publication scope remains `PENDING`, `NEEDS_UPDATE`, or `CONFLICT`.
8. The audit helper cannot read the referenced claim-map file for a workspace explicitly marked as migrated.

Warn conditions:

1. A `MEDIUM` or `LOW` risk claim is stale.
2. A `CONDITIONAL` claim lacks an explanatory note.
3. `chapterRefs` is empty.

Hard fail should fail the helper audit and therefore fail `health:content` for that migrated workspace set.

### `audit:consistency`

Initial scope:

- `opposition_period`
- `renewal_term`
- `use_requirement`
- `filing_route`

Fail conditions for concepts explicitly opted into normalization:

1. Two claims in the same jurisdiction and `conceptKey` disagree on normalized `trigger`, `value`, or `unit`.
2. A claim is marked as governing a concept but its normalized tuple is malformed.

Warn conditions:

1. A claim has a `conceptKey` but no normalized tuple yet.
2. A concept exists in markdown evidence but has not been mapped into claim coverage yet.

### `audit:staleness`

This audit is heuristic in v1. It does not crawl laws or require live network checks.

Fail conditions:

1. A `HIGH` risk claim is past the freshness window for its product lifecycle and lacks sufficient official source coverage.
2. A high-volatility concept exceeds freshness and still depends primarily on non-official evidence.

Warn conditions:

1. A claim exceeds freshness but still has official source backing.
2. A workspace has a growing count of stale `HIGH` risk claims but remains below the fail threshold.

### `audit:sources`

This is adopted only where a workspace has a real source registry or an equivalent normalized source model.

Fail conditions:

1. A `HIGH` risk claim points only to non-official sources.
2. A `sourceId` in a migrated workspace cannot be resolved.

Warn conditions:

1. A workspace has no `source-registry.json` yet.
2. Live URL availability has not been checked.

Live URL verification, if added later, must run behind `--live` and remain outside the default CI hard gate.

### Transition rule

Before a workspace is marked migrated, factual QA output is informational and local. Once a workspace is marked migrated, schema validity becomes hard-gated under `health:content`, but coverage depth remains warn-only until the repo proves the metrics are stable enough to enforce.

## Transition from legacy metadata to future claim-backed metrics

The repo already stores lifecycle-relevant truth in `src/products/registry.ts`, with evaluation rules in `src/products/scorecard.ts`. That remains intact.

The transition path is:

1. Keep `verifiedOn`, `qaLevel`, `highRiskVerificationGapCount`, chapter count, and search-entry count as the only scorecard inputs.
2. Add claim maps as parallel evidence, not replacement evidence.
3. Show advisory `research` data in health reporting for migrated workspaces.
4. Use monthly review to decide whether claim-backed evidence justifies manual registry updates.
5. Keep `effectiveHighRiskGapCount` report-only before any scorecard coupling.
6. Only after repeated stable use should the repo discuss scorecard coupling, and that should be a separate decision.

In short, legacy registry metadata remains the shipped lifecycle input, future claim-backed metrics remain advisory until proven.

## Rollout order and rationale

### 1. `ChaTm`

Why first:

- already mature, growth-tier, and full-pipeline at the root
- already has a dedicated fact verification log
- already carries the strongest need for repeatable claim-level evidence in high-value content

### 2. `MexTm`

Why second:

- same growth-lane pressure as `ChaTm`
- strong buyer-entry value, strong full-pipeline pattern, strong existing fact-log habit
- good second template for country-specific rollout without the China-only specifics

### 3. `EuTm`

Why third:

- validate lane, already centered on verification and docs sync
- already has both fact-log and source-register style files
- good test case for regional scope and controlled evidence boundaries

### 4. `UKTm`, `UsaTm`, `JapTm`

Why fourth:

- these are incubate or lighter-track products
- `UsaTm` and `JapTm` still rely on root shortcut refresh, so hard coupling would be premature
- `UKTm` participates in full-pipeline refresh, but its portfolio role is still early-track and should not drag the broader rollout into edge-case cleanup too early

This phase should focus on schema adoption and advisory reporting, not aggressive gate tightening.

### 5. `LatTm`

Why last:

- `LatTm` is the flagship baseline and should absorb this only after the claim-map pattern is boring
- it has the broadest scope, so mistakes here would create the largest review burden
- the right move is to protect flagship stability, not turn it into the first experiment

Rollout order: `ChaTm -> MexTm -> EuTm -> UKTm/UsaTm/JapTm -> LatTm`.

## Phased rollout

### Phase 0, doc-only alignment

Scope:

- land this plan document
- keep code and contracts unchanged
- align on file locations, advisory semantics, and fail versus warn rules

Exit criteria:

- plan committed
- no disagreement about root-lane ownership
- no disagreement about v1 being advisory-first

### Phase 1, `ChaTm` pilot

Scope:

- add `ChaTm/content/research/claim-map.json`
- define minimum schema validation inside content-side helper audit
- enable `audit:facts`, `audit:staleness`, and `audit:consistency`
- surface advisory `research` block for `china` in health report output

Hard gate in this phase:

- schema validity for migrated `ChaTm`
- HIGH risk claim integrity

Warn-only in this phase:

- claim coverage depth
- pending claims
- source registry absence

Exit criteria:

- `ChaTm` can run through `health:content` with factual QA helper audit enabled
- report can show advisory research data for `china` without changing lifecycle verdict logic

### Phase 2, `MexTm` follow-on

Scope:

- add `MexTm/content/research/claim-map.json`
- reuse the exact `ChaTm` helper audit contract
- confirm the model works for a second mature growth workspace

Exit criteria:

- `ChaTm` and `MexTm` share one schema contract
- no new root lane introduced
- no scorecard logic touched

### Phase 3, `EuTm` validate-lane adoption

Scope:

- add `EuTm/content/research/claim-map.json`
- allow optional `EuTm/content/research/source-registry.json` only if it reduces duplication over the existing source-register files
- test regional-scope claims and controlled-scope boundaries

Hard gate in this phase:

- `audit:facts`
- `audit:staleness`

Warn-only in this phase:

- `audit:sources`, until the source model stops being source-group-level
- deep consistency coverage beyond the first four concept keys

Exit criteria:

- factual QA works for both country and regional guides
- source-registry support remains optional, not mandatory

Current shipped state:

- `EuTm/content/research/claim-map.json` is adopted.
- `scripts/health-report.ts` already exposes advisory `research` coverage for `europe`.
- the current EuTm follow-up stayed narrow: Ch5 priority window, Ch11 marketplace reporting-channel memo, Ch12 UK customs AFA split.

### Phase 4, lighter-track adoption

Scope:

- add claim maps for `UKTm`, `UsaTm`, and `JapTm`
- keep report exposure advisory
- avoid pushing shortcut-refresh workspaces into stricter coupling than they can support

Exit criteria:

- all three lighter-track workspaces can emit advisory research status
- no false claim that all workspaces now share identical evidence maturity

### Phase 5, flagship adoption

Scope:

- add `LatTm/content/research/claim-map.json`
- keep this as a stability pass, not a contract-expansion pass

Exit criteria:

- flagship baseline gains structured factual QA coverage without changing the root health-lane model

## File touch list

### This planning PR

- `docs/factual-qa-rollout.md`

### Expected future implementation touches

Root health and report surface:

- `src/products/health.ts`, additive advisory `research` block only
- `scripts/health-report.ts`, additive rendering of advisory research status only

Workspace artifacts:

- `ChaTm/content/research/claim-map.json`
- `MexTm/content/research/claim-map.json`
- `EuTm/content/research/claim-map.json`
- `UKTm/content/research/claim-map.json`
- `UsaTm/content/research/claim-map.json`
- `JapTm/content/research/claim-map.json`
- `LatTm/content/research/claim-map.json`

Optional phased files only where justified:

- `EuTm/content/research/source-registry.json`
- `UKTm/content/research/source-registry.json`
- `UsaTm/content/research/source-registry.json`
- `JapTm/content/research/source-registry.json`

Existing legacy evidence inputs that remain valid during transition:

- `ChaTm/content/research/cn_tm_fact_verification_log.md`
- `MexTm/content/research/mx_tm_fact_verification_log.md`
- `EuTm/content/research/eu_tm_fact_verification_log.md`
- `EuTm/content/research/eu_tm_source_register.md`
- `UKTm/content/research/uk_tm_fact_verification_log.md`
- `UKTm/content/research/uk_tm_source_register.md`
- `UsaTm/content/research/us_tm_fact_verification_log.md`
- `UsaTm/content/research/us_tm_source_register.md`
- `JapTm/content/research/jp_tm_fact_verification_log.md`
- `JapTm/content/research/jp_tm_source_register.md`
- `LatTm/content/research/fact-verification-log.md`

## PR breakdown

### PR 1, plan only

Goal: land this document and freeze the rollout shape.

### PR 2, `ChaTm` pilot wiring

Goal: add first `claim-map.json`, helper audit, and advisory report block for one migrated workspace.

### PR 3, `MexTm` reuse pass

Goal: prove the contract generalizes across a second mature growth workspace.

### PR 4, `EuTm` regional-scope pass

Goal: validate the model for a region guide and optional source-registry support.

### PR 5, lighter-track batch

Goal: add advisory claim maps to `UKTm`, `UsaTm`, and `JapTm` without tightening lifecycle coupling.

### PR 6, `LatTm` stabilization pass

Goal: extend the same boring pattern to the flagship after the model is proven.

## Acceptance criteria

The rollout is working as intended when all of the following are true:

1. The repo still has exactly three root execution lanes: `health:runtime`, `health:content`, `health:release`, and `health:report` remains a reporting surface rather than a fourth execution lane.
2. Factual QA runs only as helper audits under `health:content`.
3. `src/products/registry.ts` and `src/products/scorecard.ts` remain the lifecycle source of truth in v1.
4. `src/products/health.ts` and `scripts/health-report.ts` remain the report-shape source of truth, with only additive advisory research exposure.
5. `claim-map.json` is the first required structured factual QA artifact for adopted workspaces, and `ChaTm`, `MexTm`, `EuTm` have already crossed that line.
6. `source-registry.json` remains optional and phased.
7. Migrated products can show advisory `research` data in the health report before any scorecard coupling.
8. `audit:facts`, `audit:staleness`, and `audit:consistency` all live under `health:content`.
9. Hard-fail behavior is limited to schema integrity, adopted claim-map readability, and high-risk factual integrity for migrated workspaces.
10. Coverage depth and source-registry adoption remain warn-only until the repo has enough stable usage to revisit enforcement.
11. The rollout order stays `ChaTm -> MexTm -> EuTm -> UKTm/UsaTm/JapTm -> LatTm`.

## Decision summary

This rollout should feel boring. Keep the root contract stable, add structured claim maps where the repo already has strong content verification habits, expose research status as advisory first, and let lifecycle metadata stay manual until claim-backed evidence has earned the right to matter.
