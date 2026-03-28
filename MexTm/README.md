# MexTm

멕시코 상표 실무 운영 가이드북의 콘텐츠 원고와 빌드 산출물을 관리하는 보조 워크스페이스입니다.
현재 활성 런타임은 루트 `GloTm` 셸이며, 독립 SPA 리더 코드는 `../archive/legacy-readers/MexTm/`로 이동해 보관합니다.

## Structure

- `content/source/master.md`: 앱이 읽는 정본 원고
- `content/source/chapters/`: 장별 초안과 보조 원고
- `content/source/appendix/`: 부록 원고
- `content/research/`: 리서치 문서
- `content/archive/raw/`: 초기 텍스트 초안과 보관 자료
- `content/generated/`: 검색 인덱스와 렌더링용 JSON 산출물
- `scripts/build-content.ts`: 마스터 원고를 앱용 JSON으로 변환
- `../archive/legacy-readers/MexTm/`: 이전 독립 SPA 런타임 보관본

## Commands

- `npm run content:build`: `content/generated/` 재생성

## Notes

- 루트 `GloTm` 셸은 `content/source/master.md`만 정본 입력으로 사용합니다.
- `content/generated/`는 빌드 산출물이므로 버전 관리에서 제외됩니다.
