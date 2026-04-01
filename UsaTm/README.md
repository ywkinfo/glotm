# UsaTm

미국 상표 실무 운영 가이드북의 콘텐츠 원고와 빌드 산출물을 관리하는 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `UsaTm`은 `/usa` 경로로 연결된 live country guide입니다.

## Structure

- `content/source/manifest.json`: 장 순서와 공개 제목을 정의하는 메타 파일
- `content/source/chapters/`: 장별 원천 원고
- `content/source/appendix/`: 부록 초안과 템플릿
- `content/source/master.md`: 장별 원고를 조립한 공개용 정본 마스터
- `content/research/`: 공식 출처 기반 리서치, 검증 로그, 소스 레지스터
- `content/archive/raw/`: 초기 메모, 외부 요약, 구조 초안
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

- v1의 공개본 기준은 `content/source/master.md`이지만, 유지보수 시작점은 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`입니다.
- `master.md`는 조립 결과물로 취급하며, 수동 편집보다 재생성을 우선합니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/usa` 리더를 렌더링합니다.
- 현재 루트 `GloTm`의 `content:prepare`에서는 `UsaTm`이 shortcut 예외 그룹으로 동작합니다. 즉 루트에서는 빠른 generated-content 갱신 경로를 사용하고, deeper content QA가 필요할 때는 `UsaTm` 로컬 `content:prepare`를 직접 실행합니다.
- 현재 빌드 기준 산출물은 **14개 챕터 / 검색 엔트리 165개**입니다.
- 수수료, 세부 기한, 시스템 명칭처럼 변동성이 큰 정보는 출판 직전 `content/research/us_tm_fact_verification_log.md`로 다시 확인합니다.
