# GloTm Brief Discovery Harness

이 문서는 주간 브리프의 **소재 발굴(upstream)** 계약이다.
발행 이후의 계약(cadence 라벨·provenance 서술·정정·publish 게이트)은 [`briefs-lane.md`](briefs-lane.md)가 정본이며, 이 문서는 그 앞단만 다룬다. 두 문서는 중복하지 않는다.

- 발굴 정본(소스 등록부·후보 백로그·sweep 로그): [`../src/briefs/discovery.ts`](../src/briefs/discovery.ts)
- 구조 강제: [`../src/briefs/discovery.test.ts`](../src/briefs/discovery.test.ts) (`brief discovery contract`)
- advisory 리포트: `npm run briefs:radar` ([`../scripts/briefs-radar.ts`](../scripts/briefs-radar.ts))
- 발행 정본: [`../src/briefs/archive.ts`](../src/briefs/archive.ts)

**문서는 설명, 테스트는 게이트, 리포트는 게이팅하지 않는다.**

## 왜 있는가

브리프 lane은 발행 이후가 잠겨 있었지만 그 앞단은 비어 있었다. 어디를 보는지 목록이 없었고, 봤지만 쓰지 않은 소재는 흔적 없이 사라졌고, 마지막 발행 이후 며칠이 지났는지 아무 표면도 보여주지 않았다. 각 가이드 워크스페이스에는 `content/research/*_source_register.md`라는 소스 등록부 선례가 이미 있는데 브리프 lane에만 없었다.

이 하네스는 발굴을 **고정된 소스 목록 위의 sweep**으로 바꾸고, 산출을 typed 백로그에 쌓고, 상태를 advisory 리포트로 드러낸다. 크롤러나 스케줄러는 만들지 않는다(Phase 2.5 "새 파이프라인·의존성 추가" 가드레일).

## 3개 데이터

| 데이터 | 무엇 | append 규칙 |
|---|---|---|
| `briefSources` | 정기적으로 보는 곳 | 새 소스는 배열 끝에 추가 |
| `briefCandidates` | 발굴했지만 아직 발행하지 않은 소재 | 새 후보는 배열 끝에 추가, 상태는 제자리에서 전이 |
| `briefSweepLog` | 언제 무엇을 봤는가 | **최신순** 유지 — 새 회차를 배열 맨 앞에 추가 |

## sweep 절차

1. `npm run briefs:radar`로 지금 상태를 본다. `Source Sweep` 블록의 `주기 초과` 소스가 이번 회차의 우선 대상이다.
2. 그 소스들을 실제로 연다. 등록부 순회가 이 lane의 "체계적"의 정의다 — 기억나는 곳만 보는 것이 아니다.
3. 소재가 있으면 `briefCandidates`에 후보를 추가한다. `trigger`에는 **기관·매체와 날짜**를 적는다(발행 계약의 provenance 규칙과 같은 기준). 추정으로 채우지 않는다.
4. `briefSweepLog`에 회차를 append한다. **산출이 없어도 기록한다** — "봤는데 없었다"도 운영 사실이고, 기록하지 않으면 그 소스는 영원히 `주기 초과`로 남는다.
5. `npm test`로 `brief discovery contract`를 통과시킨다.

sweep은 사람 또는 세션 중인 checkout agent가 수행한다. 자동 fetch는 이 lane의 범위가 아니다.

## 후보 상태 전이

```
watching ──(트리거 도달·1차 출처 확인 가능)──▶ ready ──(발행)──▶ published
    │                                            │
    └──────────────(더 볼 이유 없음)─────────────┴──▶ dropped
```

| 상태 | 의미 | 필수 |
|---|---|---|
| `watching` | 트리거가 아직 오지 않았거나 확인 중 | — |
| `ready` | 별도 취재 없이 바로 쓸 수 있음 | — |
| `published` | 이슈로 나감 | `publishedAs` = archive의 이슈 slug |
| `dropped` | 쓰지 않기로 함 | `droppedReason` |

