# 현지 대리인 선정 리포트 — 출처 대조 기록

이 파일은 `Reports/content/source/global-local-agent-selection-framework.md`의 **법정 요건 문장**에
대한 provenance 기록이다. 게재물이 아니다 — `Reports/scripts/build-content.ts`는
`Reports/content/source/` 직속 `.md`만 읽으므로 이 파일은 리포트 페이지나 검색 인덱스에 들어가지 않는다.

## 이 기록의 한계

- **사람이 검토하는 provenance 기록**이며 자동 freshness 검증이 아니다.
- `npm run audit:facts`는 6개 국가 workspace(`ChaTm`·`MexTm`·`EuTm`·`UsaTm`·`JapTm`·`UKTm`)만
  대상으로 하고 **Reports를 포함하지 않는다**. 이 register를 추가해도 자동 검증이 생기지 않는다.
- 규칙이 바뀌면 이 파일과 원고를 **함께** 갱신한다.

## 확인 방법과 그 제약

작업 환경의 egress 정책이 공식 기관 도메인 직접 열람(`WebFetch`)을 차단했다 —
`uspto.gov`, `gov.uk`, `law.cornell.edu`, `federalregister.gov` 모두 `EGRESS_BLOCKED`.
정책 거부는 우회하지 않고 보고하는 것이 원칙이므로, 대조는 **공식 도메인으로 범위를 제한한 검색**으로
수행했다. 따라서 아래 모든 행의 확인 방법은 `official-domain-search`이며,
**primary page 직접 열람은 수행하지 못했다.**

| 확인 방법 | 의미 |
|---|---|
| `official-domain-search` | 공식 도메인으로 제한한 검색에서 해당 기관 자체 문구와 공식 URL을 확보 |
| `primary-page-read` | 공식 페이지 원문을 직접 열어 확인 (이번 라운드에서는 **0건**) |

## status 운용 규칙

| status | 원고에서의 취급 |
|---|---|
| `verified` | 법정 요건 문장으로 단정해서 쓸 수 있다 |
| `qualified` | 한정 표현으로만 쓴다. 의무로 단정하지 않는다 |
| `omit` | 원고에서 뺀다 |

**owner 확인이 남아 있는 부분**: 아래 모든 행은 `official-domain-search` 단계까지만 왔다.
실제 위임 판단에 쓰기 전에는 owner가 각 행의 공식 URL을 직접 열어 확인하는 것이 원칙이며,
환경 network policy에서 해당 도메인이 열리면 `primary-page-read`로 승급한다.

---

## 대조 결과

확인일: 2026-08-31

### LA-US-01 · 미국

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 미국 외에 domicile을 둔 출원인·등록권자·TTAB 절차 당사자는 USPTO에 대해 자격을 갖춘 **미국 면허 변호사**의 대리를 받아야 한다 |
| 분류 | `representation-required` |
| 적용 주체 | foreign-domiciled — 개인은 미국·미국령 밖에 영주 거주지가 있는 경우, 법인은 principal place of business가 미국·미국령 밖인 경우 |
| 적용 단계 | 신규 출원 · 진행 중 제출 · 등록 유지 제출 · TTAB 절차 |
| 예외 | domicile 주소 자체는 모든 출원인이 제출해야 하는 별개 요건. PO box·"care of" 주소는 원칙적으로 domicile로 인정되지 않고 street address가 필요 |
| 법적 근거 | 37 CFR §2.11, TMEP §601, Examination Guide 4-19 (Revised), 2019-07-02 Federal Register 최종규칙 |
| 공식 URL | 규칙 설명: `https://www.uspto.gov/trademarks/laws/trademark-rule-requires-foreign-applicants-and-registrants-have-us` · 심사지침: `https://www.uspto.gov/sites/default/files/documents/Exam%20Guide%2004-19.pdf` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 US 행 |
| 검증 메모 | 시행일 2019-08-03. 요구되는 것은 "미국 현지 대리인"이 아니라 **USPTO 앞 실무 자격을 갖춘 미국 면허 변호사**다. domicile과 mailing address는 별개 축 |
| status | `verified` |

### LA-US-02 · 미국 (Madrid §66(a) 경유)

| 항목 | 내용 |
|---|---|
| 정확한 주장 | §66(a) 기반 출원의 foreign-domiciled 출원인도 미국 면허 변호사 요건의 적용을 받되, 실제 선임 필요 시점은 **provisional refusal 등 office action이 나온 때**부터다 |
| 분류 | `stage-conditional` |
| 적용 주체 | Madrid 경유로 미국을 지정한 foreign-domiciled 출원인 |
| 적용 단계 | 국제단계에는 미국 대리인 지정란이 없고, USPTO 거절통지 이후 |
| 예외 | 거절통지 전 단계에서는 선임 요구가 발동하지 않음 |
| 법적 근거 | 15 U.S.C. §1141f, Examination Guide 4-19 (Revised) |
| 공식 URL | `https://www.uspto.gov/ip-policy/international-protection/madrid-protocol/inbound-applicants` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 Madrid 행 + 단계별 예외 문단 |
| 검증 메모 | IB에 내는 국제출원에는 미국(또는 다른 지정국) 대리인을 지정하는 절차가 없다는 것이 시점 차이의 이유 |
| status | `verified` |

