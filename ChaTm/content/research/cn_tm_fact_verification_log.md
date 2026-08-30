# ChaTm Fact Verification Log

중국 상표 실무 본문에 반영하기 전, 변동성이 높은 사실을 확인하는 검증 로그입니다.

## 운영 원칙

- 본문보다 이 로그를 먼저 갱신합니다.
- 각 사실은 `Pending -> Verified -> Body-ready` 상태를 순서대로 통과합니다.
- 공식 기한, 수수료, 절차명, 기관명, 양식명은 원문 기준으로 확인합니다.
- 출처가 충돌하면 본문에 넣지 않고 `Conflict` 상태로 남깁니다.
- `Secondary` 출처는 해석 참고만 허용하고, 사실 확정 근거로는 사용하지 않습니다.

## Source Tier

| Tier | 설명 | 허용 용도 |
| --- | --- | --- |
| Tier 1 | 법령, CNIPA/SAMR/세관/법원 등 공식 기관 공지와 공식 수수료표 | 사실 확정, 본문 승격 판단 |
| Tier 2 | 공식 양식, 포털 안내, FAQ, 운영 공지 | Tier 1과 일치할 때 보조 승인 |
| Tier 3 | WIPO, 공식 판례/재판 공개자료, 공식 보조 문서 | 국제출원/실무 맥락 보강 |
| Secondary | 로펌, 블로그, 해설 | 용어 해석 참고만 허용 |

## Acceptance Rule

- `Verified`: 공식 출처와 핵심 문구, 확인일, 적용 범위 메모가 채워진 상태
- `Body-ready`: 본문 반영 장/섹션이 명시되고, 용어 번역 메모까지 정리된 상태
- 고위험 사실은 Tier 1 단독 확인 또는 Tier 1 + Tier 2 교차확인이 필요합니다.

## Verification Queue

