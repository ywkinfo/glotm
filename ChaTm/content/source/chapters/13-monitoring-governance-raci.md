# 제13장. 모니터링, 내부통제, RACI

중국 상표 운영이 흔들리는 이유는 사건이 없어서가 아니라, 사건을 누가 보고 누가 결정하는지가 불명확해서다. 이 장의 목적은 모니터링 체계와 내부 통제를 연결하고, 본사·중국 사업팀·외부 대리인 사이의 책임 구조를 눈에 보이게 만드는 데 있다.

### 모니터링은 탐지보다 분류 속도가 중요하다

출원 충돌, 플랫폼 침해, 도메인 문제, 위조 의심, 계약 위반은 모두 다른 대응 수단을 가진다. 그래서 중요한 것은 많이 잡는 것보다, 발견 즉시 어떤 유형인지 분류하는 것이다.

권장 분류는 단순해야 한다.

- 출원/공고 충돌
- 온라인 판매/플랫폼 문제
- 도메인/계정 문제
- 오프라인 침해/유통 문제
- 내부 계약/사용 구조 문제

### 사건 보드는 하나로 묶는다

중국 실무에서는 같은 표장이 여러 채널에서 동시에 문제를 일으킬 수 있다. 따라서 채널별로 다른 스프레드시트를 두기보다, 하나의 사건 보드에서 상태와 다음 액션을 관리하는 편이 효율적이다.

#### 사건 보드 최소 필드

| 필드 | 내용 |
| --- | --- |
| 사건 유형 | 출원, 플랫폼, 도메인, 오프라인 등 |
| 표장 | 영문/중문/로고 구분 |
| 상태 | 신규, 검토중, 대응중, 종료 |
| 담당 | 본사, 중국팀, 대리인 |
| 다음 액션 | 이의, 경고장, 패킷 보완 등 |

### RACI는 문서가 아니라 운영 장치다

상표 운영에서 RACI가 필요한 이유는 책임을 예쁘게 쓰기 위해서가 아니다. 실제로 누가 입력하고 누가 승인하며 누가 외부와 통신하는지를 미리 정해 두지 않으면, 사건이 생길 때마다 같은 혼선이 반복되기 때문이다.

#### 권장 RACI

| 업무 | 본사 브랜드/IP | 중국 사업팀 | 외부 대리인 |
| --- | --- | --- | --- |
| 표장 우선순위 결정 | A | C | C |
| 사용 자료 수집 | C | R | I |
| 출원/거절 대응 초안 | C | I | R |
| 분쟁 채널 선택 | A | C | R |
| 플랫폼/물류 이상 신호 보고 | I | R | I |
| 최종 포기/유지 결정 | A | C | C |

### 분기 리뷰 없이는 통제가 유지되지 않는다

RACI를 만들고 끝내면 실제 운영은 다시 흐려진다. 그래서 분기 단위 리뷰가 필요하다. 이 리뷰는 사건 요약 회의가 아니라, 표장별 상태와 증거 품질, 모니터링 신호, 다음 분기 리스크를 같이 보는 자리여야 한다.

#### 분기 리뷰 체크리스트

- 핵심 표장별 사용 자료가 최신인가
- 공고/이의/거절 대응 사건이 밀려 있지 않은가
- 플랫폼·도메인·오프라인 사건이 하나의 보드로 묶여 있는가
- 외부 대리인 의존도가 과도한 업무가 없는가
- 다음 분기 우선 표장이 명확한가

## 사건 보드 우선순위 규칙

사건이 많아질수록 무엇부터 볼 것인가가 먼저 정해져 있어야 한다. 중국 운영에서는 중요도보다 속도와 채널 파급력이 같이 반영된 기준이 필요하다.

| 우선순위 | 조건 | 기본 액션 |
| --- | --- | --- |
| P1 | 코어 표장 + 코어 상품군 + 공개 채널 노출 | 24시간 내 owner 지정 |
| P2 | 보조 표장 또는 제한 채널 이슈 | 주간 리뷰 안건으로 상정 |
| P3 | 단순 watch 또는 초기 징후 | 보드 등록 후 모니터링 |

## 월간 운영 시나리오

실무에서는 월간 운영 루틴을 고정해 두면 사건이 생겼을 때마다 구조를 다시 만들 필요가 없다.

| 시점 | 확인할 것 | 산출물 |
| --- | --- | --- |
| 월초 | 신규 출원/공고/플랫폼 이상 신호 | 신규 사건 목록 |
| 월중 | 핵심 표장 증거와 사용 구조 | evidence vault 갱신 메모 |
| 월말 | 분기 우선순위, 외부 대리인 workload, 미결 사건 | 운영 리포트 1장 |

## mature 기준 reader/search QA 체크리스트

ChaTm을 mature 승격 후보로 보려면 챕터 수와 density만이 아니라 실제 reader/search 사용성이 repeatable해야 한다. 아래 체크리스트는 `/china` 리더 기준의 최소 품질 증빙으로 남긴다.

| 영역 | 확인 항목 | 통과 기준 |
| --- | --- | --- |
| 홈 | chapter card와 continue reading | 우선 장과 low-density 장 모두 정상 노출 |
| 검색 | 핵심 decision table 탐색 | route / invalidation / licensing / customs / RACI가 section 단위로 검색됨 |
| 챕터 | outline / prev-next / hash deep link | 장 중간 진입과 outline sync 유지 |
| 모바일 | drawer / scrim / action bar | 짧은 챕터에서도 겹침 없음 |
| Gateway | ChaTm card summary, density, QA 상태 | registry truth와 일치 |

