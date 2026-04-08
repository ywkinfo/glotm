# EuTm

유럽 상표 운영 가이드의 콘텐츠 원고, 리서치 문서, 빌드 스크립트를 관리하는 권역형 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `EuTm`은 `/europe` 경로로 연결된 regional guide입니다.

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
- 현재 workspace baseline은 `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope`입니다.
- 장별 원고 수정은 가능한 한 `content/source/chapters/`에서 시작하고, `master.md`는 조립 결과물로 취급합니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/europe` 리더를 렌더링합니다.
- 수수료, 공식 기한, 시스템 명칭처럼 변동성이 큰 정보는 본문에 확정하기 전에 `content/research/eu_tm_fact_verification_log.md`에서 먼저 검증합니다.
- `content/research/eu_tm_source_register.md`는 이번 validate lane에서 어떤 1차 출처군을 먼저 봐야 하는지 고정하는 companion artifact입니다.
- 권역형 본문은 EU 공통 프레임을 중심으로 유지하고, UK 병행 판단은 controlled EU+UK scope 안에서만 다룹니다.
- lane baseline 증빙은 로컬 `npm run content:prepare`를 우선 사용하고, 루트 동등 경로가 필요할 때만 `npm run content:europe`를 다시 재현합니다. shared root gate는 리더 통합 단계에서 1회만 실행합니다.
- 런타임 메타데이터, lifecycle, 현재 우선순위, 포트폴리오 실행 순서, 루트 refresh 정책은 루트 `README.md`, `PROJECT-OVERVIEW.md`, `src/products/registry.ts`를 기준으로 확인합니다.
