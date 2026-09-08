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
