# Hermes Operations Runbook

이 문서는 GloTm(`ywkinfo/glotm`)을 관리하는 Hermes 에이전트의 **운영 레이어**를 GloTm 저장소 안에서
빠르게 파악하기 위한 thin pointer다. 상세 부트스트랩·보안 설계는 오케스트레이터 저장소
`glotm-hermes`의 `docs/SETUP.md`가 정본이며, 이 문서는 그 정본과 GloTm 쪽에서 알아야 할 고유 사실만
요약한다(중복 정의 금지).

> Status: operational reference
> 이 문서는 mutable 운영 수치(phase·tier·lifecycle)를 들고 있지 않다. 그런 값은 `PROJECT-OVERVIEW.md`,
> `src/products/registry.ts`를 기준으로 본다.

## 오케스트레이터 정체

- **무엇**: GloTm을 관리하는 **V2 bounded operator**. Hostinger VPS의 `hermes-agent-zykj` 컨테이너에
  설치된 Hermes 에이전트를 GloTm 운영 에이전트로 강화하는 것이 이 운영 레이어의 전제다.
  task별 prompt·allowlist·denylist·semantic profile을 분리한다.
- **소스**: 로컬 `~/glotm-hermes`, remote `github.com/ywkinfo/glotm-hermes`.
- **정본 셋업 문서**: `glotm-hermes/docs/SETUP.md`, `glotm-hermes/README.md`.
- **GloTm repo와의 관계**: Hermes는 이 저장소를 *읽고 draft PR을 제안*할 뿐, 머지·배포는 사람이 한다.
- **기본 운영 UX**: Slack 채널에서 owner가 지시하고 Hermes가 보고한다. 실제 실행은 `hermes-agent-zykj`
  안의 restricted forced-command 경계를 통과한다.

## VPS truth (경로)

| 항목 | 경로 |
|------|------|
| state root | `/srv/hermes` |
| 오케스트레이터 체크아웃(`HERMES_HOME`) | `/srv/hermes/glotm-hermes` |
| GloTm primary clone(`GLOTM_PRIMARY`) | `/srv/hermes/glotm` |
| per-run 로그/아티팩트 | `/srv/hermes/runs/<RUN_ID>` |
| scoped PAT(host 전용, 600) | `/srv/hermes/secrets/gh-token` |
| Codex auth(영속, 토큰 자동갱신) | `/srv/hermes/codex/auth.json` |

VPS HostName: `srv1650501.hstgr.cloud` (Hostinger), runtime container `hermes-agent-zykj`, service user `hermes`.

## 현재 task surface (V2)

모든 task는 **draft PR only · no direct merge · no force-push** 원칙을 공유한다. 실질 통제는
host-side policy gate이며, task별 allow/deny와 semantic profile이 함께 적용된다. 소유자 PAT는 main ruleset을
기술적으로 bypass할 수 있으므로 잔여 리스크 P0-7은 남아 있고, 하드닝 단계에서는 non-bypass GitHub App 신원으로
전환한다.

| Task slug | 역할 | 허용 편집면 | 차단/승인 경계 |
|-----------|------|-------------|----------------|
| `sync-derived-docs` | registry-derived 문서 drift 수정 | `PROJECT-OVERVIEW.md`, `docs/portfolio-scorecard.md`, `docs/buyer-narrative.md` | registry·workflow·deps·콘텐츠 source 차단 |
| `audit-content-quality` | 콘텐츠 품질 audit queue 작성 | `docs/hermes-content-quality-queue.md`만 | source content 직접 편집 금지; 법률/사실 판단은 queue로만 제안 |
| `webapp-quality-maintenance` | 웹앱/runtime/테스트/SEO 품질 유지보수 | `src/`, `scripts/`, `e2e/` | registry·scorecard·workflow·deps·generated·content source 차단 |
| `static-trust-maintenance` | trust/static mirror 회귀 수정 | `scripts/seo.ts`, `scripts/seo.test.ts`, 제한된 문서와 `package.json` script wiring | 법률 copy 재작성·workflow·lockfile·workspace deps 차단 |

운영 원칙:

- Hermes가 더 적극적으로 움직여야 하는 영역은 **기계 검증 가능한 drift, webapp 품질, static trust parity,
  콘텐츠 품질 queue**다.
- 법률·사실 source content는 Hermes가 직접 고치지 않는다. Hermes는 불일치·저밀도·근거 부족 항목을 queue로
  올리고, owner가 source 수정 여부를 결정한다.
- `health:*`, `test:seo`, task-specific verification은 task가 PR을 열기 전에 가능한 범위에서 실행한다.
- no-op이면 원격 부작용 없이 로그만 남기고 종료한다.

