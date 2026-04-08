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

Gateway와 Report 아카이브의 report 노출 순서는 `publishedAt` 최신순으로 고정한다. 별도 placement 메타데이터는 두지 않는다.

- Gateway 첫 화면: 최신 report 2개만 먼저 보여 준다.
- Report archive hero: 최신 report 1개를 대표 CTA와 보조 설명의 기준으로 쓴다.
- Report archive 목록: 전체 report를 최신순으로 모두 보여 준다.

세부 정렬 규칙:

1. `publishedAt` 최신순으로 정렬한다.
2. Gateway 첫 화면은 정렬된 목록의 앞 2개만 노출한다.
3. Report archive hero와 Gateway hero의 대표 report CTA는 정렬된 목록의 첫 번째 report를 사용한다.

운영 원칙:

- 새 report를 추가할 때는 `publishedAt`과 `whyNow`가 최신 정렬과 대표 CTA 기준에 맞는지 먼저 확인한다.
- 최신 report 2개는 Gateway 첫 화면에 그대로 노출되므로, buyer-facing 첫 진입에서 바로 보여도 되는 제목과 summary를 유지한다.
- 특정 report를 첫 화면에서 숨기기 위한 별도 우선순위 필드는 두지 않는다. 노출을 바꾸려면 발행일 또는 공개 여부를 조정한다.

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
