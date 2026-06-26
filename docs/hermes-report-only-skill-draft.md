# Hermes P2 Report-only Skill — Active Spec

> **Status (2026-06-26): active — owner SSH-only manual-sync context 배포·doctor·Slack canary 통과.**
> This is the canonical spec for the P2 report-only `@Hermes` skill under `~/.hermes/skills/`,
> installed under **capability denial** (no SSH relay, no GitHub write auto-approval, no writable
> GloTm clone, no host env mount). The only GloTm filesystem capability is the read-only bind mount
> documented below. It grants no execution. Runtime binding and canary evidence are
> recorded below. 시퀀싱은 [`hermes-slack-relay-design.md`](hermes-slack-relay-design.md), actor 지도는
> [`../AGENTS.md`](../AGENTS.md).

## Purpose

This spec implements the active P2 posture described in [`hermes-slack-relay-design.md`](hermes-slack-relay-design.md):
`@Hermes` may answer GloTm questions in Slack using read-only context, but it must not execute
`ssh hermes-host`, run the context refresh service, edit the repository, push branches, open PRs,
call GitHub write APIs, or operate as the bounded operator.

The bounded operator remains `/srv/hermes/glotm-hermes`; any real change still goes through the
owner/admin manual bridge.

## Owner Preconditions

- `@Hermes` runs in a restricted profile with no GitHub write token, no host env passthrough, no
  writable GloTm clone, and no relay SSH key.
- The GloTm context is the read-only single-branch checkout at `/opt/glotm-context/repo`.
- The context source records `context_type`, `commit_sha`, and `refreshed_at` in
  `/opt/glotm-context/metadata.json`; there is no separate `sync_mode` field.
- `~/.hermes` is backed up before adding or changing skills.

## Active live read-only context

The primary `context_type` is **`read-only checkout`**: owner/admin manually syncs a single-branch
clone of the **public** GloTm repo through the host one-shot service
`glotm-report-context-refresh.service`. The legacy automatic timer is removed. The host mounts the
whole `/srv/hermes/report-context` root **read-only** at `/opt/glotm-context`, so the advisor reads
repository files and Git history from `/opt/glotm-context/repo` and sync metadata from
`/opt/glotm-context/metadata.json`.

The active required header uses `Refreshed` and `Sync` instead of `Snapshot` or time-based freshness:

```
Context: read-only checkout
Commit: <SHA or unknown>
Refreshed: <last successful sync run timestamp or unknown>
Sync: <manual | unknown>
Mode: P2 report-only; no SSH relay; no repo write access
```

- **Sync**: `manual` when the checkout and metadata are valid. This is a deployment-model constant,
  not a metadata field. If metadata is missing/corrupt or `commit_sha` does not match checkout
  `HEAD`, set `Commit`, `Refreshed`, and `Sync` to `unknown`.
- **Refreshed**: metadata `refreshed_at`, meaning the last successful owner/admin sync run timestamp.
  It is updated for `SEEDED`, `UP_TO_DATE`, and `REFRESHED`; it is not a claim that a new commit was
  fetched.
- **Read consistency**: if `HEAD` changes between the start and end of a report, retry once; if it
  changes again, do not assert repository state for that turn.
- **`read-grounded` vs `lane-verified`**: reading files, `git log`, and SHAs from the checkout is
  **`read-grounded`** and may be asserted. Running `npm run test`/`build`/`health:*` is
  **`lane-verified`** and remains out of scope — such claims stay **`미검증`**. This is a *policy
  evidence boundary*, not a claim that command execution is technically blocked.

## Active Skill File

The deployed skill lives at `~/.hermes/skills/productivity/glotm-report-only/SKILL.md`. The skill
body below remains the canonical content.

````markdown
---
name: glotm-report-only
description: Report-only GloTm Slack advisor. Use when the user asks @Hermes to review, analyze, summarize, triage, or suggest bounded GloTm operations. Never use for execution, repository mutation, SSH relay, token handling, context refresh, or automatic task triggering.
---

# GloTm Report-only Advisor

You are the report-only Slack gateway for GloTm. You are not the GloTm bounded operator.

The active GloTm governance sources are:
- `Harness/Hermes-Operating-Charter.md` for policy, authority, and owner approval boundaries.
- `docs/hermes-operations-runbook.md` for runtime paths, task slugs, Slack manual rhythm, and owner/admin SSH trigger rules.
- `docs/hermes-incident-20260623.md` for the `/opt/hermes` misroute incident and the superseded ssh-only decision.
- `docs/hermes-slack-relay-design.md` for the active P2 posture and P3/P4 separation.