| claim_id | category | chapter_ref | claim_text | jurisdiction | source_tier | official_source | evidence_excerpt | captured_at | last_verified | status | acceptance_rule | reviewer | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CN-FEE-001 | fee | Ch5, Ch14 | CNIPA 상표 출원 수수료는 현재 종이신청 300위안/류, 온라인신청 270위안/류를 기본으로 안내된다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/201912/t20191227_611.html ; https://www.cnipa.gov.cn/art/2024/5/8/art_707_368.html | `商标业务缴费指南`와 2024-05-08 CNIPA 답변 모두 종이 300위안/류, 온라인 270위안/류를 안내한다 | 2026-03-31 | 2026-08-30 | Body-ready | Tier 1 안내 2건 일치 + 본문 반영 시 Body-ready | Codex | 제5장 예산·제출 메모와 체크리스트에 반영 완료. 출판 직전 다시 확인 필요 |
| CN-DL-001 | deadline | Ch6, Ch14 | 이의신청은 예비승인 공고일부터 3개월 내 제기 가능하다 | CNIPA | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html | `商标法` 제33조는 공고일부터 3개월 내 이의를 제기할 수 있다고 규정한다 | 2026-03-31 | 2026-08-30 | Body-ready | 법문 원문 확인 + 본문 반영 시 Body-ready | Codex | 제6장 공식 기한 잠금표와 공고 후 3개월 운영 캘린더에 반영 완료. 한국어 본문은 "예비승인 공고일부터 3개월"로 통일 |
| CN-DL-002 | deadline | Ch6, Ch14 | 거절결정 불복은 통지 수령일부터 15일 내 복심 신청이 가능하다 | CNIPA | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html | `商标法` 제34조는 거절 통지 수령일부터 15일 내 복심을 신청할 수 있고, 불복 시 30일 내 법원 제소가 가능하다고 규정한다 | 2026-03-31 | 2026-08-30 | Body-ready | 법문 원문 확인 + 본문 반영 시 Body-ready | Codex | 제6장 공식 기한 잠금표와 15일 triage에 반영 완료. 복심 번역어로 통일 |
| CN-EVD-001 | evidence | Ch7, Ch8, Ch14 | 불사용취소 절차에서 등록인은 통지 수령 후 2개월 내 사용 증거나 정당한 불사용 사유를 제출해야 하며, 일부 상품에 대한 증명만 되면 그 범위만 유지될 수 있다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/202303/t20230330_26212.html | CNIPA 신청가이드는 통지 후 2개월 내 제출을 요구하고, 일부 상품에 대한 사용만 증명되면 그 부분과 유사상품만 유지될 수 있다고 설명한다 | 2026-03-31 | 2026-08-30 | Body-ready | 신청가이드 원문 확인 + 본문 반영 시 Body-ready | Codex | 제7장 2개월 triage와 부분 유지 판단표에 반영 완료. 채널/거래/제품 자료 묶음 설명 포함 |
| CN-ENF-001 | enforcement | Ch10, Ch12 | 중국 상표 집행 경로에는 상표 행정집행, 전자상거래 플랫폼 조치, 도메인 거래형 침해 판단, 세관 지재권 보호, 인민법원 사법 절차가 함께 작동한다 | CNIPA/Customs/Court | Tier 1 | https://www.cnipa.gov.cn/art/2020/6/17/art_75_126939.html ; https://online.customs.gov.cn/static/pages/guides/002029002000/002029002000.html ; https://www.court.gov.cn/upload/file/2025/04/21/22/33/20250421223324_48280.pdf | `商标侵权判断标准`은 전자상거래 플랫폼과 도메인 거래형 침해를 명시하고, 해관 가이드는 지재권 해관备案 절차를 설명하며, SPC 2024 보고서는 전문화된 지재권 사법체계를 설명한다 | 2026-03-31 | 2026-08-30 | Body-ready | 행정·세관·사법 공식 문서 3종 교차확인 + 본문 반영 시 Body-ready | Codex | 제10장 1차 triage, 출구 선택 매트릭스, 채널별 증거 패키지에 반영 완료 |
| CN-FIL-001 | filing-design | Ch5 | 중국 출원에서는 `类似商品和服务区分表` 표준명칭과 공개된 수리가능 상품·서비스 명칭을 기준으로 분류를 설계하고, 비표준 항목도 분류원칙에 맞아야 한다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/tzgg/202005/t20200520_5482.html ; https://sbj.cnipa.gov.cn/sbj/tzgg/202512/t20251226_36952.html ; https://sbj.cnipa.gov.cn/sbj/sbsq/sphfwfl/ | CNIPA는 비표준 항목도 분류원칙에 맞는 구체적 명칭이어야 한다고 안내한다. 区分表는 2026-01-01부터 尼斯분류 제13판(2026문본)으로 갱신됐으나(안경류 9→10류 등 일부 재분류 포함), 표준명칭 기반 분류 설계 원칙 자체는 동일하다 | 2026-03-31 | 2026-08-30 | Body-ready | 분류 가이드와 구분표 개정본 확인 + 본문 반영 시 Body-ready | Codex | 제3장 표준명칭 분리 기준과 제5장 `类似商品和服务区分表` handoff 표에 반영 완료. 중국 원문 용어 병기 유지. 2026-06-01 재확인: 제13판(2026문본) 시행 반영 — 방법론 동일해 본문 변경 불필요, 출처를 CNIPA 「启用尼斯分类第十三版2026文本的通知」(2025-12-26)로 갱신 |
| CN-MAD-001 | madrid | Ch4, Ch14 | 중국은 Madrid System 회원국이며, 국제등록 지정 후에도 보호 범위는 지정국의 국내법에 따라 정해진다 | WIPO | Tier 3 | https://www.wipo.int/en/web/office-china ; https://www.wipo.int/en/web/madrid-system/members/index | WIPO는 중국이 1989년에 Madrid System에 가입했고, 각 지정국의 국내법이 국제등록의 보호 범위를 정한다고 설명한다 | 2026-03-31 | 2026-08-30 | Body-ready | WIPO 회원 정보 일치 + 본문 반영 시 Body-ready | Codex | 직접출원 vs 마드리드의 우열은 법적 사실이 아니라 실무 판단이므로 본문에서는 분기표로 다룰 것 |
| CN-NORM-001 | terminology | Ch10, Ch12, Ch14 | 기관명과 절차명 표준안: CNIPA, SAMR, 해관총서/해관, 인민법원, Madrid System, 商标侵权判断标准, 知识产权海关保护备案 | CNIPA/WIPO/Customs/Court | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html ; https://www.wipo.int/en/web/office-china ; https://online.customs.gov.cn/static/pages/guides/002029002000/002029002000.html ; https://www.court.gov.cn/upload/file/2025/04/21/22/33/20250421223324_48280.pdf | 각 기관이 자사 공식 명칭과 절차명을 자사 문서에서 사용하고 있어, 한국어 본문 표준화의 근거로 삼을 수 있다 | 2026-03-31 | 2026-08-30 | Body-ready | 공식 문서 2건 이상 일치 + 본문 반영 시 Body-ready | Codex | 제10장 공식 용어 표준안과 관련 장 전반의 용어 통일에 반영 완료 |

