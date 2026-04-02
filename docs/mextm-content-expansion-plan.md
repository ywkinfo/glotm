# MexTm 콘텐츠 보강 실행 계획서

## 목적

이 문서는 `MexTm`을 현재의 강한 baseline에서, buyer entry 가치와 실무 밀도가 더 분명하게 드러나는 growth country guide로 끌어올리기 위한 실행 계획서다. 이미 15개 챕터와 278개 search entry를 갖춘 상태이므로, 이번 스프린트의 목적은 장 수 확대보다 핵심 장의 판단 밀도, 실행 표준형, reader 탐색 품질을 높이는 데 있다.

핵심 목표는 세 가지다.

1. `MexTm`의 현재 강점을 유지하면서 buyer entry 관점의 핵심 장을 더 두껍게 만든다.
2. fact verification log에 잠긴 내용을 본문 우선 장으로 안전하게 승격한다.
3. `ChaTm`처럼 계획 문서와 taskboard를 고정해, 이후 집필과 검증을 반복 가능한 레인으로 운영한다.

## 현재 상태 요약

- `MexTm`은 루트 `GloTm` 셸 `/mexico` 경로에 연결된 live country guide다.
- 현재 공개본 기준 구조는 서문 포함 15개 챕터다.
- 현재 루트 registry 기준 검색 엔트리는 278개다.
- `build-master -> qa-content -> build-content` 전체 파이프라인을 루트와 워크스페이스 로컬에서 모두 재현할 수 있다.
- `content/research/mx_tm_fact_verification_log.md`에는 fee, deadline, terminology, enforcement 관련 핵심 항목이 `Body-ready` 상태로 정리돼 있다.

## 편집 원칙

- 이미 강한 장을 무작정 늘리기보다, buyer가 실제로 먼저 읽는 장의 판단 속도를 높인다.
- `master.md`와 generated JSON은 결과물로 보고, 수정 시작점은 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`으로 고정한다.
- 수수료, 기한, 시스템명, 공식 절차명은 fact verification log와 공식 출처를 먼저 확인한 뒤 본문에 단정적으로 올린다.
- 각 우선 장에는 최소 1개의 체크리스트, 비교표, decision memo, escalation 표 중 하나를 포함한다.

## v1 목표 산출물

- 챕터 수: 15장 구조 유지
- 검색 엔트리: 278 -> 300~340
- 우선 장의 본문 도입부를 summary/search entry 재료가 되도록 재정렬
- 우선 장별 실행형 표 또는 체크리스트 1개 이상 추가
- `npm run content:mexico`, `npm test`, `npm run build`, `npm run build:pages:glotm` 통과

## Sprint 1 우선 장

1. 제1장. 멕시코 상표 제도 개요와 IMPI 운영 구조
2. 제4장. 출원 경로 선택: 직접출원 vs 마드리드
3. 제11장. 도메인(.MX)·디자인·저작권(인다우토르)과의 결합 전략
4. 제13장. 실무 사례·판례 요약

선정 이유:

- 제1장은 buyer가 MexTm을 열었을 때 전체 실무 구조를 이해하는 첫 장이다.
- 제4장은 출원 경로 선택이라는 직접 의사결정 포인트를 다룬다.
- 제11장은 멕시코 실무에서 자주 놓치는 디지털/브랜드 자산 통제를 다룬다.
- 제13장은 앞 장의 원칙을 실제 사례와 실패 패턴으로 회수하는 장이다.

## 작업 단계

### Phase 0 — 기준선 고정

- 현재 15장 구조와 Sprint 1 우선 4장을 잠근다.
- fact verification log의 `Body-ready` 항목이 어느 장에 승격되는지 표시한다.
- 우선 장별 완료 기준을 문서화한다.

### Phase 1 — 우선 장 심화

- 제1장: 운영 구조와 기한/모니터링 체계를 한 장 decision map으로 보강
- 제4장: 직접출원 vs 마드리드 선택표와 escalation 기준 보강
- 제11장: 상표, `.MX` 도메인, 디자인, 저작권을 하나의 통제 포트폴리오로 읽히게 재정리
- 제13장: 한국 기업이 반복적으로 놓치는 패턴을 사례형 체크리스트로 회수

### Phase 2 — 사실 검증 동기화

- `MX-FEE-001`, `MX-DL-001`, `MX-NORM-001`, `MX-ENF-001`을 우선 장과 연결
- 기한, 수수료, 시스템명, 절차명은 공식 소스 기준으로만 단정 표현
- 변동 가능성이 큰 문구는 본문에서 "최신 공식 안내 기준" 표현으로 제한

### Phase 3 — 조립과 QA

- `npm run content:mexico`
- 장 제목, 헤딩 구조, 표 형식, search entry 증가 폭 확인
- `/mexico` 홈, 챕터, 검색, continue reading 흐름 스모크

### Phase 4 — 루트 게이트

- `npm test`
- `npm run build`
- `npm run build:pages:glotm`

## 완료 기준

- 우선 4개 장이 기존 baseline보다 더 명확한 decision/supporting structure를 갖는다.
- fact verification log의 핵심 `Body-ready` 항목이 본문에 실제 승격된다.
- `content:mexico`와 루트 검증 명령이 통과한다.
- `/mexico` reader의 홈/챕터/검색/continue reading 흐름에 회귀가 없다.

## 운영 메모

- `MexTm`은 이미 강한 baseline이 있으므로, 이번 스프린트에서는 장 수 확대보다 buyer entry 가치와 실무 decision density를 우선한다.
- 다음 스프린트 후보는 제5장, 제7장, 제10장처럼 후속 운영과 집행 판단을 이어 주는 장이다.
