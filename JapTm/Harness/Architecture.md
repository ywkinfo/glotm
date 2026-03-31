# JapTm Harness Architecture

## Purpose

`JapTm`은 일본 상표 실무를 다루는 단일국가 심화 워크스페이스다.
현재는 단일 마스터 원고 기반 콘텐츠 파이프라인으로 운영되며, 루트 `GloTm` 셸의 `/japan` 경로에 연결된 live country guide다.

## Source Of Truth

- 현재 빌드 입력: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 보조 편집 자산: `content/source/chapters/*.md`, `content/source/appendix/*.md`
- 리서치 자산: `content/research/*.md`

중요:

- 현재 스크립트는 `chapters/`와 `appendix/`를 직접 읽지 않는다.
- 런타임용 generated JSON에 반영되는 수정은 `master.md`에 있어야 한다.

## Pipeline

1. `scripts/build-content.ts`가 `master.md`를 읽는다.
2. H2를 챕터 경계로 파싱한다.
3. 각 챕터를 HTML, headings tree, summary, search entries로 변환한다.
4. 루트 `GloTm` 셸은 현재 이 generated JSON을 소비해 `/japan` 리더를 렌더링한다.

## Current Verified Shape

- 목표 챕터 수: 15
- 파이프라인 명령: `npm run content:build`
- 현재 미구축 항목: `manifest.json`, `build-master.ts`, `qa-content.ts`
- 현재 런타임 경로: `/japan`, `/japan/chapter/:chapterSlug`

## Editing Rules

- 공개본 수정은 먼저 `content/source/master.md`에서 수행한다.
- 장별 파일은 편집 초안이며 `master.md`에 반영되지 않으면 빌드 결과에 나타나지 않는다.
- generated JSON은 손으로 수정하지 않는다.
- 변동성이 큰 사실은 본문보다 `content/research/jp_tm_fact_verification_log.md`에 먼저 정리한다.
- 콘텐츠 보강은 기존 챕터 제목과 루트 셸 라우트 안정성을 해치지 않는 방향을 우선한다.

## Implementation Notes

- `build-content.ts`는 `master.md`의 H1을 문서 제목, H2를 챕터 제목으로 사용한다.
- H3-H5는 outline과 검색 섹션 단위다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 일본 중심 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.
