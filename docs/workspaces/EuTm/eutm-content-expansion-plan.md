# EuTm 콘텐츠 안정화 실행 메모

## 목적

이 문서는 `EuTm`의 현재 shipped baseline을 기준으로, 루트 `GloTm` 셸의 `/europe` reader와 EuTm workspace 문서를 같은 기준선으로 다시 잠그기 위한 안정화 실행 메모다. 이번 라운드에서는 새 범위를 넓히지 않고, 이미 갖춘 제작 체계와 fact verification, 문서 정합성을 현재 baseline에 맞게 유지하는 데 집중한다.

핵심 목표는 세 가지다.

1. 이미 도입된 장별 원천 원고 + 조립 파이프라인 체계를 안정된 baseline으로 유지한다.
2. EU 공통 실무 프레임과 UK 병행 판단을 controlled EU+UK scope 안에서만 유지하고, 회원국별 편차는 메모 수준으로 통제한다.
3. 리서치 검증 로그를 통과한 사실과 현재 본문 설명을 같은 기준선으로 맞춰, local workspace gate에서 흔들리지 않는 정본 상태를 유지한다.

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
| 문서 깊이 | publish-grade | live regional guide baseline, stabilization 우선 |

### 현재 리스크

1. 기반 파이프라인은 갖춰졌지만 `LatTm` 대비 장별 밀도와 실무 사례 깊이가 아직 낮다.
2. 리서치 검증 로그의 핵심 항목은 이미 본문 반영 가능한 수준까지 정리됐지만, EU 공통 프레임과 UK 병행 판단을 controlled scope로 유지한다는 설명을 문서와 reader copy에서 계속 일치시켜야 한다.
3. 루트 전략 문서와 개별 워크스페이스 문서가 같은 속도로 갱신되지 않으면 shipped 상태 설명이 다시 어긋날 수 있다.
4. 검색 엔트리는 baseline 258을 이미 확보했으므로, 이번 라운드에서는 추가 증분보다 현재 수치와 범위 설명을 흔들리지 않게 유지하는 편이 더 중요하다.

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

이번 스프린트에서는 새 구조를 다시 만드는 것보다, 이미 있는 14장 구조를 기준으로 핵심 6장 wording drift 점검과 검증 로그 정합성 유지에 집중한다. 즉, `status` 승격이나 대규모 범위 재설정보다, `/europe` reader 품질과 문서 정합성을 안정적으로 잠그는 쪽이 우선이다.

---

## 목표 산출물

### 현재 baseline (완료)

