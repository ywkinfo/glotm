import { getProductBySlug, getProductPathBySlug } from "../products/registry";
import {
  buildChapterPath,
  buildRuntimeDocumentTitle,
  buildSectionHash
} from "../products/shared";

export type ReportGuideLink = {
  label: string;
  href: string;
};

export type ReportGatewayPlacement = "front" | "supporting" | "archive";

export type ReportFocusPoint = {
  id: string;
  title: string;
  summary: string;
  href: string;
  guideSlug?: string;
  ctaLabel: string;
};

export type ReportMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  trustLayerSummaryObject: string;
  publishedAt: string;
  updatedAt?: string;
  jurisdictions: string[];
  tags: string[];
  audience: string;
  gatewayLabel: string;
  gatewayPlacement: ReportGatewayPlacement;
  gatewayPriority: number;
  whyNow: string;
  trustLayerChecklist: string[];
  focusPoints: ReportFocusPoint[];
  relatedGuideLinks: ReportGuideLink[];
};

export type GuideReportHandoff = {
  report: ReportMeta;
  focusPoint?: ReportFocusPoint;
};

export type ReportExperienceMeta = {
  gatewaySectionKicker: string;
  gatewaySectionTitle: string;
  gatewaySectionSummary: string;
  archiveHeroKicker: string;
  archiveHeroTitle: string;
  archiveHeroLead: string;
  archiveHeroSummary: string;
  archiveSectionKicker: string;
  archiveSectionTitle: string;
  archiveSectionSummary: string;
  archiveCtaLabel: string;
};

type ReportRegistration = Omit<ReportMeta, "gatewayPriority"> & {
  gatewayPriority?: number;
};

function buildGuideSectionPath(
  productSlug: string,
  chapterSlug: string,
  sectionId?: string
) {
  return `${buildChapterPath(getProductPathBySlug(productSlug), chapterSlug)}${buildSectionHash(sectionId)}`;
}

const gatewayPlacementRank: Record<ReportGatewayPlacement, number> = {
  front: 0,
  supporting: 1,
  archive: 2
};

const defaultGatewayPriorityByPlacement: Record<ReportGatewayPlacement, number> = {
  front: 0,
  supporting: 100,
  archive: 1000
};

function createReportMeta(report: ReportRegistration): ReportMeta {
  return {
    ...report,
    gatewayPriority: report.gatewayPriority ?? defaultGatewayPriorityByPlacement[report.gatewayPlacement]
  };
}

function matchesGuidePath(target: string, productPath: string) {
  return target === productPath
    || target.startsWith(`${productPath}/`)
    || target.startsWith(`${productPath}#`)
    || target.startsWith(`${productPath}?`);
}

function sortReportsByPublishedAt(left: ReportMeta, right: ReportMeta) {
  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}

function sortReportsForGateway(left: ReportMeta, right: ReportMeta) {
  if (gatewayPlacementRank[left.gatewayPlacement] !== gatewayPlacementRank[right.gatewayPlacement]) {
    return gatewayPlacementRank[left.gatewayPlacement] - gatewayPlacementRank[right.gatewayPlacement];
  }

  if (left.gatewayPriority !== right.gatewayPriority) {
    return left.gatewayPriority - right.gatewayPriority;
  }

  return sortReportsByPublishedAt(left, right);
}

export const reportExperienceMeta: ReportExperienceMeta = {
  gatewaySectionKicker: "먼저 볼 리포트",
  gatewaySectionTitle: "Gateway 첫 화면에서 지금 필요한 리포트를 먼저 보여줍니다",
  gatewaySectionSummary:
    "국가별 guide를 열기 전에 여러 나라에 공통으로 걸리는 질문부터 보고 싶다면 여기서 시작하면 됩니다.",
  archiveHeroKicker: "Special Report",
  archiveHeroTitle: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트",
  archiveHeroLead:
    "특정 국가 하나의 절차 요약보다, 여러 관할에서 반복해서 부딪히는 운영 질문을 한 문서로 정리하는 심화 리포트 아카이브입니다.",
  archiveHeroSummary:
    "가이드가 국가별 실행 맥락을 정리한다면, 리포트는 출원 경로, 권리자 분리, 혼합 경로처럼 여러 나라에서 반복되는 판단 문제를 따로 묶어 보여줍니다.",
  archiveSectionKicker: "Archive",
  archiveSectionTitle: "최신순으로 스페셜 리포트를 모아 둡니다",
  archiveSectionSummary:
    "각 리포트는 특정 국가 하나를 길게 요약하기보다, 여러 시장에서 공통으로 반복되는 운영 질문을 먼저 구조화하고 관련 guide로 바로 이어지게 만듭니다.",
  archiveCtaLabel: "리포트 전체 보기"
};

