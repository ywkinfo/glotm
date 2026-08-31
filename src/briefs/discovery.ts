// 브리프 소재 발굴(discovery) lane의 정본 데이터다. 발행 계약(`archive.ts` + `docs/briefs-lane.md`)의
// 앞단, 즉 "어디를 보는가(sources) → 무엇을 쌓았는가(candidates) → 언제 봤는가(sweeps)"를 담는다.
// 운영 계약 설명은 `docs/briefs-discovery.md`, 구조 강제는 `discovery.test.ts`가 맡는다.
//
// 이 모듈은 ops 데이터이지 앱 런타임이 아니다. 리더 UI·prerender는 이 파일을 import하지 않으며
// (`discovery.test.ts`가 이를 가드한다), 소비자는 테스트와 `scripts/briefs-radar.ts`뿐이다.

import { liveShellProducts } from "../products/registry";

// 하네스 도입일. 이 날짜 이후 발행된 이슈부터 (1) 후보 백로그를 거쳤는지, (2) 정규 관할 태그를
// 달았는지를 강제한다. 그 이전 16개 이슈는 발행 시점 상태를 그대로 보존한다(브리프 lane의 소급
// 수정 금지 원칙과 같은 이유).
export const briefDiscoveryStartOn = "2026-08-03";

// 목표 발행 주기(일). radar가 경과일을 보여줄 때 쓰는 기준선일 뿐 SLA가 아니다.
// `docs/briefs-lane.md`가 hard SLA 없음을 명시적으로 잠갔다(freshness 트레드밀 방지).
export const briefCadenceTargetDays = 7;

// `watching` 상태로 이 기간을 넘기면 radar가 "정체"로 표시한다. 버리라는 뜻이 아니라
// 살릴지 버릴지를 한 번 판단하라는 신호다.
export const briefCandidateStaleDays = 30;

export type BriefSourceTier = "primary" | "secondary";

export type BriefSweepCadence = "weekly" | "monthly" | "event-driven";

export type BriefSource = {
  id: string;
  label: string;
  // 절대 https URL. 저장소에 이미 기록된 URL 또는 그 origin만 쓴다(추정 URL 금지).
  // 다수가 origin이라 "이 URL을 열었다"만으로는 sweep이 끝나지 않는다 — 완료 조건은 sweepTarget이 정의한다.
  url: string;
  // 무엇을 보면 이 소스의 sweep이 끝난 것인가. 넓은 루트 URL이 "무엇을 봐야 하는지"를 말해 주지
  // 못하는 문제를 메우는 필드다. 비워 둘 수 없다(테스트 강제).
  sweepTarget: string;
  // primary = 기관 공식면, secondary = 업계 매체. 매체는 실제 인용 URL이 저장소에 남은 뒤 등록한다.
  tier: BriefSourceTier;
  jurisdictions: string[];
  // 이 소스가 소재를 대는 live guide. registry.ts의 slug와 대조된다.
  relatedProductSlugs: string[];
  sweepCadence: BriefSweepCadence;
  // event-driven 소스에는 필수. 정해진 주기가 없으므로 "무엇이 오면 다시 보는가"를 적지 않으면
  // 그 소스는 아무도 다시 열지 않는다(테스트 강제).
  reviewTrigger?: string;
  notes?: string;
};

export type BriefCandidateStatus = "watching" | "ready" | "published" | "dropped";

export type BriefCandidate = {
  id: string;
  // 후보 단계의 가설 한 줄. 발행 시 headline으로 그대로 쓰라는 뜻은 아니다.
  headline: string;
  // datable public trigger. 발행 계약과 같은 기준으로 기관·매체·날짜를 명시한다.
  trigger: string;
  discoveredOn: string;
  sourceIds: string[];
  jurisdictions: string[];
  relatedProductSlugs: string[];
  status: BriefCandidateStatus;
  // status="published"면 archive의 이슈 slug를 가리킨다.
  publishedAs?: string;
  // status="dropped"면 필수. 이유를 남겨야 같은 소재를 다시 주워 오는 루프가 끊긴다.
  droppedReason?: string;
  notes?: string;
};

