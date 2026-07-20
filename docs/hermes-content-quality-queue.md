# Hermes Content Quality Queue

이 문서는 audit/queue 전용 기록이다. 콘텐츠·코드 source는 이 문서에서 직접 고치지 않고, owner가 후속 작업으로 판단한다.

> **append 대상**: 신규 발견은 아래 `열린 항목` 표에 행으로 추가한다. `해결됨` 표는 이력 보존용이므로
> 신규 행을 추가하지 않는다(파일 끝이 아니라 `열린 항목` 표 끝이 append 지점이다). 항목이 해소되면
> owner가 `열린 항목`에서 `해결됨`으로 옮기고 해결일·근거를 채운다.

## 열린 항목

| 발견일 | 대상 | 유형 | 근거 | 권고 | 소유권 |
|---|---|---|---|---|---|
| 2026-06-28 | `UKTm/content/source/chapters/04_application-specification.md:32` (표 헤더, 데이터 행 `:34-35`) 및 `UKTm/content/source/chapters/05_examination-refusal.md:68` (표 헤더, 데이터 행 `:70-71`). 빌드 산출물 `UKTm/content/source/master.md`의 `:372`(행 `:374-375`), `:531`(행 `:533-534`)에도 동일 표가 있다. | low-density | ch4 "명세 초안 검토표": 2개 데이터 행의 `클래스`·`초안 문구` 셀이 비어 있고 `현재 / 12개월 내 / 미정`, `Keep / Narrow / Remove` 선택지만 노출된다. ch5 "심사 대응 추적표": 같은 패턴이 더 넓게 나타나 `심사 이슈`·`내부 승인자`·`마감`·`상태` 4개 열이 비어 있다. 두 표 모두 데이터 행 2개가 바이트 단위로 동일해 행별 정보량이 0이다. | **2026-07-20 owner 결정 — 예시 1행 + 작성란 1행.** 첫 행은 구체 예시로 채우고, 둘째 행은 빈 작성란으로 두되 표 캡션/도입문에서 작성란임을 명시한다. `UKTm/Harness/Content-Spec.md:45`(복사해 쓸 수 있는 구조화 산출물)와 `:46`(구체 예시 포함)을 동시에 만족시킨다. ch4·ch5 두 표에 동일하게 적용하고, canonical source(`chapters/*.md`)만 수정한 뒤 `npm run content:uk`로 master/generated를 재생성한다. | mechanical |

## 해결됨

| 발견일 | 해결일 | 대상 | 유형 | 해결 근거 | 재발 방지 |
|---|---|---|---|---|---|
| 2026-06-21 | 2026-06-23 | `LatTm/content/source/chapters/09_contracts-and-licensing-control.md:405` (`LatTm/content/source/master.md:3834`, `LatTm/content/archive/legacy-root/09_중남미_계약구조_유통_라이선스_프랜차이즈_통제.md:405`에도 동일 문구 존재) | broken-link | 계약 조항 placeholder `[본사명](이하 "허락자")`, `[파트너명](이하 "수허락자")`가 `url: "이하"`인 link node로 파싱되던 문제. 커밋 `12ed40b` ("fix(latam): escape ch9 contract placeholder brackets to stop broken-link render", PR #91)가 여는 대괄호를 `\[`로 이스케이프해 해소했다. 검증: 7개 워크스페이스 생성물의 앵커 119개 전부가 절대 `http(s)` 형태이며 그 외 형태 0건. **주의 — `href="이하"` 문자열 grep으로는 검증되지 않는다.** rehype가 비-ASCII href를 퍼센트 인코딩하므로 결함이 재현될 때 실제로 생성되는 앵커는 `href="%EC%9D%B4%ED%95%98"`이다. 반드시 href 전체를 파싱해 형태로 판별해야 한다(2026-07-20 재현 실측). | `src/products/contentLinks.test.ts`의 절대 URL 앵커 가드(2026-07-20 추가). 생성 챕터 HTML의 모든 앵커 `href`가 `http(s)://`(또는 `mailto:`/`tel:`/`#`)여야 하므로 동일 결함이 재유입되면 `test:content` → `health:content` 레인에서 실패한다. |
