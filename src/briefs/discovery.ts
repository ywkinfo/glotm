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
  },
  {
    id: "dof-mexico",
    label: "멕시코 연방관보(Diario Oficial de la Federación)",
    url: "https://dof.gob.mx/",
    sweepTarget:
      "DOF 검색(búsqueda)에서 마지막 verified sweep 이후 기간을 대상으로 propiedad industrial·marcas·reglamento 게재분을 훑어, LFPPI와 그 시행규칙·관련 decreto/acuerdo의 신규 공포·개정 게재 여부를 본다. 일자별 edición 전문을 읽는 것은 이 소스의 완료 조건이 아니다.",
    tier: "primary",
    jurisdictions: ["Mexico"],
    relatedProductSlugs: ["mexico", "latam"],
    sweepCadence: "monthly",
    notes:
      "공표 채널(관보) 축. 등록 소스 15개가 전부 기관 뉴스·안내면이라 '공포되었다'가 정의상 관측되는 면이 등록부에 없었고, 20호(멕시코 LFPPI 신 시행규칙)가 그 공백에서 나왔다 — 경위는 docs/briefs-discovery-latency-review.md D2. 2026-09-07 owner 지시(P2-1)로 등록했다. **URL 직접 대조 미완**: 이 세션에서 dof.gob.mx·www.dof.gob.mx·sidof.segob.gob.mx 전부 CONNECT 403이고 WebFetch도 EGRESS_BLOCKED라, 기관 도메인만 WebSearch로 확인했다. 등록은 '볼 곳 목록에 올린다'이지 '봤다'가 아니므로 sweep 회차를 추가하지 않았고 radar에는 `실사 이력 없음`으로 뜬다. cadence를 weekly가 아니라 monthly로 둔 이유는 DOF가 평일 매일 2회 발행이라 완료 조건이 일자별 통독이 아니라 기간 검색이고, 실제 실행 훅도 월 1회(phase2.5 §5)이기 때문이다. 20호가 2차 해설 일치 범위에서 기록한 2026-04-28 게재 대조는 owner 1차 확인 항목으로 계속 열려 있다."
  },
  {
    id: "diario-oficial-chile",
    label: "칠레 관보(Diario Oficial de la República de Chile)",
    url: "https://diariooficial.interior.gob.cl/",
    sweepTarget:
      "마지막 verified sweep 이후 기간에 게재된 propiedad industrial 관련 ley·decreto·reglamento(산업재산법 개정, INAPI 절차·수수료 규정)를 본다. 이 관보는 INAPI 상표출원 공고면을 겸하지만 개별 marca 공고는 이 소스의 대상이 아니다 — 그쪽은 독자용 모니터링 데이터이지 브리프 소재가 아니고, 일간 발행이라 섞으면 신호가 묻힌다.",
    tier: "primary",
    jurisdictions: ["Latin America"],
    relatedProductSlugs: ["latam"],
    sweepCadence: "monthly",
    notes:
      "공표 채널(관보) 축 두 번째. URL은 LatTm 제10장 모니터링 시스템(칠레 INAPI / Diario Oficial 행)에 이미 기록된 호스트의 origin이라 등록 규칙 ⓐ 경로다 — dof-mexico(ⓑ 경로)와 다르다. **멕시코 DOF와 기능이 같지 않다**: DOF는 법령 공포면이고, 칠레 관보는 법령 공포면이면서 동시에 INAPI 상표출원 공고면(일간 발행, 공고일로부터 30일 이의기간)이다. 그래서 sweepTarget이 개별 marca 공고를 명시적으로 제외한다. **URL 직접 대조 미완**: 2026-09-07 실측으로 diariooficial.interior.gob.cl·www 서브도메인 모두 CONNECT 403이라 열지 못했고, sweep 회차를 추가하지 않았으므로 radar에는 `실사 이력 없음`으로 뜬다. inapi-chile(기관 뉴스면)과 역할이 겹치지 않는다 — 기관이 뉴스로 알리지 않은 법령 변경이 이 면에는 정의상 실린다."
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
    status: "published",
    publishedAs: "2026-09-uspto-madrid-efiling-cutover",
    notes:
      "2026-08-30 sweep에서 WIPO Madrid System 뉴스 목록을 열어 확인했다(https://www.wipo.int/en/web/madrid-system/w/news/2026/transition-to-madrid-efiling-at-the-uspto). 날짜가 박힌 마감이 있어 바로 쓸 수 있다: 2026-07-31~09-30 병행, 10-01 단일 창구. UsaTm은 마지막 브리프 등장 2026-08-08 이후 열린 후보가 0건이었고 claim-map에 uspto-madrid-outbound 소스를 이미 들고 있어 연결이 자연스럽다. 발행 시 확인할 것: 이 전환은 '미국을 본국관청으로 하는 outbound 국제출원' 창구 변경이며, 한국 기업이 KIPO를 본국관청으로 쓰는 경로에는 영향이 없다는 점을 본문에서 분명히 구분한다. 2026-09-11 발행 — 후보 등록 시 기록한 위 사실(공지일·병행 기간·단일 창구 전환일·WIPO Account 요건·CHF 직납)을 본문의 기준으로 삼았고, 마감이 걸린 소재라 발행 라운드에서 공식 도메인(uspto.gov·wipo.int) 제한 검색으로 날짜가 밀리지 않았음을 재확인했다. 그 과정에서 본문에 반영한 사실 두 가지가 더 나왔다: ⓐ 이미 TEASi에 접수한 건은 10-01 이후에도 TEASi에서 마무리한다, ⓑ 증명수수료는 USD로 USPTO에 출원 시 즉시 납부하고 류 수·기초 출원등록 건수로 계산되며 WIPO 수수료만 CHF 직납으로 갈린다. 다만 이 세션에서도 uspto.gov·wipo.int는 CONNECT 403이라 원문 페이지를 연 것은 아니므로(primary-page-read 0건) briefSweepLog 회차를 추가하지 않는다 — 등록 소스의 freshness는 그대로다."
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
  },
  {
    id: "2026-09-mexico-lfppi-implementing-rules",
    headline:
      "멕시코 LFPPI 신 시행규칙이 1994년 규칙을 대체하며 2026년 7월 22일 발효됐다 — 진행 중인 출원과 침해 대응이 이미 새 규칙 아래 있으므로 기한·증거 구조를 다시 확인해야 한다",
    trigger:
      "멕시코 연방관보(DOF) 2026년 4월 28일 공포 「Reglamento de la Ley Federal de Protección a la Propiedad Industrial」, 시행일 2026년 7월 22일(공포 후 60 영업일). 1994년 11월 23일 구 시행규칙(RLPI)을 폐지·대체하며 조문이 79개에서 202개로 늘었다. IMPI 온라인 침해절차 규정화, 행정단계 조정 절차, 비전통상표(소리·냄새·위치·동작·멀티미디어) 명문 규정, 사용에 의한 식별력 입증 기준, 상표 심결 최대 5개월 기한이 함께 들어왔다.",
    discoveredOn: "2026-09-07",
    sourceIds: ["impi"],
    jurisdictions: [
      "Mexico",
      "Industrial Property Reform",
      "Online Enforcement",
      "Franchise Disclosure"
    ],
    relatedProductSlugs: ["mexico"],
    status: "published",
    publishedAs: "2026-09-mexico-lfppi-regulations-in-force",
    notes:
      "2026-09-07 WebSearch triage로 발굴했다. 저장소는 이 시행규칙을 전혀 들고 있지 않았다 — `reglamento`·`시행규칙`·`2026-07-22`를 MexTm·docs·src/briefs 전체에서 검색해 0건을 확인했다. 2026-08-30 claim-refresh 라운드는 법률 개정(2026-04-03)까지만 봤고 MX-ENF-001에 '집행 조항에 개정이 닿았는지는 별도 확인 대상'을 미결로 남겨 뒀는데, 이 시행규칙이 그 답을 들고 있을 가능성이 크다. MexTm 제6장이 '보류'로 남긴 office action 답변기한·연장 규칙도 같은 자리다. **1차 출처 미대조**: DOF·IMPI는 이 세션에서 열리지 않아(등록 소스 전부 연결 실패) sweep 회차를 추가하지 않는다. 사실은 Pérez-Llorca, AIPPI, Mijares, CCN, FisherBroyles, Chevez, BDO México, EY México, Panamericana de Patentes y Marcas가 일치하는 범위에서만 가져왔고, 조문 번호는 본문에 쓰지 않았다. owner 1차 대조와 MexTm 본문·claim-map 정합은 별도 라운드로 넘긴다. **2026-09-12 후속**: 이 후보의 headline에 적은 '진행 중인 출원과 침해 대응이 이미 새 규칙 아래 있다'는 명제가 확인되지 않은 추론이었다. 발행된 20호가 같은 명제를 요약·헤드라인에서 단정해 `2026-09-mexico-lfppi-transitional-provisions` 후보로 정정했다(발행 결과: `2026-09-mexico-lfppi-transitional-scope-correction`). 이 후보 기록 자체는 2026-09-07 시점의 판단이므로 고치지 않고 포인터만 남긴다."
  },
  {
    id: "2026-09-mexico-lfppi-transitional-provisions",
    headline:
      "멕시코 신 시행규칙이 이미 진행 중인 절차에 미치는지는 발효일이 아니라 관보 부칙(TRANSITORIOS)이 정한다 — 20호가 그 확인 없이 '이미 적용된다'고 단정했으므로 철회해야 한다",
    trigger:
      "2026-09-12 자체 점검. 2026-09-07 발행한 `2026-09-mexico-lfppi-regulations-in-force`의 요약과 항목 헤드라인이 '발효가 지났으므로 지금 심사 중인 출원과 진행 중인 침해 사건은 이미 새 규칙 아래 있습니다'라고 단정한 반면, 같은 호 본문 3문단과 7문단은 '발효 전 접수된 사건에 어떤 규칙이 적용되는지는 확인이 필요하다'고 유보했다. 같은 호 안의 모순이며, 단정한 쪽이 확인되지 않은 명제다. 2026년 4월 28일자 DOF 시행규칙의 부칙이 접수 당시 시행 중이던 규칙을 계속 적용하도록 정하고 있다면 방향까지 반대가 된다.",
    discoveredOn: "2026-09-12",
    sourceIds: ["dof-mexico", "impi"],
    jurisdictions: ["Mexico", "Industrial Property Reform", "Transitional Provisions"],
    relatedProductSlugs: ["mexico"],
    status: "published",
    publishedAs: "2026-09-mexico-lfppi-transitional-scope-correction",
    notes:
      "발굴 경로가 외부 소스가 아니라 **이미 발행한 이슈의 내부 모순**이다. 저장소 안에서 전부 확인되므로 소스 접근 없이 판정할 수 있었다. sourceIds는 이 질문을 실제로 닫을 수 있는 소스를 가리킨다 — DOF 관보 원문의 부칙과 IMPI 공식 안내다. **1차 출처 미대조**: 이 세션에서도 DOF·IMPI는 열리지 않아(프록시 CONNECT 403) sweep 회차를 추가하지 않았고, 그래서 정정호는 20호의 단정을 철회하기만 하고 반대 방향을 새로 단정하지 않는다. **2026-09-12 2차 출처 triage(같은 날 후속)**: 컨테이너 egress를 다시 재 봤으나 `dof.gob.mx`·`www.dof.gob.mx`·`sidof.segob.gob.mx`·`www.diputados.gob.mx`·`impi.gob.mx` 전부 CONNECT 403이고 WebFetch도 `EGRESS_BLOCKED`라 관보 원문 대조는 여전히 불가하다. 다만 WebSearch는 이 채널에서 열려, 2차 출처 다수(Mijares·Pérez-Llorca·FisherBroyles·Panamericana de Patentes y Marcas·Coel·TaxToday)가 **조문을 특정해** 일치하는 것을 확인했다 — **TERCERO 전환규정**: 시행 전 접수된 사건은 접수 당시(presentación) 시행 중이던 규정에 따라 계속 처리하되, MASC(대체적 분쟁해결 메커니즘) 이용은 예외. 사실이라면 20호의 단정은 방향이 반대다. **그래도 등급은 2차다.** 20호의 오류는 '2차 출처를 썼다'가 아니라 '2차 출처가 다루지 않은 명제를 단정했다'였고, 여기서는 2차 출처가 그 명제를 직접·일관되게 다룬다는 점이 다르지만, `briefs-lane.md`가 잠근 '정정호는 1차 출처 대조 없이 반대 방향을 단정하지 않는다'는 그대로 적용된다. 그래서 **22호를 고치지도, 후속호를 발행하지도 않았다.** sweep 회차도 추가하지 않는다(WebSearch triage는 소스를 연 것이 아니다 — 20호 후보와 같은 처리). 미결은 `MexTm` claim-map의 **MX-OQ-004**로 옮겨 `MX-DL-001`·`MX-ENF-001`에 걸었고, 거기에 확인 대상 둘과 확인 경로를 적었다."
  },
  {
    id: "2026-09-mexico-lfppi-gazette-primary-check",
    headline:
      "2026-04-28 DOF 게재분 부칙을 직접 대조하면 20호의 방향이 확정되고, 같은 부칙의 PRIMERO가 22호의 '네 축 유효' 재확인 중 하나를 무너뜨린다",
    trigger:
      "2026-09-12 데스크톱 세션에서 `dof.gob.mx` apex가 열려 nota 5786237(면머리 `DOF: 28/04/2026`)의 TRANSITORIOS를 직접 읽었다. 22호가 확인 대상으로 남긴 TERCERO 문언과 기준선이 둘 다 확정됐고(MX-OQ-004 종결), 그 과정에서 PRIMERO 둘째 문단이 제7장 온라인 침해 행정선언 절차를 본체 시행일에서 떼어 별도 Acuerdo 게재 다음 날로 미루고 그 고시에 18개월 기한을 붙인 것이 나왔다. 20호가 그 절차를 네 축 중 하나로 들었고 22호가 그 축을 유효로 재확인했으므로, 발행된 정정호 안에 남은 오류다.",
    discoveredOn: "2026-09-12",
    sourceIds: ["dof-mexico", "impi"],
    jurisdictions: ["Mexico", "Industrial Property Reform", "Transitional Provisions", "Enforcement"],
    relatedProductSlugs: ["mexico"],
    status: "published",
    publishedAs: "2026-09-mexico-lfppi-gazette-transitional-confirmation",
    notes:
      "앞 후보(`2026-09-mexico-lfppi-transitional-provisions`)와 같은 질문을 1차 출처로 닫은 회차다. 그 후보는 저장소 내부 모순에서 나왔고 2차 출처까지만 닿았지만, 이 후보는 관보 게재분 본문에서 나왔다. **sweep 회차는 추가하지 않았다** — `dof-mexico`의 `sweepTarget`은 기간 대상 검색이고 '일자별 edición 전문을 읽는 것은 완료 조건이 아니다'라고 명시돼 있는데, 이번에 한 것은 특정 nota 직접 열람이라 그 조건을 채우지 못한다. 그래서 `dof-mexico`는 radar에서 계속 `실사 이력 없음`이다. **대조 범위**: DOF 게재분 한 곳이며 diputados 상시본(`LeyesBiblio/regley/Reg_LFPPI.pdf`)은 이 세션에서 열리지 않았다(curl 443 연결 실패, 브라우저 내비게이션 거부). 관보 게재분이 정본이므로 결론은 서지만 두 곳 대조는 아니다. 남은 미결은 시행규칙 **본문 조문**이다 — `MX-OQ-002`(답변기한·연장 기산)는 부칙이 아니라 본문에 있고 이 회차가 열지 않았다."
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
