# GloTm Briefs Lane

이 문서는 주간 브리프(Hot Global TM Brief) lane의 운영 계약이다.
lane의 정본 콘텐츠와 이슈 인벤토리는 런타임 [`../src/briefs/archive.ts`](../src/briefs/archive.ts)이며, 이 문서는 그 위에서 cadence·provenance·publish 게이트 규칙만 잠근다.
발행 **앞단**(소스 등록부·후보 백로그·sweep)은 [`briefs-discovery.md`](briefs-discovery.md)가 정본이다. 두 계약은 중복하지 않는다.
현재 phase·우선순위 authority는 계속 [`../PROJECT-OVERVIEW.md`](../PROJECT-OVERVIEW.md), 실행 명령은 [`../README.md`](../README.md)를 기준으로 본다.

## Lane 정의

- Brief lane은 GloTm의 시의성 유기 진입면이다. 7개 상표 가이드가 느리게 움직이는 동안, 이 lane은 한국 통상·IP 뉴스에 밀착한 운영 브리프로 fresh surface를 유지한다.
- 현재 `Phase 2.5`(프로모션 없는 유기 색인 운영)의 1급 운영 lane이다. 색인·유기 진입을 만드는 surface이지, pricing/email-gate(`Phase 3`) lane이 아니다.
- 최신 이슈는 Gateway 첫 화면과 trust-layer의 latest surface로 노출된다(`getLatestBriefIssue`).

## 정본과 인벤토리

- 정본 콘텐츠 + 이슈 인벤토리: `../src/briefs/archive.ts`의 `briefIssueSource`. 런타임은 `briefIssues`(publish 최신순 정렬)로 소비한다.
- 이 lane은 운영 문서에 brief-by-brief 목록을 손으로 복제하지 않는다. 중복 목록은 드리프트를 만든다.
- 인벤토리 개수·날짜 범위·최신 이슈는 하드코딩하지 않고 `briefIssues` / `getLatestBriefIssue`에서 직접 읽는다. 현재 인벤토리는 `2026-03` 시작분부터 누적된다.

## Cadence 계약

- 목표 cadence는 활성 기간 주간 1회이며, 라벨은 이슈별 `cadenceLabel`("주간 브리프" 기본, 시즌 정리형은 "월간 브리프")로 둔다.
- 단, 1인 운영·재직 제약을 고려해 hard SLA는 두지 않는다. 주간을 못 맞춘 주가 있어도 강등·재촉 대상이 아니다(freshness 트레드밀 방지).
- 대신 lane integrity 규칙을 강제한다: 이슈 publish 날짜는 서로 겹치지 않고(하루 1이슈), archive는 항상 publish 최신순으로 정렬된 상태를 유지한다.
- 새 이슈가 latest가 되면 `archive.test.ts`의 latest-issue lock 기대값을 함께 갱신한다.

## Provenance 규칙

- 매 이슈는 datable public trigger에서 출발한다. 본문(`bodyParagraphs` / `whatChanged`)은 기존 이슈처럼 발표 기관·매체와 날짜를 명시한다(예: "5월 12일 식약처…", "5월 4일 지식재산처 출원공고…").
- slug는 `YYYY-MM-…` 접두사를 쓰고, 그 연·월을 `publishedAt`의 연·월과 일치시킨다.
- `jurisdictions` 태그를 최소 1개 이상 단다(시장·주제 분류).
- 각 item의 `relatedGuideLinks`는 live guide 경로로만 연결한다(`getProductPathBySlug`).
- 출처를 구조화 메타데이터로 재가공하지 않는다. 사실 재가공은 오기 위험이 있으므로, 출처는 저자가 쓴 본문 인용을 정본으로 본다(정확성 우선).
- **본문이 유보한 명제를 `summary`·`headline`에서 단정하지 않는다.** 요약과 헤드라인은 아카이브·Gateway 카드와 검색 결과에 본문 없이 단독으로 노출되므로 본문보다 넓게 읽힌다. 본문에 "확인이 필요하다"를 적어 두는 것만으로는 독자를 보호하지 못하고, 요약만 읽은 독자와 본문까지 읽은 독자가 서로 다른 결론을 갖게 된다. 유보가 붙은 사실은 요약·헤드라인에서도 유보를 달거나 아예 쓰지 않는다.
  - 이 규칙은 2026-09-12 `2026-09-mexico-lfppi-transitional-scope-correction` 라운드에서 나왔다. 20호는 본문 두 곳에서 "발효 전 접수된 사건에 어떤 규칙이 적용되는지는 확인이 필요하다"고 적고도 요약·헤드라인에서는 "이미 새 규칙 아래 있습니다"라고 단정했다.
