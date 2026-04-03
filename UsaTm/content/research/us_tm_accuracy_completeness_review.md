# UsaTm Accuracy & Completeness Review

검수 기준일: 2026-04-03

## 전체 총평

- 대상 문서: `UsaTm/content/source/master.md`
- 검수 수준: verification refresh
- 검수 초점: 공개본 기준의 사실 정합성, 운영 흐름 충실도, local pipeline 재현 가능성

현재 `UsaTm` 본문은 미국 연방 상표 운영의 핵심 흐름을 독자가 실제 판단 순서대로 읽을 수 있는 상태다. 이번 refresh에서는 `content:prepare` local pipeline을 다시 통과시켰고, 민감 사실은 `us_tm_fact_verification_log.md`와 `us_tm_source_register.md` 기준으로 재점검했다. 그 결과, 공개를 막을 치명적 정확도 결함이나 즉시 재작성 필요 장은 확인되지 않았다.

다만 미국 실무는 시스템 명칭, 수수료, 세부 기한처럼 변동성이 큰 항목이 많기 때문에, 아래 항목은 공개 직전 다시 확인하는 편이 맞다. 이는 현재 본문이 부정확하다는 뜻이 아니라, 운영 문서로서 마지막 확인 루틴을 유지하라는 의미다.

판정:

- 정확도: 통과
- 충실도: 통과
- local pipeline: 통과
- 재작성 필요 장: 0
- 즉시 보강 필요 장: 0
- 공개 가능 여부: 가능

## 이번 refresh에서 다시 잠근 점

- `UsaTm/content:prepare` local full pipeline 재실행 후 `QA 0 errors / 0 warnings` 확인
- generated 산출물 재생성 후 14개 챕터 / 검색 엔트리 171개 재확인
- foreign-domiciled applicant attorney requirement, Trademark Center, registration maintenance, CBP e-Recordation, TTAB 권한 범위를 source register 기준으로 다시 점검
- 본문에서 변동성이 큰 fee/세부 기한은 여전히 fact log 우선 원칙을 유지하는지 확인

## 정확도 판정 메모

- 본문은 고위험 수치보다 운영 구조와 판단 기준 중심으로 유지되어 있어, 변동성이 큰 사실을 과도하게 하드코딩하지 않는다.
- `foreign-domiciled applicant`의 U.S.-licensed attorney requirement, 유지관리 구조, TTAB의 권한 한계 같은 핵심 운영 사실은 source register와 fact log 기준으로 다시 확인 가능한 상태다.
- `Assignment Center`, `Letter of Protest`, 일부 fee/기한 세부는 여전히 공식 페이지 최신 화면 재확인 대상이지만, 현재 본문은 이 값을 독자 행동을 좌우하는 확정 수치로 밀어 넣지 않는다.

## 충실도 판정 메모

- `owner / user / specimen / maintenance / enforcement` 흐름이 한 문서 안에서 연결돼 있어 운영형 가이드로 읽힌다.
- 독자가 “지금 filing을 밀어도 되는가”, “누가 owner이고 누가 user인가”, “등록 후 specimen과 유지관리를 감당할 수 있는가”를 같은 문맥에서 판단할 수 있다.
- 보강이 더 필요하다면 대형 재작성보다 checklist, FAQ, handoff 문장 같은 실행형 보완이 우선이다.

## 공개 전 재확인 항목

- USPTO fee page의 최신 수수료 금액
- Assignment Center 실제 제출 경로와 현재 명칭
- Letter of Protest 제출 화면과 제한 증거 규칙
- Statement of Use, Official Gazette 관련 세부 기한 문구

## 현재 운영 결론

`UsaTm`은 더 이상 grandfathered beta를 억지로 유지하는 상태는 아니다. local full pipeline과 최신 verification log 기준으로 refresh는 완료됐고, 이후에는 freshness를 유지하면서 standard QA 근거를 반복 재현하는 쪽이 맞다. 대형 확장보다 reader utility와 운영 문구 정교화가 다음 우선순위다.