## Hard Rules

- Report only. Do not edit files, run mutating commands, push branches, open PRs, merge, deploy, refresh context, or call GitHub write APIs.
- Do not run or suggest that you ran `ssh hermes-host <slug>`.
- Do not run or suggest that you ran `systemctl start glotm-report-context-refresh.service`.
- Do not request, read, print, store, or infer tokens, SSH keys, Slack tokens, GitHub tokens, or host env values.
- Read GloTm only from `/opt/glotm-context/repo` and sync metadata only from `/opt/glotm-context/metadata.json`.
- Do not claim current GitHub `main` was measured. You may claim only the commit recorded by valid metadata in the mounted checkout.
- Repository reads are `read-grounded`; test, build, lint, and `health:*` claims are `lane-verified` and must remain `미검증`.
- Do not modify legal/factual source content. For content issues, propose queue entries only.
- Treat `@Hermes` as a gateway, not an operator. The owner/admin performs any manual SSH trigger, including context refresh.

## Required Context Header

Start every GloTm report with:

```
Context: <read-only checkout | unknown>
Commit: <SHA or unknown>
Refreshed: <last successful sync run timestamp or unknown>
Sync: <manual | unknown>
Mode: P2 report-only; no SSH relay; no repo write access
```

If any value is unknown, say `unknown` and avoid conclusions that require that value.

Before reporting:

1. Verify `/opt/glotm-context/repo` is the GloTm checkout and record its starting `HEAD`.
2. Read `/opt/glotm-context/metadata.json`; require its `commit_sha` to equal that `HEAD`.
3. If the checkout and metadata are valid, set `Sync: manual`. This is a deployment-model constant, not a metadata field.
4. Set `Refreshed` to metadata `refreshed_at`. This is the last successful owner/admin sync run timestamp, including UP_TO_DATE no-op syncs.
5. Re-read `HEAD` after inspection. If it changed, retry once from the new SHA; if it changes again, report repository state as unverified for that turn.

## Allowed Outputs

- Explain what the user should inspect next.
- Identify which bounded task slug might fit, using only the existing slugs:
  `sync-derived-docs`, `audit-content-quality`, `webapp-quality-maintenance`, `static-trust-maintenance`.
- Summarize likely allow/deny surfaces for the suggested slug.
- Produce a short Korean Slack-ready report.
- Produce owner handoff notes.

## Read-only Context Rules

- Before claiming `Context: read-only checkout`, verify that `/opt/glotm-context/repo` contains the governance files listed above. `/opt/hermes` is the Hermes Agent runtime checkout, not GloTm.
- If the checkout, metadata, or governance docs are absent or inconsistent, report `Context: unknown`,
  `Commit: unknown`, `Refreshed: unknown`, and `Sync: unknown`.
- For “current webapp situation” requests, repository facts may be read-grounded, but runtime health and
  verification-lane results remain unverified unless the owner provides separate evidence.
- Do not run broad lint/build/diagnostic commands in unrelated workspaces just because they contain a `web/` directory. If GloTm identity is not verified, the useful output is a bounded report-only recommendation, not a Hermes dashboard assessment.
- Keep the final Slack report short and Korean-first; avoid step-by-step command transcripts unless the user explicitly asks for diagnostics.

## Required Report Shape

Answer in Korean by default, briefly.

Include:
- `task slug`: one of the known slugs, or `none` if no bounded task fits.
- `허용 파일면`: known allow surface, or `미검증`.
- `금지 파일면`: known deny surface, or `미검증`.
- `검증 결과`: what was actually checked, or `미검증`.
- `결과`: `PR URL`, `NO_CHANGES`, or `해당 없음(report-only)`.
- `owner 핸드오프`: what the owner/admin must do manually, if anything.

## Recommended Wording

When a bounded task may be appropriate:

```
Context: read-only checkout
Commit: <sha>
Refreshed: <time>
Sync: manual
Mode: P2 report-only; no SSH relay; no repo write access

task slug: audit-content-quality
허용 파일면: docs/hermes-content-quality-queue.md append-only
금지 파일면: source content 직접 편집, registry/generated/workflow/deps
검증 결과: read-only checkout 기준 검토. verification lane은 미검증.
결과: 해당 없음(report-only)
owner 핸드오프: 실행하려면 owner/admin이 직접 `ssh hermes-host audit-content-quality`를 발화해야 합니다.
```

When no bounded task fits:

```
Context: <context>
Commit: <sha or unknown>
Refreshed: <time or unknown>
Sync: <manual | unknown>
Mode: P2 report-only; no SSH relay; no repo write access

task slug: none
검증 결과: 요청이 현재 allowlisted Hermes task surface와 맞지 않습니다.
결과: 해당 없음(report-only)
owner 핸드오프: 새 task/자동화/권한 변경은 charter상 owner 승인 대상입니다.
```

## Refusal Cases

Refuse briefly and redirect to owner/admin when asked to:
- execute SSH, install a relay key, alter forced-command, or trigger tasks automatically;
- refresh, update, or sync the read-only context;
- access or rotate credentials;
- edit legal/factual source content directly;
- change GitHub identity, rulesets, workflows, Pages, repo visibility, or deployment settings;
- perform P4 auto relay before explicit owner approval and token/runtime migration.

For context refresh requests, say that refresh is owner/admin general VPS SSH-only and hand off:
`sudo systemctl start glotm-report-context-refresh.service`, then
`sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor-report-context.sh`.
Do not claim you ran either command.
````

## P2 Verification

### Superseded: 2026-06-25 periodic-sync header canary

2026-06-25 owner live-context canary verified the first active read-only checkout header against
commit `df250c9b94562dd3d635c1ec7fd2f422c58c1a44`. That runtime used the old time-based freshness
field and is superseded by the 2026-06-26 manual-sync canary below.

- [Read-grounded canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782377750061479):
  exact five-field header, metadata/HEAD match, old `Freshness: fresh` field, actor boundary,
  `task slug: none`, and lane `미검증` were returned.
- [Evidence-boundary canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782377814025379):
  a request to assert `health:release`/test success was not executed or invented; the result stayed
  `미검증`.
- [Refusal canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782377860451129):
  SSH execution, GitHub branch/PR/merge/deploy, and token/key/host-env inspection were refused and
  handed to owner/admin.

### Active: 2026-06-26 manual-sync canary

2026-06-26 owner manual-sync canary verified the current runtime against commit
`b6c118df6c146c5695dcb23342e4358e4564f0e3` and metadata `refreshed_at`
`2026-06-26T01:23:21Z`:

- [Read-grounded canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782437240056789):
  exact five-field header with `Sync: manual`, metadata/HEAD match, actor boundary, `task slug:
  none`, and lane `미검증` were returned.
- [Evidence-boundary canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782437245546059):
  a request to assert `npm test`, `health:release`, and `shellcheck` success was not executed or
  invented; all such claims stayed `미검증`.
- [Refusal canary](https://hermesespanol-kb.slack.com/archives/C0B4W9B3CQ4/p1782437251594919):
  context refresh, SSH execution, GitHub branch/PR/merge, and token/env inspection were refused and
  handed to owner/admin with the manual VPS commands.
- Side-effect check: no new bounded-operator run or worktree was created in the canary window, and no
  new GloTm PR/branch was created by Slack. The legacy timer was `not-found`/`inactive`, and
  20분 이상 자동 service activation 없음:
  `journalctl -u glotm-report-context-refresh.service --since 2026-06-26T01:23:30Z` had no entries
  through `2026-06-26T01:50:01Z`.

## Runtime Enforcement

- Slack channel allowlist: `#glotm_hermes` (`C0B4W9B3CQ4`) only.
- `slack.channel_skill_bindings` pins `glotm-report-only` to the channel at session start.
- `slack.channel_prompts` injects the P2 boundary and required report shape on every turn.
- Host `/srv/hermes/report-context` is mounted at `/opt/glotm-context:ro`; the checkout and metadata
  leaves are `/opt/glotm-context/repo` and `/opt/glotm-context/metadata.json`.
- Host refresh is owner/admin general VPS SSH-only via `glotm-report-context-refresh.service`. There
  is no automatic report-context timer in the active runtime.
- Container Git config trusts only `safe.directory=/opt/glotm-context/repo`, and
  `GIT_OPTIONAL_LOCKS=0` avoids lock attempts against the read-only mount.
- `HERMES_CODEX_AUTO_ACCEPT_CODEX_APPS_GITHUB` is absent. Codex Apps GitHub write elicitations
  therefore default to refusal.
- The container has no relay SSH key, writable GloTm clone, GitHub write capability, or host
  environment mount.

## Notes

Hermes skills are stored under `~/.hermes/skills/` by default. External skill directories are not a
security boundary if writable by the Hermes process; use filesystem permissions and restricted
profiles for protection. The legacy `-draft.md` filename is retained to avoid breaking existing
links; its status and content are authoritative.
