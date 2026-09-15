# 단일 소스 HIGH risk claim — 분류와 조문 큐

작성: 2026-09-15 (18라운드) · 대상: `riskLevel: "HIGH"`이고 `sourceIds`가 1개인 claim **26건**

`audit:facts`가 매 회차 `INFO [facts] 단일 소스 HIGH claim …`으로 이 목록을 출력한다. 이 문서는 그 목록이
**무엇을 뜻하는지**를 적는다. 게이트가 아니다 — 왜 게이트가 아닌지는 §4.

## 0. 왜 세는가

2026-09-13과 09-14에 같은 결함이 두 번 났다. `EU-FEE-001`은 `euipo-fees`(200으로 404 페이지)에,
`EU-PRIO-001`은 `euipo-priority-guidelines`(200이지만 본문 2,268바이트 JS 셸)에 기대고 있었고, 두 claim의
실제 결론은 EUTMR 조문에서 났다. 17라운드가 register의 대체 행을 계약으로 올려 **기록된 대체가 반영됐는지**는
막았지만(`claim-source-register.test.ts`), 애초에 **근거가 하나뿐인 자리**는 그대로 남는다.

소스가 하나면 그 하나가 사라지거나 비는 순간 근거가 0이 된다. HIGH risk claim 49건 중 **26건**이 그 자리다.

| 워크스페이스 | HIGH | 단일 소스 | 비중 |
|---|---:|---:|---:|
| JapTm | 8 | 7 | 88% |
| UKTm | 7 | 5 | 71% |
| EuTm | 9 | 6 | 67% |
| LatTm | 5 | 3 | 60% |
| UsaTm | 10 | 4 | 40% |
| ChaTm | 6 | 1 | 17% |
| MexTm | 4 | 0 | 0% |
| **합계** | **49** | **26** | **53%** |

## 1. A류 — 단일 소스가 정확하다 (5건 · 손대지 않는다)

조문·판결·공식 등록부 **자체**를 근거로 삼은 claim이다. 두 번째 소스를 붙이면 근거가 안내면 쪽으로
**내려간다**.

| claim | 소스 | 왜 하나가 맞는가 |
|---|---|---|
| `EU-DL-001` | `eutmr-consolidated` | EUTMR 제46조 제1항 축자. register가 `euipo-after-applying-guidance`를 **이 조문으로 대체**했다(대체 행) |
| `EU-EVD-001` | `eutmr-consolidated` | 제58조 제1항(a)·제2항 축자. `euipo-cancellation-guidance`·`euipo-genuine-use-materials` 대체 결과 |
| `EU-RNW-001` | `eutmr-consolidated` | 제52조·제53조 제3항·Annex I item 19 축자. `euipo-fees-payments-guidance`·`euipo-renewal-guidance` 대체 결과 |
| `USA-PARODY-001` | `scotus-jack-daniels-v-vip-2023` | 판결문 자체. notes가 판시를 축자 인용 |
| `LA-MADRID-001` | `wipo-madrid-members` | 회원국 사실의 **등록부 자체**. 2026-09-12 재대조에서 8개국 대조 완료 |

> EuTm 세 건에 EUIPO 안내면을 다시 붙이는 것은 2026-08-30 폐기 결정을 되돌리는 일이다. 이 셋은
> **의도된 단일 소스**이며, 이 목록에 계속 뜨더라도 조치 대상이 아니다.

## 2. B류 — 회차가 조문을 이미 특정했는데 register에 없다 (6건 · 실행 가능한 큐)

**여기 적힌 조문은 내 추정이 아니라 claim의 `notes`가 스스로 적어 둔 것**이다. 이전 회차가 1차 출처를
읽고 "값의 근거는 이 조문"이라고 기록했는데, 그 조문이 register에 등록되지 않아 `sourceIds`가 안내면에
머물러 있다. **`EU-PRIO-001`과 정확히 같은 모양**이다.

| claim | 현재 소스 | notes가 적은 실제 근거 | 상태 |
|---|---|---|---|
| `CN-EVD-001` | `cnipa-nonuse-cancellation-guide-2023` | **商标法实施条例 제66조** (notes: "2개월 사용증거 window는 …실시조례 근거로, 법률 본문이 아님") | 실시조례가 register에 **없음**. `cnipa-trademark-law`(법)는 있으나 이 값의 근거가 아니다 |
| `UK-RENEW-001` | `ukipo-renew` | **TMA 1994 §40(3)** (notes: 갱신 10년 기산이 등록완료일이 아니라 출원일인 근거) | TMA 1994가 register에 없음 |
| `JP-REP-001` | `jpo-step-by-step` | **特許法 제8조** (notes가 JPO 원문을 축자 인용: `must be appointed as a "Patent Administrator" (Article 8, Patent Act)`) | 特許法이 register에 없음(商標法·関税法·不競法만 있다) |
| `JP-MADRID-REFUSAL-001` | `jpo-madrid-faq` | **特許法 제8조** + 통지 발송일 기산 3개월 | 동일 |
| `EU-ENF-001` | `ec-customs-defend-your-rights` | **Regulation (EU) No 608/2013** (notes: "여전히 유효 기준") | 608/2013이 register에 없음 |
| `LA-CL-NONUSE-001` | `inapi-chile-ley-21355` | **Ley 21.355** | 등록 소스가 법이 아니라 **INAPI 뉴스 기사**이고, 원 URL은 이미 404가 나 교체된 이력이 있다 |

### 가장 급한 것 — `CN-EVD-001`

