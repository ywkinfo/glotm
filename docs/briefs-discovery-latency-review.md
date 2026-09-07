# 브리프 발굴 지연 진단 — 멕시코 LFPPI 시행규칙 (2026-09-07)

> 상태: **진단 확정(저장소 기록 기반) / 개선안은 owner 판단 대기.**
> 이 문서는 계약이 아니다. 발굴 계약 정본은 [`briefs-discovery.md`](briefs-discovery.md), 발행 계약 정본은
> [`briefs-lane.md`](briefs-lane.md)이며, 이 문서는 그 두 계약의 **결함 보고서**다. 값·임계·규칙을 새로 잠그지 않는다.
> 데이터 정본은 계속 [`../src/briefs/discovery.ts`](../src/briefs/discovery.ts)이고, 여기 인용한 수치는 전부
> `npm run briefs:radar`(2026-09-07 실행)와 저장소 기록에서 읽었다.

## 0. 한 줄 결론

소스 목록이 부족해서 놓친 것이 아니다. **하네스가 이 사건을 "값이 바뀌었나"로만 물었기 때문에** 놓쳤다.
수수료·기한 같은 값은 실제로 바뀌지 않았고(2026-08-30 재대조가 그것을 정확히 확인했다), 바뀐 것은
그 값을 규율하는 **규범 층**이었다. 하네스에는 규범 층을 세는 축이 없고, 그 층의 변화를 발견해도
발굴 큐로 옮길 자리가 없다.

## 1. 타임라인 (저장소 기록 기준)

| 날짜 | 사건 | 저장소에 남은 흔적 |
|---|---|---|
| 2026-04-03 | LFPPI **법률** 개정 공포 | `MexTm/content/research/claim-map.json`·`mx_tm_fact_verification_log.md`의 `MX-DL-001`·`MX-ENF-001` notes. **후보로는 등록되지 않음** |
| 2026-04-28 | **시행규칙** 연방관보(DOF) 공포 | 없음 |
| 2026-07-22 | 시행규칙 발효 (공포 후 60 영업일) | 없음 |
| 2026-08-03 | brief discovery 하네스 도입 (`briefDiscoveryStartOn`) | `repository-backfill` 회차 1건 — 소스 7개. **`impi` 미포함** |
| 2026-08-08 | `verified` sweep | `kipo` 1개 소스 |
| 2026-08-25 | claim 변경신호 triage (WebSearch) | taskboard: "ⓒ `mexico` — **변경 신호 없음**" |
| 2026-08-30 | `verified` sweep + MexTm claim 4건 1차출처 재대조 | sweep 소스 5개(`kipo`·`wipo-madrid`·`jpo`·`cnipa` 2). MexTm claim 4건 **전건 값 변경 없음**, `lastVerified` 2026-08-30으로 갱신 |
| 2026-09-07 | WebSearch triage로 발굴 → 20호 발행 | `2026-09-mexico-lfppi-regulations-in-force` |

## 2. 지연 구간 분해 — 하네스 책임은 132일이 아니라 35일

공포일 기준 132일, 발효일 기준 47일이 지나 발행됐다. 다만 그 전부를 하네스 탓으로 적으면 진단이 과장된다.

| 구간 | 길이 | 책임 |
|---|---|---|
| 2026-04-28 → 2026-08-03 | 97일 | **하네스 부재.** 발굴 lane 자체가 없던 기간이다. 이 구간은 하네스 결함이 아니라 하네스 도입 이전 상태다 |
| 2026-08-03 → 2026-09-07 | **35일** | **하네스 책임 구간.** 이 안에 멕시코를 직접 들여다본 회차가 **두 번**(8/25 triage, 8/30 재대조) 있었고 둘 다 "변경 없음"으로 닫혔다 |

즉 물어야 할 질문은 "왜 4월에 못 봤나"가 아니라 **"8월 25일과 8월 30일에 멕시코를 보고도 왜 못 봤나"**다.
아래 3절이 그 질문에만 답한다.

## 3. 놓친 지점 — 증거 4건

### 3.1 재대조가 답을 손에 쥐고도 큐로 넘기지 못했다 (최대 지점)

