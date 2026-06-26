# Hermes Slack B-relay 설계와 운영 상태

> **Status (2026-06-25): P2 live read-only context active(canary 통과) · P3 = owner manual SSH · P4 = 비범위.**
> 본 B-relay 설계 중 **P2 report-only advisor만 배포·검증 완료**됐다(정본:
> [`hermes-report-only-skill-draft.md`](hermes-report-only-skill-draft.md), actor 지도
> [`../AGENTS.md`](../AGENTS.md)). **P3**(manual bridge)는 owner가 직접 `ssh hermes-host <slug>`를
> 발화하는 기존 경로이고, **P4**(auto relay)는 owner 승인 + 토큰 전환 전까지 **비범위**다. 운영 정본은
> [`../Harness/Hermes-Operating-Charter.md`](../Harness/Hermes-Operating-Charter.md)(정책)와
> [`hermes-operations-runbook.md`](hermes-operations-runbook.md)(런타임)이며, 충돌 시 그쪽이 우선한다.

## 1. 배경

2026-06-23 조사에서 owner가 Slack에서 쓰는 `@Hermes`가 GloTm bounded operator가 아니라 `/opt/hermes`의
범용 Nous Hermes Agent였음이 확인됐다(misroute, 격리 완료 — incident 문서 참조). owner는 "현재 슬랙봇을
GloTm 운영에 계속 쓰고 싶다"고 결정했고, 안전 경로로 **B-relay**를 합의했다.

핵심 명제: **"Hermes가 GloTm을 편집한다"가 아니라, "Hermes Slack gateway가 GloTm 대화창 역할을 하고,
모든 변경은 기존 `/srv/hermes/glotm-hermes` bounded operator의 allowlisted SSH task(`ssh hermes-host
<slug>`)만 호출한다"**이다. "현재 슬랙봇 그대로"는 **UX 연속성(같은 채널·봇 대화 경험)**의 의미일 뿐,
운영 모델은 gateway=대화창 / 실행=기존 forced-command runner relay다.

## 2. 용어 (정본 구분)

| 구분 | 값 | 근거 |
|---|---|---|
| 컨테이너(정본) | `hermes-agent-zykj` | runbook "VPS truth" |
| 이미지 | `ghcr.io/hostinger/hvps-hermes-agent` | owner VPS 격리 시 확인(2026-06-23). 미확인 환경에선 "hPanel/이미지 표시명"으로 낮춰 표기 |
| 제품 | Nous Hermes Agent | Hostinger 원클릭 배포 |
| Slack 워크스페이스 | `hermes-espanol-kanban-lab` (기술 id `hermesespanol-kb`) | runbook "칸반" |
| Slack 채널 | `#glotm_hermes` (`C0B4W9B3CQ4`) | Slack MCP 확인 |
| 봇 | `@Hermes` (user `U0B4PDKTUDB`, `Bot:Yes`) | Slack MCP 확인 |
| bounded operator | `/srv/hermes/glotm-hermes` + clone `/srv/hermes/glotm` | runbook "VPS truth" |

## 3. 안전 경계 — "능력 차단"만이 하드 경계

**Hermes 자체 안전장치는 하드 경계로 취급하지 않는다.** 공식 문서상 approval은 `off`/YOLO로 끌 수 있고,
Docker backend에서는 "컨테이너가 경계"라는 이유로 위험 명령 검사가 skip될 수 있다(Hermes security 문서).
따라서 **유일한 하드 경계는 능력(capability) 차단**이다:

- Hermes 컨테이너에 **직접 GitHub write token 미주입.**
- Codex Apps GitHub write 확인의 **자동승인 플래그 비활성화**(write elicitation은 기본 거부).
- Hermes 컨테이너에 **host env 미주입.**
- Hermes 컨테이너에 **writable GloTm clone 미마운트.**
- (P4에서만) relay SSH key는 **제한된 발화 권한**으로만(§6).

이는 새 패턴이 아니다 — 기존 bounded operator도 동일 원리로 컨테이너에 "GitHub token·host env를 넘기지
않고 worktree와 Codex auth volume만 mount"한다(runbook "복구/readiness 점검" 절).

## 4. 컨텍스트 주입 (분석용)

열린 "검토해줘" 대화를 위해 Hermes에 GloTm 맥락이 필요하면, **writable primary clone을 주지 않는다.**
대신 공개 repo의 **read-only / shallow 체크아웃**을 제공한다. 문서 snapshot은 live checkout 장애 시
사실을 최신 상태로 단정하지 않는 fallback일 뿐, 현재 primary context가 아니다.

### 4.1 Active: live read-only checkout

> **Status: active (2026-06-25)** — host-side 구현(`glotm-hermes`:
> `lib/refresh-report-context.sh`, `scripts/install-report-context.sh`,
> `scripts/doctor-report-context.sh`, systemd timer)을 VPS에 배포했고 doctor 및 Slack canary를 통과했다.