- **법령 개정 소재는 공포일·발효일·적용범위를 분리해 쓴다.** 앞의 둘은 관보 첫 줄과 보도자료에 있지만, 이미 진행 중인 절차에 미치는 범위는 부칙(transitional provisions)에 있고 해설 기사에서는 자주 빠진다. 부칙을 확인하지 않았다면 "발효했으니 적용된다"로 메우지 않고 확인 대상으로 남긴다.
- **정정호는 반대 방향을 새로 단정하지 않는다.** 확인 없이 단정한 것을 확인 없이 뒤집으면 같은 잘못을 부호만 바꿔 반복하는 것이다. 1차 출처를 대조하지 못한 상태의 정정은 앞 호의 단정을 **철회**하고, 무엇을 확인해야 답이 나오는지까지만 적는다.

## 정정 규칙 (supersession)

브리프는 발행일 시점의 사실을 적는 surface이므로 **본문을 소급 수정하지 않는다**. 대신 이후 이슈가 앞 이슈의 사실을 정정하면, 앞 이슈에 `supersededBy` 포인터를 단다.

- 필요한 이유: 검색으로 옛 이슈에 도착한 독자는 뒤 이슈를 보지 않는다. 뒤 이슈에서 앞 이슈를 언급하는 것만으로는 정정이 독자에게 닿지 않는다.
- 형태: `supersededBy: { slug, updatedAt, note }` (`../src/briefs/archiveLegacy.ts`). `slug`는 정정본 이슈, `note`는 무엇이 바뀌었는지 한 문단, `updatedAt`은 포인터를 기록한 날짜다.
- 표면: 이슈 페이지 상단 고지 + 아카이브/Gateway 카드의 `이후 이슈에서 정정됨` 배지 + prerender HTML 본문 앞. `lastModified`·JSON-LD `dateModified`도 `updatedAt`으로 갱신돼 재크롤 신호가 남는다.
- 이는 가이드 본문에 쓰는 forward-dated note(예: `ChaTm` 제6장 `2027-01-01 시행 예고`)와 같은 역할을 브리프 lane에서 하는 장치다.
- 구조 강제: `../src/briefs/archive.test.ts`의 `brief lane contract`가 정정본 실재 여부, 발행 순서(정정본이 나중), 자기참조 금지, `updatedAt` 유효성을 검사한다.

정정본이 **없는** 상태로 옛 이슈 본문만 고치는 것은 이 lane의 방식이 아니다. 사실이 바뀌었으면 새 이슈를 쓰고 포인터를 단다.

## 시한 규칙 (time-sensitive)

브리프는 시한 있는 소재를 자주 다룬다(모집 마감, 창구 전환 병행 기간). 그 시한이 지나면 본문의
현재형 서술은 과거가 되는데, **본문은 소급 수정하지 않는다**(위 정정 규칙과 같은 이유). 그래서
만료는 본문이 아니라 메타데이터로 선언하고 **렌더 시점에 판정**한다.

- `supersededBy`와 혼동하지 않는다. 정정은 "이 이슈가 틀렸다"이고, 시한은 **"틀린 적이 없고 시효가
  지났다"**이다. 둘은 직교하며 한 이슈가 동시에 가질 수 있다(이슈 페이지에서는 정정 고지가 먼저 온다).
- 형태: `timeSensitive: { closesOn, label, note }` (`../src/briefs/archiveLegacy.ts`).
  - `closesOn` — 시한의 **마지막 날**(= 그날까지 유효). `publishedAt`과 같은 UTC 자정 ISO 문자열로 적는다.
  - `label` — 무엇이 닫히는가. 고지에 그대로 노출되므로 한 줄.
  - `note` — **시한이 지난 뒤에도 남는 것**. 만료 고지 본문이 된다.
- **`note`는 발행 회차에서 쓴다.** 만료된 다음에 채우는 구조라면 그때 누군가 이 이슈를 기억해야 하고,
  기억하지 못하면 장치가 없는 것과 같다. 시한 있는 소재를 발행하면서 "지난 뒤에 무엇이 남는가"를
  적을 수 없다면, 그 소재는 애초에 브리프 한 호를 쓸 만한 소재가 아니다.
