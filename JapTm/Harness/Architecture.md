# JapTm Harness Architecture

## Purpose

`JapTm`은 일본 상표 실무를 다루는 워크스페이스다.
장별 원고와 `manifest.json`을 기준으로 `master.md`를 조립한 뒤 QA와 generated JSON 생성을 거치며, 루트 `GloTm` 셸의 `/japan` 리더가 이 워크스페이스 산출물을 소비한다.

## Source Of Truth

- 원고 원천: `content/source/chapters/*.md`, `content/source/appendix/*.md`
- 장 순서와 공개 제목: `content/source/manifest.json`
- 조립본: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 루트 런타임 소비자: `../src/products/japan.tsx`
- 리서치 자산: `content/research/*.md`

중요:

- 런타임용 generated JSON에 반영되는 수정은 장별 원고와 `manifest.json`을 거쳐 `master.md`로 조립된 결과여야 한다.
- `master.md`는 공개용 정본이지만, 유지보수 시작점은 장별 원고와 부록 원고다.

## Pipeline

1. `manifest.json`이 장 제목과 파일 경로를 정의한다.
2. `scripts/build-master.ts`가 각 원고를 읽어 `master.md`를 생성한다.
3. `scripts/qa-content.ts`가 제목, 헤딩 구조, 코드 펜스, 표 형식을 검사한다.
4. `scripts/build-content.ts`가 `master.md`를 HTML, headings tree, summary, search entries로 변환한다.
5. 루트 `GloTm` 셸은 generated JSON을 소비해 `/japan` 리더를 렌더링한다.

## Local Verification Contract

- 루트 refresh 명령: `npm run content:japan`
- content edit 또는 deeper QA 기준 경로: 이 워크스페이스 로컬 `npm run content:prepare`
- 조립 순서: `build-master.ts -> qa-content.ts -> build-content.ts`
- 현재 챕터 수, 검색 엔트리, lifecycle, QA level, 포트폴리오 우선순위는 루트 `README.md`, `PROJECT-OVERVIEW.md`, `src/products/registry.ts`를 기준으로 확인한다.

## Editing Rules

- 공개본 수정은 먼저 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`에서 수행한다.
- 장 제목이나 순서를 바꿀 때는 원고 H1, `manifest.json`, `master.md` 생성 결과를 함께 맞춘다.
- `master.md`는 조립 결과물이다. 수동 편집보다 재생성을 우선한다.
- generated JSON은 손으로 수정하지 않는다.
- 변동성이 큰 사실은 본문보다 `content/research/jp_tm_fact_verification_log.md`에 먼저 정리한다.
- 콘텐츠 보강은 기존 챕터 제목과 루트 셸 라우트 안정성을 해치지 않는 방향을 우선한다.

## Implementation Notes

- `build-master.ts`는 각 원고의 H1을 제거하고 내부 헤딩을 한 단계 올려 `master.md`에 넣는다.
- `build-content.ts`는 `master.md`의 H2를 챕터 경계로 보고, H3-H5를 outline과 검색 섹션 단위로 사용한다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 일본 중심 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.