// Template for new report entries:
// - Set gatewayPlacement before copywriting: front | supporting | archive
// - Use gatewayPriority only to order reports within the same placement
// - whyNow should explain why this report deserves Gateway real estate now
// - focusPoints should deep-link into the next guide actions the reader should take
const reportSource: ReportMeta[] = [
  createReportMeta({
    id: "global-filing-route-framework",
    slug: "global-filing-route-framework",
    title: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
    summary:
      "여러 나라에 동시에 출원할 때 먼저 필요한 판단 기준을 한 문서에 모았습니다. 어떤 시장은 직접출원이 낫고, 어떤 시장은 마드리드가 더 효율적인지 빠르게 비교할 수 있게 정리한 스페셜 리포트입니다.",
    trustLayerSummaryObject: "출원 경로 판단 질문을",
    publishedAt: "2026-04-04T12:00:00.000Z",
    jurisdictions: ["Global", "China", "Mexico", "Europe", "Japan"],
    tags: ["출원 경로", "Madrid", "Route Memo"],
    audience: "여러 나라의 출원 경로를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀",
    gatewayLabel: "Front Report",
    gatewayPlacement: "front",
    gatewayPriority: 0,
    whyNow:
      "ChaTm, MexTm, EuTm에서 이미 다룬 출원 경로 판단을 한 번에 다시 정리해, 여러 나라를 비교할 때 바로 참고할 수 있게 만든 리포트입니다. LatTm은 전체 기준을 잡는 참고 프레임이고, JapTm은 필요할 때 이어 읽는 보조 자료입니다.",
    trustLayerChecklist: [
      "어느 시장에서 현지 맞춤이 더 많이 필요한지 먼저 적는다.",
      "본국기초출원과 여러 국가를 함께 묶어 출원하는 일정이 안정적인지 나눠 본다.",
      "권리자와 실제 사용자 구분, 출원 준비 책임자, 경로 재검토 기준을 빈칸 없이 정리한다."
    ],
    focusPoints: [
      {
        id: "china-local-fit",
        title: "ChaTm: 현지 맞춤 필요성을 먼저 본다",
        summary:
          "중문 표기, 상품·서비스 적합성, 권리자 구성이 직접출원 쪽으로 기우는지부터 보고 출원 경로 메모를 정리합니다.",
        href: buildGuideSectionPath(
          "china",
          "제4장-출원-경로-선택-직접출원-vs-마드리드",
          "출원-경로-시나리오별-판단표"
        ),
        guideSlug: "china",
        ctaLabel: "ChaTm 판단표 보기"
      },
      {
        id: "mexico-control",
        title: "MexTm: 일괄 출원보다 현지 실행 통제를 먼저 본다",
        summary:
          "멕시코의 실행 흐름과 혼합 경로 기준으로, 현지 실행 통제가 묶음 효율보다 먼저인지 정리합니다.",
        href: buildGuideSectionPath(
          "mexico",
          "제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교",
          "buyer-entry-경로-선택표"
        ),
        guideSlug: "mexico",
        ctaLabel: "MexTm buyer-entry 표 보기"
      },
      {
        id: "europe-governance",
        title: "EuTm: 관리 기준과 출원 연결 흐름을 함께 본다",
        summary:
          "권역형 가이드답게 누가 출원 기준을 정하고, 출원 뒤 증거 관리까지 어떻게 이어지는지 먼저 확인합니다.",
        href: buildGuideSectionPath(
          "europe",
          "제5장-출원-경로와-서류-설계",
          "route-pack-lock-board"
        ),
        guideSlug: "europe",
        ctaLabel: "EuTm lock board 보기"
      }
    ],
    relatedGuideLinks: [
      {
        label: "ChaTm route decision matrix",
        href: buildGuideSectionPath(
          "china",
          "제4장-출원-경로-선택-직접출원-vs-마드리드",
          "출원-경로-시나리오별-판단표"
        )
      },
      {
        label: "MexTm buyer-entry route table",
        href: buildGuideSectionPath(
          "mexico",
          "제4장-출원-경로-선택-직접출원-vs-마드리드국제출원-비교",
          "buyer-entry-경로-선택표"
        )
      },
      {
        label: "EuTm route pack lock board",
        href: buildGuideSectionPath(
          "europe",
          "제5장-출원-경로와-서류-설계",
          "route-pack-lock-board"
        )
      },
      {
        label: "LatTm route decision box",
        href: buildGuideSectionPath(
          "latam",
          "제04장-filing-전략-출원-경로-선택-직접출원-vs-마드리드",
          "4-decision-box-출원-경로-선택"
        )
      },
      {
        label: "JapTm route checkpoint",
        href: buildGuideSectionPath(
          "japan",
          "제4장-출원-경로-선택-직접출원-vs-마드리드국제출원",
          "경로-선택-전에-확인할-체크포인트"
        )
      }
    ]
  }),
  createReportMeta({
    id: "global-use-evidence-system",
    slug: "global-use-evidence-system",
    title: "글로벌 사용 증거 수집 운영 시스템 구축",
    summary:
      "출원 뒤에 증거를 급하게 모으기보다, 여러 나라에서 재사용할 수 있는 사용 증거 운영 체계를 미리 설계하는 방법을 정리한 스페셜 리포트입니다.",
    trustLayerSummaryObject: "사용 증거 운영 구조를",
    publishedAt: "2026-04-02T09:00:00.000Z",
    jurisdictions: ["Global", "USA", "China", "Mexico", "Japan"],
    tags: ["사용 증거", "운영 시스템", "증거 보관"],
    audience: "여러 나라의 사용 증거 운영 구조를 먼저 정리해야 하는 운영팀, 법무팀, 브랜드팀",
    gatewayLabel: "Supporting Report",
    gatewayPlacement: "supporting",
    gatewayPriority: 1,
    whyNow:
      "먼저 볼 리포트가 출원 경로 판단을 먼저 잠갔다면, 이어 볼 리포트는 그다음에 필요한 증거 담당자와 보관 구조를 함께 정리할 차례입니다. 국가별 guide만 따라가면 filing 이후 운영이 다시 흩어지기 쉬우므로, 지금 이어 볼 리포트에서 같은 증거 문법을 묶어 두는 편이 좋습니다.",
    trustLayerChecklist: [
      "누가 어떤 증거를 어떤 주기로 수집하는지 owner map을 적는다.",
      "판매 화면, 패키지, 플랫폼 로그를 같은 폴더 문법으로 정리한다.",
      "분쟁이 나기 전에도 재사용 가능한 evidence vault 구조를 유지한다."
    ],
    focusPoints: [
      {
        id: "latam-baseline",
        title: "LatTm: 기준 evidence 문법부터 맞춘다",
        summary:
          "여러 나라를 한 번에 운영할 때 어떤 증거 항목을 공통 기준으로 묶어야 하는지 기준 프레임으로 먼저 봅니다.",
        href: getProductPathBySlug("latam"),
        guideSlug: "latam",
        ctaLabel: "LatTm 기준 프레임 보기"
      },
      {
        id: "mexico-owner-map",
        title: "MexTm: 사용·갱신 owner를 함께 본다",
        summary:
          "멕시코는 실행 담당자와 갱신 담당자를 분리해 적지 않으면 filing 이후 handoff가 흐려지기 쉽습니다.",
        href: getProductPathBySlug("mexico"),
        guideSlug: "mexico",
        ctaLabel: "MexTm 운영 가이드 보기"
      },
      {
        id: "europe-evidence-triage",
        title: "EuTm: validate evidence handoff를 고정한다",
        summary:
          "EuTm은 validate stabilization과 docs sync를 이미 마쳤으므로, 유통사·마켓플레이스·판매자 증거를 어떤 순서로 넘길지 권역 기준선으로 바로 확인합니다.",
        href: buildGuideSectionPath(
          "europe",
          "제8장-등록-후-사용-갱신-증거-관리",
          "distributor--marketplace-seller-evidence-triage"
        ),
        guideSlug: "europe",
        ctaLabel: "EuTm evidence triage 보기"
      },
      {
        id: "china-evidence-handoff",
        title: "ChaTm: route와 evidence를 같이 본다",
        summary:
          "중국은 출원 판단과 사용 증거 운영이 빨리 연결되므로, 증거 담당자를 filing packet 단계에서 함께 잠가야 합니다.",
        href: getProductPathBySlug("china"),
        guideSlug: "china",
        ctaLabel: "ChaTm 운영 가이드 보기"
      }
    ],
    relatedGuideLinks: [
      {
        label: "LatTm 기준 프레임",
        href: getProductPathBySlug("latam")
      },
      {
        label: "MexTm 운영 가이드",
        href: getProductPathBySlug("mexico")
      },
      {
        label: "ChaTm 운영 가이드",
        href: getProductPathBySlug("china")
      },
      {
        label: "EuTm evidence triage",
        href: buildGuideSectionPath(
          "europe",
          "제8장-등록-후-사용-갱신-증거-관리",
          "distributor--marketplace-seller-evidence-triage"
        )
      },
      {
        label: "JapTm 운영 가이드",
        href: getProductPathBySlug("japan")
      }
    ]
  })
];