2026-08-30 재대조는 `MX-ENF-001`에 이렇게 적었다.

> **주의:** WIPO Lex 게재본은 2020년 원문이라 2026-04-03 LFPPI 개정 반영본이 아니다 — 집행 조항에 개정이
> 닿았는지는 **별도 확인 대상**.
> — `MexTm/content/research/mx_tm_fact_verification_log.md`

이 문장은 정확했다. 그리고 이 문장이 가리킨 곳에 실제로 답이 있었다 — 그 시점에 시행규칙은 이미 39일째
발효 중이었다. 그런데 `별도 확인 대상`은 **claim-map JSON의 `notes` 산문**이다. 타입도, id도, 큐도,
radar 표면도, 테스트도 없다. 발굴 lane(`discovery.ts`)은 워크스페이스 claim-map을 읽지 않는다.

**결함은 "미결을 못 봤다"가 아니라 "미결을 적을 자리는 있는데 옮길 통로가 없다"이다.**
`MexTm 제6장`의 office action 답변기한 보류(`MX-DL-001`)도 같은 자리에 같은 형태로 몇 달째 남아 있다.

### 3.2 freshness는 반대 방향으로 움직였다

같은 회차가 `MX-FEE-001`·`MX-DL-001`·`MX-NORM-001`·`MX-ENF-001` 4건의 `lastVerified`를 2026-08-30으로
갱신했고 `audit:facts`는 `staleHighRisk=0`을 냈다. **근거로 삼은 규범이 현행이 아니라고 자기가 적어 둔
회차에서 freshness 점수가 올라갔다.**

이 blind spot은 이미 한 번 관측된 것이다. `MexTm/content/research/mx_tm_source_register.md`가 직접 적어 뒀다.

> `npm run audit:facts`는 HIGH risk claim에 sourceId가 **몇 개 있는지**만 센다. 그래서 2026-08-30 라운드에서
> 출처 2건이 포털 개편으로 통째로 사라진 뒤에도 `factIntegrity=100`이 계속 나왔다.

같은 결함의 두 번째 발현이다. 첫 번째는 **링크 사망**(도달 가능성)이었고, 이번은 **규범 교체**(현행성)다.
claim-map은 출처의 *도달 가능성*과 값의 *안정성*은 세지만, **인용한 규범이 아직 그 사안을 규율하는가**는
세지 않는다.

### 3.3 중국에는 건 감시를 멕시코에는 걸지 않았다 — 규칙이 아니라 우연

`2027-china-implementing-rules` 후보가 백로그에 있다. 개정 상표법(2026-06-26 공포)의 **후속 시행규정**을
기다리는 watching 후보다. 정확히 이번에 멕시코에서 일어난 형태다.

| 관할 | 법률 개정 | 시행규칙 감시 후보 |
|---|---|---|
| 중국 | 2026-06-26 공포 / 2027-01-01 시행 | **있음** (`2027-china-implementing-rules`, 2026-08-03 등록) |
| 멕시코 | 2026-04-03 공포 | **없음** — claim-map notes에만 기록 |

두 사건의 차이는 판단이 아니라 **경로**다. 중국 건은 브리프 본문(2026-07-11호)에서 출발해 발굴 lane으로
들어왔고, 멕시코 건은 워크스페이스 claim 검증에서 출발해 그 자리에 머물렀다.
"법률이 바뀌면 시행규칙이 따라온다"를 **강제하는 규칙이 하네스에 없다.**

### 3.4 커버리지 지표는 멕시코를 "6일 전 등장"으로 보여줬다

발행 직전(2026-09-06) 기준으로 radar의 Guide Coverage를 다시 계산하면 이렇다.

| Guide | 브리프 링크 이슈 | 마지막 등장 | 경과 | 열린 후보 |
|---|---|---|---|---|
| mexico | 9 | 2026-08-31 | **6d** | 0 |

건강해 보인다. 실제로는 **멕시코 관할 이슈는 2026-03-06 이후 하나도 없었다 — 184일.**
2026-08-31호는 한국(K-브랜드) 사건이고, MexTm 국경조치 장에 딥링크가 걸렸을 뿐이다.

