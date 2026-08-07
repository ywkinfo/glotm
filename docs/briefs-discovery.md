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

## sweep 종류 — `verified` vs `repository-backfill`

`BriefSweep.kind`는 두 값만 갖는다. 섞으면 freshness가 거짓말을 한다.

| kind | 의미 | freshness |
|---|---|---|
| `verified` | 소스를 **실제로 열어** 확인한 회차 | 인정 — 이 날짜가 마지막 실사일이 된다 |
| `repository-backfill` | 저장소에 이미 기록돼 있던 감시 항목을 후보로 옮긴 회차 | **산입 안 함** — 후보의 계보만 남긴다 |

하네스 도입 시 넣은 회차는 `repository-backfill`이다. 그래서 지금 radar는 **15개 소스 전부를 `실사 이력 없음`으로 표시하며, 그것이 사실이다.** 첫 `verified` sweep을 돌기 전까지 이 상태가 유지된다.

## sweep 절차

1. `npm run briefs:radar`로 지금 상태를 본다. `Source Sweep` 블록의 `실사 이력 없음`·`주기 초과` 소스가 이번 회차의 우선 대상이다.
2. 그 소스들을 실제로 연다. 각 소스의 `sweepTarget`이 **무엇을 봐야 그 소스의 sweep이 끝나는지**를 정의한다 — 등록된 URL을 여는 것만으로는 끝나지 않는다. 등록부 순회가 이 lane의 "체계적"의 정의다.
3. 소재가 있으면 `briefCandidates`에 후보를 추가한다. `trigger`에는 **기관·매체와 날짜**를 적는다(발행 계약의 provenance 규칙과 같은 기준. 날짜 토큰은 테스트가 강제한다). 추정으로 채우지 않는다.
4. `briefSweepLog`에 `kind: "verified"` 회차를 append한다. **산출이 없어도 기록한다** — "봤는데 없었다"도 운영 사실이고, 기록하지 않으면 그 소스는 영원히 `실사 이력 없음`으로 남는다.
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

모든 후보는 `relatedProductSlugs`를 최소 1개 갖는다(어떤 가이드에도 닿지 않는 후보는 커버리지에 잡히지 않아 백로그에서 조용히 늙는다). `dropped`가 아닌 상태에는 `droppedReason`이 남아 있으면 안 된다 — 되살린 후보의 옛 폐기 사유는 상태를 오독하게 만든다.

sweep 회차의 `foundCandidateIds`에 오른 후보는 **그 회차가 실제로 본 소스 중 하나를 인용**해야 하고, `discoveredOn`이 그 회차 날짜보다 늦을 수 없다. 계보가 맞지 않으면 테스트가 막는다.

- `dropped`에 이유를 요구하는 이유는 같은 소재를 몇 달 뒤 다시 주워 오는 루프를 끊기 위해서다.
- `watching`으로 30일을 넘기면 radar가 `Stalled watching`으로 표시한다. **버리라는 신호가 아니라 살릴지 버릴지 한 번 판단하라는 신호다.**

## 소스 등록 규칙

- `url`은 저장소에 이미 기록된 URL 또는 그 origin만 쓴다. 워크스페이스 `content/research/*_source_register.md`·`claim-map.json`과 기존 브리프 본문이 근거다. **추정 URL을 만들지 않는다.**
- `sweepTarget`은 필수다. 넓은 루트 URL(`https://www.gov.uk/` 등)은 "무엇을 봐야 하는지"를 말해 주지 못하므로, **무엇을 보면 이 소스의 sweep이 끝나는가**를 한 문장으로 적는다. 정확한 뉴스·공고 페이지 URL이 확정되면 `url`을 그 페이지로 좁힌다.
- `tier: "primary"`는 기관 공식면이다. 업계 매체(`secondary`)는 실제 인용 URL이 저장소에 남은 뒤 등록한다. 현재 시드는 전부 primary이며, 매체는 primary 공고에서 파생 확인한다.
- `relatedProductSlugs`는 `src/products/registry.ts`의 live guide slug만 쓴다. 어떤 가이드에도 닿지 않는 소스는 이 lane의 소스가 아니다.
- `sweepCadence: "event-driven"`인 소스는 `reviewTrigger`가 필수다. 주기가 없는데 "무엇이 오면 다시 보는가"까지 없으면 그 소스는 아무도 다시 열지 않는다.
- **커버리지 바닥**: live guide 7개는 각각 **자기 관할을 다루는** primary 소스를 최소 1개 갖는다(KIPO·WIPO처럼 전 가이드를 대는 cross-cutting 소스만으로는 충족되지 않는다). 테스트가 강제한다.

