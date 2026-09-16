# 단일 소스 HIGH risk claim — 분류와 조문 큐

작성: 2026-09-15 (18라운드) · 갱신: 2026-09-17 (19라운드 — 조문 채널이 열려 큐 10건을 닫았다, §5)
대상: `riskLevel: "HIGH"`이고 `sourceIds`가 1개인 claim **26건 → 16건**

`audit:facts`가 매 회차 `INFO [facts] 단일 소스 HIGH claim …`으로 이 목록을 출력한다. 이 문서는 그 목록이
**무엇을 뜻하는지**를 적는다. 게이트가 아니다 — 왜 게이트가 아닌지는 §4.

## 0. 왜 세는가

2026-09-13과 09-14에 같은 결함이 두 번 났다. `EU-FEE-001`은 `euipo-fees`(200으로 404 페이지)에,
`EU-PRIO-001`은 `euipo-priority-guidelines`(200이지만 본문 2,268바이트 JS 셸)에 기대고 있었고, 두 claim의
실제 결론은 EUTMR 조문에서 났다. 17라운드가 register의 대체 행을 계약으로 올려 **기록된 대체가 반영됐는지**는
막았지만(`claim-source-register.test.ts`), 애초에 **근거가 하나뿐인 자리**는 그대로 남는다.

소스가 하나면 그 하나가 사라지거나 비는 순간 근거가 0이 된다. HIGH risk claim 49건 중 **26건**이 그 자리였고,
19라운드가 10건을 닫아 **16건**이 남았다. 남은 16건은 A류 5건(의도된 단일 소스)과 C류 11건이다.

| 워크스페이스 | HIGH | 단일 소스 (09-15) | 단일 소스 (09-17) | 비중 |
|---|---:|---:|---:|---:|
| JapTm | 8 | 7 | 1 | 12% |
| UKTm | 7 | 5 | 4 | 57% |
| EuTm | 9 | 6 | 5 | 56% |
| LatTm | 5 | 3 | 2 | 40% |
| UsaTm | 10 | 4 | 4 | 40% |
| ChaTm | 6 | 1 | 0 | 0% |
| MexTm | 4 | 0 | 0 | 0% |
| **합계** | **49** | **26** | **16** | **33%** |

09-17 열이 줄어든 자리는 전부 **1차 법령을 붙여서** 줄었다. 안내면을 하나 더 얹어 개수를 채운 자리는 없다 — §4가 경계하는 게 그것이다.

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

## 2. B류 — 회차가 조문을 이미 특정했는데 register에 없다 (6건 · **2026-09-17 전건 닫음**)

**여기 적힌 조문은 내 추정이 아니라 claim의 `notes`가 스스로 적어 둔 것**이다. 이전 회차가 1차 출처를
읽고 "값의 근거는 이 조문"이라고 기록했는데, 그 조문이 register에 등록되지 않아 `sourceIds`가 안내면에
머물러 있다. **`EU-PRIO-001`과 정확히 같은 모양**이다.