### LA-EU-01 · EU

| 항목 | 내용 |
|---|---|
| 정확한 주장 | EEA 내 domicile, principal place of business 또는 real and effective industrial/commercial establishment가 없는 당사자는 EUIPO 절차에서 대리인을 선임해야 한다 |
| 분류 | `representation-required` |
| 적용 주체 | EEA 내 위 세 연결점이 모두 없는 자연인·법인 |
| 적용 단계 | EUIPO 앞 절차 전반 |
| 예외 | **EU 상표 출원 행위(the act of filing) 자체는 제외**. 또한 EEA 밖 법인도 경제적 연결이 있는 다른 법인의 **EEA 소재 피용자**를 통해 행위할 수 있다 |
| 법적 근거 | EUTMR Art. 119, Art. 120 (자격 요건은 Art. 120(2)(c) 포함) |
| 공식 URL | 안내: `https://www.euipo.europa.eu/en/help-centre/tm/faq-representation-before-the-office` · 지침: `https://guidelines.euipo.europa.eu/1922895/1785394/trade-mark-guidelines/3-2-professional-representation` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 EU 행 + 단계별 예외 문단 |
| 검증 메모 | 기준선은 **"EU 밖"이 아니라 EEA**다. 예외 범위도 "출원 절차 전체"가 아니라 **출원 행위 자체**로 좁게 읽어야 한다. professional representative는 EEA 내 사업소가 있어야 하고, 대리가 개방된 회원국에서는 5년 실무 경력 요건이 붙는다 |
| status | `verified` |

### LA-UK-01 · 영국

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 영국 상표 출원·절차에는 **UK·지브롤터·채널제도의 송달주소(address for service)**가 필요하다. 이는 전문대리인 선임 의무와 같은 명제가 아니다 |
| 분류 | `address-for-service` |
| 적용 주체 | 출원인·권리자 일반 |
| 적용 단계 | 출원 및 IPO 앞 절차 |
| 예외 | 송달주소는 자택·사업장 등 본인과 연관된 주소도 가능하고, 서류가 실제로 도달·수신되는 유효 주소라면 가상 오피스·사서함도 가능. **Isle of Man도 유효 주소로 인정**된다 |
| 법적 근거 | UK IPO address for service 요건 (Trade Marks Act 1994 s.66 관련 directions 포함) |
| 공식 URL | `https://www.gov.uk/guidance/address-for-service-for-intellectual-property-rights` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 UK 행 |
| 검증 메모 | **이 행을 `representation-required`로 쓰면 안 된다.** 대리인을 선임하는 경우 그 대리인이 UK·지브롤터·채널제도 주소를 가져야 한다는 것이 요건의 형태다. 기존 권리와 신규 절차 사이 적용 차이는 owner의 원문 확인 대상으로 남긴다 |
| status | `verified` |

### LA-CN-01 · 중국

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 중국 내 상거소 또는 영업소가 없는 외국인·외국기업이 중국에서 상표 등록을 출원하거나 그 밖의 상표 사무를 처리할 때에는 법에 따라 자격을 갖춘 상표대리기구에 위임해야 한다 |
| 분류 | `representation-required` |
| 적용 주체 | 중국 내 habitual residence 또는 business establishment가 없는 외국인·외국기업 |
| 적용 단계 | 출원 및 그 밖의 상표 사무 |
| 예외 | 중국 내 상거소가 있는 외국인은 상표등록홀 또는 온라인 출원시스템에서 직접 출원 가능. 다만 **법에 따라 설립된 외국기업의 중국 내 완전자회사는 중국기업**이고, 외국회사가 설립한 중국 내 사무소·대표처는 그 외국회사의 중국 내 영업소로 보지 않는다 |
| 법적 근거 | 중화인민공화국 상표법 제18조 |
| 공식 URL | `https://english.cnipa.gov.cn/art/2026/3/17/art_2996_205374.html` · 법령 원문: `https://www.wipo.int/wipolex/en/legislation/details/15011` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 CN 행 |
| 검증 메모 | CNIPA 영문 안내 기준. 자회사/대표처 구분이 실무에서 가장 자주 틀리는 지점이라 원고에 함께 적는다. 중문 법문과 영문 안내의 표현 차이는 owner 원문 확인 대상 |
| status | `verified` |

