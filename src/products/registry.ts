import { buildProductPath, type ProductMeta } from "./shared";

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
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "중남미 진출 우선순위를 정해야 하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "LatTm 기준 프레임 보기",
    maturityNote: "flagship 보호 · 2026-04-21 full-lane 재검증 완료",
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
    summary: "멕시코 buyer-entry 판단표, 출원 경로, 자산 통제 질문을 빠르게 정리하는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 385,
    portfolioTier: "growth",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "멕시코 진출 직전 판단이 필요한 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "MexTm 먼저 보기",
    maturityNote: "mature 유지 · Sprint 2 운영 handoff 3장 보강 · 2026-04-21 shared root gate 재검증 완료",
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
    searchEntryCount: 178,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "미국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UsaTm 보기",
    maturityNote: "beta 유지 · filing/specimen/monitoring utility 점검 · 2026-04-21 root shortcut 재검증",
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
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "일본 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "JapTm 보기",
    maturityNote: "beta 유지 · route/maintenance/evidence utility 점검 · 2026-04-21 root shortcut 재검증",
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
    verifiedOn: "2026-04-21T00:00:00.000Z",
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
    summary: "EU-wide, core-state, UK split과 evidence triage 기준선을 controlled EU+UK scope로 잠그는 validate regional guide입니다.",
    chapterCount: 14,
    searchEntryCount: 258,
    portfolioTier: "validate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "유럽 권역 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "EuTm 보기",
    maturityNote: "validate lane · claim-map adopted · controlled EU+UK scope · shared root gate closeout reflected",
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
    summary: "UKIPO 중심 early-track 실무를 draft 공개본으로 유지하는 incubate country guide입니다.",
    chapterCount: 14,
    searchEntryCount: 128,
    portfolioTier: "incubate",
    lifecycleStatus: "pilot",
    lifecycleTone: "pilot",
    verifiedOn: "2026-04-21T00:00:00.000Z",
    qaLevel: "smoke",
    highRiskVerificationGapCount: 0,
    audience: "영국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UKTm 보기",
    maturityNote: "pilot 유지 · density 9+ 달성 · standard QA pending · 2026-04-21 root full-pipeline 재검증",
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
