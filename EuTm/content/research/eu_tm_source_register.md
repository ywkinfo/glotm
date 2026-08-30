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

### 2026-08-02 재검증에서 실제로 대조한 출처 (resolvable)

2026-08-02 라운드에서는 claim 11건 전부를 아래 URL로 직접 대조했다. 이전에는 `sourceId`가 source family만 가리켜 추적이 끊기는 항목이 있었으므로, 실제로 읽은 URL을 여기에 고정한다.

| sourceId | 공식 출처 | URL |
|---|---|---|
| eutmr-consolidated | Regulation (EU) 2017/1001 통합본 (2025-12-01 발효) — 제1·7·34·46·52·53·58조 및 Annex I | https://publications.europa.eu/resource/celex/02017R1001-20251201 |
| eutmr-original | Regulation (EU) 2017/1001 원본 (조문 대조용) | https://publications.europa.eu/resource/celex/32017R1001 |
| euipo-faq-renewals | EUIPO Help centre — FAQ: Renewals | https://www.euipo.europa.eu/en/help-centre/forms/faq-renewals |
| ec-customs-defend-your-rights | European Commission — Defend your rights (customs IPR enforcement) | https://taxation-customs.ec.europa.eu/customs/prohibitions-restrictions/counterfeit-piracy-other-ipr-violations/defend-your-rights_en |
| ec-customs-reform | European Commission — EU Customs Reform (감시 항목: 2026-03-26 정치적 합의, 미발효) | https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en |
| govuk-ip-in-eu-and-eea | GOV.UK — IP in the EU and EEA | https://www.gov.uk/guidance/ip-in-the-eu-and-eea |
| govuk-retaining-protection | GOV.UK — Retaining protection in the UK for EU Intellectual Property rights | https://www.gov.uk/government/publications/retaining-protection-in-the-uk-for-eu-intellectual-property-rights/retaining-protection-in-the-uk-for-eu-intellectual-property-rights |

> **접근 메모 (2026-08-30 실측 갱신)**: `eur-lex.europa.eu`와 `www.euipo.europa.eu`는 일반 fetch에 빈 본문/403을 반환하고,
> `guidelines.euipo.europa.eu`는 JS 앱이라 텍스트가 나오지 않는다. `www.euipo.europa.eu`는 인앱 브라우저에서도
> 본문이 하이드레이트되지 않아(내비게이션 6.9KB만 렌더) 인용 근거로 쓸 수 없었다.
> 규정 본문 경로는 `https://publications.europa.eu/resource/celex/<CELEX>`이며,
> **`Accept: application/xhtml+xml`만으로는 HTTP 400이 난다** — `Accept-Language: eng`를 함께 보내야 한다.
> 그렇게 하면 통합본 731KB(본문 292KB)가 그대로 나온다. 규정 본문과 Annex I은 Guidelines보다 상위 근거이므로
> 이 경로만으로 수수료·기한 claim이 모두 결론난다.
>
> ```bash
> curl -sSL -H "Accept: application/xhtml+xml" -H "Accept-Language: eng" \
>   https://publications.europa.eu/resource/celex/02017R1001-20251201
> ```

## 폐기된 sourceId (2026-08-30)

아래 8개는 claim-map의 `sourceIds`에 있었으나 **이 레지스터에 대응 항목이 없었고, 실제 검증 근거도 아니었다.**
2026-08-02 재검증 라운드는 이 claim들을 전부 EUTMR 조문과 GOV.UK 안내로 대조했다(`eu_tm_fact_verification_log.md`
`2026-08-02 재검증 라운드` 표의 `결정 근거` 열 참조). EUIPO 안내면을 연 회차는 없었다.

| 폐기된 sourceId | 쓰이던 claim | 대체 |
|---|---|---|
| euipo-trade-mark-guidance | EU-SEL-001 | eutmr-consolidated (제1조 제2항 unitary character) |
| euipo-after-applying-guidance | EU-DL-001 | eutmr-consolidated (제46조 제1항 3개월) |
| euipo-cancellation-guidance | EU-EVD-001 | eutmr-consolidated (제58조 제1항(a)) |
| euipo-genuine-use-materials | EU-EVD-001 | eutmr-consolidated (제58조 제2항 부분취소) |
| euipo-fees-payments-guidance | EU-RNW-001 | eutmr-consolidated (제52·53조, Annex I item 19) |
| euipo-renewal-guidance | EU-RNW-001 | eutmr-consolidated (동일) |
| euipo-brexit-qa | EU-SEL-001, EU-UK-001, EU-AG-001 | govuk-comparable-uk-marks / eutmr-consolidated |
| govuk-eu-trade-mark-protection | EU-SEL-001, EU-UK-001 | govuk-comparable-uk-marks (**같은 URL을 가리키던 중복 id**) |

**왜 URL을 찾아 붙이지 않고 폐기했는가.** 이 레지스터가 존재하는 이유가 "sourceId가 실재하는 출처를 가리키는가"를
보증하는 것인데, 아무도 열어본 적 없는 EUIPO 안내면 URL을 그럴듯하게 붙이면 **추적 가능성의 외형만 만들어진다.**
`audit:facts`가 sourceId 개수만 세는 빈틈을 메우려고 만든 가드에 같은 종류의 빈틈을 새로 넣는 셈이다.
EUIPO 안내면을 근거로 쓰고 싶다면 그 페이지를 실제로 열어 인용을 확보한 회차에서 추가한다.
