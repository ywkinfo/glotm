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
    lifecycleStatus: "pilot",
    lifecycleTone: "pilot",
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
    summary: "멕시코 진입 직전의 출원 경로, 충돌 위험, 실행 질문을 정리하는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 266,
    portfolioTier: "growth",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 72,
    qaLevel: "full",
    highRiskVerificationGapCount: 1,
    audience: "멕시코 진출 직전 판단이 필요한 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "MexTm 먼저 보기",
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
    searchEntryCount: 165,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 112,
    qaLevel: "smoke",
    highRiskVerificationGapCount: 3,
    audience: "미국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UsaTm 보기",
    maturityNote: "lighter track · verification refresh 우선",
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
    searchEntryCount: 75,
    portfolioTier: "incubate",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 118,
    qaLevel: "smoke",
    highRiskVerificationGapCount: 4,
    audience: "일본 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "JapTm 보기",
    maturityNote: "lighter track · smoke QA 유지",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "china",
    shortLabel: "ChaTm",
    slug: "china",
    path: "/china",
    title: "중국 상표 실무 운영 가이드",
    summary: "중국어 표기, 서브클래스, 집행 경로를 우선 강화하는 growth country guide입니다.",
    chapterCount: 15,
    searchEntryCount: 159,
    portfolioTier: "growth",
    lifecycleStatus: "beta",
    lifecycleTone: "beta",
    verificationFreshnessDays: 82,
    qaLevel: "standard",
    highRiskVerificationGapCount: 1,
    audience: "중국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "ChaTm 보기",
    maturityNote: "지속 업데이트 중",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "europe",
    shortLabel: "EuTm",
    slug: "europe",
    path: "/europe",
    title: "EuTm 유럽 상표 운영 가이드북",
    summary: "EU 단위 전략과 운영 구조를 검증하는 validate regional guide입니다.",
    chapterCount: 14,
    searchEntryCount: 180,
    portfolioTier: "validate",
    lifecycleStatus: "pilot",
    lifecycleTone: "pilot",
    verificationFreshnessDays: 89,
    qaLevel: "standard",
    highRiskVerificationGapCount: 2,
    audience: "유럽 권역 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "EuTm 보기",
    maturityNote: "validate lane · fact verification 우선",
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
    searchEntryCount: 84,
    portfolioTier: "incubate",
    lifecycleStatus: "pilot",
    lifecycleTone: "pilot",
    verificationFreshnessDays: 108,
    qaLevel: "smoke",
    highRiskVerificationGapCount: 3,
    audience: "영국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UKTm 보기",
    maturityNote: "lighter track · draft 공개본",
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
