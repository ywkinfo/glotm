# UKTm Accuracy & Completeness Review

검수 기준일: 2026-04-03

## 전체 총평

- 대상 문서: `UKTm/content/source/master.md`
- 검수 수준: verification refresh
- 검수 초점: 정확도(공식 1차 출처 기준), early-track 공개본으로서의 충실도

현재 `UKTm` 본문은 early-track 공개본 기준에서 계속 공개 가능한 상태다. 이번 refresh에서는 `uk_tm_fact_verification_log.md`와 `uk_tm_source_register.md`를 기준으로 변동성 높은 핵심 사실을 다시 대조했고, root/local pipeline 재생성까지 통과했다. 치명적 사실 오류나 즉시 수정이 필요한 구조 결함은 확인되지 않았다.

다만 `UKTm`은 여전히 lighter-track 가이드다. 이번 라운드의 목적은 beta 승격이 아니라, 현재 공개본을 `pilot` 기준에서 더 솔직하고 안정적으로 유지하는 데 있다. 즉 이번 검수는 “대폭 확장 필요 없음, 공개본 유지 가능, 다음 단계는 density/utility가 아니라 계속된 verification hygiene”라는 결론에 가깝다.

판정:

- 정확도: 통과
- 충실도: 통과
- 재작성 필요 장: 0
- 즉시 보강 필요 장: 0
- 공개 가능 여부: 가능

## 핵심 확인 결과

### 정확도

- opposition 예고, opposition 제기, cooling-off 구조가 fact log와 source register 기준으로 정리돼 있다.
- 10년 갱신, non-use revocation, HMRC AFA, comparable UK mark, post-Brexit IR 비교 포인트가 공식 출처와 충돌하지 않는다.
- `.uk` 도메인 분쟁, IPEC 포럼 구분, UKIPO 공식 검색 시스템 명칭도 레지스터 기준 용어와 일치한다.

### 충실도

- early-track 독자가 필요한 운영 질문은 충분히 보인다: UKIPO 경로, post-Brexit 차이, 유지관리, revocation, 온라인/도메인, 세관, RACI.
- `EuTm`과 중복 설명을 최소화하면서 영국 단일시장 실무 포인트를 따로 꺼내는 구조가 유지되고 있다.
- 부록과 체크리스트는 larger rewrite 없이도 재사용 가능한 수준을 유지한다.

## 이번 refresh에서 잠근 결론

- `UKTm`은 `pilot` lane에 정직하게 맞는 상태다.
- `qaLevel`은 계속 `smoke`로 두는 편이 맞다. 지금은 표준화된 stronger QA 승격보다 verification hygiene 유지가 우선이다.
- `verificationFreshnessDays`와 `highRiskVerificationGapCount`는 이번 refresh 결과 기준으로 0으로 내려도 무리가 없다.
- `draft 공개본 · early track` 포지션은 유지한다. 이번 검수는 승격이 아니라 안정화다.

## 공개 전 마지막 확인 권고

- 공개 직전 fee, deadline, system naming, HMRC/Nominet/UKIPO page wording은 fact log 기준으로 한 번 더 확인한다.
- 모바일 overlay와 짧은 챕터 footer 겹침 같은 수동 reader QA는 루트 런타임 체크리스트를 계속 따른다.