`summarizeCoverage`의 guide 행은 `relatedGuideLinks`를 센다. 즉 **"가이드가 인용됐다"를 "그 관할을
취재했다"로 읽는다.** 관할 축 표(`Jurisdiction tags`)는 따로 있지만 **건수만 있고 경과일이 없어서**
`Mexico 2`라는 숫자는 어떤 행동도 유발하지 않는다.

## 4. 하네스 구조 진단

| # | 층 | 무엇이 없는가 | 이 사건에서의 발현 | 현재 게이트 |
|---|---|---|---|---|
| D1 | 발굴 데이터 모델 | **규범 층 축**(`statute` / `regulation` / `guidance` / `fee`) | 법률 개정과 시행규칙이 같은 사건으로 접혀, 법률만 확인하고 닫혔다 | 없음 |
| D2 | 소스 등록부 | **관보(공표 채널) 티어**. 등록 15개는 전부 기관 뉴스·안내면이고 관보가 하나도 없다 | 사건이 정의상 관측 가능한 유일한 면(DOF)이 등록부 밖 | `discovery.test.ts`가 커버리지 바닥은 강제하나 채널 종류는 무관 |
| D3 | 소스 등록 규칙 | **부트스트랩 경로.** 추정 URL 금지 + secondary는 인용 기록 이후 등록 = 새 채널을 못 연다 | 이 뉴스를 실제로 나른 채널(멕시코 로펌 해설)은 등록 자격이 없었고, DOF도 저장소에 URL 기록이 없어 등록 불가였다 | 규칙(문서) |
| D4 | freshness 신호 | **에이전트 채널에서 `verified`를 만들 방법.** `curl`·WebFetch는 등록 15개 전부 CONNECT 403 | 15개 중 `실사 이력 없음` **10**, `주기 초과` **4**, 정상 **1**. 상시 붉은 신호는 우선순위를 못 만든다 | 리포트(advisory) |
| D5 | 커버리지 지표 | **관할 축 경과일.** 3.4 참조 | 멕시코가 184일 굶은 채로 "6d"로 표시됐다 | 리포트(advisory) |
| D6 | 주기 실행 훅 | 계약과 훅의 **문면 불일치** (아래 상세) | `impi`는 `실사 이력 없음`이라 훅의 대상 집합에 영원히 안 든다 | 문서 드리프트 |
| D7 | 시간 축 | **발효일·마감일 캘린더** | 공포(4/28)와 발효(7/22)가 3개월 떨어져 두 번째 기회가 있었는데, 날짜가 오면 뜨는 자리가 없다 | 없음 |

### D4 보강 — 실사 이력의 지역 편중

`verified` sweep이 실제로 연 소스는 `kipo`(2회)·`cnipa-official`·`cnipa-trademark-office`·`jpo`·`wipo-madrid`뿐이다.
**7개 가이드 중 5개(mexico·latam·usa·europe·uk)는 자기 관할 소스가 하네스 도입 이후 한 번도 열리지 않았다.**
멕시코가 특별히 방치된 것이 아니라, 열린 곳만 계속 열리는 구조다.

### D6 상세 — 고칠 수 있는 유일한 드리프트

| 문서 | 문면 |
|---|---|
| `briefs-discovery.md` (계약) | "`실사 이력 없음`·`주기 초과` 소스가 이번 회차의 우선 대상이다" |
| `phase2.5-organic-indexing-ops.md` §5 (**유일한 주기 실행 훅**) | "`주기 초과` 소스가 이번 회차 대상이다" |

radar는 `impi`를 `실사 이력 없음`으로 찍는다. `주기 초과`가 아니다.
**월간 훅의 문면을 그대로 따르면 `impi`를 포함해 10개 소스는 영구히 대상이 아니다.**
이것은 정책 판단이 아니라 두 문서 사이의 드리프트이고, D1~D7 중 유일하게 owner 결정 없이 고칠 수 있다.

## 5. 개선안 — owner 결정표

각 항목의 "막았나"는 **이 사건을 2026-08-30 이전에 표면화했겠는가**를 뜻한다.

