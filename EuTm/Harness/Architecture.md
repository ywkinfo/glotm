# EuTm Harness Architecture

## Purpose

`EuTm`은 유럽 상표 운영 가이드를 다루는 권역형 워크스페이스다.
루트 `GloTm` 셸의 `/europe` 리더가 이 워크스페이스의 generated JSON을 소비한다.

## Source Of Truth

- 원고 원천: `content/source/chapters/*.md`
- 장 순서와 공개 제목: `content/source/manifest.json`
- 조립본: `content/source/master.md`
- 생성 산출물: `content/generated/document-data.json`, `content/generated/search-index.json`
- 루트 런타임 소비자: `../src/products/europe.tsx`
- 리서치 자산: `content/research/*.md`
- source-register companion: `content/research/eu_tm_source_register.md`
- 사실 검증 기준선: `content/research/eu_tm_fact_verification_log.md`

중요:

- 현재 런타임용 generated JSON에 반영되는 수정은 장별 원고와 `manifest.json`을 거쳐 `master.md`로 조립된 결과여야 한다.
- `master.md`는 공개용 정본이지만, 유지보수 시작점은 장별 원고다.

## Pipeline

1. `manifest.json`이 장 제목과 파일 경로를 정의한다.
2. `scripts/build-master.ts`가 각 원고를 읽어 `master.md`를 생성한다.
3. `scripts/qa-content.ts`가 제목, 헤딩 구조, 코드 펜스, 표 형식을 검사한다.
4. `scripts/build-content.ts`가 `master.md`를 HTML, headings tree, search entries로 변환한다.
5. 루트 `GloTm` 셸이 generated JSON을 읽어 `/europe` 홈, 챕터, 검색 흐름을 렌더링한다.

## Local Verification Contract

- 워크스페이스 baseline 명령: `npm run content:prepare`
- 루트 동등 경로: 루트에서 `npm run content:europe`
- 조립 순서: `build-master.ts -> qa-content.ts -> build-content.ts`
- 현재 lane baseline: `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle`
- local workspace 증빙은 `content:prepare` 통과를 우선 사용하고, 루트 동등 경로가 필요할 때만 `content:europe`를 다시 재현한다. shared root gate는 리더 통합 단계에서 1회만 실행한다.
- 현재 챕터 수, 검색 엔트리, lifecycle, QA level, 포트폴리오 우선순위는 루트 `README.md`, `PROJECT-OVERVIEW.md`, `src/products/registry.ts`를 기준으로 확인한다.

## Editing Rules

- 공개본 수정은 먼저 `content/source/chapters/`와 `manifest.json`에서 수행한다.
- 장 제목이나 순서를 바꿀 때는 원고 H1, `manifest.json`, `master.md` 생성 결과를 함께 맞춘다.
- `master.md`는 조립 결과물이다. 수동 편집보다 재생성을 우선한다.
- generated JSON은 손으로 수정하지 않는다.
- 정확 수치, 공식 기간, 수수료는 본문보다 `content/research/eu_tm_fact_verification_log.md`에서 먼저 검증한다.
- `eu_tm_source_register.md`와 fact verification log는 같은 controlled scope를 설명해야 하며, 본문보다 먼저 범위 drift를 막는 역할을 한다.
- 루트 메타데이터, Gateway copy, shared root gate는 이 워크스페이스가 아니라 리더 통합 단계에서 처리한다.
- 권역형 본문은 EU 공통 프레임을 기준으로 유지하고, UK 비교는 controlled scope로 다룬다.

## Implementation Notes

- `build-master.ts`는 각 원고의 H1을 제거하고 내부 헤딩을 한 단계 올려 `master.md`에 넣는다.
- `build-content.ts`는 `master.md`의 H2를 챕터 경계로 보고, H3-H5를 outline과 검색 섹션 단위로 사용한다.
- 챕터 도입부는 summary와 overview search entry의 재료가 된다.
- 외부 링크는 유럽 상표 관련 공식 도메인 목록과 대조해 `official-link` 클래스를 부여한다.
- 핵심 장을 보강할 때는 권리 선택·clearance·filing·opposition·사용·갱신 흐름이 같은 운영 언어로 읽히도록 유지한다.
