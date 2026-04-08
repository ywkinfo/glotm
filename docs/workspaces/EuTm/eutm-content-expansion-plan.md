# EuTm 콘텐츠 보강 실행 계획서

## 목적

이 문서는 `EuTm`의 현재 shipped baseline을 기준으로, 루트 `GloTm` 셸에서 더 깊고 안정적으로 읽히는 권역형 실무 가이드로 고도화하기 위한 실행 계획서다. 기반 제작 체계는 이미 갖춰져 있으며, 이제 남은 핵심은 장별 실무 밀도, fact verification, 문서 정합성을 끌어올리는 일이다.

핵심 목표는 세 가지다.

1. 이미 도입된 장별 원천 원고 + 조립 파이프라인 체계를 안정된 baseline으로 유지한다.
2. EU 공통 실무 프레임을 중심으로 본문을 심화하되, 회원국별 편차는 통제된 범위에서만 반영한다.
3. 리서치 검증 로그를 통과한 사실만 본문으로 승격해, 이후 런타임 확장과 파일럿 배포에 견딜 수 있는 정본을 만든다.

---

## 현재 상태 요약

### 현재 확인된 사실

- `EuTm`은 루트 `GloTm` 셸에서 `/europe` 경로로 연결된 live regional guide다.
- 현재 공개본 기준은 `EuTm/content/source/master.md`다.
- 현재 워크스페이스 파이프라인은 `scripts/build-master.ts -> scripts/qa-content.ts -> scripts/build-content.ts` 순으로 동작한다.
- `content/source/manifest.json`, `content/source/chapters/`, `scripts/build-master.ts`, `scripts/qa-content.ts`가 모두 존재한다.
- 현재 생성 산출물:
  - 14 chapters
  - 258 search entries
- 현재 `master.md`는 장별 원고를 조립한 공개본 기준이며, reader에서 읽을 수 있는 실사용 분량을 확보한 상태다.

### LatTm 대비 차이

| 항목 | LatTm | EuTm |
|------|------|------|
| 정본 구조 | 장별 원천 원고 + 조립본 | 장별 원천 원고 + 조립본 |
| 메타 구조 | `manifest.json` 있음 | `manifest.json` 있음 |
| 조립 스크립트 | `build-master.ts` 있음 | `build-master.ts` 있음 |
| QA 스크립트 | `qa-content.ts` 있음 | `qa-content.ts` 있음 |
| 챕터 수 | 20 | 14 |
| 검색 엔트리 | 781 | 258 |
| 문서 깊이 | publish-grade | live regional guide baseline, 추가 심화 필요 |

### 현재 리스크

1. 기반 파이프라인은 갖춰졌지만 `LatTm` 대비 장별 밀도와 실무 사례 깊이가 아직 낮다.
2. 리서치 검증 로그의 핵심 항목은 이미 본문 반영 가능한 수준까지 정리됐지만, EU 공통 프레임과 UK 병행 판단을 controlled scope로 유지한다는 설명을 문서와 reader copy에서 계속 일치시켜야 한다.
3. 루트 전략 문서와 개별 워크스페이스 문서가 같은 속도로 갱신되지 않으면 shipped 상태 설명이 다시 어긋날 수 있다.
4. 검색 엔트리는 baseline을 넘었지만, 핵심 장의 섹션 탐색 밀도는 더 높일 여지가 있다.

---

## 편집 원칙

### 1. LatTm처럼 "쓴다"보다 LatTm처럼 "만든다"

`EuTm` 보강의 출발점은 이미 도입된 제작 체계를 유지한 채 분량과 판단 밀도를 높이는 것이다. 장별 원천 원고, manifest, 조립 스크립트, QA 스크립트는 이제 baseline으로 취급한다.

### 2. EU 공통 프레임이 본문, 회원국 편차는 통제

`EuTm`은 독일·프랑스·이탈리아·스페인·영국 세부 실무를 모두 본문에서 깊게 푸는 문서가 아니다. 본문은 EU 공통 프레임 + UK 병행 판단 + 주요 회원국 편차 메모 중심으로 유지한다.

### 3. 변동성이 큰 사실은 검증 로그 우선

다음 항목은 본문에 직접 확정하지 않고 `content/research/eu_tm_fact_verification_log.md` 검증 후 승격한다.

