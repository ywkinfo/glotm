# GloTm Phase 1 Runtime QA

## 목적

Phase 1의 기준 런타임은 `LatTm/` 단독 앱이 아니라 루트 `GloTm` 셸이다.
이번 체크리스트는 `로컬 루트`, `로컬 Pages subpath`, `배포 루트`, `배포 Pages subpath`까지 포함해
링크 신뢰성 회귀를 재현 가능하게 유지하는 데 목적이 있다.

## 운영 원칙

- 루트 검증 계약은 `npm test`, `npm run build`, `npm run build:pages:glotm`, `npm run content:prepare` 네 가지다.
- 제품 상태, 챕터 수, 검색 엔트리 수, 성숙도 메모는 `src/products/registry.ts`를 기준으로 본다.
- 자동 검증과 수동 스모크의 경계를 명확히 유지한다. 자동 검증이 통과해도 아래 수동 항목은 별도로 확인한다.

## 자동 검증 범위

1. Shell 계약
   - Gateway `/`
   - 상단 제품 전환
   - 글로벌 브랜드 링크
   - unknown route → Gateway redirect
   - deployment basename(`/glotm`) 하의 rendered `href`
2. Reader 홈 계약
   - 7개 가이드 전부의 chapter-card `href`
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

### 자동 검증 책임

- `npm test`: 셸 계약, 리더 계약, 콘텐츠 링크 계약
- `npm run content:prepare`: 루트 검증 계약용 mixed pipeline 실행. 현재 `LatTm`·`MexTm`·`ChaTm`·`EuTm`·`UKTm`은 `build-master -> qa-content -> build-content` 전체 흐름을 타고, `UsaTm`·`JapTm`은 `build-content.ts` shortcut으로 generated JSON을 갱신한다.
- `npm run build`: 루트 셸 빌드와 generated content 동기화
- `npm run build:pages:glotm`: GitHub Pages subpath 배포 경로 검증

## 루트 계약과 워크스페이스 로컬 계약

- 루트 검증 계약은 어디까지나 `GloTm` 셸 회귀를 빠르게 확인하기 위한 공통 기준이다.
- 워크스페이스 로컬 `content:prepare`는 루트 shortcut보다 더 깊은 조립/QA 흐름을 가질 수 있다.
- 문서, 구조, 리서치 편집을 할 때는 루트 명령만 보지 말고 각 워크스페이스의 `package.json`과 `README.md`를 함께 확인한다.

## 수동 스모크 환경

아래 4조건에서 같은 체크리스트를 반복한다.

1. desktop local root
2. mobile local root
3. desktop Pages subpath
4. mobile Pages subpath

## 수동 스모크 체크리스트

### 공통 (LatTm 기준)
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

### Skeleton 가이드 추가 점검 (UsaTm·JapTm·ChaTm·EuTm·UKTm)
12. 각 가이드 홈(`/usa`, `/japan`, `/china`, `/europe`, `/uk`)이 빈 화면 없이 챕터 목록을 표시한다.
13. 챕터 카드를 클릭했을 때 빈 본문(콘텐츠 0줄) 페이지가 노출되지 않는다.
14. 검색 결과 0건이 반환될 때 "결과 없음" 상태가 명확히 표시되며 빈 드롭다운이 열리지 않는다.
15. 모바일에서 콘텐츠가 짧은 챕터의 prev-next 버튼과 footer가 viewport 하단에서 겹치지 않는다.

## 콘텐츠 QA 파이프라인

### LatTm (완전 파이프라인)
```
npm run content:latam
```
- build-master.ts → qa-content.ts → build-content.ts 순 실행
- QA 에러 0개 필수, 경고는 검토 후 판단

### MexTm (루트 full pipeline)
```
npm run content:mexico
```
- 루트 검증 계약에서도 `build-master.ts -> qa-content.ts -> build-content.ts` 전체 흐름을 실행한다.
- 워크스페이스 로컬에서도 `cd MexTm && npm run content:prepare`로 같은 전체 흐름을 재현할 수 있다.
- 구조 수정 시에는 루트와 로컬 어느 쪽을 쓰더라도 `master.md`와 generated JSON이 함께 재생성된다.

### 나머지 가이드
```
npm run content:usa
npm run content:japan
npm run content:china
npm run content:europe
npm run content:uk
```
- `UsaTm`, `JapTm`: 루트 검증 계약에서는 현재 `build-content.ts` shortcut을 사용한다.
- `ChaTm`, `EuTm`, `UKTm`: 루트 검증 계약에서도 `build-master -> qa-content -> build-content` 전체 흐름을 사용한다.
- deeper content QA가 필요하면 각 워크스페이스 로컬 `content:prepare`를 직접 실행한다.

## 실행 명령

1. `npm test`
2. `npm run build`
3. `npm run build:pages:glotm`
4. `npm run content:prepare`

## 비범위

- SEO 메타 태그
- canonical, Open Graph
- prerender HTML 생성
- 새 E2E 프레임워크 도입
