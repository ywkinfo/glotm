import { buildProductPath, type ProductMeta } from "./shared";

// 운영 메타데이터 정본(single source of truth).
// PROJECT-OVERVIEW.md·README.md·docs/* 의 수치는 이 파일에서 파생된 derived snapshot이며,
// 불일치 시 이 파일이 정본이다. 문서에 수치를 또 적기보다 이 파일을 바꾼다.
//
// verifiedOn 의미: shared root lane(content:prepare / health:*) 재검증 시점이다.
// 1차 출처(관보·기관 고지) 대조 같은 "사실 재검증"과는 다르다. 월간 re-stamp는
// "lane을 다시 통과시켰다"는 뜻이지 "사실을 다시 확인했다"는 뜻이 아니다.
// 따라서 scorecard freshness는 lane freshness로 읽고, fact freshness로 읽지 않는다.
// 사실 재대조는 tier를 게이팅하지 않는 별도 advisory 트랙이다. 실제 재대조를 수행하면 각 제품의 선택 필드
// factsReviewedOn에 그 날짜를 기록하고(미수행이면 비워 둔다), health:report의 "Fact-Review (advisory)" 섹션과
// docs/monthly-review-template.md에서 함께 본다.

export const products: ProductMeta[] = [
  {
    id: "latam",
    shortLabel: "LatTm",
    slug: "latam",
    path: "/latam",
    gatewayOrder: 4,
    gatewayLaneRole: "baseline",
    title: "중남미 상표 보호 운영 가이드",
    summary: "인하우스 팀이 중남미 우선 시장과 운영 순서를 정하는 flagship cross-border guide입니다.",
    chapterCount: 20,
    searchEntryCount: 781,
    portfolioTier: "flagship",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "중남미 진출 우선순위를 정해야 하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "LatTm 기준 프레임 보기",
    maturityNote: "flagship 보호 · 2026-06-02 full-lane 재검증 완료",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "mexico",
    shortLabel: "MexTm",
    slug: "mexico",
    path: "/mexico",
    gatewayOrder: 2,
    gatewayLaneRole: "priority",
    title: "멕시코 상표 실무 운영 가이드북",
    summary: "출원 패킷 핸드오프, 유지관리 triage, 국경 증거 팩을 buyer-entry 판단 흐름으로 묶은 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 385,
    portfolioTier: "growth",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "멕시코 진출 직전 판단이 필요한 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "MexTm 먼저 보기",
    maturityNote: "mature 유지 · Sprint 2 운영 handoff 3장 보강 · 2026-06-02 shared root gate 재검증 완료",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "usa",
    shortLabel: "UsaTm",
    slug: "usa",
    path: "/usa",
    gatewayOrder: 7,
    gatewayLaneRole: "supporting",
    title: "미국 상표 실무 운영 가이드북",
    summary: "USPTO filing basis, specimen, monitoring utility를 lighter track으로 유지하는 incubate country guide입니다.",
    chapterCount: 14,
    searchEntryCount: 185,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "미국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UsaTm 보기",
    maturityNote: "beta 유지 · 제8·13·14장 운영 표·체크리스트 보강(reader utility) · 2026-06-02 재검증",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "japan",
    shortLabel: "JapTm",
    slug: "japan",
    path: "/japan",
    gatewayOrder: 5,
    gatewayLaneRole: "supporting",
    title: "일본 상표 실무 운영 가이드북",
    summary: "JPO route, maintenance, evidence utility를 lighter track으로 유지하는 incubate country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 145,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "일본 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "JapTm 보기",
    maturityNote: "beta 유지 · route/maintenance/evidence utility 점검 · 2026-06-02 root shortcut 재검증",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "china",
    shortLabel: "ChaTm",
    slug: "china",
    path: "/china",
    gatewayOrder: 1,
    gatewayLaneRole: "priority",
    title: "중국 상표 실무 운영 가이드",
    summary: "중국어 표기, 서브클래스, 심사·집행 판단을 먼저 두껍게 만드는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 358,
    portfolioTier: "growth",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "중국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "ChaTm 보기",
    maturityNote: "mature 승격 반영 · Sprint 2 저밀도 9장 보강 · reader/search QA 정렬 완료",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "europe",
    shortLabel: "EuTm",
    slug: "europe",
    path: "/europe",
    gatewayOrder: 3,
    gatewayLaneRole: "priority",
    title: "EuTm 유럽 상표 운영 가이드북",
    summary: "EU-wide·core-state·UK split과 evidence triage를 EU+UK 범위에서 두껍게 다루는 growth regional guide입니다.",
    chapterCount: 15,
    searchEntryCount: 260,
    portfolioTier: "growth",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verifiedOn: "2026-06-09T00:00:00.000Z",
    factsReviewedOn: "2026-06-10T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "유럽 권역 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "EuTm 보기",
    maturityNote: "mature 승급 · Ch3/6/10/14·부록 보강 · 2026-06-10 법률 사실정정(UK fee·우선권·comparable·Brexit 날짜) 및 claim-map 10건 반영",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "uk",
    shortLabel: "UKTm",
    slug: "uk",
    path: "/uk",
    gatewayOrder: 6,
    gatewayLaneRole: "supporting",
    title: "영국 상표 실무 운영 가이드북",
    summary: "UKIPO 중심 early-track 실무를 verified 공개본으로 유지하는 incubate country guide입니다.",
    chapterCount: 14,
    searchEntryCount: 128,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verifiedOn: "2026-06-02T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "영국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UKTm 보기",
    maturityNote: "beta 승급 반영 · standard QA evidence 4-file 정합 · density 9+ 유지 · 2026-05-12 standard QA verdict 적용",
    coverageType: "country",
    availability: "live_shell"
  }
];

export const liveShellProducts = products.filter(
  (product) => product.availability === "live_shell"
);

export const developedWorkspaceProducts = products.filter(
  (product) => product.availability === "developed_workspace"
);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductPathBySlug(slug: string) {
  const product = getProductBySlug(slug);

  if (!product) {
    throw new Error(`Unknown product slug: ${slug}`);
  }

  return buildProductPath(product);
}
