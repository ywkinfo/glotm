# ChaTm

중국 상표제도와 중국 상표 실무 운영 이슈를 다루는 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `ChaTm`는 `/china` 경로로 연결된 live country guide입니다.

## Structure

- `content/source/manifest.json`: 장 순서와 공개 제목을 정의하는 메타 파일
- `content/source/chapters/`: 장별 원천 원고
- `content/source/master.md`: 장별 원고를 조립한 공개용 정본 마스터
- `content/research/`: 중국 상표제도 조사 메모, fact verification log, 출처 정리
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-master.ts`: manifest 기준 정본 마스터 생성
- `scripts/qa-content.ts`: 제목, 헤딩 구조, 표/코드 펜스 기본 QA
- `scripts/build-content.ts`: 마스터 원고를 앱 소비용 JSON으로 변환
- `Harness/`: 현재 구조와 편집 규칙 문서

## Commands

- `npm run content:master`: `master.md` 생성
- `npm run content:qa`: 콘텐츠 구조 검사
- `npm run content:build`: 리더용 JSON 산출물 생성
- `npm run content:prepare`: 마스터 생성, QA, 콘텐츠 빌드를 순서대로 실행

## Notes

- 현재 공개본 기준은 `content/source/master.md`이지만, 유지보수 시작점은 `content/source/chapters/`와 `manifest.json`입니다.
- `master.md`는 조립 결과물로 취급하며, 수동 편집보다 재생성을 우선합니다.
- 변동성이 큰 사실은 `content/research/cn_tm_fact_verification_log.md`에서 먼저 검증합니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/china` 리더를 렌더링합니다.
