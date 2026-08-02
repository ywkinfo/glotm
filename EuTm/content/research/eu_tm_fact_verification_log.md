# EuTm Fact Verification Log

> **Updated for growth/mature (2026-06).** EuTm은 2026-06 growth expansion으로 `growth tier · mature lifecycle`
> (15개 챕터 / 검색 엔트리 260개)로 승급됐다(#69/#70). 아래 verified-item 표는 2026-06-09 재검증과 2026-06-10 법률
> 사실정정(UK 수수료·우선권·comparable·Brexit 날짜)을 반영한다. pre-expansion baseline(`14개 챕터 / 258개 / validate ·
> beta`)과 stabilization 시절 framing은 historical 맥락으로 보존한다. 정본 수치는 `src/products/registry.ts`.

이 fact log는 이미 검증된 사실이 어느 장에 어떻게 반영되었는지와 어떤 controlled gap이 남는지를 정리한다.
현재 baseline은 `15개 챕터 / 검색 엔트리 260개 / growth tier · mature lifecycle · full QA / controlled EU+UK scope`다(pre-expansion: `14개 챕터 / 258개 / validate · beta`, historical).
새 verified item을 무리하게 늘리기보다, 이 기준선이 `README`, harness 문서, 본문 설명과 같은 방향을 유지하는지를 먼저 본다.

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
