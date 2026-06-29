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
- Hermes 운영/권한/콘텐츠 품질 큐 판단 → `Harness/Hermes-Operating-Charter.md`(정책), `docs/hermes-operations-runbook.md`(런타임)

## Actors & Responsibilities

루트에서 "누가 무엇을 하는가"의 정본이다. 아래 Root Decision Order(문서 위계)와 별개로, 행위자별
역할·권한·경계를 정의한다.

```
Owner (결정권자·라우터; 어느 actor로도 직접 라우팅한다)
 ├─ Slack @Hermes (P2.5 request-only refresh)  …… 대화형 read-only intake/triage + brokered context refresh
 ├─ 정형 4 task → ssh hermes-host <slug> → bounded operator → Draft PR / NO_CHANGES
 ├─ 열린 분석/설계/구현 → Checkout coding agent → branch / PR
 └─ merge / deploy / policy / pricing / 신규 국가 → Owner only
```

| Actor | 역할 | 권한·경계 |
|---|---|---|
| **Owner** | 결정권자·라우터 | merge·deploy·정책·신규국가/pricing·owner 전용 검증(SC/GA4/live QA). 2채널 커밋(PR / 직접 push **Lore**¹), main-protection ruleset bypass=always |
| **Slack @Hermes** (P2.5 request-only refresh) | brokered read-only checkout 기반 intake/triage | repo/task 실행·write 없음 — **능력 차단**(GitHub write 자동승인 없음·relay key 없음·writable clone/host env 미마운트) 기반이다. host의 공개 GloTm checkout은 `/opt/glotm-context:ro`로만 보이며 `read-grounded`까지만 가능하다. refresh가 필요하면 @Hermes는 좁은 writable mailbox(`/opt/glotm-refresh-requests/inbox`)에 JSON request만 만들 수 있고, root-owned host broker가 schema·allowlist·rate limit 검증 뒤 `glotm-report-context-refresh.service` 경로를 호출한다. 이는 Slack task 실행이 아니다. 2026-06-26 manual-sync canary가 P2 baseline이고, 2026-06-29 P2.5 request-broker 계약으로 갱신. 정본 [`docs/hermes-report-only-skill-draft.md`](docs/hermes-report-only-skill-draft.md) |
| **Checkout coding agent** (Claude Code 또는 owner-invoked Codex) | 열린 분석·설계·구현(정식 체크아웃) | 거버넌스 문서를 읽고 브랜치에 제안+구현 → **owner 머지**. 결정권 없음. Claude Code는 한 구현(상세 [`CLAUDE.md`](CLAUDE.md)) |
| **Hermes bounded operator** (`glotm-hermes` Codex 런타임, ssh 트리거) | 정형 4 task | task tier(자율작업/draft PR), 능력 차단, **owner 머지**. soul = `glotm-hermes`의 `prompts/_bounded-operator-preamble.md` + task prompt. 정책 [`Harness/Hermes-Operating-Charter.md`](Harness/Hermes-Operating-Charter.md) |
| **Codex native subagents** | Checkout coding agent가 쓰는 병렬 실행 도구 | 독립 권한 없음(아래 Parallel Execution Rule) |

**"codex" 용어 3 구분**: ① bounded operator 내부 실행 런타임, ② checkout agent / native subagent 도구,
③ git 이력의 `[codex]`·zykj 자율처리 표기 = **역사적 provenance이며 현재 권한이 아니다**.

¹ **Lore** = owner의 직접 push 채널(PR 게이트 우회, ruleset bypass=always). 보안 허점이 아니라
의도된 운영 모델이다(Charter 참조).

## Root Decision Order

루트 문서끼리 판단이 겹칠 때는 아래 순서를 따른다.

1. `Harness/Constitution.md`
2. `PROJECT-OVERVIEW.md`
3. `README.md`
4. `ARCHITECTURE.md`
5. `CLAUDE.md`
6. 각 workspace 계약 문서
7. supporting docs (`docs/README.md` 이하)

## Parallel Execution Rule

- 이 저장소에서 병렬 실행이 필요할 때는 Codex native subagents / native parallel agents를 사용한다.
- `omx team`, `$team`, `swarm`, tmux worker orchestration은 이 저장소의 기본 병렬 실행 수단으로 사용하지 않는다.
- 예외는 OMX tmux team runtime 자체를 디버깅하거나, 사용자가 그 런타임을 명시적으로 점검하라고 요청한 경우뿐이다.
- 배경: 이 저장소에서는 `worker_notify_failed`와 `target_resolution_failed:target_not_found`가 반복 확인되었으므로, 기본 병렬 정책을 native parallel로 고정한다.

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