### P0 — 결정 불필요 (드리프트 정정 / 순수 파생 계산)

| 항목 | 내용 | 막았나 | 비용 | 가드레일 |
|---|---|---|---|---|
| **P0-1** `§5` 문면 정정 | `주기 초과` → `실사 이력 없음·주기 초과`. 계약 문면에 맞춘다 | 간접 — `impi`가 월간 대상 집합에 들어온다 | 2줄 | 해당 없음(문서 정합) |
| **P0-2** 관할 축 freshness | `summarizeCoverage`의 jurisdiction 행에 `lastPublishedAt`·`daysSince` 추가, guide 행에 "관할 이슈 마지막 등장"을 링크 기준과 **분리해** 표시 | **예** — 8/30 화면에 "Mexico 177d"가 떴다 | 파생 함수 + 테스트 1건. 게이트 아님 | 안전 — 크롤러·의존성·스케줄 없음 |

### P1 — 계약·타입 변경 (owner 판단)

| 항목 | 내용 | 막았나 | 위험 |
|---|---|---|---|
| **P1-1** `BriefSweepKind`에 `mediated` 추가 | WebSearch triage 회차를 기록하되 `lastVerified`는 **갱신하지 않는다**(`repository-backfill`과 같은 취급). radar에 `mediated` 열 → "1차 대조 미결" 큐가 생긴다 | 부분 — 8/25·8/30·9/7 회차가 데이터로 남아 "봤지만 규범 층은 안 물었다"가 다음 회차로 승계된다 | `verified` 의미 희석. 완화: freshness 미산입을 **테스트로** 못 박는다(backfill 선례 존재). `briefs-discovery.md`가 이미 미결로 올려 둔 항목이다 |
| **P1-2** claim-map 미결 → 발굴 큐 다리 | claim-map에 `openQuestions: [{ id, question, raisedOn, candidateId? }]` 구조 필드. radar에 "워크스페이스 미결" 블록(표시만, 게이트 아님) | **예** — `MX-ENF-001`의 8/30 미결이 9/7 이전에 radar에 떴다 | claim-map 스키마 변경 → `scripts/research-audit/*` 영향. 6개 워크스페이스 소급 채우기 필요 |
| **P1-3** 규범 층 짝 규칙 | `BriefCandidate`에 `changeLayer` 축. `statute` 후보가 열려 있으면 같은 관할의 `regulation` 후보 또는 명시적 면제 사유를 요구 | **예** — 중국 패턴이 규칙이 되어 멕시코에도 걸렸다 | 기존 후보 7건에 필드 채우기. 소급 적용하면 즉시 위반이 뜨는데 **그게 요점이다** |
| **P1-4** 발효일 캘린더 | 후보에 `effectiveOn` / `closesOn`. radar에 "다가오는 날짜" 블록 | 부분 — 7/22에 두 번째 기회가 떴다 | 낮음. taskboard가 이미 적어 둔 `timeSensitive.closesOn` 부재와 같은 필드 하나로 덮인다 |

### P2 — 데이터·정책 (owner 판단)

| 항목 | 내용 | 비고 |
|---|---|---|
| **P2-1** 관보 티어 소스 등록 | DOF 등 공표 채널을 `tier: "gazette"` 또는 primary로 등록. `sweepTarget`은 "상표·산업재산 관련 reglamento/decreto 게재 여부"로 좁힌다 | **선행 조건**: 저장소에 `dof.gob.mx` URL 기록이 **0건**이다(칠레 `diariooficial.interior.gob.cl`만 있다). 추정 URL 금지 규칙 때문에 에이전트가 단독으로 못 넣는다 — owner가 한 번 열어 URL을 확정하면 그 뒤는 규칙 안이다. **→ 2026-09-07 owner 지시로 반영, 아래 §8** |
| **P2-2** secondary 부트스트랩 | 20호가 Pérez-Llorca·Mijares·AIPPI 등의 인용 기록을 저장소에 남겼다. **기존 규칙 그대로 등록 자격이 생겼다** | 무엇을 secondary로 볼지(로펌 뉴스레터 vs 매체)와 tier별 sweep 의미는 결정 필요 |
| **P2-3** sweep 회전 규칙 | 월 1회 훅에서 "가장 오래 안 연 소스 N개"를 강제 회전. D4의 지역 편중을 끊는다 | hard SLA가 아니라 **순번**이다. cadence 계약을 건드리지 않는다 |

