# GloTm Portfolio Scorecard

## Purpose

이 문서는 루트 `GloTm` 포트폴리오의 tier, lifecycle, 확대 기준, 현재 집중 우선순위를 한눈에 정리한다.

## Strategic tiers

- `flagship`: 기준 프레임을 책임지는 제품. 신규 시장 확장보다 freshness, density, reader QA를 우선한다.
- `growth`: buyer entry 가치와 실무 밀도를 빠르게 끌어올려야 하는 제품.
- `validate`: 범위 확대보다 verification, 정합성, 안정화를 우선하는 제품.
- `incubate`: lighter track으로 유지하며 verification refresh와 smoke QA를 우선하는 제품.

## 단계별 기준

- `Pilot`: 챕터 12+, search density 5+, verification freshness 120일 이하, root smoke QA 통과
- `Beta`: 챕터 14+, search density 9+, verification freshness 90일 이하, workspace pipeline + root standard verification 통과
- `Mature`: 챕터 15+, search density 12+, verification freshness 60일 이하, full pipeline + reader/search QA 통과, unresolved high-risk verification gap 0건

search density는 저장하지 않고 `searchEntryCount / chapterCount`로 계산한다.

## Review policy

- scorecard 리뷰는 월 1회 수행한다.
- lifecycle status는 초기 정렬 기간 동안 grandfathered 상태를 유지할 수 있다.
- 기준 상향은 scorecard 리뷰에서만 반영한다.
- 자동 강등은 하지 않는다. 단, gap은 명시적으로 기록한다.
- `npm run health:report`는 scorecard 입력값을 읽어 각 guide를 `hold`, `upgrade-ready`, `verification-refresh-needed`로 분류한다.
- `upgrade-ready`는 다음 월간 review에서 상향 후보라는 뜻이지, 즉시 lifecycle status를 바꾼다는 뜻이 아니다.

## Current assignments

| Guide | Tier | Lifecycle | Focus |
|------|------|------|------|
| `LatTm` | flagship | mature | flagship 보호, freshness와 QA 유지 기준선 |
| `ChaTm` | growth | mature | Sprint 2 저밀도 장 보강 + monthly review 반영 완료 |
| `MexTm` | growth | mature | buyer entry 가치와 실무 밀도 확보 완료, full QA 유지 |
| `EuTm` | validate | beta | fact verification와 문서 정합성 안정화 |
| `UsaTm` | incubate | beta | verification refresh 완료, standard QA 유지 |
| `JapTm` | incubate | beta | beta 유지, standard QA 유지 |
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

## Report / Gateway trust layer rules

Gateway의 report 노출 순서는 발행일만으로 결정하지 않는다. 노출 역할은 `src/reports/registry.ts`의 report 메타데이터에서 관리한다.

- `gatewayPlacement: "front"`: Gateway 첫 화면과 report archive hero에서 가장 먼저 보여 줄 trust layer report
- `gatewayPlacement: "supporting"`: front report 바로 아래에서 함께 노출할 supporting report
- `gatewayPlacement: "archive"`: archive에는 남기되 Gateway 첫 화면 자동 노출 대상에서는 제외할 report

세부 정렬 규칙:

1. `gatewayPlacement`가 먼저다. `front -> supporting -> archive` 순으로 본다.
2. 같은 placement 안에서는 `gatewayPriority`가 낮을수록 먼저 노출한다.
3. 같은 priority까지 같으면 `publishedAt` 최신순으로 정렬한다.

운영 원칙:

- 같은 시점에 `front` report는 보통 1개만 유지한다.
- `supporting` report는 front report를 보조하는 trust layer여야 하며, guide를 대체하는 별도 메인 레인이어서는 안 된다.
- 새 report를 추가할 때는 title·summary보다 먼저 `gatewayPlacement`, `gatewayPriority`, `whyNow`를 잠근다.
- buyer-facing 첫 진입 문법을 바꿀 report만 `front`로 올린다. 국가별 세부 보강이나 보조 evidence 문서는 기본적으로 `supporting` 또는 `archive`다.

## 90-day focus rules

- 신규 국가 추가 금지
- pricing/paywall 작업 보류
- prerender/SEO 신규 재설계 보류
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

외부 GTM 데이터가 없으면 lifecycle 상향은 내부 품질 지표로만 판단한다.
