# EuTm 콘텐츠 보강 실행 계획서

## 목적

이 문서는 `EuTm`을 현재의 구조 초안(v0) 상태에서, 루트 `GloTm` 셸에서 안정적으로 읽히는 권역형 실무 가이드(v1)로 끌어올리기 위한 실행 계획서다. 기준 제품은 `LatTm`이지만, `EuTm`은 유럽 권역형 가이드라는 특성상 **LatTm의 내용량을 그대로 복제하는 것보다 LatTm의 제작 체계와 편집 기준을 이식하는 것**을 우선 원칙으로 삼는다.

핵심 목표는 세 가지다.

1. `EuTm`의 현재 `master.md` 중심 초안 구조를 장별 원천 원고 + 조립 파이프라인 구조로 전환한다.
2. EU 공통 실무 프레임을 중심으로 본문을 심화하되, 회원국별 편차는 통제된 범위에서만 반영한다.
3. 리서치 검증 로그를 통과한 사실만 본문으로 승격해, 이후 런타임 확장과 파일럿 배포에 견딜 수 있는 정본을 만든다.

## Immediate Execution Queue

- `EuTm`의 현행 파이프라인은 이미 `build-master -> qa-content -> build-content`로 맞춰져 있으므로, 다음 작업은 문서 구조화가 아니라 본문 밀도 확대다.
- 우선순위는 `제2장`, `제4장`, `제7장`, `제8장`, `제11장`, `제13장`처럼 운영 판단과 분기표 가치가 큰 장부터 잡는다.
- 각 장에는 최소 1개의 체크리스트 또는 비교표를 유지하고, 변동성이 큰 사실은 `content/research/eu_tm_fact_verification_log.md`에서 검증 후 본문으로 승격한다.

---

## 현재 상태 요약

### 현재 확인된 사실

- `EuTm`은 루트 `GloTm` 셸에서 `/europe` 경로로 연결된 live regional guide다.
- 현재 공개본 기준은 `EuTm/content/source/master.md`다.
- 현재 파이프라인은 `scripts/build-content.ts` 단일 단계다.
- 현재 **미구축 항목**:
  - `content/source/manifest.json`
  - `scripts/build-master.ts`
  - `scripts/qa-content.ts`
- 현재 생성 산출물:
  - **14 chapters**
  - **56 search entries**
- 현재 `master.md` 분량은 약 **1.2k words** 수준으로, 실무 가이드라기보다 장 구조를 고정하기 위한 초안에 가깝다.

### LatTm 대비 차이

| 항목 | LatTm | EuTm |
|------|------|------|
| 정본 구조 | 장별 원천 원고 + 조립본 | 단일 `master.md` 초안 |
| 메타 구조 | `manifest.json` 있음 | 없음 |
| 조립 스크립트 | `build-master.ts` 있음 | 없음 |
| QA 스크립트 | `qa-content.ts` 있음 | 없음 |
| 챕터 수 | 20 | 14 |
| 검색 엔트리 | 780 | 56 |
| 문서 깊이 | publish-grade | outline-grade |

### 현재 리스크

1. `README.md`와 `Harness/Architecture.md`의 상태 설명이 일부 충돌한다.
   - README는 live guide 상태를 반영하지만,
   - Architecture는 아직 루트 셸에 연결하지 않는다고 적혀 있다.
2. `EuTm` 본문은 대부분 장당 짧은 도입 + 3개 섹션 + 리서치 게이트 수준이라 reader 품질이 낮다.
3. 리서치 검증 로그의 핵심 항목이 대부분 `Pending` 상태다.
4. 지금 상태에서 본문만 늘리면 `master.md` 단일 파일이 빠르게 유지보수 불가능해질 수 있다.

---

## 편집 원칙

### 1. LatTm처럼 "쓴다"보다 LatTm처럼 "만든다"

`EuTm` 보강의 첫 단계는 분량 확대가 아니라 **제작 체계 전환**이다. 장별 원천 원고, manifest, 조립 스크립트, QA 스크립트를 먼저 도입해야 이후 보강이 반복 가능하다.

### 2. EU 공통 프레임이 본문, 회원국 편차는 통제

`EuTm`은 독일·프랑스·이탈리아·스페인·영국 세부 실무를 모두 본문에서 깊게 푸는 문서가 아니다. 본문은 **EU 공통 프레임 + UK 병행 판단 + 주요 회원국 편차 메모** 중심으로 유지한다.

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

