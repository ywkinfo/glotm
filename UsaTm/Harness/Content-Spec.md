# UsaTm Harness Content Spec

## Canonical Input

- 현재 빌드 기준 정본은 `content/source/master.md`다.

이 문서가 중요하다.

- `scripts/build-content.ts`는 `master.md`만 읽는다.
- `content/source/chapters/`와 `appendix/`는 현재 참고용 또는 편집용 자산이며 자동 조립되지 않는다.

## Master Document Rules

- 문서 첫 번째 H1은 전체 가이드 제목이다.
- 각 H2는 하나의 챕터를 시작한다.
- 각 챕터 안에서 H3-H5는 outline과 search entry 생성을 위한 섹션 단위다.
- 챕터 도입부는 첫 H3 이전까지의 내용으로 보고 summary와 overview search entry를 만든다.

## Chapter Writing Rules

- 챕터 제목은 H2에서만 정의한다.
- 본문 섹션은 가능하면 H3부터 시작하고, 필요한 경우 H4-H5까지 사용한다.
- 각 챕터는 최소 3개의 H3를 둔다.
- 표는 pipe table 문법을 유지하고, 코드 펜스는 반드시 닫는다.
- 링크와 기관명은 독자가 확인 가능한 형태로 쓴다.
- 수수료, 제출기한, 시스템 명칭, 공식 폼 이름은 공식 출처 기준으로 다시 확인한다.

## Editorial Warnings

- 개별 챕터 파일을 수정해도 `master.md`에 반영되지 않으면 현재 generated JSON에는 나타나지 않는다.
- `manifest.json`과 자동 QA가 없으므로, 제목 정합성·헤딩 구조·중복 문단은 수동 검토 비중이 더 크다.
- 정확 수치가 필요한 문장은 `content/research/us_tm_fact_verification_log.md` 검증 상태를 먼저 본다.