기존 §4의 두 선택지 중 **read-only 체크아웃 분기를 live로** 격상했다. 동결 snapshot 대신 **갱신되는**
context를 쓰되 능력 경계(§3)는 그대로 둔다 — 공개 repo라 **토큰이 필요 없고**, 마운트는 **read-only**다.

- **Host-side**: `/srv/hermes/report-context/repo`를 15분 systemd timer로 `origin/main`과 ff-sync
  (`git fetch` → `merge --ff-only`; dirty/divergence는 fail-closed로 stale 유지, 자동 reset 없음).
  credential은 refresh 시점에 차단(HOME 격리 + `GIT_CONFIG_*` + `GIT_ASKPASS=/bin/false`).
- **Container mount**: `/srv/hermes/report-context` 전체 → `/opt/glotm-context:ro`
  (**`/opt/data` 바깥** — 컨테이너-writable 볼륨 안에 두면 read-only가 무의미). 따라서 checkout은
  `/opt/glotm-context/repo`, metadata는 `/opt/glotm-context/metadata.json`에서 함께 보인다.
- **Container Git 설정**: owner는 gateway 컨테이너에서 exact path
  `safe.directory=/opt/glotm-context/repo`만 신뢰하도록 설정하고(`safe.directory=*` 금지),
  `GIT_OPTIONAL_LOCKS=0`을 환경에 둔다. read-only bind mount가 쓰기 하드 경계이며 이 Git 설정은
  ownership 검사와 불필요한 lock 시도만 제어한다.
- **Advisor**: `/opt/glotm-context/repo`의 파일·`git` 이력을 `read-grounded`로 읽고,
  `/opt/glotm-context/metadata.json`에서 `Commit`·`Refreshed`·`Freshness`를 보고 헤더에 채운다.
  30분 초과는 `stale`, metadata 손상·HEAD 불일치는 `unknown`. test/health lane 실행은 여전히
  `미검증`(lane-verified는 owner-work).
- **승격 완료**: active skill 헤더는 `Snapshot` 대신 `Refreshed`/`Freshness`를 사용한다.

## 5. 모델 레이어 분리

두 모델은 별개다(하나를 바꿔도 다른 하나는 안 바뀐다):
- **(a) Hermes gateway 모델**(대화·분석): Anthropic/Claude/OpenAI/커스텀 엔드포인트로 **교체 가능**.
- **(b) bounded operator 실행 런타임**: **Codex Auth(ChatGPT 구독, `glotm-hermes-codex`)** —
  `glotm-hermes/docs/SETUP.md` 기준.

relay는 (b)를 그대로 호출하므로 (a)를 Claude로 바꿔도 operator는 Codex다. operator 런타임까지 바꾸는
것은 **별도 설계**이며, "(a)를 Claude로 바꾸면 작업 품질이 올라간다"는 단정은 하지 않는다.

## 6. 단계 posture (report-only → manual → auto)

> 현재 정본은 **Slack-first manual ops**(runbook "트리거 모델": 자동 실행 없음, Slack은 기록·감사
> trail, 유일 트리거는 owner/admin SSH). 아래는 그 위에 얹는 단계.

- **P2 report-only**: `@Hermes`는 read-only context로 **분석·보고만**. SSH 실행 능력 없음.
- **P3 manual bridge**: `@Hermes`는 **권장 slug + 근거만 제시**, **owner가 직접** `ssh hermes-host
  <slug>` 발화(runbook "Slack-first manual task rhythm" 그대로). **`@Hermes`에 relay key 없음.**
- **P4 auto relay**: `@Hermes`가 직접 `ssh hermes-host <slug>`를 발화. **owner 승인 필수**
  (charter "owner 승인 필수": Slack automation/forced-command 변경). **선결**: ChatGPT→API/Business
  토큰 전환(runbook "로드맵") + 아래 relay key 하드닝.

### relay key 하드닝 체크리스트 (P4 전용)

relay key는 GitHub write를 직접 못 해도 **bounded write 파이프라인을 발화하는 고위험 자격증명**이다.
양층 방어:
- **① SSH 측**: 전용 키(공유 금지)·forced-command·no-forwarding(no-agent/no-port/no-X11)·
  slug allowlist·감사 로그·owner 승인 경계.
- **② Hermes gateway 측**(공식 Hermes 지원): `SLACK_ALLOWED_USERS`/`GATEWAY_ALLOWED_USERS`
  사용자 allowlist, `GATEWAY_ALLOW_ALL_USERS=false`, env/file passthrough 점검(Docker backend는
  위험명령 검사 skip 가능하므로 gateway 층에서도 발신자/명령을 제한).

## 7. Slack 보고 spec

- **한국어로 짧게.**
- 포함: `task slug` · 허용/금지 파일면 · 검증 결과 · `PR URL` 또는 `NO_CHANGES` · owner 핸드오프 항목.
- 변경은 **직접 하지 않고** bounded operator 결과만 보고. 법률·사실 source는 수정이 아니라 **queue
  제안만**.