- `content/source/manifest.json` 운영 중
- `content/source/chapters/*.md` 체계 운영 중
- `content/source/master.md`를 조립 결과물로 관리 중
- `scripts/build-master.ts`, `scripts/qa-content.ts` 운영 중
- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`는 현재 워크스페이스 기준 상태를 반영한다
- 런타임 포지션은 `validate tier · beta lifecycle`이며, 범위는 EU 공통 프레임 + UK 병행 판단까지의 controlled scope로 유지한다

### 이번 stabilization 목표

- 14장 구조 유지
- 핵심 6장의 wording drift가 보이면 최소 수정으로만 정리
- 장별 기존 실행형 표와 체크리스트 구조 유지
- search entries는 현재 258 baseline을 유지하고, 후속 증분 판단은 stabilization 이후 별도 트랙으로 넘긴다

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
현재 제작 기반을 안정적으로 유지한다.

### 작업
- `content/source/manifest.json`, `content/source/chapters/`, `scripts/build-master.ts`, `scripts/qa-content.ts`를 baseline으로 계속 유지
- 루트 `package.json`과 워크스페이스 로컬 문서가 현재 실행 순서를 정확히 설명하는지 점검
- 구조 drift 없이 `master.md` 재생성, QA, generated JSON 생성 흐름이 계속 깨지지 않도록 유지

### LatTm에서 참고할 것
- `LatTm/scripts/build-master.ts`
- `LatTm/scripts/qa-content.ts`
- `LatTm/content/source/manifest.json`

### 완료 기준
- 장별 원고를 조립해 `master.md`를 계속 재생성할 수 있음
- 제목/순서 불일치, 미닫힌 코드펜스, 기본 표 형식 오류를 자동 탐지할 수 있음

---

## Phase 2 — 핵심 6장 정합성 유지와 fact verification baseline 유지

### 목표
이미 심화된 핵심 6장의 판단 언어와 fact verification baseline을 현재 기준선에 맞게 잠근다.

### 우선 대상
1. 제1장 시스템 지도
2. 제2장 권리 선택
3. 제4장 검색과 충돌 분석
4. 제5장 출원 경로와 서류 설계
5. 제7장 이의신청과 공존 전략
6. 제8장 등록 후 사용, 갱신, 증거 관리

### 작업
- 핵심 6장에 이미 반영된 controlled Eu/UK scope 판단 언어와 운영 메모를 현재 baseline 기준으로 다시 맞춘다.
- `eu_tm_fact_verification_log.md`의 Verified 항목이 해당 장의 판단표와 운영 메모 설명과 어긋나지 않게 정렬한다.
- `eu_tm_source_register.md`를 실제 참조 목록으로 유지한다.

### 각 장의 최소 기준
- H3 기준 최소 6개 이상
- 실행형 표 또는 체크리스트 최소 1개
- 도입부가 단순 개요가 아니라 판단 프레임 역할 수행
- "추가 리서치 게이트"는 작업용 메모에서 제거하고, 필요한 검증 항목은 research 문서로 이동

### 완료 기준
- 핵심 6장의 판단표, 운영 메모, 검증 로그 연결이 같은 기준선으로 설명된다.
- `/europe` 검색 결과가 현재 baseline을 유지하면서 실질 섹션 탐색 수준을 계속 보장한다.

---

## Phase 3 — 워크스페이스 게이트

### 목표
`EuTm` 단독 lane이 root gate를 반복하지 않고도 merge-ready 상태에 도달하게 만든다.

### 작업
- `npm --prefix EuTm run content:prepare`
- 필요하면 루트 동등 경로 `npm run content:europe` 재현
- 장 제목, 헤딩 구조, 표 형식, 검색 엔트리 증가 폭 확인
- `/europe` 홈, 챕터, 검색, continue reading 흐름 스모크

### 완료 기준
- local workspace baseline인 `content:prepare`가 통과한다.
- 필요 시 루트 동등 경로 `content:europe`도 재현 가능하다.
- docs sync, controlled scope, 핵심 장 wording lock이 같은 기준선으로 설명된다.

---

## Phase 4 — root docs sync와 shared workflow hygiene

### 목표
root shared truth, report/overview wording, workspace 설명을 같은 EuTm baseline으로 정렬한다.

### 대상
- `PROJECT-OVERVIEW.md`, `docs/portfolio-scorecard.md`, `docs/buyer-narrative.md`, `docs/README.md`의 EuTm 상태 설명 동기화
- `/europe` reader home copy, Gateway metadata, report/overview wording이 `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope` 기준선과 어긋나지 않는지 점검
- shared workflow hygiene 기준으로 local workspace 증빙 우선, shared root gate 1회 원칙, controlled EU+UK scope 유지 문구를 같은 방향으로 잠금

### 완료 기준
- root docs, report/overview wording, workspace docs가 같은 baseline을 설명한다.
- EuTm을 다시 확장 트랙처럼 읽히게 하는 문구가 남지 않는다.

---

## Phase 5 — shared root gate handoff

### 목표
`EuTm` lane 결과를 shared root gate 입력으로 넘겨 통합 검증 준비 상태를 만든다.

### 작업
- `EuTm` lane은 개별 root gate를 반복하지 않고, shared verification lane에 workspace gate 결과만 넘긴다.
- 리더가 통합 후 `npm run test:content`, `npm run health:runtime`, `npm run health:release`를 1회 실행한다.

### 완료 기준
- `EuTm`의 lane 산출물이 shared root gate 입력으로 정리된다.
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
- 핵심 6장 기준선과 fact verification baseline 유지

### Sprint 3
- Phase 3 진행
- workspace gate 통과

### Sprint 4
- Phase 4 진행
- root docs sync와 shared workflow hygiene 정리

### Sprint 5
- Phase 5 진행
- shared root gate handoff

---

## 수용 기준

다음 조건을 만족하면 이번 `EuTm stabilization pass`가 완료된 것으로 본다.

1. `manifest.json`, `build-master.ts`, `qa-content.ts`가 존재한다.
2. `master.md`가 조립 결과물로 관리된다.
3. 14개 장이 모두 장별 원고 파일로 이미 분리된 상태를 유지한다.
4. 핵심 6장이 초안 수준을 벗어나 실무형 본문 구조를 갖는다.
5. search entries가 baseline 258을 유지하고, 문서와 본문 설명이 controlled EU+UK scope와 어긋나지 않는다.

---

## 2026-04-03 진행 메모

- 핵심 6장(`제1장`, `제2장`, `제4장`, `제5장`, `제7장`, `제8장`)에 controlled scope decision board, rights calendar lock, search-to-opposition handoff, route pack lock, opposition/coexistence war-room, evidence-to-enforcement reuse memo를 추가했다.
- `npm run content:europe` 기준 생성 산출물은 14개 챕터 / 검색 엔트리 258개다.
- `/europe` 스프린트 addendum 수동 smoke를 마감했고, 남은 작업은 shared root gate 입력 정리다.

## 2026-04-04 안정화 메모

- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`, `content/research/eu_tm_fact_verification_log.md`의 상태 설명을 현재 baseline에 맞게 다시 잠근다.
- 이번 라운드의 초점은 핵심 6장을 더 넓히는 것이 아니라, `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope` 설명을 문서와 fact log에서 일치시키는 데 있다.
- shared root gate 이전에는 local workspace baseline인 `npm --prefix EuTm run content:prepare`를 우선 증빙으로 사용하고, 필요 시 루트 `content:europe`를 동등 경로로 재현한다.

