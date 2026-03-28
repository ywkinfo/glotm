# ChaTm Harness Architecture

## Purpose

`ChaTm`은 중국 상표제도와 중국 상표 실무 운영 이슈를 다루는 독립 콘텐츠 워크스페이스다.
현재는 루트 `GloTm` 셸에 연결되지 않은 준비 단계이며, `master.md` 단일 원고를 기반으로 generated JSON만 만든다.

## Source Of Truth

- 현재 빌드 입력: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 보조 원고 자산: `content/source/chapters/*.md`, `content/source/appendix/*.md`
- 리서치 노트: `content/research/*.md`

중요:

- 현재 스크립트는 `chapters/`와 `appendix/`를 직접 읽지 않는다.
- 실제 공개본 기준 편집은 우선 `master.md`에서 이뤄져야 한다.
- 루트 `GloTm` 셸 라우트와 제품 레지스트리 연결은 이번 단계 범위가 아니다.

## Pipeline

1. `scripts/build-content.ts`가 `master.md`를 읽는다.
2. H2를 챕터 경계로 파싱한다.
3. 각 챕터를 HTML, headings tree, summary, search entries로 변환한다.
4. 생성된 JSON은 후속 루트 셸 연결 시 소비 가능한 형태로 남긴다.

## Current Verified Shape

- 현재 파이프라인 명령: `npm run content:build`
- 현재 정본 입력: `content/source/master.md`
- 현재 미구축 항목: `manifest.json`, `build-master.ts`, `qa-content.ts`
- 현재 비연결 항목: 루트 `GloTm` 라우트, 제품 레지스트리, 상위 내비게이션

## Editing Rules

- 런타임에 반영될 콘텐츠 수정은 먼저 `content/source/master.md`에서 처리한다.
- `chapters/`와 `appendix/`는 후속 분리 작업을 위한 보조 폴더이며, 지금은 자동 조립되지 않는다.
- generated JSON은 수동 수정하지 않는다.
- 차후 구조가 안정되면 `LatTm`식 조립 파이프라인으로 승격할 수 있도록 챕터 경계와 헤딩 규칙을 일관되게 유지한다.

## Implementation Notes

- `build-content.ts`는 `master.md`의 H1을 문서 제목, H2를 챕터 제목으로 사용한다.
- H3-H5는 outline과 검색 섹션 단위다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 중국 상표 실무와 직접 연관된 공식 출처 도메인과 대조해 `official-link` 클래스를 부여한다.

## Dependencies

- Markdown 처리: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-stringify`
- slug 생성: `github-slugger`
- 검색: `MiniSearch`