### LA-JP-01 · 일본

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 일본에 주소·거소(법인은 영업소)가 없는 재외자는 일본에 주소·거소를 둔 상표관리인을 통해서만 절차를 밟을 수 있다 |
| 분류 | `representation-required` |
| 적용 주체 | 재외자 — 일본에 주소·거소가 없는 자, 법인은 일본에 영업소가 없는 경우 |
| 적용 단계 | 절차 및 행정처분 불복 |
| 예외 | 재외자가 상표관리인의 대리권 범위를 제한한 경우에는 그 범위에 따른다 |
| 법적 근거 | 특허법 제8조, 상표법에 의한 준용 |
| 공식 URL | `https://www.jpo.go.jp/e/system/professionals/step-by-step-trademark.html` · 법령 영문: `https://www.japaneselawtranslation.go.jp/en/laws/view/4808` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 JP 행 |
| 검증 메모 | 상표법이 특허법 제8조를 **준용**하는 구조이므로 근거를 상표법 단독으로 적지 않는다. 국제상표등록출원의 특칙 여부는 owner 원문 확인 대상으로 남긴다 |
| status | `qualified` — 본체 요건은 확인됐으나 국제출원 특칙을 확인하지 못해 원고에서 "국제출원 경로는 별도 확인"으로 한정한다 |

### LA-MX-01 · 멕시코 (송달주소)

| 항목 | 내용 |
|---|---|
| 정확한 주장 | IMPI 출원에는 **멕시코 국내에 통지를 받을 주소(domicilio para oír y recibir notificaciones)**와 이메일 주소를 기재해야 한다 |
| 분류 | `address-for-service` |
| 적용 주체 | 출원인 일반 |
| 적용 단계 | 출원 및 IMPI 앞 절차 |
| 예외 | 주소·이메일 변경은 IMPI에 통지해야 하며, 통지하지 않으면 기록상 주소로 한 송달이 유효한 것으로 본다 |
| 법적 근거 | Ley Federal de Protección a la Propiedad Industrial |
| 공식 URL | 법령: `https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPPI.pdf` · 절차 안내: `https://www.gob.mx/impi/documentos/registro-de-marcas` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 MX 행 |
| 검증 메모 | 이 행은 **주소 요건**이지 대리 의무가 아니다 |
| status | `verified` |

### LA-MX-02 · 멕시코 (대리)

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 멕시코의 전문대리인 선임이 **법정 의무인지 여부**는 이번 대조에서 공식 근거로 확인하지 못했다 |
| 분류 | `optional-but-recommended` |
| 적용 주체 | — |
| 적용 단계 | — |
| 예외 | — |
| 법적 근거 | 확인 못 함 |
| 공식 URL | — |
| 확인 방법 | `official-domain-search` (결과 불충분) |
| 원고 반영 위치 | 관할·경로별 지도 MX 행의 대리 열 — 의무로 쓰지 않고 주소 요건과 분리해 서술 |
| 검증 메모 | 검색 결과는 통지용 국내 주소 요건과 apoderado/mandatario 변경 절차 서식까지만 확인됐고, **대리 선임 자체를 의무화하는 근거는 확인되지 않았다.** `domicilio` 요건과 대리 의무를 같은 명제로 합치지 않는다 |
| status | `qualified` |

### LA-MAD-01 · Madrid (경로)

| 항목 | 내용 |
|---|---|
| 정확한 주장 | 국제단계의 대표자 선임은 선택이며, provisional refusal 통지는 그 절차에서 **현지 대리인이 필요한지 여부**를 함께 알려준다 |
| 분류 | `stage-conditional` |
| 적용 주체 | 국제출원인·국제등록명의인 |
| 적용 단계 | ① WIPO 국제단계 ② 본국관청 국내 규칙 ③ 지정관청 거절 대응 단계 |
| 예외 | 현지 대리인 필요 여부는 자동으로 정해지지 않고 **지정국 규칙**에 따른다 |
| 법적 근거 | Madrid Protocol 및 Common Regulations, WIPO 안내 |
| 공식 URL | `https://www.wipo.int/en/web/madrid-system/faq` · `https://www.wipo.int/en/web/madrid-system/members/provisional-refusal-time-limits-to-respond` |
| 확인 방법 | `official-domain-search` |
| 원고 반영 위치 | 관할·경로별 지도 Madrid 행 — 표 머리글을 `관할/경로`로 두고 관할과 구분해 표기 |
| 검증 메모 | Madrid는 관할이 아니라 **경로**다. 국제단계 선택 사항이라는 사실이 지정국 거절 대응 단계의 현지 자격 요건까지 면제하지 않는다 (미국 §66(a) 사례가 LA-US-02) |
| status | `verified` |

---

## 원고에 반영하지 않은 것

- 특정 로펌·대리인·상표대리기구의 실명, 순위, 추천
- 관할별 대리인 보수 수준과 그 비교
- `qualified` 행을 법정 의무로 단정하는 문장
