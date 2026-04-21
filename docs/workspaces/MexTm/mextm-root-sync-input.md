# MexTm Root Sync Input

이 문서는 `MexTm Sprint 2 후속 통합`용 root-sync handoff 메모다.
루트 파일은 여기서 수정하지 않고, `MexTm` lane에서 확인한 authoritative snapshot과 wording 후보만 넘긴다.

## Authoritative Metadata Snapshot

| 항목 | 현재 값 | authority |
| --- | --- | --- |
| workspace / route | `MexTm` / `/mexico` | `src/products/registry.ts` |
| baseline structure | `15개 챕터 유지` | `MexTm/content/source/manifest.json` |
| Sprint 2 locked chapters | `Ch5`, `Ch7`, `Ch10` | `docs/workspaces/MexTm/mextm-content-expansion-taskboard.md` |
| search entry count | `385` | `src/products/registry.ts` |
| portfolio tier / lifecycle | `growth` / `mature` | `src/products/registry.ts` |
| qa level / high-risk gap | `full` / `0` | `src/products/registry.ts` |
| root verified date | `2026-04-21` | `src/products/registry.ts`, `PROJECT-OVERVIEW.md` |
| claim-map lock | `MX-FEE-001`, `MX-DL-001`, `MX-NORM-001`, `MX-ENF-001` 모두 `BODY_READY` | `MexTm/content/research/claim-map.json` |
| claim verification date | `2026-04-01` | `MexTm/content/research/claim-map.json`, `mx_tm_fact_verification_log.md` |
| lane-local gate | `npm --prefix MexTm run content:prepare` | `MexTm/README.md`, `mextm-content-expansion-taskboard.md` |
| shared root gate owner | root integration lane only | `docs/current-ops-taskboard.md`, `MexTm/README.md` |

## Ch5 / Ch7 / Ch10 -> Claim -> Root Wording

| chapter | claim id | root wording candidate |
| --- | --- | --- |
| `Ch5` | `MX-NORM-001` | MexTm filing handoff는 `Tu cuenta PASE` / `Marca en Línea` / `ClasNiza` / `MARCia` / `MARCANET` / `SIGA/Gaceta` 용어를 filing packet 기준으로 고정한 상태다. |
| `Ch5` | `MX-FEE-001` | MexTm은 출원(`IMPI88`)과 declaration / renewal 비용 owner를 filing 단계에서 분리해 적는 운영 가이드로 유지한다. |
| `Ch7` | `MX-DL-001` | MexTm 유지관리 wording은 `2018-08-10` 이후 등록분의 `3년+3개월 declaration of use`와 `10년 renewal`을 한 캘린더로 설명하되, declaration / renewal owner는 분리한다. |
| `Ch7` | `MX-FEE-001` | MexTm rights-maintenance copy는 declaration과 renewal을 같은 일정표에 넣더라도 비용 승인선과 제출 owner를 합치지 않는다. |
| `Ch10` | `MX-ENF-001` | MexTm border-control copy는 IMPI `declaraciones administrativas` / `medidas provisionales`와 ANAM `pedimento/annex` 흐름을 one-pack evidence board로 묶는 방향이 맞다. |

## Lane-Local Gate Memo

- 이번 lane의 source-of-truth는 `manifest.json`, `claim-map.json`, `mx_tm_fact_verification_log.md`, `Ch5`, `Ch7`, `Ch10` 원고다.
- Sprint 2 범위는 `Ch5`, `Ch7`, `Ch10`으로 잠겨 있고, 신규 claim promotion 범위는 `MX-FEE-001`, `MX-DL-001`, `MX-NORM-001`, `MX-ENF-001`만 본다.
- workspace-local gate는 `npm --prefix MexTm run content:prepare`다.
- root `health:runtime`, `health:content`, `health:release`, Gateway/registry/report sync는 shared root gate에서만 처리한다.

## Root Sync Diff Memo

| target | status | memo |
| --- | --- | --- |
| `PROJECT-OVERVIEW.md` | `unchanged` | `15 chapters / 385 search entries / growth / mature`, Sprint 2 3장 잠금, lane-local gate와 shared root gate 분리가 이미 반영돼 있다. |
| `README.md` | `unchanged` | 루트 verification lane, `content:mexico`, full-pipeline 설명은 현재 MexTm lane truth와 충돌하지 않는다. |
| `src/products/registry.ts` | `follow-up` | 숫자와 tier는 유지하고, 필요하면 `summary` / `maturityNote`만 filing / maintenance / border-control triad가 더 직접 읽히게 다듬는다. |
| Gateway hero / CTA copy | `follow-up` | 현재 priority ordering은 유지한다. 다만 MexTm 설명을 계속 buyer-entry generic copy로만 두지 말고 filing packet, maintenance triage, border-control escalation까지 이어지는 lane으로 읽히게 조정 후보를 검토한다. |
| Report handoff copy | `follow-up` | trust-layer ordering은 유지한다. MexTm deep link는 이미 존재하므로, root integrator는 latest report focus point 문구만 Sprint 2 triad와 더 가깝게 조정할지 검토하면 된다. |

## Do-Not-Touch Boundary

- 루트 파일은 이 lane에서 수정하지 않는다.
- `MexTm/content/generated/*`, `public/generated/*`, `dist/*`는 수동 수정하지 않는다.
- Sprint 2 범위를 `Ch5`, `Ch7`, `Ch10` 밖으로 넓히지 않는다.
- `MX-FEE-001`, `MX-DL-001`, `MX-NORM-001`, `MX-ENF-001` 밖의 claim wording은 이번 handoff에 끌어오지 않는다.
- chapter/search/tier/lifecycle/qa 수치는 fresh shared root gate 증빙 없이 임의로 바꾸지 않는다.
