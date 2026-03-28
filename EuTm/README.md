# EuTm

유럽 상표 운영 가이드의 콘텐츠 원고, 리서치 문서, 빌드 스크립트를 관리하는 권역형 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `EuTm`은 `/europe` 경로로 연결된 live regional guide입니다.

## Structure

- `content/source/master.md`: 현재 앱용 JSON 생성을 위한 정본 초안
- `content/source/chapters/`: 장별 편집 초안 보관 디렉터리
- `content/source/appendix/`: 부록 초안 보관 디렉터리
- `content/research/`: 리서치 메모, 소스 레지스터, 사실 검증 로그
- `content/archive/raw/`: 초기 구조 메모와 보조 초안
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환

## Commands

- `npm run content:build`: `content/generated/` 재생성

## Notes

- 현재 `EuTm`의 공개본 기준은 `content/source/master.md`입니다.
- `content/source/chapters/`와 `appendix/`는 편집용 자산이며 자동 조립되지 않습니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/europe` 리더를 렌더링합니다.
- 수수료, 공식 기한, 시스템 명칭처럼 변동성이 큰 정보는 본문에 확정하기 전에 `content/research/eu_tm_fact_verification_log.md`에서 먼저 검증합니다.
