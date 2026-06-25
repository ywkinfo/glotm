# Hermes Operations Runbook

이 문서는 GloTm(`ywkinfo/glotm`)을 보조 운영하는 Hermes 에이전트의 **운영 레이어(런타임 pointer)**다.
"어떻게 실행하는가"만 다룬다.

- **정책 정본**: [`../Harness/Hermes-Operating-Charter.md`](../Harness/Hermes-Operating-Charter.md).
  역할·권한·금지·owner 승인 경계 같은 정책은 차터를 기준으로 본다. 충돌 시 **차터가 우선**한다.
- **셋업 정본**: 오케스트레이터 저장소 `glotm-hermes`의 `docs/SETUP.md`. 상세 부트스트랩·보안 설계는
  그쪽이 정본이며, 이 문서는 GloTm 쪽에서 알아야 할 고유 사실만 요약한다(중복 정의 금지).

> 이 문서는 mutable 운영 수치(phase·tier·lifecycle)를 들고 있지 않다. 그런 값은
> `PROJECT-OVERVIEW.md`, `src/products/registry.ts`를 기준으로 본다.

## 오케스트레이터 정체 (요약)

- **무엇**: GloTm을 보조 운영하는 **V2 bounded operator**. Hostinger VPS의 `hermes-agent-zykj`
  컨테이너에 설치된 Hermes 에이전트를 GloTm 운영 에이전트로 강화한 것이며, task별 prompt·allowlist·
  denylist·semantic profile을 분리한다. (정체·권한의 정책 정의는 차터.)
- **소스**: 로컬 `~/glotm-hermes`, remote `github.com/ywkinfo/glotm-hermes`.
- **GloTm repo와의 관계**: Hermes는 이 저장소를 *읽고 draft PR을 제안*할 뿐, merge·배포는 owner가 한다.

## VPS truth (경로)

| 항목 | 경로 |
|------|------|
| state root | `/srv/hermes` |
| 오케스트레이터 체크아웃(`HERMES_HOME`) | `/srv/hermes/glotm-hermes` |
| GloTm primary clone(`GLOTM_PRIMARY`) | `/srv/hermes/glotm` |
| per-run 로그/아티팩트 | `/srv/hermes/runs/<RUN_ID>` |
| scoped PAT(host 전용, 600) | `/srv/hermes/secrets/gh-token` |
| Codex auth(영속, 토큰 자동갱신) | `/srv/hermes/codex/auth.json` |
| report-context read-only root mount *(pending)* | host `/srv/hermes/report-context` → 컨테이너 `/opt/glotm-context:ro` |
| report-context checkout leaf *(pending)* | `/opt/glotm-context/repo` |
| report-context metadata leaf *(pending)* | `/opt/glotm-context/metadata.json` |
| report-context refresh timer *(pending)* | `glotm-report-context-refresh.timer` (15min ff-sync) |

VPS HostName: `srv1650501.hstgr.cloud`, runtime container `hermes-agent-zykj`, service user `hermes`.

> **`/opt/hermes` 경고**: Hermes 설계에 `/opt/hermes`는 **없는 경로**다. GloTm 작업이 거기서 돌고
> 있다면 다른/일반 에이전트로 **misroute**된 것이다 — 중단하고 `/srv/hermes/glotm-hermes` 기준으로
> 라우팅을 바로잡는다.
>
> 구체적으로, 워크스페이스 `hermesespanol-kb`의 Slack 봇 **`@Hermes`(user `U0B4PDKTUDB`)는 이
> `/opt/hermes` 컨테이너의 NousResearch Hermes-Agent**이며 GloTm bounded operator가 **아니다**.
> 2026-06-23 misroute(GloTm 아닌 `/opt/hermes/website` 분석) 이후, owner는 같은 컨테이너를
> **능력 차단된 P2 report-only advisor**로 재활용했고 2026-06-24 canary를 통과시켰다(정본
> [`hermes-report-only-skill-draft.md`](hermes-report-only-skill-draft.md), actor 지도
> [`../AGENTS.md`](../AGENTS.md)). 따라서 현재 `@Hermes`는 **read-only 조언(intake/triage)에는
> sanctioned이되 실행 능력이 없는 advisor**이며, **모든 실행(변경)은 ssh-only**다 — 운영 intent의
> 집행은 `ssh hermes-host <slug>` → `/srv/hermes/glotm`(아래 트리거 모델)만 쓴다. 배경·증거는
> [`hermes-incident-20260623.md`](hermes-incident-20260623.md)(2026-06-23 misroute 사건).

## 현재 task surface (V2)

모든 task는 **draft PR only · no direct merge · no force-push** 원칙을 공유한다. 실질 통제는 host-side
policy gate이며, task별 allow/deny와 semantic profile이 함께 적용된다.

| Task slug | 역할 | 차터 권한 tier |
|-----------|------|----------------|
| `sync-derived-docs` | registry-파생 문서 drift 수정 | 자율(작업만) |
| `audit-content-quality` | 콘텐츠 품질 audit queue 작성 | 자율(작업만) |
| `webapp-quality-maintenance` | 웹앱/runtime/테스트/SEO 품질 유지보수 | draft PR 권장 |
| `static-trust-maintenance` | trust/static mirror 회귀 수정 | draft PR 권장 |