- `dropped`에 이유를 요구하는 이유는 같은 소재를 몇 달 뒤 다시 주워 오는 루프를 끊기 위해서다.
- `watching`으로 30일을 넘기면 radar가 `Stalled watching`으로 표시한다. **버리라는 신호가 아니라 살릴지 버릴지 한 번 판단하라는 신호다.**

## 소스 등록 규칙

- `url`은 저장소에 이미 기록된 URL 또는 그 origin만 쓴다. 워크스페이스 `content/research/*_source_register.md`·`claim-map.json`과 기존 브리프 본문이 근거다. **추정 URL을 만들지 않는다.**
- `tier: "primary"`는 기관 공식면이다. 업계 매체(`secondary`)는 실제 인용 URL이 저장소에 남은 뒤 등록한다. 현재 시드는 전부 primary이며, 매체는 primary 공고에서 파생 확인한다.
- `relatedProductSlugs`는 `src/products/registry.ts`의 live guide slug만 쓴다. 어떤 가이드에도 닿지 않는 소스는 이 lane의 소스가 아니다.
- **커버리지 바닥**: live guide 7개는 각각 primary 소스를 최소 1개 갖는다. 테스트가 강제한다.

## 관할 태그 어휘

기존 이슈들은 `UK`와 `United Kingdom`, `EU`와 `Europe`을 섞어 썼다. 발행 시점 태그는 **소급 수정하지 않고**(본문 소급 수정 금지와 같은 이유) 집계할 때만 `normalizeJurisdictionTag`로 접는다.

하네스 도입일(`briefDiscoveryStartOn` = 2026-08-03) 이후 발행 이슈부터는 관할 축 하나가 정규 어휘여야 한다. 나머지 주제 태그(`Counterfeit Damages`, `IPEC` 등)는 계속 자유다.

## radar 읽는 법

`npm run briefs:radar`(JSON은 `npm run briefs:radar:json`)는 **reporting surface이지 게이트가 아니다.** `health:report`와 같은 성격으로 읽는다. 항상 exit 0이고, 구조 위반은 `npm test`가 잡는다.

| 블록 | 무엇을 보여주는가 | 어떻게 읽는가 |
|---|---|---|
| `Lane Cadence` | 마지막 발행 후 경과일 vs 목표 7일 | **SLA가 아니다.** `briefs-lane.md`가 hard SLA를 두지 않기로 잠갔다(freshness 트레드밀 방지). 목표선 초과는 판단 재료일 뿐 실패가 아니다 |
| `Backlog` | status별 건수 · `ready` 목록 · 정체 후보 | `ready`가 0이면 다음 발행 때 맨땅에서 시작해야 한다는 뜻이다 |
| `Guide Coverage` | guide별 마지막 브리프 등장일과 열린 후보 수 | 오래 굶은 가이드 + 후보 0 조합이 다음 sweep의 우선순위다 |
| `Source Sweep` | 소스별 마지막 sweep 경과일 | `주기 초과`가 이번 회차에 열 목록이다 |

## 주기성

자동 스케줄러는 없다. 주기성은 세 곳에 걸려 있다.

- `.github/workflows/ci.yml`의 advisory 스텝 — push마다 로그에 남는다. **붉히지 않는다.**
- [`monthly-review-template.md`](monthly-review-template.md)의 `Brief discovery check` — 월 1회 결과 기록.
- [`phase2.5-organic-indexing-ops.md`](phase2.5-organic-indexing-ops.md)의 monthly quick checklist — 월 1회 실행.

## 경계 (하지 않는 것)

- 자동 크롤링·fetch·스케줄 워크플로를 만들지 않는다.
- cadence를 하드 게이트로 올리지 않는다. 올리려면 `briefs-lane.md`의 hard SLA 없음 계약부터 owner가 고쳐야 한다.
- 후보 하나를 근거로 포트폴리오 우선순위를 바꾸지 않는다(taskboard committee-warning 규칙과 동일).
- 발굴 데이터를 운영 문서에 손으로 복제하지 않는다. 정본은 `discovery.ts`이고 사람이 읽는 뷰는 radar 출력이다.
- 이 데이터는 앱 런타임이 import하지 않는다(테스트가 가드한다). 리더 UI에 백로그를 노출하지 않는다.
