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
  url: string;
  // primary = 기관 공식면, secondary = 업계 매체. 매체는 실제 인용 URL이 저장소에 남은 뒤 등록한다.
  tier: BriefSourceTier;
  jurisdictions: string[];
  // 이 소스가 소재를 대는 live guide. registry.ts의 slug와 대조된다.
  relatedProductSlugs: string[];
  sweepCadence: BriefSweepCadence;
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

export type BriefSweep = {
  sweptOn: string;
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
    tier: "primary",
    jurisdictions: ["Europe"],
    relatedProductSlugs: ["europe"],
    sweepCadence: "weekly"
  },
  {
    id: "eu-customs-reform",
    label: "European Commission Taxation and Customs — EU Customs Reform",
    url: "https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en",
    tier: "primary",
    jurisdictions: ["Europe"],
    relatedProductSlugs: ["europe"],
    sweepCadence: "event-driven",
    notes: "EuTm fact log 2026-08-02 감시 항목(AFA·IPEP·COPIS 장기 승계)의 근거면."
  },
  {
    id: "govuk-ipo",
    label: "GOV.UK — UKIPO 상표 가이던스·수수료",
    url: "https://www.gov.uk/",
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
    tier: "primary",
    jurisdictions: ["United States"],
    relatedProductSlugs: ["usa"],
    sweepCadence: "weekly"
  },
  {
    id: "cbp-ipr",
    label: "U.S. Customs and Border Protection — IPR 보호",
    url: "https://www.cbp.gov/trade/priority-issues/ipr/protection",
    tier: "primary",
    jurisdictions: ["United States"],
    relatedProductSlugs: ["usa"],
    sweepCadence: "monthly"
  },
  {
    id: "jpo",
    label: "일본 특허청(JPO)",
    url: "https://www.jpo.go.jp/",
    tier: "primary",
    jurisdictions: ["Japan"],
    relatedProductSlugs: ["japan"],
    sweepCadence: "weekly"
  },
  {
    id: "impi",
    label: "IMPI(멕시코 산업재산청)",
    url: "https://www.impi.gob.mx/",
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
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "sic-colombia",
    label: "SIC(콜롬비아 산업통상감독청)",
    url: "https://www.sic.gov.co/",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "inpi-argentina",
    label: "INPI(아르헨티나) 온라인 절차 포털",
    url: "https://portaltramites.inpi.gob.ar/",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly"
  },
  {
    id: "wipo-madrid",
    label: "WIPO 마드리드 시스템",
    url: "https://www.wipo.int/madrid/",
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
    status: "watching",
    notes:
      "시행일 도달 전이라 아직 쓸 수 없다. 8월 말 이후 실제 시행·신청 개시가 확인되면 ready로 올린다. 관련 가이드는 인증 레이어가 대체하지 못하는 축(중국 해관 등록·멕시코 국경조치·EU AFA)을 기준으로 골랐다."
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
    status: "ready",
    notes:
      "가이드 본문 반영(UKTm 제8장 2026-07-21, EuTm 제8장·부록 2026-08-02)과 1차 출처 재대조가 모두 끝났는데 브리프 lane에는 나가지 않았다. 별도 취재 없이 바로 쓸 수 있는 후보다."
  }
];

// ---- sweep 로그 ----
//
// 최신순으로 유지한다(archive 정렬 계약과 동일). 산출이 없어도 기록한다.

export const briefSweepLog: BriefSweep[] = [
  {
    sweptOn: "2026-08-03",
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
      "부트스트랩 sweep — 저장소에 이미 기록돼 있던 감시 항목(브리프 본문·EuTm fact log·claim-map)을 후보로 옮긴 것이고, 1차 출처를 새로 실사한 회차가 아니다. 실사 sweep은 다음 회차부터."
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
