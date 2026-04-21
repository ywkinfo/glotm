# GloTm

[![Verify Release](https://github.com/ywkinfo/glotm/actions/workflows/verify-release.yml/badge.svg)](https://github.com/ywkinfo/glotm/actions/workflows/verify-release.yml)

인하우스 팀을 위한 cross-border trademark 운영 가이드의 중심 페이지입니다. 현재 런타임은 루트 `GloTm` 하나이며, `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm`의 generated JSON을 읽어 Gateway와 각 가이드를 보여줍니다.

현재 phase, 우선순위, 활성 작업 범위는 `PROJECT-OVERVIEW.md`를 기준으로 확인합니다.

## Bootstrap

```bash
npm ci
```

## Standard Verification

루트 verification 계약은 3개 execution lane(`health:runtime`, `health:content`, `health:release`)으로 운영하고, `health:report`는 최근 lane 상태와 advisory research status를 묶는 reporting surface로 유지합니다. `npm run content:prepare`는 그 앞단에서 generated content를 맞추는 prerequisite입니다.

먼저 generated content를 맞춥니다.

```bash
npm run content:prepare
```

그다음 3개 execution lane과 report surface를 순서대로 실행합니다.

```bash
npm run health:runtime
npm run health:content
npm run health:release
npm run health:report
```

설명:

- `npm run health:runtime`: `typecheck:runtime + test:runtime + npm run e2e:smoke`를 묶어 루트 안내 흐름, 링크 계약, 공통 리더 동작, 실제 브라우저 스모크를 함께 검증한다. generated-content 의존 회귀 테스트와 generated artifact가 필요한 node-side 검사는 여기서 제외해 pure runtime lane으로 유지한다.
- `npm run health:content`: 루트 `content:prepare` 뒤에 `test:content`와 `ChaTm`·`MexTm`·`EuTm`의 workspace local full pipeline을 다시 재현한다. `UsaTm`·`JapTm`·`UKTm`은 lighter-track 기준으로 루트 `content:prepare`의 refresh 계약을 따른다.
- `npm run health:release`: `build + build:pages:glotm`를 묶어 로컬에서 GitHub Pages subpath 출하 전 상태를 검증한다. 이 lane에서는 prerendered HTML, `dist/sitemap.xml`, `dist/robots.txt`, `dist/404.html`, `dist/.nojekyll`와 favicon asset 출하 상태까지 함께 확인한다. Gateway-facing copy나 hierarchy 조정이 `scripts/seo.ts` mirrored output, prerendered HTML, canonical/OG/Twitter metadata, sitemap/robots, `/glotm/` Pages-path behavior에 닿으면 runtime-only가 아니라 release lane change로 취급한다. 이 검증은 local release artifact 기준이며, live Pages 상의 개별 상호작용 이슈까지 자동으로 보증하는 표현으로 읽지 않는다.
- `npm run health:report`: 최근 실행한 루트 lane 상태와 product scorecard 메타데이터를 같은 리포트 포맷으로 출력한다. 기본적으로 저장된 lane 결과를 읽고, 필요하면 `--format json`, `--runtime=pass` 같은 플래그로 덮어쓸 수 있다.
- `npm run content:prepare`: 7개 가이드의 generated content와 Reports generated content를 재생성한 뒤 `scripts/sync-generated-content.mjs`로 루트 셸 소비 경로를 동기화한다. 현재 루트 기준으로 `LatTm`·`MexTm`·`ChaTm`·`EuTm`·`UKTm`은 `build-master -> qa-content -> build-content` 전체 흐름을 타고, `UsaTm`·`JapTm`은 shortcut generated-content 갱신 경로를 사용하며, Reports는 `Reports/scripts/build-content.ts`를 실행한다. `UsaTm`·`JapTm`의 더 깊은 콘텐츠 검토가 필요하면 각 워크스페이스 로컬 `content:prepare`를 직접 실행한다.

릴리즈 직전 한 번에 돌릴 때는 아래 묶음 명령을 사용합니다.

```bash
npm run verify:release
```

전체 health lane 4개를 연속으로 재현하려면 아래 명령을 사용합니다.

```bash
npm run health:all
```

## Workspace Commands

- `npm run content:latam`
- `npm run content:mexico`
- `npm run content:usa`
- `npm run content:japan`
- `npm run content:china`
- `npm run content:europe`
- `npm run content:uk`
- `npm run content:reports`

루트 워크스페이스 명령은 각 가이드의 generated JSON을 현재 검증 계약에 맞게 재생성합니다. 다만 실행 깊이는 가이드마다 다릅니다. 현재 `LatTm`·`MexTm`·`ChaTm`·`EuTm`·`UKTm`은 루트에서도 full pipeline을 사용하고, `UsaTm`·`JapTm`은 루트에서 shortcut 예외 그룹으로 동작합니다. 별도로 `npm run content:reports`는 Report / Gateway trust layer가 읽는 reports generated JSON을 갱신합니다. `UsaTm`·`JapTm`의 콘텐츠를 직접 수정하거나 deeper content QA가 필요할 때는 각 가이드의 로컬 `content:prepare`를 우선 실행하고, 편집 작업 전에는 각 가이드의 `README.md`와 `package.json`을 함께 확인합니다.

## Documentation Map

- root navigation guide: `AGENTS.md`
- root shell architecture: `ARCHITECTURE.md`
- 현재 operating brief: `PROJECT-OVERVIEW.md`
- 루트 working rules: `Harness/Constitution.md`, `Harness/Style-Guide.md`, `Harness/QA-Gate.md`
- supporting docs index: `docs/README.md`
- 워크스페이스별 콘텐츠 규칙: 각 디렉터리의 `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md`
- historical root memos: `CODEX-GATEWAY-FIXES.md`, `FEASIBILITY-REVIEW.md`

## Runtime Source Of Truth

- 런타임 제품 메타데이터: `src/products/registry.ts`
- Report / Gateway trust layer 메타데이터: `src/reports/registry.ts`
- 포트폴리오 scorecard 규칙: `src/products/scorecard.ts`, `docs/portfolio-scorecard.md`
- buyer-facing 포지셔닝: `docs/buyer-narrative.md`
- 루트 런타임 QA 체크리스트: `docs/phase1-runtime-qa.md`
- QA rollout supporting note: `docs/factual-qa-rollout.md`
- GitHub Pages SEO / prerender source of truth: `scripts/seo.ts`, `scripts/prerender.ts`, `scripts/generate-sitemap.ts`, `scripts/prepare-pages.ts`

Pages build path는 둘로 나뉩니다. 로컬 release verification과 subpath smoke는 `npm run build:pages:glotm`를 기준으로 보고, GitHub Actions deploy workflow는 `deploy-pages.yml`에서 `PAGES_BASE_PATH`와 `PAGES_SITE_ORIGIN`을 주입한 뒤 `npm run build:pages`를 실행합니다. 둘 다 같은 prerender chain을 쓰지만, 문서와 운영 메모에서는 local path와 workflow path를 구분해서 적습니다.

현재 포트폴리오의 기본 실행 순서는 `ChaTm -> MexTm -> EuTm -> Report / Gateway trust layer -> JapTm -> UKTm -> UsaTm`입니다. `LatTm`은 기준 프레임 보호를 우선하며, 대형 신규 집필보다 freshness·density·reader QA 유지에 집중합니다.

운영 메타데이터(`portfolioTier`, `lifecycleStatus`, `verifiedOn`, `qaLevel`, `highRiskVerificationGapCount`, 챕터 수, 검색 엔트리 수)는 `src/products/registry.ts`를 기준으로 업데이트합니다. verification freshness는 저장하지 않고 `verifiedOn`에서 계산하며, search density는 `searchEntryCount / chapterCount`로 계산합니다.

월간 review에서는 위 메타데이터를 수동 상태표시가 아니라 scorecard 입력값으로 취급합니다. `npm run health:report`는 현재 메타데이터 기준으로 각 guide의 verdict를 `hold`, `upgrade-ready`, `verification-refresh-needed`로 정리합니다. 2026-04-21 기준 공유 verification run(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`)을 다시 재현했고, live Pages에서는 trust layer / report handoff와 favicon asset 반영이 별도 확인 상태로 유지된다. 다만 production 모바일 drawer close 이슈가 별도로 관찰됐으므로, live verification 서술은 artifact pass와 동일시하지 않습니다.
