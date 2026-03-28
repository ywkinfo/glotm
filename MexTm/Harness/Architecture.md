# MexTm Harness Architecture

## Purpose

`MexTm`은 루트 GloTm 셸에서 핵심 리더 기능 parity를 맞춘 멕시코 심화 워크스페이스다.
현재 콘텐츠 파이프라인은 `LatTm`보다 단순하며, `master.md`를 직접 읽어 generated JSON을 만든다.

## Source Of Truth

- 현재 빌드 입력: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 루트 런타임 소비자: `../src/products/mexico.tsx`
- 보조 원고 자산: `content/source/chapters/*.md`, `content/source/appendix/*.md`

중요:

- 현재 스크립트는 `chapters/`와 `appendix/`를 직접 읽지 않는다.
- 런타임에 반영되는 콘텐츠 수정은 `master.md`에 있어야 한다.

## Pipeline

1. `scripts/build-content.ts`가 `master.md`를 읽는다.
2. H2를 챕터 경계로 파싱한다.
3. 각 챕터를 HTML, headings tree, summary, search entries로 변환한다.
4. 루트 GloTm 셸이 generated JSON을 읽어 홈, 챕터, 검색 흐름을 렌더링한다.

## Current Verified Shape

- 현재 기준 챕터 수: 15
- 현재 기준 검색 엔트리 수: 280
- 파이프라인 명령: 루트에서 `npm run content:mexico`
- 현재 미구축 항목: `manifest.json`, `build-master.ts`, `qa-content.ts`

## Editing Rules

- 런타임에 반영되는 수정은 먼저 `content/source/master.md`에서 확인한다.
- `chapters/` 개별 파일을 수정해도 `master.md`에 반영되지 않으면 현재 빌드에는 영향이 없다.
- generated JSON은 손으로 수정하지 않는다.
- `LatTm` 수준의 조립형 파이프라인 이식은 별도 phase 작업으로 취급한다.

## Implementation Notes

- `build-content.ts`는 `master.md`의 H1을 문서 제목, H2를 챕터 제목으로 사용한다.
- H3-H5는 outline과 검색 섹션 단위다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 멕시코 중심 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.

## Dependencies

- Markdown 처리: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-stringify`
- slug 생성: `github-slugger`
- 검색: `MiniSearch`
