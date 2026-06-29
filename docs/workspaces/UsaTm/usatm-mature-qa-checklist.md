# UsaTm Mature QA Checklist

이 문서는 `UsaTm`을 `growth / mature / full`로 승급 반영한 QA 증빙이다.
2026-06-29 owner scorecard follow-up에서 Stage 1 선행작업과 Stage 2 fact-review / metadata flip을 함께 닫았다.

## 1. Coverage Scope
- [x] 15 chapters — 「집행 포럼 통합 플레이북: TTAB·연방법원·플랫폼·CBP 병행 운영」(14장) 신설로 14→15
- [x] 신규 장은 채널 간 오케스트레이션 레이어로 한정(ch12 채널 메커닉스·ch13 포럼 선택과 경계 분리)
- [x] search density 206/15 = 13.7 (mature 기준 ≥12 충족)

## 2. Source Reliability (1차 출처 재대조)
- [x] 구조화 claim-map 채택(`UsaTm/content/research/claim-map.json`, 15건, 전 항목 BODY_READY)
- [x] HIGH claim 전부 sourceIds 연결(`us_tm_source_register.md` Claim-map sourceId 매핑)
- [x] opposition 30일(§1063)·cancellation 5년(§1064)·연방법원 구제(§§1116–1118)는 2026-06-28 Cornell LII 1차출처 재확인
- [x] 2026-03-28 기준 4건(TTAB·MAINT·CBP·ATY) + legacy log pending(fee·Assignment Center·SOU·LOP) 재확인 후 `lastVerified`/`factsReviewedOn` 재스탬프

## 3. Verification Method
- [x] `npm --prefix UsaTm run content:prepare` → 0 error / 0 warning / 15 source files
- [x] `audit:facts` (UsaTm 편입) → gate=pass, factIntegrity=100, consistency=100, effectiveGap=0
- [x] full-QA 파이프라인 편입: `content:usa` 풀 파이프라인화 + `health:content`에 UsaTm 추가
- [x] `npm run test` green (usa는 mature로 평가됨)

## 4. Known Limitations
- [x] 휘발성 수수료(USPTO fee 금액·CBP class별 금액·연방 filing fee)는 구조적 표기 유지, 본문 하드코딩 금지
- [x] B등급(statutory damages 범위·TMA 추정·판례명)은 full-QA 승급 범위 밖으로 유지(본문 하드코딩 금지)
- [x] lifecycle/tier/qa는 growth/mature/full로 Stage 2 반영 완료

## 5. Reader/Search Smoke
- [x] `/usa` reader 홈/챕터/목차/검색 flow 안정성(e2e 스모크)
- [x] 신규 14장이 outline·검색에 노출되는지 확인
