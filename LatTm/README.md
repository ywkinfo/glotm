# LatTm

중남미 상표 보호 운영 가이드를 로컬에서 검수하고 읽기 위한 Vite + React 기반 문서 리더입니다.

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
- `src/app/`: 앱 셸과 라우팅
- `src/features/`: 탐색, 검색, 리더 UI
- `src/shared/`: 공용 타입과 유틸리티
- `src/content/`: 생성된 콘텐츠 데이터 로더

## Commands

- `npm run dev`: 정본 생성과 QA 후 개발 서버 실행
- `npm run content:master`: `master.md` 생성
- `npm run content:qa`: 콘텐츠 품질 검사
- `npm run content:build`: 리더용 JSON 산출물 생성
- `npm run content:prepare`: 마스터 생성, QA, 콘텐츠 빌드를 순서대로 실행
- `npm run build`: 콘텐츠 준비 후 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기

## Notes

- 리더와 배포 파이프라인은 `content/source/master.md`만 읽습니다.
- `latam_brand.md`, `latin_intro.md`, legacy `index.html`은 아카이브/리서치 자산이며 직접 게시하지 않습니다.
- 사실 검증 결과는 `content/research/fact-verification-log.md`에 누적합니다.