### 하지 않을 것 (명시)

- **크롤러·스케줄 워크플로 신설.** Phase 2.5 `새 파이프라인 도입` 가드레일 위반이고, 이 사건의 원인도 아니다 —
  **등록부에 없는 채널은 크롤해도 안 나온다.** D2가 D4보다 앞선다.
- **cadence hard SLA.** 이 사건은 발행 빈도 문제가 아니다. 8월에만 3호를 냈고 목표선을 넘긴 주가 없다.
  `briefs-lane.md`가 freshness 트레드밀 방지로 잠근 계약을 이 사건이 흔들 근거가 되지 못한다.
- **radar를 게이트로 승격.** "지표와 실행 실패는 다른 사건이다"라는 기존 계약을 깬다.
  고칠 것은 **표시하는 내용**이지 게이팅 여부가 아니다.

## 6. 이번 라운드에서 실제로 바꾼 것

**P0-1만 반영했다.** `phase2.5-organic-indexing-ops.md` §5-1과 monthly quick checklist의 sweep 대상 문면을
계약(`briefs-discovery.md`)에 맞춰 `실사 이력 없음·주기 초과`로 정정했다.

나머지는 전부 계약·타입·데이터 변경이라 이 문서에 제안으로만 남긴다. 발굴 계약을 바꾸는 것은
`briefs-discovery.md`의 `경계` 절과 `미결(owner 핸드오프)` 절이 owner 몫으로 잠가 둔 범위다.

## 7. Owner 액션 (이 문서가 넘기는 것)

1. **P0-2 승인 여부** — 관할 축 freshness를 radar에 세울지. 결정만 나면 파생 계산이라 바로 구현 가능하다.
2. **P1-1~P1-4 중 채택 범위** — 넷 다 하면 발굴 데이터 모델이 한 번에 커진다. 이 사건 기준 단독 효과가
   가장 큰 것은 **P1-2**(미결 다리)이고, 재발 방지 폭이 가장 넓은 것은 **P1-3**(규범 층 짝 규칙)이다.
3. ~~**DOF URL 확정** — P2-1의 유일한 선행 조건.~~ **2026-09-07 owner 지시로 등록했다(§8).** 남은 것은 owner가 페이지를 한 번 열어 검색·게재 페이지 URL을 좁히고 2026-04-28 게재를 대조하는 일이다.
4. **20호 본문의 1차 출처 대조** — 이 진단과 별개로 `current-ops-taskboard.md` 2026-09-07 5라운드가
   ⓐ~ⓔ로 남긴 owner 확인 항목이 그대로 열려 있다.

## 8. 후속 — P2-1 반영 (2026-09-07)

owner 지시로 관보 소스를 등록했다. 이 절은 그 결과만 기록하고, 위 1~7절의 진단은 발행 시점 상태로 둔다.

| 항목 | 값 |
|---|---|
| id / tier | `dof-mexico` / `primary` |
| url | `https://dof.gob.mx/` |
| cadence | `monthly` |
| 관할 · 가이드 | `Mexico` · `mexico`·`latam` |
| sweep 회차 | **없음** — 등록은 실사가 아니다 |
| radar 상태 | `실사 이력 없음` (소스 15 → 16) |