---

## 목표 산출물

### v1 구조 목표

- `content/source/manifest.json` 신설
- `content/source/chapters/*.md` 체계 도입
- `content/source/master.md`를 조립 결과물로 전환
- `scripts/build-master.ts` 도입
- `scripts/qa-content.ts` 도입
- `README.md`, `Harness/Architecture.md`, `Harness/Content-Spec.md` 상태 설명 정합화

### v1 콘텐츠 목표

- 14장 구조 유지
- 핵심 장의 본문 밀도 대폭 확대
- 장별 최소 실행형 체크리스트 1개 이상 포함
- search entries를 현재 56에서 **1차 목표 180~250** 수준으로 확대

### v1 품질 목표

- `npm run content:europe` 또는 동등한 루트 빌드 흐름 통과
- 제목/장 순서/헤딩 구조 자동 QA 통과
- `master.md`와 장별 원고의 불일치 제거
- 루트 `GloTm` 셸에서 `/europe` 홈/챕터/검색 흐름 유지

---

## 권장 챕터 구조

현재 14장 구성은 유지하되, 다음처럼 역할을 명확히 한다.

1. **유럽 상표 시스템 지도**
   - EUTM / national / UK / Madrid 연결의 큰 지도
2. **권리 선택: EUTM, 개별국, 영국 병행**
   - 선택 기준과 분기 표
3. **포트폴리오 설계와 우선순위**
   - house mark / product mark / defensive mark 구조
4. **사전 검색과 충돌 분석**
   - TMview / EUIPO / 국가청 / 시장 사용 구조
5. **출원 경로와 서류 설계**
   - owner, language, goods/services, filing route 정리
6. **심사와 절대적 거절 대응**
   - 식별력, descriptive risk, refusal 대응 프레임
7. **이의신청과 공존 전략**
   - opposition, coexistence, cooling-off 등 운영 판단
8. **등록 후 사용, 갱신, 증거 관리**
   - renewal, use evidence, evidence vault
9. **취소, 무효, 불사용 리스크**
   - cancellation / invalidity / proof of use 방어 구조
10. **라이선스, 유통, 병행수입**
   - exhaustion, distribution, QC 메모
11. **온라인 플랫폼, 도메인, 디지털 집행**
   - platform takedown, domain, online seller triage
12. **세관과 국경조치**
   - customs recordal, product ID pack, border ops
13. **회원국 분쟁과 포럼 선택**
   - 행정/민사/국가별 포럼 분기
14. **운영 거버넌스와 RACI**
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
- 현재 `live guide` 상태, 공개본 기준, 미구축 항목을 일관되게 정리

### 완료 기준
- 문서 간 상태 충돌이 없음
- `master.md`가 현재 공개본이라는 사실과 향후 조립 전환 계획이 명시됨

---

## Phase 1 — LatTm-lite 파이프라인 도입

### 목표
콘텐츠를 안전하게 확장할 수 있는 제작 기반을 만든다.

### 작업
- `content/source/manifest.json` 생성
- `content/source/chapters/` 디렉터리 실사용 시작
- `scripts/build-master.ts` 추가
- `scripts/qa-content.ts` 추가
- 루트 `package.json`의 `content:europe` 흐름은 유지하되 내부적으로 `build-master -> qa-content -> build-content` 순서를 탈 수 있게 준비

### LatTm에서 참고할 것
- `LatTm/scripts/build-master.ts`
- `LatTm/scripts/qa-content.ts`
- `LatTm/content/source/manifest.json`

### 완료 기준
- 장별 원고를 조립해 `master.md` 재생성 가능
- 제목/순서 불일치, 미닫힌 코드펜스, 기본 표 형식 오류를 자동 탐지 가능

---

## Phase 2 — master.md를 장별 원고로 분해

### 목표
단일 초안을 장별 유지보수 가능한 원천 원고 체계로 전환한다.

### 작업
- 현재 `master.md`의 14장을 `chapters/*.md`로 분리
- 각 장의 H1 제목을 manifest title과 일치시킴
- `master.md`는 수동 편집보다 조립 결과물로 관리