### search QA에서 반드시 찍어 둘 섹션

- 제4장 `출원 경로 시나리오별 판단표`
- 제8장 `무효·취소 attack/defense 분기표`
- 제9장 `licensing-distribution-control sheet`
- 제12장 `customs escalation matrix`
- 제13장 `mature 기준 reader/search QA 체크리스트`

## 사건 분류 taxonomy를 고정한다

모니터링 시스템이 성숙해질수록 분류체계가 흔들리면 안 된다. 분류 기준이 매번 바뀌면 같은 사건이 서로 다른 보드에 들어가고, 월간 리뷰에서도 추세가 보이지 않는다.

| 대분류 | 세부 예시 | 기본 owner |
| --- | --- | --- |
| filing watch | 출원 충돌, 공고, 이의 | 본사 IP + 대리인 |
| online enforcement | 플랫폼, SNS, 도메인 | 브랜드 보호 담당 |
| supply-chain risk | 세관, 위조, 병행 유통 | 공급망팀 + 법무 |
| contract / usage control | OEM, 총판, licensing drift | 법무 + 사업팀 |
| portfolio hygiene | 미사용, 갱신, 방어 표장 정리 | 본사 IP |

### taxonomy를 고정하는 이유

사건이 늘수록 "무엇을 봤는지"보다 "어느 bucket에 넣었는지"가 더 중요해진다. bucket이 고정돼야 월말 리포트가 누적되고, 외부 대리인 workload도 같은 언어로 관리된다.

## owner handoff SLA

RACI가 있어도 handoff 시간이 길어지면 실제 대응은 느리다. 그래서 owner 간 handoff SLA를 가볍게라도 정해 두는 편이 좋다.

| handoff | 권장 시간 | 메모 |
| --- | --- | --- |
| 사업팀 -> 법무 | 24시간 이내 | seller/link/evidence 초안 포함 |
| 법무 -> 외부 대리인 | 48시간 이내 | primary ask와 packet scope 명시 |
| 외부 대리인 -> 본사 decision owner | 72시간 이내 | option A/B와 risk 메모 포함 |
| 공급망팀 -> 브랜드 보호 담당 | 즉시 ~ 24시간 | customs incident memo 첨부 |

### SLA가 필요한 이유

지연은 보통 법리 때문이 아니라 owner 사이 공백 때문에 생긴다. SLA를 엄격한 규정으로 두기보다, 어느 handoff가 늦어졌는지 보이는 장치로 두는 편이 좋다.

## 월간 scorecard review 입력값

월간 review에서는 사건 수보다 lifecycle input이 더 중요하다. ChaTm mature 준비를 위해 아래 입력값을 같은 표로 관리한다.

| 항목 | 현재 확인 포인트 |
| --- | --- |
| chapter count | 15장 유지 여부 |
| search density | low-density 장 보강 반영 여부 |
| verifiedOn freshness | 최근 검증일 기준 자동 계산 |
| qaLevel | `full` 근거 문서와 smoke evidence 존재 여부 |
| high-risk gap | 0건 유지 여부 |

### scorecard review에서 남길 메모

- 왜 `full` QA로 올릴 수 있는가
- 어떤 smoke evidence를 다시 재현했는가
- 아직 lifecycle status를 올리지 않는 이유는 무엇인가
- 다음 review 전까지 어떤 drift를 감시할 것인가

## monthly review 1-page 아웃라인

| 섹션 | 최소 포함 내용 |
| --- | --- |
| portfolio state | chapter count, density, QA, gap |
| 주요 사건 | filing / online / customs / contract bucket별 요약 |
| owner SLA | 지연된 handoff와 원인 |
| 다음 달 집중 장면 | route, evidence, contract, customs 중 우선순위 |

### 운영팀에게 남기는 한 줄 기준

월간 review 문서는 길어질수록 읽히지 않는다. 한 장 안에서 지금 어디가 흔들리는지, 누구 handoff가 늦는지, 다음 달 어떤 bucket을 먼저 볼지만 보이게 하는 편이 좋다.

## governance quick rules

- 같은 incident는 채널이 달라도 하나의 board id로 묶는다.
- route, evidence, contract, customs memo는 monthly review 전에 반드시 업데이트한다.
- `verifiedOn`, QA 근거, gap 수는 narrative가 아니라 scorecard input으로 관리한다.
- mature review 전까지는 lifecycle status를 바꾸지 않고 evidence만 먼저 잠근다.

### governance rule을 지키는 최소 루틴

| 주기 | 확인할 것 |
| --- | --- |
| 주간 | 신규 incident bucket 분류 |
| 월간 | owner SLA와 scorecard input |
| 분기 | route/evidence/contract/customs 보드 재정렬 |

이 정도 루틴만 고정돼도 governance는 문서가 아니라 운영 장치로 작동하기 시작한다.

### 이 장의 운영 메모

중국 상표 운영에서 가장 비싼 실수는 판단이 늦는 것이다. 모니터링과 내부 통제, RACI를 하나로 묶으면 누가 어떤 사건을 언제 올려야 하는지 분명해지고, 그만큼 대응 속도도 빨라진다.