- **만료 판정 시간대는 KST다.** `closesOn`이 끝나는 순간, 즉 그 다음 날 0시 KST부터 만료로 본다.
  이 lane의 독자도 소재(한국 기관 공고·국내 마감)도 한국 시간을 쓰므로, UTC 자정으로 판정하면
  마감 당일 오전 9시부터 "지났다"고 말하게 된다. 판정 정본은 `../src/briefs/archive.ts`의
  `resolveBriefExpiry(issue, now)`이며 UI·prerender·테스트가 같은 함수를 쓴다.
- 표시 면: 이슈 페이지 상단 고지 + 아카이브·게이트웨이 카드 배지 + 게이트웨이 최신 브리프 배너 배지
  + prerender HTML(본문 앞).
- **prerender는 빌드 시각으로 판정한다.** 정적 HTML은 배포 사이에 스스로 만료로 넘어가지 못하므로,
  크롤러가 보는 표면은 `closesOn` 이후 **첫 배포**에서 따라온다. JS를 실행하는 독자는 셸이 마운트하며
  로드 시각으로 다시 판정하므로 항상 정확하다. 이 지연은 설계상 알려진 것이고 숨기지 않는다.
- **`lastModified`는 움직이지 않는다.** 시한이 지나도 문서가 수정된 것은 아니고 달라지는 것은 읽는
  시점의 렌더다. `closesOn`을 수정일로 올리면 하지 않은 수정을 크롤러에 주장하게 된다
  (`getBriefLastModified`는 계속 `supersededBy.updatedAt ?? publishedAt`이다).
- 구조 강제는 `../src/briefs/archive.test.ts`의 `brief lane contract`가 한다 — UTC 자정 형식,
  발행일 이전 마감 금지, `label`·`note` 필수, KST 경계 판정.

## Publish QA 게이트

브리프를 추가·수정한 뒤 아래를 확인한다.

- [ ] `npm run test` 통과 (`brief lane contract` + latest-issue lock 포함)
- [ ] 새 이슈가 latest면 `../src/briefs/archive.test.ts` latest-issue 기대값 갱신
- [ ] slug 날짜 접두사 = `publishedAt` 연·월
- [ ] `cadenceLabel` ∈ {`주간 브리프`, `월간 브리프`}
- [ ] `jurisdictions` ≥ 1, 각 item core copy(`headline` / `whatChanged` / `whoShouldCare` / `whyItMatters` / `nextAction`) 채움
- [ ] `relatedGuideLinks`가 live guide로 연결 (registry 경로 대조까지 테스트가 강제)
- [ ] 이번 이슈가 앞 이슈의 사실을 정정한다면 앞 이슈에 `supersededBy` 추가 (위 `정정 규칙`)
- [ ] `summary`와 각 item `headline`에 적은 단정이 `bodyParagraphs`의 유보와 어긋나지 않는지 대조 (위 `Provenance 규칙`) — 구조 테스트가 잡지 못하는 항목이므로 발행자가 직접 읽는다
- [ ] 이번 이슈가 **날짜가 박힌 시한**(모집 마감, 병행 기간 종료 등)을 다룬다면 `timeSensitive` 선언 — `closesOn`·`label`과 함께 **지난 뒤에 남는 것**을 `note`에 지금 적는다 (위 `시한 규칙`)
- [ ] 이 이슈의 후보를 `../src/briefs/discovery.ts`에서 `published` + `publishedAs`로 전이 ([`briefs-discovery.md`](briefs-discovery.md))

위 구조 규칙은 [`../src/briefs/archive.test.ts`](../src/briefs/archive.test.ts)의 `brief lane contract`에서 자동 강제된다. **문서는 설명, 테스트는 게이트다.**

## 경계 (하지 않는 것)

- 운영 문서에 brief 목록을 손으로 복제하지 않는다(정본은 `archive.ts`).
- 브리프 하나를 근거로 공식 포지셔닝·우선순위를 바꾸지 않는다(taskboard committee-warning 규칙과 동일).
- pricing·email-gate·구독 유도를 이 lane에서 시작하지 않는다(`Phase 3` 트리거 이후).
- 출처를 추정으로 채우지 않는다.

## Authority

- lane 콘텐츠·인벤토리 정본: `../src/briefs/archive.ts`
- lane 구조 게이트: `../src/briefs/archive.test.ts`
- 발굴(upstream) 계약: [`briefs-discovery.md`](briefs-discovery.md), 정본 `../src/briefs/discovery.ts`
- 현재 phase 위치: `../PROJECT-OVERVIEW.md` (`Phase 2.5`)
- 운영 taskboard: [`current-ops-taskboard.md`](current-ops-taskboard.md)