| claim | 현재 소스 | notes가 적은 실제 근거 | 상태 |
|---|---|---|---|
| `CN-EVD-001` | `cnipa-nonuse-cancellation-guide-2023` | **商标法实施条例 제66조** (notes: "2개월 사용증거 window는 …실시조례 근거로, 법률 본문이 아님") | **닫힘(09-17)** — 국가행정법규고 정본으로 제66조 축자 확인, `cn-trademark-law-implementing-regulations`(+ `-article-66`) 신설 |
| `UK-RENEW-001` | `ukipo-renew` | **TMA 1994 §40(3)** (notes: 갱신 10년 기산이 등록완료일이 아니라 출원일인 근거) | **닫힘(09-17)** — §40(3)·§42 축자 확인, `uk-tma-1994`(+ `-section-40`·`-section-42`) 신설 |
| `JP-REP-001` | `jpo-step-by-step` | **特許法 제8조** (notes가 JPO 원문을 축자 인용: `must be appointed as a "Patent Administrator" (Article 8, Patent Act)`) | **닫힘(09-17)** — e-Gov 정본으로 제8조 확인, `jpn-patent-act`(+ 영문 `-en`) 신설 |
| `JP-MADRID-REFUSAL-001` | `jpo-madrid-faq` | **特許法 제8조** + 통지 발송일 기산 3개월 | **닫힘(09-17)** — 제8조만 연결. 3개월은 조문이 아니라 통지 기재라 이번에 확정하지 않았다 |
| `EU-ENF-001` | `ec-customs-defend-your-rights` | **Regulation (EU) No 608/2013** (notes: "여전히 유효 기준") | **닫힘(09-17)** — EUR-Lex 본문에서 제2조 제10호·제11호 확인(`In force`), `eu-reg-608-2013` 신설 |
| `LA-CL-NONUSE-001` | `inapi-chile-ley-21355` | **Ley 21.355** | **닫힘(09-17)** — BCN Ley Chile 정본에서 제27조의2 A 신설 조항 확인, `cl-ley-21355` 신설 |

### 가장 급한 것 — `CN-EVD-001`

이 claim의 notes가 두 가지를 함께 적는다: ① 2개월 창의 근거는 **실시조례** 제66조이고, ② **"실시조례는
개정법 시행 전 개정 예상 → 개정본 공표 시 재확인"**. 값이 움직일 수 있다고 스스로 적어 둔 자리인데,
그 움직임이 일어날 문서가 register에 아예 없었다. 2027-01-01 개정 상표법 시행 전에 닫아야 하는 유일한 시한 항목이었다.

**2026-09-17 닫음.** 제66조 제1항을 축자 확인했다 — 「商标局受理后应当通知商标注册人，限其自收到通知之日起2个月内提交该商标在
撤销申请提出前使用的证据材料或者说明不使用的正当理由」. 2개월이 법률이 아니라 실시조례에서 나온다는 기존 기록이 1차 출처로
고정됐다. 정본은 CNIPA가 아니라 **국가행정법규고**(국무원 행정법규 데이터베이스)에 두었다 — 실시조례는 행정법규이고, 그 페이지가
`历史沿革`으로 2002년본·2014년본을 함께 노출하므로 **예고된 개정본이 같은 URL의 연혁에 새 판으로 뜬다.** notes가 적어 둔
"개정본 공표 시 재확인"이 이제 볼 곳을 가진다.

## 3. C류 — 조문 앵커가 아직 특정되지 않았다 (15건 → **11건**, JapTm 4건 09-17 닫음)

안내면 하나에 기대고 있고, 어느 조문이 그 값을 규율하는지를 **회차가 기록한 적이 없다**. 그래서 B류처럼
"등록만 하면 되는" 상태가 아니라, 먼저 조문을 정하는 일부터 필요하다.

아래 `조문 후보`는 **내가 제안하는 출발점이고 1차 출처로 확인하지 않았다.** 그대로 claim에 붙이면 안 되고,
여는 회차가 조문을 읽어 확인한 뒤에만 register와 `sourceIds`에 들어간다. (열어본 적 없는 URL을 근거처럼
붙이지 않는다 — source register의 금지선.)

| claim | 현재 소스 | 조문 후보 (미확인) | 앵커 법령이 register에 있나 |
|---|---|---|---|
| ~~`JP-FIRST-001`~~ | `jpo-faq-trademark` | 商標法 **제8조 제1항** | **닫힘(09-17)** — 축자 확인 후 `jpn-trademark-act` 연결 |
| ~~`JP-TERM-001`~~ | `jpo-outline` | 商標法 **제19조 제1항·제2항** | **닫힘(09-17)** — 축자 확인 후 `jpn-trademark-act` 연결 |
| ~~`JP-OPP-001`~~ | `jpo-faq-trademark` | 商標法 **제43조의2** | **닫힘(09-17)** — 축자 확인 후 `jpn-trademark-act` 연결 |
| ~~`JP-CUSTOMS-001`~~ | `japan-customs-rightholders` | 関税法 **제69조의13·제69조의4** | **닫힘(09-17)** — 축자 확인. `jpn-customs-act`를 영문 번역본에서 e-Gov 정본으로 교체 |
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

