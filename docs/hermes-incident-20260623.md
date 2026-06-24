# Hermes Misroute Incident — 2026-06-23

> 상태: **진단 확정(Slack 증거 기반) / 원격 토폴로지·교정은 owner 확인 대기.**
> 작성: GloTm 세션 조사(plan `hermes-7-36-frolicking-ripple.md` 실행). 민감정보(토큰) 미포함.
>
> **갱신(2026-06-24)**: 아래 "ssh-only"는 **2026-06-23 당시의 owner 결정**이다. 이후 owner가 같은
> `/opt/hermes` 컨테이너를 **능력 차단된 P2 report-only advisor**로 재활용하기로 했다(canary-gated;
> 정본 [`hermes-report-only-skill-draft.md`](hermes-report-only-skill-draft.md), actor 지도
> [`../AGENTS.md`](../AGENTS.md)). 이는 그 결정의 후속 발전이며, misroute 사건이 P2 도입을 강제한 인과는
> 아니다. canary 통과 시 이 문서의 ssh-only 절대문은 superseded로 표기한다.

## 0. 한 줄 결론

owner가 Slack에서 `@Hermes`로 요청한 "GloTm 콘텐츠 운영" 검토에 답한 주체는 **GloTm bounded V2
operator(`/srv/hermes/glotm`)가 아니라, 작업 디렉터리가 `/opt/hermes`인 범용 "Hermes" 에이전트
제품**이다. 즉 runbook이 사전 경고한 **misroute가 실제로 발생**했고, 그래서 모든 분석이 GloTm이
아닌 `/opt/hermes/website`(Docusaurus)를 가리켰다.

## 1. Slack 증거 (앵커 메타데이터 — 토큰 없음)

- 워크스페이스: `hermesespanol-kb.slack.com` (= "hermes-espanol-kanban-lab")
- 채널: `#glotm_hermes` (`C0B4W9B3CQ4`)
- 발신 주체: **Hermes 봇** — user id `U0B4PDKTUDB`, username `hermeskanbanlab`,
  Real Name "Hermes", `Bot: Yes`, Timezone `America/Los_Angeles`, email 없음
- 문제 스레드: parent ts `1782121056.916629` (owner, 2026-06-22 18:37 KST,
  "현재 프로젝트에서 콘텐츠 보강이 필요한지 검토해 줘")
- 핵심 분석 메시지: Reply 10, ts `1782124610.314879` (Hermes, 2026-06-22 19:36:50 KST) —
  사용자가 검토 요청한 "운영 루프/콘텐츠 품질" 분석 본문

### 1a. 발신 주체가 `/opt/hermes`에 있음을 보여주는 자기-인용 (스레드 본문)

- Reply 3/10: `</opt/hermes/web/src/i18n/ko.ts>`, `</opt/hermes/website/scripts/prebuild.mjs>`,
  `</opt/hermes/website/scripts/generate-llms-txt.py>`, `</opt/hermes/website/docusaurus.config.ts>`,
  `:paperclip: File: /opt/hermes/README.md` — 전부 `/opt/hermes` 경로.
- Reply 15(플랜 리뷰): "현재 제가 접근한 `/opt/hermes`에서도 prebuild.mjs… 실제로 존재",
  "`/opt/hermes`에는 docs/hermes-operations-runbook.md와 Harness/Hermes-Operating-Charter.md가
  보이지 않았습니다" — **CWD가 `/opt/hermes`임을 스스로 확인**.

### 1b. 런타임이 범용 "Hermes" 제품임을 보여주는 시스템 알림 (스레드 본문)

