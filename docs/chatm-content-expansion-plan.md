# ChaTm 콘텐츠 보강 실행 계획서

## 목적

이 문서는 `ChaTm`을 루트 `GloTm` 셸 `/china`에서 읽히는 live country guide baseline에서, 더 깊고 실행형인 중국 상표 실무 가이드 v1로 끌어올리기 위한 실행 계획서다.

핵심 목표는 세 가지다.

1. `ChaTm`의 현재 15장 구조를 유지한 채 Sprint 1 우선 6장을 운영형 기준까지 심화한다.
2. 사실 검증 로그를 본문 집필과 분리해, 검증된 사실만 공개본으로 승격하는 흐름을 고정한다.
3. 원고 작성, 검증, QA, 배포 준비를 병렬 레인으로 나눠 전체 리드타임을 줄인다.

## 현재 상태 요약

2026-04-03 기준 확인된 사실:

- `ChaTm`은 루트 `GloTm` 셸 `/china` 경로에 연결된 live country guide다.
- 현재 파이프라인은 `build-master -> qa-content -> build-content`로 정착돼 있다.
- 현재 공개본 기준 구조는 서문 포함 15개 챕터다.
- 현재 루트 registry 기준 검색 엔트리는 239개다.
- `content/research/cn_tm_fact_verification_log.md`의 핵심 큐는 구조화된 `claim_id` 기반 로그로 정리돼 있고, 주요 항목은 `Body-ready` 상태까지 올라와 있다.
- Sprint 1 잠금 6장(`제2장`, `제3장`, `제5장`, `제6장`, `제7장`, `제10장`)은 심화 원고와 운영표 보강이 반영된 상태다.
- 현재 병목은 "초기 장 수 확보"가 아니라, Sprint 1 반영분의 reader smoke 마감과 shared root gate 입력 정리다.

## 편집 원칙

- 얇은 가이드를 빠르게 두껍게 만드는 것보다, 재생산 가능한 제작 체계를 유지하면서 장별 밀도를 올린다.
- 변동성이 높은 사실은 반드시 `content/research/cn_tm_fact_verification_log.md`에 먼저 기록하고 본문으로 올린다.
- 각 장에는 최소 1개의 체크리스트, 비교표, 판단 기준표, 운영 메모 중 하나를 포함한다.
- `master.md`와 generated JSON은 결과물로 취급하고, 유지보수 시작점은 `content/source/chapters/`와 `manifest.json`으로 고정한다.

## v1 목표 산출물

- 챕터 수: 서문 포함 15장 구조 유지
- 검색 엔트리: 239 current baseline, 후속 심화 시 250~280 범위 목표
- 장별 H3 이상 소제목: 최소 5개 이상
- 각 장의 도입부는 summary/search entry 재료가 되도록 판단 프레임 역할을 하게 작성
- `npm run content:china`, `npm test`, `npm run build`, `npm run build:pages:glotm` 통과

## 권장 챕터 구조

1. 서문
2. 제1장. 중국 상표제도 구조와 판단 프레임
3. 제2장. 브랜드 구조와 중국어 표기 전략
4. 제3장. 검색, 분류, 서브클래스 충돌 분석
5. 제4장. 출원 경로 선택: 직접출원 vs 마드리드
6. 제5장. 출원서 작성 실무: 출원인, 지정상품, 우선권, 대리인
7. 제6장. 심사, 공고, 이의와 거절 대응
8. 제7장. 등록 후 유지, 갱신과 사용 증거
9. 제8장. 불사용취소, 무효와 권리 안정성
10. 제9장. 라이선스, 유통, 제조 구조와 상표 통제
11. 제10장. 분쟁 대응: 행정, 사법, 플랫폼, 세관
12. 제11장. 도메인, 저작권, 부정경쟁과의 결합 전략
13. 제12장. 모니터링, 포트폴리오 운영, 내부통제(RACI)
14. 부록. 체크리스트, 타임라인, 공식 링크, FAQ

## Sprint 1 우선순위

Sprint 1에서는 검색 밀도와 운영 판단 가치가 큰 장부터 먼저 심화한다.

우선 대상:

1. 제2장. 브랜드 구조와 중국어 표기 전략
2. 제3장. 검색, 분류, 서브클래스 충돌 분석
3. 제5장. 출원서 작성 실무
4. 제6장. 심사, 공고, 이의와 거절 대응
5. 제7장. 등록 후 유지, 갱신과 사용 증거
6. 제10장. 분쟁 대응: 행정, 사법, 플랫폼, 세관

선정 이유:

- 현재 ChaTm에서 가장 부족한 축이 중국어 표기, 서브클래스, 출원 실무, 집행 경로 분기다.
- 위 6개 장이 보강되면 `/china` 검색과 챕터 탐색 품질이 가장 빠르게 올라간다.
- 나머지 장은 Sprint 2에서 거래 구조, 무효/취소, 거버넌스, 부록으로 이어 붙이기 쉽다.

## 병렬 팀 구성

이번 글로벌 병렬 스프린트에서 `ChaTm`은 `리더 1 + ChaTm 전용 레인 5` 기준으로 운영한다.

- 레인 1. 편집 총괄: 우선 6장 scope 고정, 머지 기준 관리, 다른 가이드와의 shared root gate 순서 조율
- 레인 2. 원고 A: 제2장, 제3장, 제5장 심화
- 레인 3. 원고 B: 제6장, 제7장, 제10장 심화
- 레인 4. 사실 검증: `cn_tm_fact_verification_log.md`에서 우선 6장 claim 매핑, `Pending -> Verified -> Body-ready` 승격
- 레인 5. QA/배포 준비: `content:china` 통과, reader smoke checklist 정리, 통합 root gate 입력 정리

## 우선 6장 레인 분할안

- 원고 레인 A
  - 제2장. 브랜드 구조와 중국어 표기 전략
  - 제3장. 검색, 분류, 서브클래스 충돌 분석
  - 제5장. 출원서 작성 실무

- 원고 레인 B
  - 제6장. 심사, 공고, 이의와 거절 대응
  - 제7장. 등록 후 유지, 갱신과 사용 증거
  - 제10장. 분쟁 대응: 행정, 사법, 플랫폼, 세관

## 실행 단계

### Phase 0 — 기준선 고정

- 현재 15장 구조와 Sprint 1 우선 6장을 고정한다.
- 현재 기준 수치를 `15장 / 검색 엔트리 239`로 갱신한다.
- 사실 검증 로그의 핵심 `Body-ready` 항목을 어느 장에 승격할지 명시한다.
- Sprint 1 완료 기준과 worktree 기준 머지 규칙을 문서화한다.

### Phase 1 — 병렬 집필

- 원고 레인 A/B가 병렬로 우선 6장을 심화한다.
- 각 장은 도입부, 판단 기준, 체크리스트/표, 리스크/예외, 운영 메모 구조를 우선 적용한다.

### Phase 2 — 사실 검증 동기화

- 사실 검증 레인이 변동성이 큰 항목을 로그에 먼저 기록한다.
- 검증 완료된 사실만 본문에 승격한다.
- 기한, 수수료, 공식 절차명, 기관명, 시스템명은 검증 전 단정 서술을 피한다.

#### 검증 로그 최소 필드

- `claim_id`
- `category`
- `chapter_ref`
- `claim_text`
- `jurisdiction`
- `source_tier`
- `official_source`
- `evidence_excerpt`
- `captured_at`
- `last_verified`
- `status`
- `acceptance_rule`
- `reviewer`
- `notes`

#### Source Tier 규칙

- `Tier 1`: 법령, 공식 기관 공지, 공식 수수료표, 공식 절차 안내
- `Tier 2`: 공식 양식, 포털 안내, FAQ, 운영 공지
- `Tier 3`: WIPO, 공식 판례/법원 공개자료, 공식 보조 문서
- `Secondary`: 로펌/블로그/해설. 사실 확정용 금지

#### 상태 규칙

- `Pending`: 공식 근거 미확보
- `Verified`: 공식 근거와 핵심 문구, 확인일 확보
- `Body-ready`: 본문 반영 장/섹션과 번역 메모까지 정리 완료
- `Conflict`: 출처가 충돌해 본문 반영 금지

### Phase 3 — 워크스페이스 게이트

- `npm run content:china`
- 챕터 제목, 헤딩 구조, 표 형식, 검색 엔트리 증가 폭 확인
- `/china` 홈, 챕터, 검색, continue reading 흐름 스모크

### Phase 4 — 통합 머지와 shared root gate

- 글로벌 스프린트 머지 순서에서 `ChaTm`을 첫 번째로 병합한다.
- 다른 가이드가 workspace gate를 통과한 뒤 리더가 shared root gate를 1회만 실행한다.
- 파일럿 배포 체크리스트와 릴리즈 노트 초안을 shared verification lane에 넘긴다.

## 검증 순서

병렬 가능:

- 원고 A/B 집필
- 사실 검증 로그 확장
- 검색/리더 QA 체크리스트 설계

순차 필요:

1. 본문 원고 업데이트
2. `npm run content:china`
3. 리더 머지
4. shared root gate (`npm run test:content`, `npm run health:runtime`, `npm run health:release`)

## 완료 기준

- 권장 챕터 구조가 `manifest.json`과 장별 원고에 반영됨
- Sprint 1 우선 6개 장이 목표 밀도까지 확장됨
- 사실 검증 로그의 핵심 큐가 `Pending-only` 상태가 아니고, Sprint 1 우선 장에 필요한 항목이 본문 반영 가능 상태로 정리됨
- `content:china`가 workspace gate로 통과하고, 통합 이후 shared root gate가 1회 통과함
- `/china` 리더의 홈/챕터/검색 흐름이 깨지지 않음
- 배포 준비팀이 파일럿 배포 readiness 메모를 남김

## 2026-04-03 진행 메모

- Sprint 1 잠금 6장에 naming-search-filing language lock, 类似群 x business model 매핑, filing packet readiness, war-room board, evidence vault incident 연계, route switch 증거표를 추가했다.
- `npm run content:china`, `npm run test:content`, `npm run build`, `npm run build:pages:glotm`를 통과했다.
- `/china` 스프린트 addendum 수동 smoke와 전략 문서/Gateway 메타 sync까지 마감했다.

## 운영 메모

- 이번 스프린트는 `tmux` 기반 `omx team` 런타임을 기준으로 운영한다.
- `omx team`은 dedicated worktree를 기본으로 사용하므로, worker는 `ChaTm` 디렉터리와 해당 research log만 수정한다.
- launch 예시는 `omx team 6:executor "ChaTm/MexTm/EuTm parallel content sprint with shared verification"`이다.

## Lane Done Criteria

- `writing` lane: `manifest.json` 제목과 장 H1이 일치하고, 장당 최소 3개 이상의 실무 섹션과 1개 이상의 체크리스트/표를 포함한다.
- `verification` lane: 각 사실이 `Pending -> Verified -> Body-ready`를 통과하고, 기한/수수료/절차명/기관명은 공식 출처 기준으로 교차확인된다.
- `release-prep` lane: `npm run content:china`가 통과하고 `/china` 핵심 reader flow 스모크가 끝난 뒤, shared root gate 입력값을 리더에게 넘긴다.
