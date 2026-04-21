# UKTm Root Sync Input

이 문서는 `UKTm standard-QA prep` 레인을 root sync 전에 정리해 두는 handoff 메모다.
루트 authoritative metadata는 `src/products/registry.ts`, workspace 계약은 `UKTm/README.md`, `UKTm/Harness/Architecture.md`, `UKTm/Harness/Content-Spec.md`를 기준으로 읽는다.

## Baseline One-Liner

`UKTm`은 루트 `/uk`에 연결된 live incubate country guide이며, 현재 baseline은 `14개 챕터 / 검색 엔트리 128개 / incubate tier · pilot lifecycle / smoke QA`다.

## Authority Order

1. `Harness/Constitution.md`
2. `PROJECT-OVERVIEW.md`
3. `docs/current-ops-taskboard.md`
4. `README.md`
5. `src/products/registry.ts`
6. `UKTm/README.md`
7. `UKTm/Harness/Architecture.md`
8. `UKTm/Harness/Content-Spec.md`
9. `docs/workspaces/UKTm/uktm-content-expansion-plan.md`
10. `docs/workspaces/UKTm/uktm-content-expansion-taskboard.md`
11. `UKTm/content/research/uk_tm_accuracy_completeness_review.md`
12. `UKTm/content/research/uk_tm_fact_verification_log.md`
13. `UKTm/content/research/uk_tm_source_register.md`

## Authoritative Metadata Snapshot

| Field | Value | Source |
| --- | --- | --- |
| Product | `UKTm` / `/uk` / `coverageType: country` / `availability: live_shell` | `src/products/registry.ts` |
| Summary | `UKIPO 중심 early-track 실무를 draft 공개본으로 유지하는 incubate country guide` | `src/products/registry.ts` |
| Chapter count | `14` | `src/products/registry.ts`, `UKTm/content/source/manifest.json` |
| Search entry count | `128` | `src/products/registry.ts`, `UKTm/content/generated/search-index.json` |
| Tier / lifecycle / QA | `incubate` / `pilot` / `smoke` | `src/products/registry.ts` |
| High-risk gap count | `0` | `src/products/registry.ts` |
| Root metadata verifiedOn | `2026-04-21` | `src/products/registry.ts` |
| Workspace gate rerun | `2026-04-21` `npm --prefix UKTm run content:prepare` pass | local rerun in this lane |
| Current prep target | standard-QA prep around `filing`, `maintenance`, `platform/domain incident` reader utility | `docs/current-ops-taskboard.md`, `UKTm/README.md` |

## Standard-QA Prep Focus

- `출원 전략과 권리 범위 설계`
  - `early-track filing decision board`
  - `7-day filing handoff memo`
- `등록 후 유지관리와 갱신 체계`
  - `pilot-lane maintenance owner board`
  - `실사용 증거 vault`
- `플랫폼, 도메인, 온라인 침해 대응`
  - `online incident quick board`
  - `first 48 hours online memo`

현재 레인은 beta 승격이 아니라, 위 utility가 `home`, `continue reading`, `search`, `reader smoke`에서 더 안정적으로 다시 읽히는지 확인하는 것이 목적이다.

## Research Hygiene Packet

- `uk_tm_accuracy_completeness_review.md` 기준 현재 공개 가능 상태는 유지된다.
- `uk_tm_fact_verification_log.md` 기준 opposition, cooling-off, 10년 갱신, non-use revocation, HMRC AFA, comparable UK mark, Nominet DRS, IPEC 구분 등 핵심 사실은 `2026-04-03` 검수 기준으로 충돌 없음 상태다.
- `pilot / smoke QA / draft 공개본 / early track` 포지션은 유지하고, standard-QA prep은 reader utility와 검증 증빙을 먼저 잠그는 단계로 본다.
- fee, deadline, system naming은 공개 직전 재확인 원칙을 유지한다.

## Local Gate Evidence

- `2026-04-21` `npm --prefix UKTm run content:prepare`
  - `Generated UKTm master manuscript from 14 sources.`
  - `QA complete: 0 error(s), 0 warning(s), 14 source file(s) checked.`
  - `Generated 14 chapters and 128 search entries.`

## Root Sync Diff List

| Root file | Sync note for integrator |
| --- | --- |
| `PROJECT-OVERVIEW.md` | current priority order와 `UKTm density 9+ 달성 후에도 pilot 유지` 문구는 그대로 맞다. 지금은 status 상향보다 standard-QA prep 착수 메모가 더 중요하다. |
| `README.md` | `content:uk`를 root full-pipeline group으로 두는 설명은 현재 상태와 맞다. local `content:prepare` deeper QA 기준도 이미 맞다. |
| `src/products/registry.ts` | `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `summary`, `maturityNote`가 현 baseline과 일치한다. immediate metadata change는 필요 없다. |
| `src/products/uk.tsx` | home summary와 positioning note는 `filing decision board`, `maintenance owner board`, `online incident quick board` utility를 더 직접 읽히게 다듬을 수 있다. |
| `docs/phase1-runtime-qa.md` | incubate pack addendum의 UKTm utility 설명을 standard-QA prep focus에 맞춰 더 구체적으로 잠글 수 있다. |
| `docs/buyer-narrative.md` | `UKTm`은 여전히 `pilot / draft 공개본` 가이드로 두되, 다음 액션이 fact verification만이 아니라 standard-QA prep이라는 점을 메모 수준으로만 추가할 수 있다. |

## Non-Scope Reminder

- 이 lane에서는 root lifecycle 승격을 하지 않는다.
- generated JSON, `public/generated/*`, `dist/*`는 수동 수정하지 않는다.
- `pilot / smoke QA / draft 공개본 / early track` 포지션과 충돌하는 beta/full-depth 마케팅 문구는 넣지 않는다.
- `standard-QA prep`은 증빙과 utility 정렬이 목적이지, 신규 대확장이나 새 파이프라인 도입이 아니다.