- 공식 기한
- 수수료
- 절차명
- 폼 이름
- 냉각기간, grace period, proof of use 세부 규칙
- 회원국별 편차의 단정적 서술

### 4. 장별 공통 구조를 통일

각 장은 가능하면 다음 구조를 따른다.

1. 장 도입부
2. 판단 기준 또는 제도 구조
3. 실무 체크리스트 또는 표
4. 리스크/예외
5. 운영 메모 또는 후속 액션

### 5. 현재 스프린트 방향을 고정

이번 스프린트에서는 새 구조를 다시 만드는 것보다, 이미 있는 14장 구조를 기준으로 핵심 6장 심화와 검증 로그 승격에 집중한다. 즉, `status` 승격이나 대규모 범위 재설정보다, `/europe` reader 품질과 문서 정합성을 안정적으로 끌어올리는 쪽이 우선이다.

---

## 목표 산출물

### 현재 baseline (완료)

- `content/source/manifest.json` 운영 중
- `content/source/chapters/*.md` 체계 운영 중
- `content/source/master.md`를 조립 결과물로 관리 중
- `scripts/build-master.ts`, `scripts/qa-content.ts` 운영 중
- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`는 현재 워크스페이스 기준 상태를 반영한다
- 런타임 포지션은 `validate tier · beta lifecycle`이며, 범위는 EU 공통 프레임 + UK 병행 판단까지의 controlled scope로 유지한다

### v1 콘텐츠 목표

- 14장 구조 유지
- 핵심 장의 본문 밀도 대폭 확대
- 장별 최소 실행형 체크리스트 1개 이상 포함
- search entries를 현재 258 baseline으로 유지하면서 후속 심화 시 270~320 수준까지 확대

### v1 품질 목표

- `npm run content:europe` 또는 동등한 루트 빌드 흐름 통과
- 제목/장 순서/헤딩 구조 자동 QA 통과
- `master.md`와 장별 원고의 불일치 제거
- 루트 `GloTm` 셸에서 `/europe` 홈/챕터/검색 흐름 유지

---

## 권장 챕터 구조

현재 14장 구성은 유지하되, 다음처럼 역할을 명확히 한다.

1. 유럽 상표 시스템 지도
   - EUTM / national / UK / Madrid 연결의 큰 지도
2. 권리 선택: EUTM, 개별국, 영국 병행
   - 선택 기준과 분기 표
3. 포트폴리오 설계와 우선순위
   - house mark / product mark / defensive mark 구조
4. 사전 검색과 충돌 분석
   - TMview / EUIPO / 국가청 / 시장 사용 구조
5. 출원 경로와 서류 설계
   - owner, language, goods/services, filing route 정리
6. 심사와 절대적 거절 대응
   - 식별력, descriptive risk, refusal 대응 프레임
7. 이의신청과 공존 전략
   - opposition, coexistence, cooling-off 등 운영 판단
8. 등록 후 사용, 갱신, 증거 관리
   - renewal, use evidence, evidence vault
9. 취소, 무효, 불사용 리스크
   - cancellation / invalidity / proof of use 방어 구조
10. 라이선스, 유통, 병행수입
    - exhaustion, distribution, QC 메모
11. 온라인 플랫폼, 도메인, 디지털 집행
    - platform takedown, domain, online seller triage
12. 세관과 국경조치
    - customs recordal, product ID pack, border ops
13. 회원국 분쟁과 포럼 선택
    - 행정/민사/국가별 포럼 분기
14. 운영 거버넌스와 RACI
    - 본사/현지/외부대리인 책임 구조

---

## 작업 단계

## Phase 0 — 기준선 정리

### 목표
문서 상태와 실제 런타임 상태를 먼저 맞춘다.

### 작업
- `EuTm/README.md` 수정
- `EuTm/Harness/Architecture.md` 수정
- `EuTm/Harness/Content-Spec.md` 수정
- 현재 `live guide` 상태와 공개본 기준을 일관되게 정리
- 현재 기준 수치를 `14장 / 검색 엔트리 258`으로 갱신한다.

### 완료 기준
- 문서 간 상태 충돌이 없음
- `master.md`가 현재 공개본이라는 사실과 shipped baseline이 명시됨

---

## Phase 1 — LatTm-lite 파이프라인 유지

### 목표
콘텐츠를 안전하게 확장할 수 있는 현재 제작 기반을 유지한다.

### 작업
- `content/source/manifest.json`, `content/source/chapters/`, `scripts/build-master.ts`, `scripts/qa-content.ts`를 baseline으로 계속 유지
- 루트 `package.json`과 워크스페이스 로컬 문서가 현재 실행 순서를 정확히 설명하는지 점검
- 구조 확장 전 `master.md` 재생성, QA, generated JSON 생성 흐름이 계속 깨지지 않도록 유지

### LatTm에서 참고할 것
- `LatTm/scripts/build-master.ts`
- `LatTm/scripts/qa-content.ts`
- `LatTm/content/source/manifest.json`

### 완료 기준
- 장별 원고를 조립해 `master.md`를 계속 재생성할 수 있음
- 제목/순서 불일치, 미닫힌 코드펜스, 기본 표 형식 오류를 자동 탐지할 수 있음

---

## Phase 2 — 핵심 6장 우선 심화와 fact verification 승격

### 목표
reader 품질을 가장 크게 끌어올리는 장부터 보강한다.

### 우선 대상
1. 제1장 시스템 지도
2. 제2장 권리 선택
3. 제4장 검색과 충돌 분석
4. 제5장 출원 경로와 서류 설계
5. 제7장 이의신청과 공존 전략
6. 제8장 등록 후 사용, 갱신, 증거 관리

### 작업
- 핵심 6장 중 controlled Eu/UK scope를 깨지 않는 장부터 우선 보강한다.
- `eu_tm_fact_verification_log.md`의 Verified 항목을 해당 장의 판단표와 운영 메모에 승격한다.
- `eu_tm_source_register.md`를 실제 참조 목록으로 유지한다.

### 각 장의 최소 기준
- H3 기준 최소 6개 이상
- 실행형 표 또는 체크리스트 최소 1개
- 도입부가 단순 개요가 아니라 판단 프레임 역할 수행
- "추가 리서치 게이트"는 작업용 메모에서 제거하고, 필요한 검증 항목은 research 문서로 이동

### 완료 기준
- 검색 엔트리 수의 가시적 증가
- `/europe` 검색 결과가 장 제목 나열이 아니라 실질 섹션 탐색 수준으로 개선

---

## Phase 3 — 워크스페이스 게이트

### 목표
`EuTm` 단독 lane이 root gate를 반복하지 않고도 merge-ready 상태에 도달하게 만든다.

### 작업
- `npm run content:europe`
- 장 제목, 헤딩 구조, 표 형식, 검색 엔트리 증가 폭 확인
- `/europe` 홈, 챕터, 검색, continue reading 흐름 스모크

### 완료 기준
- `content:europe`가 통과한다.
- docs sync, controlled scope, 핵심 장 심화가 같은 기준선으로 설명된다.

---

## Phase 4 — 후반 운영 장 보강

### 목표
핵심 6장 이후 운영/분쟁/거버넌스 장을 보강해 문서의 후반부 완성도를 맞춘다.

### 대상
- 제3장 포트폴리오 설계
- 제6장 절대적 거절
- 제9장 취소/무효/불사용
- 제10장 라이선스/유통/병행수입
- 제11장 플랫폼/도메인
- 제12장 세관/국경조치
- 제13장 포럼 선택
- 제14장 RACI

### 완료 기준
- 장별 밀도 편차 완화
- 문체와 구조 일관성 확보

---

## Phase 5 — 통합 머지와 shared root gate

### 목표
`EuTm` lane 결과를 세 가이드 통합 검증 체계에 올린다.

### 작업
- 글로벌 스프린트 머지 순서에서 `EuTm`을 세 번째로 병합한다.
- `EuTm` lane은 개별 root gate를 반복하지 않고, shared verification lane에 workspace gate 결과만 넘긴다.
- 리더가 통합 후 `npm run test:content`, `npm run health:runtime`, `npm run health:release`를 1회 실행한다.

### 완료 기준
- `EuTm`의 lane 산출물이 merge-ready 상태로 통합된다.
- shared root gate가 1회 통과한다.

---

## 리서치 범위 원칙

### 본문에 직접 넣을 것
- EU 공통 제도 프레임
- EUTM와 national filing의 운영상 차이
- UK 병행 판단의 큰 기준
- 검색/출원/이의/사용/갱신/플랫폼/세관의 운영 흐름

### 부록 또는 후속 트랙으로 뺄 것
- 회원국별 세부 소송 실무
- 국가별 fee 표
- 국가별 서류 형식의 상세 예외
- 국가별 법원 절차 디테일
- UK 심화 실무 전부

### 문체 원칙
- 권역형 guide답게 분기 기준과 운영 프레임을 우선 설명
- 회원국 편차는 본문을 깨지 않는 범위의 표/메모/주의문으로 제한
- 제도 설명보다 실무 판단 질문을 먼저 제시

---

## 권장 일정

### Sprint 1
- Phase 0 완료
- Phase 1 유지
- 문서 정합화와 baseline 유지

### Sprint 2
- Phase 2 완료
- 핵심 6장 심화와 fact verification 승격

### Sprint 3
- Phase 3 진행
- workspace gate 통과

### Sprint 4
- Phase 4 진행
- 후반 운영 장 보강

### Sprint 5
- Phase 5 진행
- 통합 머지와 shared root gate

---

## 수용 기준

다음 조건을 만족하면 `EuTm v1 content expansion`의 1차 완료로 본다.

1. `manifest.json`, `build-master.ts`, `qa-content.ts`가 존재한다.
2. `master.md`가 조립 결과물로 관리된다.
3. 14개 장이 모두 장별 원고 파일로 이미 분리된 상태를 유지한다.
4. 핵심 6장이 초안 수준을 벗어나 실무형 본문 구조를 갖는다.
5. search entries가 baseline 258을 유지하면서 추가 심화 시 더 증가한다.

---

## 2026-04-03 진행 메모

- 핵심 6장(`제1장`, `제2장`, `제4장`, `제5장`, `제7장`, `제8장`)에 controlled scope decision board, rights calendar lock, search-to-opposition handoff, route pack lock, opposition/coexistence war-room, evidence-to-enforcement reuse memo를 추가했다.
- `npm run content:europe` 기준 생성 산출물은 14개 챕터 / 검색 엔트리 258개다.
- `/europe` 스프린트 addendum 수동 smoke를 마감했고, 남은 작업은 shared root gate 입력 정리다.

## 2026-04-04 안정화 메모

- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`, `content/research/eu_tm_fact_verification_log.md`의 상태 설명을 현재 baseline에 맞게 다시 잠근다.
- 이번 라운드의 초점은 핵심 6장을 더 넓히는 것이 아니라, `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope` 설명을 문서와 fact log에서 일치시키는 데 있다.
- shared root gate 이전에는 `content:europe`와 local workspace baseline 재현을 우선 증빙으로 사용한다.