이 claim의 notes가 두 가지를 함께 적는다: ① 2개월 창의 근거는 **실시조례** 제66조이고, ② **"실시조례는
개정법 시행 전 개정 예상 → 개정본 공표 시 재확인"**. 값이 움직일 수 있다고 스스로 적어 둔 자리인데,
그 움직임이 일어날 문서가 register에 아예 없다. 2027-01-01 개정 상표법 시행 전에 닫아야 한다.

## 3. C류 — 조문 앵커가 아직 특정되지 않았다 (15건)

안내면 하나에 기대고 있고, 어느 조문이 그 값을 규율하는지를 **회차가 기록한 적이 없다**. 그래서 B류처럼
"등록만 하면 되는" 상태가 아니라, 먼저 조문을 정하는 일부터 필요하다.

아래 `조문 후보`는 **내가 제안하는 출발점이고 1차 출처로 확인하지 않았다.** 그대로 claim에 붙이면 안 되고,
여는 회차가 조문을 읽어 확인한 뒤에만 register와 `sourceIds`에 들어간다. (열어본 적 없는 URL을 근거처럼
붙이지 않는다 — source register의 금지선.)

| claim | 현재 소스 | 조문 후보 (미확인) | 앵커 법령이 register에 있나 |
|---|---|---|---|
| `JP-FIRST-001` | `jpo-faq-trademark` | 商標法 선출원 조항 | **있음** (`jpn-trademark-act`) |
| `JP-TERM-001` | `jpo-outline` | 商標法 존속기간·갱신 조항 | **있음** |
| `JP-OPP-001` | `jpo-faq-trademark` | 商標法 등록이의 조항 | **있음** |
| `JP-CUSTOMS-001` | `japan-customs-rightholders` | 関税法 수입차단신청 조항 | **있음** (`jpn-customs-act`) |
| `JP-IPHC-001` | `ip-high-court-jurisdiction` | 知的財産高等裁判所設置法 관할 조항 | 없음 |
| `UK-COOL-001` | `ukipo-fast-track-opposition` | Trade Marks Rules 2008 (cooling-off) | 없음 |
| `UK-NONUSE-001` | `ukipo-revocation-nonuse` | TMA 1994 (revocation) | 없음 |
| `UK-BREXIT-001` | `ukipo-eutm-comparable` | TMA 1994 Sch 2A (comparable marks) | 없음 |
| `UK-COMPARABLE-001` | `ukipo-eutm-comparable` | TMA 1994 Sch 2A | 없음 |
| `EU-UKCOMP-001` | `govuk-comparable-uk-marks` | TMA 1994 Sch 2A (같은 축, EuTm 쪽) | 없음 |
| `EU-UKUSE-001` | `govuk-comparable-uk-marks` | TMA 1994 Sch 2A 사용 산입 경과규정 | 없음 |
| `USA-TTAB-001` | `uspto-about-ttab` | 15 U.S.C. (TTAB 권한) | 부분 (§1063·1064·1065 등록, 해당 조는 미등록) |
| `USA-ATY-001` | `uspto-need-attorney` | 37 C.F.R. (외국 주소 출원인 대리 요건) | 부분 (§2.101–2.102만) |
| `USA-CBP-001` | `cbp-ipr-protection` | 19 C.F.R. Part 133 (recordation) | 부분 (§133.21·22·25만) |
| `LA-AR-USE-001` | `inpi-argentina-ddjj-medio-termino` | 아르헨티나 상표법 + INPI 결의 | 없음 |

### JapTm이 유독 높은 이유

7건 중 5건이 여기 있는데, **앵커 법령 넷(商標法·商標法 영문본·関税法·不競法)은 이미 register에 등록돼 있다.**
어느 회차도 claim을 그것에 연결하지 않았을 뿐이다. 채널이 열리는 회차가 조문만 확인하면 넷은 바로 닫힌다 —
26건 중 **비용 대비 회수가 가장 큰 구간**이다.

## 4. 왜 게이트가 아닌가

§1이 이유다. 단일 소스는 결함의 **징후**이지 결함 자체가 아니다. 조문을 근거로 삼은 claim은 소스가 하나인
것이 정확하고, 그걸 실패로 만들면 **숫자를 채우려고 안내면을 덧붙이는 압력**이 생긴다. 그건 이 저장소가
`audit:facts`의 "sourceId 개수만 센다"는 빈틈을 메우려다 만든 register 계약을, 다시 개수 세기로 되돌리는 일이다.

게이트로 올릴 수 있는 형태가 있다면 "개수 ≥ 2"가 아니라 **"HIGH claim은 1차 법령·판결·공식 등록부를
최소 하나 참조한다"**이고, 그러려면 register가 어떤 소스가 1차인지를 선언해야 한다. 그 선언을 도입할지는
staleness 하드 게이트와 같은 정책 결정이라 owner 몫으로 둔다.

## 5. 이번 회차가 하지 않은 것

**`sourceIds`를 하나도 늘리지 않았다.** 18라운드 시작 실측에서 조문 출처 전건이 `CONNECT tunnel failed, 403`
(정책 거부)이었다 — `laws.e-gov.go.jp` · `japaneselawtranslation.go.jp` · `legislation.gov.uk` · `ecfr.gov` ·
`publications.europa.eu` · `sbj.cnipa.gov.cn`. 열지 않은 조문을 근거로 적으면 추적 가능성의 외형만 생긴다.

채널이 열리는 회차의 실행 순서는 **B류 6건 → C류 중 앵커가 이미 등록된 JapTm 4건 → 나머지**다. B류는
조문이 이미 특정돼 있어 확인만 하면 되고, JapTm 4건은 register 등록까지 끝나 있다.
