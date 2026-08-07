# GloTm Current Ops Taskboard

이 문서는 현재 로컬 위원회 합의안을 실행 보드 형태로 정리한 supporting doc이다.
현재 phase, 우선순위, 명령, 검증 계약의 authority는 계속 `../PROJECT-OVERVIEW.md`, `../README.md`, `../ARCHITECTURE.md`를 기준으로 본다.

## Snapshot

- Last updated: 2026-08-07
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
  - **2026-08-07 리뷰 대응(#134)**: owner 리뷰가 "계약이 말로만 있고 강제되지 않는 지점" 6개를 지적했고 전부 사실이었다. ① **관할 어휘가 게이트가 아니었다** — 검사에 별칭 정규화(`getCanonicalJurisdictions`)를 써서 애초 문제였던 `UK`·`EU`가 신규 데이터에서도 통과했다. `isCanonicalJurisdiction`(literal)을 신설해 게이트와 집계 경로를 분리했다. ② **부트스트랩 sweep이 가짜 freshness를 만들었다** — note에는 "실사가 아니다"라고 적고 리포트는 7개 소스의 마지막 sweep으로 계산했다. `BriefSweep.kind`(`verified` / `repository-backfill`)를 신설해 backfill을 freshness에서 제외했고, 그 결과 radar가 15개 소스 전부를 `실사 이력 없음`으로 표시한다(이게 사실이다). ③ **event-driven 소스가 영원히 안 보였다** — `never-verified` 상태를 cadence와 무관하게 표시하고, event-driven 소스에 `reviewTrigger`를 필수화했다. ④ **런타임 격리 정규식이 허술했다** — 큰따옴표 정적 import만 잡고 경로 prefix로 스킵해 동적 `import()`와 `discoveryWidget.tsx`가 통과했다(대조 실험으로 실제 누락 확인). `ts.preProcessFile` 기반 import 그래프로 교체했다. ⑤ **후보–sweep 계보가 느슨했다** — `relatedProductSlugs` 최소 1개, `trigger` 날짜 토큰, 비-dropped의 `droppedReason` 금지, sweep 산출 후보의 소스 교집합·날짜 순서, `briefDiscoveryStartOn` pin 테스트를 추가했다. ⑥ **넓은 루트 URL** — `sweepTarget`(무엇을 보면 sweep 완료인가) 필수 필드를 신설했다. 정확한 뉴스·공고 페이지 URL 확정은 owner 핸드오프로 남긴다(에이전트 세션은 외부 egress가 차단돼 페이지 실재 **미검증**). 추가로 advisory 경계를 명문화했다: 지표는 CI를 붉히지 않지만 스크립트 실행 실패는 여전히 스텝을 실패시킨다. 게이트: `npm test` 299/299, `typecheck`·`typecheck:runtime` pass, 위반 주입 10건 각각 실패 확인 + backfill→verified 전환 시 freshness가 되살아나는 동작 확인.
  - **환경 한계(코드 아님)**: 이 세션의 `health:runtime` e2e 단계는 pre-installed 브라우저가 `chromium_headless_shell-1194`인데 `@playwright/test ^1.59.1`이 `-1217`을 찾아 launch에 실패한다. `executablePath=/opt/pw-browsers/chromium` 오버레이로 같은 스펙을 돌려 **28 smoke 전부 통과**를 확인했다. CI(`npx playwright install`)에서는 해당되지 않는다.
- 2026-08-02 미해결로 남긴 것(리뷰에서 실측 확인, 별도 라운드 필요): ① sitemap `lastmod` 145건 중 **121건이 빌드 타임스탬프** — LatTm 콘텐츠 최종 변경 2026-06-23·JapTm 2026-07-01인데 둘 다 배포 시각을 신고해, 배포마다 전 코퍼스가 갱신됐다고 거짓 신호를 낸다. ② 라이브 `<title>` 중복 4클러스터 10건(`서문 | GloTm` 4건은 관할 구분 없음), `description` 7건이 동일 placeholder `도입 MexTm 가이드 챕터.`. ③ **claim staleness가 어떤 게이트도 붉히지 못한다** — `audit:facts`·`check:consistency`는 어느 워크플로에도 없고(ci.yml은 health 3레인만), `audit-staleness.ts`는 `level: "warning"`이라 exit 0이며, `health-report.test.ts`는 시계를 2026-06-10에·`scorecard.test.ts`는 2026-07-20에 고정해 실제 경과일이 평가되지 않는다. EuTm claim 10건 2026-08-08 만료도 자동으로는 아무도 알리지 않는다. ④ `factual-qa-rollout.md` 18·57·365행이 "JapTm은 root shortcut-refresh 예외"라 단정하나 `content:japan`은 full pipeline이다.

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
