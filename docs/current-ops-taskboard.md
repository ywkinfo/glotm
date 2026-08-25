# GloTm Current Ops Taskboard

이 문서는 현재 로컬 위원회 합의안을 실행 보드 형태로 정리한 supporting doc이다.
현재 phase, 우선순위, 명령, 검증 계약의 authority는 계속 `../PROJECT-OVERVIEW.md`, `../README.md`, `../ARCHITECTURE.md`를 기준으로 본다.

## Snapshot

- Last updated: 2026-08-25 (2회차)
- Current phase: `Phase 2.5 — 프로모션 없는 유기 색인 운영 (배포·색인·계측 + 정합성 유지)`
- Locked priority order: `ChaTm -> MexTm -> EuTm -> Report / Gateway -> UsaTm -> JapTm -> UKTm`
- Current rule of thumb: 새 확장(신규 국가·pricing·새 파이프라인·의존성)은 멈추되, 정합성·verification provenance 유지에 더해 프로모션 없는 유기 색인·계측을 현재 운영 범위로 본다.
- `2026-07-04` shared root gate(`content:prepare`, `health:runtime`, `health:content`, `health:release`, `health:report`) 재현 통과
- Brief archive provenance: 개별 브리프는 운영 문서에 인벤토리하지 않고 런타임 `src/briefs/archive.ts`를 정본 인벤토리로 본다. lane cadence·provenance·publish 게이트 계약은 `briefs-lane.md`, 구조 강제(최신호 락 포함)는 `src/briefs/archive.test.ts`를 기준으로 본다.
- 2026-06 라운드 반영: ChaTm·MexTm claim freshness 갱신(#57), 월간 리뷰 verifiedOn 2026-06-02 re-stamp(#58), UsaTm 저밀도 장 operating table·checklist 보강(#61), EuTm growth/mature 승급(15장·부록·claim-map 10건·2026-06-10 법률 사실정정, #69/#70), UsaTm growth/mature 승급(15장·검색 엔트리 206개·claim-map 15건·2026-06-29 fact-review/full-QA). UKTm은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급된 registry 정본이며, 이 보드 Next Lane의 이전 `pilot / smoke QA` 표기를 그 정본에 맞춰 동기화했다. 과거 registry drift 정합 기록은 아래 `Resolved Drift Archive` 섹션에 보존한다.
- 2026-07 라운드 반영: `JapTm` growth/mature/full 승급(결정 2026-06-29 owner override · 머지 2026-06-30 #114 — 로그는 `monthly-review-template.md`)과 검증날짜·claim-map sourceId 정합 후속(2026-07-01 #115)을 정본으로 반영. 2026-07-04 월간 리뷰에서 shared root gate 재현 후 전 가이드 `verifiedOn`을 2026-07-04로 re-stamp(lane freshness, fact-review 아님). Next Lane의 이전 `JapTm` `145 / incubate / beta / standard` 표기는 승급 이전 잔재라 registry 정본에 맞춰 동기화했다.
- 2026-07-06 신규 리포트: 교차 관할 `global-goods-services-class-framework`(지정상품·류 설계) 추가 후 머지·Pages 배포(#118). publishedAt 2026-07-06으로 Gateway featured lead 진입 → featured 2 = 지정상품 설계 + 한글 표장, `gatewaySectionSummary` 예시 문구도 이에 맞춰 변경. 시의성 사실(2025 USPTO 수수료·2027 중국 개정 상표법·판례) 다수라 owner 사실 attestation은 후속 과제로 남긴다. buyer-narrative/monthly-review-template의 primary report 스냅샷은 새 featured 쌍으로 동기화(이 커밋).
- 2026-07-07~11 라운드 반영: 리포트 본문 nice-class 범위 렌더 정정·미커버 관할 제거(#120), `UKTm` growth/mature/full 승급(#121 — 다중 포럼 집행 오케스트레이션 15장·claim-map 11건·density 183·UK 수수료 £205/£245 EuTm 정합, owner override) + 잔여 beta/incubate 참조 docsync(#122), E-E-A-T JSON-LD 구조화데이터·reader provenance 표면화(#123, 챗봇 부결 대안). 후속 승급 정합(2026-07-11): `china.tsx` draft notice 제거, Gateway 빈 Incubate 카드 가드, `health.ts` UKTm lane incubate-pack→uk-growth, `health-report.ts` research coverage에 JapTm·UKTm 편입, README/ARCHITECTURE/phase1-runtime-qa의 JapTm shortcut·UKTm incubate 표기를 package.json `health:content`(Cha·Mex·Eu·Usa·Jap·UK workspace-local 포함, LatTm 루트-only) 진실로 정합.
- 2026-07-21~22 라운드 반영: UK/CN/MX claim-freshness 재검증(1차출처 재대조 + adversarial skeptic). UKTm claim-map 10건이 mature 60일 window를 초과(gate=warn·staleHighRisk 7)했던 상태를 해소 → 전 워크스페이스 `audit:facts` gate=pass·staleHighRisk 0. 실제 정정 2건: **UK-DRS-001**(2026-07-07 `.uk` DRS 신규 신청 WIPO 이관·공식명 'Dispute Resolution Service' — 본문 Ch11·claim-map·source register)과 **MX-FEE-001**(등록 후 3년차 실사용 선언 서식은 `IMPI-00-002`가 아니라 `IMPI-00-014` — HIGH 리스크 정정, 본문 Ch04/05/07/13/부록·claim-map·fact log). 본문 명확화 2건: UK 갱신 출원일 기산(TMA §40(3)) Ch07, comparable UK mark 2026-01-01 EU사용 불인정 Ch08. 2026-07-22 owner 종결: UKIPO 수수료를 온라인 출원 £205 / 갱신 £245 / 추가 클래스당 £60으로 확정, UK/CN/MX `factsReviewedOn`을 실제 재대조일로 표면화, 중국 개정 상표법 2027-01-01 시행(이의 3→2개월·조문/기관명 변경)을 ChaTm 본문에 forward-dated note로 반영. 실제 rule flip은 2027-01-01 시 후속 시행지침·경과규정과 함께 재검증한다.

- 2026-08-02 라운드 반영: 브리프 lane에 **정정(supersession) 장치** 도입. 직전 릴리스(#51219a0)가 가이드 본문의 stale legal guidance는 막았지만, Phase 2.5가 "신선도 surface"로 지정한 브리프 lane에는 정정 경로가 없었다. 실제로 2026-06-09 중국호는 `공포일·시행일 미확인`을 그대로 서술하는데 2026-07-11 중국호가 이를 정정(2026-06-26 공포·2027-01-01 시행 확정)하고 있었고, 정정은 **뒤 → 앞 방향으로만** 존재해 검색으로 6월호에 도착한 독자에게는 닿지 않았다. `BriefIssue.supersededBy{slug, updatedAt, note}`를 신설해 이슈 상단 고지·아카이브 카드 배지·prerender HTML 본문 앞에 노출하고, `lastModified`/JSON-LD `dateModified`를 `updatedAt`으로 갱신해 재크롤 신호를 남긴다. 본문 소급 수정은 하지 않는다(발행일 시점 사실 보존). 함께 잠근 것: `archive.test.ts`가 `relatedGuideLinks`를 registry live 경로와 대조(기존에는 `startsWith("/")`만 검사해 `briefs-lane.md`의 문서 약속보다 게이트가 약했다), phase2.5 런북 sitemap 인벤토리 `143`→`145`·brief 행 `15`→`17` 실측 정합 + SC 색인요청 대상의 `2026-06-*` 월 하드코딩 제거, monthly-review-template의 `discovered 139` 하드코딩 제거. 게이트: `npm test` 265/265, `health:runtime` e2e 28 pass, `health:release` prerender 145 routes + `test:seo` 12 pass, `check:consistency` 0/0, `audit:facts` 6/6 pass.

- 2026-08-02 후속 라운드: **리포트 링크 무결성**. 라이브 실측에서 리포트 6개 중 4개 페이지에 **404 앵커 17건**이 확인됐다(`global-filing-priority` 7 · `global-goods-services-class` 6 · `brand-localization` 3 · `global-filing-route` 1). 전부 Pages subpath(`/glotm/`) 누락으로, `https://ywkinfo.github.io/latam`은 404지만 `/glotm/latam`은 200이었다 — 대상은 멀쩡하고 링크만 틀렸다. 원인은 소스 markdown의 root-relative 링크였고, 이를 나머지 리포트 2개가 이미 쓰던 절대 URL 관례로 통일했다. **이 결함이 게이트를 통과한 이유**: 2026-07-20에 추가한 `contentLinks.test.ts` 절대-앵커 가드가 `liveShellProducts`(가이드 7개)를 돌며 `<이름>/content/generated/`만 찾는데, Reports는 `liveShellProducts`에 없고 생성물도 `Reports/generated/<slug>/`에 있어 **구조적으로 검사 대상이 아니었다**. 리포트 6개를 같은 규칙에 편입했다. 함께 발견·수정: `src/reports/registry.ts`의 EuTm deep link 2건이 존재하지 않는 앵커(`#launch-wave-기준으로-우선순위를-나눈다`)를 가리켰고 실제 heading id는 `launch-wave--권리단위-우선순위-매트릭스`였는데, `registry.test.ts`가 깨진 href를 문자열 일치로 정답 고정하고 있었다. 재발 방지로 리포트·브리프의 모든 guide deep link(챕터 경로 + `#fragment`)를 생성된 heading id와 대조하는 검사를 신설했다. 게이트: `npm test` 273/273(기존 265 + 신규 8), `typecheck` pass, `health:runtime` e2e 28 pass, `health:release` 145 routes + `test:seo` 12 pass, `check:consistency` 0/0, `audit:facts` 6/6 pass, dist 리포트 root-relative 링크 17→0. 두 신규 가드는 위반 주입으로 실제 실패를 확인했다.
- 2026-08-02 3라운드: **신선도 검증 공백 닫기**(아래 ③의 일부). ⓐ `audit:facts`·`check:consistency`가 **어느 워크플로에도 없어** owner가 손으로 돌릴 때만 결과가 보였다 → `ci.yml`에 편입. `audit:facts`는 스키마·사실무결성 오류에서 exit 1로 실패하고 claim staleness는 warning이라 exit 0을 유지하므로, 문서상 advisory·non-gating 계약은 그대로다. ⓑ `scorecard.test.ts`의 registry 전수 lifecycle 가드가 시계를 2026-07-20에 고정한 describe 안에 있어 **`maximumVerificationFreshnessDays`(mature 120일)만 사실상 미검사**였다 → 실시계 describe로 분리하고, 실패 메시지에 `verifiedOn`·경과일·상한을 함께 찍는다(EuTm verifiedOn을 121일 전으로 바꿔 실제 실패 확인). ⓒ `health-report.test.ts`가 워크스페이스별 블록을 손으로 써서 **japan·uk의 research gate가 한 번도 단정된 적 없었다** → 6개 전수 루프로 교체 + 실시계 describe 신설(고정 시계에서는 claim freshness가 늘 "방금 검증됨"으로 계산돼 리포트 계산 경로 자체가 미검증이었다). ⓓ `health:report` Research Coverage에 **`Window Margin` 컬럼** 추가 — `48d`만으로는 여유를 알 수 없어 lifecycle staleness 창에서 뺀 잔여일(`6d left` 등)을 함께 표기한다(advisory, 게이팅 아님). 게이트: `npm test` 275/275, typecheck pass.
  - **정책 미변경(owner 판단 필요)**: claim staleness를 하드 게이트로 올리는 것은 이번에 하지 않았다. `buildResearchSummary`의 `effectiveHighRiskGapCount = max(registry.highRiskVerificationGapCount, unresolvedHighRiskGapCount)`로 **`staleHighRiskClaimCount`는 게이팅 지표에 입력되지 않으며**, `monthly-review-template.md`(fact-review = 게이팅 안 함)와 `factual-qa-rollout.md` 기준 9·10이 advisory-first를 명시적으로 잠가 뒀다. staleness는 `gate: "warn"`으로만 나타난다. 하드 게이트로 바꾸려면 두 문서의 계약을 함께 고쳐야 한다.
- 2026-08-02 날짜 정정: 앞의 두 라운드 기록과 산출물에 `2026-07-27`로 잘못 찍힌 날짜가 있었다(실제 작업일 2026-08-02). taskboard 항목·`phase2.5-organic-indexing-ops.md` 실측일·`contentLinks.test.ts` 주석, 그리고 **브리프 `supersededBy.updatedAt`(라이브 JSON-LD `dateModified`로 나가는 값)**을 2026-08-02로 정정했다. 이에 따라 EuTm claim 만료(2026-08-08)까지 남은 기간은 12일이 아니라 **6일**이다.
- 2026-08-02 4라운드: **EuTm claim 재검증**(60일 mature 창 2026-08-08/09 만료 대응). claim 10건 전부를 1차 출처로 재대조해 **10건 모두 변경 없음** 확인, 본문 정정 0건. 근거는 EUTMR 통합본(CELEX `02017R1001-20251201`, 2025-12-01 발효) 조문 직접 대조 — 제1조2항(unitary character)·제7조1항(b)(c)(d)·2항(일부 지역 적용)·제34조1항(우선권 6개월, 첫 출원일 기산)·제46조1항(이의 3개월)·제52조·제53조3항(10년·6개월·6개월 유예)·제58조1항(a)·2항(5년 불사용·부분취소)·Annex I item 2·12(각 EUR 850)·item 19(가산금 25%, 상한 EUR 1 500). UK 측은 GOV.UK `TM3 온라인 £205 / TM11 온라인 £245 / 갱신 추가류 £60`(개정일 April 2026)로 owner 정본과 일치. **신설 EU-UKUSE-001**: 재검증 중 교차 가이드 공백을 발견했다 — GOV.UK는 comparable UK mark의 5년 look-back 중 2021-01-01 이전 구간에만 EU 사용을 산입하므로 **2026-01-01부터는 EU 사용을 non-use 방어에 전혀 원용할 수 없는데**, `UKTm` 제8장은 2026-07-21 라운드에서 이를 반영했으나 EU+UK scope를 운영하는 `EuTm`에는 빠져 있었다. 제8장 `EU / UK 분기 캘린더` 하위 절과 부록 Evidence Card에 보강(검색 엔트리 260→261, registry·PROJECT-OVERVIEW 동기화). `factsReviewedOn` 2026-06-10 → **2026-08-02**, Window Margin `6d left` → `60d left`. 감시 항목으로 EU Customs Reform(2026-03-26 정치적 합의·미발효, Data Hub 2028→2031→2034)을 fact log에 기록하되 본문에는 반영하지 않았다. 부수 수정: `health-report.test.ts`의 실시계 테스트가 "EuTm이 가장 오래된 claim을 가진다"는 전제에 고정돼 재검증만 해도 깨지는 구조였다 → claim-map 원본에서 기대값을 계산해 대조하는 자기유지 형태로 교체(freshness 계산을 고정값으로 바꿔 회귀 검출 확인). 게이트: `npm test` 275/275, typecheck pass, `health:runtime` e2e 28 pass, `health:release` 145 routes + `test:seo` 12 pass, `check:consistency` 0/0(중간에 `search entry count 261 !== registry 260` 1건을 실제로 잡아냄), `audit:facts` 6/6 pass.
- 2026-08-03 라운드 반영: **브리프 소재 발굴 하네스**. 브리프 lane은 발행 이후(cadence 라벨·provenance·정정·publish 게이트)가 `briefs-lane.md` + `archive.test.ts`로 잠겨 있었지만 **그 앞단이 통째로 비어 있었다** — 어디를 보는지 목록이 없고, 봤지만 쓰지 않은 소재는 흔적이 남지 않으며, 마지막 발행 후 며칠인지 어떤 표면도 보여주지 않았다. 실측: 이슈 16건(2026-03-06~2026-07-20), 마지막 발행 후 14일, guide별 브리프 등장 격차(JapTm 55일·UsaTm 43일 vs EuTm/UKTm 14일), `jurisdictions` 자유 문자열의 `UK`↔`United Kingdom` 어휘 드리프트. 각 워크스페이스에는 `content/research/*_source_register.md` 선례가 있는데 브리프 lane에만 없었다. 신설: `src/briefs/discovery.ts`(소스 등록부 15건 + 후보 백로그 + sweep 로그 정본), `src/briefs/discoveryReport.ts`(cadence·backlog·커버리지·sweep 파생 계산), `src/briefs/discovery.test.ts`(`brief discovery contract`), `scripts/briefs-radar.ts` + `npm run briefs:radar`(advisory 리포트, 항상 exit 0), `docs/briefs-discovery.md`(upstream 계약). 시드 후보 4건은 전부 저장소에 이미 기록돼 있던 감시 항목이다(K-브랜드 정부인증 8월 말 시행·중국 개정법 후속 시행규정·EU Customs Reform·`EU-UKUSE-001`) — 새 법률 사실을 만들지 않았고, 소스 URL도 기존 research 기록의 값이나 그 origin만 썼다. 관할 어휘는 기존 이슈를 소급 수정하지 않고 집계 시 정규화하며, 강제는 도입일(2026-08-03) 이후 발행 이슈부터 적용한다. 주기성은 새 워크플로 없이 ci.yml advisory 스텝 + 월간 리뷰 `Brief discovery check` + phase2.5 런북 §5에 걸었다. **cadence는 하드 게이트로 올리지 않았다** — `briefs-lane.md`의 hard SLA 없음 계약이 그대로다. 게이트: `npm test` 296/296(기존 275 + 신규 21), `typecheck` pass, `health:runtime` typecheck+test:runtime 240 pass, `health:release` 145 routes + `test:seo` 12 pass, `check:consistency` 0/0, `audit:facts` 6/6 pass, dist에 발굴 데이터 유입 0건. 위반 주입 7건(미등록 sourceId·publishedAs 누락·비live slug·droppedReason 누락·백로그 우회 발행·관할 태그 누락·관할 primary 소스 소멸)이 각각 실제로 실패하는 것을 확인했고, 그중 커버리지 바닥 검사는 1차 작성본이 KIPO·WIPO의 전체 slug 때문에 **영원히 통과하는 가짜 게이트**여서 관할 대조까지 넣어 고쳤다.
  - **2026-08-07 리뷰 대응(#134)**: owner 리뷰가 "계약이 말로만 있고 강제되지 않는 지점" 6개를 지적했고 전부 사실이었다. ① **관할 어휘가 게이트가 아니었다** — 검사에 별칭 정규화(`getCanonicalJurisdictions`)를 써서 애초 문제였던 `UK`·`EU`가 신규 데이터에서도 통과했다. `isCanonicalJurisdiction`(literal)을 신설해 게이트와 집계 경로를 분리했다. ② **부트스트랩 sweep이 가짜 freshness를 만들었다** — note에는 "실사가 아니다"라고 적고 리포트는 7개 소스의 마지막 sweep으로 계산했다. `BriefSweep.kind`(`verified` / `repository-backfill`)를 신설해 backfill을 freshness에서 제외했고, 2026-08-07 시점 radar는 15개 소스 전부를 `실사 이력 없음`으로 표시했다(그 시점의 사실). ③ **event-driven 소스가 영원히 안 보였다** — `never-verified` 상태를 cadence와 무관하게 표시하고, event-driven 소스에 `reviewTrigger`를 필수화했다. ④ **런타임 격리 정규식이 허술했다** — 큰따옴표 정적 import만 잡고 경로 prefix로 스킵해 동적 `import()`와 `discoveryWidget.tsx`가 통과했다(대조 실험으로 실제 누락 확인). `ts.preProcessFile` 기반 import 그래프로 교체했다. ⑤ **후보–sweep 계보가 느슨했다** — `relatedProductSlugs` 최소 1개, `trigger` 날짜 토큰, 비-dropped의 `droppedReason` 금지, sweep 산출 후보의 소스 교집합·날짜 순서, `briefDiscoveryStartOn` pin 테스트를 추가했다. ⑥ **넓은 루트 URL** — `sweepTarget`(무엇을 보면 sweep 완료인가) 필수 필드를 신설했다. 정확한 뉴스·공고 페이지 URL 확정은 owner 핸드오프로 남긴다(에이전트 세션은 외부 egress가 차단돼 페이지 실재 **미검증**). 추가로 advisory 경계를 명문화했다: 지표는 CI를 붉히지 않지만 스크립트 실행 실패는 여전히 스텝을 실패시킨다. 게이트: `npm test` 299/299, `typecheck`·`typecheck:runtime` pass, 위반 주입 10건 각각 실패 확인 + backfill→verified 전환 시 freshness가 되살아나는 동작 확인.
  - **2026-08-07 3차(런타임 격리 가드 마무리, #134)**: 2차 가드는 `src/**`의 **직접 import만** 봤다. 세 구멍이 실측으로 확인됐다. ⓐ **재귀가 없어 bridge 경유를 놓쳤다** — 이 저장소에는 `scripts/prerender.ts → scripts/seo.ts → src/*` 경로가 실재하고 그 산출물이 prerender HTML로 나간다(주입 실험: `seo.ts`에 discovery import를 넣으면 신규 가드는 실패하고 구 src-스캔은 통과했다). ⓑ **`./discovery.js` 형태를 놓쳤다**(Bundler 해상도 + TS 5.9는 이를 `.ts`로 해석한다). ⓒ **`import.meta.glob`이 검사 밖이었다.** 해결: `scripts/module-graph.ts`(AST 수집 + `ts.resolveModuleName` 재귀 순회, parents 체인 보존)와 `scripts/module-boundary.test.ts`를 신설했다. 진입점은 하드코딩하지 않고 `index.html`의 module script와 `build:pages`의 스크립트에서 **도출**하며(둘 중 하나라도 늘면 실패), tsconfig는 필드 비교가 아니라 `tsconfig.app.json`·`tsconfig.node.runtime.json`을 각각 파싱해 쓴다. 실패 시 `prerender.ts → seo.ts → discovery.ts` 체인을 출력한다. glob·비리터럴 동적 import는 fail-fast(주석 안 문자열은 AST 검사라 오탐 없음), Vite query import는 쿼리를 떼고 해석해 TS 모듈이면 진짜 간선으로 잡고 에셋이면 무시한다(`src/content/intro.ts`의 `.md?raw`가 실제 사례). **배선 정정**: dist 검사를 vitest 파일로 두면 clean runner에서 `test:runtime`(dist 없음) 시점에 돌고 빌드 후에는 다시 돌지 않아 사실상 실행되지 않는다 → `scripts/check-dist-boundary.ts` CLI로 만들어 `health:release`를 `build:pages:glotm && check:dist-boundary && test:seo`로 바꿨고, **`dist/` 부재는 skip이 아니라 실패**다. bare `npm test`에 dist 빌드 전제를 얹지 않으려고 vitest 파일이 아닌 CLI로 뒀다. 토큰 설계에서 실측 결함 1건을 잡았다: 소스 id를 맨몸으로 찾으면 가이드 본문의 정당한 기관명과 충돌한다(`uspto` 7파일·`impi` 27파일) → 후보 id는 전수 bare, 소스 id는 **따옴표를 씌운 형태**, 여기에 구조 마커(`sweepTarget`·`reviewTrigger`·`repository-backfill`·`briefSweepLog`)를 더해 23토큰으로 스캔한다(`.html .js .css .json .map .xml .txt`). 게이트: `npm test` 310/310, `typecheck`·`typecheck:runtime` pass, 주입 8건(bridge 경유·`.js` specifier·glob·index.html 진입점 추가·build:pages 스크립트 추가·dist 부재·후보 id 유출·데이터 형태 소스 id) 각각 실패 확인 + 주석 안 glob은 통과 확인.
  - **2026-08-08 첫 verified sweep**: KIPO 공식 발표를 직접 대조한 단일 소스 회차를 기록해 KIPO는 `ok`, 나머지 14개 소스는 `never-verified`로 유지된다. 발행 후보 계보와 상세 상태의 정본은 `src/briefs/discovery.ts`, 현재 사람이 읽는 뷰는 `npm run briefs:radar`이며, 개별 브리프 인벤토리는 이 문서에 복제하지 않는다.
  - **환경 한계(코드 아님)**: 이 세션의 `health:runtime` e2e 단계는 pre-installed 브라우저가 `chromium_headless_shell-1194`인데 `@playwright/test ^1.59.1`이 `-1217`을 찾아 launch에 실패한다. `executablePath=/opt/pw-browsers/chromium` 오버레이로 같은 스펙을 돌려 **28 smoke 전부 통과**를 확인했다. CI(`npx playwright install`)에서는 해당되지 않는다.
- 2026-08-08 라운드: **sitemap `lastmod` 신선도 신호 정정**(위 ① 해소). 진행 중이던 작업은 절반만 배선돼 있었다 — `gitLastModifiedIso`가 4개 워크스페이스에 **정의만 되고 호출되지 않았고**(builtAt은 그대로 `new Date()`), 실제로 배선된 것은 직전 산출물과 비교하는 `withStableBuiltAt` 뿐이었다. 그런데 `**/content/generated`는 gitignore라 **CI 신규 클론에는 비교 대상이 아예 없다** — 즉 배포되는 sitemap에는 아무 효과가 없는 구조였다(`Reports/generated`만 tracked라 그쪽 가드는 실제로 작동 중이었다). 코드 주석은 "배포 워크플로는 `fetch-depth: 0`을 쓴다"고 단정했으나 **세 워크플로 어디에도 그 설정이 없었다**(`actions/checkout` 기본값 = shallow). 조치: 8개 워크스페이스 전부 `builtAt`의 1차 근거를 콘텐츠 소스의 git 커밋일로 잡고(가이드는 `content/source` 디렉터리, 리포트는 각 원고 파일), git을 못 쓰거나(비-git) 믿을 수 없을 때(shallow·소스 dirty)만 기존 fallback으로 내려간다. `ci.yml`·`deploy-pages.yml`·`verify-release.yml`에 `fetch-depth: 0`을 추가했다. **실측**: lastmod가 배포 시각 대신 실제 변경일을 신고한다 — LatTm 21건 `2026-06-23`, UsaTm·JapTm 32건 `2026-06-30`, MexTm·ChaTm·UKTm 48건 `2026-07-22`, EuTm 16건 `2026-08-02`. 오늘 날짜로 남는 6건은 전부 정당하다(오늘 발행된 브리프와 그 파생 게이트웨이·법적고지 면). generated를 **전부 지우고 재빌드해도 sitemap이 바이트 동일**한 것으로 신규 클론 결정성을 확인했다. shallow 실측: 콘텐츠를 건드리지 않은 커밋이 그 경로의 마지막 커밋으로 붕괴돼(`2026-05-05`) 그럴듯하게 틀린 날짜가 나오는데, 가드가 이를 거부하고 fallback으로 내려가는 것을 확인했다. 테스트는 `scripts/build-content-stability.test.ts` 9건으로 다시 썼다 — 기존 3건은 샌드박스에서 **같은 디렉터리에 두 번 빌드**해 직전 산출물이 항상 존재했고, 그래서 **CI가 실제로 겪는 신규 클론을 한 번도 재현하지 않았다**. 이제 샌드박스 안에 진짜 git 저장소를 만들어 커밋일·신규 클론·dirty·shallow를 각각 단정한다. 주입 4건(write 경로가 resolver 우회 · 리포트가 git 인자 누락 · 워크플로 `fetch-depth` 제거 · shallow 가드 제거) 각각 실제로 실패하는 것을 확인했다. 게이트: `npm test` 319/319, `typecheck`·`typecheck:runtime` pass, `e2e:smoke` 28 pass, `health:release` 146 routes + `check:dist-boundary` 0 hits + `test:seo` 12 pass, `check:consistency` 0/0, `audit:facts` 6/6 pass.
  - **남긴 것**: `/legal`·`/privacy`·`/contact` 3면은 `gatewayLastModified`(사이트 전체 최신 콘텐츠)를 그대로 물려받아, 브리프가 하나 나갈 때마다 함께 갱신됐다고 신고한다. 같은 계열의 거짓 신선도지만 메커니즘이 다르고 이번 범위 밖이라 손대지 않았다(`sitemapPriority` 0.3 · `changeFrequency` yearly). → **2026-08-08 후속 라운드에서 해소(아래)**.
  - **2026-08-08 후속(legal 3면 lastmod)**: 위 잔여 항목 해소. 이 3면의 텍스트 정본은 `src/trustLegal.ts`이므로 그 파일의 마지막 커밋일을 쓰고, 게이트웨이는 최신 브리프·리포트를 실제로 드러내므로 집계 날짜를 유지한다 — 두 값이 갈라지는 것이 정상이다. 공용 조회 `scripts/git-last-modified.ts`를 신설했다(워크스페이스 build-content는 self-contained라 의도적으로 공유하지 않는다). **실측**: 3면 모두 `2026-08-08T00:00:00.000Z` → `2026-07-09T05:24:06.000Z`(= `src/trustLegal.ts` 커밋 `2026-07-09T14:24:06+09:00`), 게이트웨이는 유지. 렌더러(`seo.ts`)를 조회 대상에 넣는 안은 기각했다 — 무관한 이유로 자주 바뀌어 과잉 신고가 되살아난다.
    - **`fetch-depth: 0`은 full clone을 보장하지 않는다(운영 사실)**: CI가 `shallow-clone`으로 실패해 드러났다. `pull_request` 이벤트의 `actions/checkout`은 브랜치 ref에 더해 **merge ref SHA를 추가로 fetch**하고, 그 과정에서 `.git/shallow`가 생겨 저장소가 shallow로 판정된다(설정을 줘도 그렇다). `push` 이벤트인 `deploy-pages.yml`은 브랜치 ref만 받아 온전하므로 **실제로 발행되는 산출물은 커밋일을 쓴다**. PR 빌드는 아무것도 발행하지 않으므로 그쪽 fallback은 무해하다. 이 비대칭 때문에 git 가용성을 전제하는 단정은 PR CI에서 성립하지 않으며, 회귀 가드는 git을 타지 않는 주입 테스트가 진다.
    - 조회 실패를 `undefined`로만 돌려주던 것을 typed reason(`not-a-repository`·`shallow-clone`·`uncommitted-changes`·`no-commit-for-path`·`git-unavailable`)으로 바꿨다. 원인 진단이 불가능해 CI 실패를 한 번 헛짚었고, 조용히 무너지는 가드는 이 라운드가 고치려는 것 자체였다.
    - 게이트: `npm test` 323/323, `test:seo` 14/14, `typecheck`·`typecheck:runtime` pass, `e2e:smoke` 28 pass, `health:release` 146 routes + `check:dist-boundary` 0 hits, `check:consistency` 0/0, `audit:facts` 6/6 pass. 주입 3건(write 경로 되돌림 · `LEGAL_SOURCE_PATH` 이동 · git 차단 상태에서의 되돌림) 각각 실패 확인.
- 2026-08-15 라운드: **챕터 메타데이터 중복 해소**(아래 ② 해소). 라이브 실측에서 `<title>` 중복 10건/4클러스터(`서문 | GloTm`이 china·japan·mexico·usa에 동시 존재, `제12장 …(RACI)`·`부록: …`가 japan·mexico, `등록 후 유지관리와 갱신 체계`가 uk·usa)와 description 중복 7건(MexTm 챕터 7개가 `도입 MexTm 가이드 챕터.` 공유)을 확인했다. **제목**: 챕터 제목에 관할 라벨을 붙여 `<챕터> | <관할> | GloTm`으로 바꿨다. 라벨 정본은 `src/products/shared.ts`의 `CHAPTER_TITLE_QUALIFIER_BY_SLUG` + `buildChapterPageTitle`이고, `registry.ts`에는 짧은 관할 라벨 필드가 없으며 `title`을 잘라 쓰는 방식은 `EuTm 유럽 상표 운영 가이드북`처럼 접두어가 붙은 항목에서 조용히 깨져 채택하지 않았다. 미등록 slug는 throw + 전수 테스트로 잡는다. **description**: 판정 기준을 길이가 아니라 **같은 가이드 안에서의 중복**으로 잡고, 되풀이되는 요약은 본문 첫 문단으로 대체한다 — 길이 임계값(30자)으로 바꾸면 `핵심 원칙: 행정과 사법을 병행하라`(LatTm 19자)나 `멕시코에서 상표를 지킨다는 것의 의미`(20자)처럼 짧지만 고유한 요약까지 버리는 것을 주입으로 확인했다. 실측 결과 이 규칙은 MexTm 7건에만 발화하고 LatTm의 heading-echo 7건은 건드리지 않는다(부수 변경 0). **핵심 결함 1건을 추가로 잡았다**: `configuredReader.tsx`가 hydration 직후 `setRuntimeDocumentTitle(chapter.title)`로 prerender 제목을 덮어써, prerender만 고쳤다면 **JS를 실행하는 크롤러에게는 중복 제목이 그대로 남을 뻔했다**(주입으로 7개 가이드 전부 실패 확인). 그래서 라벨 정본을 `scripts/seo.ts`가 아니라 SPA와 공유하는 `src/products/shared.ts`에 두고 양쪽이 같은 함수를 통과하게 했다. 회귀 가드는 개별 문자열이 아니라 **유일성 자체**를 단정한다(`SEO metadata uniqueness` 5건 + `readerContract`의 SPA/prerender 제목 일치). 주입 5건(제목 qualifier 되돌리기 · 중복 요약 판정 제거 · 매핑에서 uk 제거 · 중복 판정 대신 길이 임계값 · SPA가 라벨 탈락) 각각 실제로 실패하는 것을 확인했다. 라이브 실측 검증: 루트 base로 재빌드해 React가 실제로 붙은 상태에서 초기 hydration과 클라이언트 사이드 이동(`fullReload: false`) 모두 관할 라벨이 유지되는 것을 브라우저에서 확인했다(직전 `/glotm/` base 빌드를 루트에서 서빙한 검증은 JS 번들이 404라 prerender만 본 것이어서 폐기). sitemap `lastmod` 분포는 변동 없다 — 8/8 라운드의 커밋일 기준 신선도 신호를 흔들지 않는다. 게이트: `npm test` **331/331**, `typecheck`·`typecheck:runtime` pass, `e2e:smoke` 28 pass, `health:release` 146 routes + `check:dist-boundary` 0 hits + `test:seo` **22 pass**, `check:consistency` 0/0, `audit:facts` 6/6 pass, dist 중복 title 10→0 · 중복 description 7→0. (기록 정정 2026-08-15: 원 기록은 브랜치 시점 수치 `328/328`·`test:seo 19`였다. 병합 후 main 실측은 331/331·22이며 위 수치가 그 실측값이다.)
  - **남긴 것**: MexTm 원고 7개 장의 첫 절 제목이 `도입`이라 `chapter.summary` 자체가 절 제목으로 뽑히는 구조는 그대로다(본문 상단에 `<p>도입</p>`이 렌더된다). 이번 라운드는 SEO 표면만 고쳤고 원고 수정은 `*/content/source/**` 범위라 하지 않았다. 원고를 고치면 이 fallback은 저절로 발화하지 않는다.
- 2026-08-15 라운드: **UsaTm·JapTm claim 60일 window 재검증**(만료 2026-08-27/28). **UsaTm 15건 전건 재대조 완료 — 14건 변경 없음, 1건 정정.** 정정은 **USA-CBP-002(HIGH)**로, 종전 서술이 CBP 두 트랙의 구제 경로를 **서로 뒤바꿔** 적고 있었다: 수출(반송)을 copying-or-simulating(19 CFR 133.22)의 구제로, 표장 제거 불가를 counterfeit(133.21)의 절대 규칙으로 뒀으나, 133.22(c)는 ①표장 제거·말소 ②권리자 본인·지정인의 수입 ③권리자 서면 동의 ④1개 개인면세 **네 가지만 열거하고 수출을 포함하지 않으며**, 수출과 표장 말소 후 통관은 **133.21에서 권리자가 압수 통지 후 30일 내 서면 동의를 했을 때** 열리는 처분이다. 인접 조문 133.23(gray market)도 수출을 두지 않아 `반송`이 133.22에 있을 다른 경로가 없음을 확인했다. 12장 분류표를 조문 번호와 함께 다시 쓰고 두 트랙 혼동 경고를 덧붙였다. `factsReviewedOn` usa 2026-06-29 → **2026-08-15**(Window Margin `12d left` → `60d left`). **JapTm은 6/12만 완료해 부분 라운드로 남겼다** — `jpo.go.jp`가 403이라 12건 중 7건의 등록 소스에 도달할 수 없었고, 더 중요하게 **영문 법령번역(`japaneselawtranslation` Trademark Act)이 Act No. 55 of 2015 수준이라 제4조 제4항이 아예 없다** — 2023년 개정 병존동의제도(2024-04-01 시행)를 다루는 `JP-CONSENT-001`이 그 조문 없는 번역본을 근거로 두고 있었다는 뜻이라, 접근 문제가 아니라 **소스 적합성 결함**이다. 확인한 6건(JP-FIRST/TERM/OPP/CUSTOMS/IPHC/DRP)만 재스탬프하고 나머지 6건은 `lastVerified` 2026-06-29을 유지했으며(blind re-stamp 금지), JapTm `factsReviewedOn`도 옮기지 않았다. 따라서 japan은 2026-08-28 이후 `gate=warn`으로 떨어지며 그것이 정직한 상태다. 게이트: `audit:facts` 6/6 pass, `check:consistency` 0/0, `npm test` **331/331**, `content:usa` QA 0 error·15장·206 엔트리(수치 불변). (기록 정정 2026-08-15: 원 기록은 브랜치 시점 수치 `323/323`였다. 병합 후 main 실측은 331/331이다.)

- 2026-08-15 후속 라운드: **JapTm 잔여 6건 완료 + USA 고위험 오류 2건 정정**. 직전 라운드가 JapTm을 6/12 부분 완료로 남기며 든 이유 두 가지 중 **하나는 사실이 아니었다** — `jpo.go.jp` 403은 사이트가 아니라 **WebFetch/curl 채널의 문제**였고, 인앱 브라우저로는 JPO 페이지가 그대로 열린다. 이번에 JPO 4개 페이지(step-by-step `[Last updated 23 March 2021]` · Madrid FAQ `[13 March 2023]` · Schedule of fees `2022-04-01 이후판` · Accelerated Examination `2025년 10월판`)와 병존동의제도 전용 페이지를 직접 열어 대조했고 **6건 전부 변경 없음**을 확인했다. 반면 **번역본 결함은 실재했다**: `view/3047/en`은 `Last Version: Act No. 55 of 2015`라 제4조 제4항이 없다. 법령 축을 **e-Gov 법령검색 일본어 정본**(상표법 `334AC0000000127` · 부정경쟁방지법 `405AC0000000047`, 둘 다 令和8年5月21日 施行)으로 옮기고 현행 영문 번역(`4764/en`·`4709/en`, `Act No. 51 of 2023`)을 보조 sourceId로 신설했다. 제4조 제4항 원문을 직접 대조해 `JP-CONSENT-001`을 확정했다. **JapTm 12/12 재대조 완료**, `factsReviewedOn` 2026-06-29 → **2026-08-15**(Window Margin `60d left`). 본문 반영 1건: 11장이 부정경쟁방지법 제2조 제1항 세 갈래를 "혼동" 한 덩어리로 묶고 있었으나 **제2호(저명표시 모용)는 혼동을 요건으로 하지 않아** 세 갈래를 요건별로 분리했다(구 번역본 링크도 교체). **USA 정정 2건(둘 다 HIGH)**: ⓐ `USA-CANC-001`이 5년 후 취소 사유를 `§1054/§1052 위반`으로 뭉뚱그려, 5년이 지나면 다툴 수 없는 §1052(d)·(e)까지 사유로 읽혔다 — §1064(3) 원문은 `section 1054 ... or of subsection (a), (b), or (c) of section 1052`이므로 (a)·(b)·(c)로 좁히고, notes에서 §1064(3)으로 잘못 적혀 있던 never-used 경로를 **§1064(6)**(등록 3년 후)로 바로잡아 claim 본문·13장에 반영했다. ⓑ `USA-CBP-002`와 12장이 두 30일을 **"같은 시계"** 로 묶고 있었다 — §133.25(a)는 `§§133.22·133.23`에만 적용되고 **상품 제시일** 기산에 `freely granted for good cause shown` 연장이 붙는 반면, §133.21(g)는 **압수 통지일** 기산에 연장 규정이 없다. 12장에 두 시계를 나눈 표를 넣고 압수 전환이 **연장된** 억류 기간 기준임(§133.22(f))을 명시, `cfr-19-133-25`를 신규 등록하고 §133.21/§133.22 링크를 Cornell LII 미러에서 eCFR 원본으로 옮겼다. **회귀 가드 신설**: `scripts/research-audit/claim-source-register.test.ts` 19건 — `audit:facts`가 sourceId **개수**만 세느라 못 보던 두 축(sourceId가 source register에 실제로 있고 URL까지 추적되는가 · 폐기된 번역본 URL이 다시 들어오는가)과 위 정정 4건을 단정한다. 작성 후 main에서 15건이 실제로 실패하는 것을 먼저 확인했다. 문서 정합: sitemap 인벤토리 `145`→**146**·brief 행 `index 1 + issue 16 = 17`→`index 1 + issue 17 = 18`(라이브 실측 146과 일치), 위 두 라운드의 게이트 수치를 병합 후 main 실측으로 정정, `factual-qa-rollout.md`의 "JapTm은 shortcut-refresh 예외" 3곳 정정(아래 ④ 해소). 게이트: `npm test` **350/350**(기존 331 + 신규 19), `typecheck`·`typecheck:runtime` pass, `health:content` QA 0 error, `health:release` 146 routes + `check:dist-boundary` 0 hits + `test:seo` 22 pass, `check:consistency` 0 hard / 0 advisory, `audit:facts` 6/6 pass, `health:report` usa·japan 모두 `0d / 60d left / staleHighRisk 0 / gate=pass`.
  - **owner 후속**: ⓐ `jpn-trademark-act` 소스 교체(e-Gov 법령검색 또는 JPO 원문) — JapTm 잔여 재검증의 선결 과제. ⓑ JPO 도달 경로 확보(수수료·가속심사는 행정 고시라 대체 1차 출처가 없다). ⓒ `USA-CANC-001`에 §1064(3) never-used(TMA 2020) 사유를 명시할지.
- 2026-08-24 라운드: **만료된 마감을 첫 화면에서 내리고, git 버전에 묶여 있던 회귀 가드를 푼다**. 두 건 모두 실측에서 나왔다. ⓐ Gateway 히어로의 `latest-brief-banner`는 `getLatestBriefIssue()` 제목을 그대로 렌더하는데, 2026-08-08호(`2026-08-kbrand-overseas-licensing-control`)의 제목·`nextAction`이 **신청기간이 2026-08-21로 이미 끝난** 지원사업을 "신청 전에 …" 형태로 권하고 있었다(발행 시점에는 정확했고, 지금 틀린 것은 시제다). prerender된 게이트웨이 HTML에는 이 배너가 없어 SEO 표면에서는 보이지 않았고, **JS를 실행하는 실제 독자에게만** 보이는 상태였다. `briefs:radar`의 ready 후보 1건(`2026-01-comparable-uk-mark-eu-use-cutoff`, 발굴 2026-08-03, 후보 노트에 "별도 취재 없이 바로 쓸 수 있다")을 2026-08-24호로 발행해 latest를 교체했다. 본문 사실은 **저장소가 이미 1차 출처로 재대조한 claim에서만** 가져왔다 — `EU-UKUSE-001`(GOV.UK comparable UK trade marks 안내 직접 인용, 재대조 2026-08-02·HIGH)과 `UK-NONUSE-001`·`UK-COMPARABLE-001`·`UK-BREXIT-001`. 이번 라운드에서 소스를 새로 연 것은 아니므로(이 환경에서 `gov.uk`는 egress 차단) `briefSweepLog`에 회차를 추가하지 않았고, 어떤 `lastVerified`·`factsReviewedOn`도 옮기지 않았다. 후보는 `published` + `publishedAs`로 전이했다. ⓑ `scripts/build-content-stability.test.ts`의 shallow-clone 전제 검사가 `git log --format=%cI` 출력이 UTC를 `Z`로 찍는다고 문자열로 단정하고 있었다 — **git 2.43은 `+00:00`, CI 러너의 2.54는 `Z`**라 로컬에서만 붉어졌다(`npm test` 349/350). 생산 경로(`scripts/git-last-modified.ts`·워크스페이스 `build-content.ts`)는 `new Date()`로 파싱해 영향이 없었고, 결함은 이 전제 단정 하나에 갇혀 있었다. 표기 대신 시각으로 대조하도록 바꿔 "어느 커밋으로 붕괴했는가"라는 원래 단정은 유지했다(붕괴하지 않으면 seed 커밋일과 어긋나 그대로 실패한다). 문서 정합: sitemap 인벤토리 `146`→**147**, brief 행 `index 1 + issue 17 = 18`→`index 1 + issue 18 = 19`. 게이트: `npm test` **350/350**, `typecheck`·`typecheck:runtime` pass, `e2e:smoke` **28 pass**(이 컨테이너에 깔린 chromium 1194로 실행 — 프로젝트가 고정한 playwright는 1217 headless shell을 찾는다), `health:release` **147 routes** + `check:dist-boundary` 0 hits + `test:seo` 22 pass, `check:consistency` 0 hard / 0 advisory, `audit:facts` 6/6 pass.
  - **남긴 것**: 2026-08-08호 **이슈 페이지 자체**는 여전히 마감이 지난 지원사업을 "신청 전에 …"로 안내한다. 본문 소급 수정은 lane 규칙이 금지하고(`briefs-lane.md`: 발행일 시점 사실 보존), `supersededBy`는 **사실 정정** 장치라 이 경우에 맞지 않는다 — 그 브리프는 틀린 적이 없고 시효가 지났을 뿐이다. 시한 있는 소재에 만료 상태를 표시하는 장치(예: `timeSensitive.closesOn` + 이슈 상단 고지·아카이브 배지)를 둘지는 lane 계약을 바꾸는 판단이라 owner 몫으로 남긴다. 장치 없이는 검색으로 옛 이슈에 도착한 독자에게 만료 사실이 닿지 않는다.

- 2026-08-25 라운드: **2026-08 월간 리뷰** — lane 재검증 + `verifiedOn` re-stamp + workspace drift sync. 직전 re-stamp가 2026-07-04였으니 52일 만이다(mature 상한 120일이라 만료 전이지만 월 1회 cadence는 밀려 있었다). shared root gate를 다시 돌려 **세 lane 전부 pass**했다 — `health:runtime`(typecheck:runtime · test:runtime · e2e 28 pass), `health:content`(8개 워크스페이스 QA 0 error, 생성 수치 `781/385/206/185/358/261/183` + 리포트 95로 registry 정본과 일치), `health:release`(147 routes · `check:dist-boundary` 0 hits · `test:seo` 22 pass). `verifiedOn`을 7개 가이드 전부 **2026-08-25**로 re-stamp했고(UKTm만 2026-07-07이던 것도 같은 날로 합류), `health:report`는 freshness 0d · 전 가이드 `hold` · `verification-refresh-needed` 0건 · `upgrade-ready` 0건이다. 이 re-stamp는 **lane 재통과이지 1차 출처 재대조가 아니다**(`factsReviewedOn`은 하나도 건드리지 않았다). **문서 미러 drift 4건을 함께 잡았다**: EuTm root-sync가 `260 엔트리 / factsReviewedOn 2026-06-10`(정본은 261 / 2026-08-02), UsaTm root-sync가 `factsReviewedOn 2026-06-29`(정본 2026-08-15), MexTm root-sync의 `root verified date 2026-05-12`(석 달 stale), monthly-review-template이 sitemap 인벤토리 `145`를 하드코딩(정본 표는 147 — 숫자 복제를 지우고 표를 가리키게 고쳤다). **이 넷은 `check:consistency`가 내내 0 hard / 0 advisory를 낸 구간에서 살아 있었다** — 체커가 registry↔`PROJECT-OVERVIEW`/`README`는 보지만 `docs/workspaces/**` 미러는 보지 않기 때문이고, 지금은 사람이 눈으로 잡는 수밖에 없다. 반면 UKTm root-sync의 `14장 / 128 엔트리 / incubate·beta·standard`는 drift가 아니다 — 문서 상단 `SUPERSEDED (2026-07-07)` 배너가 그 아래를 승급 이전 dated 기록으로 이미 표시하고 있어 그대로 뒀다. 게이트: `npm test` 350/350, `check:consistency` 0 hard / 0 advisory, `audit:facts` 6/6 pass.
  - **브리프 발굴 체크(`briefs:radar`)**: 발행 18호 · 최신 2026-08-24 · 마지막 발행 후 1d(목표선 이내) · 이번 달 신규 후보 5건 · published 2 · dropped 0 · 정체(30일+) 0건. **`ready` 잔량 0** — 어제 라운드가 마지막 ready 후보를 썼으므로 다음 발행은 sweep부터 시작해야 한다. 커버리지 공백은 `JapTm`(마지막 등장 77d, 열린 후보 0)과 `LatTm`(45d, 0)이다.
  - **이번 라운드가 하지 못한 것(범위 밖이 아니라 이 환경에서 불가)**: 런북 §1 Search Console 색인, §2 GA4 DebugView, §4 organic sessions 집계는 콘솔 계정이 필요한 owner 전용 절차다. §5 소스 sweep은 checkout agent도 할 수 있다고 계약돼 있으나 **이 컨테이너의 네트워크 정책이 등록된 15개 소스 전부를 막는다** — 15개 URL 모두 CONNECT 403이고(`$HTTPS_PROXY/__agentproxy/status`의 `connect_rejected` 기록으로 확인), 라이브 `ywkinfo.github.io`도 같은 이유로 열리지 않아 §3 라이브 스모크도 로컬 `e2e:smoke`로 대체할 수밖에 없었다. 소스를 실제로 연 적이 없으므로 `briefSweepLog`에 회차를 **추가하지 않았다**(계약상 sweep 기록은 "소스를 열었다"는 증거다). 즉 이번 달 sweep 회차 수는 0이고, `ready` 잔량 0과 겹쳐 다음 발행의 앞단이 비어 있는 상태다 — owner sweep이 필요한 지점이다.
  - **e2e 실행 환경 주석**: 이 컨테이너에는 chromium 1194가 깔려 있고 프로젝트가 고정한 playwright는 1217 headless shell을 찾는다. `health:runtime` lane의 e2e는 저장소 설정을 건드리지 않고 `executablePath`만 덮는 로컬 config로 돌렸다(28 pass). 고정 브라우저 기준 증거는 같은 트리(main `12994cd`)에서 2026-08-24 22:49–22:52 UTC에 green으로 끝난 CI 런 #361이며, 이 re-stamp는 두 증거를 함께 근거로 한다.

- 2026-08-25 후속 라운드: **owner 액션 3건을 실제로 시도했고, 하나는 채널 전제가 틀렸다.** 직전 라운드가 "이 환경은 외부 소스를 못 연다"고 적었는데 그건 **채널별로 갈린다** — `curl`·WebFetch는 등록 소스 15개 전부 CONNECT 403이지만 **WebSearch는 같은 프록시를 타지 않아 열리고 1차 출처 내용을 돌려준다**(2026-08-15 라운드가 JPO 403에서 얻은 `403은 사이트가 아니라 채널의 문제`와 같은 형태다). 그래서 9/19–9/20에 동시 만료되는 `china`·`mexico`·`uk` claim 세 벌을 **변경 신호 triage**로 훑었다. **`lastVerified`·`factsReviewedOn`은 하나도 움직이지 않았고 `briefSweepLog`도 그대로다** — 이 lane이 인정하는 `verified`는 소스를 직접 연 회차이고 WebSearch가 주는 것은 검색 결과와 요약 모델의 렌더링이기 때문이다. 결과: ⓐ **`uk`** — UK-FEE-001(£205 / 추가 클래스 £60, 2026-04-01 개정)은 확인 신호, 변경 없음. **UK-IPEC-001에서 함정을 하나 찾았다**: claim이 적은 `costs cap £60,000`(liability, quantum £30,000)은 2022-10-01 개시 사건부터 적용되는 CPR Practice Direction 개정값으로 **맞다**. 그런데 이 claim의 `sourceIds`는 그 규칙을 가리키지 않고, **GOV.UK·judiciary.uk의 IPEC 안내 면 일부가 개정 이전 값 £50,000을 아직 싣고 있다** — 등록된 sourceIds만 열고 재대조하면 **맞는 값을 틀린 값으로 "정정"하게 된다**. (이 라운드에서 실제로 그 순서를 밟았고, 한 번 잘못 판단했다가 규칙 개정을 확인하고 되돌렸다.) 준비 메모를 `UKTm/content/research/uk_tm_fact_verification_log.md`에 남겼고, 규칙 출처 등록은 페이지를 직접 열어야 하므로 추정 URL을 넣지 않고 owner 액션으로 남겼다. ⓑ **`china`** — 개정 상표법 2026-06-26 공포·2027-01-01 시행이 재확인됐고 **实施条例(시행조례) 공개 신호는 없다**. watching 후보 `2027-china-implementing-rules`는 그대로 두며, CN-DL-001(이의신청 3개월)에 개정값을 미리 적용하지 않는 현재 방침도 그대로다. ⓒ **`mexico`** — 변경 신호 없음. MX-DL-001은 LFPPI 조문(제221조·제233조·제178조)을 직접 인용하고 2026-04-03 개정 미영향까지 기록해 둔 상태라, 2차 매체가 다르게 적은 날짜(선언 의무 기산 2018-08-18)보다 저장소 쪽 근거가 강하다 — 정정 대상으로 올리지 않는다. 문서 정합: `briefs-discovery.md`의 "에이전트 세션은 외부 egress가 차단"이라는 단정을 채널별 실측으로 고쳤다. 게이트: `npm test` 350/350.
  - **owner 몫으로 남은 것(이 세션에서 구조적으로 불가)**: ① 런북 §1 Search Console·§2 GA4·§4 organic sessions — 콘솔 계정이 필요하다. ② 소스 sweep의 `verified` 기록 — WebSearch로는 자격이 안 된다. ③ 그래서 이번에도 sweep 0회이고 `ready` 후보는 0건 그대로다. `BriefSweepKind`에 mediated 채널용 3번째 종류를 둘지는 계약 변경이라 owner 판단으로 남긴다 — 두지 않으면 에이전트 세션이 "무엇을 확인했는지"를 lane에 남길 자리가 계속 없다.

- 2026-08-02 미해결로 남긴 것(리뷰에서 실측 확인, 별도 라운드 필요): ① ~~sitemap `lastmod` 145건 중 **121건이 빌드 타임스탬프** — LatTm 콘텐츠 최종 변경 2026-06-23·JapTm 2026-07-01인데 둘 다 배포 시각을 신고해, 배포마다 전 코퍼스가 갱신됐다고 거짓 신호를 낸다.~~ → **2026-08-08 해소(위 라운드)**. ② ~~라이브 `<title>` 중복 4클러스터 10건(`서문 | GloTm` 4건은 관할 구분 없음), `description` 7건이 동일 placeholder `도입 MexTm 가이드 챕터.`~~ → **2026-08-15 해소(위 라운드)**. ③ **claim staleness 하드 게이트 전환**(부분 해소). 2026-08-02 3라운드에서 `audit:facts`·`check:consistency`를 `ci.yml`에 편입했고(더 이상 owner가 손으로 돌릴 때만 보이지 않는다), `health-report.test.ts`·`scorecard.test.ts`의 고정 시계 문제도 실시계 describe 분리로 해소했다. **남은 것은 정책 판단 하나다** — `audit-staleness.ts`는 여전히 `level: "warning"`이라 exit 0이고, staleness를 실패로 올릴지는 advisory·non-gating 계약을 바꾸는 결정이라 owner 몫으로 남긴다. ④ ~~`factual-qa-rollout.md` 18·57·365행이 "JapTm은 root shortcut-refresh 예외"라 단정하나 `content:japan`은 full pipeline이다.~~ → **2026-08-15 해소**: 세 곳 모두 정정했다(`content:japan`은 build-master + qa-content + build-content 3단계로 다른 가이드와 동일하고, `health:content`도 JapTm `content:prepare`를 함께 돈다).

## Today

### 1. `ChaTm` mature refresh closeout — **완료 (2026-05-17)**

- Sprint 1/2 원고 레인 A·B·C 반영 완료, 핵심 claim 모두 `Body-ready`
- `/china` 홈·챕터·검색·continue reading 스모크 bundle 정리 완료
- `chatm-root-gate-input.md` 및 `chatm-mature-qa-checklist.md` 기준선 2026-05-12로 갱신
- `chatm-content-expansion-taskboard.md` closeout 마킹 완료
- source chapters 기준 설명과 reader smoke evidence 충돌 없음

완료 기준 충족:

- [x] `chatm-content-expansion-taskboard.md`의 mature refresh 관련 잔여 메모가 닫혀 있다.
- [x] source chapters 기준 설명과 reader smoke evidence가 서로 충돌하지 않는다.

### 2. `MexTm` Sprint 2 후속 통합 — **완료 (2026-05-17)**

- `Ch5`, `Ch7`, `Ch10` 원고 반영 + `BODY_READY` claim 4개 승격 완료
- `mextm-root-sync-input.md` root verified date → 2026-05-12 갱신
- `src/products/registry.ts` MexTm summary → Sprint 2 triad 반영
- Gateway / Report handoff copy → This Week D레인으로 명시 defer

완료 기준 충족:

- [x] `mextm-content-expansion-taskboard.md`의 Leader Integration Inputs를 root sync 관점으로 옮길 수 있다.
- [x] local gate 결과와 root wording 후보가 한 장의 메모로 묶여 있다.

### 3. EuTm growth expansion → mature 승급 — **완료 (2026-06-10, #69/#70)**

- [x] 1단계: 권한·계약 변경 (PROJECT-OVERVIEW / Harness docs)
- [x] 2단계: 공식 출처 사실 검증 (1차 출처 재대조 · 2026-06-10 UK 수수료·우선권·comparable·Brexit 날짜 정정)
- [x] 3단계: 집중 콘텐츠 보강 (Ch3·6·10·14 + 부록 → 15장 체계)
- [x] 4단계: QA 및 mature 승급 (full QA · scorecard review)

closeout 요약:
- `15장 / 260 엔트리 / growth tier / mature lifecycle / full QA`로 registry 정본 반영 (당시 verifiedOn 2026-06-09 · factsReviewedOn 2026-06-10; verifiedOn은 이후 월간 re-stamp로 갱신 — 최신은 registry 정본)
- claim-map 10건(2026-06-10 신규 4건 포함) 1차 출처 재대조 완료
- `controlled EU+UK scope` 유지 · owner-doc·research 문서 정합 완료

## This Week

### A. 제품 상태 정본을 하나로 잠그기 — **완료 (2026-05-17)**

- 7개 가이드 전수 비교: registry.ts ↔ PROJECT-OVERVIEW.md ↔ README.md → drift 없음
- `chapterCount`, `searchEntryCount`, `portfolioTier`, `lifecycleStatus`, `qaLevel`, `verifiedOn` 모두 2026-05-12 기준 일치
- `scorecard.ts`는 하드코딩 없이 registry.ts 값을 동적으로 읽음 → canonical 보장
- `README.md`는 registry.ts를 canonical로 명시하며 별도 수치 없음
- workspace docs(ChaTm/MexTm/EuTm) → 오늘 세션에서 날짜 갱신 완료

대상:

- `src/products/registry.ts` ✓
- `PROJECT-OVERVIEW.md` ✓
- `README.md` ✓
- `docs/workspaces/ChaTm/*` ✓
- `docs/workspaces/MexTm/*` ✓
- `docs/workspaces/EuTm/*` ✓

### B. workspace별 검증 깊이 표를 고정하기 — **완료 (2026-05-17)**

핵심 drift 발견 및 수정:
- `phase1-runtime-qa.md`가 `UKTm`을 `UsaTm·JapTm`과 함께 "lighter-track"으로 표현했으나, `package.json` 기준 UKTm은 실제로 root full pipeline(`build-master → qa-content → build-content`)을 사용함
- 해당 줄 수정: UKTm을 lighter-track 그룹에서 분리, "root full pipeline, health:content workspace-local 미포함"으로 명확화
- "가이드별 검증 깊이 표" 추가 (7개 가이드 × root 파이프라인 / health:content workspace-local / deeper QA 방법)

대상:

- `package.json` — 확인 완료, 스크립트 정확함 ✓
- `README.md` — UKTm full pipeline 이미 정확히 서술 ✓
- `docs/phase1-runtime-qa.md` — lighter-track 오분류 수정 + 검증 깊이 표 추가 ✓
- 각 workspace `README.md`, `package.json` — 변경 불필요

### C. `health:report` provenance를 명시하기 — **완료 (2026-05-17)**

확인된 provenance 사실:
- `health:report`는 `.omx/state/health-lane-status.json`에서 **저장된 마지막 lane 결과**를 읽는다 — fresh re-run 아님
- 스크립트 출력 헤더에 이미 "recent lane-state provenance summary, not an end-to-end verification guarantee" 명시돼 있음

추가 수정 사항:
- `docs/monthly-review-template.md`: "health:report 해석 규칙" 표 추가 (읽는 방식, 의미, verdict 해석, 월간 리뷰 활용, fresh 검증 필요 시)
- `docs/monthly-review-template.md`: UKTm pilot → beta 승급 반영, Locked defaults 날짜 2026-05-12로 갱신
- `README.md`: `UKTm`을 lighter-track 그룹(`UsaTm·JapTm·UKTm`)에서 분리
- `scripts/health-report.ts`, `scripts/health-lane-state.ts`: 변경 불필요 (이미 명확)
- `docs/portfolio-scorecard.md`: 변경 불필요 (이미 provenance 설명 완비)

대상:

- `scripts/health-report.ts` ✓ (변경 불필요)
- `scripts/health-lane-state.ts` ✓ (변경 불필요)
- `README.md` ✓ (UKTm lighter-track 분리)
- `docs/portfolio-scorecard.md` ✓ (변경 불필요)
- `docs/monthly-review-template.md` ✓ (해석 규칙 + UKTm beta + 날짜)

### D. 그다음 `Report / Gateway` 정합화 — **완료 (2026-05-17, 확인 패스)**

- Gateway hero copy(`GatewayPage.tsx` lines 112-115): MexTm "filing packet·maintenance·border-control handoff" 이미 반영 ✓
- Report trust layer(`src/reports/registry.ts` gatewaySectionSummary): 동일 triad 이미 반영 ✓
- `monthly-review-template.md` locked defaults: This Week C에서 2026-05-12로 갱신 완료 ✓
- 코드 변경 불필요 — wording이 이미 Sprint 2 triad 및 locked defaults와 정렬돼 있음
- **[Superseded 2026-06-08 · PR #65]** 위 Gateway hero + report trust-layer wording은 평이화됨: hero supporting 2문단은 `src/content/gateway.ts` 공용 const로 이동(SPA+SEO 단일 출처), `launch sequencing`·`filing packet·maintenance·border-control handoff`·`controlled EU+UK scope·evidence triage`·`trust layer` jargon 제거. `gatewaySectionSummary`는 cross-guide 공통 질문 framing으로 재작성, report roadmap 카드 제목은 `reportExperienceMeta.gatewayRoadmapTitle` 사용. 위 2026-05-17 줄은 역사 기록으로 보존.

## Lane Artifacts

- `ChaTm`: `docs/workspaces/ChaTm/chatm-root-gate-input.md`
- `MexTm`: `docs/workspaces/MexTm/mextm-root-sync-input.md`
- `EuTm`: `docs/workspaces/EuTm/eutm-root-sync-input.md`
- `JapTm`: `docs/workspaces/JapTm/japtm-root-sync-input.md`
- `UKTm`: `docs/workspaces/UKTm/uktm-root-sync-input.md`
- 현재 라운드 원칙: workspace handoff 문서까지는 병렬로 진행하고, 루트 truth와 shared root gate는 통합 단계에서 1회만 다룬다.

## Next Lane

- `JapTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 185 search entries / growth / mature / full QA` (2026-06-30 #114로 `incubate→growth`·`beta→mature`·`standard→full` 승급, factsReviewedOn 2026-06-29 · verifiedOn re-stamp 2026-07-04). 이전 `145 / incubate / beta / standard` 표기는 승급 이전 잔재였다.
  - 유지 액션은 route / examination·consent / maintenance / enforcement·customs orchestration이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.
- `UKTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 183 search entries / growth / mature / full QA` (2026-07-07 #121로 `incubate→growth`·`beta→mature`·`standard→full` 승급, factsReviewedOn 2026-07-07 · verifiedOn 2026-07-07). 이전 `14 / 128 / incubate / beta / standard` 표기는 승급 이전 잔재였다(2026-06-03 명칭 drift 기록은 아래 `Resolved Drift Archive`에 보존).
  - 유지 액션은 filing decision / examination·opposition / maintenance / 다중 포럼 집행 오케스트레이션이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.
- `UsaTm` operating-copy maintenance
  - registry 정본 baseline: `15 chapters / 206 search entries / growth / mature / full QA` (factsReviewedOn 2026-06-29 · verifiedOn re-stamp 2026-07-04). mature closeout: 집행 포럼 통합 플레이북(15장) 신설 + claim-map 15건 + full-QA 파이프라인 편입 + stale/pending 사실과 Jack Daniel's/CBP 후속 claim 1차출처 재대조 완료.
  - 유지 액션은 filing basis / specimen / maintenance / TTAB·법원·플랫폼·CBP 집행 오케스트레이션이 home / continue reading / search에서 잘 이어지는지 확인하는 것이다. Gateway 첫 화면의 `ChaTm`·`MexTm`·`EuTm` 약속은 유지한다.

## Do Not Touch

- 신규 국가 가이드 추가
- pricing / paywall 도입
- 이메일 게이트 3단계 확장
- 새 콘텐츠 파이프라인 도입
- 의존성 추가
- generated JSON, `public/generated/*`, `dist/*` 수동 수정
- `weekly_ops_briefing_2026-04-17.md`만 근거로 한 공식 포지셔닝 변경

## Committee Warnings

- 브리핑은 방향 신호일 뿐, 현재 우선순위를 덮어쓰는 실행 명령이 아니다.
- 지금 GloTm의 다음 액션은 신규 확장이 아니라, owner-doc 정합 유지와 프로모션 없는 유기 색인·계측(Phase 2.5) + `UsaTm`·`JapTm` growth/mature 유지 + `UKTm` reader-utility 유지보수다.
- source 대신 generated 산출물부터 만지면 운영 truth가 먼저 깨진다.

## Working Notes

- root shared truth 확인 순서: `Harness/Constitution.md` -> `PROJECT-OVERVIEW.md` -> `README.md` -> `ARCHITECTURE.md`
- workspace taskboard 확인 순서:
  - `docs/workspaces/ChaTm/chatm-content-expansion-taskboard.md`
  - `docs/workspaces/MexTm/mextm-content-expansion-taskboard.md`
  - `docs/workspaces/EuTm/eutm-content-expansion-plan.md` (COMPLETED — growth/mature 승급 closeout)

## Resolved Drift Archive (UKTm beta straggler — 2026-06-03 해소)

`UKTm`은 2026-05-12 #53로 `pilot→beta`·`smoke→standard` 승급됐고 `src/products/registry.ts`·`PROJECT-OVERVIEW.md`·`portfolio-scorecard.md`는 beta로 정합하다. 승급 이전 `pilot` 표현이 남아 있던 supporting 문서는 2026-06-03에 registry 정본(`incubate / beta / standard`)으로 정합화했다(정본은 registry.ts):

- [x] `docs/workspaces/UKTm/uktm-root-sync-input.md` — beta/standard reader-utility 정합 레인으로 재작성 (2026-06-03).
- [x] `docs/buyer-narrative.md` — UKTm 줄을 `incubate beta · standard · early-track verified`로 갱신 (2026-06-03).
- [x] `docs/workspaces/UKTm/uktm-content-expansion-plan.md` — superseded 배너 + 현재형 pilot 단정 정정 (2026-06-03, 과거 라운드 narrative는 historical로 보존).

명칭 drift (2026-06-03 해소, A안):

- [x] 소스 헤딩을 `beta-lane maintenance owner board`로 변경하고 home copy·e2e bookmark와 통일, `content:uk` 재생성(0 error, slug `beta-lane-maintenance-owner-board`) + `e2e:smoke` UKTm reader smoke 통과. generated/public은 gitignored 빌드 산출물로 CI 재생성.

### 추가 발견 — UKTm lifecycle-label 광역 drift (2026-06-03 해소)

②·④ 정리 후 전체 tree sweep에서 동일 family(UKTm을 `pilot / smoke / draft 공개본`으로 단정)가 더 있는 것을 확인하고 registry 정본(`beta / standard / early-track verified`)으로 정합화했다:

- [x] `UKTm/Harness/Architecture.md` (L6, L42) — lifecycle/QA 단정 + 편집 규칙을 `beta / standard / verified`로 정정(“beta 표현 회피” 규칙 → “growth/mature 회피, incubate 유지”).
- [x] `UKTm/Harness/Content-Spec.md` (L41) — reader-facing 요약 정합 규칙을 `beta / standard / verified`로 정정.
- [x] 소스 챕터 본문 lifecycle 라벨: `02_clearance-risk.md`(L45), `03_filing-strategy.md`(L9), `07_maintenance-renewal.md`, `11_platform-domain.md`(L70), `13_governance-raci.md`(L66) → `beta lane` / `early-track` / `verified 공개본`.
- [x] `docs/workspaces/UKTm/uktm-content-expansion-plan.md` (L51) — 성공 기준 줄을 beta 포지션으로 정정.
- [N/A] `UKTm/content/source/chapters/14_cases-appendix.md` (L68–76) — 2026-04-04 dated 검증 로그라 당시 라벨(pilot/smoke)은 historical로 보존하고, L76 운영-상태 줄에 “이후 2026-05-12 #53 beta 승급 · 정본 registry” forward-pointer만 추가.

소스 챕터 변경분은 `content:uk` 재생성(0 error, 14 chapters / 128 search) + `npm test` 222 통과 + `e2e:smoke` 28 통과로 확인. 남은 `pilot/smoke` 문자열은 전부 ⓐ dated 검증 로그(2026-04-03/04-04), ⓑ 승급 transition 서술, ⓒ `portfolio-scorecard.md`의 `Pilot` tier 기준 정의(UKTm 무관)뿐이다.