### 권장 파일 예시
- `01_system-map.md`
- `02_right-selection.md`
- `03_portfolio-priority.md`
- `04_clearance-risk.md`
- `05_filing-route.md`
- `06_absolute-grounds.md`
- `07_opposition-coexistence.md`
- `08_post-registration-evidence.md`
- `09_cancellation-invalidity.md`
- `10_licensing-distribution-exhaustion.md`
- `11_platform-domain-digital-enforcement.md`
- `12_customs-border-measures.md`
- `13_member-state-forum-selection.md`
- `14_governance-raci.md`

### 완료 기준
- 공개본 변경이 장별 원고에서 시작되도록 전환 완료
- `master.md` 수동 편집 의존 제거

---

## Phase 3 — 핵심 6장 우선 심화

### 목표
reader 품질을 가장 크게 끌어올리는 장부터 보강한다.

### 우선 대상
1. 제1장 시스템 지도
2. 제2장 권리 선택
3. 제4장 검색과 충돌 분석
4. 제5장 출원 경로와 서류 설계
5. 제7장 이의신청과 공존 전략
6. 제8장 등록 후 사용, 갱신, 증거 관리

### 각 장의 최소 기준
- H3 기준 최소 6개 이상
- 실행형 표 또는 체크리스트 최소 1개
- 도입부가 단순 개요가 아니라 판단 프레임 역할 수행
- "추가 리서치 게이트"는 작업용 메모에서 제거하고, 필요한 검증 항목은 research 문서로 이동

### 완료 기준
- 검색 엔트리 수의 가시적 증가
- `/europe` 검색 결과가 장 제목 나열이 아니라 실질 섹션 탐색 수준으로 개선

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

## Phase 5 — 사실 검증 승격

### 목표
초안 문장을 publish-grade 실무 문장으로 승격한다.

### 작업
- `eu_tm_fact_verification_log.md`의 Pending 항목 순차 검증
- 검증된 사실만 본문 반영
- `eu_tm_source_register.md`를 실제 참조 목록으로 정리

### 우선 검증 항목
1. EUTM vs national filing split
2. Opposition timeline
3. Proof of use window
4. Renewal timing and grace period
5. UK parallel track handling
6. Madrid linkage
7. Customs application scope

### 완료 기준
- 본문에서 "추후 확인" 식 서술 제거
- 고변동 정보가 출처 기준으로 정리됨

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
- 권역형 guide답게 **분기 기준과 운영 프레임**을 우선 설명
- 회원국 편차는 본문을 깨지 않는 범위의 표/메모/주의문으로 제한
- 제도 설명보다 실무 판단 질문을 먼저 제시

---

## 권장 일정

### Sprint 1
- Phase 0 완료
- Phase 1 시작
- manifest / build-master / qa-content 도입

### Sprint 2
- Phase 2 완료
- 장별 원고 분리
- 조립본 재생성 체계 고정

### Sprint 3
- Phase 3 진행
- 핵심 6장 심화

### Sprint 4
- Phase 4 진행
- 후반 운영 장 보강

### Sprint 5
- Phase 5 진행
- fact verification 반영
- 최종 문체 정리

---

## 수용 기준

다음 조건을 만족하면 `EuTm v1 content expansion`의 1차 완료로 본다.

1. `manifest.json`, `build-master.ts`, `qa-content.ts`가 존재한다.
2. `master.md`가 조립 결과물로 관리된다.
3. 14개 장이 모두 장별 원고 파일로 분리돼 있다.
4. 핵심 6장이 초안 수준을 벗어나 실무형 본문 구조를 갖는다.
5. search entries가 최소 180 이상으로 증가한다.
6. `npm run build` 기준 루트 셸이 정상 동작한다.
7. `README`, `Architecture`, `Content-Spec`, research docs의 상태 설명이 일치한다.

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

`EuTm` 보강은 지금 시작하는 것이 맞다. 다만 첫 단계는 본문 확장이 아니라 **LatTm-lite 제작 체계 도입**이어야 한다. 그 위에서 핵심 6장을 먼저 심화하고, fact verification을 통과한 내용을 단계적으로 승격하는 방식이 가장 안전하다.

즉, 실행 순서는 아래와 같다.

1. 상태 문서 정합화
2. manifest + build-master + qa-content 도입
3. master 분해
4. 핵심 6장 심화
5. 후반 장 보강
6. 사실 검증 승격

이 순서를 지키면 `EuTm`은 지금의 "권역 구조 초안"에서, 루트 `GloTm` 셸에서 LatTm 다음 수준으로 읽히는 권역형 실무 가이드로 전환될 수 있다.
