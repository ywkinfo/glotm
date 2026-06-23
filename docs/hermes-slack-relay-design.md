# Hermes Slack B-relay 설계 (제안)

> **Status: proposal only / not active / does not supersede runbook or incident doc.**
> 이 문서는 **채택된 운영 변경이 아니다.** 현재 정본 목표 상태는
> [`hermes-incident-20260623.md`](hermes-incident-20260623.md)(PR #93)의
> **"`@Hermes` 자율 응답 제거, GloTm은 ssh-only"**다. 본 B-relay는 그 결정을 되돌리는 게 아니라
> **owner가 추후 재결정할 때 적용할 후보 설계**다. 운영 정본은
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

- Hermes 컨테이너에 **GitHub write token 미주입.**
- Hermes 컨테이너에 **host env 미주입.**
- Hermes 컨테이너에 **writable GloTm clone 미마운트.**
- (P4에서만) relay SSH key는 **제한된 발화 권한**으로만(§6).

이는 새 패턴이 아니다 — 기존 bounded operator도 동일 원리로 컨테이너에 "GitHub token·host env를 넘기지
않고 worktree와 Codex auth volume만 mount"한다(runbook "복구/readiness 점검" 절).

## 4. 컨텍스트 주입 (분석용)

열린 "검토해줘" 대화를 위해 Hermes에 GloTm 맥락이 필요하면, **writable primary clone을 주지 않는다.**
대신 공개 repo의 **read-only / shallow 체크아웃**, 또는 **문서 snapshot**만 제공한다.

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
- **report-only 보정**: `@Hermes`는 writable clone·SSH가 없어 **"현재 main 실측"을 할 수 없다.** 따라서:
  - 보고에 **사용한 context 종류(read-only checkout / snapshot) · commit SHA · snapshot 시각**을
    반드시 명시.
  - 실측·재현하지 못한 항목은 **"미검증"**으로 표기(단정 금지).

## 8. `~/.hermes` 설정 영속성

Hermes 설정 정본은 host `~/.hermes/`이며 컨테이너 `/opt/data`로 마운트된다(Hermes 설정 문서).
**container restart/update엔 유지되지만, Hostinger OS 재배포/템플릿 재설치엔 백업 없으면 소실**될 수
있다(컨테이너 재생성 전례: 2026-06-20). → GloTm 스킬·allowlist를 넣기 전에 **`~/.hermes` 백업** 절차를 둔다.

## 9. owner 실행 전 체크리스트 (단계별)

- **P0 결정/확인**: 봇 재가동(B-relay) vs ssh-only 유지. 재가동은 **격리 해제가 아니라 restricted
  profile로 재가동**(Slack gateway만 제한적 재활성화; `/opt/hermes` 권한 재개방 아님). Slack revoke 보류.
  채널명 확정(현재 `#glotm_hermes`).
- **P1 능력 차단(최우선)**: `hermes-agent-zykj` run-user·마운트 점검 → GitHub write token 미존재,
  writable GloTm clone 미마운트, host env 미주입 확인(있으면 제거).
- **P2 report-only 스킬**: §7 보고 spec대로 답하고 **SSH 실행 능력 없는** 스킬 추가. (선택) gateway
  모델 Claude 전환. `~/.hermes` 백업.
- **P3 manual bridge**: `@Hermes`=제안만, owner=발화. relay key 없음.
- **P4 auto relay**: owner 승인 + 토큰 전환 + §6 relay key 하드닝(양층) 후에만.

## 10. 검증 (단계별)

- **P1**: 컨테이너 셸에서 GloTm write 시도가 실패 / GitHub token 부재 확인.
- **P2**: `@Hermes`가 보고만 하고 `ssh hermes-host`를 실행하지 못함 확인. 보고에 context 종류·SHA·
  snapshot 시각·미검증 표기 포함 확인.
- **P4**: forced-command가 non-allowlisted slug 거부 + 감사 로그 기록 + gateway allowlist 외 사용자
  차단 확인.

## 11. 경계 / 비범위

- 이 문서는 **제안**이며 runbook/charter/incident 정본을 대체하지 않는다.
- VPS/Slack 변경·토큰·relay key·자동화는 전부 **owner**(charter 승인 필수). 본 문서는 repo 설계 문서일 뿐.
- **자동 발화(P4)는 owner 승인 + 토큰 전환 전까지 보류.** 채택 시 runbook/charter reconcile은 별도 doc-PR.
