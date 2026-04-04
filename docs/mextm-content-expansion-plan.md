# MexTm 콘텐츠 보강 실행 계획서

## 목적

이 문서는 `MexTm`을 현재의 강한 baseline에서, buyer entry 가치와 실무 밀도가 더 분명하게 드러나는 growth country guide로 끌어올리기 위한 실행 계획서다. 이미 15개 챕터와 379개 search entry를 갖춘 상태이므로, 이번 스프린트의 목적은 장 수 확대보다 핵심 장의 판단 밀도, 실행 표준형, reader 탐색 품질을 높이는 데 있다. Sprint 1이 buyer-entry 입구를 잠갔다면, Sprint 2는 그 흐름을 filing, maintenance, enforcement 운영까지 이어 붙이는 단계다.

핵심 목표는 세 가지다.

1. `MexTm`의 현재 강점을 유지하면서 buyer entry 관점의 핵심 장을 더 두껍게 만든다.
2. fact verification log에 잠긴 내용을 본문 우선 장으로 안전하게 승격한다.
3. `ChaTm`처럼 계획 문서와 taskboard를 고정해, 이후 집필과 검증을 반복 가능한 레인으로 운영한다.

## 현재 상태 요약

- `MexTm`은 루트 `GloTm` 셸 `/mexico` 경로에 연결된 live country guide다.
- 현재 공개본 기준 구조는 서문 포함 15개 챕터다.
- 현재 루트 registry 기준 검색 엔트리는 379개다.
- `build-master -> qa-content -> build-content` 전체 파이프라인을 루트와 워크스페이스 로컬에서 모두 재현할 수 있다.
- `content/research/mx_tm_fact_verification_log.md`에는 fee, deadline, terminology, enforcement 관련 핵심 항목이 `Body-ready` 상태로 정리돼 있다.

## 편집 원칙

- 이미 강한 장을 무작정 늘리기보다, buyer가 실제로 먼저 읽는 장의 판단 속도를 높인다.
- `master.md`와 generated JSON은 결과물로 보고, 수정 시작점은 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`으로 고정한다.
- 수수료, 기한, 시스템명, 공식 절차명은 fact verification log와 공식 출처를 먼저 확인한 뒤 본문에 단정적으로 올린다.
- 각 우선 장에는 최소 1개의 체크리스트, 비교표, decision memo, escalation 표 중 하나를 포함한다.

## v1 목표 산출물

- 챕터 수: 15장 구조 유지
- 검색 엔트리: 379 current baseline, 후속 심화 시 380+ 범위 목표
- 우선 장의 본문 도입부를 summary/search entry 재료가 되도록 재정렬
- 우선 장별 실행형 표 또는 체크리스트 1개 이상 추가
- `npm run content:mexico`, `npm test`, `npm run build`, `npm run build:pages:glotm` 통과

## Sprint 2 우선 장

1. 제5장. 출원서 작성 실무: 제출서류·권한·전자출원(PASE)
2. 제7장. 등록 후 의무: 사용 선언·갱신·권리 유지 캘린더
3. 제10장. 관세·세관(국경) 조치와 물류 통제

선정 이유:

- 제5장은 경로 선택 뒤 실제 filing packet을 잠그는 첫 운영 장이다.
- 제7장은 declaration of use, renewal, evidence ownership을 하나의 유지관리 시스템으로 회수하는 장이다.
- 제10장은 IMPI 집행과 ANAM 문서 흐름을 연결해 국경 단계 실행력을 만드는 장이다.

## 작업 단계

### Phase 0 — 기준선 고정

- 현재 15장 구조와 Sprint 2 우선 3장을 잠근다.
- 현재 기준 수치를 `15장 / 검색 엔트리 379`로 갱신한다.
- fact verification log의 `Body-ready` 항목이 어느 장에 승격되는지 표시한다.
- 우선 장별 완료 기준을 문서화한다.
- 글로벌 병렬 스프린트에서 `MexTm`은 dedicated single lane으로 운영하고, root gate는 통합 시점에만 실행한다고 명시한다.

### Phase 1 — 우선 장 심화

- 제5장: filing owner, signing authority, `Tu cuenta PASE`/`Marca en Línea` handoff를 packet lock board로 보강
- 제7장: declaration of use, renewal, goods/services 유지 범위, evidence linkage를 운영 캘린더와 escalation 보드로 보강
- 제10장: IMPI 임시조치와 ANAM `pedimento/annex` 흐름을 border evidence pack과 incident memo로 보강

### Phase 2 — 사실 검증 동기화

- 제5장: `MX-NORM-001`, `MX-FEE-001`
- 제7장: `MX-DL-001`, `MX-FEE-001`
- 제10장: `MX-ENF-001`
- 기한, 수수료, 시스템명, 절차명은 공식 소스 기준으로만 단정 표현
- 변동 가능성이 큰 문구는 본문에서 "최신 공식 안내 기준" 표현으로 제한

### Phase 3 — 워크스페이스 게이트

- `npm run content:mexico`
- 장 제목, 헤딩 구조, 표 형식, search entry 증가 폭 확인
- `/mexico` 홈, 챕터, 검색, continue reading 흐름 스모크

### Phase 4 — 통합 머지와 shared root gate

- 글로벌 스프린트 머지 순서에서 `MexTm`을 두 번째로 병합한다.
- `MexTm` lane은 root gate를 개별 반복하지 않고, shared verification lane에 workspace gate 결과만 넘긴다.

## 완료 기준

- 우선 3개 장이 기존 baseline보다 더 명확한 decision/supporting structure를 갖는다.
- fact verification log의 핵심 `Body-ready` 항목이 본문에 실제 승격된다.
- `content:mexico`가 workspace gate로 통과하고, 통합 이후 shared root gate가 1회 통과한다.
- `/mexico` reader의 홈/챕터/검색/continue reading 흐름에 회귀가 없다.

## 운영 메모

- `MexTm`은 이미 강한 baseline이 있으므로, 이번 스프린트에서는 장 수 확대보다 buyer entry 가치와 실무 decision density를 우선한다.
- worker는 `MexTm` 디렉터리와 `mx_tm_fact_verification_log.md`만 수정하고, 루트 메타데이터는 리더가 마지막에 동기화한다.
- Sprint 2 이후의 다음 handoff는 `EuTm` 안정화와 `Report / Gateway trust layer` 정합화다.

## 2026-04-04 진행 메모

- Sprint 1 잠금 4장에 IMPI 시스템 handoff board, buyer-entry escalation memo, local-fit vs central-management scoring, owner split memo, asset owner-linkage map, partner exit war-room, case-to-control mapping board를 추가했다.
- Sprint 2에서는 제5장, 제7장, 제10장에 filing packet lock board, rights-maintenance triage board, border evidence pack control board를 추가해 buyer-entry 이후 운영 handoff를 더 빨리 읽히게 만든다.
- 이번 라운드의 검증 목표는 `npm --prefix MexTm run content:prepare`, `npm run content:mexico`, `npm run test:content`, `npm run build` 재통과다.
- 이후 handoff는 `EuTm` 안정화 -> `Report / Gateway trust layer` 정합화 순서를 유지한다.