export const reports = [...reportSource].sort(sortReportsByPublishedAt);

export function getGatewayFeaturedReports(limit = 2) {
  return [...reportSource]
    .filter((report) => report.gatewayPlacement !== "archive")
    .sort(sortReportsForGateway)
    .slice(0, limit);
}

export function getPrimaryGatewayReport() {
  return getGatewayFeaturedReports(1)[0];
}

export function buildReportOpenLabel(
  report: ReportMeta,
  emphasis: "default" | "immediate" = "default"
) {
  return emphasis === "immediate"
    ? `${report.gatewayLabel} 바로 보기`
    : `${report.gatewayLabel} 보기`;
}

export function buildReportStatusLabel(report: Pick<ReportMeta, "gatewayPlacement">) {
  switch (report.gatewayPlacement) {
    case "front":
      return "Front Report";
    case "supporting":
      return "Supporting Report";
    case "archive":
      return "Archived Report";
  }
}

export function buildReportArchivePath() {
  return "/reports";
}

export function buildReportPath(reportSlug: string) {
  return `${buildReportArchivePath()}/${reportSlug}`;
}

export function getReportBySlug(reportSlug: string) {
  return reports.find((report) => report.slug === reportSlug);
}

function findFocusPointForGuide(report: ReportMeta, guideSlug: string, productPath: string) {
  return report.focusPoints.find((focusPoint) =>
    focusPoint.guideSlug === guideSlug
    || matchesGuidePath(focusPoint.href, productPath)
  );
}

