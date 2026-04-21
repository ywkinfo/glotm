# JapTm Root Sync Input

이 문서는 `JapTm` lighter-track 유지 레인을 root sync 전에 정리해 두는 handoff 메모다.
루트 authoritative metadata는 `src/products/registry.ts`, workspace 계약은 `JapTm/README.md`, `JapTm/Harness/Architecture.md`, `JapTm/Harness/Content-Spec.md`를 기준으로 읽는다.

## Baseline One-Liner

`JapTm`은 루트 `/japan`에 연결된 live incubate country guide이며, 현재 baseline은 `15개 챕터 / 검색 엔트리 145개 / incubate tier · beta lifecycle / standard QA`다.

## Authority Order

1. `Harness/Constitution.md`
2. `PROJECT-OVERVIEW.md`
3. `docs/current-ops-taskboard.md`
4. `README.md`
5. `src/products/registry.ts`
6. `JapTm/README.md`
7. `JapTm/Harness/Architecture.md`
8. `JapTm/Harness/Content-Spec.md`
9. `JapTm/content/research/jp_tm_accuracy_completeness_review.md`
10. `JapTm/content/research/jp_tm_fact_verification_log.md`
11. `JapTm/content/research/jp_tm_source_register.md`

## Authoritative Metadata Snapshot

| Field | Value | Source |
| --- | --- | --- |
| Product | `JapTm` / `/japan` / `coverageType: country` / `availability: live_shell` | `src/products/registry.ts` |
| Summary | `JPO route, maintenance, evidence utility`를 lighter track으로 유지하는 incubate country guide | `src/products/registry.ts` |
| Chapter count | `15` | `src/products/registry.ts`, `JapTm/content/source/manifest.json` |
| Search entry count | `145` | `src/products/registry.ts`, `JapTm/content/generated/search-index.json` |
| Tier / lifecycle / QA | `incubate` / `beta` / `standard` | `src/products/registry.ts` |
| High-risk gap count | `0` | `src/products/registry.ts` |
| Root metadata verifiedOn | `2026-04-21` | `src/products/registry.ts` |
| Workspace gate rerun | `2026-04-21` `npm --prefix JapTm run content:prepare` pass | local rerun in this lane |
| Lighter-track intent | `route`, `maintenance`, `evidence hygiene` reader utility 유지 | `JapTm/README.md`, `JapTm/Harness/Architecture.md` |

## Lighter-Track Focus

- `제4장 출원 경로 선택`: direct vs Madrid route memo를 빨리 찾게 하는 utility 유지
- `제7장 등록 후 유지관리`: renewal, owner map, maintenance handoff utility 유지
- `제10장 세관·국경 조치`: border-control utility 유지
- `제12장 포트폴리오 관리·모니터링·내부통제`: monitoring / RACI utility 유지
- `부록`: 체크리스트, 타임라인, FAQ utility 유지

현재 레인은 대형 본문 확장보다 `continue reading`, `search`, `home positioning`이 위 흐름을 더 빨리 찾게 하는지 확인하는 쪽이 우선이다.

## Research Hygiene Packet

- `jp_tm_accuracy_completeness_review.md` 기준 현재 공개 가능 상태는 유지된다.
- `jp_tm_fact_verification_log.md` 기준 선출원주의, 10년 존속, 2개월 opposition, 비거주자 절차, accelerated examination 가능성, 세관 차단 구조 등 핵심 사실은 `2026-03-31` 재확인 상태다.
- fee, 세부 기한, 시스템 명칭은 본문 확장보다 공개 직전 재확인 원칙을 유지한다.
- lighter-track 유지 구간에서는 숫자를 더 늘리는 것보다 route / maintenance / evidence hygiene 흐름이 깨지지 않는지가 더 중요하다.

## Local Gate Evidence

- `2026-04-21` `npm --prefix JapTm run content:prepare`
  - `Generated JapTm master manuscript from 15 sources.`
  - `JapTm QA complete: 0 error(s), 0 warning(s), 15 source file(s) checked.`
  - `Generated 15 chapters and 145 search entries.`

## Root Sync Diff List

| Root file | Sync note for integrator |
| --- | --- |
| `PROJECT-OVERVIEW.md` | current priority order와 `JapTm beta 유지` 문구는 현재 상태와 충돌하지 않는다. 지금은 wording refresh보다 `JapTm` lane 착수 메모 정도만 필요하다. |
| `README.md` | `content:japan`을 shortcut refresh group으로 두는 설명은 현재 상태와 맞다. deeper content QA는 workspace local `content:prepare` 기준이라는 점도 이미 맞다. |
| `src/products/registry.ts` | `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `summary`, `maturityNote`가 현 baseline과 일치한다. immediate root metadata change는 필요 없다. |
| `src/products/japan.tsx` | home summary와 positioning note는 `route / maintenance / evidence hygiene` lighter-track 설명과 이미 일치한다. 실제 root copy 변경은 optional이다. |
| `docs/buyer-narrative.md` | `JapTm`을 incubate beta, route/maintenance/evidence utility 유지 가이드로 설명하는 현재 문구를 유지하면 된다. |

## Non-Scope Reminder

- 이 lane에서는 root 파일을 직접 수정하지 않는다.
- generated JSON, `public/generated/*`, `dist/*`는 수동 수정하지 않는다.
- beta 승격이나 신규 대확장, 신규 claim 승격은 현재 범위가 아니다.
- `JapTm` lane은 lighter-track utility 유지가 목적이므로, route / maintenance / evidence hygiene와 무관한 대형 구조 변경은 피한다.