- Reply 1: ":mailbox_with_mail: No home channel is set for Slack… Type `/hermes sethome`…"
- Reply 2/14: ":information_source: **Codex gpt-5.5** caps context at 272K… `hermes config set
  compression.codex_gpt55_autoraise false`"
- Reply 6: ":floppy_disk: Self-improvement review: **Skill 'project-content-audit' created**."

→ `/hermes` 슬래시 커맨드, home channel, cron job 결과 전달, 자기개선 스킬 생성은 **GloTm bounded
operator의 4-슬러그 설계에 없는 범용 에이전트 기능**이다. 즉 이 Slack 봇은 bounded operator가 아니라
**상시 Slack 연동·자율 실행되는 범용 Hermes 에이전트**다.

## 2. 진단 (cause A 확정, 정밀화)

GloTm 설계는 이 실패를 사전 정의: `docs/hermes-operations-runbook.md:35`("`/opt/hermes`는 설계에
없는 경로 → misroute"), `Harness/Hermes-Operating-Charter.md:25`(동일). 정본 경로는
`GLOTM_PRIMARY=/srv/hermes/glotm`(`runbook:28`).

- **확정**: Slack `@Hermes`(`U0B4PDKTUDB`)는 `/opt/hermes`에서 도는 범용 Hermes 제품이며, owner의
  GloTm 운영 요청에 그 트리 기준으로 답했다 → 보고가 GloTm이 아닌 `/opt/hermes/website`를 분석한
  이유가 여기서 완전히 설명된다(misroute).
- **부수 확정**: runbook이 기술한 "Slack=수동 human bridge, 자동 트리거 전무, 유일 트리거는
  `ssh hermes-host <slug>`"(`runbook:77-82`)는 **실제 배포와 불일치**한다. 실제로는 Slack에
  @멘션하면 범용 Hermes가 실시간 자율 응답한다(home channel·cron·self-improvement 포함).
- **반복 패턴**: 이 봇은 GloTm 트리를 볼 수 없으므로(자기 CWD가 `/opt/hermes`) "없다"는 단정을
  반복한다. 플랜 리뷰에서도 main에 실재하는 charter/runbook(커밋 `346f237`, PR #92, `origin/main`
  ancestor)을 "아직 없음"으로 단정 → `charter:40-43` Cardinal 위반의 구조적 원인이 misroute임.

## 3. 확정 vs. VPS 확인 필요

| 항목 | 상태 |
|---|---|
| Slack 응답 주체 = `/opt/hermes` 범용 Hermes | **확정**(Slack 자기-인용) |
| 보고가 GloTm 아닌 `/opt/hermes/website` 분석 | **확정** |
| Slack 연동이 상시 자율(수동 bridge 아님) | **확정**(home channel/cron/실시간 응답) |
| bounded operator(`/srv/hermes/glotm`)가 실제 배포·동작하는가 | **미확인**(VPS 필요) |
| `/opt/hermes`와 `/srv/hermes`가 같은 컨테이너인가 | **미확인**(VPS 필요) |
| Slack app/token 배선 위치 | **미확인**(VPS 필요, 마스킹) |

## 4. owner 결정 (2026-06-23)

owner가 두 결정을 확정했고 둘 다 같은 방향이다:
1. **Slack 자율 끊고 ssh만** — GloTm 운영 intent는 bounded 경로(`ssh hermes-host <slug>` →
   `/srv/hermes/glotm`)로만. Slack `@Hermes`(=`/opt/hermes` 범용 에이전트)는 GloTm 작업에서
   분리/비활성화.
2. **배포를 문서에 맞게 잠금** — runbook의 "Slack=수동 bridge·poller 전무"가 정본 설계이므로,
   실제 배포에서 Slack 자율 연동을 제거해 배포를 그 설계에 맞춘다(문서는 그대로).

→ 목표 상태: `/opt/hermes` 범용 Hermes의 **GloTm 채널 Slack 자율 응답 제거**, GloTm은 ssh-only.

## 5. 교정 런북 (owner 실행 — admin SSH 필요, 비파괴 → 격리 → 검증)

> 이 세션에는 `hermes-host`(=`hermes` user, forced-command) 별칭만 있고 admin SSH는 없다(SSH 프로브
> 자동 거부됨). 아래는 owner가 root/sudo 세션에서 실행. **토큰 값 출력/공유 금지(마스킹)**, **삭제
> 금지 — 격리·비활성화까지만**.

**(1) 증거 보존(먼저, 비파괴 — 로컬/별도 저장):**
```
ps -ef | grep -iE 'hermes|codex|slack|node'          # args 토큰 마스킹
systemctl list-units --type=service | grep -i hermes
systemctl list-timers | grep -i hermes
sudo -u hermes crontab -l ; ls -la /etc/cron.* /etc/cron.d
git -C /opt/hermes remote -v ; git -C /opt/hermes log --oneline -5
docker ps ; docker inspect hermes-agent-zykj          # mount/env 키 이름만, 값 마스킹
```
**(2) Slack 연동 배선 식별(어떻게 봇이 응답하나):**
```
ls -la /opt/hermes /opt/hermes/website
rg -n "SLACK_BOT_TOKEN|SLACK_APP_TOKEN|SLACK_WEBHOOK_URL|xapp-|xoxb-|socket.?mode" /opt/hermes --glob '!*node_modules*' -l   # 위치만, 값 마스킹
# NousResearch Hermes-Agent의 Slack connector/소켓모드 프로세스·서비스·컨테이너 확인
```
**(3) 격리·비활성화(삭제 아님, 순서 준수):**
- 범용 Hermes의 **Slack connector만** 정지: 해당 systemd service `stop`+`disable` 또는 컨테이너
  `docker stop`, socket-mode 프로세스 종료. (GloTm bounded operator `ssh hermes-host`는 건드리지 않음.)
- Slack 측에서 봇 앱의 **토큰 revoke/rotate** 또는 `#glotm_hermes`에서 앱 제거(워크스페이스 admin).
- 격리 후 owner가 `@Hermes` 멘션 → **무응답**이어야 정상.

**(4) bounded operator 정상 경로 확인(ssh-only가 실제 동작하나):**
```
ls -la /srv/hermes/glotm ; git -C /srv/hermes/glotm remote -v ; git -C /srv/hermes/glotm log --oneline -3
sed -n '1,160p' /srv/hermes/glotm-hermes/scripts/doctor.sh   # 먼저 내용만(side effect 점검)
sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh # 그 다음 readiness(전 항목 [OK])
```

## 6. 검증 (교정 후)
- `@Hermes` Slack 멘션 무응답(자율 연동 제거 확인).
- 정규 경로 `ssh hermes-host audit-content-quality` → 대상 `/srv/hermes/glotm`, 산출
  `docs/hermes-content-quality-queue.md` append 또는 `NO_CHANGES`, 필수 스키마 준수, run 로그
  `/srv/hermes/runs/<RUN_ID>` 생성.

## 7. 후속

- **(적용됨, 이 PR)** runbook `/opt/hermes` 경고에 "Slack `@Hermes`(=`/opt/hermes` NousResearch
  봇)는 GloTm 운영에 쓰지 않으며 ssh-only" 명시 추가 + 트리거 모델 절에 자율응답 경고 cross-ref.
- **(owner)** VPS 격리 실행(§5) — admin SSH 필요, 본 세션 범위 밖.
- **(전제)** 그동안 이 채널에서 받은 Hermes 분석/플랜리뷰는 `/opt/hermes` 기준이라 **GloTm에 대해
  신뢰 불가**임을 전제로 재평가.