export function getReportsForGuideSlug(guideSlug: string): GuideReportHandoff[] {
  const product = getProductBySlug(guideSlug);

  if (!product) {
    return [];
  }

  const productPath = getProductPathBySlug(product.slug);

  return reportSource
    .filter((report) => report.gatewayPlacement !== "archive")
    .filter((report) =>
      Boolean(findFocusPointForGuide(report, product.slug, productPath))
      || report.relatedGuideLinks.some((link) => matchesGuidePath(link.href, productPath))
    )
    .sort(sortReportsForGateway)
    .map((report) => ({
      report,
      focusPoint: findFocusPointForGuide(report, product.slug, productPath)
    }));
}

export function getPrimaryFocusPointForGuide(guideSlug: string, reportSlug?: string) {
  if (reportSlug) {
    const product = getProductBySlug(guideSlug);
    const report = getReportBySlug(reportSlug);

    if (!product || !report) {
      return undefined;
    }

    return findFocusPointForGuide(report, product.slug, getProductPathBySlug(product.slug));
  }

  return getReportsForGuideSlug(guideSlug)[0]?.focusPoint;
}

export function getLatestReport() {
  return reports[0];
}

export function formatReportDate(publishedAt: string) {
  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function buildReportDocumentTitle(report?: ReportMeta) {
  return buildRuntimeDocumentTitle(report ? report.title : "Special Report");
}
