# UsaTm Root Sync Input

> **OPEN — mature 승급 선행작업(Stage 1) staged.** 15장 신설·claim-map 채택·full-QA 파이프라인 편입은
> 완료됐으나 registry의 lifecycle/tier/qa flip은 월 scorecard 리뷰(Stage 2)에서 owner가 반영한다. 현재
> 정본은 `src/products/registry.ts`(`15개 챕터 / 검색 엔트리 203개 / incubate tier · beta lifecycle · standard QA`,
> verifiedOn 2026-06-02)다.

## Baseline One-Liner

`UsaTm`은 루트 `/usa`에 연결된 live country guide이며, 현재 baseline은 `15개 챕터 / 검색 엔트리 203개 /
incubate · beta · standard QA`다(정본: `src/products/registry.ts`). 2026-06-28 mature 선행작업으로 14→15장
확장 + claim-map 채택 + full-QA 파이프라인 편입을 마쳤고, growth/mature/full flip은 Stage 2 대상이다.

## Authority Order

1. `Harness/Constitution.md`
2. `PROJECT-OVERVIEW.md`
3. `docs/current-ops-taskboard.md`
4. `README.md`
5. `src/products/registry.ts`
6. `UsaTm/README.md` / `UsaTm/Harness/Architecture.md` / `UsaTm/Harness/Content-Spec.md`
7. `UsaTm/content/research/claim-map.json`
8. `UsaTm/content/research/us_tm_source_register.md`
9. `UsaTm/content/research/us_tm_fact_verification_log.md`

## Authoritative Metadata Snapshot (현재 / Stage 2 목표)

| Field | 현재 (Stage 1 후) | Stage 2 목표 | Source |
| --- | --- | --- | --- |
| Chapter count | `15` | `15` | `registry.ts`, `manifest.json` |
| Search entry count | `203` | `203` | `registry.ts`, `search-index.json` |
| Tier / lifecycle / QA | `incubate` / `beta` / `standard` | `growth` / `mature` / `full` | `registry.ts` |
| High-risk gap count | `0` | `0` | `registry.ts` |
| verifiedOn / factsReviewedOn | `2026-06-02` / (미설정) | re-stamp / owner 사실감사일 | `registry.ts` |
| Research baseline | claim-map 9건, 전 항목 BODY_READY(HIGH 7·MEDIUM 2), source-register 매핑 | stale 4건 + legacy pending 재확인 완료 | `claim-map.json` |

## Chapter Drift Map (신규/변경분)

| Chapter | Authoritative title | 상태 |
| --- | --- | --- |
| Ch8 | `공고, Opposition, Letter of Protest 대응` | A등급 사실 반영(opposition 30일·cancellation 교차) |
| Ch13 | `분쟁 전략: TTAB, 연방법원, 행정/민사 선택` | cancellation 5년·연방법원 구제 sharpening |
| Ch14 | `집행 포럼 통합 플레이북: TTAB·연방법원·플랫폼·CBP 병행 운영` | **신규**(오케스트레이션 레이어) |
| Ch15 | `포트폴리오 관리 및 내부 통제(RACI) + 부록` | 14→15 renumber(내용 불변) |

## Research Alignment Packet

- Scope guardrail: 본문은 A등급 검증 조문(§1063/§1064/§1116–1118)만 단정 반영. 휘발성 수수료·B등급 판례는 제외.
- BODY_READY claims 9건: `USA-OPP-001`, `USA-CANC-001`, `USA-REM-001`, `USA-TTAB-001`, `USA-MAINT-001`,
  `USA-CBP-001`, `USA-ATY-001`, `USA-FEE-001`(구조적), `USA-MADRID-001`.
- Research rule: fee 금액·기관 시스템 명칭·제출 기한은 claim-map/legacy log 기준선 밖으로 새로 단정 확장하지 않는다.

## Local Gate Evidence

- `2026-06-28` `npm --prefix UsaTm run content:prepare`
  - `Generated UsaTm master manuscript from 15 sources.`
  - `QA complete: 0 error(s), 0 warning(s), 15 source file(s) checked.`
  - `Generated 15 chapters and 203 search entries.`
- `2026-06-28` `audit:facts`(UsaTm): `gate=warn`(staleness 6건 advisory), `factIntegrity=100`, `consistency=100`, `effectiveGap=0`

## Stage 2 Flip Checklist (owner, 월 scorecard 리뷰)

- [ ] stale 4건(TTAB·MAINT·CBP·ATY) + legacy pending 4종(fee·Assignment Center·SOU·LOP) 1차출처 재확인 → `lastVerified` 재스탬프
- [ ] `registry.ts` usa: `lifecycleStatus` mature · `qaLevel` full · `portfolioTier` growth · `verifiedOn` re-stamp · `factsReviewedOn` 설정 · `maturityNote`
- [ ] `scorecard.test.ts` usa `beta`→`mature`
- [ ] `PROJECT-OVERVIEW.md` / `docs/portfolio-scorecard.md` / `docs/current-ops-taskboard.md` 동기화
- [ ] (선택) gateway 재정렬, usaManuscript 테스트 추가

## Non-Scope Reminder

- 이 단계에서 lifecycle/tier/qa 메타데이터는 바꾸지 않는다(flip은 Stage 2).
- generated JSON, master.md는 파이프라인 재생성만 하고 수기 편집하지 않는다.
