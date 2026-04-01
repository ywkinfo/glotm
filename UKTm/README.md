# UKTm

영국 상표 실무 운영 가이드북의 콘텐츠 원고, 리서치 문서, 빌드 스크립트를 관리하는 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `UKTm`은 `/uk` 경로에 이미 연결된 영국 단일국가 early track입니다.

## Structure

- `content/source/manifest.json`: 장 순서와 공개 제목을 정의하는 메타 파일
- `content/source/chapters/`: 장별 원천 원고
- `content/source/appendix/`: 부록 초안과 템플릿
- `content/source/master.md`: 장별 원고를 조립한 공개용 정본 마스터
- `content/research/`: 공식 출처 기반 리서치, 검증 로그, 소스 레지스터
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-master.ts`: manifest 기준 정본 마스터 생성
- `scripts/qa-content.ts`: 제목, 헤딩 구조, 표/코드 펜스 기본 QA
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환

## Commands

- `npm run content:master`: `master.md` 생성
- `npm run content:qa`: 콘텐츠 구조 검사
- `npm run content:build`: 리더용 JSON 산출물 생성
- `npm run content:prepare`: 마스터 생성, QA, 콘텐츠 빌드를 순서대로 실행

## Notes

- 공개본 기준은 `content/source/master.md`이지만, 유지보수 시작점은 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`입니다.
- `master.md`는 조립 결과물로 취급하며, 수동 편집보다 재생성을 우선합니다.
- 영국 실무는 Brexit 이후 EU 경로와 분리된 운영 판단이 많으므로, `EuTm`과 중복 설명보다 UKIPO 실무 판단 기준을 우선 정리합니다.
- 수수료, 기한, 기관명, 공식 시스템 명칭처럼 변동성이 큰 정보는 출판 직전 `content/research/uk_tm_fact_verification_log.md`로 다시 확인합니다.
- 현재 우선순위는 신규 대확장보다 `draft 공개본 · early track` 상태를 유지하면서 문서 정합성, fact log, 루트 회귀 방지 기준을 단단히 하는 것입니다.