### JapTm이 유독 높았던 이유 — 그리고 09-17에 무엇이 남았나

7건 중 5건이 여기 있었는데, **앵커 법령 넷(商標法·商標法 영문본·関税法·不競法)은 이미 register에 등록돼 있었다.**
어느 회차도 claim을 그것에 연결하지 않았을 뿐이었다. 18라운드가 "채널이 열리는 회차가 조문만 확인하면 넷은 바로
닫힌다 — 비용 대비 회수가 가장 큰 구간"이라고 적었고, 09-17에 실제로 그렇게 닫혔다. JapTm 단일 소스는 **7건 → 1건**이 됐다.

남은 하나는 `JP-IPHC-001`이다. 앵커 법령(知的財産高等裁判所設置法)이 register에 없어 C류 나머지와 같은 조건이다.
`関税法`은 등록돼 있었지만 **영문 번역본**이었다 — 2026-08-15 라운드가 商標法·不競法에서 걷어낸 것과 같은 모양이라
이번에 일본어 정본으로 옮기고 번역본은 `-en` 보조 행으로 분리했다.

## 4. 왜 게이트가 아닌가

§1이 이유다. 단일 소스는 결함의 **징후**이지 결함 자체가 아니다. 조문을 근거로 삼은 claim은 소스가 하나인
것이 정확하고, 그걸 실패로 만들면 **숫자를 채우려고 안내면을 덧붙이는 압력**이 생긴다. 그건 이 저장소가
`audit:facts`의 "sourceId 개수만 센다"는 빈틈을 메우려다 만든 register 계약을, 다시 개수 세기로 되돌리는 일이다.

게이트로 올릴 수 있는 형태가 있다면 "개수 ≥ 2"가 아니라 **"HIGH claim은 1차 법령·판결·공식 등록부를
최소 하나 참조한다"**이고, 그러려면 register가 어떤 소스가 1차인지를 선언해야 한다. 그 선언을 도입할지는
staleness 하드 게이트와 같은 정책 결정이라 owner 몫으로 둔다.

## 5. 채널 실측 — 18라운드가 못 한 것, 19라운드가 연 것

**18라운드(09-15)는 `sourceIds`를 하나도 늘리지 못했다.** 회차 시작 실측에서 조문 출처 전건이
`CONNECT tunnel failed, 403`(정책 거부)이었다 — `laws.e-gov.go.jp` · `japaneselawtranslation.go.jp` ·
`legislation.gov.uk` · `ecfr.gov` · `publications.europa.eu` · `sbj.cnipa.gov.cn`. 열지 않은 조문을 근거로
적으면 추적 가능성의 외형만 생기므로, 그 회차는 큐를 적어 두는 데서 멈췄다.

**19라운드(09-17)는 브라우저 채널로 열었다.** 403은 사이트가 아니라 채널의 문제라는 2026-08-15 결론이 다시
확인됐다 — ChaTm register가 `sbj.cnipa.gov.cn`에 대해 "curl에 403이지만 인앱 브라우저로는 본문 전체가 열린다"고
적어 둔 것과 같은 모양이다. 이번 회차가 실제로 연 것은 다음 여섯 호스트다.

| 호스트 | 무엇을 열었나 | 결과 |
|---|---|---|
| `legislation.gov.uk` | TMA 1994 §40·§42 | 본문 개방 |
| `laws.e-gov.go.jp` | 特許法·商標法·関税法 정본 | 본문 개방(현행 시행본 RevisionID까지 표시) |
| `japaneselawtranslation.go.jp` | Patent Act·Customs Act 영문본 | 본문 개방 |
| `eur-lex.europa.eu` | Regulation (EU) No 608/2013 | 본문 개방(상태 `In force`) |
| `xzfg.moj.gov.cn` | 商标法实施条例 | 본문 개방(`历史沿革` 포함) |
| `bcn.cl` | 칠레 법률 제21.355호 | 본문 개방 |