// sweep의 성격. `verified`는 소스를 실제로 열어 확인한 회차이고, `repository-backfill`은 저장소에
// 이미 기록돼 있던 감시 항목을 후보로 옮긴 회차다. 둘을 섞으면 freshness가 거짓말을 한다 —
// backfill은 후보의 출처 계보를 남기지만 "그 소스를 봤다"는 증거가 아니므로 freshness에서 제외된다.
export type BriefSweepKind = "verified" | "repository-backfill";

export type BriefSweep = {
  sweptOn: string;
  kind: BriefSweepKind;
  sourceIds: string[];
  // 산출이 없어도 빈 배열로 기록한다. "봤는데 없었다"도 운영 사실이다.
  foundCandidateIds: string[];
  note?: string;
};

// live guide 1개당 정규 관할 라벨 1개. 커버리지 집계에서 이슈 태그와 guide를 잇는 다리다.
export const jurisdictionByProductSlug: Record<string, string> = {
  latam: "Latin America",
  mexico: "Mexico",
  usa: "United States",
  japan: "Japan",
  china: "China",
  europe: "Europe",
  uk: "United Kingdom"
};

// guide에 매핑되지 않지만 lane이 실제로 쓰는 관할 축. Korea는 발신국, Global은 다국 공통 소재다.
const extraCanonicalJurisdictions = ["Korea", "Global"];

export const canonicalJurisdictions = [
  ...liveShellProducts.map((product) => jurisdictionByProductSlug[product.slug]),
  ...extraCanonicalJurisdictions
].filter((value): value is string => Boolean(value));

// 기존 16개 이슈는 `UK`와 `United Kingdom`, `Europe`과 `EU`를 섞어 썼다. 본문·태그를 소급 수정하는
// 대신 집계할 때만 정규화한다. 매핑에 없는 값은 주제 태그(예: `Counterfeit Damages`)로 보고
// undefined를 돌려준다.
//
// **이 별칭 표는 집계 전용이다.** 게이트로 쓰면 애초에 문제였던 `UK`·`EU`가 신규 데이터에서도
// 통과해 드리프트가 계속된다. 신규 데이터 검사는 아래 `isCanonicalJurisdiction`(literal 일치)을 쓴다.
const jurisdictionAliases: Record<string, string> = {
  "latin america": "Latin America",
  latam: "Latin America",
  "south america": "Latin America",
  mexico: "Mexico",
  mx: "Mexico",
  "united states": "United States",
  us: "United States",
  usa: "United States",
  japan: "Japan",
  jp: "Japan",
  china: "China",
  cn: "China",
  europe: "Europe",
  eu: "Europe",
  "european union": "Europe",
  "united kingdom": "United Kingdom",
  uk: "United Kingdom",
  "great britain": "United Kingdom",
  korea: "Korea",
  kr: "Korea",
  "south korea": "Korea",
  global: "Global",
  worldwide: "Global"
};

export function normalizeJurisdictionTag(tag: string) {
  return jurisdictionAliases[tag.trim().toLowerCase()];
}

// 신규 데이터용 게이트. 별칭을 접지 않고 정규 라벨과 그대로 일치해야 한다.
// 즉 `United Kingdom`은 통과하고 `UK`는 통과하지 못한다.
export function isCanonicalJurisdiction(tag: string) {
  return canonicalJurisdictions.includes(tag);
}

export function hasCanonicalJurisdiction(tags: string[]) {
  return tags.some((tag) => isCanonicalJurisdiction(tag));
}

// 집계 전용. legacy 이슈의 `UK`·`EU`를 접어 커버리지를 계산할 때만 쓴다.
export function getCanonicalJurisdictions(tags: string[]) {
  const normalized = tags
    .map((tag) => normalizeJurisdictionTag(tag))
    .filter((value): value is string => Boolean(value));

  return [...new Set(normalized)];
}

// ---- 소스 등록부 ----
//
// 등록 규칙: URL은 저장소에 이미 기록된 값 또는 그 origin만 쓴다. 근거는 각 워크스페이스의
// `content/research/*_source_register.md`·`claim-map.json`과 기존 브리프 본문이다.
// 인용 기록이 없는 매체를 추정 URL로 등록하지 않는다(`docs/briefs-lane.md`: 출처를 추정으로 채우지 않는다).

export const briefSources: BriefSource[] = [
  {
    id: "cnipa-official",
    label: "국가지식산권국(CNIPA) 공식 사이트",
    url: "https://www.cnipa.gov.cn/",
    sweepTarget:
      "메인 뉴스·정책 게시 목록 상단에서 마지막 verified sweep 이후 게시물. 상표법·시행규정 관련 항목만 후보로 본다.",
    tier: "primary",
    jurisdictions: ["China"],
    relatedProductSlugs: ["china"],
    sweepCadence: "weekly",
    notes:
      "2026-07-11호가 인용한 개정 상표법 공포·해설 기사가 이 사이트 게재분이다. ChaTm claim-map의 CNIPA 근거 URL과 같은 origin."
  },
  {
    id: "cnipa-trademark-office",
    label: "CNIPA 상표국(商标局) 통지공고면",
    url: "https://sbj.cnipa.gov.cn/",
    sweepTarget:
      "통지공고(通知公告) 목록 상단에서 마지막 verified sweep 이후 게시물. 수수료·서식·절차 변경 고지를 우선한다.",
    tier: "primary",
    jurisdictions: ["China"],
    relatedProductSlugs: ["china"],
    sweepCadence: "weekly",
    notes: "ChaTm이 기록한 출원 안내·통지공고 URL의 origin. 수수료·서식·절차 변경이 먼저 뜨는 면이다."
  },
  {
    id: "samr",
    label: "국가시장감독관리총국(SAMR)",
    url: "https://www.samr.gov.cn/",
    sweepTarget:
      "행정 집행·시장감독 공고 목록에서 상표 오인 유발형 사용·부정경쟁 관련 항목.",
    tier: "primary",
    jurisdictions: ["China"],
    relatedProductSlugs: ["china"],
    sweepCadence: "monthly",
    notes: "오인 유발형 사용·행정 집행 축. 개정 상표법 후속 집행기준이 여기서 갈릴 수 있다."
  },
  {
    id: "kipo",
    label: "지식재산처(KIPO)",
    url: "https://www.kipo.go.kr/",
    sweepTarget:
      "보도자료·공지 목록 상단에서 마지막 verified sweep 이후 게시물. 해외 출원 지원·집행 프로그램·제도 시행 고지를 본다.",
    tier: "primary",
    jurisdictions: ["Korea"],
    relatedProductSlugs: ["latam", "mexico", "usa", "japan", "china", "europe", "uk"],
    sweepCadence: "weekly",
    notes:
      "발신국 축. K-브랜드 지원·해외 집행 프로그램은 특정 가이드가 아니라 포트폴리오 전반에 소재를 댄다."
  },
  {
    id: "euipo",
    label: "EUIPO",
    url: "https://www.euipo.europa.eu/",
    sweepTarget:
      "뉴스·공지 목록 상단에서 마지막 verified sweep 이후 게시물. 수수료·심사기준·Guidelines 개정 고지를 우선한다.",
    tier: "primary",
    jurisdictions: ["Europe"],
    relatedProductSlugs: ["europe"],
    sweepCadence: "weekly"
  },
  {
    id: "eu-customs-reform",
    label: "European Commission Taxation and Customs — EU Customs Reform",
    url: "https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en",
    sweepTarget:
      "EU Customs Reform 페이지의 입법 진행 상태(합의·채택·발효 일정) 변경 여부. 페이지 자체가 갱신되지 않으면 후보 없음으로 기록한다.",
    tier: "primary",
    jurisdictions: ["Europe"],
    relatedProductSlugs: ["europe"],
    sweepCadence: "event-driven",
    reviewTrigger:
      "EU Customs Reform 입법이 다음 단계로 넘어갈 때(이사회·의회 채택, 관보 게재, 발효일 확정) 또는 EuTm fact log가 적어 둔 2028년경 재확인 시점.",
    notes: "EuTm fact log 2026-08-02 감시 항목(AFA·IPEP·COPIS 장기 승계)의 근거면."
  },
  {
    id: "govuk-ipo",
    label: "GOV.UK — UKIPO 상표 가이던스·수수료",
    url: "https://www.gov.uk/",
    sweepTarget:
      "UKIPO 관련 publications·guidance의 'Last updated' 날짜가 마지막 verified sweep 이후로 바뀐 항목. 수수료표·comparable UK mark 안내를 우선한다.",
    tier: "primary",
    jurisdictions: ["United Kingdom"],
    relatedProductSlugs: ["uk", "europe"],
    sweepCadence: "weekly",
    notes: "UKTm·EuTm의 UK claim 다수가 이 origin을 1차 출처로 쓴다(수수료·comparable UK mark 등)."
  },
  {
    id: "uspto",
    label: "USPTO",
    url: "https://www.uspto.gov/",
    sweepTarget:
      "뉴스·공지와 수수료/규칙 변경 고지 중 마지막 verified sweep 이후 항목.",
    tier: "primary",
    jurisdictions: ["United States"],
    relatedProductSlugs: ["usa"],
    sweepCadence: "weekly"
  },
  {
    id: "cbp-ipr",
    label: "U.S. Customs and Border Protection — IPR 보호",
    url: "https://www.cbp.gov/trade/priority-issues/ipr/protection",
    sweepTarget:
      "IPR 보호 페이지의 집행 통계·절차 안내 갱신 여부와 신규 고지.",
    tier: "primary",
    jurisdictions: ["United States"],
    relatedProductSlugs: ["usa"],
    sweepCadence: "monthly"
  },
  {
    id: "jpo",
    label: "일본 특허청(JPO)",
    url: "https://www.jpo.go.jp/",
    sweepTarget:
      "공지·제도 개정 안내 목록 상단에서 마지막 verified sweep 이후 게시물.",
    tier: "primary",
    jurisdictions: ["Japan"],
    relatedProductSlugs: ["japan"],
    sweepCadence: "weekly"
  },
  {
    id: "impi",
    label: "IMPI(멕시코 산업재산청)",
    url: "https://www.impi.gob.mx/",
    sweepTarget:
      "보도자료(prensa)·서식·수수료 안내 중 마지막 verified sweep 이후 갱신 항목.",
    tier: "primary",
    jurisdictions: ["Mexico"],
    relatedProductSlugs: ["mexico", "latam"],
    sweepCadence: "weekly",
    notes: "2026-07-21 라운드의 MX-FEE-001(서식 IMPI-00-014) 정정도 이 기관 자료에서 나왔다."
  },
  {
    id: "inapi-chile",
    label: "INAPI(칠레)",
    url: "https://www.inapi.cl/",
    sweepTarget:
      "뉴스(noticias) 목록 상단에서 마지막 verified sweep 이후 게시물.",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "sic-colombia",
    label: "SIC(콜롬비아 산업통상감독청)",
    url: "https://www.sic.gov.co/",
    sweepTarget:
      "산업재산 관련 공지·결의 목록에서 마지막 verified sweep 이후 항목.",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "inpi-argentina",
    label: "INPI(아르헨티나) 온라인 절차 포털",
    url: "https://portaltramites.inpi.gob.ar/",
    sweepTarget:
      "절차·수수료 안내 페이지의 갱신 여부. 뉴스 피드가 아니므로 변경 감지 위주로 본다.",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "wipo-madrid",
    label: "WIPO 마드리드 시스템",
    url: "https://www.wipo.int/madrid/",
    sweepTarget:
      "마드리드 시스템 공지(information notice)·개별수수료·가입국 변경 중 마지막 verified sweep 이후 항목.",
    tier: "primary",
    jurisdictions: ["Global"],
    relatedProductSlugs: ["latam", "mexico", "usa", "japan", "china", "europe", "uk"],
    sweepCadence: "monthly",
    notes: "개별 수수료·가입국 변경은 전 가이드의 출원 경로 판단에 동시에 닿는다."
  }
];

// ---- 후보 백로그 ----
//
// append 대상이다. 새 후보는 아래 배열 끝에 추가하고, 상태가 바뀌면 그 자리에서 status를 옮긴다.
// 시드 4건은 전부 저장소에 이미 기록돼 있던 감시 항목이며, 새 법률 사실을 만들지 않았다.

export const briefCandidates: BriefCandidate[] = [
  {
    id: "2026-08-kbrand-certification-launch",
    headline:
      "K-브랜드 정부인증 사용 신청이 열리면, 인증 레이어와 별개로 기업 자신의 등록·세관·증거 공백을 어떤 순서로 메울지가 실무 질문이 된다",
    trigger:
      "2026-07-04호가 기록한 지식재산처 5월 28일 브리핑 예고 — K-브랜드 정부인증 제도의 8월 말 본격 시행과 기업 사용 신청 개시. 시행 여부와 사용 신청 절차 공개를 지식재산처 공식 채널에서 확인해야 한다.",
    discoveredOn: "2026-08-03",
    sourceIds: ["kipo"],
    jurisdictions: ["Korea", "Certification Mark"],
    relatedProductSlugs: ["china", "mexico", "europe"],
    status: "published",
    publishedAs: "2026-08-kbrand-certification-first-round-rights-gap",
    notes:
      "2026-08-30 sweep에서 트리거 발화를 확인해 watching → ready. 지식재산처 2026-08-24 보도자료(게시물 21009)를 직접 열었다: 「2026년 K-브랜드 정부인증제도」 1차 참여기업 모집 2026-08-24~2026-09-11(3주), 정부가 권리자인 국가인증상표를 73개국에 출원·등록해 선정 기업이 사용, 최대 2억원 정품인증기술 도입비 지원(중소 자부담 50%·현물 중소 20%/중견 10%, 대기업은 비용 지원 없이 상표 사용 신청만 가능), 신청 창구는 한국지식재산보호원(koipa.re.kr/k-brand)·지식재산보호종합포털(ip-navi.or.kr). 브리프 각도는 참여요건 (1)이 그대로 준다 — 국가인증상표를 쓰려는 해외 국가에 **기업 자신의 상표가 이미 출원 또는 등록돼 있어야 한다**. 즉 인증 레이어는 기업 자신의 권리 공백을 대체하지 않으며, 9월 11일 마감 전에 대상국 등록 상태부터 확인해야 한다는 것이 실무 질문이다. 관련 가이드는 인증 레이어가 대체하지 못하는 축(중국 해관 등록·멕시코 국경조치·EU AFA)을 기준으로 골랐다. 2026-08-31 발행 — 본문 사실은 2026-08-30 verified sweep이 기록한 보도자료 대조 내용에서만 가져왔고, 이 발행 라운드에서는 소스를 새로 열지 못했으므로(이 세션에서 moip.go.kr·kipo.go.kr·koipa.re.kr 모두 CONNECT 403) sweep 회차를 추가하지 않는다. 함께 2026-07-04호에 supersededBy 포인터를 달아 예고 단계(8월 말 시행·70개국)와 확정 내용(8월 24일~9월 11일 1차 모집·73개국·참여요건)의 차이가 옛 이슈 독자에게 닿게 했다."
  },
  {
    id: "2026-10-uspto-madrid-efiling-cutover",
    headline:
      "미국 기반 마드리드 출원 창구가 2026년 10월 1일 TEASi에서 Madrid e-Filing으로 완전히 넘어간다 — 미국을 본국관청으로 쓰는 포트폴리오는 전환 전에 계정과 수수료 경로를 정리해야 한다",
    trigger:
      "WIPO Madrid System 공지 2026-07-31 「Transition to Madrid e-Filing at the USPTO」. USPTO가 Madrid e-Filing에 합류(soft launch)했고, TEASi는 2026-09-30까지만 유지된다. 2026-10-01부터 미국 출원·등록에 기초한 신규 국제출원은 Madrid e-Filing이 유일한 창구가 된다. WIPO 수수료는 스위스 프랑으로 WIPO에 직접 납부하며, 사용에는 WIPO Account가 필요하다.",
    discoveredOn: "2026-08-30",
    sourceIds: ["wipo-madrid", "uspto"],
    jurisdictions: ["United States", "Global", "Madrid System"],
    relatedProductSlugs: ["usa"],
    status: "ready",
    notes:
      "2026-08-30 sweep에서 WIPO Madrid System 뉴스 목록을 열어 확인했다(https://www.wipo.int/en/web/madrid-system/w/news/2026/transition-to-madrid-efiling-at-the-uspto). 날짜가 박힌 마감이 있어 바로 쓸 수 있다: 2026-07-31~09-30 병행, 10-01 단일 창구. UsaTm은 마지막 브리프 등장 2026-08-08 이후 열린 후보가 0건이었고 claim-map에 uspto-madrid-outbound 소스를 이미 들고 있어 연결이 자연스럽다. 발행 시 확인할 것: 이 전환은 '미국을 본국관청으로 하는 outbound 국제출원' 창구 변경이며, 한국 기업이 KIPO를 본국관청으로 쓰는 경로에는 영향이 없다는 점을 본문에서 분명히 구분한다."
  },
  {
    id: "2027-china-implementing-rules",
    headline:
      "개정 중국 상표법의 직권 불사용취소 절차와 오인 유발형 사용 집행기준이 후속 시행규정으로 공개되면 재고조사 체크리스트를 갱신해야 한다",
    trigger:
      "2026-07-11호가 남긴 계속 확인 대상 — 개정 상표법은 2026년 6월 26일 국가주석령 제77호로 공포되고 2027년 1월 1일 시행이 확정됐으나, 직권 불사용취소의 세부 절차와 오인 유발형 사용의 집행기준은 후속 시행규정·집행지침에서 구체화된다.",
    discoveredOn: "2026-08-03",
    sourceIds: ["cnipa-official", "cnipa-trademark-office", "samr"],
    jurisdictions: ["China", "Trademark Law Reform"],
    relatedProductSlugs: ["china"],
    status: "watching",
    notes:
      "시행 전까지 열려 있는 후보다. 시행규정이 실제로 공개되기 전에는 '아직 안 나왔다'가 본문의 대부분이 되므로 발행하지 않는다."
  },
  {
    id: "2026-08-eu-customs-reform-watch",
    headline:
      "EU Customs Reform이 AFA·IPEP·COPIS 계층을 언제부터 대체하는지 확정되면 EU 세관 집행 준비 순서가 바뀐다",
    trigger:
      "EuTm fact verification log 2026-08-02 감시 항목 — 2026-03-26 유럽의회·이사회 정치적 합의. EU Customs Authority와 EU Customs Data Hub가 회원국 세관 IT를 단계적으로 대체한다(전자상거래 2028 → 자율 2031 → 의무 2034). 현재 AFA·IPEP·COPIS 구조에는 변경이 없어 EuTm 본문에는 반영하지 않았다.",
    discoveredOn: "2026-08-03",
    sourceIds: ["eu-customs-reform", "euipo"],
    jurisdictions: ["Europe", "Customs Enforcement"],
    relatedProductSlugs: ["europe"],
    status: "watching",
    notes:
      "정치적 합의 단계이고 미발효다. 발행 트리거는 시행 일정이 법령으로 확정되는 시점이며, EuTm fact log는 2028년경 재확인으로 적어 뒀다."
  },
  {
    id: "2026-01-comparable-uk-mark-eu-use-cutoff",
    headline:
      "2026년 1월 1일부터 comparable UK mark의 불사용 방어에 EU 사용을 원용할 수 없다 — 경과 규정의 보호가 끝난 첫 해다",
    trigger:
      "EuTm claim-map `EU-UKUSE-001`(2026-08-02 신설·1차 출처 재대조 완료). GOV.UK의 comparable UK trade marks 안내 기준으로, 5년 look-back 구간이 2026-01-01부터 전부 2021-01-01 이후가 되어 EU 내 사용이 산입되지 않는다.",
    discoveredOn: "2026-08-03",
    sourceIds: ["govuk-ipo"],
    jurisdictions: ["United Kingdom", "Europe", "Non-Use Cancellation"],
    relatedProductSlugs: ["uk", "europe"],
    status: "published",
    publishedAs: "2026-08-comparable-uk-mark-eu-use-cutoff",
    notes:
      "가이드 본문 반영(UKTm 제8장 2026-07-21, EuTm 제8장·부록 2026-08-02)과 1차 출처 재대조가 모두 끝났는데 브리프 lane에는 나가지 않았다. 별도 취재 없이 바로 쓸 수 있는 후보다. 2026-08-24 발행 — 본문 사실은 EU-UKUSE-001(1차 출처 재대조 2026-08-02)과 UKTm claim-map(UK-NONUSE-001·UK-COMPARABLE-001·UK-BREXIT-001)에서만 가져왔고, 발행 라운드에서 소스를 새로 연 것은 아니므로 sweep 회차로 기록하지 않는다."
  },
  {
    id: "2026-08-kbrand-overseas-licensing-support",
    headline:
      "K-브랜드 해외 라이선싱 지원을 신청하기 전에 표장·권한·승인·정산·종료 구조를 한 장의 통제표로 정리해야 한다",
    trigger:
      "지식재산처 2026-08-03 보도자료 — 「2026년 K-브랜드 해외 상표권 보호·라이선싱 전략 지원 시범사업」 공고. 해외 권리 사용 허가 또는 가맹점 계약을 추진 중이거나 추진 예정인 중소·중견기업을 대상으로 계약 전반의 전문 자문을 지원하며 신청기간은 2026-08-03부터 2026-08-21까지다.",
    discoveredOn: "2026-08-08",
    sourceIds: ["kipo"],
    jurisdictions: ["Korea", "Trademark Licensing", "Franchising"],
    relatedProductSlugs: ["usa", "china", "europe"],
    status: "published",
    publishedAs: "2026-08-kbrand-overseas-licensing-control",
    notes:
      "1차 출처를 2026-08-08에 직접 대조했다: https://www.moip.go.kr/ko/kpoBultnDetail.do?aprchId=BUT0000029&menuCd=SCD0200618&ntatcSeq=20996&sysCd=SCD02. 기존 정부인증 후보는 정부 소유 인증표장의 보호 레이어이고, 이 후보는 기업 소유 상표의 사용허락·가맹·사용료·종료 통제를 다루는 수익화 레이어라 별개다."
  }
];

// ---- sweep 로그 ----
//
// 최신순으로 유지한다(archive 정렬 계약과 동일). 산출이 없어도 기록한다.

export const briefSweepLog: BriefSweep[] = [
  {
    sweptOn: "2026-08-30",
    kind: "verified",
    sourceIds: [
      "kipo",
      "wipo-madrid",
      "jpo",
      "cnipa-official",
      "cnipa-trademark-office"
    ],
    foundCandidateIds: [
      "2026-08-kbrand-certification-launch",
      "2026-10-uspto-madrid-efiling-cutover"
    ],
    note:
      "9월 만료 claim 재대조와 같은 라운드에서 돈 실사 회차다. 다섯 소스의 sweepTarget을 실제로 열었다. ⓐ kipo(지식재산처 보도자료 목록 + 2026-08-24 게시물 21009 본문): K-브랜드 정부인증제도 1차 모집 2026-08-24~09-11 확인 → watching 후보를 ready로 올렸다. ⓑ wipo-madrid(Madrid System News 목록): 2026-07-31 USPTO Madrid e-Filing 전환 공지 확인 → 신규 후보 등록(2026-10-01 TEASi 종료). ⓒ jpo(報道発表 2026年度 목록): 2026-07-01 이후 게시물은 7-27 JPO AI 비전, 7-22 INPIT 규슈 개설 두 건뿐으로 상표 실무 트리거 없음 — 산출 없음. ⓓ cnipa-official·cnipa-trademark-office(개정 상표법 專題 col3684, 综合消息 col3685, 「修订主要内容」 2026-07-10, 商标局 通知公告 ~2026-08-20): 商标法实施条例 개정 초안·의견수렴 공표 신호 없음 — 산출 없음. 후보 2027-china-implementing-rules는 watching 유지. samr·euipo·eu-customs-reform·govuk-ipo·uspto·cbp-ipr·impi·inapi-chile·sic-colombia·inpi-argentina는 이번 회차에서 열지 않았으므로 freshness를 갱신하지 않는다.",
  },
  {
    sweptOn: "2026-08-08",
    kind: "verified",
    sourceIds: ["kipo"],
    foundCandidateIds: ["2026-08-kbrand-overseas-licensing-support"],
    note:
      "지식재산처 공식 보도자료(게시물 20996)를 직접 열어 기관명·사업명·발표일·지원 대상·지원 내용과 2026-08-21 신청 마감을 대조했다. 이번 회차는 해당 발표를 확인한 KIPO 단일 소스 sweep이며, 다른 등록 소스의 freshness는 갱신하지 않는다."
  },
  {
    sweptOn: "2026-08-03",
    kind: "repository-backfill",
    sourceIds: [
      "cnipa-official",
      "cnipa-trademark-office",
      "samr",
      "kipo",
      "euipo",
      "eu-customs-reform",
      "govuk-ipo"
    ],
    foundCandidateIds: [
      "2026-08-kbrand-certification-launch",
      "2027-china-implementing-rules",
      "2026-08-eu-customs-reform-watch",
      "2026-01-comparable-uk-mark-eu-use-cutoff"
    ],
    note:
      "부트스트랩 backfill — 저장소에 이미 기록돼 있던 감시 항목(브리프 본문·EuTm fact log·claim-map)을 후보로 옮긴 회차다. 1차 출처를 연 적이 없으므로 freshness에 산입되지 않고, radar에서 이 소스들은 계속 never-verified로 남는다. 여기 적힌 sourceIds는 각 후보의 근거가 어느 소스 계열에서 왔는지를 남기는 계보 기록이다."
  }
];

export function getBriefSourceById(sourceId: string) {
  return briefSources.find((source) => source.id === sourceId);
}

export function getBriefCandidateById(candidateId: string) {
  return briefCandidates.find((candidate) => candidate.id === candidateId);
}

export function getBriefCandidatesByStatus(
  status: BriefCandidateStatus,
  candidates: BriefCandidate[] = briefCandidates
) {
  return candidates.filter((candidate) => candidate.status === status);
}
