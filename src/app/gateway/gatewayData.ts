import { briefIssues, getLatestBriefIssue } from "../../briefs/archive";
import { getIntroSection } from "../../content/intro";
import {
  buildReportArchivePath,
  getLatestReport,
  getLatestReports,
  reportExperienceMeta
} from "../../reports/registry";
import { liveShellProducts } from "../../products/registry";
import {
  buildProductPath,
  getLifecycleStatusLabel,
  getPortfolioTierLabel,
  getQaLevelLabel,
  isBaselineLaneProduct,
  isPriorityLaneProduct
} from "../../products/shared";
import {
  buildPriorityLaneProgressNote,
  buildPriorityLaneStatusSummary,
  joinProductLabels,
  orderGatewayProducts
} from "../appShared";

// 게이트웨이가 화면에 쓰는 값은 전부 여기서 registry·archive 정본에서 파생한다.
// 섹션 컴포넌트에는 파생 결과만 넘겨, 화면 조립과 데이터 파생이 섞이지 않게 한다.
export function buildGatewayViewModel() {
  const whyLate = getIntroSection("왜 상표 이슈는 늦게 드러나는가");
  const riskPatterns = getIntroSection("사업 리스크로 전환되는 대표 패턴");
  const orderedProducts = orderGatewayProducts(liveShellProducts);
  const regionProducts = orderedProducts.filter((product) => product.coverageType === "region");
  const countryProducts = orderedProducts.filter((product) => product.coverageType === "country");
  const flagshipProducts = orderedProducts.filter((product) => product.portfolioTier === "flagship");
  const growthProducts = orderedProducts.filter((product) => product.portfolioTier === "growth");
  const validateProducts = orderedProducts.filter((product) => product.portfolioTier === "validate");
  const incubateProducts = orderedProducts.filter((product) => product.portfolioTier === "incubate");
  const liveChapterCount = orderedProducts.reduce(
    (total, product) => total + product.chapterCount,
    0
  );
  const liveSearchEntryCount = orderedProducts.reduce(
    (total, product) => total + product.searchEntryCount,
    0
  );
  const priorityGuides = orderedProducts.filter(isPriorityLaneProduct);
  const leadGuide = priorityGuides[0];
  const secondGuide = priorityGuides[1];
  const baselineGuide = orderedProducts.find(isBaselineLaneProduct);
  const featuredBriefs = briefIssues.slice(0, 2);
  const latestBrief = getLatestBriefIssue();
  const leadReport = getLatestReport();
  const featuredReports = getLatestReports(2);
  const priorityLaneStatusSummary = buildPriorityLaneStatusSummary(orderedProducts);
  const priorityLaneProgressNote = leadReport
    ? buildPriorityLaneProgressNote(orderedProducts, leadReport)
    : `${priorityGuides.map((product) => product.shortLabel).join(" -> ")} 순서로 guide를 먼저 정리하고 있습니다.`;
  const recommendedStartCopy = baselineGuide
    ? `${priorityLaneProgressNote} 큰 그림이 필요할 때는 ${baselineGuide.shortLabel}을 기준 프레임으로 함께 보면 좋습니다.`
    : priorityLaneProgressNote;
  const priorityRoadmap = [
    ...priorityGuides.map((product) => ({
      id: product.slug,
      title: `${product.shortLabel} · ${getPortfolioTierLabel(product.portfolioTier)} ${getLifecycleStatusLabel(product.lifecycleStatus)}`,
      copy: product.summary,
      note:
        product.maturityNote
        ?? `QA ${getQaLevelLabel(product.qaLevel)} · gap ${product.highRiskVerificationGapCount}건`,
      href: buildProductPath(product)
    })),
    ...(leadReport
      ? [
          {
            id: "report-gateway",
            title: reportExperienceMeta.gatewayRoadmapTitle,
            copy: reportExperienceMeta.gatewaySectionSummary,
            note: priorityLaneProgressNote,
            href: buildReportArchivePath()
          }
        ]
      : []),
    ...(incubateProducts.length > 0
      ? [
          {
            id: "incubate",
            title: `${joinProductLabels(incubateProducts, " · ")} · Incubate`,
            copy: `${joinProductLabels(incubateProducts, " · ")}은 lighter track으로 유지하며 verification refresh, reader utility, 문서 정합성을 우선합니다.`,
            note: incubateProducts
              .map(
                (product) =>
                  `${product.shortLabel} ${getLifecycleStatusLabel(product.lifecycleStatus)} · QA ${getQaLevelLabel(product.qaLevel)}`
              )
              .join(" / "),
            href: incubateProducts[0] ? buildProductPath(incubateProducts[0]) : buildProductPath("/")
          }
        ]
      : [])
  ];

  return {
    baselineGuide,
    countryProductCount: countryProducts.length,
    featuredBriefs,
    featuredReports,
    flagshipProducts,
    growthProducts,
    incubateProducts,
    latestBrief,
    latestBriefJurisdictions: latestBrief?.jurisdictions.slice(0, 4) ?? [],
    leadGuide,
    leadReport,
    leadReportFocusPoints: leadReport?.focusPoints.slice(0, 3) ?? [],
    liveChapterCount,
    liveProductCount: orderedProducts.length,
    liveSearchEntryCount,
    orderedProducts,
    priorityGuides,
    priorityLaneProgressNote,
    priorityLaneStatusSummary,
    priorityRoadmap,
    recommendedStartCopy,
    recommendedStartTitle:
      leadGuide && secondGuide
        ? `${leadGuide.shortLabel}과 ${secondGuide.shortLabel}부터 보면 현재 우선 레인과 실행 질문이 함께 잡힙니다`
        : "현재 우선 레인을 먼저 보면 실행 질문이 함께 잡힙니다",
    regionProductCount: regionProducts.length,
    riskPatterns,
    secondGuide,
    validateProducts,
    whyLateParagraphs: whyLate?.paragraphs ?? []
  };
}

export type GatewayViewModel = ReturnType<typeof buildGatewayViewModel>;

export const gatewayHeroTitle = "인하우스 팀을 위한 cross-border trademark operating guide";
export const gatewayHeroLead =
  "중국·멕시코·유럽 진출을 앞둔 팀이 로펌 상담 전에 무엇을 먼저 잠가야 하는지 판단하도록 돕습니다.";
