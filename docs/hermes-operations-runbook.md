# Hermes Operations Runbook

이 문서는 GloTm(`ywkinfo/glotm`)을 관리하는 Hermes 에이전트의 **운영 레이어**를 GloTm 저장소 안에서
빠르게 파악하기 위한 thin pointer다. 상세 부트스트랩·보안 설계는 오케스트레이터 저장소
`glotm-hermes`의 `docs/SETUP.md`가 정본이며, 이 문서는 그 정본과 GloTm 쪽에서 알아야 할 고유 사실만
요약한다(중복 정의 금지).

> Status: operational reference
> 이 문서는 mutable 운영 수치(phase·tier·lifecycle)를 들고 있지 않다. 그런 값은 `PROJECT-OVERVIEW.md`,
> `src/products/registry.ts`를 기준으로 본다.

## 오케스트레이터 정체

- **무엇**: GloTm을 관리하는 **V2 bounded operator**. owner/admin on-demand 러너이며,
  task별 prompt·allowlist·denylist·semantic profile을 분리한다.
- **소스**: 로컬 `~/glotm-hermes`, remote `github.com/ywkinfo/glotm-hermes`.
- **정본 셋업 문서**: `glotm-hermes/docs/SETUP.md`, `glotm-hermes/README.md`.
- **GloTm repo와의 관계**: Hermes는 이 저장소를 *읽고 draft PR을 제안*할 뿐, 머지·배포는 사람이 한다.

## VPS truth (경로)

| 항목 | 경로 |
|------|------|
| state root | `/srv/hermes` |
| 오케스트레이터 체크아웃(`HERMES_HOME`) | `/srv/hermes/glotm-hermes` |
| GloTm primary clone(`GLOTM_PRIMARY`) | `/srv/hermes/glotm` |
| per-run 로그/아티팩트 | `/srv/hermes/runs/<RUN_ID>` |
| scoped PAT(host 전용, 600) | `/srv/hermes/secrets/gh-token` |
| Codex auth(영속, 토큰 자동갱신) | `/srv/hermes/codex/auth.json` |

VPS HostName: `srv1650501.hstgr.cloud` (Hostinger), service user `hermes`.

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

- Slack CLI는 일반 Slack 메시지/명령 발송 도구가 아니라 Slack app 개발·배포용 CLI이며, 로컬 non-TTY 환경에서는
  로그인 상태가 없으면 사용할 수 없다.
- Slack 연동은 Hermes task를 호출하는 **trigger/notify/approve 표면**으로만 설계한다. merge/force-push나
  법률 source 편집 권한은 Slack 명령에 붙이지 않는다.
- Slack을 붙이기 전 선결조건은 API 키 또는 Business/Enterprise 토큰 기반 런타임, audit log, task slug
  allowlist, owner approval 경계다.

## 복구 / readiness 점검

```bash
# admin(root/sudo) 세션에서:
sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh    # 전 항목 [ OK ] 여야 트리거 가능
# 누락/손상 시 (idempotent):
sudo -u hermes -H git clone https://github.com/ywkinfo/glotm-hermes.git /srv/hermes/glotm-hermes  # 미배포 시
cd /srv/hermes/glotm-hermes && sudo scripts/bootstrap.sh        # 권한·deps·이미지·primary clone
```

## 로드맵

- **Slack/스케줄/외부 입력**을 붙이기 전에 ChatGPT 구독 런타임 → **API 키 또는 Business/Enterprise
  토큰**으로 전환(공개 저장소 자동화 OpenAI 권고).
- 서버측 PR-전용 하드 강제는 **non-bypass GitHub App 신원** 전환으로 확보.
- 법률·사실 source content 편집은 owner 승인(V2.1/V3) 전까지 audit/queue로만 다룬다.