추가 완료 기준:

- `content:europe`가 통과하고, 통합 이후 shared root gate 1회가 통과한다.
- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`, research docs의 상태 설명이 일치한다.

---

## 비범위

이번 계획의 1차 범위에는 아래를 넣지 않는다.

- EuTm 독립 SPA 런타임 신설
- prerender/SEO 별도 구현
- 국가별 deep-dive 별도 제품 동시 제작
- UK 단일국가 가이드 신규 분리 착수
- 신규 검색/리더 기능 개발

---

## 최종 제안

`EuTm` 보강은 지금도 계속할 가치가 있다. 다만 첫 단계는 더 이상 제작 체계 도입이 아니라, 이미 도입된 LatTm-lite baseline을 유지한 채 핵심 장을 심화하는 것이다. 그 위에서 fact verification을 통과한 내용을 단계적으로 승격하는 방식이 가장 안전하다.

즉, 실행 순서는 아래와 같다.

1. 상태 문서 정합화
2. baseline 파이프라인 유지
3. 핵심 6장 심화와 fact verification 승격
4. workspace gate
5. 후반 장 보강과 통합 shared root gate

글로벌 병렬 스프린트에서는 `EuTm`을 dedicated single lane으로 운영하고, worker는 `EuTm` 디렉터리와 `eu_tm_fact_verification_log.md` 중심으로만 수정한다. 루트 메타데이터와 최종 Gateway/health sync는 리더가 마지막에 처리한다.

이 순서를 지키면 `EuTm`은 현재의 live regional guide baseline에서, 루트 `GloTm` 셸에서 LatTm 다음 수준으로 더 깊게 읽히는 권역형 실무 가이드로 성장할 수 있다.
