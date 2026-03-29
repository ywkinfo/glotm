# GloTm Phase 1 Runtime QA

## 목적

Phase 1의 기준 런타임은 `LatTm/` 단독 앱이 아니라 루트 `GloTm` 셸이다.
이번 체크리스트는 `로컬 루트`, `로컬 Pages subpath`, `배포 루트`, `배포 Pages subpath`까지 포함해
링크 신뢰성 회귀를 재현 가능하게 유지하는 데 목적이 있다.

## 자동 검증 범위

1. Shell 계약
   - Gateway `/`
   - 상단 제품 전환
   - 글로벌 브랜드 링크
   - unknown route → Gateway redirect
   - deployment basename(`/glotm`) 하의 rendered `href`
2. Reader 홈 계약
   - 6개 가이드 전부의 chapter-card `href`
   - continue reading `href`
   - configured reader의 inline `LatTm` cross-link
   - `LatTm` home finder 필터 동작
3. Reader 챕터 계약
   - direct deep link boot
   - `document.title`
   - sidebar / outline / prev-next link contract
   - invalid chapter slug → 제품 홈 redirect
4. Content 링크 계약
   - generated article HTML의 representative external anchor safe attribute
   - raw internal app anchor 금지

## 수동 스모크 환경

아래 4조건에서 같은 체크리스트를 반복한다.

1. desktop local root
2. mobile local root
3. desktop Pages subpath
4. mobile Pages subpath

## 수동 스모크 체크리스트

1. Gateway `/`에서 각 가이드로 진입할 수 있다.
2. 제품 홈에서 chapter card와 continue reading 링크가 올바른 챕터로 연결된다.
3. 제품 홈의 inline product link가 올바른 다른 가이드로 이동한다.
4. 챕터 deep link(`chapter/:slug#section`)로 직접 진입했을 때 올바른 섹션이 열린다.
5. 챕터의 outline / sidebar / prev-next 링크가 깨지지 않는다.
6. 상단 검색 결과를 눌렀을 때 올바른 챕터·섹션으로 이동한다.
7. 스크롤 이후에도 search dropdown이 progress/action layer 아래로 깔리지 않는다.
8. action bar가 하단 chapter nav 클릭을 가리지 않는다.
9. 모바일에서 drawer를 열고 닫을 수 있고, scrim으로 닫은 뒤 `body.style.overflow`가 복구된다.
10. 모바일에서 chapter/section 링크가 손가락으로 눌릴 정도로 안정적으로 노출된다.
11. external official link는 새 탭으로 열리고 `rel="noreferrer noopener"`를 유지한다.

## 실행 명령

1. `npm test`
2. `npm run build`
3. `npm run build:pages:glotm`

## 비범위

- SEO 메타 태그
- canonical, Open Graph
- prerender HTML 생성
- 새 E2E 프레임워크 도입