## 2026-08-30 재검증 (claim-freshness)

2026-08-30에 claim 8건을 등록 1차출처에 재대조했다. **전건 현행 유효(변경 없음)**, `audit:facts` gate=pass·staleHighRisk=0. `claim-map.json`의 `lastVerified`를 2026-08-30으로 갱신했다(창 마감 2026-09-19 전 종결).

이번 회차는 검색 요약이 아니라 소스를 직접 열었다. `sbj.cnipa.gov.cn` 계열 3건은 curl이 403을 반환해 인앱 브라우저로 본문을 열었고, `www.cnipa.gov.cn`·`online.customs.gov.cn`·`www.court.gov.cn`·`www.wipo.int`는 curl로 열렸다.

- **CN-FEE-001:** 「商标业务缴费指南」이 2025-11-03자로 재게시됐으나 受理商标注册费는 종이 300元/류·온라인 270元/류로 동일(10개 초과 상품당 30元/27元 가산 포함). 개정법 제86조는 금액을 별도 규정에 위임한다(`具体收费标准另定`).
- **CN-DL-001 / CN-DL-002:** 2019년 수정 商标法 제33조 `自公告之日起三个月内`, 제34조 `十五日内` 원문 확인. 개정법의 제36조(2개월)·제37조(15일 유지, 기관 호칭 변경)는 제87조에 따라 2027-01-01 시행이라 아직 flip이 아니다.
- **CN-EVD-001:** 撤三 사용증거 안내의 `应在2个月期限内`와 근거(商标法 제49조·实施条例 제66조) 유지. 부분 사용 시 해당 부분·유사상품만 유지된다는 설명도 동일.
- **CN-ENF-001:** 「商标侵权判断标准」 제30조(전자상거래 플랫폼)·제31조(도메인) 현행, 해관 备案 지침의 설정근거(「知识产权海关保护条例」 제7~11조) 현행, SPC 「2024년 중국법원 지식재산권 사법보호 상황」에서 2024년 상표 민사 1심 신수 124,918건 확인.
- **CN-FIL-001:** 尼斯분류 제13판(2026문본)이 2026-01-01부터 시행 중이고 제14판 전환 공지는 없다. 通知公告에는 2026-04-21·2026-07-10자 区分表 외 可接受 명칭 갱신 통지만 추가됐다.
- **CN-MAD-001:** WIPO 두 면에서 1989년 가입과 "지정 회원국 국내법이 보호범위를 정한다"가 유지된다. `Protection in China does not include Hong Kong or Macao.` 문구도 그대로여서 기존 독자 안내 권고가 계속 유효하다.
- **CN-NORM-001:** 기관 명칭 전건 현행. SAMR 표기는 등록 소스가 규율하지 않는 부분으로, 이번 회차에 생긴 문제가 아니라 기존과 동일한 sourcing gap이다.

