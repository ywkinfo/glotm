import { buildProductPath, type ProductMeta } from "./shared";

export const products: ProductMeta[] = [
  {
    id: "latam",
    shortLabel: "LatTm",
    slug: "latam",
    path: "/latam",
    title: "중남미 상표 보호 운영 가이드",
    summary: "라틴아메리카 권역 전체에서 출원, 유지, 집행을 어떤 운영 프레임으로 설계할지 보여주는 기준 제품입니다.",
    chapterCount: 20,
    searchEntryCount: 780,
    status: "Pilot",
    statusTone: "pilot",
    audience: "해외 진출 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "LatTm 시작",
    stageLabel: "기준 제품",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "mexico",
    shortLabel: "MexTm",
    slug: "mexico",
    path: "/mexico",
    title: "멕시코 상표 실무 운영 가이드북",
    summary: "멕시코 IMPI 절차와 실무 쟁점을 더 깊게 다루는 심화 트랙으로, LatTm 다음 단계의 집중 탐색에 맞춰져 있습니다.",
    chapterCount: 15,
    searchEntryCount: 266,
    status: "Beta",
    statusTone: "beta",
    audience: "멕시코 단일 시장 실무를 다뤄야 하는 담당자",
    primaryCtaLabel: "MexTm 심화",
    stageLabel: "심화 트랙",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "usa",
    shortLabel: "UsaTm",
    slug: "usa",
    path: "/usa",
    title: "미국 상표 실무 운영 가이드북",
    summary: "USPTO 중심의 미국 연방 상표 실무를 단일국가 기준으로 정리한 신규 심화 트랙입니다.",
    chapterCount: 14,
    searchEntryCount: 165,
    status: "Beta",
    statusTone: "beta",
    audience: "미국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UsaTm 보기",
    stageLabel: "라이브 트랙",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "japan",
    shortLabel: "JapTm",
    slug: "japan",
    path: "/japan",
    title: "일본 상표 실무 운영 가이드북",
    summary: "일본 단일 시장 실무를 다루는 live track으로, JPO 중심 운영 흐름과 분쟁 대비 구조를 바로 읽을 수 있습니다.",
    chapterCount: 15,
    searchEntryCount: 75,
    status: "Beta",
    statusTone: "beta",
    audience: "일본 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "JapTm 보기",
    stageLabel: "라이브 트랙",
    coverageType: "country",
    availability: "live_shell"
  },
  {
    id: "china",
    shortLabel: "ChaTm",
    slug: "china",
    path: "/china",
    title: "중국 상표 실무 운영 가이드",
    summary: "중국 단일 시장 실무를 다루는 live track으로, CNIPA 절차와 플랫폼·집행 운영 포인트를 바로 읽을 수 있습니다.",
    chapterCount: 15,
    searchEntryCount: 129,
    status: "Beta",
    statusTone: "beta",
    audience: "중국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "ChaTm 보기",
    stageLabel: "라이브 트랙",
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
    summary: "유럽 권역형 운영 가이드를 다루는 live regional guide로, EU 단위 전략과 권역 운영 구조를 바로 읽을 수 있습니다.",
    chapterCount: 14,
    searchEntryCount: 180,
    status: "Pilot",
    statusTone: "pilot",
    audience: "유럽 권역 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "EuTm 보기",
    stageLabel: "라이브 권역 가이드",
    coverageType: "region",
    availability: "live_shell"
  },
  {
    id: "uk",
    shortLabel: "UKTm",
    slug: "uk",
    path: "/uk",
    title: "영국 상표 실무 운영 가이드북",
    summary: "UKIPO 중심의 영국 단일국가 실무를 빠르게 점검하는 early track으로, Brexit 이후 영국 시장 운영 판단을 별도 정리합니다.",
    chapterCount: 14,
    searchEntryCount: 84,
    status: "Pilot",
    statusTone: "pilot",
    audience: "영국 단일 시장 진출과 운영을 준비하는 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "UKTm 보기",
    stageLabel: "초기 단일국가 트랙",
    maturityNote: "draft 공개본 · early track",
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