## 운영 주의사항

- **PAT 로테이션 마감: `2026-07-15`.** 만료 전 `/srv/hermes/secrets/gh-token` 갱신
  (scope: `ywkinfo/glotm` 단일, Contents:write + Pull requests:write).
- **`/opt/hermes` 경고**: Hermes 설계에 `/opt/hermes`는 **없는 경로**다. GloTm 작업이 `/opt/hermes`에서
  돌고 있다면 GloTm 오케스트레이터가 아닌 **다른/일반 에이전트로 misroute**된 것이다 — 중단하고
  `/srv/hermes/glotm-hermes` 기준으로 라우팅을 바로잡는다.
- **admin 작업 선결**: `bootstrap.sh`/`doctor.sh`는 `sudo`가 필요할 수 있으므로 별도 admin 경로나 owner 직접
  실행이 필요하다.
- **컨테이너 내부 sandbox**: Hostinger Docker에서는 Codex의 nested `bwrap`/user namespace sandbox가 막힐 수
  있다. 현재 오케스트레이터는 Docker container를 격리 경계로 삼고, 컨테이너 안의 Codex에는
  `CODEX_SANDBOX_MODE=danger-full-access`를 명시한다. 컨테이너에는 GitHub token·host env를 넘기지 않고,
  worktree와 Codex auth volume만 mount한다.

## Slack / CLI 경계

- **Slack 채널이 기본 운영 표면**이다. owner는 채널에 task intent와 slug를 남기고, Hermes는 incoming
  webhook으로 결과·PR URL·실패 snippet을 보고한다. 채널 기록이 지시/보고의 기준 감사 trail이다.
- 현재 실행은 **Slack-first manual ops**다. Slack 채널에서 지시한 뒤 owner/admin이
  `ssh hermes-host <task-slug>`를 실행한다. VPS의 forced-command가 slug를 `SSH_ORIGINAL_COMMAND`로 받아
  task allowlist를 통과시킨다.
- Slack CLI는 Slack app 생성/배포와 incoming webhook 설치에만 사용한다. 일반 메시지 발송·자동 command
  ingestion 용도가 아니다.
- Slack에는 merge/force-push, workflow 편집, 법률 source 편집, GitHub token 접근 권한을 주지 않는다.
- Slack slash-command 자동 실행과 GitHub Actions scheduled trigger는 **post-migration roadmap**이다.
  API 키 또는 Business/Enterprise 토큰 기반 런타임, audit log, task slug allowlist, owner approval 경계를
  갖춘 뒤 같은 forced-command 모델에 연결한다.

Slack-first manual task rhythm:

| Slack 지시 예시 | owner/admin 실행 | Hermes 기대 동작 |
|-----------------|------------------|------------------|
| `Hermes: sync-derived-docs 실행. registry drift만.` | `ssh hermes-host sync-derived-docs` | 파생 문서 drift만 PR/NO_CHANGES 보고 |
| `Hermes: webapp-quality-maintenance. CI/runtime 회귀만.` | `ssh hermes-host webapp-quality-maintenance` | 웹앱 품질 회귀를 bounded diff로 draft PR |
| `Hermes: audit-content-quality. source 편집 금지.` | `ssh hermes-host audit-content-quality` | 콘텐츠 품질 queue만 갱신 |
| `Hermes: static-trust-maintenance. trust mirror 회귀만.` | `ssh hermes-host static-trust-maintenance` | static trust parity 회귀만 수정 |

## 복구 / readiness 점검

```bash
# admin(root/sudo) 세션에서:
sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh    # 전 항목 [ OK ] 여야 트리거 가능
# 누락/손상 시 (idempotent):
sudo -u hermes -H git clone https://github.com/ywkinfo/glotm-hermes.git /srv/hermes/glotm-hermes  # 미배포 시
cd /srv/hermes/glotm-hermes && sudo scripts/bootstrap.sh        # 권한·deps·이미지·primary clone
```

## 로드맵

- **Slack slash-command 자동 실행/스케줄/외부 입력**을 붙이기 전에 ChatGPT 구독 런타임 → **API 키 또는
  Business/Enterprise 토큰**으로 전환(공개 저장소 자동화 OpenAI 권고). Slack 채널 지시/보고는 현재 기본
  운영 방식으로 유지한다.
- 서버측 PR-전용 하드 강제는 **non-bypass GitHub App 신원** 전환으로 확보.
- 법률·사실 source content 편집은 owner 승인(V2.1/V3) 전까지 audit/queue로만 다룬다.
