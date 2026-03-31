# GloTm

글로벌 상표 지식베이스 루트 셸입니다. 현재 런타임은 루트 `GloTm` 하나이며, `LatTm`, `MexTm`, `UsaTm`, `JapTm`, `ChaTm`, `EuTm`의 generated JSON을 읽어 Gateway와 각 가이드를 렌더링합니다.

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
- `npm run build`: 모든 워크스페이스 `content:prepare` + 루트 Vite build
- `npm run build:pages:glotm`: GitHub Pages subpath 빌드 검증
- `npm run content:prepare`: 6개 live guide의 `build-master -> qa-content -> build-content`

## Workspace Commands

- `npm run content:latam`
- `npm run content:mexico`
- `npm run content:usa`
- `npm run content:japan`
- `npm run content:china`
- `npm run content:europe`

각 명령은 해당 워크스페이스의 `manifest.json`, `master.md`, generated JSON, QA 규칙을 같은 흐름으로 재생성합니다.

## Source Of Truth

- 런타임 제품 메타데이터: `src/products/registry.ts`
- 루트 런타임 QA 체크리스트: `docs/phase1-runtime-qa.md`
- EuTm 확장 실행 계획: `docs/eutm-content-expansion-plan.md`
- 워크스페이스별 콘텐츠 규칙: 각 디렉터리의 `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md`

운영 상태(`Pilot`, `Beta`, 성숙도 메모, 챕터 수, 검색 엔트리 수)는 `src/products/registry.ts`를 기준으로 업데이트합니다.
