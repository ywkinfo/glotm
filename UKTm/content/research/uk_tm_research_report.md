# UKTm Research Report

## 범위

`UKTm`은 영국 단일국가 상표 실무를 브랜드 관리자와 인하우스 IP 담당자 관점에서 정리하는 가이드다.
핵심은 조문 해설보다 출원, 유지, 사용, 분쟁, 온라인 대응, 운영 거버넌스를 실무 흐름으로 묶는 데 있다.

## 우선 조사 질문

1. 영국 단일국가 출원이 필요한 대표 사업 시나리오는 무엇인가
2. UKIPO 단계와 시장 집행 단계는 어떻게 구분해 설명해야 하는가
3. 사용증거와 non-use cancellation은 브랜드 운영자 관점에서 어떻게 문서화해야 하는가
4. 플랫폼, 도메인, 세관 이슈는 어떤 입력자료가 있어야 빠르게 대응 가능한가

## 초안 작성 원칙

- `EuTm`과 동일한 내용을 반복하지 않는다.
- 영국 독자가 바로 의사결정에 쓸 수 있는 운영 질문을 우선한다.
- 변동성이 큰 숫자보다 판단 프레임과 체크리스트를 먼저 고정한다.
- 사실 검증이 끝나지 않은 숫자와 기한은 공개본에서 단정 서술하지 않는다.

## Coverage Scope

`UKTm`의 14 챕터는 다음 8개 주제 영역으로 매핑된다.

| 주제 영역 | 챕터 | 운영 질문 입력 |
| --- | --- | --- |
| 출원·식별 | Ch01 system-map, Ch02 clearance-risk, Ch03 filing-strategy | UKIPO 단일출원 / Madrid IR(UK 지정) / EUTM comparable mark의 경계 결정 |
| 출원서 설계 | Ch04 application-specification | 분류, 상품·서비스 명세, 시리즈 마크 표기 |
| 심사·이의 | Ch05 examination-refusal, Ch06 opposition-third-party | absolute / relative ground refusal 대응, opposition 예고·본 opposition·cooling-off 운영 |
| 등록 후 유지 | Ch07 maintenance-renewal, Ch08 use-nonuse-cancellation | 10년 갱신, 사용 증거 관리, non-use revocation 방어 |
| 계약·라이선스 | Ch09 license-distribution | 라이선스 기록, 유통·온라인 계약과 IP 표기 |
| 분쟁·집행 | Ch10 enforcement-disputes, Ch11 platform-domain | IPEC small claims·multi-track·High Court 선택, .uk Nominet DRS, 플랫폼 신고 |
| 통관·거버넌스 | Ch12 customs-border, Ch13 governance-raci | HMRC AFA 신청 운영, 내부 RACI·KPI·검증 cadence |
| 부록 사례 | Ch14 cases-appendix | 분쟁·실수 사례에서 본문 룰 역검증 |

서술 깊이 원칙: 단일 시장 영국 실무 운영 흐름 기준. `EuTm`과 겹치는 EU-wide / Madrid 구조는 cross-reference만 두고 영국 단일 시장 의사결정 포인트를 먼저 꺼낸다.

## Source Reliability Tier

| Tier | 정의 | 대표 출처 | 본문 활용 규칙 |
| --- | --- | --- | --- |
| T1 — 영국 1차 | UKIPO / HMRC / Court / Tribunal / Nominet 공식 페이지 | gov.uk Trade Marks Manual, HMRC AFA guidance, IPEC guidance, Nominet DRS | 수수료·기한·기관명·구제수단 범위는 T1 출처 기준으로만 단정 서술 |
| T2 — 국제 1차 | WIPO / EUIPO 공식 | Madrid Monitor, TMview | 영국-외 보호 비교 시점에서만 사용 |
| T3 — 참고 | 학술 / 실무 가이드 / IPKat 등 신뢰성 있는 블로그 | — | 본문 단정 서술 근거로는 사용하지 않음, fact log에서 cross-check 입력으로만 활용 |

