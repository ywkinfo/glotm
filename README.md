# GloTm

인하우스 팀을 위한 cross-border trademark operating guides 루트 셸입니다. 현재 런타임은 루트 `GloTm` 하나이며, `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`, `UKTm`의 generated JSON을 읽어 Gateway와 각 가이드를 렌더링합니다.

## Bootstrap

```bash
npm ci
```

## Standard Verification

아래 4개 명령이 현재 루트 기준 검증 계약입니다.

```bash
npm test
npm run build
npm run build:pages:glotm
npm run content:prepare
```

설명:

- `npm test`: 루트 셸 라우팅, 링크 계약, 공통 리더 동작 검증
- `npm run build`: 루트 `content:prepare` 실행 후 루트 Vite build
- `npm run build:pages:glotm`: GitHub Pages subpath 빌드 검증
- `npm run content:prepare`: 7개 live guide의 generated content를 재생성한다. 현재 루트 기준으로 `LatTm`·`MexTm`·`ChaTm`·`EuTm`·`UKTm`은 `build-master -> qa-content -> build-content` 전체 흐름을 타고, `UsaTm`·`JapTm`은 shortcut generated-content 갱신 경로를 사용한다. `UsaTm`·`JapTm`의 deeper content QA가 필요하면 각 워크스페이스 로컬 `content:prepare`를 직접 실행한다.

## Workspace Commands

- `npm run content:latam`
- `npm run content:mexico`
- `npm run content:usa`
- `npm run content:japan`
- `npm run content:china`
- `npm run content:europe`
- `npm run content:uk`

루트 워크스페이스 명령은 각 가이드의 generated JSON을 현재 검증 계약에 맞게 재생성합니다. 다만 실행 깊이는 가이드마다 다릅니다. 현재 `LatTm`·`MexTm`·`ChaTm`·`EuTm`·`UKTm`은 루트에서도 full pipeline을 사용하고, `UsaTm`·`JapTm`은 루트에서 shortcut 예외 그룹으로 동작합니다. `UsaTm`·`JapTm`의 콘텐츠를 직접 수정하거나 deeper content QA가 필요할 때는 각 가이드의 로컬 `content:prepare`를 우선 실행하고, 편집 작업 전에는 각 가이드의 `README.md`와 `package.json`을 함께 확인합니다.

## Source Of Truth

- 런타임 제품 메타데이터: `src/products/registry.ts`
- 포트폴리오 scorecard 규칙: `src/products/scorecard.ts`, `docs/portfolio-scorecard.md`
- buyer-facing 포지셔닝: `docs/buyer-narrative.md`
- 루트 런타임 QA 체크리스트: `docs/phase1-runtime-qa.md`
- EuTm 확장 실행 계획: `docs/eutm-content-expansion-plan.md`
- UKTm 확장 실행 계획: `docs/uktm-content-expansion-plan.md`
- ChaTm 확장 실행 계획: `docs/chatm-content-expansion-plan.md`
- 워크스페이스별 콘텐츠 규칙: 각 디렉터리의 `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md`

운영 메타데이터(`portfolioTier`, `lifecycleStatus`, `verificationFreshnessDays`, `qaLevel`, `highRiskVerificationGapCount`, 챕터 수, 검색 엔트리 수)는 `src/products/registry.ts`를 기준으로 업데이트합니다. search density는 저장하지 않고 `searchEntryCount / chapterCount`로 계산합니다.
