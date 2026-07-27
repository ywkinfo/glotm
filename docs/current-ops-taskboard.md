# GloTm Current Ops Taskboard

이 문서는 현재 로컬 위원회 합의안을 실행 보드 형태로 정리한 supporting doc이다.
현재 phase, 우선순위, 명령, 검증 계약의 authority는 계속 `../PROJECT-OVERVIEW.md`, `../README.md`, `../ARCHITECTURE.md`를 기준으로 본다.

## Snapshot

- Last updated: 2026-07-27
- Current phase: `Phase 2.5 — 프로모션 없는 유기 색인 운영 (배포·색인·계측 + 정합성 유지)`
- Locked priority order: `ChaTm -> MexTm -> EuTm -> Report / Gateway -> UsaTm -> JapTm -> UKTm`
- Current rule of thumb: 새 확장(신규 국가·pricing·새 파이프라인·의존성)은 멈추되, 정합성·verification provenance 유지에 더해 프로모션 없는 유기 색인·계측을 현재 운영 범위로 본다.
- `2026-07-04` shared root gate(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현 통과
- Brief archive provenance: 개별 브리프는 운영 문서에 인벤토리하지 않고 런타임 `src/briefs/archive.ts`를 정본 인벤토리로 본다. lane cadence·provenance·publish 게이트 계약은 `briefs-lane.md`, 구조 강제(최신호 락 포함)는 `src/briefs/archive.test.ts`를 기준으로 본다.
- 2026-06 라운드 반영: ChaTm·MexTm claim freshness 갱신(#57), 월간 리뷰 verifiedOn 2026-06-02 re-stamp(#58), UsaTm 저밀도 장 operating table·checklist 보강(#61), EuTm growth/mature 승급(15장·부록·claim-map 10건·2026-06-10 법률 사실정정, #69/#70), UsaTm growth/mature 승급(15장·검색 엔트리 206개·claim-map 15건·2026-06-29 fact-review/full-QA). UKTm은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급된 registry 정본이며, 이 보드 Next Lane의 이전 `pilot / smoke QA` 표기를 그 정본에 맞춰 동기화했다. 과거 registry drift 정합 기록은 아래 `Resolved Drift Archive` 섹션에 보존한다.
- 2026-07 라운드 반영: `JapTm` growth/mature/full 승급(결정 2026-06-29 owner override · 머지 2026-06-30 #114 — 로그는 `monthly-review-template.md`)과 검증날짜·claim-map sourceId 정합 후속(2026-07-01 #115)을 정본으로 반영. 2026-07-04 월간 리뷰에서 shared root gate 재현 후 전 가이드 `verifiedOn`을 2026-07-04로 re-stamp(lane freshness, fact-review 아님). Next Lane의 이전 `JapTm` `145 / incubate / beta / standard` 표기는 승급 이전 잔재라 registry 정본에 맞춰 동기화했다.
- 2026-07-06 신규 리포트: 교차 관할 `global-goods-services-class-framework`(지정상품·류 설계) 추가 후 머지·Pages 배포(#118). publishedAt 2026-07-06으로 Gateway featured lead 진입 → featured 2 = 지정상품 설계 + 한글 표장, `gatewaySectionSummary` 예시 문구도 이에 맞춰 변경. 시의성 사실(2025 USPTO 수수료·2027 중국 개정 상표법·판례) 다수라 owner 사실 attestation은 후속 과제로 남긴다. buyer-narrative/monthly-review-template의 primary report 스냅샷은 새 featured 쌍으로 동기화(이 커밋).
- 2026-07-07~11 라운드 반영: 리포트 본문 nice-class 범위 렌더 정정·미커버 관할 제거(#120), `UKTm` growth/mature/full 승급(#121 — 다중 포럼 집행 오케스트레이션 15장·claim-map 11건·density 183·UK 수수료 £205/£245 EuTm 정합, owner override) + 잔여 beta/incubate 참조 docsync(#122), E-E-A-T JSON-LD 구조화데이터·reader provenance 표면화(#123, 챗봇 부결 대안). 후속 승급 정합(2026-07-11): `china.tsx` draft notice 제거, Gateway 빈 Incubate 카드 가드, `health.ts` UKTm lane incubate-pack→uk-growth, `health-report.ts` research coverage에 JapTm·UKTm 편입, README/ARCHITECTURE/phase1-runtime-qa의 JapTm shortcut·UKTm incubate 표기를 package.json `health:content`(Cha·Mex·Eu·Usa·Jap·UK workspace-local 포함, LatTm 루트-only) 진실로 정합.
- 2026-07-21~22 라운드 반영: UK/CN/MX claim-freshness 재검증(1차출처 재대조 + adversarial skeptic). UKTm claim-map 10건이 mature 60일 window를 초과(gate=warn·staleHighRisk 7)했던 상태를 해소 → 전 워크스페이스 `audit:facts` gate=pass·staleHighRisk 0. 실제 정정 2건: **UK-DRS-001**(2026-07-07 `.uk` DRS 신규 신청 WIPO 이관·공식명 'Dispute Resolution Service' — 본문 Ch11·claim-map·source register)과 **MX-FEE-001**(등록 후 3년차 실사용 선언 서식은 `IMPI-00-002`가 아니라 `IMPI-00-014` — HIGH 리스크 정정, 본문 Ch04/05/07/13/부록·claim-map·fact log). 본문 명확화 2건: UK 갱신 출원일 기산(TMA §40(3)) Ch07, comparable UK mark 2026-01-01 EU사용 불인정 Ch08. 2026-07-22 owner 종결: UKIPO 수수료를 온라인 출원 £205 / 갱신 £245 / 추가 클래스당 £60으로 확정, UK/CN/MX `factsReviewedOn`을 실제 재대조일로 표면화, 중국 개정 상표법 2027-01-01 시행(이의 3→2개월·조문/기관명 변경)을 ChaTm 본문에 forward-dated note로 반영. 실제 rule flip은 2027-01-01 시 후속 시행지침·경과규정과 함께 재검증한다.

- 2026-07-27 라운드 반영: 브리프 lane에 **정정(supersession) 장치** 도입. 직전 릴리스(#51219a0)가 가이드 본문의 stale legal guidance는 막았지만, Phase 2.5가 "신선도 surface"로 지정한 브리프 lane에는 정정 경로가 없었다. 실제로 2026-06-09 중국호는 `공포일·시행일 미확인`을 그대로 서술하는데 2026-07-11 중국호가 이를 정정(2026-06-26 공포·2027-01-01 시행 확정)하고 있었고, 정정은 **뒤 → 앞 방향으로만** 존재해 검색으로 6월호에 도착한 독자에게는 닿지 않았다. `BriefIssue.supersededBy{slug, updatedAt, note}`를 신설해 이슈 상단 고지·아카이브 카드 배지·prerender HTML 본문 앞에 노출하고, `lastModified`/JSON-LD `dateModified`를 `updatedAt`으로 갱신해 재크롤 신호를 남긴다. 본문 소급 수정은 하지 않는다(발행일 시점 사실 보존). 함께 잠근 것: `archive.test.ts`가 `relatedGuideLinks`를 registry live 경로와 대조(기존에는 `startsWith("/")`만 검사해 `briefs-lane.md`의 문서 약속보다 게이트가 약했다), phase2.5 런북 sitemap 인벤토리 `143`→`145`·brief 행 `15`→`17` 실측 정합 + SC 색인요청 대상의 `2026-06-*` 월 하드코딩 제거, monthly-review-template의 `discovered 139` 하드코딩 제거. 게이트: `npm test` 265/265, `health:runtime` e2e 28 pass, `health:release` prerender 145 routes + `test:seo` 12 pass, `check:consistency` 0/0, `audit:facts` 6/6 pass.

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

### 3. EuTm growth expansion → mature 승급 — **완료 (2026-06-10, #69/#70)**

- [x] 1단계: 권한·계약 변경 (PROJECT-OVERVIEW / Harness docs)
- [x] 2단계: 공식 출처 사실 검증 (1차 출처 재대조 · 2026-06-10 UK 수수료·우선권·comparable·Brexit 날짜 정정)
- [x] 3단계: 집중 콘텐츠 보강 (Ch3·6·10·14 + 부록 → 15장 체계)
- [x] 4단계: QA 및 mature 승급 (full QA · scorecard review)

closeout 요약:
- `15장 / 260 엔트리 / growth tier / mature lifecycle / full QA`로 registry 정본 반영 (당시 verifiedOn 2026-06-09 · factsReviewedOn 2026-06-10; verifiedOn은 이후 월간 re-stamp로 갱신 — 최신은 registry 정본)
- claim-map 10건(2026-06-10 신규 4건 포함) 1차 출처 재대조 완료
- `controlled EU+UK scope` 유지 · owner-doc·research 문서 정합 완료

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

- `JapTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 185 search entries / growth / mature / full QA` (2026-06-30 #114로 `incubate→growth`·`beta→mature`·`standard→full` 승급, factsReviewedOn 2026-06-29 · verifiedOn re-stamp 2026-07-04). 이전 `145 / incubate / beta / standard` 표기는 승급 이전 잔재였다.
  - 유지 액션은 route / examination·consent / maintenance / enforcement·customs orchestration이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.
- `UKTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 183 search entries / growth / mature / full QA` (2026-07-07 #121로 `incubate→growth`·`beta→mature`·`standard→full` 승급, factsReviewedOn 2026-07-07 · verifiedOn 2026-07-07). 이전 `14 / 128 / incubate / beta / standard` 표기는 승급 이전 잔재였다(2026-06-03 명칭 drift 기록은 아래 `Resolved Drift Archive`에 보존).
  - 유지 액션은 filing decision / examination·opposition / maintenance / 다중 포럼 집행 오케스트레이션이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.
- `UsaTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 206 search entries / growth / mature / full QA` (factsReviewedOn 2026-06-29 · verifiedOn re-stamp 2026-07-04). mature closeout: 집행 포럼 통합 플레이북(15장) 신설 + claim-map 15건 + full-QA 파이프라인 편입 + stale/pending 사실과 Jack Daniel's/CBP 후속 claim 1차출처 재대조 완료.
  - 유지 액션은 filing basis / specimen / maintenance / TTAB·법원·플랫폼·CBP 집행 오케스트레이션이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.

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
- 지금 GloTm의 다음 액션은 신규 확장이 아니라, owner-doc 정합 유지와 프로모션 없는 유기 색인·계측(Phase 2.5) + `UsaTm`·`JapTm` growth/mature 유지 + `UKTm` reader-utility 유지보수다.
- source 대신 generated 산출물부터 만지면 운영 truth가 먼저 깨진다.

## Working Notes

- root shared truth 확인 순서: `Harness/Constitution.md` -> `PROJECT-OVERVIEW.md` -> `README.md` -> `ARCHITECTURE.md`
- workspace taskboard 확인 순서:
  - `docs/workspaces/ChaTm/chatm-content-expansion-taskboard.md`
  - `docs/workspaces/MexTm/mextm-content-expansion-taskboard.md`
  - `docs/workspaces/EuTm/eutm-content-expansion-plan.md` (COMPLETED — growth/mature 승급 closeout)

## Resolved Drift Archive (UKTm beta straggler — 2026-06-03 해소)

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
