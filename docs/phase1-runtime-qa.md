# GloTm Phase 1 Runtime QA

## 목적

Phase 1의 기준 런타임은 `LatTm/` 단독 앱이 아니라 루트 `GloTm` 셸이다.
이번 체크리스트는 `로컬 루트`, `로컬 Pages subpath`, `배포 루트`, `배포 Pages subpath`까지 포함해
링크 신뢰성 회귀를 재현 가능하게 유지하는 데 목적이 있다.

## 운영 원칙

- 루트 verification 계약은 `health:runtime`, `health:content`, `health:release` 세 execution lane으로 나누고, `health:report`는 최근 lane 상태와 advisory research status를 묶는 reporting surface로 유지한다.
- 제품 상태, 챕터 수, 검색 엔트리 수, 성숙도 메모는 `src/products/registry.ts`를 기준으로 본다.
- 자동 검증과 수동 스모크의 경계를 명확히 유지한다. 자동 검증이 통과해도 아래 수동 항목은 별도로 확인한다.
- 월간 scorecard review에서는 `verifiedOn`에서 계산한 freshness, `qaLevel`, `highRiskVerificationGapCount`를 health report 입력값으로 본다.

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
4. Runtime 콘텐츠 계약
   - 런타임이 generated article HTML을 정상 렌더링하는가
   - raw internal app anchor 금지 회귀는 content lane에서 별도 확인

### 자동 검증 책임

- `npm run health:runtime`: `typecheck:runtime`, `test:runtime`, `npm run e2e:smoke`를 묶어 셸 계약, 리더 계약, 콘텐츠 링크 계약, 실제 브라우저 스모크를 검증한다. generated-content 의존 회귀 테스트와 generated artifact가 필요한 node-side 검사는 이 lane에서 제외해 pure runtime check로 유지한다.
- `npm run health:content`: 루트 `content:prepare`와 `test:content`를 실행한 뒤 `ChaTm`·`MexTm`·`EuTm` workspace local `content:prepare`까지 재현한다. 여기에는 generated article HTML의 external-link safe attribute와 raw internal app anchor 금지 회귀도 포함된다. `UsaTm`·`JapTm`·`UKTm`은 lighter-track 기준으로 루트 refresh 계약을 따른다.
- `npm run health:release`: `npm run build`, `npm run build:pages:glotm`를 묶어 루트 셸 빌드와 GitHub Pages subpath 배포 경로를 검증한다. 여기에는 representative prerendered HTML, `dist/sitemap.xml`, `dist/robots.txt`, `dist/404.html`, `dist/.nojekyll` 확인이 포함된다. 로컬 release verification은 `build:pages:glotm`, GitHub Actions workflow deploy path는 `deploy-pages.yml`에서 env를 주입한 뒤 실행하는 `build:pages`로 구분해서 적는다.
- `npm run health:report`: 최근 실행한 루트 lane 결과와 product scorecard 메타데이터를 같은 포맷으로 정리한다. 필요하면 lane 플래그로 일시 덮어쓸 수 있다.

## 루트 계약과 워크스페이스 로컬 계약

- 루트 검증 계약은 어디까지나 `GloTm` 셸 회귀를 빠르게 확인하기 위한 공통 기준이다.
- 워크스페이스 로컬 `content:prepare`는 루트 shortcut보다 더 깊은 조립/QA 흐름을 가질 수 있다.
- 현재 `UsaTm`, `JapTm`은 루트 검증 계약에서 shortcut 예외 그룹으로 취급한다. 즉 루트 `content:prepare`에서는 generated JSON을 빠르게 갱신하는 경로를 사용하고, deeper content QA가 필요할 때는 각 워크스페이스 로컬 `content:prepare`를 기준 경로로 본다.
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

### Incubate pack addendum (UsaTm·JapTm·UKTm)
1. `/usa`, `/japan` 홈은 beta lighter-track 상태와 맞지 않는 `콘텐츠 준비 중` draft notice를 노출하지 않는다.
2. `/uk` 홈은 `draft 공개본` 안내를 유지하되, continue reading과 search 흐름은 일반 홈 계약과 같은 안정성으로 동작한다.
3. `/usa`, `/japan`, `/uk` 홈 copy가 filing / specimen / monitoring, route / maintenance, filing / maintenance / platform-domain incident reader utility 초점과 각각 어긋나지 않는다.

### Report / trust-layer handoff addendum
1. `/china`, `/mexico`, `/europe` 홈에서 `관련 Report / Trust Layer` 카드가 Continue Reading 아래, chapter grid 위에서 노출된다.
2. Gateway 첫 화면의 최신 report 2개 카드와 report section의 `리포트 보기` CTA가 각각 올바른 report detail로 이동한다.
3. guide 홈의 trust-layer handoff로 report detail에 들어갔을 때 `fromGuide` context가 유지되고, report detail 상단 CTA와 focus point CTA가 다시 해당 guide의 chapter hash deep link로 정확히 돌아온다.
4. 로컬 Pages subpath 검증은 `build:pages:glotm`, workflow deploy path 검증은 env-driven `build:pages`를 기준으로 적고, artifact pass와 live Pages 상호작용 표현을 같은 문장으로 섞지 않는다.