추가 완료 기준:

- local workspace baseline인 `content:prepare`가 통과하고, 통합 이후 shared root gate 1회가 통과한다.
- `EuTm/README.md`, `EuTm/Harness/Architecture.md`, `EuTm/Harness/Content-Spec.md`, research docs의 상태 설명이 일치한다.

## 2026-04-13 shipped addendum

- `EuTm/content/research/claim-map.json`을 도입했고, root `health:report`에서 `europe` advisory `research` block이 보이도록 정렬했다.
- 후속 보강은 대형 범위 확대 대신 Ch5 priority window, Ch11 marketplace reporting-channel memo, Ch12 UK customs AFA split처럼 controlled EU+UK lane 안의 좁은 operational note만 흡수하는 방식으로 마감했다.
- 이 상태 이후의 우선순위는 EuTm 자체 확장보다 root docs sync, report/overview wording alignment, shared workflow hygiene를 정리하는 일이다.

## 2026-04-14 closeout memo

- `npm --prefix EuTm run content:prepare`가 다시 통과했고, local workspace baseline은 `14개 챕터 / 검색 엔트리 258개 / validate tier · beta lifecycle / controlled EU+UK scope`를 유지했다.
- shared root gate로 `npm run health:all`을 1회 재현했고, `health:runtime` · `health:content` · `health:release` · `health:report`가 모두 통과했다.
- `PROJECT-OVERVIEW.md`, `README.md`, `docs/portfolio-scorecard.md`, `src/products/registry.ts`의 EuTm 및 freshness wording을 같은 실행 결과에 맞게 다시 잠갔다.
- 이번 stabilization pass 기준으로 Phase 3 workspace gate, Phase 4 root docs sync, Phase 5 shared root gate handoff를 closeout 상태로 본다.

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

`EuTm` 정리는 지금도 계속할 가치가 있다. 다만 현재 단계의 첫 일은 더 이상 제작 체계 도입이나 대형 확장이 아니라, 이미 도입된 LatTm-lite baseline과 핵심 6장 운영 문구를 안정적으로 잠그고 root shared truth를 같은 상태로 맞추는 것이다. 그 위에서 fact verification을 통과한 내용을 같은 기준선으로 유지하는 방식이 가장 안전하다.

즉, 실행 순서는 아래와 같다.

1. 상태 문서 정합화
2. baseline 파이프라인 유지
3. 핵심 6장 정합성 유지와 fact verification baseline 유지
4. root docs sync와 shared workflow hygiene
5. shared root gate handoff

글로벌 병렬 스프린트에서는 `EuTm`을 dedicated single lane으로 운영하고, worker는 `EuTm` 디렉터리와 `eu_tm_fact_verification_log.md` 중심으로만 수정한다. 루트 메타데이터와 최종 Gateway/health sync는 리더가 마지막에 처리한다.

이 순서를 지키면 `EuTm`은 현재의 live regional guide baseline을 흔들지 않고, validate lane 기준선과 controlled EU+UK scope를 root shared truth와 같은 상태로 유지할 수 있다.
