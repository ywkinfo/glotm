# ChaTm Harness Content Spec

## Canonical Input

- 현재 빌드 기준 정본은 `content/source/master.md`다.

이 문서가 중요하다.

- `scripts/build-content.ts`는 `master.md`만 읽는다.
- `content/source/chapters/`와 `appendix/`는 현재 참고용 또는 후속 분리용 자산이며 자동 조립되지 않는다.

## Master Document Rules

- 문서 첫 번째 H1은 전체 가이드 제목이다.
- 각 H2는 하나의 챕터를 시작한다.
- 각 챕터 안에서 H3-H5는 outline과 search entry 생성을 위한 섹션 단위다.
- 챕터 도입부는 첫 H3 이전까지의 내용으로 보고 summary와 overview search entry를 만든다.

## Chapter Writing Rules

- 챕터 제목은 H2에서만 정의한다.
- 본문 섹션은 가능하면 H3부터 시작하고, 필요한 경우 H4-H5까지 사용한다.
- 표는 pipe table 문법을 유지하고, 코드 펜스는 반드시 닫는다.
- 링크와 기관명은 독자가 다시 확인할 수 있는 공식 명칭으로 적는다.
- 민감한 법률 사실과 기한은 CNIPA, SAMR, 법원, WIPO 등 공식 출처 기준으로 다시 확인한다.

## Editorial Warnings

- 개별 챕터 파일을 수정해도 `master.md`에 반영되지 않으면 현재 generated JSON에는 나타나지 않는다.
- `manifest.json`과 자동 QA가 없으므로 제목 정합성, 헤딩 구조, 표 형식, 중복 문단은 수동 검토 비중이 크다.
- 향후 `LatTm`식 파이프라인으로 이식되기 전까지는 `master.md`가 실제 공개본 기준이다.
