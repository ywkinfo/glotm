// Gateway 히어로의 supporting 문단 정본.
// SPA(src/app/gateway/gatewaySections.tsx)와 정적 SEO 본문(scripts/seo.ts)이 이 한 곳을 함께 import해
// 문구 drift가 재발하지 않게 한다. Vite 전용 import(`?raw` 등) 없이 순수 문자열만 둬서
// tsx로 도는 빌드 스크립트에서도 안전하게 불러올 수 있다.
//
// 문단은 짧게 유지한다. 히어로가 길어지면 국가 진입이 첫 화면 밖으로 밀리고, 이 파일은
// prerender 본문과 공유되므로 여기서 늘어난 분량이 크롤 표면에도 그대로 간다.
export const gatewayHeroSupportingParagraphs = [
  "어느 나라부터 출원할지, 어떤 경로로 낼지, 등록한 뒤 무엇을 관리할지를 국가별 가이드에서 순서대로 정리합니다."
] as const;

// 포트폴리오 tier는 flagship / growth / validate / incubate 4단 모델이고, 정의 정본은
// `docs/portfolio-scorecard.md`다. 모델이 넷이라는 사실과 **지금 넷을 운영한다**는 진술은 다르다.
// 게이트웨이는 buyer-facing 진입면이라 후자를 말하는 자리이므로, 실제로 제품이 들어 있는 레인만
// 이름을 부른다.
//
// 이 저장소는 이미 같은 규칙을 렌더에서 지키고 있었다 — `ProductGroup`과 roadmap 카드는 비어 있는
// tier를 렌더하지 않고 `App.test.tsx`가 그것을 단정한다. 문구만 그 규칙을 따르지 않아, 제목이 네
// 레인을 약속하고 그 아래에 둘만 보여주는 상태가 남아 있었다(2026-08-31 실측, owner 판단 대기).
// 이제 문구도 같은 데이터에서 파생되므로 tier 점유가 바뀌면 문장이 따라 움직인다.
const portfolioTierOrder = ["flagship", "growth", "validate", "incubate"] as const;

type PortfolioTierName = (typeof portfolioTierOrder)[number];

const portfolioTierLabels: Record<PortfolioTierName, string> = {
  flagship: "Flagship",
  growth: "Growth",
  validate: "Validate",
  incubate: "Incubate"
};

// 라벨은 그 아래 렌더되는 `ProductGroup` 제목과 같은 문자열이다. 제목이 부르는 이름과 실제로
// 보이는 그룹 이름이 어긋나지 않아야 한다.
export function getOccupiedTierLabels(
  products: readonly { portfolioTier: PortfolioTierName }[]
) {
  return portfolioTierOrder
    .filter((tier) => products.some((product) => product.portfolioTier === tier))
    .map((tier) => portfolioTierLabels[tier]);
}

// 조사 문제를 피하려고 tier 목록 뒤에 고정어("레인")를 둔다. 목록 끝 단어에 직접 조사를 붙이면
// 점유가 바뀔 때마다 로/으로·와/과가 어긋난다.
function joinTierLabels(products: readonly { portfolioTier: PortfolioTierName }[]) {
  return getOccupiedTierLabels(products).join(" · ");
}

export function buildPortfolioFocusTitle(
  products: readonly { portfolioTier: PortfolioTierName }[]
) {
  return `포트폴리오를 ${joinTierLabels(products)} 레인으로 운영합니다`;
}

export function buildPortfolioTierSummary(
  products: readonly { portfolioTier: PortfolioTierName }[]
) {
  return `현재 ${products.length}개의 권역형·국가형 guide를 ${joinTierLabels(products)} 레인으로 운영하고 있습니다.`;
}

// `docs/portfolio-scorecard.md`의 정렬 기준("단순히 가장 얇은 가이드를 먼저 메우지 않고 … buyer
// entry 효과를 우선 반영한다")을 그대로 옮기되, 레인 이름만 파생시킨다.
export function buildBuildOrderCopy(
  products: readonly { portfolioTier: PortfolioTierName }[]
) {
  return `현재 우선순위는 이용자가 바로 체감하는 가치, 전체 구성의 균형, 아직 내용이 덜 채워진 정도를 함께 보고 정합니다. 그래서 가장 얇은 가이드부터 메우기보다, 지금 운영 중인 ${joinTierLabels(products)} 레인 안에서 buyer entry 효과가 큰 쪽을 먼저 반영합니다.`;
}
