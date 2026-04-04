# LatTm Harness Architecture

## Purpose

`LatTm`은 현재 GloTm에서 가장 성숙한 콘텐츠 파이프라인이다.
루트 셸의 `LatTm` 리더는 이 워크스페이스의 generated JSON을 소비한다.

## Source Of Truth

- 원고 원천: `content/source/chapters/*.md`, `content/source/appendix/*.md`
- 챕터 순서와 공개 제목: `content/source/manifest.json`
- 조립본: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 루트 런타임 소비자: `../src/products/latam.tsx`

## Pipeline

1. `manifest.json`이 챕터 제목과 파일 경로를 정의한다.
2. `scripts/build-master.ts`가 각 원고를 읽어 `master.md`를 생성한다.
3. `scripts/qa-content.ts`가 원고 구조, 제목 일치, 코드 펜스, 표 형식, 금지 마커를 검사한다.
4. `scripts/build-content.ts`가 `master.md`를 HTML, headings tree, search entries로 변환한다.
5. 루트 GloTm 셸이 generated JSON을 읽어 홈, 챕터, 검색 흐름을 렌더링한다.

## Current Verified Shape

- 현재 기준 챕터 수: 20
- 현재 기준 검색 엔트리 수: 781
- 파이프라인 명령: 루트에서 `npm run content:latam`
- 조립 순서: `build-master.ts -> qa-content.ts -> build-content.ts`

## Editing Rules

- 챕터 내용 변경은 가능한 한 `chapters/` 또는 `appendix/`의 원천 원고에서 시작한다.
- 챕터 제목이나 순서를 바꿀 때는 `manifest.json`과 원고 H1을 함께 맞춘다.
- `master.md`는 조립 결과물이다. 수동 편집보다 재생성을 우선한다.
- generated JSON은 손으로 수정하지 않는다.

## Implementation Notes

- `build-master.ts`는 각 원천 문서의 H1을 제거하고 내부 헤딩을 한 단계 올려 `master.md`에 넣는다.
- `build-content.ts`는 `master.md`의 H2를 챕터 경계로 보고, H3-H5를 outline과 검색 섹션 단위로 사용한다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.

## Dependencies

- Markdown 처리: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-stringify`
- slug 생성: `github-slugger`
- 검색: `MiniSearch`
