# LatTm Harness Content Spec

## Canonical Inputs

- 챕터 원고: `content/source/chapters/*.md`
- 부록 원고: `content/source/appendix/*.md`
- 챕터 메타데이터: `content/source/manifest.json`

## Chapter File Rules

- 각 원고 파일은 첫 번째 비어 있지 않은 줄에 H1 하나만 둔다.
- 원고 H1은 `manifest.json`의 해당 `title`과 정확히 일치해야 한다.
- 내부 본문 섹션은 기본적으로 H2-H4를 사용한다.
- 표는 pipe table 문법을 유지하고, 코드 펜스는 반드시 닫는다.
- 아래 항목은 원고에 남기지 않는다.
  - 조사용 마커
  - 내부 검색 턴 표식
  - 브라우저 인용 표식

## Master Document Rules

- `master.md`의 H1은 문서 전체 제목이다.
- 각 챕터 경계는 H2다.
- 챕터 내부 섹션은 H3-H5다.
- 원고 파일의 H2-H4는 `build-master.ts`를 거치며 H3-H5로 승격된다.

## Search And Reader Rules

- 챕터 첫 번째 섹션 전의 도입부는 summary와 overview search entry의 재료가 된다.
- H3-H5 각 섹션은 outline 노드와 search entry 후보가 된다.
- 섹션 제목은 slug로 변환되어 hash 이동과 검색 이동의 기준이 된다.

## Editorial Guidance

- 장 제목을 바꿀 때는 원고 H1, `manifest.json`, `master.md` 생성 결과를 함께 확인한다.
- 법률 사실, 기한, 기관명, 수수료, 제도 설명은 공식 출처 또는 기존 검증 로그와 맞춘다.
- 표와 체크리스트는 독자가 실행 가능한 수준으로 구체적으로 유지한다.
- 지나치게 긴 중복 문단은 `qa-content.ts` warning 대상이 될 수 있으므로 반복을 줄인다.