### task별 allow / deny (policy gate 면)

- **`sync-derived-docs`**
  - allow: `PROJECT-OVERVIEW.md`, `docs/portfolio-scorecard.md`, `docs/buyer-narrative.md`
  - deny: `src/products/registry.ts`(수기 변경), workflow, deps, 콘텐츠 source, generated
- **`audit-content-quality`**
  - allow: `docs/hermes-content-quality-queue.md`(append-only)
  - deny: source content 직접 편집(법률/사실 판단은 queue 제안으로만), 그 외 전부
- **`webapp-quality-maintenance`**
  - allow: `src/`·`scripts/`·`e2e/` 중 runtime/회귀 코드
  - deny: `src/products/registry.ts`, `src/products/scorecard.ts`, `*/content/**`, generated,
    `public/generated/`, `dist/`, workflow, deps
- **`static-trust-maintenance`**
  - allow: `scripts/seo.ts`, `scripts/seo.test.ts`, 제한된 문서, `package.json` script wiring
  - deny: 법률 copy 재작성, workflow, lockfile, workspace deps

> **어느 task도 `*/content/source/**`·`registry.ts`·`scorecard.ts`·generated 산출물을 편집하지 않는다.**
> 법률·사실 source는 queue로만 제안하고 수정 여부는 owner가 결정한다(스코핑 정책은 차터).

운영 원칙:

- `health:*`, `test:seo`, task-specific verification은 task가 PR을 열기 전에 가능한 범위에서 실행한다.
- no-op이면 원격 부작용 없이 로그만 남기고 종료한다(`NO_CHANGES`).

## 트리거 모델 (Slack = human bridge)

- **자동 실행은 없다.** VPS에는 systemd·cron·**Slack poller가 전무**하다. 따라서 Slack 채널 글은
  **사람이 남기는 기록·감사 trail일 뿐 자동으로 task를 실행하지 않는다.**
  - 주의: 워크스페이스의 `@Hermes` 봇이 멘션에 응답하는 것은 **P2 report-only advisor**(능력 차단·
    read-only)로서 sanctioned이지만 **task를 실행하지 못한다** — advisor는 실행 트리거가 아니다.
    bounded operator의 유일한 정규 **실행** 트리거는 아래 `ssh hermes-host <task-slug>`다.
- 유일한 트리거는 owner/admin의 `ssh hermes-host <task-slug>`이며, VPS의 forced-command가 slug를
  `SSH_ORIGINAL_COMMAND`로 받아 task allowlist를 통과시킨다. run 로그는 `/srv/hermes/runs/<RUN_ID>`.
- 즉 현재 운영은 **Slack-first manual ops**다: owner가 Slack에 intent·slug를 남기고 → owner/admin이
  SSH로 직접 트리거하고 → 결과(PR URL·`NO_CHANGES`·실패 snippet)를 Slack에 보고한다.
- Slack에는 merge/force-push, workflow 편집, 법률 source 편집, GitHub token 접근 권한을 주지 않는다.
- Slack slash-command 자동 실행과 GitHub Actions scheduled trigger는 **post-migration roadmap**이다
  (아래 로드맵).

### Slack-first manual task rhythm

| Slack 지시 예시 | owner/admin 실행 | Hermes 기대 동작 |
|-----------------|------------------|------------------|
| `Hermes: sync-derived-docs 실행. registry drift만.` | `ssh hermes-host sync-derived-docs` | 파생 문서 drift만 PR/`NO_CHANGES` 보고 |
| `Hermes: webapp-quality-maintenance. CI/runtime 회귀만.` | `ssh hermes-host webapp-quality-maintenance` | 웹앱 품질 회귀를 bounded diff로 draft PR |
| `Hermes: audit-content-quality. source 편집 금지.` | `ssh hermes-host audit-content-quality` | 콘텐츠 품질 queue만 갱신 |
| `Hermes: static-trust-maintenance. trust mirror 회귀만.` | `ssh hermes-host static-trust-maintenance` | static trust parity 회귀만 수정 |

## 칸반 (Slack 워크스페이스 `hermes-espanol-kanban-lab`)

Slack 채널이 사람 조정 surface이므로, 작업은 아래 컬럼으로 흐른다(자동 이동 없음 — owner가 옮긴다).

```
Intake → Ready(slug/allowlist 확인) → Human Bridge(ssh 실행 대기) → Running
       → PR/Review 또는 NO_CHANGES → Owner Handoff → Done / Blocked
```

- **Ready**: task slug와 allow/deny 면이 확정됐는지 확인하는 게이트.
- **Human Bridge**: owner/admin이 `ssh hermes-host <slug>`를 실제 실행하기 전 대기.
- **PR/Review 또는 NO_CHANGES**: 산출이 PR이면 owner 리뷰·merge 대기, 변경 없으면 `NO_CHANGES`로 종료.
- **Owner Handoff**: 코드/CI로 종결 불가한 owner 전용 검증 항목(아래 체크리스트).
- WIP(In-Progress/PR) ≤ 2 — 1인 owner가 병목이므로 PR 폭주를 막는다.

