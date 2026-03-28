# EuTm Harness Architecture

## Purpose

`EuTm`은 유럽 상표 운영 가이드를 준비하기 위한 권역형 워크스페이스다.
현재는 `MexTm`와 같은 단일 마스터 원고 기반 콘텐츠 파이프라인으로 시작하며, 루트 `GloTm` 셸에는 아직 연결하지 않는다.

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
4. 향후 루트 `GloTm` 셸에 연결할 경우 generated JSON을 소비한다.

## Current Verified Shape

- 목표 챕터 수: 14
- 파이프라인 명령: `npm run content:build`
- 현재 미구축 항목: `manifest.json`, `build-master.ts`, `qa-content.ts`
- 현재 상태: 권역 구조와 리서치 범위를 고정하기 위한 초안 워크스페이스

## Editing Rules

- 공개본 수정은 먼저 `content/source/master.md`에서 수행한다.
- 장별 파일은 편집 초안이며 `master.md`에 반영되지 않으면 빌드 결과에 나타나지 않는다.
- generated JSON은 손으로 수정하지 않는다.
- 정확 수치, 공식 기간, 수수료는 본문보다 `content/research/eu_tm_fact_verification_log.md`에서 먼저 검증한다.

## Implementation Notes

- `build-content.ts`는 `master.md`의 H1을 문서 제목, H2를 챕터 제목으로 사용한다.
- H3-H5는 outline과 검색 섹션 단위다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 유럽 상표 관련 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.