**직접 열기는 못 했다.** 2026-09-07 실측으로 `dof.gob.mx`·`www.dof.gob.mx`·`sidof.segob.gob.mx` 전부
`curl` CONNECT 403이고 WebFetch는 `EGRESS_BLOCKED`다(프록시 README가 "정책 거부(403/407)는 재시도하지 말고
보고하라"고 명시한다). 기관 도메인은 WebSearch로 확인했다. 그래서 `briefSweepLog`에 회차를 추가하지 않았고
`lastVerified`도 만들지 않았다 — **D4가 지적한 "verified가 아닌 것을 verified로 적는 오염"을 이 등록이
만들지 않는다.**

계약 쪽 변경 두 가지:

- `briefs-discovery.md` **소스 등록 규칙**에 경로 ⓑ(owner가 등록을 지시한 기관 도메인)를 명문화했다.
  기존 문면(ⓐ 저장소 기록 URL·origin만)은 **새 채널을 여는 경로를 아예 갖고 있지 않아서**, D2·D3이 지적한
  치킨-에그를 규칙 자체가 만들고 있었다. ⓑ에는 `notes`에 지시 근거·확인 경로·대조 상태를 남기는 의무가 붙는다.
- 같은 문서에 **"등록은 실사가 아니다"**를 별도 항목으로 세웠다. 등록으로 sweep 회차나 `lastVerified`가
  생기지 않으며, 새 소스가 `실사 이력 없음`으로 뜨는 것이 정상이고 그 상태가 첫 sweep 큐라는 것을 못 박는다.
  P0-1로 §5가 `실사 이력 없음`을 대상 집합에 넣은 뒤라, 이 소스는 다음 월간 훅에서 실제로 큐에 오른다.

`tier: "gazette"`는 만들지 않았다. 관보도 기관 공식면이므로 `primary`로 충분하고, tier를 늘리면
타입·리포트·테스트가 함께 움직인다. cadence를 `weekly`가 아니라 `monthly`로 둔 것도 의도적이다 — DOF는
평일 매일 2회 발행이라 완료 조건이 일자별 통독이 아니라 기간 검색이고, weekly로 두면 D4가 지적한
"상시 붉은 행"을 하나 더 만들 뿐이다.

**남은 owner 액션**: ⓐ 페이지를 한 번 열어 검색·게재 페이지 URL로 `url`을 좁히기, ⓑ 20호가 2차 해설
일치 범위에서 적은 2026-04-28 게재 대조.

**추가 (2026-09-07, owner 지시)**: 칠레 관보 `diario-oficial-chile`(`https://diariooficial.interior.gob.cl/`)을
함께 등록했다. `LatTm` 제10장 모니터링 시스템에 호스트가 이미 기록돼 있어 **규칙 ⓐ 경로**이며, 그 점에서
`dof-mexico`(ⓑ)와 다르다. 다만 **기능이 대칭이 아니다** — 멕시코 DOF는 법령 공포면이고, 칠레 관보는
법령 공포면이면서 동시에 INAPI 상표출원 공고면이다(일간 발행·공고 후 30일 이의기간). 그래서
`sweepTarget`이 개별 marca 공고를 명시적으로 제외한다: 그쪽은 독자용 모니터링 데이터이지 브리프 소재가
아니고, 일간 발행이라 섞으면 신호가 묻힌다. 이 소스도 채널 403이라 sweep 회차·`lastVerified`는 없다.
소스 16 → 17, `실사 이력 없음` 11 → 12.

이제 관보 축은 둘이고, **나머지 관할은 저장소에 관보 URL 기록이 없어 ⓑ 경로로만 열린다**(미국 Federal
Register, EU Official Journal, 영국 The Gazette, 일본 官報, 중국 国务院公报). 확대 판단은 owner에게
남는다.

## Authority

- 발굴 계약: [`briefs-discovery.md`](briefs-discovery.md) / 정본 [`../src/briefs/discovery.ts`](../src/briefs/discovery.ts)
- 발행 계약: [`briefs-lane.md`](briefs-lane.md) / 정본 [`../src/briefs/archive.ts`](../src/briefs/archive.ts)
- 주기 실행 훅: [`phase2.5-organic-indexing-ops.md`](phase2.5-organic-indexing-ops.md) §5, [`monthly-review-template.md`](monthly-review-template.md)
- 운영 기록: [`current-ops-taskboard.md`](current-ops-taskboard.md) 2026-09-07 5라운드
- 워크스페이스 증거: `../MexTm/content/research/mx_tm_fact_verification_log.md`, `../MexTm/content/research/mx_tm_source_register.md`, `../MexTm/content/research/claim-map.json`
