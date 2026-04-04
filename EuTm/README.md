# EuTm

유럽 상표 운영 가이드의 콘텐츠 원고, 리서치 문서, 빌드 스크립트를 관리하는 권역형 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `EuTm`은 `/europe` 경로로 연결된 live regional guide입니다.

## Structure

- `content/source/manifest.json`: 장 순서와 공개 제목을 정의하는 메타 파일
- `content/source/chapters/`: 장별 원천 원고
- `content/source/appendix/`: 부록/후속 자산 보관 디렉터리
- `content/source/master.md`: 장별 원고를 조립한 공개용 정본 마스터
- `content/research/`: 리서치 메모, 소스 레지스터, 사실 검증 로그
- `content/archive/raw/`: 초기 구조 메모와 보조 초안
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

- 현재 `EuTm`의 공개본 기준은 `content/source/master.md`입니다.
- 장별 원고 수정은 가능한 한 `content/source/chapters/`에서 시작하고, `master.md`는 조립 결과물로 취급합니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/europe` 리더를 렌더링합니다.
- 현재 빌드 기준 산출물은 14개 챕터 / 검색 엔트리 258개입니다.
- 수수료, 공식 기한, 시스템 명칭처럼 변동성이 큰 정보는 본문에 확정하기 전에 `content/research/eu_tm_fact_verification_log.md`에서 먼저 검증합니다.
- 현재 `EuTm`의 런타임 포지션은 `validate tier · beta lifecycle`입니다.
- 핵심 6장(`제1장`, `제2장`, `제4장`, `제5장`, `제7장`, `제8장`)의 controlled scope 보강은 이미 공개본 기준에 반영됐습니다.
- 현재 스프린트 우선순위는 상태 승격보다 `docs sync 유지 + controlled EU/UK scope 고정 + workspace gate 입력 정리`입니다.
- 현재 포트폴리오 실행 순서상 `ChaTm -> MexTm -> EuTm -> Report / Gateway trust layer` 정렬 안에서, `EuTm`은 full expansion보다 validate lane 안정화와 controlled Eu/UK scope 유지를 맡습니다.
- 현재 우선 유지 포인트는 `제1장`, `제2장`, `제4장`, `제5장`, `제7장`, `제8장`의 decision board, calendar, evidence handoff를 같은 운영 언어로 유지하는 데 있습니다.
