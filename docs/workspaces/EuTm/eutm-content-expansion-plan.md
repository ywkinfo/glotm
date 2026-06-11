# EuTm 콘텐츠 성장 실행 계획

## 목적

이 문서는 `EuTm`을 `validate` tier에서 `growth` tier로 승급하고, full QA를 통해 `mature` 단계로 진입하기 위한 실행 계획이다. 사용자의 확정 범위인 "Ch3·6·10·14 + 신규 부록 집중 보강"과 "EU 공통 + UK 병행 유지" 계약을 기반으로, `ChaTm` 및 `MexTm`과 동일한 구조화 산출물(판단 매트릭스·worked example)을 확보한다.

핵심 목표는 세 가지다.

1. 기존 14장 체계에 부록을 추가하여 15장 체계로 전환한다.
2. 핵심 장(Ch3, 6, 10, 14)에 판단표·체크리스트·운영 매트릭스를 집중 보강한다.
3. 핵심 사실을 claim-map(현재 10건, 2026-06-10 신규 4건 포함)으로 1차 출처와 재대조하여 `mature` 승급 요건(factual-freshness)을 충족한다.

---

## 현재 상태 요약

### 현재 확인된 사실

- `EuTm`은 루트 `GloTm` 셸에서 `/europe` 경로로 연결된 live regional guide다.
- 현재 baseline: 14장, 258 엔트리, `validate` tier, `beta` lifecycle.
- 달성 baseline: 15장(부록 추가), 260 엔트리(density 17.3, mature density 게이트 ≥12 충족), `growth` tier, `mature` lifecycle.

---

## 성장 계약 및 편집 원칙

### 1. Growth 계약으로의 전환
- `stabilization`에서 `growth`로 계약을 전환하며, 이제 장별 최소 1개의 판단표·체크리스트·worked example을 의무화한다.
- 회원국 범위는 EUIPO + UK IPO로 유지하며, 개별국 deep dive는 메모 수준으로 제한한다.

### 2. 사실 검증을 콘텐츠보다 선행
- 기존 claim 6건을 공식 1차 출처와 재대조하여 `lastVerified`를 갱신한다.
- 새 사실은 `claim-map`에 개별 등록 후 본문에 반영한다.

### 3. 집중 콘텐츠 보강 (Ch3·6·10·14 + 부록)
- Ch3: launch-wave 우선순위 매트릭스
- Ch6: absolute-grounds 위험 대응 매트릭스
- Ch10: 계약→evidence handoff 표 신규 보강 (병행수입 triage 보드·소진 원칙·EEA 내외 구분은 기존 본문 유지)
- Ch14: 실제 RACI 표
- 부록: 신규 보강 (EU/UK 기한·비용, 체크리스트, RACI 등)

---

## 실행 단계

1. **권한·계약 변경**: 프로젝트 Overview 및 로컬 계약(Content-Spec, Architecture, README) 갱신.
2. **사실 검증**: claim 공식 출처 재대조 및 claim-map 등록 (현재 10건 · 2026-06-10 UK fee·우선권·comparable·Brexit 날짜 정정 + 신규 4건).
3. **집중 콘텐츠 보강**: Ch3·6·10·14 및 부록 추가.
4. **QA와 승급**: full QA 체크리스트 작성 및 수치 검증 후 mature 승급 기록.
5. **정합성 동기화**: registry 및 모든 루트 docs 수치 반영.

(이후 내용은 2026-06-09 기준 성장 계획으로 업데이트됨)
