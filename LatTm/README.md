# LatTm

중남미 상표 보호 운영 가이드의 콘텐츠 원고, 빌드 스크립트, 공유 스타일 자산을 관리하는 보조 워크스페이스입니다.
루트 `GloTm` 셸이 현재 유일한 활성 런타임이며, 독립 SPA 리더 코드는 `../archive/legacy-readers/LatTm/`로 이동해 보관합니다.

## Structure

- `content/source/manifest.json`: 정본 마스터에 포함할 장 순서와 제목
- `content/source/chapters/`: 장별 편집 원고
- `content/source/appendix/`: 부록 원고
- `content/source/master.md`: 배포와 리더가 읽는 단일 정본 원고
- `content/research/`: 리서치 문서와 사실 검증 로그
- `content/archive/legacy-root/`: 초기 루트 파일 보관본
- `content/generated/`: 검색 인덱스와 리더용 JSON 산출물
- `scripts/build-master.ts`: manifest 기준 정본 마스터 생성
- `scripts/qa-content.ts`: 제목, 마커, 코드 펜스, 표 형식 QA
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환
- `src/styles.css`: 루트 `GloTm` 셸이 그대로 import하는 공유 리더 스타일
- `../archive/legacy-readers/LatTm/`: 이전 독립 SPA 런타임 보관본

## Commands

- `npm run content:master`: `master.md` 생성
- `npm run content:qa`: 콘텐츠 품질 검사
- `npm run content:build`: 리더용 JSON 산출물 생성
- `npm run content:prepare`: 마스터 생성, QA, 콘텐츠 빌드를 순서대로 실행

## Notes

- 루트 `GloTm` 셸과 배포 파이프라인은 `content/source/master.md`만 읽습니다.
- `latam_brand.md`, `latin_intro.md`, legacy `index.html`은 아카이브/리서치 자산이며 직접 게시하지 않습니다.
- 사실 검증 결과는 `content/research/fact-verification-log.md`에 누적합니다.
