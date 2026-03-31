# MexTm

멕시코 상표 실무 운영 가이드북의 콘텐츠 원고와 빌드 산출물을 관리하는 보조 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, 독립 SPA 리더 코드는 `../archive/legacy-readers/MexTm/`로 이동해 보관합니다.

## Structure

- `content/source/manifest.json`: 장 순서와 공개 제목을 정의하는 메타 파일
- `content/source/chapters/`: 장별 원천 원고
- `content/source/appendix/`: 부록 원고
- `content/source/master.md`: 장별 원고를 조립한 공개용 정본 마스터
- `content/research/`: 리서치 문서와 fact verification log
- `content/archive/raw/`: 초기 텍스트 초안과 보관 자료
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-master.ts`: manifest 기준 정본 마스터 생성
- `scripts/qa-content.ts`: 제목, 헤딩 구조, 표/코드 펜스 기본 QA
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환
- `../archive/legacy-readers/MexTm/`: 이전 독립 SPA 런타임 보관본

## Commands

- `npm run content:master`: `master.md` 생성
- `npm run content:qa`: 콘텐츠 구조 검사
- `npm run content:build`: 리더용 JSON 산출물 생성
- `npm run content:prepare`: 마스터 생성, QA, 콘텐츠 빌드를 순서대로 실행

## Notes

- 루트 `GloTm` 셸은 `content/source/master.md`를 정본 입력으로 읽지만, 유지보수 시작점은 `content/source/chapters/`, `content/source/appendix/`, `manifest.json`입니다.
- `master.md`는 조립 결과물로 관리하고, 수동 편집보다 재생성을 우선합니다.
- 변동성이 큰 사실은 `content/research/mx_tm_fact_verification_log.md`에서 먼저 검증합니다.
- `content/generated/`는 빌드 산출물이므로 버전 관리에서 제외됩니다.
