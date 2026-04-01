# UKTm Harness Architecture

## Purpose

`UKTm`은 영국 상표 실무를 다루는 단일국가 워크스페이스다.
현재는 루트 `GloTm` 셸의 `/uk` 리더가 이 워크스페이스의 generated JSON을 소비하는 early-track 구조로 운영 중이다.

## Source Of Truth

- 원고 원천: `content/source/chapters/*.md`
- 부록 원천: `content/source/appendix/*.md`
- 장 순서와 공개 제목: `content/source/manifest.json`
- 조립본: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 루트 런타임 소비자: `../src/products/uk.tsx`
- 리서치 자산: `content/research/*.md`

## Pipeline

1. `manifest.json`이 장 제목과 파일 경로를 정의한다.
2. `scripts/build-master.ts`가 각 원고를 읽어 `master.md`를 생성한다.
3. `scripts/qa-content.ts`가 제목, 헤딩 구조, 코드 펜스, 표 형식을 검사한다.
4. `scripts/build-content.ts`가 `master.md`를 HTML, headings tree, search entries로 변환한다.
5. 루트 `GloTm` 셸이 generated JSON을 읽어 `/uk` 홈, 챕터, 검색 흐름을 렌더링한다.

## Current Verified Shape

- 현재 목표 챕터 수: 14
- 초기 공개 범위: draft 상태의 영국 단일국가 가이드
- 파이프라인 명령: 루트에서 `npm run content:uk`
- 조립 순서: `build-master.ts -> qa-content.ts -> build-content.ts`
- 현재 운영 우선순위: status 승격이 아니라 fact log 정합성과 루트 회귀 방지

## Editing Rules

- 공개본 수정은 먼저 `content/source/chapters/`와 `manifest.json`에서 수행한다.
- 장 제목이나 순서를 바꿀 때는 원고 H1, `manifest.json`, `master.md` 생성 결과를 함께 맞춘다.
- `master.md`는 조립 결과물이다. 수동 편집보다 재생성을 우선한다.
- generated JSON은 손으로 수정하지 않는다.
- 영국 fee, 기한, 제도 설명은 `content/research/uk_tm_fact_verification_log.md`에서 먼저 검증한다.

## Implementation Notes

- `build-master.ts`는 각 원고의 H1을 제거하고 내부 헤딩을 한 단계 올려 `master.md`에 넣는다.
- `build-content.ts`는 `master.md`의 H2를 챕터 경계로 보고, H3-H5를 outline과 search section 단위로 사용한다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 영국 상표 관련 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.
