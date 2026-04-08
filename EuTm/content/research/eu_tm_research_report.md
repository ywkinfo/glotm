# EuTm Research Report

## 목적

이 문서는 현재 shipped `EuTm` baseline의 리서치 범위와 핵심 질문을 정리하는 stabilization working note다.
이번 라운드의 목적은 새 범위를 넓히는 것이 아니라, `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope` 설명을 같은 기준선으로 유지하는 데 있다.

## 현재 범위 가정

- 기본 축: EU 공통 상표 운영 프레임
- 병행 검토: UK 병행 판단, 마드리드 연계, 주요 회원국 편차 메모
- 제외: 회원국별 deep dive, 국가별 fee 표, 특허·디자인·저작권 심화 본문

## 우선 검증 질문

1. EUTM와 개별국 출원의 의사결정 기준을 어떻게 구조화할 것인가
2. 이의, 취소, 무효, 불사용 리스크를 어느 수준까지 본문에 넣을 것인가
3. 회원국별 편차는 본문에 직접 풀지, 부록 또는 별도 국가 노트로 뺄 것인가
4. 영국은 `EuTm` 안의 병행 장으로 둘지, 후속 단일국가 트랙으로 분리할지
5. 세관, 온라인 플랫폼, 도메인 분쟁을 어느 깊이까지 포함할지

## 리서치 스트림

### Stream A. 권리 구조

- EUTM
- 개별국 출원
- 마드리드 경유
- 영국 별도 대응

### Stream B. 출원 이후 운영

- 사용 증거
- 갱신
- 권리자 변경
- 라이선스와 유통 구조

### Stream C. 분쟁과 집행

- 이의
- 취소와 무효
- 온라인 플랫폼 신고
- 세관 및 국경조치

## 편집 원칙

- 변동성이 큰 사실은 본문보다 `eu_tm_fact_verification_log.md`에 먼저 적는다.
- 구체 수치나 기간은 공식 1차 출처를 확인하기 전에는 확정 문장으로 쓰지 않는다.
- 회원국별 예외는 범용 본문을 흐릴 경우 메모 수준으로 제한하고, 필요하면 후속 국가 트랙으로 분리한다.
- 문서 상태 문구는 `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope` 기준선과 어긋나지 않게 유지한다.
- local lane 증빙은 `npm run content:prepare`를 우선 사용하고, 루트 동등 경로가 필요할 때만 `npm run content:europe`를 다시 재현한다. shared root gate는 리더 통합 단계에서 1회만 실행한다.
