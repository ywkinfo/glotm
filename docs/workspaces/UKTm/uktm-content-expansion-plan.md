# UKTm 콘텐츠 안정화 실행 계획서

## 목적

이 문서는 이미 `/uk`에 연결된 `UKTm` early track을 다음 스프린트에서 어떻게 안정화할지 정리한 실행 계획서다. 핵심 목표는 신규 대확장보다, `draft 공개본 · early track` 포지션을 유지하면서 장별 원고, fact verification, 조립/QA 파이프라인, 루트 셸 회귀 방지 기준을 단단히 하는 것이다.

## 현재 운영 원칙

1. 정본은 `content/source/chapters/*.md`, `content/source/appendix/*.md`, `manifest.json`이다.
2. `master.md`는 조립 결과물이며, 수동 편집보다 재생성을 우선한다.
3. 사실 검증은 본문보다 `uk_tm_fact_verification_log.md`에서 먼저 잠근다.
4. 이번 스프린트에서는 status 승격보다 `정합성 + 검증 + 회귀 방지`를 우선한다.
5. `EuTm`과 내용이 겹치면 영국 독자 판단이 필요한 차이만 남긴다.

## 이번 스프린트 우선순위

### 1. 문서 정합성 고정

- `UKTm/README.md`, `UKTm/Harness/Architecture.md`, `UKTm/Harness/Content-Spec.md`가 현재 early-track 상태를 일관되게 설명
- `/uk`가 이미 live route라는 사실과 `draft 공개본` 포지션을 문서에 명시

### 2. fact verification 우선

- `uk_tm_fact_verification_log.md`의 `확정` 항목을 본문에 우선 반영
- 수수료, 기한, 시스템명은 로그 기준으로만 단정 서술
- `추가검증 필요` 항목이 남아 있으면 본문에는 운영 메모 수준으로만 남김

### 3. 선택적 본문 보강

- 실무 밀도가 직접 reader 품질에 영향을 주는 장을 우선 보강
- 권장 우선 장: `04`, `06`, `07`, `08`, `10`, `13`, `14`
- 각 장은 표/체크리스트/운영 시나리오를 최소 1개 이상 유지

### 4. 루트 회귀 방지

- `npm run content:uk`
- `npm test`
- `npm run build`
- `npm run build:pages:glotm`
- `/uk` 홈, 챕터, 검색, continue reading 흐름 확인

## 성공 기준

- 14개 챕터 구조와 조립 파이프라인이 계속 유지됨
- `build-master -> qa-content -> build-content` 정상 동작
- `/uk` 홈/챕터/검색/continue reading 동작
- 기존 live guide 회귀 없음
- `draft 공개본 · early track` 포지션과 실제 문서 설명 사이 충돌 없음
