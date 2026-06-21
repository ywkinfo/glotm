# Hermes Operations Runbook

이 문서는 GloTm(`ywkinfo/glotm`)을 관리하는 Hermes 에이전트의 **운영 레이어**를 GloTm 저장소 안에서
빠르게 파악하기 위한 thin pointer다. 상세 부트스트랩·보안 설계는 오케스트레이터 저장소
`glotm-hermes`의 `docs/SETUP.md`가 정본이며, 이 문서는 그 정본과 GloTm 쪽에서 알아야 할 고유 사실만
요약한다(중복 정의 금지).

> Status: operational reference
> 이 문서는 mutable 운영 수치(phase·tier·lifecycle)를 들고 있지 않다. 그런 값은 `PROJECT-OVERVIEW.md`,
> `src/products/registry.ts`를 기준으로 본다.

## 오케스트레이터 정체

- **무엇**: GloTm을 관리하는 **PR-제안 전용** 에이전트 러너. owner-only SSH on-demand 파일럿(v1).
- **소스**: 로컬 `~/glotm-hermes`, remote `github.com/ywkinfo/glotm-hermes`.
- **정본 셋업 문서**: `glotm-hermes/docs/SETUP.md`, `glotm-hermes/README.md`.
- **GloTm repo와의 관계**: Hermes는 이 저장소를 *읽고 PR을 제안*할 뿐, 머지·배포는 사람이 한다.

## VPS truth (경로)

| 항목 | 경로 |
|------|------|
| state root | `/srv/hermes` |
| 오케스트레이터 체크아웃(`HERMES_HOME`) | `/srv/hermes/glotm-hermes` |
| GloTm primary clone(`GLOTM_PRIMARY`) | `/srv/hermes/glotm` |
| per-run 로그/아티팩트 | `/srv/hermes/runs/<RUN_ID>` |
| scoped PAT(host 전용, 600) | `/srv/hermes/secrets/gh-token` |
| Codex auth(영속, 토큰 자동갱신) | `/srv/hermes/codex/auth.json` |

VPS HostName: `srv1650501.hstgr.cloud` (Hostinger), SSH user `hermes`.

## 트리거

```bash
ssh hermes-host sync-derived-docs   # forced-command → bin/hermes-run; task id는 slug로만 전달
```

- `hermes-host`는 **forced-command 전용**이라 임의 셸 명령을 받지 않는다(허용 task slug만).
- 현재 허용 task는 `glotm-hermes/lib/config.sh`(또는 V2의 `lib/task-config.sh`)의 화이트리스트가 정본이다.

## 현재 권한 범위 (v1)

- **derived-doc drift만** 수정: `PROJECT-OVERVIEW.md`, `docs/portfolio-scorecard.md`,
  `docs/buyer-narrative.md`를 `src/products/registry.ts` 정본에 맞춰 재생성.
- **draft PR only · no direct merge · no force-push.**
- host policy gate가 **registry·workflow·deps·법률 콘텐츠** 편집을 차단(`policy/deny.txt`).
- 실질 통제는 host policy gate다(소유자 PAT는 main ruleset을 기술적으로 bypass 가능 — 잔여 리스크 P0-7,
  하드닝 단계에서 non-bypass GitHub App 신원으로 전환).

## 운영 주의사항

- **PAT 로테이션 마감: `2026-07-15`.** 만료 전 `/srv/hermes/secrets/gh-token` 갱신
  (scope: `ywkinfo/glotm` 단일, Contents:write + Pull requests:write).
- **`/opt/hermes` 경고**: Hermes 설계에 `/opt/hermes`는 **없는 경로**다. GloTm 작업이 `/opt/hermes`에서
  돌고 있다면 GloTm 오케스트레이터가 아닌 **다른/일반 에이전트로 misroute**된 것이다 — 중단하고
  `hermes-host`(→ `/srv/hermes`)로 라우팅을 바로잡는다.
- **admin 작업 선결**: `bootstrap.sh`/`doctor.sh`는 `sudo` 필요인데 `hermes-host`는 forced-command라
  실행 불가. 복구·점검은 별도 admin 경로(예: `hermes-admin` root/sudo alias)나 owner 직접 실행이 필요하다.

## 복구 / readiness 점검

```bash
# admin(root/sudo) 세션에서:
sudo -u hermes -H /srv/hermes/glotm-hermes/scripts/doctor.sh    # 전 항목 [ OK ] 여야 트리거 가능
# 누락/손상 시 (idempotent):
sudo -u hermes -H git clone https://github.com/ywkinfo/glotm-hermes.git /srv/hermes/glotm-hermes  # 미배포 시
cd /srv/hermes/glotm-hermes && sudo scripts/bootstrap.sh        # 권한·deps·이미지·primary clone
```

## V2 로드맵 (bounded operator)

v1 안전모델을 유지한 채 task별 권한·게이트를 가진 V2로 확장한다. 추가 task(예시):

- `audit-content-quality`: health/report/사실 audit 실행 → `docs/hermes-content-quality-queue.md`만
  갱신(콘텐츠 source 편집 없음).
- `webapp-quality-maintenance`: runtime/webapp 품질 수정 전용 bounded draft PR.
- `static-trust-maintenance`: trust/static mirror 회귀 전용 bounded draft PR(법률 copy 재작성 아님).

광역 자동화 전제조건:

- **Slack/스케줄/외부 입력**을 붙이기 전에 ChatGPT 구독 런타임 → **API 키 또는 Business/Enterprise
  토큰**으로 전환(공개 저장소 자동화 OpenAI 권고).
- 서버측 PR-전용 하드 강제는 **non-bypass GitHub App 신원** 전환으로 확보.
- 법률·사실 source content 편집은 owner 승인(V2.1/V3) 전까지 audit/queue로만 다룬다.
