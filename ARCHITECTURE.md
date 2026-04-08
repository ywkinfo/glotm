# GloTm Root Architecture

이 문서는 루트 `GloTm` 셸의 구조만 설명한다.
워크스페이스별 세부 파이프라인과 편집 규칙은 각 디렉터리의 `README.md`와 `Harness/Architecture.md`를 기준으로 본다.

## Scope

- 루트 BrowserRouter 셸
- Gateway / Brief / Report / guide runtime 연결 구조
- workspace content pipeline과 루트 셸의 handoff
- root source-of-truth ownership

## System Shape

```text
workspace source markdown / research
        ↓
workspace pipeline
(build-master -> qa-content -> build-content)
        ↓
workspace generated JSON
        ↓
scripts/sync-generated-content.mjs
        ↓
public/generated/*
        ↓
src/app/App.tsx BrowserRouter shell
        ↓
Gateway / Brief / Report / guide readers
```

shortcut lane는 `UsaTm`, `JapTm`처럼 루트에서는 `build-content` 위주로 refresh하고, deeper content QA가 필요할 때 workspace local `content:prepare`를 다시 재현하는 구조다.

## Root Runtime

- 루트 앱 진입과 route wiring: `src/app/App.tsx`
- live guide portfolio metadata: `src/products/registry.ts`
- report metadata와 archive ordering: `src/reports/registry.ts`
- 공통 path / title / shared runtime helpers: `src/products/shared.ts`, `src/app/appShared.ts`, `src/reports/registry.ts`

현재 루트 셸은 다음 surface를 함께 제공한다.

- Gateway `/`
- Brief archive / issue routes
- Report archive / report routes
- live guide home / chapter routes (`/latam`, `/mexico`, `/usa`, `/japan`, `/china`, `/europe`, `/uk`)

## Workspace Relationship

루트는 각 workspace를 독립 앱처럼 배포하지 않는다.
실제 런타임은 루트 `GloTm` 하나이고, workspace는 콘텐츠 생산 파이프라인이자 계약 문서 묶음으로 동작한다.

- `LatTm`, `MexTm`, `ChaTm`, `EuTm`, `UKTm`: 루트에서도 full pipeline refresh를 탄다.
- `UsaTm`, `JapTm`: 루트에서는 shortcut refresh를 사용하지만, 로컬 deeper QA 경로를 따로 유지한다.
- `Reports/`: guide와 별도로 report JSON을 생성해 Gateway / Report archive에 연결한다.

## Route And Data Ownership

### Root owns

- route surface와 shell layout
- global nav, Gateway ordering, Brief / Report archive behavior
- portfolio metadata (`src/products/registry.ts`)
- report metadata (`src/reports/registry.ts`)
- release artifact generation (`scripts/prerender.ts`, `scripts/generate-sitemap.ts`, `scripts/prepare-pages.ts`)

### Workspace owns

- source chapters / appendix / research docs
- workspace-local build scripts
- workspace-specific content-spec and editing rules
- deeper content QA notes and verification refresh artifacts

## Source Of Truth Matrix

| Question | Authority |
| --- | --- |
| Current phase / focus / do-not-start | `PROJECT-OVERVIEW.md` |
| Root commands / verification lanes | `README.md`, `package.json` |
| Live guide metadata, counts, tier, lifecycle, QA level | `src/products/registry.ts` |
| Report metadata and ordering | `src/reports/registry.ts` |
| Permanent working rules | `Harness/Constitution.md`, `Harness/Style-Guide.md`, `Harness/QA-Gate.md` |
| Root-first navigation | `AGENTS.md` |
| Supporting plans / buyer docs / QA notes | `docs/README.md` |
| Workspace-local editing and architecture rules | each workspace `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md` |

## Verification Model

루트 검증은 `README.md`의 health lane을 기준으로 본다.

- `health:runtime`: shell / route / browser smoke
- `health:content`: generated content refresh + selected workspace local full-pipeline reruns
- `health:release`: build + Pages release artifact validation

즉, 루트 아키텍처의 핵심은 "모든 것을 루트 하나에서 렌더링하되, 콘텐츠 정확도와 제작 책임은 workspace에 남기는 것"이다.

## What This File Does Not Own

- phase roadmap와 현재 우선순위
- buyer narrative나 portfolio positioning
- workspace chapter structure와 local content rules
- supporting plan / taskboard / checklist 목록

이 정보는 이미 다른 authority 문서가 있으므로 여기서 다시 들고 있지 않는다.
