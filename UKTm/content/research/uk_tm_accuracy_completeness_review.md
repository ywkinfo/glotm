# UKTm Accuracy & Completeness Review

검수 기준일: 2026-05-12

> 이 문서는 2026-05-12 승급 라운드의 dated verdict다. 수수료 현행값은 2026-07-22 GOV.UK 재대조 후 출원 £205, 갱신 £245, 추가 클래스당 £60으로 갱신되었으며 `uk_tm_fact_verification_log.md`와 `claim-map.json`을 현행 정본으로 본다.

## 전체 총평

- 대상 문서: `UKTm/content/source/master.md`
- 검수 수준: **standard QA verification — beta 승급 라운드**
- 검수 초점: 정확도(공식 1차 출처 기준), standard QA threshold 충족 여부, beta lifecycle 승급 정합성
- 직전 review verdict: 2026-04-03 — `qaLevel: smoke 유지, lifecycleStatus: pilot 유지` (안정화 라운드)

이번 round는 직전 2026-04-03 verdict를 명시적으로 override해 standard QA 잠금과 beta 승급으로 가는 결정이다. 직전 verdict는 density push와 verification hygiene을 우선하면서 자동 승급을 의도적으로 보류한 것이고, 이번 round는 그 push가 종료된 뒤 (1) density 9.14 안정 유지, (2) `highRiskVerificationGapCount` 0 유지, (3) 4개 evidence 파일의 coverage·source tier·verification method·known limitation 문서화가 완료된 위에서 standard QA threshold가 충족됐다고 판단한다.

판정:

- 정확도: 통과
- 충실도: 통과
- 재작성 필요 장: 0
- 즉시 보강 필요 장: 0
- standard QA threshold: 충족
- 공개 가능 여부: 가능
- 권장 `lifecycleStatus`: `beta`
- 권장 `qaLevel`: `standard`

## 직전 verdict 대비 변동 요인

- 2026-04-03 ~ 2026-05-12 사이 root full-pipeline (`content:prepare` + `health:runtime` + `health:content` + `health:release` + `health:report`) 재현 통과 1회(2026-04-21) 확인
- density 9.14 (`chapterCount: 14` / `searchEntryCount: 128`) beta minimum density 9 안정 유지
- `highRiskVerificationGapCount` 0 유지 (직전 round 결과 그대로)
- evidence 파일 구조적 역할 분담 명시화:
  - `uk_tm_research_report.md` — Coverage Scope (14 챕터 × 8 주제 영역), Source Reliability Tier (T1/T2/T3), Verification Method Summary, Known Limitations 4개 신규 섹션 보강
  - `uk_tm_fact_verification_log.md` — P1/P2 16건 모두 status `확정`, 영국 1차 출처 직접 URL 동반
  - `uk_tm_source_register.md` — 24개 entry 전부 T1(영국 1차) 또는 T2(국제 1차)
  - 본 파일 — refresh 회기별 verdict 트레일 유지
- mobile drawer close 회귀 가드 — `e2e/guide-smoke.spec.ts`에 close-button / scrim / Escape / in-drawer NavLink / browser back / scrim TouchEvent 6개 시나리오 정렬, live-only 회귀 책임이 e2e로 이동

## 핵심 확인 결과

### 정확도

- opposition 예고(TM7A, 2개월), opposition 본 기간(TM7, 2개월), cooling-off(초기 9개월 + TM9E 18개월) 구조 fact log P1 확정 유지
- 10년 갱신, 갱신 수수료(£200 + class £50), non-use revocation(등록 후 5년 / 연속 5년 불사용), TM26(N) £200 수수료 공식 출처와 충돌 없음
- IPEC small claims(≤£10,000), multi-track(damages cap £500,000, recoverable costs cap £60,000) 가이드와 일치
- HMRC AFA 무료 신청·detention 후 비용 분리 서술 유지
- EUTM/UK 분기(2021-01-01), comparable UK trade mark, IR comparable mark 갱신·사용 증거 분기 모두 공식 가이드 기준선 유지
- `.uk` Nominet DRS, UKIPO 검색 시스템명, Trade Marks Journal 정식 명칭 일관 적용

### 충실도

- 14 챕터가 7개 주제 영역(출원·식별 / 출원서 설계 / 심사·이의 / 등록 후 유지 / 계약·라이선스 / 분쟁·집행 / 통관·거버넌스) + 부록 사례까지 cross-reference. Coverage Scope matrix가 `uk_tm_research_report.md` 본 round 보강과 함께 명시화됨.
- post-Brexit 영국 단일 시장 의사결정 포인트(comparable mark, IR 분기, HMRC vs EU 통관 분리)가 `EuTm` 중복 없이 영국 채널 기준으로 분리되어 있음.
- 변동성 높은 항목(수수료, AFA 운영, Nominet DRS, IPEC 비용 cap)이 Known Limitations 표로 명시되어 다음 refresh의 입력 경로가 박혀 있음.

### Standard QA threshold 충족 평가

| 요건 | 기준 | 현재 상태 |
| --- | --- | --- |
| Coverage 문서화 | 14 챕터의 주제 영역 매핑 명시 | `uk_tm_research_report.md` Coverage Scope 신규 섹션 — 충족 |
| Source 신뢰도 등급 | 영국 1차 vs 국제 1차 vs 참고 구분 | `uk_tm_research_report.md` Source Reliability Tier + `uk_tm_source_register.md` 24 entry — 충족 |
| Verification 방법 | 4 파일 cross-reference 흐름 명시 | `uk_tm_research_report.md` Verification Method Summary 신규 섹션 — 충족 |
| 변동성 추적 | 다음 검증 시점과 위험 완화 방식 기록 | `uk_tm_research_report.md` Known Limitations 신규 섹션 + `uk_tm_fact_verification_log.md` P1/P2 status — 충족 |
| Reader-side 회귀 보호 | live-only 회귀 보호 책임 명시 | `e2e/guide-smoke.spec.ts` mobile drawer 회귀 가드 5건(+ 기존 close controls smoke) — 충족 |
| `highRiskVerificationGapCount` | beta 기준에서는 unconditional | 0 |

## 이번 refresh에서 잠근 결론

- `lifecycleStatus`: `pilot` → `beta`
- `lifecycleTone`: `pilot` → `beta`
- `qaLevel`: `smoke` → `standard`
- `verifiedOn`: 2026-04-21 → 2026-05-12
- `highRiskVerificationGapCount`: 0 유지
- `maturityNote`: beta 승급 반영, standard QA evidence threshold 충족 명시

`draft 공개본 · early track` 포지션 → **early-track verified 공개본**으로 톤 격상. 단 `portfolioTier`는 `incubate` 유지(growth/validate 트랙으로 끌어올리지 않음), `gatewayOrder`/`gatewayLaneRole` 동일.

## 공개 전 마지막 확인 권고

- `src/products/registry.ts` / `src/products/scorecard.test.ts` / `docs/portfolio-scorecard.md` / `PROJECT-OVERVIEW.md`의 UKTm 라인이 본 verdict와 동기화됐는지 단일 PR 안에서 확인
- monthly scorecard review에서 본 verdict가 1회 추가 검토를 거친 뒤에야 mature 승급 후보로 자동 분류된다. 본 round에서는 mature 승급 보류
- 다음 refresh round는 Known Limitations 표의 first-row 항목(UKIPO 수수료) 변동 발생 시 또는 monthly cadence 도래 시 먼저 트리거
- mobile reader 회귀는 `e2e/guide-smoke.spec.ts` 가드로 보호되며, 추가적 manual reader QA 메모는 본 round에서 추가하지 않는다