**[실시조례 개정 신호 — 없음]** 2027-01-01 시행 개정 상표법의 후속 「商标法实施条例」 개정 신호는 오늘 기준 확인되지 않는다. CNIPA 개정법 전용 專題(col3684)의 최신 항목은 2026-07-22 전문가 해설이고, 「修订主要内容」(2026-07-10) 본문에 实施条例·配套·细则 언급이 없으며, 商标局 通知公告도 2026-08-20까지 관련 공고가 없다. 브리프 발굴 후보 `2027-china-implementing-rules`는 계속 `watching`으로 둔다.

## 2026-07-21 재검증 (claim-freshness)

2026-07-21에 8개 claim을 1차출처(CNIPA 공식 법령·수수료·분류 안내, WIPO, 세관·법원 공식 문서)에 재대조하고, 변경 가능성이 있는 항목은 adversarial skeptic로 재확인했다. 결과: 전건 현행 유효(변경 없음), `audit:facts` gate=pass·staleHighRisk=0. Verification Queue의 last_verified를 2026-07-21로 갱신했다.

**[2027-01-01 개정 상표법 시행 예고]** 개정 상표법은 2026-06-26 채택·2027-01-01 시행(73→87조)으로 확정됐다. 공식 원문은 CNIPA 게재본(https://www.cnipa.gov.cn/art/2026/6/26/art_3685_206939.html)을 정본으로 한다. 아래 항목은 2026-12-31까지 현행 유효하며, 2026-07-22 owner 승인으로 본문에 forward-dated note를 반영했다. 실제 rule flip은 2027-01-01 시행 시 후속 시행지침·경과규정과 함께 재검증한다.

- CN-DL-001: 이의신청 3개월→2개월, 조문 제33조→제36조, 접수기관 商标局→国务院商标管理部门.
- CN-DL-002: 복심 15일 유지, 조문 제34조→제37조, 심판기관 商标评审委员会→国务院商标管理部门.
- CN-NORM-001: 商标评审委员会(TRAB) 폐지, 법문상 CNIPA를 国务院商标管理部门으로 지칭.
- CN-FIL-001: 분류출원 규정 제22조→제26조(실질 동일).

**기타:** CN-EVD-001의 2개월 사용증거 window는 상표법 실시조례 제66조 근거이므로 개정 상표법이 직접 바꾸지 않는다(실시조례 개정본 공표 시 재확인). CN-MAD-001은 중국 지정 보호가 홍콩·마카오를 포함하지 않는 점을 독자에게 안내하도록 권고. CN-FIL-001의 '수리가능'은 受理可能/可接受(acceptable)의 의미로 '수리=repair' 오독에 주의한다.

## Sprint handoff

이번 스프린트에서 writer가 바로 쓰는 우선 6장 handoff는 아래 기준으로 잠근다.

| chapter_ref | 우선 반영할 claim | writer handoff |
| --- | --- | --- |
| Ch2 | CN-FIL-001, CN-NORM-001 | 표기 전략에서 search/filing으로 넘길 공식 용어와 지정상품 입력 문구를 같은 언어로 유지한다 |
| Ch3 | CN-FIL-001 | `类似商品和服务区分表` 기준 표준명칭, 수리가능 명칭, 类似群 접점을 search 브리프에 바로 연결한다 |
| Ch5 | CN-FEE-001, CN-FIL-001, CN-MAD-001 | 비용·제출 채널·직접출원/Madrid 분기 메모를 출원 데이터 패킷에 같이 묶는다 |
| Ch6 | CN-DL-001, CN-DL-002 | 공고 후 3개월, 거절 통지 후 15일 창을 fight / narrow / refile / drop decision table과 함께 잠근다 |
| Ch7 | CN-EVD-001 | 2개월 triage와 부분 유지 판단표를 channel-based evidence ops와 owner-user-linkage 메모로 연결한다 |
| Ch10 | CN-ENF-001, CN-NORM-001 | 행정·플랫폼·세관·사법 출구와 공식 기관명 표준안을 같은 incident memo에서 사용한다 |

이 표의 목적은 fact log를 다시 풀어 읽지 않아도, 우선 6장 writer가 어떤 claim을 어떤 운영표와 연결해야 하는지 한눈에 보이게 만드는 데 있다.
