# UsaTm

미국 상표 실무 운영 가이드북의 콘텐츠 원고와 빌드 산출물을 관리하는 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, `UsaTm`은 `/usa` 경로로 연결된 live country guide입니다.

## Structure

- `content/source/master.md`: 앱용 JSON 생성을 위한 정본 원고
- `content/source/chapters/`: 장별 편집 초안
- `content/source/appendix/`: 부록 초안과 템플릿
- `content/research/`: 공식 출처 기반 리서치, 검증 로그, 소스 레지스터
- `content/archive/raw/`: 초기 메모, 외부 요약, 구조 초안
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환

## Commands

- `npm run content:build`: `content/generated/` 재생성

## Notes

- v1의 공개본 기준은 `content/source/master.md`입니다.
- `content/source/chapters/`와 `content/source/appendix/`는 편집용 자산이며, 현재 빌드는 자동 조립하지 않습니다.
- 루트 `GloTm` 셸은 이 워크스페이스의 `content/generated/` 산출물을 읽어 `/usa` 리더를 렌더링합니다.
- 수수료, 세부 기한, 시스템 명칭처럼 변동성이 큰 정보는 출판 직전 `content/research/us_tm_fact_verification_log.md`로 다시 확인합니다.
