# GloTm Content Gap Review (콘텐츠 보충·추가 필요성 진단)

> As of 2026-06-08 · 읽기 전용 진단 메모(read-only diagnostic). 콘텐츠 변경은 포함하지 않는다.
>
> 수치 정본은 [`../src/products/registry.ts`](../src/products/registry.ts)이며 이 메모는 거기서 파생한 **dated snapshot**이다. 불일치 시 registry가 정본이다. 현재 phase·우선순위는 [`../PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md), 운영 보드는 [`current-ops-taskboard.md`](current-ops-taskboard.md)를 기준으로 본다.

## 1. 목적

"기존 콘텐츠의 보충 및 추가가 필요한가"를 가이드별 **계약(Content-Spec)** 과 런타임 정본 수치에 비춰 판정한다. 결론은 단순 분량이 아니라 각 가이드가 스스로 규정한 기준 충족 여부로 본다.

## 2. 검토 방법 + Heuristic Diagnostic 한계 고지

- **밀도(density)** = `searchEntryCount / chapterCount` ([`../src/products/scorecard.ts`](../src/products/scorecard.ts) 정의, registry 값에서 파생). locale 무관.
- **챕터 깊이** = 소스 챕터 `LC_ALL=en_US.UTF-8 wc -m`(문자 수). `wc -m` 결과는 **locale에 따라 달라지므로**(C/POSIX 등 비-UTF-8 locale에선 바이트 단위로 셀 수 있어 한국어가 부풀려짐) UTF-8 locale을 명시한다.
- **구조화 산출물** = ① pipe 표 ② 체크박스(`- [ ]`) ③ 체크리스트·보드·매트릭스 **섹션**(heading)을 별도 지표로 측정. **"표 없음" ≠ "구조화 산출물 없음"** 으로 구분한다.
- **측정 대상은 각 워크스페이스 `chapters/*.md` 본문 104개다.** `manifest.json`이 함께 참조하는 부록(`appendix/*` — 5개 가이드 9개 파일)은 본문 챕터가 아니라 표·체크리스트 **템플릿 모음**이라 분량·구조 카운트에서 제외했다(별도 확인 결과 부록 9개 모두 표·체크리스트 보유 → 구조화 산출물을 늘리기만 함). registry `chapterCount`는 manifest 기준이라 일부 가이드가 부록을 1개 장으로 포함해, 측정한 본문 파일 수보다 클 수 있다(예: LatTm 20 = 본문 19 + 부록 1).
- 재현 명령은 §6에 둔다.

> **Heuristic Diagnostic.** 구조화 산출물 탐지는 heading/패턴 기반 **휴리스틱**이다. 문맥 false positive(예: "이 장은 체크리스트가 아니다" 식 heading, 표를 *언급만* 한 산문)가 있을 수 있다. 따라서 아래 수치는 **절대 정밀도가 아니라 커버리지·트렌드 분석용**이다.

## 3. 결론 (헤드라인)

1. **구조화 산출물 커버리지: 사실상 완전.** 측정한 104개 본문 챕터 중 **구조화 산출물이 하나도 없는 챕터는 prefaces 3개뿐**(MexTm·UsaTm·JapTm 서문). 그 외 모든 본문 챕터가 표/체크박스/체크리스트 섹션 중 ≥1을 보유한다(부록 9개도 전부 보유). 구조화 산출물을 **장별 의무로 규정한 계약([UKTm](../UKTm/Harness/Content-Spec.md)·[ChaTm](../ChaTm/Harness/Content-Spec.md))**도 각각 충족(UKTm 14/14, ChaTm 15/15). → **구조 결함 없음.**
2. **incubate 가이드의 얇은 분량은 의도된 "lighter-track"** 이다. "대형 확장보다 reader utility(체크리스트·비교표·handoff) 우선"이라는 명시 문구는 **UsaTm·JapTm Content-Spec에만** 있다. **UKTm**은 그 문구 대신 "각 장 구조화 산출물 ≥1 의무 + growth/mature 회피·incubate 유지" 계약으로 같은 lighter-track을 규정한다(동일한 장별 산출물 의무는 growth/mature인 **ChaTm** 계약에도 있다). **EuTm**은 "**14장 전면 확장 금지, controlled EU+UK scope 내 좁은 operational note만 허용**"으로 확장을 직접 차단한다.
3. → **대규모 콘텐츠 보충 필요성 = 낮음.** 근거 있는 실제 갭은 콘텐츠 분량이 아니라 **fact-review 기록 적격성 검토 1건 + search-entry 회귀 가드 1건**뿐이다(§4).

### 측정 데이터 (As of 2026-06-08)

| 가이드 | tier / lifecycle | chapters | search | **density** | 본문 깊이 avg(자) | min~max(자) | 구조 산출물 ≥1 |
|---|---|---:|---:|---:|---:|---:|---:|
| LatTm | flagship / mature | 20 | 781 | **39.1** | 10,912 | 5,477~18,259 | 19/19 |
| MexTm | growth / mature | 15 | 385 | **25.7** | 12,333 | 2,126~16,415 | 13/14(서문 제외) |
| ChaTm | growth / mature | 15 | 358 | **23.9** | 7,016 | 5,281~9,919 | 15/15 |
| EuTm | validate / beta | 14 | 258 | **18.4** | 5,363 | 2,950~8,899 | 14/14 |
| UsaTm | incubate / beta | 14 | 185 | **13.2** | 3,401 | 1,667~6,596 | 13/14(서문 제외) |
| JapTm | incubate / beta | 15 | 145 | **9.67** | 3,110 | 2,419~4,237 | 13/14(서문 제외) |
| UKTm | incubate / beta | 14 | 128 | **9.14** | 2,959 | 2,290~4,259 | 14/14 |

> density·chapters·search는 registry 정본. 깊이 avg·min~max와 "구조 산출물" 분모는 `chapters/*.md` 본문 측정값(부록 제외). chapters 열은 registry `chapterCount`(manifest 기준, 일부 부록 포함)라 측정 본문 파일 수와 다를 수 있다. 깊이는 incubate ~3,000자 vs growth/flagship ~7,000~12,000자로, 의도된 lighter-track 차이다.
>
> **Update (2026-06-09 · 2026-06-10):** EuTm는 이후 growth/mature로 승급(15장 / 260 entries / density 17.3, registry 정본, verifiedOn 2026-06-09 · factsReviewedOn 2026-06-10). 위 표는 2026-06-08 스냅샷이라 EuTm 행의 tier/lifecycle(validate/beta)·본문 깊이 컬럼은 승급·재측정 전 값이다.
>
> **Update (2026-06-28):** UsaTm도 이후 growth/mature로 승급(15장 / 203 entries / density 13.5, claim-map 12건, verifiedOn/factsReviewedOn 2026-06-28). 위 표의 UsaTm 행은 승급·재측정 전 dated snapshot으로만 읽는다.

## 4. 콘텐츠 갭 — 3축 (갭 심각도 · 계약 위반 · 정본 실행순서)

> 진단일 뿐이며 이 메모에서 실행하지 않는다. 실행 시 워크스페이스 소스만 수정하고 `content:<guide>`로 재생성한다(**generated JSON 직접 수정 금지**).

| 갭 심각도 | 갭 | 근거 | 계약 위반? | 정본 실행순서 |
|---|---|---|---|---|
| **1 — 실재 · in-scope · 저위험** | `factsReviewedOn` 미기록 + fact-log **기록 적격성 검토** | `registry.factsReviewedOn`은 7개 전부 미기록 → `health:report` Fact-Review가 전부 `unrecorded`. 워크스페이스 fact-log엔 날짜가 있으나(§5) `factsReviewedOn` 계약(핵심 claim의 실제 1차 출처 재대조일)에 부합하는지는 **검토 필요** | 아님(advisory 필드) | 해당 없음(provenance) |
| **2 — 실재 · 가드** | UKTm / JapTm **search-entry 플로어** | beta는 density ≥9.0 → search-entry floor = chapters×9: **UKTm ≥126**(현재 128, 여유 2) · **JapTm ≥135**(현재 145, 여유 10). 그 아래로 떨어지면 월간 scorecard에서 beta 기준 미달(자동 강등은 없음) | 아님(회귀 가드) | UKTm · JapTm |
| **3 — 조건부 · 근거 필요** | length 아웃라이어(UsaTm Ch10/11/12·Ch03, JapTm Ch12, EuTm Ch14 등 최단 챕터) | UTF-8 최단(예: UsaTm Ch11 1,667자) | **아님** — 구조화 산출물 선택 계약 + #61 anti-padding(이미 표 완비) | UsaTm · JapTm |

- **갭1 처리 경로(진단↔후속 연계).** 먼저 워크스페이스 fact-log의 날짜가 `factsReviewedOn` 계약(핵심 claim 1차 출처 재대조)에 부합하는지 **provenance/적격성 검토**가 필요하다(날짜 형식이 검증 기준일·per-claim Verified 등 제각각). 적격하면 registry에 표면화한다. 이후 2026-06-28 UsaTm은 claim-map adoption과 `factsReviewedOn` 표면화까지 완료했다. 남은 Phase 4 lighter-track adoption은 UKTm·JapTm 중심으로 읽는다.
- **갭2 search-entry 회귀 가드.** UKTm·JapTm은 **현재 beta 충족**(UKTm 128≥126, JapTm 145≥135)이다. lifecycle은 **자동 강등되지 않으며** 월 1회 scorecard 리뷰에서만 조정되고 grandfathered status도 허용된다([`../PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md)). 따라서 이 갭은 "추가"가 아니라 **search-entry 회귀 가드**다 — 편집으로 검색 엔트리를 floor(UKTm 126 / JapTm 135) 아래로 떨구지 않는다. 거꾸로 밀도를 올리려 본문을 늘리는 패딩은 **#61의 anti-padding 취지와 상충**하므로 하지 않는다.
- **갭3 처리 규칙.** 분량만으로 보강하지 않는다. **구체적 reader-action 누락이 입증될 때만** 좁게 보강한다. #61(`2707b31`)은 보강 세트를 ch02·08·13·14로 두고 "**ch10·11: 이미 표 2개씩 완비 → 보강 제외(패딩 방지)**"라고 명시했다. **EuTm 후반 운영장은 계약상 전면 확장 불가**(controlled EU+UK scope 내 좁은 operational note만).
- **제외(보충 불필요).** UKTm(분량은 최소지만 표 3~7개 + 템플릿 부록 5종으로 의무 계약 충족), ChaTm·MexTm·LatTm(mature·깊음·표 풍부).

## 5. Fact freshness 3분리 (registry 기록 / workspace log 최신일 / 정합성)

| 가이드 | `registry.factsReviewedOn` | workspace fact-log 최신 날짜 | 기록 적격성 |
|---|---|---|---|
| LatTm | 미기록 | 2026-03-27 | 검토 필요 |
| MexTm | 미기록 | 2026-06-01 | 검토 필요 |
| ChaTm | 미기록 | 2026-06-01 | 검토 필요 |
| UKTm | 미기록 | 2026-05-12 | 검토 필요 |
| UsaTm | 미기록 | 2026-04-03 | 검토 필요 |
| JapTm | 미기록 | 2026-03-31 | 검토 필요 |
| EuTm | 미기록 | per-claim `Verified`(단일 날짜 없음) | 검토 필요 |

> `registry.factsReviewedOn` 미기록은 stale을 뜻하지 않는다([`../scripts/health-report.ts`](../scripts/health-report.ts): `unrecorded` = "아직 1차 출처 재대조 기록이 없다", registry 필드 기준). 워크스페이스 fact-log엔 날짜가 있으나, `factsReviewedOn` 필드 계약은 **"핵심 claim을 실제 1차 출처와 재대조한 날짜"**다. log의 날짜 형식이 제각각(검증 기준일·per-claim Verified 등)이라 이 계약에 부합하는지 단정할 수 없으므로, 이 갭은 **확정 drift가 아니라 "provenance/기록 적격성 검토 필요"**로 본다.
>
> **이는 Gating/Execution과 무관한 advisory 트랙이다 — 반드시 고쳐야 하는 게이팅 항목이 아니라, 적격성 검토 후 registry 표면화를 정합화하는 작업이다.**

## 6. Scope / 가드레일 + 재현

**Scope.** 이 메모는 진단까지다. 콘텐츠 증량은 하지 않는다. 2026-06-28 현재 UsaTm 관련 factual-QA follow-through는 완료됐으므로, 남은 factual-QA roadmap Phase 4는 UKTm·JapTm adoption 중심으로 읽는다. 갭2 search-entry 회귀 가드·갭3 조건부 보강은 별도 승인 후 진행한다. lifecycle은 월 1회 scorecard 리뷰에서만 조정되며 자동 강등/승급하지 않는다. [`current-ops-taskboard.md`](current-ops-taskboard.md)의 Do Not Touch(신규 국가·pricing·새 파이프라인·의존성·generated JSON 수동수정)는 그대로 적용된다.

**재현 명령.**

```bash
export LC_ALL=en_US.UTF-8                 # wc -m은 locale에 따라 달라짐 — UTF-8 명시 필요
for w in LatTm MexTm ChaTm EuTm UsaTm JapTm UKTm; do
  for f in $(find "$w/content/source/chapters" -name '*.md' | sort); do
    chars=$(LC_ALL=en_US.UTF-8 wc -m < "$f" | tr -d ' ')
    tbl=$(grep -cE '^\s*\|[ :|-]*-{2,}' "$f")          # 표
    cbx=$(grep -cE '^\s*[-*] \[[ xX]\]' "$f")           # 체크박스
    cklst=$(grep -cE '^#{2,6}.*(체크리스트|점검|보드|매트릭스|checklist|board|matrix)' "$f")  # 체크리스트/보드 섹션
    echo "$w/$(basename $f) chars=$chars tbl=$tbl cbx=$cbx cklst=$cklst"
  done; done
```

> **게이트 주의.** `npm run check:consistency`는 이 메모를 스캔하지 않으므로(advisory 스캔 대상은 `docs/buyer-narrative.md`로 한정) 그 결과가 메모 정확성을 증명하지 않는다. 메모 수치는 위 재현 명령으로만 검증한다. 루트 필수 게이트(`npm run test`, `npm run build`)는 Node 22에서 실행한다.

이 메모는 dated snapshot이다. 후속 조치가 실행되면 상단 `As of`와 §4 갭 표를 갱신하거나 closeout 마킹한다.