### ChaTm sprint addendum

`ChaTm` Sprint 2 보강 뒤에는 아래 항목을 수동으로 다시 본다.

1. `/china` 홈에서 우선 잠금 6장이 chapter card 목록에서 정상 노출된다.
2. 제2장과 제3장에서 표기 전략, search, subclass handoff 표가 깨지지 않고 렌더링된다.
3. 제5장에서 `类似商品和服务区分表` 관련 표와 예산/제출 메모가 표 깨짐 없이 보인다.
4. 제6장에서 3개월 이의, 15일 복심 기한표와 triage 표가 outline/search 이동에 정상 연결된다.
5. 제7장에서 evidence vault, 2개월 triage, 부분 유지 판단표가 한 화면에서 읽힌다.
6. 제10장에서 행정/플랫폼/세관/사법 경로와 공식 용어 표준안이 빈 줄 없이 렌더링된다.
7. `/china` continue reading이 잠금 장 deep link로 복귀할 때 본문과 outline이 정상 동기화된다.
8. 제4장의 route memo 보강 섹션이 search와 outline에서 section 단위로 잡힌다.
9. 제8장의 attack/defense 분기표와 제9장의 control sheet가 모바일에서도 깨지지 않는다.
10. 제12장 customs escalation matrix와 제13장 mature QA checklist가 검색 결과에서 바로 열린다.

### ChaTm release-readiness

- `npm run content:china`
- `npm test`
- `npm run build`
- `npm run build:pages:glotm`
- Gateway 카드의 ChaTm summary, freshness, gap, maturity note가 실제 상태와 맞다.

### MexTm sprint addendum

`MexTm` Sprint 2 우선 3장(제5장, 제7장, 제10장)을 보강한 뒤에는 아래 항목을 수동으로 다시 본다.

1. `/mexico` 홈에서 우선 3장이 chapter card 목록과 continue reading 추천 흐름에서 정상 노출된다.
2. 제5장에서 filing packet handoff scorecard, signing authority, `Tu cuenta PASE` / `Marca en Línea` handoff가 표 깨짐 없이 보인다.
3. 제7장에서 declaration of use, renewal, owner-user linkage를 묶는 rights-maintenance triage board가 한 화면에서 읽힌다.
4. 제10장에서 border incident classification board와 IMPI / ANAM one-pack escalation memo가 빈 줄 없이 렌더링된다.
5. `/mexico` 검색에서 우선 3장의 decision board·체크리스트 항목이 섹션 단위로 탐색된다.
6. `/mexico` continue reading이 장 중간 deep link로 복귀할 때 scroll/outline contract가 깨지지 않는다.

### MexTm release-readiness

- `npm run content:mexico`
- `npm test`
- `npm run build`
- `npm run build:pages:glotm`
- Gateway 카드의 MexTm summary, freshness, gap, lifecycle note가 실제 상태와 맞다.

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
- `UsaTm`, `JapTm`: 루트 검증 계약에서는 현재 shortcut generated-content 갱신 경로를 사용한다. 이 둘은 root shortcut 예외 그룹이며, 콘텐츠를 직접 수정하거나 deeper content QA가 필요할 때는 각 워크스페이스 로컬 `content:prepare`를 직접 실행한다.
- `ChaTm`, `EuTm`, `UKTm`: 루트 검증 계약에서도 `build-master -> qa-content -> build-content` 전체 흐름을 사용한다.
- 즉, 루트 `content:prepare` 성공은 `UsaTm`, `JapTm`에 대해 full local content QA 완료를 의미하지 않는다.

## 실행 명령

1. `npm run health:runtime`
2. `npm run health:content`
3. `npm run health:release`
4. `npm run health:report`

## release lane에서 별도 확인하는 항목

- generated `title`, `description`, canonical, Open Graph, Twitter 메타
- prerender HTML 생성 결과
- `dist/sitemap.xml`, `dist/robots.txt`, `dist/404.html`, `dist/.nojekyll`
- 새 E2E 프레임워크 도입

## 수동 스모크에 남기는 핵심 항목

자동 검증이 이미 덮는 링크/라우팅/reader contract 항목은 반복 서술하지 않는다. 수동 스모크는 아래 항목만 강하게 본다.

- mobile local root / mobile Pages subpath에서 drawer, scrim, `body.style.overflow` 복구
- skeleton guide의 빈 본문, 검색 0건 empty state, 짧은 챕터 footer 겹침
- search dropdown과 action layer의 overlay 충돌
- priority guide home의 report handoff CTA와 report-to-guide deep link 왕복
- Gateway priority copy와 실제 portfolio status 정합성
