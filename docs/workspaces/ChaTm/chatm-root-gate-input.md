# ChaTm Root Gate Input

`ChaTm mature refresh closeout`의 root-gate handoff 입력값을 한 장으로 묶은 메모다. 루트 authoritative metadata는 `src/products/registry.ts`, workspace 계약은 `ChaTm/README.md`와 `ChaTm/Harness/*`, claim closure는 `ChaTm/content/research/cn_tm_fact_verification_log.md`와 `claim-map.json`을 기준으로 읽는다.

## Authoritative Metadata Snapshot

| 항목 | 값 | 기준 |
| --- | --- | --- |
| product slug / route | `china` / `/china` | `src/products/registry.ts` |
| chapter count | `15` | `src/products/registry.ts` |
| search entry count | `358` | `src/products/registry.ts` |
| portfolio tier | `growth` | `src/products/registry.ts` |
| lifecycle status | `mature` | `src/products/registry.ts` |
| qa level | `full` | `src/products/registry.ts` |
| high-risk verification gap | `0` | `src/products/registry.ts` |
| verifiedOn | `2026-04-21` | `src/products/registry.ts` |
| gateway lane role | `priority` | `src/products/registry.ts` |
| maturity note | `mature 승격 반영 · Sprint 2 저밀도 9장 보강 · reader/search QA 정렬 완료` | `src/products/registry.ts` |
| workspace pipeline | `build-master -> qa-content -> build-content`, root command `npm run content:china` | `ChaTm/README.md`, `ChaTm/Harness/Architecture.md` |

## Claim Closure Memo

현재 fact log의 mature refresh 대상 핵심 claim은 모두 `Body-ready`이며, source chapter에서도 핵심 본문 반영 흔적을 확인했다.

| claim_id | closeout 상태 | 본문/운영 반영 메모 |
| --- | --- | --- |
| `CN-FIL-001` | `Body-ready` | 제3장 search/subclass, 제5장 지정상품 설계, 제2장 naming handoff 문맥까지 연결된다. |
| `CN-FEE-001` | `Body-ready` | 제5장 예산·제출 메모에 최근 공식 안내 기준 수수료 관리 문구가 들어가 있다. |
| `CN-DL-001` | `Body-ready` | 제6장에 예비승인 공고 후 3개월 이의 기한표와 triage 흐름이 반영돼 있다. |
| `CN-DL-002` | `Body-ready` | 제6장에 거절 통지 후 15일 복심 기준과 decision table이 반영돼 있다. |
| `CN-EVD-001` | `Body-ready` | 제7장 evidence vault, 2개월 triage, 부분 유지 판단표로 운영화돼 있다. |
| `CN-ENF-001` | `Body-ready` | 제10장 행정·플랫폼·세관·사법 출구 선택 매트릭스에 반영돼 있다. |
| `CN-MAD-001` | `Body-ready` | 직접출원 vs Madrid route 판단 메모가 route-selection handoff 문맥으로 잠겨 있다. |
| `CN-NORM-001` | `Body-ready` | 제10장 공식 용어 표준안과 incident memo 문구에 반영돼 있다. |

- 현재 closeout 관점에서 `Pending` 또는 `Conflict` 상태의 claim이 blocker로 남아 있지 않다.
- `claim-map.json`은 `auditMode: advisory` 기준이며, non-blocking research note로 `CN-FIL-001` chapterRefs가 fact log handoff보다 좁게(`Ch5`) 남아 있다. write scope 밖이므로 이번 lane에서는 수정하지 않았다.

## Reader Smoke Bundle Checklist

reader smoke bundle은 `docs/workspaces/ChaTm/chatm-mature-qa-checklist.md`와 `docs/phase1-runtime-qa.md`의 ChaTm addendum을 함께 보면 된다. root gate에서 다시 볼 최소 묶음은 아래다.

- Home: `/china` 홈 진입, chapter card 노출, continue reading 복귀, 우선 잠금 6장 카드 노출 확인
- Search: `route`, `cancellation`, `licensing`, `customs`, `governance` 검색 시 section 단위 결과 표시
- Chapter deep link: `/china/chapter/:slug#section` 직접 진입 시 outline, hash scroll, prev-next 정상
- Chapter content anchors: 제4장 route memo, 제8장 attack/defense 분기표, 제9장 control sheet, 제12장 customs escalation matrix, 제13장 mature QA checklist가 search/outline에서 바로 열린다
- Mobile: 제8장·제9장 표와 action bar, drawer/scrim 동작, `body.style.overflow` 복구 확인
- Gateway sync: ChaTm summary, density, `qaLevel`, `highRiskVerificationGapCount`, maturity note가 registry truth와 일치

## Root Gate Input Memo

- metadata gate: root authoritative metadata는 이미 `15 chapters / 358 search entries / growth / mature / full / gap 0 / verifiedOn 2026-04-14`로 잠겨 있다.
- source-to-research gate: fact log의 `Body-ready` 대상과 source chapter 반영 메모가 충돌하지 않는다. 최소 샘플 확인 범위는 제2장, 제3장, 제5장, 제6장, 제7장, 제10장이다.
- workspace contract gate: `ChaTm` 로컬 계약 문서는 source-first editing, full pipeline, reader/search materialization 규칙을 유지하고 있다.
- shared root gate lane: `2026-04-21` 기준 `npm run content:prepare`, `npm run health:runtime`, `npm run health:content`, `npm run health:release`, `npm run health:report`를 shared verification으로 다시 재현했고 모두 통과했다.
- non-blocking note: 이번 lane의 산출물은 root metadata 변경 요청이 아니라 closeout handoff 정리다. 루트 파일 수정은 shared gate 결과를 본 뒤에만 판단하면 된다.

## Root Sync Need

| 파일 | 상태 | 메모 |
| --- | --- | --- |
| `src/products/registry.ts` | `unchanged` | ChaTm 메타데이터가 이미 현재 closeout 입력값과 일치한다. |
| `README.md` | `unchanged` | root verification contract와 ChaTm mature-lane 설명이 현재 상태와 충돌하지 않는다. |
| `PROJECT-OVERVIEW.md` | `follow-up` | shared root gate까지 닫히면 현재 focus 서술을 `ChaTm closeout` 중심에서 다음 priority lane 중심으로 넘길지 검토하면 된다. |
