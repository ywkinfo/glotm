# GloTm Stage 1 Advisory Memo

작성일: 2026-06-21
검증 기준: GitHub `main` 공개 저장소 파일 (`src/app/App.tsx`, `scripts/seo.ts`, `src/reports/registry.ts`, `package.json`, `.github/workflows/deploy-pages.yml`) 실측 대조
적용 범위: Hermes Stage 1 산출물 정합성, 권한 경계, 운영 모니터링 어젠다 재분류
관련 문서: [`hermes-stage1-baseline.md`](hermes-stage1-baseline.md)

## 결론

Hermes의 Phase 2.5 운영·모니터링 방향성은 대체로 맞지만, Stage 1 baseline 계약이 아직 닫히지 않았다. 따라서 운영 모니터링 어젠다로 넘어가기 전에 trust/legal hardening 산출물을 먼저 PR 후보로 정리해야 한다. 또한 제안된 모니터링 항목의 일부(Search Console 색인, GA4 라이브 landing, interactive QA 최종 판정)는 Hermes 권한 밖이므로 owner handoff로 재분류한다.

## 현재 확인된 상태 (2026-06-21, `main` 실측)

증거 기반 진단. "전무/완료" 식 이분법 단정은 피한다.

- `src/app/App.tsx`에 `/privacy`, `/legal`, `/contact` route **없음** (라우트는 `chapter/:chapterSlug`와 `*`뿐, 가이드 진입 경로는 `src/products/registry.ts`에서 구성)
- `LICENSE` **없음**
- `SECURITY.md` **없음**
- `scripts/seo.ts`는 Gateway / Brief archive·detail / Report / Guide static mirror를 생성하지만, 별도 legal/privacy/contact static page나 공통 legal notice mirror는 **아직 없음**
- 기존 guide reader footer 고지는 별개로 존재할 수 있으므로 "법적 고지가 전무"라고 단정하면 **안 됨**. 미완 항목은 *dedicated legal/privacy/contact route + 공통 source + static mirror*이지 *모든 고지의 부재*가 아니다
- GA4는 코드에 wired되어 있고(`GatewayPage`, `ReportPages`, `BriefPages`, `appShared`의 6개 이벤트), 측정 ID `G-0XF5JG96CC`가 repo variable로 설정되어 `deploy-pages.yml`에서 주입됨 → 코드 wiring 존재는 확인됨. 라이브 이벤트 landing 여부는 별도 owner 확인 대상

## Stage 1 미완 산출물

- `LICENSE` 추가
- `SECURITY.md` 추가
- `/privacy`, `/legal` 또는 `/terms`, `/contact` route 추가
- Report archive/detail full legal notice 정렬
- 공통 trust/legal source 도입 (기존 footer 고지를 덮지 않고 single-source로 통합)
- `scripts/seo.ts` static SEO mirror에 동일 고지 반영 (CSR hydration 후에만 보이는 고지 방지)
- release gate에 legal/static 검증 추가

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

참고: health lane(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현은 실행 호스트에 Node 22가 있을 때만 신뢰 가능하다. Node 24는 rollup dlopen 실패가 알려져 있으므로 lane 실패 시 Node 버전을 먼저 분리 진단한다.

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
