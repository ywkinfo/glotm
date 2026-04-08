# GloTm Root Navigation Guide

이 문서는 루트에서 무엇을 먼저 읽어야 하는지 빠르게 정리하는 navigation 문서다.
현재 상태, 명령, 수치, phase 같은 mutable truth를 새로 들고 있지 않는다. 그런 값은 아래 authority 문서를 기준으로 본다.

## Start Here

- 현재 phase, 우선순위, 활성 작업 범위: [`PROJECT-OVERVIEW.md`](PROJECT-OVERVIEW.md)
- 루트 실행 명령, verification lane, runtime source of truth: [`README.md`](README.md)
- 루트 셸 구조와 workspace 관계: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- agent routing 규칙: [`CLAUDE.md`](CLAUDE.md)
- 영구 working rules: [`Harness/Constitution.md`](Harness/Constitution.md), [`Harness/Style-Guide.md`](Harness/Style-Guide.md), [`Harness/QA-Gate.md`](Harness/QA-Gate.md)
- supporting docs index: [`docs/README.md`](docs/README.md)

## If You Need X, Read Y

- 지금 뭘 해야 하는지 판단해야 한다 → `PROJECT-OVERVIEW.md`
- 어떤 명령을 돌려야 하는지 봐야 한다 → `README.md`, `package.json`
- 런타임 수치, tier, lifecycle, QA level을 확인해야 한다 → `src/products/registry.ts`
- Report / Gateway metadata를 확인해야 한다 → `src/reports/registry.ts`
- 루트 셸이 workspace와 어떻게 연결되는지 봐야 한다 → `ARCHITECTURE.md`
- 워크스페이스 안에서 무엇을 수정해야 하는지 봐야 한다 → 각 workspace `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md`
- supporting plan, QA checklist, buyer doc를 찾아야 한다 → `docs/README.md`

## Root Decision Order

루트 문서끼리 판단이 겹칠 때는 아래 순서를 따른다.

1. `Harness/Constitution.md`
2. `PROJECT-OVERVIEW.md`
3. `README.md`
4. `ARCHITECTURE.md`
5. `CLAUDE.md`
6. 각 workspace 계약 문서
7. supporting docs (`docs/README.md` 이하)

## Working Surface Map

- `src/`: 루트 셸, Gateway, guide reader, report runtime
- `LatTm/`, `MexTm/`, `UsaTm/`, `JapTm/`, `ChaTm/`, `EuTm/`, `UKTm/`: workspace별 콘텐츠 원천, 로컬 스크립트, 계약 문서
- `Reports/`: report content pipeline
- `scripts/`: 루트 health lane, prerender, sitemap, generated-content sync
- `public/generated/`: 루트 셸이 소비하는 synced generated content
- `docs/`: supporting plan, QA, scorecard, buyer, workspace workstream docs

## Scope Notes

- 이 문서는 root-first navigation만 다룬다.
- 명령 사용법을 길게 설명하지 않는다. 실행 계약은 `README.md`가 기준이다.
- 아키텍처 설명을 중복하지 않는다. 시스템 구조는 `ARCHITECTURE.md`가 기준이다.
