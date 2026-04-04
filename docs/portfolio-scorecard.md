# GloTm Portfolio Scorecard

## Purpose

이 문서는 루트 `GloTm` 포트폴리오의 tier, lifecycle, 승격 기준, 현재 집중 우선순위를 하나의 기준으로 묶는다.

## Strategic tiers

- `flagship`: 기준 프레임을 책임지는 제품. 신규 시장 확장보다 freshness, density, reader QA를 우선한다.
- `growth`: buyer entry 가치와 실무 밀도를 빠르게 끌어올려야 하는 제품.
- `validate`: 범위 확대보다 verification, 정합성, 안정화를 우선하는 제품.
- `incubate`: lighter track으로 유지하며 verification refresh와 smoke QA를 우선하는 제품.

## Lifecycle promotion rules

- `Pilot`: 챕터 12+, search density 5+, verification freshness 120일 이하, root smoke QA 통과
- `Beta`: 챕터 14+, search density 9+, verification freshness 90일 이하, workspace pipeline + root standard verification 통과
- `Mature`: 챕터 15+, search density 12+, verification freshness 60일 이하, full pipeline + reader/search QA 통과, unresolved high-risk verification gap 0건

search density는 저장하지 않고 `searchEntryCount / chapterCount`로 계산한다.

## Review policy

- scorecard 리뷰는 월 1회 수행한다.
- lifecycle status는 초기 정렬 기간 동안 grandfathered 상태를 유지할 수 있다.
- 승격은 scorecard 리뷰에서만 허용한다.
- 자동 강등은 하지 않는다. 단, gap은 명시적으로 기록한다.
- `npm run health:report`는 scorecard 입력값을 읽어 각 guide를 `hold`, `upgrade-ready`, `verification-refresh-needed`로 분류한다.
- `upgrade-ready`는 다음 월간 review에서 승격 증빙 후보라는 뜻이지, 즉시 lifecycle status를 바꾼다는 뜻이 아니다.

## Current assignments

| Guide | Tier | Lifecycle | Focus |
|------|------|------|------|
| `LatTm` | flagship | mature | flagship 보호, freshness와 QA 유지 기준선 |
| `ChaTm` | growth | beta | Sprint 2 저밀도 장 보강 + mature 증빙 준비 |
| `MexTm` | growth | mature | buyer entry 가치와 실무 밀도 확보 완료, full QA 유지 |
| `EuTm` | validate | beta | fact verification와 문서 정합성 안정화 |
| `UsaTm` | incubate | beta | verification refresh 완료, standard QA 유지 |
| `JapTm` | incubate | beta | beta 승격, standard QA 유지 |
| `UKTm` | incubate | pilot | verification refresh 완료, smoke QA, draft 공개본 유지 |

## Current execution order

1. `ChaTm`
2. `MexTm`
3. `EuTm`
4. `Report/Gateway trust layer`
5. `JapTm`
6. `UKTm`
7. `UsaTm`

정렬 기준은 `buyer impact + 포트폴리오 전략 + 실제 콘텐츠 밀도 부족`이다. 따라서 단순히 가장 얇은 가이드를 먼저 메우지 않고, growth와 validate 레인의 체감 가치와 buyer entry 효과를 우선 반영한다.

## 90-day focus rules

- 신규 국가 추가 금지
- pricing/paywall 작업 보류
- prerender/SEO 2단계 보류
- 새 파이프라인 도입 금지
- growth/validate 레인 정렬이 끝나기 전 incubate 레인에 대형 확장 작업 배정 금지

## Evidence to collect

- tier별 guide CTA 클릭
- guide 진입
- brief 클릭
- operator link 클릭
- verification freshness 경과일
- QA 수준과 고위험 verification gap 수

## Root health lanes

- `health:runtime`: typecheck, runtime-safe unit tests, runtime smoke
- `health:content`: generated content refresh + generated-content regression tests + ChaTm/MexTm/EuTm local full pipeline 재현
- `health:release`: build + Pages subpath 출하 전 검증

외부 GTM 데이터가 없으면 lifecycle 승격은 내부 품질 승격으로만 처리한다.
