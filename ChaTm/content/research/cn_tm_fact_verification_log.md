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
| CN-FEE-001 | fee | Ch5, Ch14 | CNIPA 상표 출원 수수료는 현재 종이신청 300위안/류, 온라인신청 270위안/류를 기본으로 안내된다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/201912/t20191227_611.html ; https://www.cnipa.gov.cn/art/2024/5/8/art_707_368.html | `商标业务缴费指南`와 2024-05-08 CNIPA 답변 모두 종이 300위안/류, 온라인 270위안/류를 안내한다 | 2026-03-31 | 2026-03-31 | Body-ready | Tier 1 안내 2건 일치 + 본문 반영 시 Body-ready | Codex | 출판 직전 다시 확인 필요. 본문 반영 시 "최근 공식 안내 기준"으로 표현 |
| CN-DL-001 | deadline | Ch6, Ch14 | 이의신청은 예비승인 공고일부터 3개월 내 제기 가능하다 | CNIPA | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html | `商标法` 제33조는 공고일부터 3개월 내 이의를 제기할 수 있다고 규정한다 | 2026-03-31 | 2026-03-31 | Body-ready | 법문 원문 확인 + 본문 반영 시 Body-ready | Codex | 한국어 본문에서는 "예비승인 공고일부터 3개월"로 통일 |
| CN-DL-002 | deadline | Ch6, Ch14 | 거절결정 불복은 통지 수령일부터 15일 내 복심 신청이 가능하다 | CNIPA | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html | `商标法` 제34조는 거절 통지 수령일부터 15일 내 복심을 신청할 수 있고, 불복 시 30일 내 법원 제소가 가능하다고 규정한다 | 2026-03-31 | 2026-03-31 | Body-ready | 법문 원문 확인 + 본문 반영 시 Body-ready | Codex | 복심/재심 번역어는 장 전체에서 하나로 통일 필요 |
| CN-EVD-001 | evidence | Ch7, Ch8, Ch14 | 불사용취소 절차에서 등록인은 통지 수령 후 2개월 내 사용 증거나 정당한 불사용 사유를 제출해야 하며, 일부 상품에 대한 증명만 되면 그 범위만 유지될 수 있다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/202303/t20230330_26212.html | CNIPA 신청가이드는 통지 후 2개월 내 제출을 요구하고, 일부 상품에 대한 사용만 증명되면 그 부분과 유사상품만 유지될 수 있다고 설명한다 | 2026-03-31 | 2026-03-31 | Body-ready | 신청가이드 원문 확인 + 본문 반영 시 Body-ready | Codex | 본문 반영 시 "부분 유지 가능"과 "채널/거래/제품 자료 묶음"을 함께 설명 |
| CN-ENF-001 | enforcement | Ch10, Ch12 | 중국 상표 집행 경로에는 상표 행정집행, 전자상거래 플랫폼 조치, 도메인 거래형 침해 판단, 세관 지재권 보호, 인민법원 사법 절차가 함께 작동한다 | CNIPA/Customs/Court | Tier 1 | https://www.cnipa.gov.cn/art/2020/6/17/art_75_126939.html ; https://online.customs.gov.cn/static/pages/guides/002029002000/002029002000.html ; https://www.court.gov.cn/upload/file/2025/04/21/22/33/20250421223324_48280.pdf | `商标侵权判断标准`은 전자상거래 플랫폼과 도메인 거래형 침해를 명시하고, 해관 가이드는 지재권 해관备案 절차를 설명하며, SPC 2024 보고서는 전문화된 지재권 사법체계를 설명한다 | 2026-03-31 | 2026-03-31 | Body-ready | 행정·세관·사법 공식 문서 3종 교차확인 + 본문 반영 시 Body-ready | Codex | 장별로는 용어표를 먼저 만든 뒤 승격 |
| CN-FIL-001 | filing-design | Ch5 | 중국 출원에서는 `类似商品和服务区分表` 표준명칭과 공개된 수리가능 상품·서비스 명칭을 기준으로 분류를 설계하고, 비표준 항목도 분류원칙에 맞아야 한다 | CNIPA | Tier 1 | https://sbj.cnipa.gov.cn/sbj/tzgg/202005/t20200520_5482.html ; https://sbj.cnipa.gov.cn/sbj/sbsq/sphfwfl/200902/W020250103395269456465.pdf | CNIPA는 비표준 항목도 분류원칙에 맞는 구체적 명칭이어야 한다고 안내하고, 2025 구분표 수정본은 类似群/교차검토 구조가 계속 갱신된다는 점을 보여 준다 | 2026-03-31 | 2026-03-31 | Body-ready | 분류 가이드와 구분표 개정본 확인 + 본문 반영 시 Body-ready | Codex | 서브클래스라는 한국어 설명은 편의적 표현이므로 중국 원문 용어 병기 권장 |
| CN-MAD-001 | madrid | Ch4, Ch14 | 중국은 Madrid System 회원국이며, 국제등록 지정 후에도 보호 범위는 지정국의 국내법에 따라 정해진다 | WIPO | Tier 3 | https://www.wipo.int/en/web/office-china ; https://www.wipo.int/en/web/madrid-system/members/index | WIPO는 중국이 1989년에 Madrid System에 가입했고, 각 지정국의 국내법이 국제등록의 보호 범위를 정한다고 설명한다 | 2026-03-31 | 2026-03-31 | Body-ready | WIPO 회원 정보 일치 + 본문 반영 시 Body-ready | Codex | 직접출원 vs 마드리드의 우열은 법적 사실이 아니라 실무 판단이므로 본문에서는 분기표로 다룰 것 |
| CN-NORM-001 | terminology | Ch10, Ch12, Ch14 | 기관명과 절차명 표준안: CNIPA, SAMR, 해관총서/해관, 인민법원, Madrid System, 商标侵权判断标准, 知识产权海关保护备案 | CNIPA/WIPO/Customs/Court | Tier 1 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html ; https://www.wipo.int/en/web/office-china ; https://online.customs.gov.cn/static/pages/guides/002029002000/002029002000.html ; https://www.court.gov.cn/upload/file/2025/04/21/22/33/20250421223324_48280.pdf | 각 기관이 자사 공식 명칭과 절차명을 자사 문서에서 사용하고 있어, 한국어 본문 표준화의 근거로 삼을 수 있다 | 2026-03-31 | 2026-03-31 | Body-ready | 공식 문서 2건 이상 일치 + 본문 반영 시 Body-ready | Codex | 부록 용어표 초안 반영 완료 |
