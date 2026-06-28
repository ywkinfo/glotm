# GloTm Monthly Review Template

이 문서는 월간 리뷰에서 buyer-facing wedge, funnel, Gateway hero, KPI sheet를 같은 기준으로 잠그기 위한 템플릿이다.
값을 바꿀 때는 먼저 source of truth를 업데이트한다.

- positioning: `../PROJECT-OVERVIEW.md`, `buyer-narrative.md`
- Gateway hero: `../src/content/gateway.ts` (supporting 문단 정본), `../src/app/GatewayPage.tsx` (제목·리드)
- funnel CTA: `../src/products/registry.ts`
- report ordering: `../src/reports/registry.ts`
- KPI sheet: `portfolio-scorecard.md`

## health:report 해석 규칙

`npm run health:report`는 **recent lane-state provenance summary**다. end-to-end verified proof가 아니다.

| 항목 | 설명 |
|---|---|
| 읽는 방식 | 저장된 마지막 lane 결과(`.omx/state/health-lane-status.json`)를 읽어 출력한다. 실행 시점에 `health:runtime/content/release`를 다시 돌리지 않는다. |
| 의미 | 가장 최근 shared root gate 실행 시점의 스냅샷이다. 그 이후 코드·콘텐츠 변경이 있으면 결과가 stale할 수 있다. |
| verdict 해석 | `hold` = 현재 lifecycle 기준 충족, `upgrade-ready` = 다음 lifecycle 조건 충족, `verification-refresh-needed` = freshness 또는 gap 기준 미달 |
| 월간 리뷰 활용 | verdict만 보지 말고, 마지막 `verifiedOn` 날짜와 오늘 사이의 freshness 경과일을 함께 확인한다. lifecycle 상향은 scorecard 리뷰에서만 반영한다. |
| fresh 검증 필요 시 | `npm run health:runtime && npm run health:content && npm run health:release && npm run health:report` 순서로 full lane을 다시 돌린다. |

## verifiedOn 과 fact-review 분리

`verifiedOn`(registry.ts)과 scorecard freshness는 **shared root lane 재검증 시점**을 가리킨다. 월간 re-stamp는 "lane을 다시 통과시켰다"는 뜻이지 "1차 출처로 사실을 다시 확인했다"는 뜻이 아니다. 두 트랙을 분리해서 본다.

| 트랙 | 의미 | tier 게이팅 | cadence |
|---|---|---|---|
| lane 재검증 (`verifiedOn`) | `content:prepare`·`health:*` 재통과 | 게이팅함 (scorecard freshness) | 월 1회 review에서 re-stamp |
| fact-review | 관보·기관 고지 등 1차 출처로 핵심 claim 재대조 | 게이팅 안 함 (advisory) | 별도 — 아래에 기록 |

fact-review는 tier를 올리거나 내리지 않는다. 다만 월간 review에서 "이번 달 어떤 가이드의 어떤 claim을 1차 출처로 다시 봤는가"를 남겨, lane freshness와 fact freshness가 섞이지 않게 한다.

### Fact-review log (이번 월)

| Guide | 재대조한 claim/영역 | 1차 출처 | 결과(유지/수정) |
|------|------|------|------|
|  |  |  |  |

재대조를 수행한 가이드는 `../src/products/registry.ts`의 `factsReviewedOn`에 날짜를 적으면 `npm run health:report`의 `Fact-Review (advisory, non-gating)` 섹션에 반영된다(미기록은 `unrecorded`로 표시되고 tier에 영향 없음).

> fact-review cadence 목표는 아직 미설정이다. 휴면(`Phase 2.5`) 포트폴리오 기준으로 현실적인 주기(예: 분기 또는 반기)를 운영자가 정한다. 정하기 전까지는 "재대조한 것만 기록"으로 운영하고, 미기록을 자동으로 stale 처리하지 않는다.

## Locked defaults (2026-05-12)

- One-line wedge: `중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕는다.`
- Funnel CTA: `ChaTm 보기 -> MexTm 먼저 보기 -> EuTm 보기`
- Primary reports:
  `한글 표장 글로벌 보호 운영 프레임워크` (`hangul-mark-global-protection-framework`, 2026-04-15)
  `글로벌 상표 출원 우선순위 결정 프레임워크` (`global-filing-priority-framework`, 2026-04-09)