- **report-only 보정**: `@Hermes`는 live read-only checkout으로 repository state를
  **`read-grounded`**하게 확인할 수 있지만, test/build/health lane을 실행한 것으로 간주하지 않는다.
  - 보고는 `Context` · `Commit` · `Refreshed` · `Freshness` · `Mode` 5개 헤더로 시작한다.
  - metadata/HEAD 불일치나 손상은 `unknown`, 30분 초과는 `stale`로 낮춘다.
  - lane을 실제 실행하지 않은 항목은 **`미검증`**으로 표기한다.

## 8. `~/.hermes` 설정 영속성

Hermes 설정 정본은 host `~/.hermes/`이며 컨테이너 `/opt/data`로 마운트된다(Hermes 설정 문서).
**container restart/update엔 유지되지만, Hostinger OS 재배포/템플릿 재설치엔 백업 없으면 소실**될 수
있다(컨테이너 재생성 전례: 2026-06-20). → GloTm 스킬·allowlist를 넣기 전에 **`~/.hermes` 백업** 절차를 둔다.

## 9. owner 실행 전 체크리스트 (단계별)

- **P0 결정/확인**: 봇 재가동(B-relay) vs ssh-only 유지. 재가동은 **격리 해제가 아니라 restricted
  profile로 재가동**(Slack gateway만 제한적 재활성화; `/opt/hermes` 권한 재개방 아님). Slack revoke 보류.
  채널명 확정(현재 `#glotm_hermes`).
- **P1 능력 차단(최우선)**: `hermes-agent-zykj` run-user·마운트 점검 → 직접 GitHub write token 미존재,
  writable GloTm clone 미마운트, host env 미주입 확인. GloTm 파일면은
  `/srv/hermes/report-context` → `/opt/glotm-context:ro` bind mount만 허용한다.
- **P2 report-only 스킬**: §7 보고 spec대로 답하고 **SSH 실행 능력 없는** 스킬을 배포했다. 정본은
  [`hermes-report-only-skill-draft.md`](hermes-report-only-skill-draft.md)(legacy filename 유지).
  `#glotm_hermes` channel skill binding + 매 턴 channel prompt를 적용했고 `~/.hermes` 백업을 남겼다.
  15분 refresh timer, exact-path `safe.directory`, `GIT_OPTIONAL_LOCKS=0`도 배포됐다.
- **P3 manual bridge**: `@Hermes`=제안만, owner=발화. relay key 없음.
- **P4 auto relay**: owner 승인 + 토큰 전환 + §6 relay key 하드닝(양층) 후에만.

## 10. 검증 (단계별)

- **P1**: 컨테이너 셸에서 GloTm write 시도가 실패 / GitHub token 부재 확인.
- **P2**: `@Hermes`가 보고만 하고 `ssh hermes-host`를 실행하지 못함 확인. 보고에 context 종류·SHA·
  refresh 시각·freshness·미검증 표기 포함 확인. 2026-06-25 read-grounded/evidence-boundary/refusal
  canary 통과. canary 시간대에 새 bounded run/worktree/branch/PR 없음.
- **P2 freshness fault injection (잔여 리스크 close-out)**: advisor의 freshness/retry 판단은
  **LLM-side**라 host unit test가 아니라 **canary**로 검증한다(host 자동 테스트는 원자적 metadata 기록·
  drift 자가치유·doctor mismatch 감지까지 이미 커버하며, 별도 LLM eval 인프라는 범위 밖). 배포 후 1회 수행:
  - **stale metadata**: `metadata.json`의 `refreshed_at`을 30분 초과 과거로 바꾸거나 refresh timer를
    잠시 멈춘 뒤 → 다음 보고 헤더가 `Freshness: stale`인지 확인.
  - **metadata/HEAD 불일치**: `metadata.json`의 `commit_sha`를 checkout `HEAD`와 다르게 변조 →
    헤더가 `Freshness: unknown`이고 저장소 상태를 단정하지 않는지 확인.
  - **반복 HEAD 변경(retry-once)**: 보고 도중 checkout `HEAD`를 1회 바꾸면 1회 재시도, 다시 바뀌면
    저장소 상태를 단정하지 않는지 확인.
  - 변조한 metadata가 다음 15분 ff-sync에서 자가치유(`commit_sha`를 HEAD와 일치하게 재기록)되는지 확인.
- **P4**: forced-command가 non-allowlisted slug 거부 + 감사 로그 기록 + gateway allowlist 외 사용자
  차단 확인.

## 11. 경계 / 비범위

- 이 문서는 P2의 설계·운영 상태 기록이며 runbook/charter 정본을 대체하지 않는다.
- VPS/Slack 변경·토큰·relay key·자동화는 전부 **owner**(charter 승인 필수). 본 문서는 repo 설계 문서일 뿐.
- **자동 발화(P4)는 owner 승인 + 토큰 전환 전까지 보류.** 채택 시 runbook/charter reconcile은 별도 doc-PR.