`ecfr.gov` · `publications.europa.eu` · `sbj.cnipa.gov.cn` 셋은 **이번 큐에 필요하지 않아 열지 않았다** —
이번 실측에서 닫혀 있었다는 뜻이 아니다. CN 실시조례는 `sbj.cnipa.gov.cn` 대신 정본이 있는 국가행정법규고로,
EU 규정은 `publications.europa.eu` CELEX 경로 대신 EUR-Lex 본문으로 갔다. `ecfr.gov`는 C류 US 3건이
남아 있어 다음 회차의 첫 실측 대상이다.

18라운드가 적어 둔 실행 순서(**B류 6건 → 앵커가 이미 등록된 JapTm 4건 → 나머지**)를 그대로 따랐고, 앞의 둘까지
닫았다. 세 번째 구간은 열지 않았다.

### 교차 레인 메모 — PR #180이 적어 둔 것

PR #180(다른 레인)이 같은 날 이 문서에 **"이 큐는 진행 중이고 결과가 아직 저장소에 없다"**를 적었다. 맞는
기록이었다 — 이 회차의 변경은 로컬 브랜치 `claude/statute-anchors-b-queue`에 커밋돼 있었고 그 세션의 git
프록시 인증 저장소 목록에 이 저장소가 없어 푸시되지 않았다. **이 커밋이 그 상태를 닫는다.**

두 가지는 규칙으로 남긴다.

1. **레인이 겹칠 수 있다.** 같은 큐를 두 세션이 동시에 열면 중복 작업이 된다. 이 큐를 다시 여는 회차는
   먼저 아래를 본다.

   ```bash
   git fetch origin && git ls-remote --heads origin 'claude/statute-anchors*'
   ```

2. **채널은 레인마다 다르다.** 에이전트 컨테이너 채널은 09-15·09-16 이틀 연속 조문 호스트 전건 403이었고
   (`briefs-discovery.md`의 `채널은 상수가 아니다`), 같은 시각 브라우저 채널에서는 여섯 호스트가 다 열렸다.
   한 레인의 403을 "닫혀 있다"로 옮겨 적지 않는다.

> **날짜 기준 주의.** #180 메모의 `2026-09-16`과 이 절의 `09-17`은 **같은 날**이다. 그 레인은 컨테이너
> UTC를, 이 문서와 저장소 git log는 KST를 쓴다. 두 표기가 같은 회차를 가리킨다.

## 6. 남은 것

- **C류 11건.** 조문 후보는 §3 표에 있지만 **전부 미확인**이다. 그대로 붙이면 안 되고, 여는 회차가 조문을 읽어
  확인한 뒤에만 register와 `sourceIds`에 들어간다. 다음 구간은 앵커 법령이 register에 **없는** 쪽이라
  B류·JapTm보다 건당 비용이 크다 — UK 4건(TMA 1994 · Trade Marks Rules 2008)과 US 3건(`ecfr.gov`)이
  각각 앵커 법령 하나를 신설하면 묶어서 닫히는 모양이다.
- **A류 5건은 그대로 둔다.** §1이 이유다. 이 목록에 계속 뜨더라도 조치 대상이 아니다.
- **정책 판단 2건(owner 몫).** staleness 하드 게이트 전환, 그리고 §4가 적은 "HIGH claim은 1차 법령·판결·공식
  등록부를 최소 하나 참조한다"를 게이트로 올릴지. 19라운드가 단일 소스를 26건에서 16건으로 줄이면서 그 게이트의
  **현재 미충족 건수가 실제로 얼마인지**가 처음 눈에 보이게 됐다 — 결정을 미룰 이유가 하나 줄었다.
