# UKTm Root Sync Input

이 문서는 `UKTm` beta 레인의 reader-utility 정합 작업을 root sync 전에 정리해 두는 handoff 메모다.
UKTm은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급됐으므로, 이 레인은 standard-QA "prep"이 아니라 이미 beta/standard인 상태에서 reader utility를 정합·유지하는 단계를 다룬다.
루트 authoritative metadata는 `src/products/registry.ts`, workspace 계약은 `UKTm/README.md`, `UKTm/Harness/Architecture.md`, `UKTm/Harness/Content-Spec.md`를 기준으로 읽는다.

## Baseline One-Liner

`UKTm`은 루트 `/uk`에 연결된 live incubate country guide이며, 현재 baseline은 `14개 챕터 / 검색 엔트리 128개 / incubate tier · beta lifecycle / standard QA`다(2026-05-12 #53 승급, registry verifiedOn re-stamp 2026-07-04).

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
| Summary | `UKIPO 중심 early-track 실무를 verified 공개본으로 유지하는 incubate country guide` | `src/products/registry.ts` |
| Chapter count | `14` | `src/products/registry.ts`, `UKTm/content/source/manifest.json` |
| Search entry count | `128` | `src/products/registry.ts`, `UKTm/content/generated/search-index.json` |
| Tier / lifecycle / QA | `incubate` / `beta` / `standard` | `src/products/registry.ts` |
| High-risk gap count | `0` | `src/products/registry.ts` |
| Root metadata verifiedOn | `2026-07-04` | `src/products/registry.ts` |
| Workspace gate rerun | `2026-04-21` `npm --prefix UKTm run content:prepare` pass (이 레인 마지막 로컬 재현; root verifiedOn은 이후 shared root gate로 2026-07-04 re-stamp) | local rerun in this lane |
| Current lane focus | reader-utility 정합 around `filing`, `maintenance`, `platform/domain incident` reader utility (beta 유지) | `docs/current-ops-taskboard.md`, `UKTm/README.md` |

## Reader-Utility 정합 Focus

- `출원 전략과 권리 범위 설계`
  - `early-track filing decision board`
  - `7-day filing handoff memo`
- `등록 후 유지관리와 갱신 체계`
  - `beta-lane maintenance owner board`
  - `실사용 증거 vault`
- `플랫폼, 도메인, 온라인 침해 대응`
  - `online incident quick board`
  - `first 48 hours online memo`

lifecycle은 이미 beta(standard QA)다. 이 레인의 목적은 추가 승격이 아니라, 위 utility가 `home`, `continue reading`, `search`, `reader smoke`에서 더 안정적으로 다시 읽히는지 확인하는 것이다.

명칭 정합 (2026-06-03 완료, A안): 소스 챕터 헤딩(`07_maintenance-renewal.md`), home copy(`src/products/uk.tsx`), e2e reader smoke bookmark(`e2e/readerSmoke.ts`)를 모두 `beta-lane maintenance owner board`로 통일했다. `npm run content:uk` 재생성(0 error, 14 chapters / 128 search)으로 generated·search slug(`beta-lane-maintenance-owner-board`)까지 맞췄고, `npm run e2e:smoke`의 UKTm reader smoke 통과로 bookmark·continue-reading 흐름을 검증했다.

## Research Hygiene Packet

- `uk_tm_accuracy_completeness_review.md` 기준 현재 공개 가능 상태는 유지된다.
- `uk_tm_fact_verification_log.md` 기준 opposition, cooling-off, 10년 갱신, non-use revocation, HMRC AFA, comparable UK mark, Nominet DRS, IPEC 구분 등 핵심 사실은 `2026-04-03` 검수 기준으로 충돌 없음 상태다.
- `beta / standard QA / verified 공개본 / early track` 포지션을 유지하고(2026-05-12 #53 승급 반영), 남은 작업은 reader utility 정합과 검증 증빙을 잠그는 단계로 본다.
- fee, deadline, system naming은 공개 직전 재확인 원칙을 유지한다.

## Local Gate Evidence

- `2026-04-21` `npm --prefix UKTm run content:prepare`
  - `Generated UKTm master manuscript from 14 sources.`
  - `QA complete: 0 error(s), 0 warning(s), 14 source file(s) checked.`
  - `Generated 14 chapters and 128 search entries.`
- `2026-06-14` reader-utility health pack 재확인 (incubate health pack 레인, Node 22)
  - `npm run content:uk` 재현: `Generated UKTm master manuscript from 14 sources.` · `QA complete: 0 error(s), 0 warning(s)` · `Generated 14 chapters and 128 search entries.` (registry 정본 14/128 일치)
  - 검색 인덱스 확인: `early-track filing decision board`, `beta-lane maintenance owner board`, `online incident quick board` 3개 utility 모두 `UKTm/content/generated/search-index.json`에 존재 → search로 도달 가능
  - `npm run e2e:smoke` 28/28 통과 — UKTm reader smoke(home heading + Continue Reading `이어 읽기` + 검색 `online incident quick board` 도달) · UKTm zero-result empty state · UKTm mobile action bar/chapter-nav 비overlap 흐름 정상

## Root Sync Diff List

| Root file | Sync note for integrator |
| --- | --- |
| `PROJECT-OVERVIEW.md` | 이미 2026-05-12 beta 승급(`lifecycle pilot→beta`, `qaLevel smoke→standard`)을 반영하고 있어 정합하다. 추가 metadata change는 없고, 남은 것은 reader-utility 정합이다. |
| `README.md` | `content:uk`를 root full-pipeline group으로 두는 설명은 현재 상태와 맞다. local `content:prepare` deeper QA 기준도 이미 맞다. |
| `src/products/registry.ts` | `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `summary`, `maturityNote`가 현 beta baseline의 정본이다. immediate metadata change는 필요 없다. |
| `src/products/uk.tsx` | home summary와 positioning note는 `filing decision board`, `beta-lane maintenance owner board`, `online incident quick board` utility를 더 직접 읽히게 다듬을 수 있다. 명칭 drift는 2026-06-03 해소(소스 헤딩·home copy·e2e bookmark 모두 `beta-lane`으로 통일, content:uk 재생성 + e2e smoke 통과). |
| `docs/phase1-runtime-qa.md` | incubate pack addendum의 UKTm utility 설명을 reader-utility 정합 focus에 맞춰 더 구체적으로 잠글 수 있다. |
| `docs/buyer-narrative.md` | UKTm 줄을 `beta · standard · early-track verified`로 갱신했다(2026-06-03 정합). 추가 drift 없음. |

## Non-Scope Reminder

- lifecycle은 이미 beta다(2026-05-12 #53). 이 lane에서 추가 lifecycle 승격(beta→mature)은 하지 않는다.
- generated JSON, `public/generated/*`, `dist/*`는 수동 수정하지 않는다.
- `beta / standard QA / early-track verified` 포지션과 충돌하는 growth/mature·full-depth 마케팅 문구는 넣지 않는다(`portfolioTier`는 incubate 유지).
- reader-utility 정합은 증빙과 utility 정렬이 목적이지, 신규 대확장이나 새 파이프라인 도입이 아니다.
