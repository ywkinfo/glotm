import type { ProductMeta } from "./shared";

export const products: ProductMeta[] = [
  {
    id: "latam",
    slug: "latam",
    path: "/latam",
    title: "중남미 상표 보호 운영 가이드",
    summary: "라틴아메리카 권역 전체에서 출원, 유지, 집행을 어떤 운영 프레임으로 설계할지 보여주는 기준 제품입니다.",
    status: "Pilot",
    statusTone: "pilot",
    audience: "해외 진출 브랜드 관리자, 인하우스 IP 담당자",
    primaryCtaLabel: "LatTm 시작",
    stageLabel: "기준 제품"
  },
  {
    id: "mexico",
    slug: "mexico",
    path: "/mexico",
    title: "멕시코 상표 실무 운영 가이드북",
    summary: "멕시코 IMPI 절차와 실무 쟁점을 더 깊게 다루는 심화 트랙으로, LatTm 다음 단계의 집중 탐색에 맞춰져 있습니다.",
    status: "Beta",
    statusTone: "beta",
    audience: "멕시코 단일 시장 실무를 다뤄야 하는 담당자",
    primaryCtaLabel: "MexTm 심화",
    stageLabel: "심화 트랙"
  }
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
