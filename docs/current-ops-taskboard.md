# GloTm Current Ops Taskboard

이 문서는 현재 로컬 위원회 합의안을 실행 보드 형태로 정리한 supporting doc이다.
현재 phase, 우선순위, 명령, 검증 계약의 authority는 계속 `../PROJECT-OVERVIEW.md`, `../README.md`, `../ARCHITECTURE.md`를 기준으로 본다.

## Snapshot

- Last updated: 2026-06-03
- Current phase: `Phase 2.5 — 프로모션 없는 유기 색인 운영 (배포·색인·계측 + 정합성 유지)`
- Locked priority order: `ChaTm -> MexTm -> EuTm -> Report / Gateway -> JapTm -> UKTm -> UsaTm`
- Current rule of thumb: 새 확장(신규 국가·pricing·새 파이프라인·의존성)은 멈추되, 정합성·verification provenance 유지에 더해 프로모션 없는 유기 색인·계측을 현재 운영 범위로 본다.
- `2026-06-02` shared root gate(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현 통과
- Brief archive provenance: `2026-05-k-beauty-counterfeit-platform-evidence`(2026-05-20 publish)는 2026-05-17 doc lock 이후 추가됐고, 2026-06-02 shared root gate + `src/briefs/archive.test.ts` latest-issue 락으로 커버된다. 개별 브리프는 운영 문서에 인벤토리하지 않고 런타임 `src/briefs/archive.ts`를 정본 인벤토리로 보며, lane cadence·provenance·publish 게이트 계약은 `briefs-lane.md`를 기준으로 본다.
- 2026-06 라운드 반영: ChaTm·MexTm claim freshness 갱신(#57), 월간 리뷰 verifiedOn 2026-06-02 re-stamp(#58), UsaTm 저밀도 장 operating table·checklist 보강(#61). UKTm은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급된 registry 정본이며, 이 보드 Next Lane의 이전 `pilot / smoke QA` 표기를 그 정본에 맞춰 동기화했다. registry와 어긋난 잔여 surface는 아래 `Known Drift to Reconcile` 섹션에 남긴다.

## Today

### 1. `ChaTm` mature refresh closeout — **완료 (2026-05-17)**

- Sprint 1/2 원고 레인 A·B·C 반영 완료, 핵심 claim 모두 `Body-ready`
- `/china` 홈·챕터·검색·continue reading 스모크 bundle 정리 완료
- `chatm-root-gate-input.md` 및 `chatm-mature-qa-checklist.md` 기준선 2026-05-12로 갱신
- `chatm-content-expansion-taskboard.md` closeout 마킹 완료
- source chapters 기준 설명과 reader smoke evidence 충돌 없음

완료 기준 충족:

- [x] `chatm-content-expansion-taskboard.md`의 mature refresh 관련 잔여 메모가 닫혀 있다.
- [x] source chapters 기준 설명과 reader smoke evidence가 서로 충돌하지 않는다.

### 2. `MexTm` Sprint 2 후속 통합 — **완료 (2026-05-17)**

- `Ch5`, `Ch7`, `Ch10` 원고 반영 + `BODY_READY` claim 4개 승격 완료
- `mextm-root-sync-input.md` root verified date → 2026-05-12 갱신
- `src/products/registry.ts` MexTm summary → Sprint 2 triad 반영
- Gateway / Report handoff copy → This Week D레인으로 명시 defer

완료 기준 충족:

- [x] `mextm-content-expansion-taskboard.md`의 Leader Integration Inputs를 root sync 관점으로 옮길 수 있다.
- [x] local gate 결과와 root wording 후보가 한 장의 메모로 묶여 있다.

### 3. `EuTm` stabilization closeout 준비 — **완료 (2026-05-17)**

- `controlled EU+UK scope` 문구: workspace docs / portfolio-scorecard / registry.ts 모두 동일 표현으로 확인 → drift 없음
- 핵심 6장 wording drift: `eutm-root-sync-input.md` Chapter Drift Map 기준 6개 장 모두 `no source drift`
- `14 chapters / 258 search entries / validate / beta` canonical 순서 명시: `registry.ts` → `manifest.json` → `search-index.json` → `eutm-root-sync-input.md`
- `eutm-root-sync-input.md` verifiedOn → 2026-05-12 갱신
- `eutm-content-expansion-plan.md` 2026-05-17 closeout memo 추가 (stabilization 리스크 ↔ root wording drift 연결)

완료 기준 충족:

- [x] `eutm-content-expansion-plan.md`의 stabilization 리스크가 root wording drift와 연결돼 설명된다.
- [x] root docs sync 전에 어떤 파일이 정본인지 분명하다.

## This Week

### A. 제품 상태 정본을 하나로 잠그기 — **완료 (2026-05-17)**

- 7개 가이드 전수 비교: registry.ts ↔ PROJECT-OVERVIEW.md ↔ README.md → drift 없음
- `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `verifiedOn` 모두 2026-05-12 기준 일치
- `scorecard.ts`는 하드코딩 없이 registry.ts 값을 동적으로 읽음 → canonical 보장
- `README.md`는 registry.ts를 canonical로 명시하며 별도 수치 없음
- workspace docs(ChaTm/MexTm/EuTm) → 오늘 세션에서 날짜 갱신 완료

대상:

- `src/products/registry.ts` ✓
- `PROJECT-OVERVIEW.md` ✓
- `README.md` ✓
- `docs/workspaces/ChaTm/*` ✓
- `docs/workspaces/MexTm/*` ✓
- `docs/workspaces/EuTm/*` ✓

### B. workspace별 검증 깊이 표를 고정하기 — **완료 (2026-05-17)**

핵심 drift 발견 및 수정:
- `phase1-runtime-qa.md`가 `UKTm`을 `UsaTm·JapTm`과 함께 "lighter-track"으로 표현했으나, `package.json` 기준 UKTm은 실제로 root full pipeline(`build-master → qa-content → build-content`)을 사용함
- 해당 줄 수정: UKTm을 lighter-track 그룹에서 분리, "root full pipeline, health:content workspace-local 미포함"으로 명확화
- "가이드별 검증 깊이 표" 추가 (7개 가이드 × root 파이프라인 / health:content workspace-local / deeper QA 방법)

대상:

- `package.json` — 확인 완료, 스크립트 정확함 ✓
- `README.md` — UKTm full pipeline 이미 정확히 서술 ✓
- `docs/phase1-runtime-qa.md` — lighter-track 오분류 수정 + 검증 깊이 표 추가 ✓
- 각 workspace `README.md`, `package.json` — 변경 불필요

### C. `health:report` provenance를 명시하기 — **완료 (2026-05-17)**

확인된 provenance 사실:
- `health:report`는 `.omx/state/health-lane-status.json`에서 **저장된 마지막 lane 결과**를 읽는다 — fresh re-run 아님
- 스크립트 출력 헤더에 이미 "recent lane-state provenance summary, not an end-to-end verification guarantee" 명시돼 있음

추가 수정 사항:
- `docs/monthly-review-template.md`: "health:report 해석 규칙" 표 추가 (읽는 방식, 의미, verdict 해석, 월간 리뷰 활용, fresh 검증 필요 시)
- `docs/monthly-review-template.md`: UKTm pilot → beta 승급 반영, Locked defaults 날짜 2026-05-12로 갱신
- `README.md`: `UKTm`을 lighter-track 그룹(`UsaTm·JapTm·UKTm`)에서 분리
- `scripts/health-report.ts`, `scripts/health-lane-state.ts`: 변경 불필요 (이미 명확)
- `docs/portfolio-scorecard.md`: 변경 불필요 (이미 provenance 설명 완비)

대상:

- `scripts/health-report.ts` ✓ (변경 불필요)
- `scripts/health-lane-state.ts` ✓ (변경 불필요)
- `README.md` ✓ (UKTm lighter-track 분리)
- `docs/portfolio-scorecard.md` ✓ (변경 불필요)
- `docs/monthly-review-template.md` ✓ (해석 규칙 + UKTm beta + 날짜)

### D. 그다음 `Report / Gateway` 정합화 — **완료 (2026-05-17, 확인 패스)**

- Gateway hero copy(`GatewayPage.tsx` lines 112-115): MexTm "filing packet·maintenance·border-control handoff" 이미 반영 ✓
- Report trust layer(`src/reports/registry.ts` gatewaySectionSummary): 동일 triad 이미 반영 ✓
- `monthly-review-template.md` locked defaults: This Week C에서 2026-05-12로 갱신 완료 ✓
- 코드 변경 불필요 — wording이 이미 Sprint 2 triad 및 locked defaults와 정렬돼 있음
- **[Superseded 2026-06-08 · PR #65]** 위 Gateway hero + report trust-layer wording은 평이화됨: hero supporting 2문단은 `src/content/gateway.ts` 공용 const로 이동(SPA+SEO 단일 출처), `launch sequencing`·`filing packet·maintenance·border-control handoff`·`controlled EU+UK scope·evidence triage`·`trust layer` jargon 제거. `gatewaySectionSummary`는 cross-guide 공통 질문 framing으로 재작성, report roadmap 카드 제목은 `reportExperienceMeta.gatewayRoadmapTitle` 사용. 위 2026-05-17 줄은 역사 기록으로 보존.

## Lane Artifacts

- `ChaTm`: `docs/workspaces/ChaTm/chatm-root-gate-input.md`
- `MexTm`: `docs/workspaces/MexTm/mextm-root-sync-input.md`
- `EuTm`: `docs/workspaces/EuTm/eutm-root-sync-input.md`
- `JapTm`: `docs/workspaces/JapTm/japtm-root-sync-input.md`
- `UKTm`: `docs/workspaces/UKTm/uktm-root-sync-input.md`
- 현재 라운드 원칙: workspace handoff 문서까지는 병렬로 진행하고, 루트 truth와 shared root gate는 통합 단계에서 1회만 다룬다.

## Next Lane

- `JapTm` lighter-track alignment
  - local `content:prepare` pass를 root sync input으로 정리했고, 현재 baseline은 `15 chapters / 145 search entries / incubate / beta / standard QA`다.
  - immediate root metadata change는 없고, 다음 액션은 route / maintenance / evidence hygiene utility가 home / continue reading / search에서 충분히 빨리 읽히는지 확인하는 것이다.
- `UKTm` reader-utility 정합 (lifecycle은 이미 `beta`)
  - registry 정본 baseline: `14 chapters / 128 search entries / incubate / beta / standard QA` (2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급, verifiedOn 2026-06-02). 이전 `pilot / smoke QA` 표기는 승급 이전 잔재였다.
  - 명칭 drift 해소 (2026-06-03, A안): 소스 챕터 헤딩·home copy·e2e bookmark를 모두 `beta-lane maintenance owner board`로 통일하고 `content:uk` 재생성(0 error). `e2e:smoke` UKTm reader smoke 통과로 reader가 home 문구로 같은 섹션을 찾는 흐름을 검증했다.
  - 그다음 액션은 `early-track filing decision board`, 위 maintenance owner board, `online incident quick board` utility가 home / continue reading / search에서 충분히 빨리 읽히는지 확인하고 `uktm-root-sync-input.md`에 evidence를 기록하는 것이다.
- `UsaTm` operating-copy maintenance
  - registry 정본 baseline: `14 chapters / 185 search entries / incubate / beta / standard QA` (verifiedOn 2026-06-02).
  - 직전 라운드(#61, 2026-06-02)에서 저밀도 장에 operating table·checklist를 보강했다. 유지 액션은 filing basis / specimen / monitoring lighter-track utility를 문구와 reader flow에서 계속 유지하는 것이다.

## Do Not Touch

- 신규 국가 가이드 추가
- pricing / paywall 도입
- 이메일 게이트 3단계 확장
- 새 콘텐츠 파이프라인 도입
- 의존성 추가
- generated JSON, `public/generated/*`, `dist/*` 수동 수정
- `weekly_ops_briefing_2026-04-17.md`만 근거로 한 공식 포지셔닝 변경

## Committee Warnings

- 브리핑은 방향 신호일 뿐, 현재 우선순위를 덮어쓰는 실행 명령이 아니다.
- 지금 GloTm의 다음 액션은 확장이 아니라 `ChaTm`, `MexTm`, `EuTm`, `Report/Gateway` 정합성 잠금이다.
- source 대신 generated 산출물부터 만지면 운영 truth가 먼저 깨진다.

## Working Notes

- root shared truth 확인 순서: `Harness/Constitution.md` -> `PROJECT-OVERVIEW.md` -> `README.md` -> `ARCHITECTURE.md`
- workspace taskboard 확인 순서:
  - `docs/workspaces/ChaTm/chatm-content-expansion-taskboard.md`
  - `docs/workspaces/MexTm/mextm-content-expansion-taskboard.md`
  - `docs/workspaces/EuTm/eutm-content-expansion-plan.md`

## Known Drift to Reconcile (UKTm beta straggler)

`UKTm`은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급됐고 `src/products/registry.ts`·`PROJECT-OVERVIEW.md`·`portfolio-scorecard.md`는 beta로 정합하다. 승급 이전 `pilot` 표현이 남아 있던 supporting 문서는 2026-06-03에 registry 정본(`incubate / beta / standard`)으로 정합화했다(정본은 registry.ts):

- [x] `docs/workspaces/UKTm/uktm-root-sync-input.md` — beta/standard reader-utility 정합 레인으로 재작성 (2026-06-03).
- [x] `docs/buyer-narrative.md` — UKTm 줄을 `incubate beta · standard · early-track verified`로 갱신 (2026-06-03).
- [x] `docs/workspaces/UKTm/uktm-content-expansion-plan.md` — superseded 배너 + 현재형 pilot 단정 정정 (2026-06-03, 과거 라운드 narrative는 historical로 보존).

명칭 drift (2026-06-03 해소, A안):

- [x] 소스 헤딩을 `beta-lane maintenance owner board`로 변경하고 home copy·e2e bookmark와 통일, `content:uk` 재생성(0 error, slug `beta-lane-maintenance-owner-board`) + `e2e:smoke` UKTm reader smoke 통과. generated/public은 gitignored 빌드 산출물로 CI 재생성.

### 추가 발견 — UKTm lifecycle-label 광역 drift (2026-06-03 해소)

②·④ 정리 후 전체 tree sweep에서 동일 family(UKTm을 `pilot / smoke / draft 공개본`으로 단정)가 더 있는 것을 확인하고 registry 정본(`beta / standard / early-track verified`)으로 정합화했다:

- [x] `UKTm/Harness/Architecture.md` (L6, L42) — lifecycle/QA 단정 + 편집 규칙을 `beta / standard / verified`로 정정(“beta 표현 회피” 규칙 → “growth/mature 회피, incubate 유지”).
- [x] `UKTm/Harness/Content-Spec.md` (L41) — reader-facing 요약 정합 규칙을 `beta / standard / verified`로 정정.
- [x] 소스 챕터 본문 lifecycle 라벨: `02_clearance-risk.md`(L45), `03_filing-strategy.md`(L9), `07_maintenance-renewal.md`, `11_platform-domain.md`(L70), `13_governance-raci.md`(L66) → `beta lane` / `early-track` / `verified 공개본`.
- [x] `docs/workspaces/UKTm/uktm-content-expansion-plan.md` (L51) — 성공 기준 줄을 beta 포지션으로 정정.
- [N/A] `UKTm/content/source/chapters/14_cases-appendix.md` (L68–76) — 2026-04-04 dated 검증 로그라 당시 라벨(pilot/smoke)은 historical로 보존하고, L76 운영-상태 줄에 “이후 2026-05-12 #53 beta 승급 · 정본 registry” forward-pointer만 추가.

소스 챕터 변경분은 `content:uk` 재생성(0 error, 14 chapters / 128 search) + `npm test` 222 통과 + `e2e:smoke` 28 통과로 확인. 남은 `pilot/smoke` 문자열은 전부 ⓐ dated 검증 로그(2026-04-03/04-04), ⓑ 승급 transition 서술, ⓒ `portfolio-scorecard.md`의 `Pilot` tier 기준 정의(UKTm 무관)뿐이다.