운영 규칙: `uk_tm_source_register.md` 의 entry가 모두 T1으로 채워졌는지를 매 refresh 시 확인한다. T2 entry는 영국 외 보호 비교 맥락에서만 사용한다.

## Verification Method Summary

evidence 파일 4개는 다음 흐름으로 연결된다.

```
chapter 본문 단정 서술
     ↑ 적용 챕터 ↓
uk_tm_fact_verification_log.md  →  P1/P2 사실 단위 추적 · status: 확정 | 조건부 | 추가검증 필요
     ↑ 직접 출처 ↓
uk_tm_source_register.md         →  주제별 공식 출처 24개, 확인일 기록
     ↑ 검수 회기 ↓
uk_tm_accuracy_completeness_review.md  →  refresh 회기별 verdict (검수 기준일·정확도·충실도·재작성 필요 장·즉시 보강 필요 장·공개 가능 여부)
```

규칙:

- 본문에 단정 서술이 들어가려면 먼저 `uk_tm_source_register.md`에 출처 추가 → `uk_tm_fact_verification_log.md`에 사실 단위 등록 → 본문 반영 순서를 따른다.
- `uk_tm_accuracy_completeness_review.md`는 refresh 회기마다 위 두 파일을 reload해 verdict 라인을 재확정한다.
- 검증 흐름은 별도 자동화 도구 없이 4개 파일의 cross-reference로 유지한다. `docs/factual-qa-rollout.md`의 `claim-map.json`은 Phase 4 advisory 트랙으로 향후 도입 예정이며 본 verification 흐름과는 분리된다.

갱신 주기: monthly scorecard review 시점에 최소 1회, content refresh 발생 시 사실 단위로 추가.

## Known Limitations & Next Refresh Targets

| 항목 | 변동성 | 다음 검증 시점 | 위험 완화 방식 |
| --- | --- | --- | --- |
| UKIPO 수수료(2026-04-01 기준 온라인 출원 £205, 갱신 £245, 추가 클래스당 £60) | 중 — 정부 조정 발표 시 변경 가능 | content refresh 시마다 fact log P2 항목 재대조 | 본문에 정확한 금액과 함께 기준일 표기, GOV.UK 출원·갱신 URL 재확인 후 status: 확정 유지 |
| post-Brexit comparable mark / IR 분기 | 저 — 2021-01-01 이후 안정화됐으나 향후 정책 변경 가능 | 분기별 fact log 재대조 | Ch01·Ch03·Ch07·Appendix E에 일관 서술, EU 외 사용 증거 자동 인정 여부 갱신 시 즉시 반영 |
| HMRC AFA 운영(working day 기준, detention 후 비용) | 중 — HMRC guidance 업데이트 빈도 있음 | content refresh 시 source register Ch12 entry 재확인 | "무료 신청 vs 후속 비용 리스크" 분리 서술 유지, AFA 신청 양식 변경 모니터링 |
| Tribunal / IPEC 비용 cap(multi-track £500k damages, £60k recoverable costs) | 저 — 법령 개정 시점에만 변동 | 연 1회 또는 cost rule 변경 보도 시 | 변경 보도 입수 시 fact log에 추가검증 필요로 표시, source register 갱신 후 본문 반영 |
| Nominet .uk DRS 절차·수수료 | 중 — Nominet 자체 정책 변경 가능 | 분기별 Nominet DRS page 재확인 | Ch11 단정 서술은 Nominet 페이지 직접 인용 기준 유지 |
| Mobile reader UX 회귀 | 저~중 — 코드 측 회귀 시 본문 흐름과 무관 | shared root gate + `npm run e2e:smoke` 재현 cadence | `e2e/guide-smoke.spec.ts`의 mobile drawer 회귀 가드 5개(close 버튼·scrim·Escape·NavLink·back·TouchEvent)로 보호 |

이 표는 다음 refresh 회기의 입력으로 사용된다. `uk_tm_fact_verification_log.md` 의 status가 P1 확정에서 추가검증 필요로 떨어지는 항목이 발생하면 즉시 `uk_tm_accuracy_completeness_review.md` 의 verdict line을 재산출한다.
