# UsaTm Root Sync Input

> **CLOSED — UsaTm growth/mature promotion shipped.** 15장 신설·claim-map 채택·full-QA 파이프라인 편입과
> owner Stage 2 fact-review / registry flip을 2026-06-29 scorecard follow-up에서 닫았다. 현재 정본은
> `src/products/registry.ts`(`15개 챕터 / 검색 엔트리 206개 / growth tier · mature lifecycle · full QA`,
> verifiedOn/factsReviewedOn 2026-06-29)다.

## Baseline One-Liner

`UsaTm`은 루트 `/usa`에 연결된 live country guide이며, 현재 baseline은 `15개 챕터 / 검색 엔트리 206개 /
growth · mature · full QA`다(정본: `src/products/registry.ts`). 2026-06-29 mature closeout follow-up으로
14→15장 확장 + claim-map 15건 + full-QA 파이프라인 편입 + owner fact-review를 마쳤다.

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

## Authoritative Metadata Snapshot

| Field | 현재 | Source |
| --- | --- | --- |
| Chapter count | `15` | `registry.ts`, `manifest.json` |
| Search entry count | `206` | `registry.ts`, `search-index.json` |
| Tier / lifecycle / QA | `growth` / `mature` / `full` | `registry.ts` |
| High-risk gap count | `0` | `registry.ts` |
| verifiedOn / factsReviewedOn | `2026-06-29` / `2026-06-29` | `registry.ts` |
| Research baseline | claim-map 15건, 전 항목 BODY_READY(HIGH 10·MEDIUM 5), source-register 매핑 | `claim-map.json` |

## Chapter Drift Map (신규/변경분)

| Chapter | Authoritative title | 상태 |
| --- | --- | --- |
| Ch8 | `공고, Opposition, Letter of Protest 대응` | A등급 사실 반영(opposition 30일·cancellation 교차) |
| Ch13 | `분쟁 전략: TTAB, 연방법원, 행정/민사 선택` | cancellation 5년·연방법원 구제 sharpening |
| Ch14 | `집행 포럼 통합 플레이북: TTAB·연방법원·플랫폼·CBP 병행 운영` | **신규**(오케스트레이션 레이어) |
| Ch15 | `포트폴리오 관리 및 내부 통제(RACI) + 부록` | 14→15 renumber(내용 불변) |

## Research Alignment Packet

- Scope guardrail: 본문은 A등급 검증 조문(§1063/§1064/§1116–1118)만 단정 반영. 휘발성 수수료·B등급 판례는 제외.
- BODY_READY claims 15건: `USA-OPP-001`, `USA-CANC-001`, `USA-REM-001`, `USA-TTAB-001`, `USA-MAINT-001`,
  `USA-CBP-001`, `USA-ATY-001`, `USA-FEE-001`(구조적), `USA-ASSIGN-001`, `USA-SOU-001`, `USA-LOP-001`,
  `USA-MADRID-001`, `USA-PARODY-001`, `USA-DILUTION-001`, `USA-CBP-002`.
- Research rule: fee 금액·기관 시스템 명칭·제출 기한은 claim-map/legacy log 기준선 밖으로 새로 단정 확장하지 않는다.

## Local Gate Evidence

- `2026-06-29` `npm --prefix UsaTm run content:prepare`
  - `Generated UsaTm master manuscript from 15 sources.`
  - `QA complete: 0 error(s), 0 warning(s), 15 source file(s) checked.`
  - `Generated 15 chapters and 206 search entries.`
- `2026-06-29` `audit:facts`(UsaTm): `gate=pass`, `factIntegrity=100`, `consistency=100`, `effectiveGap=0`

## Stage 2 Flip Checklist (owner, 월 scorecard 리뷰)

- [x] stale 4건(TTAB·MAINT·CBP·ATY) + legacy pending 4종(fee·Assignment Center·SOU·LOP) 1차출처 재확인 → `lastVerified` 재스탬프
- [x] `registry.ts` usa: `lifecycleStatus` mature · `qaLevel` full · `portfolioTier` growth · `verifiedOn` re-stamp · `factsReviewedOn` 설정 · `maturityNote`
- [x] `scorecard.test.ts` usa `beta`→`mature`
- [x] `PROJECT-OVERVIEW.md` / `docs/portfolio-scorecard.md` / `docs/current-ops-taskboard.md` 동기화
- [x] gateway first-screen priority는 유지하고, UsaTm은 supporting growth lane으로 기록

## Non-Scope Reminder

- lifecycle/tier/qa 메타데이터 flip은 Stage 2에서 반영 완료했다.
- generated JSON, master.md는 파이프라인 재생성만 하고 수기 편집하지 않는다.
