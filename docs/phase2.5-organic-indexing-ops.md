# GloTm Phase 2.5 — Organic Indexing & Measurement Ops (owner runbook)

이 문서는 **Phase 2.5(프로모션 없는 유기 색인 운영)의 owner 전용 작업**을 매월 같은 기준으로
실행하기 위한 운영 런북이다. "무엇이 우선인가/현재 phase"의 정본은 아니다 — 그 값은 아래 authority를
본다. 여기서는 **owner가 콘솔·브라우저로 직접 해야 하는 단계**만 다룬다.

## Authority & scope

- 현재 phase·우선순위: [`../PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md) (Phase 2.5)
- owner 전용 검증 경계(정책): [`../Harness/Hermes-Operating-Charter.md`](../Harness/Hermes-Operating-Charter.md) `owner 전용 검증`
- KPI sheet 정본: [`portfolio-scorecard.md`](portfolio-scorecard.md), 월간 잠금: [`monthly-review-template.md`](monthly-review-template.md)
- GA 런타임 배선: [`../src/analytics/ga.ts`](../src/analytics/ga.ts), deploy 주입: `../.github/workflows/deploy-pages.yml`(`vars.VITE_GA_MEASUREMENT_ID`)

**Ownership boundary**: 이 런북의 §1~§4는 **owner 전용**이다(§5 brief material sweep은 예외 — 콘솔 접근이 필요 없다). Hermes(P2 advisor·bounded slug)는
계정·콘솔 접근이 없어 실행 불가, Checkout coding agent(Claude Code)도 SC/GA4 콘솔은 직접 못 만진다.
agent가 도울 수 있는 범위는 §0의 read-only 라이브 검증과 라이브 자동 스모크까지다.

## §0. Production readiness snapshot (2026-06-28 기준, read-grounded)

배포 surface는 이미 색인·계측 준비가 끝나 있다. 매월 §1 전에 아래를 read-only로 재확인한다.

| 항목 | 상태 | 재확인 명령 (read-only) |
|------|------|-------------------------|
| sitemap | live, **147 URL** (2026-08-24 로컬 release 산출 기준) | `curl -s https://ywkinfo.github.io/glotm/sitemap.xml \| grep -c '<loc>'` → 147 |
| robots | `/glotm/robots.txt`는 존재하지만 host-root `https://ywkinfo.github.io/robots.txt`는 404 | `curl -I https://ywkinfo.github.io/robots.txt`; `curl -s https://ywkinfo.github.io/glotm/robots.txt` |
| GA4 배선 | 배포 번들에 `G-0XF5JG96CC` + gtag 인라인 | 홈 HTML의 `assets/index-*.js`를 받아 `G-0XF5JG96CC` grep |
| 이벤트 코드 | manual page_view + 6 KPI 이벤트 emit·테스트 통과 | `npm run test`(unit), `e2e:smoke`(흐름) |

> **중요**: 로컬 build에는 GA env var가 없어 GA가 안 들어간다(의도된 동작). **GA 검증은 반드시 라이브
> 배포본에서** 한다. GA id를 바꾸려면 owner가 GitHub repo variable `VITE_GA_MEASUREMENT_ID`를 갱신하고
> 재배포해야 한다(코드 변경 아님).

### sitemap URL 인벤토리 (147 = SC 색인 대상, 2026-08-24 기준)

| 그룹 | 수 | 우선 색인 |
|------|----|-----------|
| Gateway 홈 `/` | 1 | ★ |
| guide 홈 (`/china /mexico /europe /latam /japan /uk /usa`) | 7 | ★ china·mexico·europe |
| 챕터 (latam 20 · china/europe/japan/mexico/usa/uk 15) | 110 | 대표 챕터 위주 |
| briefs (index 1 + issue 18) | 19 | ★ 최신 3개호 위주 |
| reports (index 1 + detail 6) | 7 | ★ 대표 report 2건 |
| trust/legal (`/legal /privacy /contact`) | 3 | — |

> brief 행은 `src/briefs/archive.ts`의 `briefIssues` 개수 + 아카이브 1이므로 **이슈를 발행할 때마다 총계가 1씩 는다**.
> 이 표의 숫자가 live sitemap과 어긋나면 정본은 언제나 live sitemap이다(재확인 명령은 위 §0 표).

## §1. Search Console (owner)

1. 속성 확인: `https://ywkinfo.github.io/glotm/` (GitHub Pages 도메인 prefix 속성).
2. **Sitemaps**에서 `https://ywkinfo.github.io/glotm/sitemap.xml` 제출/갱신 → status `Success` 확인. discovered 수는 위 인벤토리 표(현재 147)와 대조한다.
3. **Pages(Indexing)** 리포트에서 색인/미색인 분포 확인. 미색인 사유(crawled-not-indexed, discovered 등) 분류.
4. 우선 URL을 **URL 검사 → 색인 요청**: Gateway 홈, `/china`·`/mexico`·`/europe` 홈, 각 대표 챕터,
   최신 brief 3건(`src/briefs/archive.ts`의 상위 3개 — 월을 고정하지 않는다), 대표 report 2건(monthly-review `Primary reports`).
5. 결과(색인 개수·요청 URL)를 월간 리뷰 Organic 섹션에 기록.

### Search Console troubleshooting

- **Sitemap server health와 SC 처리 상태를 분리한다.** `https://ywkinfo.github.io/glotm/sitemap.xml`가
  `HTTP 200`, `content-type: application/xml`, 인벤토리 표와 같은 수의 `<loc>`(현재 147)를 반환하면 배포 산출물은 정상이다. SC의
  `가져올 수 없음`·`discovered 0`는 수동 제출 직후 1~3일 지연될 수 있다.
- **Googlebot은 robots.txt를 host root에서만 읽는다.** 현재 GitHub Pages path deploy에서는
  `https://ywkinfo.github.io/robots.txt`가 404이고, `https://ywkinfo.github.io/glotm/robots.txt`는
  존재해도 crawler의 robots discovery에는 쓰이지 않는다. 404 robots는 crawl block이 아니지만,
  `/glotm/robots.txt`의 `Sitemap:` 디렉티브는 자동 발견 신호가 아니다.
- 그래서 이 phase의 정답 경로는 **Search Console URL-prefix 속성에서 sitemap을 수동 제출**하는 것이다.
  1~3일 후에도 실패가 유지되면 속성이 `https://ywkinfo.github.io/glotm/` URL-prefix인지 먼저 확인한다.

## §2. GA4 DebugView (owner)

property id **`G-0XF5JG96CC`** 기준. **라이브 배포본**에서만 검증된다.

1. GA4 → **DebugView** 활성화(Google Analytics Debugger Chrome extension을 해당 GitHub Pages 탭에서 ON),
   라이브 `/glotm/` 접속 후 새로고침.
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

### GA4 DebugView troubleshooting

- **GA 수신과 DebugView 수신은 다르다.** live `POST https://www.google-analytics.com/g/collect?...&en=page_view`
  가 `204`를 반환하면 GA가 hit를 받은 것이다. Realtime·홈 카드에 sessions/events가 보이면 계측은 동작 중이다.
- **DebugView는 debug hit만 보여준다.** production runtime은 `src/analytics/ga.ts`에서
  `gtag("config", id, { send_page_view: false })`만 설정한다. production 코드에 `debug_mode:true`를 넣지
  않는다. 전 트래픽이 debug stream으로 오염되기 때문이다.
- DebugView가 `디버그 기기 0`이면 우선 collect URL에 `_dbg=1` 또는 debug parameter가 붙는지 본다.
  붙지 않으면 Google Analytics Debugger extension이 그 탭에서 켜져 있지 않은 것이다.
- extension 없이 검증해야 할 때는 **Realtime → Event name별 이벤트 수**로 6 KPI 이벤트를 확인한다.
  이 경우 DebugView가 0이어도 GA 계측 실패를 의미하지 않는다.

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

## §5. Brief material sweep (owner 또는 checkout agent)

브리프 lane은 이 phase의 신선도 surface다. 그 lane에 소재를 대는 발굴 절차는
[`briefs-discovery.md`](briefs-discovery.md)가 계약이고, 여기서는 월 1회 실행 훅만 건다.

1. `npm run briefs:radar` 실행. `Source Sweep`의 `주기 초과` 소스가 이번 회차 대상이다.
2. 그 소스들을 실제로 열고, 소재가 나오면 `src/briefs/discovery.ts`의 `briefCandidates`에 후보를 추가한다.
3. 산출이 없어도 `briefSweepLog`에 회차를 append한다.
4. 결과를 [`monthly-review-template.md`](monthly-review-template.md)의 `Brief discovery check`에 기록한다.

> 이 절은 §1~§4와 달리 콘솔 계정 접근이 필요 없어 checkout agent도 수행할 수 있다.
> 다만 발행 여부와 법률 사실 판단은 계속 owner 몫이다.

## Monthly quick checklist

- [ ] §0 readiness 재확인(sitemap 147 / robots / GA id)
- [ ] §1 SC: sitemap status + 색인 분포 + 우선 URL 색인 요청(host-root robots 404는 block 아님)
- [ ] §2 GA4 DebugView: debugger extension ON 상태에서 page_view + 6 KPI 이벤트 도착, 또는 Realtime 대체 확인
- [ ] §3 라이브 QA(agent 스모크 → owner 육안)
- [ ] §4 organic sessions 집계 → 월 100 트리거 대비 기록
- [ ] §5 `npm run briefs:radar` → 주기 초과 소스 sweep → `briefSweepLog` append → 월간 리뷰 기록
