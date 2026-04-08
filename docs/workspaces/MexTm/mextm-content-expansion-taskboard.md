# MexTm 콘텐츠 보강 작업 분배표

## 공통 원칙

- generated JSON은 직접 수정하지 않는다.
- 모든 공개본 수정은 `MexTm/content/source/chapters/`, `MexTm/content/source/appendix/`, `MexTm/content/source/manifest.json`에서 시작한다.
- 기한, 수수료, 시스템명, 절차명은 `mx_tm_fact_verification_log.md` 확인 전 본문 단정 서술 금지
- 각 우선 장에는 최소 1개의 체크리스트, decision memo, 비교표, 사례 회수 표를 포함한다.

## 현재 스프린트 잠금

- Sprint 2 우선 장은 `제5장`, `제7장`, `제10장`으로 고정한다.
- verification 레인은 `Body-ready` 항목의 본문 승격을 우선하며, 신규 `Pending` 항목을 불필요하게 늘리지 않는다.
- generated 산출물 수정 금지, source chapters와 verification log에서만 작업 시작

## 리더

- 우선 장 범위 고정
- 장별 완료 기준 통제
- 머지 순서와 검증 순서 관리
- buyer entry 관점에서 어떤 섹션이 먼저 읽혀야 하는지 정렬

## 원고 레인 A

대상:

- 제5장. 출원서 작성 실무: 제출서류·권한·전자출원(PASE)
- 제7장. 등록 후 의무: 사용 선언·갱신·권리 유지 캘린더

완료 기준:

- filing owner, signing authority, PASE/`Marca en Línea` handoff가 표로 빠르게 보임
- declaration of use, renewal, evidence owner가 하나의 유지관리 triage로 읽힘
- buyer가 바로 다음 액션을 정할 수 있는 체크리스트, handoff memo, escalation 표 포함

## 원고 레인 B

대상:

- 제10장. 관세·세관(국경) 조치와 물류 통제

완료 기준:

- IMPI `declaraciones administrativas`·`medidas provisionales`와 ANAM `pedimento/annex` 흐름이 하나의 control board로 읽힘
- 적발 직후 first-48-hours escalation memo와 border evidence pack이 같이 보임
- importer/distributor/license 구조와 집행 구조의 연결이 명확히 드러남

## 사실 검증 레인

이번 스프린트의 우선 검증·승격 항목:

- `MX-FEE-001`
- `MX-DL-001`
- `MX-NORM-001`
- `MX-ENF-001`

완료 기준:

- 각 항목에 마지막 확인일, 1차 출처, 본문 반영 장이 명시됨
- 본문 승격 가능/보류 여부가 분명함
- Sprint 2 handoff에서 `Ch5`, `Ch7`, `Ch10` 연결 메모가 별도로 정리됨

## QA / 배포 준비 레인

병렬 준비:

- 장 제목과 `manifest.json` 일치 여부 점검
- 헤딩 구조와 표 형식 점검
- `/mexico` 리더 QA 시나리오 정리
- release-readiness 체크리스트 초안 작성

순차 검증:

1. `npm --prefix MexTm run content:prepare`
2. `npm run content:mexico`
3. `npm run test:content`
4. shared root gate 입력 메모 정리

완료 기준:

- 콘텐츠 조립 실패 없음
- MexTm local pipeline 통과 및 shared root gate 입력 정리 완료
- `/mexico` 홈/챕터/검색/continue reading 스모크 기준 충족
