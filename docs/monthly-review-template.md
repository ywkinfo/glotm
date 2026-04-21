# GloTm Monthly Review Template

이 문서는 월간 리뷰에서 buyer-facing wedge, funnel, Gateway hero, KPI sheet를 같은 기준으로 잠그기 위한 템플릿이다.
값을 바꿀 때는 먼저 source of truth를 업데이트한다.

- positioning: `../PROJECT-OVERVIEW.md`, `buyer-narrative.md`
- Gateway hero: `../src/app/GatewayPage.tsx`
- funnel CTA: `../src/products/registry.ts`
- report ordering: `../src/reports/registry.ts`
- KPI sheet: `portfolio-scorecard.md`

## Locked defaults (2026-04-21)

- One-line wedge: `중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕는다.`
- Funnel CTA: `ChaTm 보기 -> MexTm 먼저 보기 -> EuTm 보기`
- Primary reports:
  `한글 표장 글로벌 보호 운영 프레임워크` (`hangul-mark-global-protection-framework`, 2026-04-15)
  `글로벌 상표 출원 우선순위 결정 프레임워크` (`global-filing-priority-framework`, 2026-04-09)
- Gateway hero copy:
  `중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다.`
  `ChaTm에서 중국어 표기와 launch sequencing, 출원 경로를 먼저 잠그고, MexTm의 filing packet·maintenance·border-control handoff와 EuTm의 controlled EU+UK scope·evidence triage를 같은 흐름으로 이어 봅니다.`
  `최신 리포트 2개는 별도 탐색면이 아니라 이 세 가이드에서 공통으로 부딪히는 질문을 다시 묶는 trust layer로 둡니다.`
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

## Report handoff check

| Slot | Report | Status | Evidence |
|------|------|------|------|
| 1 | `hangul-mark-global-protection-framework` |  |  |
| 2 | `global-filing-priority-framework` |  |  |

## Incubate Hygiene Check

| Guide | Locked Promise | Status | Evidence |
|------|------|------|------|
| `UsaTm` | beta lighter-track, no draft notice, filing/specimen/monitoring utility 유지 |  |  |
| `JapTm` | beta lighter-track, no draft notice, route/maintenance/evidence utility 유지 |  |  |
| `UKTm` | pilot draft 공개본 유지, continue reading/search 안정성 유지 |  |  |

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

## Decision log

- What changed:
- What stayed locked:
- Follow-up for next review:
