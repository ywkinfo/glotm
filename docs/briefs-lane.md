# GloTm Briefs Lane

이 문서는 주간 브리프(Hot Global TM Brief) lane의 운영 계약이다.
lane의 정본 콘텐츠와 이슈 인벤토리는 런타임 [`../src/briefs/archive.ts`](../src/briefs/archive.ts)이며, 이 문서는 그 위에서 cadence·provenance·publish 게이트 규칙만 잠근다.
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

## 정정 규칙 (supersession)

브리프는 발행일 시점의 사실을 적는 surface이므로 **본문을 소급 수정하지 않는다**. 대신 이후 이슈가 앞 이슈의 사실을 정정하면, 앞 이슈에 `supersededBy` 포인터를 단다.

- 필요한 이유: 검색으로 옛 이슈에 도착한 독자는 뒤 이슈를 보지 않는다. 뒤 이슈에서 앞 이슈를 언급하는 것만으로는 정정이 독자에게 닿지 않는다.
- 형태: `supersededBy: { slug, updatedAt, note }` (`../src/briefs/archiveLegacy.ts`). `slug`는 정정본 이슈, `note`는 무엇이 바뀌었는지 한 문단, `updatedAt`은 포인터를 기록한 날짜다.
- 표면: 이슈 페이지 상단 고지 + 아카이브/Gateway 카드의 `이후 이슈에서 정정됨` 배지 + prerender HTML 본문 앞. `lastModified`·JSON-LD `dateModified`도 `updatedAt`으로 갱신돼 재크롤 신호가 남는다.
- 이는 가이드 본문에 쓰는 forward-dated note(예: `ChaTm` 제6장 `2027-01-01 시행 예고`)와 같은 역할을 브리프 lane에서 하는 장치다.
- 구조 강제: `../src/briefs/archive.test.ts`의 `brief lane contract`가 정정본 실재 여부, 발행 순서(정정본이 나중), 자기참조 금지, `updatedAt` 유효성을 검사한다.

정정본이 **없는** 상태로 옛 이슈 본문만 고치는 것은 이 lane의 방식이 아니다. 사실이 바뀌었으면 새 이슈를 쓰고 포인터를 단다.

## Publish QA 게이트

브리프를 추가·수정한 뒤 아래를 확인한다.

- [ ] `npm run test` 통과 (`brief lane contract` + latest-issue lock 포함)
- [ ] 새 이슈가 latest면 `../src/briefs/archive.test.ts` latest-issue 기대값 갱신
- [ ] slug 날짜 접두사 = `publishedAt` 연·월
- [ ] `cadenceLabel` ∈ {`주간 브리프`, `월간 브리프`}
- [ ] `jurisdictions` ≥ 1, 각 item core copy(`headline` / `whatChanged` / `whoShouldCare` / `whyItMatters` / `nextAction`) 채움
- [ ] `relatedGuideLinks`가 live guide로 연결 (registry 경로 대조까지 테스트가 강제)
- [ ] 이번 이슈가 앞 이슈의 사실을 정정한다면 앞 이슈에 `supersededBy` 추가 (위 `정정 규칙`)

위 구조 규칙은 [`../src/briefs/archive.test.ts`](../src/briefs/archive.test.ts)의 `brief lane contract`에서 자동 강제된다. **문서는 설명, 테스트는 게이트다.**

## 경계 (하지 않는 것)

- 운영 문서에 brief 목록을 손으로 복제하지 않는다(정본은 `archive.ts`).
- 브리프 하나를 근거로 공식 포지셔닝·우선순위를 바꾸지 않는다(taskboard committee-warning 규칙과 동일).
- pricing·email-gate·구독 유도를 이 lane에서 시작하지 않는다(`Phase 3` 트리거 이후).
- 출처를 추정으로 채우지 않는다.

## Authority

- lane 콘텐츠·인벤토리 정본: `../src/briefs/archive.ts`
- lane 구조 게이트: `../src/briefs/archive.test.ts`
- 현재 phase 위치: `../PROJECT-OVERVIEW.md` (`Phase 2.5`)
- 운영 taskboard: [`current-ops-taskboard.md`](current-ops-taskboard.md)