- Gateway hero copy:
  `중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다.`
  `중국 가이드(ChaTm)에서는 중국어 브랜드명, 시장별 출시 순서, 상표 출원 방식을 먼저 정리합니다. 이어 멕시코 가이드(MexTm)에서는 출원 준비와 등록 후 관리, 세관에서 위조품을 막기 위한 준비를 살펴봅니다. 유럽 가이드(EuTm)에서는 EU와 영국에서 상표를 어디까지 보호할지, 권리를 지키기 위해 어떤 증거가 필요한지 살펴봅니다.`
  `최신 리포트 2개는 세 가이드에서 반복해서 나오는 질문을 한곳에 모아 정리한 자료입니다.`
- Gateway hero CTA row: `ChaTm 보기 | MexTm 먼저 보기 | 리포트 보기`
- KPI sheet 6 events:
  `guide_cta_click`
  `report_open`
  `report_handoff_click`
  `report_guide_click`
  `brief_issue_open`
  `operator_link_click`
- Excluded from current KPI sheet: `priority_cta_click`

## Review sheet

- Review month:
- Reviewer:
- Decision: `hold` / `revise`

## Positioning check

- One-line wedge still matches current buyer:
- Current evidence:
- Required changes:

## Funnel check

| Order | Guide | Canonical CTA | Status | Evidence |
|------|------|------|------|------|
| 1 | `ChaTm` | `ChaTm 보기` |  |  |
| 2 | `MexTm` | `MexTm 먼저 보기` |  |  |
| 3 | `EuTm` | `EuTm 보기` |  |  |
| 5 | `UsaTm` | `UsaTm 보기` |  | supporting growth lane, Gateway first CTA 아님 |

## Report handoff check

| Slot | Report | Status | Evidence |
|------|------|------|------|
| 1 | `hangul-mark-global-protection-framework` |  |  |
| 2 | `global-filing-priority-framework` |  |  |

## Growth / Incubate Hygiene Check

| Guide | Locked Promise | Status | Evidence |
|------|------|------|------|
| `UsaTm` | growth mature full-QA, no draft notice, filing/maintenance/enforcement orchestration utility 유지 |  |  |
| `JapTm` | beta lighter-track, no draft notice, route/maintenance/evidence utility 유지 |  |  |
| `UKTm` | beta early-track verified 공개본 유지, standard QA evidence 4-file 정합, continue reading/search 안정성 유지 |  |  |

## Gateway hero check

- Sentence 1:
- Sentence 2:
- Sentence 3:
- CTA row:
- First viewport trust-layer read:
- Notes:

## KPI sheet check

| Event | Included | Notes |
|------|------|------|
| `guide_cta_click` | yes |  |
| `report_open` | yes |  |
| `report_handoff_click` | yes |  |
| `report_guide_click` | yes |  |
| `brief_issue_open` | yes |  |
| `operator_link_click` | yes |  |
| `priority_cta_click` | no | keep runtime event, exclude from sheet while the sheet stays simple |

## Organic indexing & measurement check

owner 전용 실행 절차는 [`phase2.5-organic-indexing-ops.md`](phase2.5-organic-indexing-ops.md)를 따른다.
이 표에는 그 달의 결과만 기록한다.

| 항목 | 이번 달 값 | 비고 |
|------|------------|------|
| sitemap 색인 제출 status |  | SC Sitemaps (기대 discovered 139) |
| 색인된 URL 수 / 미색인 |  | SC Pages 리포트 |
| 색인 요청한 우선 URL |  | Gateway·china/mexico/europe home·최신 brief/report |
| GA4 page_view 도착 |  | DebugView, manual SPA 발사 |
| GA4 6 KPI 이벤트 도착 |  | 누락 이벤트만 적기 |
| organic sessions (이번 달) |  | 월 100 유기방문 트리거 대비 |

## Decision log

- What changed:
- What stayed locked:
- Follow-up for next review:
