// Gateway 히어로의 supporting 문단 정본.
// SPA(src/app/GatewayPage.tsx)와 정적 SEO 본문(scripts/seo.ts)이 이 한 곳을 함께 import해
// 문구 drift가 재발하지 않게 한다. Vite 전용 import(`?raw` 등) 없이 순수 문자열만 둬서
// tsx로 도는 빌드 스크립트에서도 안전하게 불러올 수 있다.
export const gatewayHeroSupportingParagraphs = [
  "중국 가이드(ChaTm)에서는 중국어 브랜드명, 시장별 출시 순서, 상표 출원 방식을 먼저 정리합니다. 이어 멕시코 가이드(MexTm)에서는 출원 준비와 등록 후 관리, 세관에서 위조품을 막기 위한 준비를 살펴봅니다. 유럽 가이드(EuTm)에서는 EU와 영국에서 상표를 어디까지 보호할지, 권리를 지키기 위해 어떤 증거가 필요한지 살펴봅니다.",
  "최신 리포트 2개는 세 가이드에서 반복해서 나오는 질문을 한곳에 모아 정리한 자료입니다."
] as const;
