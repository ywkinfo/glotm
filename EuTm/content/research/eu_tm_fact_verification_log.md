# EuTm Fact Verification Log

> **Updated for growth/mature (2026-06).** EuTm은 2026-06 growth expansion으로 `growth tier · mature lifecycle`
> (15개 챕터 / 검색 엔트리 260개)로 승급됐다(#69/#70). 아래 verified-item 표는 2026-06-09 재검증과 2026-06-10 법률
> 사실정정(UK 수수료·우선권·comparable·Brexit 날짜)을 반영한다. pre-expansion baseline(`14개 챕터 / 258개 / validate ·
> beta`)과 stabilization 시절 framing은 historical 맥락으로 보존한다. 정본 수치는 `src/products/registry.ts`.

이 fact log는 이미 검증된 사실이 어느 장에 어떻게 반영되었는지와 어떤 controlled gap이 남는지를 정리한다.
현재 baseline은 `15개 챕터 / 검색 엔트리 260개 / growth tier · mature lifecycle · full QA / controlled EU+UK scope`다(pre-expansion: `14개 챕터 / 258개 / validate · beta`, historical).
새 verified item을 무리하게 늘리기보다, 이 기준선이 `README`, harness 문서, 본문 설명과 같은 방향을 유지하는지를 먼저 본다.

## 2026-09-13 재검증 라운드 (claim 11건 · 캡처 근거)

**11건 전부 변경 없음.** 본문 정정은 없고, 바꾼 것은 `EU-ENF-001`의 재확인 시점 하나와 `EU-FEE-001`의
sourceId 하나다. `lastVerified`는 전 항목 **2026-09-13**으로 갱신했고 `factsReviewedOn`도 같은 날로 옮겼다.

### 이 회차가 무엇을 근거로 삼았는가

같은 날 아래 triage 절이 기록한 대로 이 세션의 채널은 전건 차단이었다. 대조는 **다른 채널이 받아 온 응답
바이트 캡처**로 했다. 캡처 provenance는 다음과 같고, 회차 시작에 전건 재계산해 일치를 확인했다.

| 항목 | 값 |
|---|---|
| 아카이브 | `glotm-sources-20260913.tar.gz` · 1,726,391바이트 · sha256 `a2d564d52b7648b6…b0cd367f` |
| 캡처 시각 | 2026-09-13 08:54:28Z ~ 08:55:49Z (UTC) |
| 캡처 채널 | 별도 세션의 클라우드 컨테이너 `curl` (이 세션과 다른 egress 경로) |
| 검증 | 25건 전건 sha256·바이트 수 MANIFEST 대조 **일치**, HTTP 전건 200 |
| CELEX 요청 헤더 | `Accept: application/xhtml+xml` + `Accept-Language: eng` (register 접근 메모와 동일) |

**이 회차를 `verified`로 적는 이유.** 계약이 `verified`에 요구하는 실질은 claim을 그 출처의 실제 바이트와
대조했다는 것이고, register의 금지선이 겨눈 것은 그 반대편 — 아무도 열지 않은 URL을 근거처럼 붙이는 일이다.
해시·바이트 수·시각·요청 헤더가 붙은 캡처는 그 실질을 만족하며, 사후 재현이 불가능한 일반 `verified` 회차보다
오히려 감사 가능성이 높다. 다만 **`lastVerified`가 뜻하는 것은 "살아 있는 출처가 그날 그렇게 말했다"**이므로
날짜는 스탬프한 날이 아니라 **캡처한 날**로 적는다(이번에는 둘 다 2026-09-13이다). 규칙은
[`docs/briefs-discovery.md`](../../../docs/briefs-discovery.md) `캡처 근거 대조`에 잠갔다.

### claim별 결과

| claim | 결과 | 대조한 문언 |
|---|---|---|
| EU-SEL-001 | 유지 | 제1조 제2항 unitary character 축자 일치 · GOV.UK `no longer protected trade marks in the UK` |
| EU-DL-001 | 유지 | 제46조 제1항 3개월 · Annex I item 10 EUR 320 |
| EU-EVD-001 | 유지 | 제58조 제1항(a) 5년 · 제2항 부분취소 |
| EU-RNW-001 | 유지 | 제52조 10년 · 제53조 제3항 6+6개월 · Annex I item 19 `25 % … maximum of EUR 1 500` |
| EU-UK-001 | 유지 | `fully independent` · 수수료 `paid separately` |
| EU-ENF-001 | 유지(재확인 시점만 정정) | `Defend your rights`의 national/Union AFA·IPEP·COPIS, COPIS는 608/2013 근거 |
| EU-FEE-001 | 유지(sourceId 정리) | Annex I item 2·3·4·12·13·14 · GOV.UK TM3 £205 / TM11 £245 / 추가류 £60, 전부 `April 2026` |
| EU-PRIO-001 | 유지 | 제34조 제1항 6개월·동일표장·`successors in title` |
| EU-UKCOMP-001 | 유지 | `created a comparable UK trademark for every registered EUTM` · `only … registered before 1 January 2021` · 재출원 창 `up to and including 30 September 2021` |
| EU-AG-001 | 유지 | 제7조 제1항 (b)(c)(d)·제2항·제3항 |
| EU-UKUSE-001 | 유지 | `counts as use of the comparable UK right` · `will not be taken into account` |

통합본 판본은 `32017R1001 — EN — 01.12.2025`(001.001)이고 개정법은 **Reg (EU) 2023/2411 하나**뿐이다 —
2026-08-02 라운드가 대조한 판본과 같다.

### 바꾼 것 둘

**① `EU-ENF-001` 재확인 시점: 2028년경 → 2026년 12월.** 이 claim의 notes는 EU Customs Reform이 미발효라는
전제로 재확인을 2028년경으로 잡았는데, 근거를 잘못 봤다. 절차 2023/0156(COD)의 최신 단계는 2026-09-04
**COM(2026) 436 final**(TFEU 제294조 제6항 이사회 입장 통지)이고 지금은 **유럽의회 2독**이다. 제294조 제7항의
3개월(1개월 연장 가능)이 그 통지일부터 도므로 관보 게재는 빨라야 2026-12-04 이후다.

**본문은 건드리지 않았다.** 그 문서가 폐지 대상으로 드는 것은 `Regulation (EU) No 952/2013`이고 전문에
`608/2013`은 **0회**다 — AFA 근거 규정은 폐지 대상이 아니며, Data Hub 승계도 2028 → 2031 → 2034 그대로다.
어긋난 것은 claim의 사실이 아니라 claim이 스스로 정한 일정이었다. `EU-OQ-001`을 이 근거로 종결했다.

> **직전 triage가 틀렸다는 것도 함께 기록한다.** 아래 절이 WebSearch로 얻은 `신 UCC 발효 목표 2026년 9월 말`
> 신호는 2독 절차를 보지 못한 것이었다. 검색 수준 신호를 1차 출처로 승격하지 않은 판단이 옳았던 사례다.

**② `EU-FEE-001`의 `euipo-fees` 폐기.** 등록 URL이 HTTP 200으로 404 페이지를 돌려준다. 근거를 실제 대조
대상인 `eutmr-consolidated`(Annex I)로 옮겼다 — 상세는 source register `죽은 URL` 절.

### 쓰지 않은 캡처 둘

`euipo-priority-guidelines`·`euipo-absolute-grounds-guidelines`는 각각 2,268바이트 JS 셸(본문 16자)이라
인용 근거가 아니다. register의 2026-08-30 접근 메모가 적어 둔 그대로이며, 두 claim 모두 EUTMR 조문이 상위
근거라 결론에 영향이 없다.

## 2026-09-13 변경신호 triage (재대조 아님)

`lastVerified`도 `factsReviewedOn`도 움직이지 않았다. **이 회차는 1차 출처를 하나도 열지 못했다** — 재대조가
아니라, 60일 창이 닫히기 전에 "무엇부터 열어야 하는가"를 좁힌 회차다.

### 왜 재대조를 못 했는가

이 세션에서 register의 `Primary Source Index`와 `2026-08-02 대조 출처` URL을 전부 실측했고 **7개 전건이
차단**이다(게이트웨이가 CONNECT에 403 응답 — `connect_rejected`, `selective: false`). WebFetch도 같은 정책에
걸린다. 위 `2026-08-30` 절이 "이 경로만으로 수수료·기한 claim이 모두 결론난다"고 적어 둔
`publications.europa.eu` CELEX 경로도 포함이다.

| URL | 결과 |
|---|---|
| `publications.europa.eu/resource/celex/02017R1001-20251201` | 차단 |
| `publications.europa.eu/resource/celex/32017R1001` | 차단 |
| `eur-lex.europa.eu` | 차단 |
| `www.gov.uk/guidance/eu-trade-mark-protection-and-comparable-uk-trade-marks` | 차단 |
| `taxation-customs.ec.europa.eu/.../defend-your-rights_en` | 차단 |
| `guidelines.euipo.europa.eu` | 차단 |
| `www.euipo.europa.eu/en/trade-marks/apply-now/fees` | 차단 |

**이 차단은 2026-08-30 메모가 기록한 실패와 종류가 다르다.** 그때는 페이지가 열리되 본문이 비었거나(EUIPO
하이드레이트 실패) 헤더가 모자라 400이 났고, 헤더를 고치자 731KB가 나왔다. 이번에는 연결 자체가 서지 않는다.

### 창이 닫히는 시점

`mature` lifecycle의 claim staleness 임계는 **60일**이다(`scripts/research-audit/shared.ts`
`claimStalenessDaysByLifecycle`). claim 11건 전부 `lastVerified: 2026-08-02`이므로 **2026-10-01이 마지막
날**이고, **2026-10-02부터** HIGH claim 9건에 staleness warning이 붙어 `audit:facts`의 EuTm 행이
`gate=pass → warn`으로 바뀐다. warning 레벨이라 종료 코드는 계속 0이다(advisory·non-gating 계약).

### triage 결과 — 11건 중 10건 무신호, 1건 살아 있는 신호

**아래는 전부 WebSearch 수준이다.** 1차 출처 축자 대조가 아니므로 어떤 claim도 이 표로 닫히지 않는다.

| 대상 | 신호 | 판단 |
|---|---|---|
| EUTMR 통합본 버전 | 현행 통합본이 여전히 **2025-12-01**자이고 개정법은 Reg (EU) 2023/2411 하나로 검색된다 | 2026-08-02 라운드가 대조한 판본과 같다 — `EU-SEL/DL/EVD/RNW/PRIO/AG` 6건에 새 신호 없음 |
| EUTM 수수료 | 전자출원·갱신 각 EUR 850, 2류 EUR 50, 3류 이상 각 EUR 150 | Annex I item 2·12 기준값과 일치, 2026 개정 신호 없음 |
| comparable UK mark 사용 산입 | GOV.UK 안내 문언이 `EU-UKUSE-001`·`EU-UKCOMP-001`이 인용한 것과 실질 동일 | 새 신호 없음 |
| **EU Customs Reform** | **신품 Union Customs Code가 관보 게재 20일 후 발효 예정이고 목표가 "2026년 9월 말"이라는 신호.** EU Customs Authority는 2026년 중 릴 설치·2028-01 본격 가동, Data Hub는 2028년 단계 개시(전자상거래 2028-07)·2034-03 전면 | **`EU-ENF-001`의 계획과 어긋난다** — 그 notes는 "미발효"를 전제로 재확인을 **2028년경**으로 미뤄 뒀다. 아래 `EU-OQ-001` |

### 살아 있는 신호 하나 — `EU-ENF-001`

`EU-ENF-001` notes는 2026-08-02 기준으로 "EU Customs Reform이 2026-03-26 정치적 합의 단계이며(미발효) …
COPIS 계층의 장기 승계 리스크로 **2028년경 재확인**"이라고 적어 뒀다. 이번 triage 신호가 맞다면 발효는
2028년이 아니라 **몇 주 안**이고, 그 경우 재확인 시점 설정이 두 해 어긋난다.

본문 정정 대상이 아니라는 점은 분명히 해 둔다 — Regulation (EU) No 608/2013 기반 AFA/IPEP/COPIS 서술 자체는
신호와 충돌하지 않는다(운영 대체는 여전히 2028~2034 구간이다). 어긋난 것은 **claim의 사실이 아니라 그 claim이
스스로 정한 재확인 일정**이다. 그래서 본문도 `lastVerified`도 건드리지 않고 `openQuestions`에
**`EU-OQ-001`**로 올렸다. 이 워크스페이스의 첫 `openQuestions` 항목이며, 발굴 백로그의
`2026-08-eu-customs-reform-watch`(41일째 `watching`)를 `candidateId`로 연결해 두 표면이 같은 것을 가리키게 했다.

### 저장소 안에서 이미 확인된 것 하나 — `EU-FEE-001`의 UK 절반

`EU-FEE-001`은 UK(£205/£245)와 EUTM(EUR 850) 두 축을 함께 담는다. 그중 **UK 축은 `UKTm`이 더 최근에 열었다** —
`UK-FEE-001`의 `lastVerified`가 **2026-08-30**이고, `uk_tm_fact_verification_log.md`는 출원 £205·갱신 £245·
추가 클래스 £60을 **2026-07-22 GOV.UK 공식 안내로 재확인**했다고 적는다. 값은 두 워크스페이스가 일치한다
(2026-07-07 owner 결정으로 단일 정본).

이것으로 `EU-FEE-001`을 닫지는 않는다 — claim-map은 워크스페이스별이고, 다른 워크스페이스의 회차가
이 claim의 `lastVerified`를 옮기지 않는다. 다만 **재대조 순서를 정할 때 UK 축의 실효 staleness는 42일이 아니라
14일**이라는 뜻이므로, 남은 시간이 짧으면 이 claim은 뒤로 미룬다.

### owner가 열면 닫히는 순서

1. **`taxation-customs.ec.europa.eu` + 관보** — `EU-ENF-001` / `EU-OQ-001`. 유일하게 신호가 살아 있고 시한이 가장 짧다.
2. **`publications.europa.eu/resource/celex/02017R1001-20251201`** — 한 번 열면 `EU-SEL/DL/EVD/RNW/PRIO/AG` 6건이
   같이 닫힌다(각 claim notes에 조문 번호와 축자 인용이 이미 박혀 있어 문언 일치만 보면 된다). 위 `2026-08-30`
   절의 헤더 두 개(`Accept: application/xhtml+xml`, `Accept-Language: eng`)를 함께 보낸다.
3. **`gov.uk/guidance/eu-trade-mark-protection-and-comparable-uk-trade-marks`** — `EU-UK-001`·`EU-UKCOMP-001`·
   `EU-UKUSE-001` 3건.
4. **`EU-FEE-001`** — UK 축은 위 UKTm 회차로 보강돼 있으므로 EUTM Annex I 쪽만 남는다(2번에서 함께 처리 가능).

## 2026-08-30 sourceId 정합 (재대조 아님)

`lastVerified`는 움직이지 않았다 — 사실 재대조 회차가 아니라 **출처 추적 체인을 고친 회차**다.

회귀 가드([`claim-source-register.test.ts`](../../../scripts/research-audit/claim-source-register.test.ts))를 claim-map을 가진 6개 워크스페이스 전체로 넓히자, `EuTm`의 sourceId 15개 중 **8개가 이 워크스페이스 source register에 없다**는 것이 드러났다. `audit:facts`는 sourceId 개수만 세므로 그동안 `factIntegrity=100`이었다.

확인 결과 그 8개는 **실제 검증 근거가 아니었다.** 위 `2026-08-02 재검증 라운드` 표의 `결정 근거` 열이 그대로 말해 준다 — 그 라운드는 전건을 EUTMR 조문과 GOV.UK 안내로 대조했고, EUIPO 안내면을 연 회차는 없다. 그래서 URL을 찾아 붙이는 대신 **실제 근거로 remap** 했다.

| 폐기 | claim | 대체 |
|---|---|---|
| euipo-trade-mark-guidance | EU-SEL-001 | eutmr-consolidated |
| euipo-after-applying-guidance | EU-DL-001 | eutmr-consolidated |
| euipo-cancellation-guidance · euipo-genuine-use-materials | EU-EVD-001 | eutmr-consolidated |
| euipo-fees-payments-guidance · euipo-renewal-guidance | EU-RNW-001 | eutmr-consolidated |
| euipo-brexit-qa | EU-SEL-001 · EU-UK-001 · EU-AG-001 | govuk-comparable-uk-marks / eutmr-consolidated |
| govuk-eu-trade-mark-protection | EU-SEL-001 · EU-UK-001 | govuk-comparable-uk-marks (**같은 URL의 중복 id**) |

**열어본 적 없는 URL을 붙이지 않은 이유**는 register 문서에 적었다 — 추적 가능성의 외형만 만들면 가드에 같은 종류의 빈틈을 새로 넣는 셈이다.

**부수 확인.** `publications.europa.eu` CELEX 경로는 register 접근 메모대로 `Accept: application/xhtml+xml`만 붙이면 **HTTP 400**이 난다(`Invalid content type CONTENT_STREAM for WORK ... without language`). `Accept-Language: eng`를 함께 보내야 통합본 731KB가 나온다. 메모를 고쳤고, 오늘 그 경로로 제1조 제2항·제46조 제1항·제58조 제1항(a)·제52조를 전부 재확인했다(값 변경 없음 — `lastVerified`를 옮기지 않은 이유는 이것이 sourceId 정합 회차이지 전건 재대조 회차가 아니기 때문이다).

**`www.euipo.europa.eu`는 이번 세션에서 인용 근거로 쓸 수 없었다.** curl은 물론 인앱 브라우저에서도 Next.js 본문이 하이드레이트되지 않아 내비게이션 6.9KB만 렌더된다. 이미 등록돼 있는 `euipo-fees`·`euipo-faq-renewals`도 같은 제약을 받으므로, 다음 라운드에서 EUIPO 안내면을 근거로 삼으려면 채널부터 확보해야 한다.

## 2026-08-02 재검증 라운드 (claim 11건)

claim-map 10건 전부가 mature 60일 창 만료(2026-08-08/09)를 앞두고 있어 1차 출처로 재대조했다. **10건 모두 변경 없음**이며, 본문 정정은 발생하지 않았다. `lastVerified`는 전 항목 `2026-08-02`로 갱신했다.

| claim | 결과 | 결정 근거 |
|---|---|---|
| EU-SEL-001 | 유지 | EUTMR 제1조 제2항 unitary character |
| EU-DL-001 | 유지 | EUTMR 제46조 제1항 — 공고 후 3개월 |
| EU-EVD-001 | 유지 | EUTMR 제58조 제1항(a) 5년 · 제58조 제2항 부분취소 |
| EU-RNW-001 | 유지 | EUTMR 제52조·제53조 제3항 · Annex I item 19 (25%, 상한 EUR 1 500) |
| EU-UK-001 | 유지 | GOV.UK — comparable mark는 "fully independent", 수수료도 IPO/EUIPO 별도 |
| EU-ENF-001 | 유지 | Reg (EU) 608/2013 · EC Defend your rights (national/Union AFA, IPEP·COPIS) |
| EU-FEE-001 | 유지 | EUTMR Annex I item 2·12 (각 EUR 850) · GOV.UK TM3 £205 / TM11 £245 / 추가류 £60 (April 2026) |
| EU-PRIO-001 | 유지 | EUTMR 제34조 제1항 — 첫 출원일부터 6개월, 동일 표장·동일(또는 일부) 상품/서비스 |
| EU-UKCOMP-001 | 유지 | GOV.UK — 2021-01-01 일회성 자동 생성, 신규 EUTM은 UK 권리 미발생 |
| EU-AG-001 | 유지 | EUTMR 제7조 제1항(b)(c)(d) · 제7조 제2항 일부 지역 적용 |

### 신설 — EU-UKUSE-001 (교차 가이드 정합)

재검증 중 **본문 공백**을 확인했다. GOV.UK는 comparable UK mark의 5년 look-back 구간 중 2021-01-01 이전 부분에만 EU 사용을 산입하고 그 이후 구간에는 산입하지 않는다고 안내한다. 따라서 **2026-01-01부터는 5년 구간 전체가 2021-01-01 이후에 놓여 EU 사용을 전혀 원용할 수 없다.** `UKTm` 제8장은 2026-07-21 라운드에서 이미 이 사실을 반영했으나, controlled EU+UK scope를 운영하는 `EuTm`에는 빠져 있었다.

- 반영 위치: 제8장 `EU / UK 분기 캘린더` 하위 절 + 부록 Evidence Card
- 근거: GOV.UK "Where the period includes any time after 1 January 2021, use of the comparable trade mark in the EU (and outside of the UK) within that period will not be taken into account."
- 성격: 새 규칙이 아니라 **이미 7개월 전 발효된 경과 규정 종료**를 독자에게 알리는 보강이다.

### 감시 항목 (시행 예정 · 본문 미반영)

- **EU Customs Reform**: 2026-03-26 유럽의회·이사회 정치적 합의. EU Customs Authority와 EU Customs Data Hub가 회원국 세관 IT를 단계적으로 대체(전자상거래 2028 → 자율 2031 → 의무 2034). 현재 AFA·IPEP·COPIS 구조에는 변경이 없어 본문에 반영하지 않고, COPIS 계층의 장기 승계 리스크로 2028년경 재확인한다.
- EUTMR 개정 제안 4건(COM(2022)134·174, COM(2023)222·232) 확인 결과 갱신 기간·수수료 조문과 무관하다.

### 다음 재검증

`lastVerified 2026-08-02` 기준 mature 60일 창은 **2026-10-01** 만료다.

## Baseline evidence snapshot

- 챕터 기준선: `content/source/manifest.json`에 15개 챕터가 정의돼 있다 (pre-expansion: 14개, historical).
- search 기준선: `content/generated/search-index.json`의 현재 entry 수는 260이다 (pre-expansion: 258, historical).
- scope 기준선: 본문과 리서치 문서는 EU 공통 프레임 + UK 병행 판단까지만 유지하고, 회원국별 deep dive는 controlled gap으로 남긴다.

| Item | Why it matters | Primary source target | Chapter ref | Status | Notes |
|------|----------------|-----------------------|-------------|--------|-------|
| EUTM vs national filing split | 권리 구조 설계의 기준선 | EUIPO trade mark guidance, GOV.UK IP in the EU and EEA | Ch2 | Verified (2026-06-09) | 2021-01-01(전환 종료) 기점으로 UK 마크의 EUTM 의존성 완전 분리 확인 |
| EU-SEL-001 clearance variance memo | EUTM vs mixed structure 판단을 더 정확히 자르기 위한 기준선 | EUIPO Availability/TMview guidance, GOV.UK EU trade mark protection and comparable UK trade marks | Ch2 | Verified (2026-06-09) | Right-selection memo를 EU-wide와 local-risk로 분리 운영 |
| Opposition timeline | 이의 대응 운영 달력 | EUIPO after applying guidance | Ch7 | Verified (2026-06-09) | 3-month opposition period 엄격 유지 확인 |
| EU-EVD-001 owner-user evidence memo | distributor / marketplace seller 사용을 genuine use 설명으로 묶는 기준선 | EUIPO cancellation guidance and genuine use materials | Ch8 | Verified (2026-06-09) | Genuine use 입증 요건 확인 |
| Proof of use window | 취소/방어 리스크 | EUIPO cancellation guidance and genuine use materials | Ch8 | Verified (2026-06-09) | 5-year genuine use 요건 유지 확인 |
| Renewal timing and grace period | 갱신 운영 핵심 | EUIPO fees/payments and renewal guidance | Ch8 | Verified (2026-06-09) | 10년 갱신 및 6개월 grace period 유지 확인 |
| Customs application scope | 물류 통제 설계 | European Commission customs "Defend your Rights" guidance | Ch12 | Verified (2026-06-09) | IPEP/COPIS 기반 AFA 전자 신청 필수 확인 |
| UK parallel track handling | 권역 범위 확정 | GOV.UK Brexit/IP in EU guidance, EUIPO Brexit Q&A | Ch2, Ch8 | Verified (2026-06-09) | 2021-01-01(전환 종료) 이후 UK/EU genuine use 독립성 강화됨에 따라 관리 격리 필수 확인 |
| EU-UK-001 launch split calendar | EU와 UK launch timing이 다를 때 renewal/evidence 설명을 흔들리지 않게 만드는 기준선 | GOV.UK EU trade mark protection guidance, EUIPO Brexit Q&A | Ch2, Ch8 | Verified (2026-06-09) | 별도 rights calendar row 관리 필수 |
| Priority claim window | filing timing pack lock | EUIPO priority guidelines | Ch5 | Verified (2026-06-09) | Priority 기준 유지 확인 |
| Marketplace reporting channel memo | 디지털 제출 채널 재사용 속도 | eBay VeRO program guidance, Amazon rights owner reporting guidance | Ch11 | Verified (2026-06-09) | 채널명 및 capture rule 유지 확인 |
| UK customs AFA split | EU/UK border enforcement split | GOV.UK Apply to protect your intellectual property rights | Ch12 | Verified (2026-06-09) | UK customs AFA 별도 운영 확인 |
| Madrid linkage | 국제출원 연결 전략 | WIPO Madrid official pages | Ch2 | Verified (2026-06-09) | Madrid 사용 전제 조건 유지 확인 |
| Exhaustion and parallel trade | 병행수입 판단 기준 | European Commission notice on exhaustion of IP rights | Ch10 | Verified (2026-06-09) | 병행수입 판단 기준 확인 |
| Absolute grounds language risk | 설명적·영어 의미 리스크 | EUIPO Brexit Q&A and trade mark guidelines references | Ch6 | Verified (2026-06-09) | 언어 리스크 요건 유지 확인 |

## Controlled gap

- 회원국별 세부 절차 차이와 개별국 집행 디테일은 이번 스프린트에서 전면 확장하지 않는다.
- 본문은 EU 공통 프레임과 UK 병행 판단까지를 기준선으로 유지하고, 개별국 차이는 메모 수준으로 통제한다.

## Next-round shortlist

- none
- 이번 라운드에서 Ch5, Ch11, Ch12의 좁은 operational follow-up를 이미 흡수했고, 회원국별 deep dive로는 넓히지 않았다.

이번 라운드에서는 회원국별 차이를 새 `Pending`으로 넓히지 않는다.

## Sprint handoff

핵심 6장 심화에서 writer가 바로 쓰는 핵심 handoff는 아래 여섯 장이다.

| chapter_ref | 우선 반영할 verified item |
| --- | --- |
| Ch1 | EUTM vs national filing split, UK parallel track handling, Madrid linkage |
| Ch2 | EUTM vs national filing split, EU-SEL-001 clearance variance memo, UK parallel track handling |
| Ch4 | EU-SEL-001 clearance variance memo |
| Ch5 | EUTM vs national filing split, Madrid linkage, Priority claim window |
| Ch7 | Opposition timeline |
| Ch8 | EU-EVD-001 owner-user evidence memo, Proof of use window, Renewal timing and grace period, EU-UK-001 launch split calendar |
| Ch11 | Marketplace reporting channel memo |
| Ch12 | Customs application scope, UK customs AFA split |

이 표를 두면 검증 로그가 본문과 분리돼 있으면서도, 이번 스프린트의 chapter-to-claim 연결은 바로 읽을 수 있다.

## Stabilization handoff

이번 라운드의 목적은 verified item을 새 범위로 넓히는 것이 아니라, 이미 반영된 본문과 문서 설명을 같은 기준선으로 유지하는 것이다.

| 항목 | 현재 유지할 기준 | 이번 라운드에서 하지 않을 것 |
| --- | --- | --- |
| Ch1 / Ch2 | EUTM, national filing, UK split, Madrid linkage를 EU 공통 프레임 기준으로 유지 | 회원국별 filing deep dive 추가 |
| Ch4 / Ch5 | clearance variance, route pack, representative line을 operational memo 수준으로 유지 | 국가별 양식·fee 상세 확장 |
| Ch7 / Ch8 | opposition calendar, genuine use, renewal, EU/UK split row를 growth/mature baseline 기준으로 유지 | country-by-country opposition / renewal 절차 확대 |
| research log 전체 | verified item만 본문 기준선으로 유지 | 새 `Pending` 항목 확대 |

이 stabilization handoff를 두면 이번 레인이 “무엇을 더 쓸까”보다 “이미 잠근 기준을 어디까지 유지할까”에 초점을 맞춘다는 점이 분명해진다.

## Current controlled scope reminder

이번 라운드의 writer는 아래 원칙을 벗어나지 않는다.

| 항목 | 유지할 기준 |
| --- | --- |
| EU 공통 프레임 | 본문 중심 유지 |
| UK 병행 판단 | calendar/evidence split 기준까지만 본문 반영 |
| 회원국별 절차 차이 | 메모 수준으로만 통제 |
| fee·세부 절차 deep dive | 후속 트랙으로 보류 |

이 reminder를 붙여 두면 fact log가 단순 출처 목록이 아니라, 어디까지를 growth/mature baseline 본문으로 유지할지 지켜 주는 가드레일 역할도 하게 된다.
