import { buildProductPath, type ProductMeta } from "./shared";

export const products: ProductMeta[] = [
  {
    id: "latam",
    shortLabel: "LatTm",
    slug: "latam",
    path: "/latam",
    title: "중남미 상표 보호 운영 가이드",
    summary: "인하우스 팀이 중남미 우선 시장과 운영 순서를 정하는 flagship cross-border guide입니다.",
    chapterCount: 20,
    searchEntryCount: 780,
    portfolioTier: "flagship",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verificationFreshnessDays: 45,
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "중남미 진출 우선순위를 정해야 하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "LatTm 기준 프레임 보기",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "mexico",
    shortLabel: "MexTm",
    slug: "mexico",
    path: "/mexico",
    title: "멕시코 상표 실무 운영 가이드북",
    summary: "멕시코 buyer-entry 판단표, 출원 경로, 자산 통제 질문을 빠르게 정리하는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 309,
    portfolioTier: "growth",
    lifecycleStatus: "mature",
    lifecycleTone: "mature",
    verificationFreshnessDays: 2,
    qaLevel: "full",
    highRiskVerificationGapCount: 0,
    audience: "멕시코 진출 직전 판단이 필요한 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "MexTm 먼저 보기",
    maturityNote: "mature 승격 완료 · buyer-entry decision lane 강화 · full QA",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "usa",
    shortLabel: "UsaTm",
    slug: "usa",
    path: "/usa",
    title: "미국 상표 실무 운영 가이드북",
    summary: "USPTO 중심 실무를 lighter depth로 유지하는 incubate country guide입니다.",
    chapterCount: 14,
    searchEntryCount: 171,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 0,
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "미국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UsaTm 보기",
    maturityNote: "verification refresh 완료 · standard QA 유지",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "japan",
    shortLabel: "JapTm",
    slug: "japan",
    path: "/japan",
    title: "일본 상표 실무 운영 가이드북",
    summary: "JPO 중심 운영 흐름을 lighter depth로 유지하는 incubate country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 140,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 0,
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "일본 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "JapTm 보기",
    maturityNote: "beta 승격 · standard QA 유지",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "china",
    shortLabel: "ChaTm",
    slug: "china",
    path: "/china",
    title: "중국 상표 실무 운영 가이드",
    summary: "중국어 표기, 서브클래스, 심사·집행 판단을 먼저 두껍게 만드는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 220,
    portfolioTier: "growth",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 3,
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "중국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "ChaTm 보기",
    maturityNote: "Sprint 1 우선 6장 심화 · search density 상승",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "europe",
    shortLabel: "EuTm",
    slug: "europe",
    path: "/europe",
    title: "EuTm 유럽 상표 운영 가이드북",
    summary: "EU 권리 선택과 등록 후 운영 구조를 안정화하는 validate regional guide입니다.",
    chapterCount: 14,
    searchEntryCount: 224,
    portfolioTier: "validate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 0,
    qaLevel: "standard",
    highRiskVerificationGapCount: 0,
    audience: "유럽 권역 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "EuTm 보기",
    maturityNote: "validate lane · docs sync + core six stabilized",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "uk",
    shortLabel: "UKTm",
    slug: "uk",
    path: "/uk",
    title: "영국 상표 실무 운영 가이드북",
    summary: "UKIPO 중심 실무를 verification refresh 중심으로 유지하는 incubate country guide입니다.",
    chapterCount: 14,
    searchEntryCount: 93,
    portfolioTier: "incubate",
    lifecycleStatus: "pilot",
    lifecycleTone: "pilot",
    verificationFreshnessDays: 0,
    qaLevel: "smoke",
    highRiskVerificationGapCount: 0,
    audience: "영국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UKTm 보기",
    maturityNote: "verification refresh 완료 · draft 공개본 유지",
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
