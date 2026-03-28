# GloTm Phase 1 Runtime QA

## 목적

Phase 1의 기준 런타임은 `LatTm/` 단독 앱이 아니라 루트 `GloTm` 셸이다.  
이번 체크리스트는 `LatTm`을 주 대상으로 검수하되, `MexTm`도 core reader parity 범위까지 함께 확인한다.

## QA 층위

1. 정적 QA
   - `LatTm/scripts/qa-content.ts`로 원고 구조, 제목, 코드 펜스, 표 형식을 검사한다.
2. 런타임 QA
   - generated JSON 로드
   - chapter slug와 public URL 유지
   - hash anchor 이동
   - 상단 검색 결과 이동
   - 모바일 좌측 메뉴에서 챕터 제목 탭 시 올바른 `/chapter/:slug` 이동
   - 모바일 좌측 메뉴에서 섹션 링크 탭 시 hash 이동 후 drawer 닫힘
   - `document.title`
   - 화면상 챕터 메타 정보
3. 수동 QA
   - 실제 읽기 흐름
   - 모바일 목차 열기/닫기
   - 모바일 목차에서 챕터/섹션 탭 가능 여부
   - continue reading 복귀

## 핵심 흐름

### LatTm 주 흐름

1. Gateway `/`에서 `LatTm` 홈 `/latam`으로 이동한다.
2. `LatTm` 홈에서 챕터 카드 또는 필터로 원하는 챕터를 찾는다.
3. `LatTm` 챕터에서 섹션 목차를 눌렀을 때 올바른 hash로 이동한다.
4. `LatTm` 상단 검색에서 결과를 눌렀을 때 올바른 챕터/섹션으로 이동한다.
5. `LatTm` 챕터 하단 이전/다음 이동이 정상 동작한다.
6. `LatTm` 홈에서 continue reading 카드가 마지막 읽은 챕터로 복귀시킨다.

### MexTm core parity

1. `/mexico` 홈이 정상 렌더링된다.
2. MexTm continue reading 카드가 마지막 읽은 챕터/섹션으로 복귀시킨다.
3. MexTm 챕터 카드에서 상세 페이지로 이동한다.
4. MexTm 챕터에서 outline이 현재 섹션 위치와 hash 이동을 유지한다.
5. MexTm 상단 검색 결과가 챕터/섹션 이동을 깨지지 않게 유지한다.
6. MexTm 이전/다음 내비, reading progress, action bar가 정상 동작한다.

### Live shell 모바일 회귀

모바일 폭(`<=920px`)에서 아래 가이드 공통으로 확인한다.

1. 목차 버튼으로 좌측 메뉴를 열 수 있다.
2. 좌측 메뉴에서 챕터 제목을 탭하면 해당 `chapter/:slug`로 이동한다.
3. 같은 상태에서 섹션 링크를 탭하면 올바른 hash로 이동하고 drawer가 닫힌다.
4. 데스크톱 폭으로 되돌렸을 때 기존 좌측 메뉴 동작이 유지된다.

- `LatTm`
- `MexTm`
- `UsaTm`
- `JapTm`
- `ChaTm`
- `EuTm`

## 비범위

- SEO 메타 태그
- canonical, Open Graph
- prerender HTML 생성
- `MexTm`의 `manifest.json`, `build-master.ts`, `qa-content.ts`
