# EuTm Source Register

이 문서는 `EuTm` growth-tier baseline에서 우선 확인할 1차 출처군과 핵심 claim의 공식 URL을 정리한 source-register companion artifact다.
현재 기준선은 `15개 챕터 / 검색 엔트리 260개 / growth tier · mature lifecycle / EU+UK scope`이며, 출처 범위를 이 기준선과 같은 방향으로 고정한다.

## Core Source Groups

| Group | Source family | Why it matters |
|------|---------------|----------------|
| EU trademark office | EUIPO trade mark portal, fees/payments, and renewal guidance | EUTM 절차, 심사, 이의, 갱신, 취소의 기준선 |
| EU law text | EUR-Lex and European Commission materials | 제도 근거와 공식 용어 확인 |
| International route | WIPO Madrid resources | 마드리드 경유 전략과 병행 설명 검증 |
| UK split | UK IPO guidance | 영국 별도 트랙 처리 기준선 |
| Member state practice | DE/FR/IT/ES 등 주요 국가청 공식 가이드 | 회원국 편차 메모를 통제하고, 후속 확장 후보만 정리하는 보조 출처군 |
| Customs | European Commission customs and border materials | 국경조치와 물류 통제 파트 검증 |
| Digital disputes | Official domain and platform policy documents | 도메인과 플랫폼 대응 절차 검증 |

## Coverage Notes

- `EuTm` 본문은 EU 공통 운영 프레임을 중심축으로 잡고, UK 병행 판단은 controlled EU+UK scope 안에서만 다룬다.
- 회원국별 예외는 공통 본문을 해치지 않는 범위에서만 넣고, 필요하면 별도 트랙으로 분리한다.
- `Member state practice` 그룹은 현재 baseline을 넓히기 위한 입력이 아니라, member-state variance memo가 과장되지 않았는지 확인하는 보조 가드레일로만 사용한다.
- 기관명, 시스템명, 절차명은 반드시 공식 표기와 일치시킨다.
- fee, 공식 기한, 세부 절차는 아래 Primary Source Index의 공식 출처로 1차 대조한 뒤 본문에 반영하고, claim-map에 sourceId로 연결한다.

## Primary Source Index (claim sourceId → 공식 URL)

| sourceId | 공식 출처 | URL |
|---|---|---|
| ukipo-fees-2026 | GOV.UK Trade mark forms and fees (2026-04-01 개정) | https://www.gov.uk/government/publications/trade-mark-forms-and-fees/trade-mark-forms-and-fees |
| govuk-comparable-uk-marks | GOV.UK EU trade mark protection and comparable UK trade marks | https://www.gov.uk/guidance/eu-trade-mark-protection-and-comparable-uk-trade-marks |
| euipo-priority-guidelines | EUIPO Guidelines 11.2 — Substantive requirements for priority claims | https://guidelines.euipo.europa.eu/2214311/2046727/trade-mark-guidelines/11-2-substantive-requirements-for-priority-claims |
| euipo-fees | EUIPO — Fees and payments | https://www.euipo.europa.eu/en/trade-marks/apply-now/fees |
| euipo-absolute-grounds-guidelines | EUIPO Guidelines — Examination, Absolute Grounds | https://guidelines.euipo.europa.eu/ |

> 위 URL은 claim-map 신규 claim(EU-FEE-001·EU-PRIO-001·EU-UKCOMP-001·EU-AG-001)의 sourceId가 가리키는 1차 출처다. 기존 EUIPO/GOV.UK/WIPO source family는 위 Core Source Groups를 따른다.