### 카드 schema

`task-id` · `slug` · `목표` · `허용 파일면` · `금지면` · `run-id` · `검증 명령` · `PR URL` ·
`owner 전용 항목(yes/no)` · `차단면 포함 여부`

## Hermes soul 스펙 (참조 사본)

soul/persona 정본은 GloTm repo가 아니라 아래 **2개 canon**으로 나뉜다. 이 절은 GloTm 쪽 **참조
사본**이며, 각 canon이 바뀌면 해당 sync 줄과 본문을 함께 갱신한다.

> **(i) bounded operator canon** — `glotm-hermes` repo: 공통 soul
> `prompts/_bounded-operator-preamble.md`(4 task 프롬프트 앞에 주입) + per-task `prompts/<task>.md` +
> `lib/task-config.sh`, 버전 핀 `prompts/PROMPT_VERSION`(현재 `@2`). **마지막 sync: 2026-06-24.**
>
> **(ii) Slack P2 report-only advisor canon** — 정본은 GloTm
> [`hermes-report-only-skill-draft.md`](hermes-report-only-skill-draft.md)(active spec; legacy filename 유지,
> 2026-06-24 canary 통과). 여기서는 pointer만 두고 내용을 중복하지 않는다. 이 advisor는 `/opt/hermes`
> 컨테이너의
> **능력 차단된** report-only 스킬이며 bounded operator와 별개 actor다(actor 지도는 `../AGENTS.md`).

보고 규약(공통):

- **한국어로 짧게** 보고한다.
- 모든 보고에 `task slug` · `허용 파일면` · `검증 결과` · `PR URL 또는 NO_CHANGES` · `owner 핸드오프
  항목`을 포함한다.
- 단정 전 현재 `main`을 실측한다(차터 Cardinal 검증룰).
- 불확실하거나 반복 실패가 누적되면 멈춰서 보고한다.

## PAT rotation (마감 `2026-07-15`)

만료 후엔 push/PR이 실패한다. 그 전에:

1. GitHub Settings → Developer settings → Personal access tokens → 신규 발급.
   scope는 **`ywkinfo/glotm` 단일 repo**, `Contents:write` + `Pull requests:write` (광역 repo scope 아님).
2. VPS 접속 후 기존 `/srv/hermes/secrets/gh-token` 백업.
3. `~/.local/bin/install-glotm-hermes-token` 실행.
   - ※ 이 스크립트가 old token revoke까지 자동화하는지 **확인 필요**. 미자동이면 5단계를 수동으로.
4. `sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh`로 connectivity 확인(전 항목 OK).
5. 새 토큰 정상 확인 후 GitHub에서 old token revoke.

## owner 전용 검증 핸드오프 체크리스트

Hermes가 코드/CI만으로 종결할 수 없어 owner에게 넘기는 항목(정책 근거는 차터):

- [ ] Search Console 색인 상태 확인(주요 URL)
- [ ] GA4 DebugView에서 핵심 이벤트가 실 트래픽으로 도착하는지 확인
- [ ] live interactive QA(drawer close·검색·continue reading·report·legal navigation 브라우저 확인)

## 복구 / readiness 점검

```bash
# admin(root/sudo) 세션에서:
sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh    # 전 항목 [ OK ] 여야 트리거 가능
# 누락/손상 시 (idempotent):
sudo -u hermes -H git clone https://github.com/ywkinfo/glotm-hermes.git /srv/hermes/glotm-hermes  # 미배포 시
cd /srv/hermes/glotm-hermes && sudo scripts/bootstrap.sh        # 권한·deps·이미지·primary clone
```

- **admin 작업 선결**: `bootstrap.sh`/`doctor.sh`는 `sudo`가 필요할 수 있어 별도 admin 경로나 owner
  직접 실행이 필요하다.
- **컨테이너 내부 sandbox**: Hostinger Docker에서는 Codex의 nested `bwrap`/user namespace sandbox가
  막힐 수 있다. 현재 오케스트레이터는 Docker container를 격리 경계로 삼고, 컨테이너 안 Codex에는
  `CODEX_SANDBOX_MODE=danger-full-access`를 명시한다. 컨테이너에는 GitHub token·host env를 넘기지 않고
  worktree와 Codex auth volume만 mount한다.

## 로드맵

- **Slack slash-command 자동 실행/스케줄/외부 입력**을 붙이기 전에 ChatGPT 구독 런타임 → **API 키 또는
  Business/Enterprise 토큰**으로 전환(공개 저장소 자동화 OpenAI 권고). 그 전까지 Slack은 위 human-bridge
  방식으로만 운용한다.
- 서버측 PR-전용 하드 강제는 **non-bypass GitHub App 신원** 전환으로 확보(차터의 머지 자율화 전제).
- 법률·사실 source content 편집은 owner 승인(V2.1/V3) 전까지 audit/queue로만 다룬다.
