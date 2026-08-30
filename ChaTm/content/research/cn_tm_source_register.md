# ChaTm Source Register

이 문서는 `ChaTm` 공개본이 근거로 삼는 1차 출처를 sourceId 단위로 고정한다.
`content/research/claim-map.json`의 `sourceIds`는 아래 표의 키로 공식 URL에 연결되고,
회귀 가드 [`scripts/research-audit/claim-source-register.test.ts`](../../../scripts/research-audit/claim-source-register.test.ts)가
"claim이 참조하는 sourceId가 이 표에 실재하고 URL까지 추적되는가"를 강제한다.

기준일: 2026-08-30 (전건 본문 개방 확인)

> **왜 이 파일이 필요한가.** `npm run audit:facts`는 HIGH risk claim에 sourceId가 **몇 개 있는지**만 센다
> ([`scripts/research-audit/audit-facts.ts`](../../../scripts/research-audit/audit-facts.ts)). 실재하지 않는 sourceId를 써도
> `factIntegrity=100`이 나온다. 2026-08-30까지 `ChaTm`은 register 파일이 없어 sourceId 14개가 전부 그 빈틈에 있었다.

## Claim-map sourceId 매핑

| sourceId | 공식 출처 | URL |
|---|---|---|
| cnipa-fee-guide-2019 | CNIPA 商标局 「商标业务缴费指南」 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/201912/t20191227_611.html |
| cnipa-fee-answer-2024 | CNIPA 热点回应 (2024-05-08) — 受理商标注册费 기준 안내 | https://www.cnipa.gov.cn/art/2024/5/8/art_707_368.html |
| cnipa-trademark-law | 「中华人民共和国商标法(2019年修正)」 전문 — CNIPA 게재본 (현행, 2026-12-31까지) | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html |
| cnipa-trademark-law-article-33 | 위 법령 제33조 — 이의신청 공고 후 3개월 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html |
| cnipa-trademark-law-article-34 | 위 법령 제34조 — 거절불복 복심 15일 | https://www.cnipa.gov.cn/art/2019/7/30/art_95_28179.html |
| cnipa-trademark-law-2026 | 「中华人民共和国商标法（2026年修订）」 (2026-06-26 공포, 2027-01-01 시행) — CNIPA 專題 게재본 | https://www.cnipa.gov.cn/art/2026/6/26/art_3685_206939.html |
| cnipa-nonuse-cancellation-guide-2023 | CNIPA 商标局 「如何办理连续三年不使用撤销注册商标 提供商标使用证据」 | https://sbj.cnipa.gov.cn/sbj/sbsq/sqzn/202303/t20230330_26212.html |
| cnipa-infringement-standard-2020 | CNIPA 국지발보자〔2020〕23호 「商标侵权判断标准」 | https://www.cnipa.gov.cn/art/2020/6/17/art_75_126939.html |
| cnipa-accepted-naming-guide-2020 | CNIPA 商标局 「关于网申系统商标注册申请增加非标准项目申报功能的通知」 (2020-05-20) | https://sbj.cnipa.gov.cn/sbj/tzgg/202005/t20200520_5482.html |
| cnipa-nice-classification-2026 | CNIPA 商标局 「关于启用尼斯分类第十三版2026文本的通知」 (2025-12-26 게재, 2026-01-01 적용) | https://sbj.cnipa.gov.cn/sbj/tzgg/202512/t20251226_36952.html |
| china-customs-ipr-guide | 海关总署 办事指南 「知识产权海关保护备案」 | https://online.customs.gov.cn/static/pages/guides/002029002000/002029002000.html |
| spc-ip-report-2024 | 最高人民法院 「中国法院知识产权司法保护状况（2024年）」 | https://www.court.gov.cn/upload/file/2025/04/21/22/33/20250421223324_48280.pdf |
| wipo-china-office | WIPO — China (office page) | https://www.wipo.int/en/web/office-china |
| wipo-madrid-members | WIPO — Madrid System Members | https://www.wipo.int/en/web/madrid-system/members/index |

## 매핑 주의사항

- **동일 URL 3중 포인터.** `cnipa-trademark-law`·`cnipa-trademark-law-article-33`·`cnipa-trademark-law-article-34`는 모두 2019년 수정 商标法의 CNIPA 게재본 한 페이지를 가리킨다. 오류가 아니라 조문별 포인터이며, 이 페이지에는 앵커(`#`)가 없어 조문 단위 딥링크가 불가능하다. 세 행을 유지하되 label로 구분한다.
- **sourceId의 연도와 페이지 게재일이 다른 항목 2건.** `cnipa-fee-guide-2019`는 URL 경로만 2019(`201912/t20191227_611`)이고 페이지 상단 발행일은 **2025-11-03 재게시본**이다(수수료 값은 동일: 종이 300元/류·온라인 270元/류). `cnipa-nice-classification-2026`은 적용 문본이 2026(제13판 2026문본)이고 **통지 게재일은 2025-12-26**이다. 둘 다 "URL이 바뀌었다"는 오판을 부르기 쉬우니 재검증 시 이 줄을 먼저 본다.
- **2027-01-01 rule flip 예고.** `cnipa-trademark-law`(2019년본)의 `商标评审委员会` 지칭은 개정법 시행과 함께 폐지된다. 그 시점에 `cnipa-trademark-law-2026`이 현행 정본이 되고 이 표의 label을 함께 고친다.

## 채널 메모 (2026-08-30 실측)

- `sbj.cnipa.gov.cn` 계열 4건(`cnipa-fee-guide-2019`·`cnipa-nonuse-cancellation-guide-2023`·`cnipa-accepted-naming-guide-2020`·`cnipa-nice-classification-2026`)은 **curl에 403**을 반환한다. 인앱 브라우저로는 본문 전체가 열린다 — 403을 도달 불가로 기록하지 않는다.
- `www.cnipa.gov.cn`·`online.customs.gov.cn`·`www.court.gov.cn`·`www.wipo.int`는 브라우저 User-Agent를 붙인 curl로 열린다(gzip 응답이므로 `--compressed` 필요).

## 미해결 (owner 판단)

- **`sphfwfl` 상설 코너에 대응하는 sourceId가 없다.** fact log의 CN-FIL-001 `official_source` 세 번째 값 `https://sbj.cnipa.gov.cn/sbj/sbsq/sphfwfl/`(商品和服务分类 코너)는 claim-map sourceId로 표현되지 않는다. 보조 출처로 별도 표에 둘지, sourceId를 신설할지 결정이 필요하다.
- **SAMR sourcing gap.** `CN-NORM-001`은 표준 기관명에 SAMR(国家市场监督管理总局)를 포함하지만 등록된 sourceId 어디에도 SAMR 자기 페이지가 없다. 商标法은 집행부처를 `负责商标执法的部门`으로만 지칭하므로 이 gap은 이전부터 있었고, register 신설로 처음 눈에 보이게 됐다.

## 운영 규칙

- 본문에 수수료·기한·기관명·제도명을 단정해 쓰기 전 이 표에 출처를 추가한다.
- 출처가 없는 문장은 `cn_tm_fact_verification_log.md`에서 `추가검증 필요`로 표시한다.
- URL이 리다이렉트되면 최종 URL로 이 표를 갱신한다. 죽은 URL은 남기지 않고 빼되, 경위는 fact log에 기록한다.
