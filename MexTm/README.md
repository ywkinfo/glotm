# MexTm

멕시코 상표 실무 운영 가이드북을 로컬에서 탐색하는 Vite + React 기반 문서 리더입니다.

## Structure

- `content/source/master.md`: 앱이 읽는 정본 원고
- `content/source/chapters/`: 장별 초안과 보조 원고
- `content/source/appendix/`: 부록 원고
- `content/research/`: 리서치 문서
- `content/archive/raw/`: 초기 텍스트 초안과 보관 자료
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환
- `src/app/`: 앱 셸과 라우팅
- `src/features/`: 탐색, 검색, 리더 UI
- `src/shared/`: 공용 타입과 유틸리티
- `src/content/`: 생성된 콘텐츠 데이터 로더

## Commands

- `npm run dev`: 콘텐츠 생성 후 개발 서버 실행
- `npm run content:build`: `content/generated/` 재생성
- `npm run build`: 콘텐츠 생성 후 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기

## Notes

- 앱은 `content/source/master.md`만 정본 입력으로 사용합니다.
- `content/generated/`는 빌드 산출물이므로 버전 관리에서 제외됩니다.