## 관할 태그 어휘

기존 이슈들은 `UK`와 `United Kingdom`, `EU`와 `Europe`을 섞어 썼다. 발행 시점 태그는 **소급 수정하지 않는다**(본문 소급 수정 금지와 같은 이유).

경로가 둘로 갈린다. 이 분리가 요점이다.

| 용도 | 함수 | 동작 |
|---|---|---|
| **집계**(legacy 포함 커버리지 계산) | `normalizeJurisdictionTag` / `getCanonicalJurisdictions` | 별칭을 접는다 — `UK` → `United Kingdom` |
| **게이트**(신규 데이터 검사) | `isCanonicalJurisdiction` / `hasCanonicalJurisdiction` | literal 일치만 — `UK`는 통과하지 못한다 |

별칭 정규화를 게이트로 쓰면 애초에 문제였던 드리프트가 신규 데이터에서도 계속된다. 그래서 하네스 도입일(`briefDiscoveryStartOn` = 2026-08-03) 이후 발행 이슈와 **모든 후보**는 관할 축 하나가 **literal** 정규 어휘여야 한다. 나머지 주제 태그(`Counterfeit Damages`, `IPEC` 등)는 계속 자유다.

`briefDiscoveryStartOn`은 테스트로 고정돼 있다. 이 날짜를 앞으로 밀면 "발행 이슈는 백로그를 거쳐야 한다"는 게이트가 조용히 사라지므로, 바꾸려면 그 pin 테스트를 의도적으로 고쳐야 한다.

## radar 읽는 법

`npm run briefs:radar`(JSON은 `npm run briefs:radar:json`)는 **reporting surface이지 게이트가 아니다.** `health:report`와 같은 성격으로 읽는다. 구조 위반은 `npm test`가 잡는다.

**지표와 실행 실패는 다른 사건이다.** 어떤 수치가 나빠도 종료 코드는 0이다(cadence 초과, 커버리지 공백, 실사 이력 없음 전부). 다만 스크립트 자체가 실패하면 — 데이터 로드 불가, 타입 위반 등 — 예외가 그대로 올라가 CI 스텝이 실패한다. 하나는 운영 신호이고 하나는 하네스 고장이다.

| 블록 | 무엇을 보여주는가 | 어떻게 읽는가 |
|---|---|---|
| `Lane Cadence` | 마지막 발행 후 경과일 vs 목표 7일 | **SLA가 아니다.** `briefs-lane.md`가 hard SLA를 두지 않기로 잠갔다(freshness 트레드밀 방지). 목표선 초과는 판단 재료일 뿐 실패가 아니다 |
| `Backlog` | status별 건수 · `ready` 목록 · 정체 후보 | `ready`가 0이면 다음 발행 때 맨땅에서 시작해야 한다는 뜻이다 |
| `Guide Coverage` | guide별 마지막 브리프 등장일과 열린 후보 수 | 오래 굶은 가이드 + 후보 0 조합이 다음 sweep의 우선순위다 |
| `Source Sweep` | 소스별 마지막 **verified** 실사 경과일 | `실사 이력 없음`·`주기 초과`가 이번 회차에 열 목록이다. `backfill` 열은 계보 표시일 뿐 실사 증거가 아니다 |

## 주기성

**자동 스케줄러는 없다.** CI 스텝은 주기 트리거가 아니라 push·PR마다의 로그 가시성일 뿐이며, 실제 주기는 아래 두 체크리스트가 담당한다.

- `.github/workflows/ci.yml`의 advisory 스텝 — push마다 로그에 남는다. 지표로는 **붉히지 않는다**(실행 실패는 별개).
- [`monthly-review-template.md`](monthly-review-template.md)의 `Brief discovery check` — 월 1회 결과 기록.
- [`phase2.5-organic-indexing-ops.md`](phase2.5-organic-indexing-ops.md)의 monthly quick checklist §5 — 월 1회 실행.

## 경계 (하지 않는 것)

