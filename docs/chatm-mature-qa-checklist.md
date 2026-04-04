# ChaTm Mature QA Checklist

## Purpose

이 문서는 `ChaTm`을 월간 scorecard review에서 `upgrade-ready` 후보로 올리기 위해 필요한 reader/search QA 증빙을 한 장으로 정리한다.

## Evidence Snapshot

| 항목 | 2026-04-04 기준 |
| --- | --- |
| chapter count | 15 |
| search entries | 358 |
| qaLevel target | `full` |
| lifecycle status | `beta` 유지 |
| high-risk verification gap | 0 |
| verifiedOn source | `src/products/registry.ts`의 `verifiedOn` |

## Reader / Search Checklist

| 영역 | 확인 내용 | 기대 결과 |
| --- | --- | --- |
| Home | `/china` 홈 진입, chapter card 노출, continue reading 복귀 | 빈 화면 없음, chapter 목록 정상 |
| Search | route / cancellation / licensing / customs / governance 검색 | section 단위 결과 표시 |
| Chapter deep link | `/china/chapter/:slug#section` 직접 진입 | outline, hash scroll, prev-next 정상 |
| Mobile | drawer, scrim, action bar, 짧은 챕터 footer | 겹침 없음, `body.style.overflow` 복구 |
| Gateway sync | ChaTm summary, density, QA, maturity note | registry truth와 일치 |

## Smoke Targets

- 제4장 `출원 경로 시나리오별 판단표`
- 제8장 `무효·취소 attack/defense 분기표`
- 제9장 `licensing-distribution-control sheet`
- 제12장 `customs escalation matrix`
- 제13장 `mature 기준 reader/search QA 체크리스트`

## Verification Commands

```bash
npm run content:china
npm run health:runtime
npm run health:report
npm run build:pages:glotm
```

## Review Note

- `qaLevel`은 `full`로 올리되, `lifecycleStatus`는 월간 scorecard review 전까지 `beta`를 유지한다.
- 승격 판단은 자동 반영이 아니라 `health:report`의 `upgrade-ready` verdict와 이 체크리스트 증빙을 같이 보고 내린다.
