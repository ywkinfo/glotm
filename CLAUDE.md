# GloTm — Claude Code Instructions

This file provides Claude Code with project-specific context and routing rules.

## Read first

Before any non-trivial change, read the authority docs in this order (do not duplicate their
mutable values here — read them live):

1. `PROJECT-OVERVIEW.md` — current phase, priorities, and the `Do not start yet` guardrail
2. `README.md` — verification lanes and runnable commands
3. `Harness/Constitution.md`, `Harness/Style-Guide.md`, `Harness/QA-Gate.md` — permanent working rules
4. each workspace `README.md` + `Harness/Architecture.md` + `Harness/Content-Spec.md` — workspace-local rules

`AGENTS.md` holds the canonical Root Decision Order and source-of-truth matrix; follow it for
authority conflicts instead of restating those rules here. `src/products/registry.ts` is the
runtime metadata source of truth, and the numbers in docs are derived snapshots from it.

Before broad or expansion-shaped work, check scope against the `Do not start yet` list in
`PROJECT-OVERVIEW.md` and `Do Not Touch` in `docs/current-ops-taskboard.md`.

Hermes 에이전트의 역할·권한·제안 범위·제안 PR 검토 판단은 `Harness/Hermes-Operating-Charter.md`
(정책 정본)를 먼저 보고, 트리거·task allowlist·Slack 운용은 `docs/hermes-operations-runbook.md`를 본다.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Parallel, multi-lane, or team-like execution in this repo → use native parallel subagents first; do not invoke `omx team` / `$team` / tmux team orchestration unless explicitly debugging that runtime
