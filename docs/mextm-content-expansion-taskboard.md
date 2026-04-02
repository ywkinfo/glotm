# MexTm 콘텐츠 보강 작업 분배표

## 공통 원칙

- generated JSON은 직접 수정하지 않는다.
- 모든 공개본 수정은 `MexTm/content/source/chapters/`, `MexTm/content/source/appendix/`, `MexTm/content/source/manifest.json`에서 시작한다.
- 기한, 수수료, 시스템명, 절차명은 `mx_tm_fact_verification_log.md` 확인 전 본문 단정 서술 금지
- 각 우선 장에는 최소 1개의 체크리스트, decision memo, 비교표, 사례 회수 표를 포함한다.

## 현재 스프린트 잠금

- Sprint 1 우선 장은 `제1장`, `제4장`, `제11장`, `제13장`으로 고정한다.
- verification 레인은 `Body-ready` 항목의 본문 승격을 우선하며, 신규 `Pending` 항목을 불필요하게 늘리지 않는다.
- generated 산출물 수정 금지, source chapters와 verification log에서만 작업 시작

## 리더

- 우선 장 범위 고정
- 장별 완료 기준 통제
- 머지 순서와 검증 순서 관리
- buyer entry 관점에서 어떤 섹션이 먼저 읽혀야 하는지 정렬

## 원고 레인 A

대상:

- 제1장. 멕시코 상표 제도 개요와 IMPI 운영 구조
- 제4장. 출원 경로 선택: 직접출원 vs 마드리드

완료 기준:

- 멕시코 운영 구조와 기한/모니터링 흐름이 decision map으로 보임
- 출원 경로 선택이 `직접출원 vs 마드리드` 표로 빠르게 비교 가능
- buyer가 바로 다음 액션을 정할 수 있는 체크리스트 또는 escalation 표 포함

## 원고 레인 B

대상:

- 제11장. 도메인(.MX)·디자인·저작권(인다우토르)과의 결합 전략
- 제13장. 실무 사례·판례 요약

완료 기준:

- 상표, 도메인, 디자인, 저작권이 하나의 통제 포트폴리오로 읽힘
- 사례 장이 단순 판례 요약이 아니라 실패 패턴과 예방 기준을 회수함
- 온라인 자산, 계약, 사용증빙이 어떻게 연결되는지 명확히 드러남

## 사실 검증 레인

이번 스프린트의 우선 검증·승격 항목:

- `MX-FEE-001`
- `MX-DL-001`
- `MX-NORM-001`
- `MX-ENF-001`

완료 기준:

- 각 항목에 마지막 확인일, 1차 출처, 본문 반영 장이 명시됨
- 본문 승격 가능/보류 여부가 분명함

## QA / 배포 준비 레인

병렬 준비:

- 장 제목과 `manifest.json` 일치 여부 점검
- 헤딩 구조와 표 형식 점검
- `/mexico` 리더 QA 시나리오 정리
- release-readiness 체크리스트 초안 작성

순차 검증:

1. `npm run content:mexico`
2. `npm test`
3. `npm run build`
4. `npm run build:pages:glotm`

완료 기준:

- 콘텐츠 조립 실패 없음
- 루트 검증 명령 통과
- `/mexico` 홈/챕터/검색/continue reading 스모크 기준 충족