- 자동 크롤링·fetch·스케줄 워크플로를 만들지 않는다.
- cadence를 하드 게이트로 올리지 않는다. 올리려면 `briefs-lane.md`의 hard SLA 없음 계약부터 owner가 고쳐야 한다.
- 후보 하나를 근거로 포트폴리오 우선순위를 바꾸지 않는다(taskboard committee-warning 규칙과 동일).
- 발굴 데이터를 운영 문서에 손으로 복제하지 않는다. 정본은 `discovery.ts`이고 사람이 읽는 뷰는 radar 출력이다.
- 이 데이터는 앱 런타임이 import하지 않는다. 리더 UI에 백로그를 노출하지 않는다(아래 `런타임 격리 가드`).

## 런타임 격리 가드

가드는 3중이다.

| 가드 | 무엇을 보는가 | 어디서 도는가 |
|---|---|---|
| `src/briefs/discovery.test.ts` | `src/**`의 **직접** import (빠른 로컬 그물) | runtime lane |
| `scripts/module-boundary.test.ts` | 진입점(`index.html`·`build:pages`)에서 **재귀**로 도달 가능한 모듈 그래프 | runtime lane |
| `npm run check:dist-boundary` | 실제 출하 산출물(`dist/**`)의 문자열 | **release lane**(빌드 직후) |

경계 가드가 보장하는 것:

- 진입점 목록을 하드코딩하지 않고 `index.html`의 module script와 `build:pages`의 스크립트에서 **도출**한다. 새 진입점이 생기면 실패한다.
- `src` 밖 bridge를 경유해도 잡는다 — 이 저장소에는 `scripts/prerender.ts → scripts/seo.ts → src/*` 경로가 실재하며, 이 경로로 들어온 데이터는 prerender HTML에 실린다.
- specifier 해석은 `ts.resolveModuleName`에 맡긴다. `./discovery.js`처럼 확장자를 바꿔 쓴 import도 `discovery.ts`로 해석돼 잡힌다.
- 수집은 AST로 한다. 주석·문자열 안의 `import.meta.glob` 같은 표현에 오탐하지 않는다.
- 실패 시 `scripts/prerender.ts → scripts/seo.ts → src/briefs/discovery.ts`처럼 **경로 전체**를 출력한다.

보장하지 **않는** 것 — 발견되면 통과시키는 대신 **실패**한다:

- `import.meta.glob()` / `globEager()`
- 값이 실행 시점에 정해지는 동적 `import()`

두 형태는 정적으로 따라갈 수 없다. 도입하려면 `scripts/module-graph.ts`를 함께 확장해야 한다. Vite query import(`?raw`, `?url`)는 예외적으로 정확히 다룬다 — 쿼리를 떼고 해석해 TS 모듈이면 진짜 간선으로 잡고(모듈 텍스트가 번들에 인라인되므로), 마크다운 같은 에셋이면 무시한다.

## dist 경계 검사

`npm run check:dist-boundary`는 `health:release`의 `build:pages:glotm` **직후**에 돈다. 정적 가드를 빠져나간 데이터가 실제 산출물에 남았는지 보는 마지막 그물이다.

- **`dist/` 부재는 skip이 아니라 실패다.** release lane에서 산출물이 없다는 것 자체가 사고다.
- vitest 파일이 아닌 CLI인 이유: `test:runtime`은 `--exclude` 방식이라 새 테스트를 자동 포함하고 bare `npm test`도 전체를 돌린다. dist를 요구하는 테스트를 두면 빌드 전에 실행돼 `Harness/QA-Gate.md`의 "Always: `npm run test` 통과" 계약이 clean tree에서 깨진다.
- 토큰은 후보 id 전수 + **따옴표를 씌운** 소스 id + 구조 마커(`sweepTarget`·`reviewTrigger`·`repository-backfill`·`briefSweepLog`)다. 소스 id를 맨몸으로 찾으면 가이드 본문의 정당한 기관명과 충돌한다(실측: `uspto` 7파일, `impi` 27파일). 스캔 대상은 `.html .js .css .json .map .xml .txt`.

## 미결 (owner 핸드오프)

- **소스별 정확한 뉴스·공고 페이지 URL.** 현재 `url` 다수가 origin이고, 완료 조건은 `sweepTarget` 산문이 지고 있다. 이 저장소의 에이전트 세션은 외부 egress가 차단돼 페이지 실재를 확인할 수 없으므로(**미검증**), 페이지 URL 확정은 owner가 한다.
- **소스 커버리지 승인**: 15건이 실제로 봐야 할 곳을 다 덮는지.
- **secondary(업계 매체) 등록 기준**: 현재는 인용 URL이 저장소에 남은 뒤에만 등록한다.
