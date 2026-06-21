# GloTm Stage 1 Advisory Memo

작성일: 2026-06-21
검증 기준: GitHub `main` 공개 저장소 파일 (`src/app/App.tsx`, `scripts/seo.ts`, `src/reports/registry.ts`, `package.json`, `.github/workflows/deploy-pages.yml`) 실측 대조
적용 범위: Hermes Stage 1 산출물 정합성, 권한 경계, 운영 모니터링 어젠다 재분류
관련 문서: [`hermes-stage1-baseline.md`](hermes-stage1-baseline.md)

## 정정 / Closeout 상태 (2026-06-21 갱신)

> 이 메모의 최초 "현재 확인된 상태" 진단 중 일부는 **stale**였다. `LICENSE`·`SECURITY.md`(#76)와
> `/privacy`·`/legal`·`/contact` route(#77)는 이 메모보다 **먼저** `main`에 머지돼 있었는데 "없음"으로
> 단정했다(stale-tree 진단 오류). legal page static mirror는 이후 #79로 추가됐다.
>
> 남아 있던 실제 잔여 항목은 **(1) 공통 trust/legal notice의 full static parity**(Gateway·guide·Brief·
> Report prerender body)와 **(2) `verify:release` 하위 gate에 legal/static 검증 배선** 두 가지였고,
> 이는 Stage 1 static-trust closeout PR에서 닫는다(`scripts/seo.ts` `renderTrustLegalNotice` +
> `test:seo`를 `health:release`에 편입). 아래 본문은 진단 이력 보존을 위해 남기되, 현재 참값은 이
> 블록과 `hermes-stage1-baseline.md` 완료판정을 기준으로 본다.

## 결론

Hermes의 Phase 2.5 운영·모니터링 방향성은 대체로 맞지만, Stage 1 baseline 계약이 아직 닫히지 않았다. 따라서 운영 모니터링 어젠다로 넘어가기 전에 trust/legal hardening 산출물을 먼저 PR 후보로 정리해야 한다. 또한 제안된 모니터링 항목의 일부(Search Console 색인, GA4 라이브 landing, interactive QA 최종 판정)는 Hermes 권한 밖이므로 owner handoff로 재분류한다.

## 현재 확인된 상태 (2026-06-21, `main` 실측) — *일부 stale, 위 Closeout 블록이 참값*

증거 기반 진단. "전무/완료" 식 이분법 단정은 피한다.

- ~~`src/app/App.tsx`에 `/privacy`, `/legal`, `/contact` route **없음**~~ → **정정: #77로 이미 존재**(`src/trustLegal.ts` + `src/app/TrustLegalNotice.tsx`)
- ~~`LICENSE` **없음**~~ → **정정: #76로 이미 존재**
- ~~`SECURITY.md` **없음**~~ → **정정: #76으로 이미 존재**
- `scripts/seo.ts`는 Gateway / Brief archive·detail / Report / Guide static mirror를 생성한다. legal/privacy/contact static page는 #79로 추가됨. **남은 것은 공통 legal notice의 full static parity**(Gateway·guide·Brief·Report body)로, closeout PR에서 반영
- 기존 guide reader footer 고지는 별개로 존재할 수 있으므로 "법적 고지가 전무"라고 단정하면 **안 됨**. 미완 항목은 *dedicated legal/privacy/contact route + 공통 source + static mirror*이지 *모든 고지의 부재*가 아니다
- GA4는 코드에 wired되어 있고(`GatewayPage`, `ReportPages`, `BriefPages`, `appShared`의 6개 이벤트), 측정 ID `G-0XF5JG96CC`가 repo variable로 설정되어 `deploy-pages.yml`에서 주입됨 → 코드 wiring 존재는 확인됨. 라이브 이벤트 landing 여부는 별도 owner 확인 대상

## Stage 1 산출물 상태 (closeout 기준)

- [x] `LICENSE` 추가 (#76)
- [x] `SECURITY.md` 추가 (#76)
- [x] `/privacy`, `/legal`, `/contact` route 추가 (#77)
- [x] 공통 trust/legal source 도입 (`src/trustLegal.ts` single-source; 기존 footer 고지 미덮음)
- [x] legal page static mirror 추가 (#79)
- [x] Report archive/detail full legal notice — closeout PR에서 공통 notice를 static body에 반영
- [x] `scripts/seo.ts` static mirror full parity (Gateway·guide·Brief·Report) — closeout PR (`renderTrustLegalNotice`)
- [x] release gate에 legal/static 검증 추가 — closeout PR (`test:seo`를 `health:release`에 편입 → `verify:release` 커버)

## 권한 경계

Hermes는 Stage 1 advisory / PR 후보 작성 역할로 제한한다.

Hermes가 할 수 있는 일:
- 코드와 문서 상태 진단 (read-only)
- PR 후보 작성
- 정적 route, SEO mirror, release gate 구현 (owner review·머지 전제)
- owner가 확인할 체크리스트 작성

Hermes가 직접 완료 판정하면 안 되는 일:
- Search Console 색인 확인 (owner 콘솔 자격 필요)
- GA4 DebugView landing 확인 (owner 콘솔 필요)
- live interactive QA 최종 판정 (drawer close·검색·continue reading 등 브라우저 필요)
- owner review 없이 `main` 머지 (ruleset / owner bypass 변경 금지)

참고: health lane(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현은 hermes-host에 Node 22가 있을 때만 신뢰 가능하다. Node 24는 rollup dlopen 실패가 알려져 있으므로 lane 실패 시 Node 버전을 먼저 분리 진단한다.

## 우선순위

1. `LICENSE` + `SECURITY.md` PR (순수 docs, 가장 안전한 첫 PR)
2. `/privacy`, `/legal`, `/contact` route + 공통 trust/legal source PR
3. Report archive/detail notice + static SEO mirror + release gate check PR
4. 문서 정합성 read-only 진단 (`PROJECT-OVERVIEW.md` / `README.md` / `src/reports/registry.ts` / Gateway copy가 서로 다른 phase·우선순위를 말하지 않는지)
5. monthly scorecard 후보 리스트 작성 (`health:report:json` + `src/products/registry.ts` 기준 hold / upgrade-ready / verification-refresh-needed 분류만 기록, 자동 승급·강등 금지)
6. fact freshness vs lane freshness advisory note 작성 (`verifiedOn`=lane 재검증일 유지, 법률 사실 재대조는 별도. EuTm의 UK 수수료·Brexit·EU/UK scope는 high-sensitivity로 별도 fact-freshness 관리)
7. Search Console / GA4 owner handoff checklist 작성 (Hermes는 URL·이벤트 목록만 채우고 실행은 owner)

## 금지 유지

- 신규 국가 추가 금지
- pricing/paywall 금지
- 이메일 게이트 금지
- 신규 파이프라인/의존성 추가 금지
- active promotion 금지
- ruleset / owner bypass 변경 금지

## 참조 확인

- `src/app/App.tsx`
- `scripts/seo.ts`
- `src/reports/registry.ts`
- `package.json` (health lanes)
- `.github/workflows/deploy-pages.yml` (GA4 주입)
