# GloTm — Claude Code Instructions

This file provides Claude Code with project-specific context and routing rules.

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
- Codex를 보조로 쓸 때 → Codex는 `AGENTS.md`를 참조하며 skill 호출 없이 직접 실행; Claude는 skill routing 유지, Codex에게 위임할 작업은 명시적으로 지시
