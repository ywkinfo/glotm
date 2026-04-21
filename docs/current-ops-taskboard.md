# GloTm Current Ops Taskboard

이 문서는 현재 로컬 위원회 합의안을 실행 보드 형태로 정리한 supporting doc이다.
현재 phase, 우선순위, 명령, 검증 계약의 authority는 계속 `../PROJECT-OVERVIEW.md`, `../README.md`, `../ARCHITECTURE.md`를 기준으로 본다.

## Snapshot

- Last updated: 2026-04-21
- Current phase: `Phase 2 — 포지셔닝, tier governance, Gateway alignment`
- Locked priority order: `ChaTm -> MexTm -> EuTm -> Report / Gateway -> JapTm -> UKTm -> UsaTm`
- Current rule of thumb: 새 확장보다 기존 포트폴리오의 정합성과 verification provenance를 먼저 잠근다.
- `2026-04-21` shared root gate(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현 통과

## Today

### 1. `ChaTm` mature refresh closeout

- `ChaTm/content/source/`와 `ChaTm/content/research/` 기준으로 `Body-ready` fact 항목의 본문 승격 여부를 마감한다.
- `/china` 홈, 챕터, 검색, continue reading 스모크 evidence를 한 묶음으로 정리한다.
- shared root gate에 넘길 입력값을 taskboard/checklist 수준으로 정리한다.

완료 기준:

- `chatm-content-expansion-taskboard.md`의 mature refresh 관련 잔여 메모가 닫혀 있다.
- source chapters 기준 설명과 reader smoke evidence가 서로 충돌하지 않는다.

### 2. `MexTm` Sprint 2 후속 통합

- 잠겨 있는 `Ch5`, `Ch7`, `Ch10` 범위 안에서 workspace-local gate 결과를 다시 읽고 root shared truth 반영 대상을 정리한다.
- 후속 sync 대상은 `PROJECT-OVERVIEW.md`, `README.md`, `src/products/registry.ts`, Gateway/Report handoff copy다.
- `Gateway/registry/root-doc sync`에 필요한 문구 차이만 추려서 넘긴다.

완료 기준:

- `mextm-content-expansion-taskboard.md`의 Leader Integration Inputs를 root sync 관점으로 옮길 수 있다.
- local gate 결과와 root wording 후보가 한 장의 메모로 묶여 있다.

### 3. `EuTm` stabilization closeout 준비

- `controlled EU+UK scope` 문구가 workspace docs, supporting docs, root overview에서 같은 뜻으로 읽히는지 점검한다.
- 핵심 6장의 wording drift가 보이면 source-first 원칙으로만 수정 후보를 만든다.
- `14 chapters / 258 search entries / validate tier / beta lifecycle` 기준선이 어디서 authoritative하게 읽혀야 하는지 표시한다.

완료 기준:

- `eutm-content-expansion-plan.md`의 stabilization 리스크가 root wording drift와 연결돼 설명된다.
- root docs sync 전에 어떤 파일이 정본인지 분명하다.

## This Week

### A. 제품 상태 정본을 하나로 잠그기

- guide 상태값은 `src/products/registry.ts`를 canonical data source로 보고, 루트 문서와 supporting docs는 그 상태를 설명하는 방향으로 맞춘다.
- `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `verifiedOn`, scope wording의 drift를 줄인다.

대상:

- `src/products/registry.ts`
- `PROJECT-OVERVIEW.md`
- `README.md`
- `docs/workspaces/ChaTm/*`
- `docs/workspaces/MexTm/*`
- `docs/workspaces/EuTm/*`

### B. workspace별 검증 깊이 표를 고정하기

- 루트 `content:prepare`, `health:content`, workspace-local `content:prepare`가 각 guide에서 무엇을 보장하는지 한 표로 고정한다.
- 특히 `UsaTm`, `JapTm`, `UKTm`의 lighter-track 표현과 실제 스크립트 범위가 어긋나지 않게 정리한다.

대상:

- `package.json`
- `README.md`
- `docs/phase1-runtime-qa.md`
- 필요 시 각 workspace `README.md`, `package.json`

### C. `health:report` provenance를 명시하기

- `health:report`가 최근 저장 상태를 요약하는지, 현재 트리를 새로 검증한 결과인지 문서와 출력 의미를 잠근다.
- scorecard와 monthly review에서 이 결과를 어떻게 읽어야 하는지 같이 적는다.

대상:

- `scripts/health-report.ts`
- `scripts/health-lane-state.ts`
- `README.md`
- `docs/portfolio-scorecard.md`
- `docs/monthly-review-template.md`

### D. 그다음 `Report / Gateway` 정합화

- 위 세 항목이 잠긴 뒤에만 Gateway hero, CTA row, report handoff wording을 조정한다.
- buyer-facing 메시지 변경은 `monthly-review-template.md`의 locked defaults와 함께 다룬다.

## Lane Artifacts

- `ChaTm`: `docs/workspaces/ChaTm/chatm-root-gate-input.md`
- `MexTm`: `docs/workspaces/MexTm/mextm-root-sync-input.md`
- `EuTm`: `docs/workspaces/EuTm/eutm-root-sync-input.md`
- 현재 라운드 원칙: workspace handoff 문서까지는 병렬로 진행하고, 루트 truth와 shared root gate는 통합 단계에서 1회만 다룬다.

## Do Not Touch

- 신규 국가 가이드 추가
- pricing / paywall 도입
- 이메일 게이트 3단계 확장
- 새 콘텐츠 파이프라인 도입
- 의존성 추가
- generated JSON, `public/generated/*`, `dist/*` 수동 수정
- `weekly_ops_briefing_2026-04-17.md`만 근거로 한 공식 포지셔닝 변경

## Committee Warnings

- 브리핑은 방향 신호일 뿐, 현재 우선순위를 덮어쓰는 실행 명령이 아니다.
- 지금 GloTm의 다음 액션은 확장이 아니라 `ChaTm`, `MexTm`, `EuTm`, `Report/Gateway` 정합성 잠금이다.
- source 대신 generated 산출물부터 만지면 운영 truth가 먼저 깨진다.

## Working Notes

- root shared truth 확인 순서: `Harness/Constitution.md` -> `PROJECT-OVERVIEW.md` -> `README.md` -> `ARCHITECTURE.md`
- workspace taskboard 확인 순서:
  - `docs/workspaces/ChaTm/chatm-content-expansion-taskboard.md`
  - `docs/workspaces/MexTm/mextm-content-expansion-taskboard.md`
  - `docs/workspaces/EuTm/eutm-content-expansion-plan.md`
