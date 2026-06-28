# GloTm Phase 2.5 — Organic Indexing & Measurement Ops (owner runbook)

이 문서는 **Phase 2.5(프로모션 없는 유기 색인 운영)의 owner 전용 작업**을 매월 같은 기준으로
실행하기 위한 운영 런북이다. "무엇이 우선인가/현재 phase"의 정본은 아니다 — 그 값은 아래 authority를
본다. 여기서는 **owner가 콘솔·브라우저로 직접 해야 하는 단계**만 다룬다.

## Authority & scope

- 현재 phase·우선순위: [`../PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md) (Phase 2.5)
- owner 전용 검증 경계(정책): [`../Harness/Hermes-Operating-Charter.md`](../Harness/Hermes-Operating-Charter.md) `owner 전용 검증`
- KPI sheet 정본: [`portfolio-scorecard.md`](portfolio-scorecard.md), 월간 잠금: [`monthly-review-template.md`](monthly-review-template.md)
- GA 런타임 배선: [`../src/analytics/ga.ts`](../src/analytics/ga.ts), deploy 주입: `../.github/workflows/deploy-pages.yml`(`vars.VITE_GA_MEASUREMENT_ID`)

**Ownership boundary**: 이 런북의 §1~§4는 **owner 전용**이다. Hermes(P2 advisor·bounded slug)는
계정·콘솔 접근이 없어 실행 불가, Checkout coding agent(Claude Code)도 SC/GA4 콘솔은 직접 못 만진다.
agent가 도울 수 있는 범위는 §0의 read-only 라이브 검증과 라이브 자동 스모크까지다.

## §0. Production readiness snapshot (2026-06-28 기준, read-grounded)

배포 surface는 이미 색인·계측 준비가 끝나 있다. 매월 §1 전에 아래를 read-only로 재확인한다.

| 항목 | 상태 | 재확인 명령 (read-only) |
|------|------|-------------------------|
| sitemap | live, **139 URL** | `curl -s https://ywkinfo.github.io/glotm/sitemap.xml \| grep -c '<loc>'` → 139 |
| robots | `Allow: /` + `Sitemap:` 디렉티브 | `curl -s https://ywkinfo.github.io/glotm/robots.txt` |
| GA4 배선 | 배포 번들에 `G-0XF5JG96CC` + gtag 인라인 | 홈 HTML의 `assets/index-*.js`를 받아 `G-0XF5JG96CC` grep |
| 이벤트 코드 | manual page_view + 6 KPI 이벤트 emit·테스트 통과 | `npm run test`(unit), `e2e:smoke`(흐름) |

> **중요**: 로컬 build에는 GA env var가 없어 GA가 안 들어간다(의도된 동작). **GA 검증은 반드시 라이브
> 배포본에서** 한다. GA id를 바꾸려면 owner가 GitHub repo variable `VITE_GA_MEASUREMENT_ID`를 갱신하고
> 재배포해야 한다(코드 변경 아님).

### sitemap URL 인벤토리 (139 = SC 색인 대상)

| 그룹 | 수 | 우선 색인 |
|------|----|-----------|
| Gateway 홈 `/` | 1 | ★ |
| guide 홈 (`/china /mexico /europe /latam /japan /uk /usa`) | 7 | ★ china·mexico·europe |
| 챕터 (latam 20 · china/europe/japan/mexico 15 · uk/usa 14) | 108 | 대표 챕터 위주 |
| briefs (index 1 + 최신 issue 13) | 14 | ★ 최신 `2026-06-*` 3건 |
| reports (index 1 + detail 5) | 6 | ★ 대표 report 2건 |
| trust/legal (`/legal /privacy /contact`) | 3 | — |

## §1. Search Console (owner)

1. 속성 확인: `https://ywkinfo.github.io/glotm/` (GitHub Pages 도메인 prefix 속성).
2. **Sitemaps**에서 `https://ywkinfo.github.io/glotm/sitemap.xml` 제출/갱신 → status `Success`·discovered 139 확인.
3. **Pages(Indexing)** 리포트에서 색인/미색인 분포 확인. 미색인 사유(crawled-not-indexed, discovered 등) 분류.
4. 우선 URL을 **URL 검사 → 색인 요청**: Gateway 홈, `/china`·`/mexico`·`/europe` 홈, 각 대표 챕터,
   최신 brief 3건(`2026-06-*`), 대표 report 2건(monthly-review `Primary reports`).
5. 결과(색인 개수·요청 URL)를 월간 리뷰 Organic 섹션에 기록.

## §2. GA4 DebugView (owner)

property id **`G-0XF5JG96CC`** 기준. **라이브 배포본**에서만 검증된다.

1. GA4 → **DebugView** 활성화(GA Debugger 확장 또는 `?_dbg`), 라이브 `/glotm/` 접속.
2. **page_view**: 라우트 이동(홈→guide→챕터)마다 `page_view`가 `page_path`와 함께 1건씩 도착하는지 확인
   (SPA manual 발사 — `send_page_view:false`).
3. **6 KPI 이벤트**를 각 트리거 동작으로 1건씩 실발사 확인:

   | event | 트리거 동작 |
   |-------|-------------|
   | `guide_cta_click` | Gateway/guide의 guide CTA 클릭 |
   | `report_open` | report 카드/링크 열기 |
   | `report_handoff_click` | Gateway report handoff CTA |
   | `report_guide_click` | report 상세 → guide deep link |
   | `brief_issue_open` | brief 이슈 열기 |
   | `operator_link_click` | operator/legal 링크 클릭 |

4. (`priority_cta_click`은 런타임 유지·KPI sheet 제외 — 검증 선택.)
5. 도착/누락을 월간 리뷰 KPI sheet check에 기록.

## §3. Live interactive QA (owner 육안 + agent 사전 스모크)

로컬 `e2e:smoke`(28 pass)가 같은 흐름을 보호하므로, owner는 **라이브 배포본 육안 최종 확인**만 한다.
Checkout agent가 라이브 headless 스모크로 사전 점검할 수 있다(콘솔 에러·broken nav diff).

확인 흐름: Gateway 로드 → guide 진입 → 챕터 → 검색 → continue reading 복귀 → report·`/legal`·`/privacy`
네비게이션 → mobile drawer close/Escape.

## §4. Organic measurement cadence — 월 100 유기방문 트리거 (owner)

- 월 1회 GA4에서 **organic sessions**(또는 유기 유입 page_view)를 집계해 **월 100 유기방문** 대비 기록.
- 이 트리거(또는 은퇴 6개월 전)가 도달하면 Phase 3(이메일 게이트) 판단으로 넘어간다
  (`../PROJECT-OVERVIEW.md` Phase 2.5/3).
- 기록 위치: [`monthly-review-template.md`](monthly-review-template.md) → `Organic indexing & measurement check`.

## Monthly quick checklist

- [ ] §0 readiness 재확인(sitemap 139 / robots / GA id)
- [ ] §1 SC: sitemap status + 색인 분포 + 우선 URL 색인 요청
- [ ] §2 GA4 DebugView: page_view + 6 KPI 이벤트 도착
- [ ] §3 라이브 QA(agent 스모크 → owner 육안)
- [ ] §4 organic sessions 집계 → 월 100 트리거 대비 기록
