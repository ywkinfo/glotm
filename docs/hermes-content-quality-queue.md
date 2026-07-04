# Hermes Content Quality Queue

이 문서는 audit/queue 전용 기록이다. 콘텐츠·코드 source는 이 문서에서 직접 고치지 않고, owner가 후속 작업으로 판단한다.

| 발견일 | 대상 | 유형 | 근거 | 권고 | 소유권 |
|---|---|---|---|---|---|
| 2026-06-21 | `LatTm/content/source/chapters/09_contracts-and-licensing-control.md:405` (`LatTm/content/source/master.md:3834`, `LatTm/content/archive/legacy-root/09_중남미_계약구조_유통_라이선스_프랜차이즈_통제.md:405`에도 동일 문구 존재) | broken-link | read-only Markdown link audit: `[본사명](이하 "허락자")`, `[파트너명](이하 "수허락자")`가 파일 링크 후보로 검출됨. `unified` + `remark-parse` 재현 결과 두 placeholder가 `url: "이하"`인 link node로 파싱됨. | 계약 조항 placeholder가 링크로 렌더링되지 않도록 owner가 문구/이스케이프 방식을 검토한다. canonical source 수정 후 master/archive/generated 반영 경로는 기존 콘텐츠 파이프라인을 따른다. | mechanical |
| 2026-06-28 | `UKTm/content/source/chapters/04_application-specification.md:32` (`UKTm/content/source/master.md:285`에도 동일 표 존재) | low-density | `nl -ba UKTm/content/source/chapters/04_application-specification.md \| sed -n '1,70p'`: "명세 초안 검토표" 아래 2개 행(`:34-35`)의 `클래스`·`초안 문구` 셀이 비어 있고 `현재 / 12개월 내 / 미정`, `Keep / Narrow / Remove` 선택지만 노출됨. `master.md:287-288`에도 같은 행이 있음. | owner가 공개용 예시 행으로 채울지, 사용자가 직접 채우는 템플릿 의도라면 라벨/문구를 명확히 할지 판단한다. canonical source 수정 후 기존 콘텐츠 파이프라인으로 master/generated를 반영한다. | mechanical |
