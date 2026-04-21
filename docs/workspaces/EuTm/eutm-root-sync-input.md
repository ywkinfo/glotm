# EuTm Root Sync Input

## Baseline One-Liner

`EuTm`은 루트 `/europe`에 연결된 live validate regional guide이며, 현재 baseline은 `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope`다.

## Authority Order

1. `Harness/Constitution.md` - 저장소 공통 작업 규칙
2. `PROJECT-OVERVIEW.md` - 현재 phase, 우선순위, EuTm closeout 위치
3. `docs/current-ops-taskboard.md` - 이번 라운드의 `EuTm stabilization closeout 준비` 범위
4. `README.md` - root/workspace verification lane 계약
5. `src/products/registry.ts` - runtime metadata canonical snapshot
6. `docs/workspaces/EuTm/eutm-content-expansion-plan.md` - EuTm stabilization intent와 closeout 기준
7. `EuTm/README.md`
8. `EuTm/Harness/Architecture.md`
9. `EuTm/Harness/Content-Spec.md`
10. `EuTm/content/research/eu_tm_fact_verification_log.md`
11. `EuTm/content/research/claim-map.json`
12. `EuTm/content/research/eu_tm_source_register.md`

## Authoritative Metadata Snapshot

| Field | Value | Source |
| --- | --- | --- |
| Product | `EuTm` / `/europe` / `coverageType: region` / `availability: live_shell` | `src/products/registry.ts` |
| Summary | `EU-wide, core-state, UK split` + evidence triage를 `controlled EU+UK scope`로 잠그는 validate regional guide | `src/products/registry.ts` |
| Chapter count | `14` | `src/products/registry.ts`, `EuTm/content/source/manifest.json` |
| Search entry count | `258` | `src/products/registry.ts`, `EuTm/content/generated/search-index.json` |
| Tier / lifecycle / QA | `validate` / `beta` / `standard` | `src/products/registry.ts` |
| High-risk gap count | `0` | `src/products/registry.ts` |
| Root metadata verifiedOn | `2026-04-21` | `src/products/registry.ts` |
| Workspace gate rerun | `2026-04-21` `npm --prefix EuTm run content:prepare` pass | local rerun in this lane |
| Research baseline | claim-map adopted, BODY_READY 6건, source-register companion 유지 | `claim-map.json`, fact log, source register |

## Chapter Drift Map

| Core chapter | Authoritative title | Alignment packet | Drift status |
| --- | --- | --- | --- |
| Ch1 | `제1장. 유럽 상표 시스템 지도` | EU-wide / core-state / UK split escalation board, Madrid linkage | no source drift |
| Ch2 | `제2장. 권리 선택: EUTM, 개별국, 영국 병행` | `EU-SEL-001`, `EU-UK-001`, controlled EU+UK split memo | no source drift |
| Ch4 | `제4장. 사전 검색과 충돌 분석` | clearance variance memo, TMview + national + market pack | no source drift |
| Ch5 | `제5장. 출원 경로와 서류 설계` | route pack, priority 6-month window, Madrid base-right preflight | no source drift |
| Ch7 | `제7장. 이의신청과 공존 전략` | 3-month opposition period, 30/60/90 calendar, coexistence war-room | no source drift |
| Ch8 | `제8장. 등록 후 사용, 갱신, 증거 관리` | 5-year genuine use risk, 10-year renewal, `6+6` renewal window, EU/UK split calendar | no source drift |

로컬 문서 drift 최소 수정:

- `eutm-content-expansion-plan.md`의 Phase 2 우선 대상 chapter label을 manifest 기준 exact title로 정규화했다.
- 같은 섹션의 `controlled Eu/UK` 표기를 `controlled EU+UK`로 정규화했다.

## Research Alignment Packet

- Scope guardrail: 본문은 `EU 공통 프레임 + UK 병행 판단`까지만 유지하고, 회원국별 deep dive는 controlled gap으로 남긴다.
- BODY_READY claims 6건: `EU-SEL-001`, `EU-DL-001`, `EU-EVD-001`, `EU-RNW-001`, `EU-UK-001`, `EU-ENF-001`.
- Chapter linkage:
  - Ch2: rights split, UK parallel handling
  - Ch7: opposition timeline
  - Ch8: genuine use, renewal, EU/UK split calendar
  - Ch12: customs scope, UK customs split
- Source families locked: `EUIPO`, `European Commission / EUR-Lex`, `WIPO Madrid`, `UK IPO / GOV.UK`, selected member-state office guidance, customs, platform/domain policy docs.
- Research rule: fee, official deadline, procedure naming, member-state variance는 fact log / claim-map 기준선 밖으로 새로 넓히지 않는다.

## Local Gate Evidence

- `2026-04-21` `npm --prefix EuTm run content:prepare`
  - `Generated EuTm master manuscript from 14 sources.`
  - `QA complete: 0 error(s), 0 warning(s), 14 source file(s) checked.`
  - `Generated 14 chapters and 258 search entries.`
- `2026-04-21` direct count check
  - `EuTm/content/generated/search-index.json` entry count: `258`
- changed docs reread and self-checked in this lane

## Root Sync Diff List

| Root file | Sync note for integrator |
| --- | --- |
| `PROJECT-OVERVIEW.md` | metadata 자체는 현재 baseline과 맞다. `2026-04-21` shared root gate 재현이 끝났으므로 `shared root gate closeout reflected` 표현을 유지해도 된다. |
| `README.md` | EuTm를 root full-pipeline group으로 두는 설명은 그대로 맞다. 이번 lane에서는 local gate evidence만 갱신됐으므로, root lane 재실행 전 수치 변경은 필요 없다. |
| `docs/portfolio-scorecard.md` | `validate / beta` assignment와 focus 문구는 대체로 맞다. closeout phrasing만 overview와 같은 기준으로 한 번 더 맞추면 충분하다. |
| `docs/buyer-narrative.md` | 현재 `EU-wide, core-state, UK split` framing은 유지 가능하다. workspace packet과 더 강하게 맞추려면 `controlled EU+UK scope` 문구를 보조 문장에 한 번 더 노출하는 정도만 고려하면 된다. |
| `src/products/registry.ts` | `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `highRiskVerificationGapCount`, `summary` 모두 현 baseline과 일치한다. 실질 검토 포인트는 `maturityNote`의 `shared root gate closeout reflected` 문구뿐이다. |
| `src/products/europe.tsx` | optional. 현재 positioning/title/note는 claim-map + core-6 baseline과 일치한다. registry 또는 buyer copy를 조정할 때만 함께 손보면 된다. |

## Non-Scope Reminder

- 이 lane에서는 root 파일을 수정하지 않는다.
- generated JSON, root sync 결과물, product metadata source는 handoff만 하고 직접 바꾸지 않는다.
- 회원국별 deep dive, fee table 확장, 새 verified item 추가는 이번 closeout 범위가 아니다.
- shared root gate(`test:content`, `health:runtime`, `health:content`, `health:release`)는 리더 통합 단계에서 1회만 실행한다.
