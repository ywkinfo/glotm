import { getProductPathBySlug } from "../products/registry";
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
  publishedAt: string;
  updatedAt?: string;
  jurisdictions: string[];
  tags: string[];
  statusLabel: string;
  audience: string;
  gatewayLabel: string;
  gatewayPlacement: ReportGatewayPlacement;
  gatewayPriority: number;
  whyNow: string;
  trustLayerChecklist: string[];
  focusPoints: ReportFocusPoint[];
  relatedGuideLinks: ReportGuideLink[];
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
  gatewaySectionKicker: "Front Reports",
  gatewaySectionTitle: "지금 읽어야 할 Report를 Gateway 첫 화면에서 바로 엽니다",
  gatewaySectionSummary:
    "국가별 guide에 들어가기 전에 교차 관할권 trust layer를 먼저 보고 싶다면 여기서 바로 시작하면 됩니다. Gateway는 메타데이터 기준으로 front placement report와 supporting report를 자동 정렬해 먼저 보여 줍니다.",
  archiveHeroKicker: "Special Report",
  archiveHeroTitle: "개별 guide를 넘어 교차 관할권 운영 판단을 다루는 스페셜 리포트",
  archiveHeroLead:
    "특정 국가 하나의 절차 요약보다, 여러 관할에서 반복해서 부딪히는 운영 질문을 한 문서로 정리하는 심화 리포트 아카이브입니다.",
  archiveHeroSummary:
    "가이드가 국가별 실행 맥락을 정리한다면, 리포트는 출원 경로, owner split, mixed route 같은 교차 관할권 문제를 별도 레인으로 묶어 보여줍니다.",
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
      "중국·멕시코·유럽·중남미·일본 가이드에 흩어진 route decision 질문을 하나의 trust layer로 묶어, local-fit과 central-management를 어떻게 나눠 볼지 정리한 스페셜 리포트입니다.",
    publishedAt: "2026-04-04T12:00:00.000Z",
    jurisdictions: ["Global", "China", "Mexico", "Europe", "Japan"],
    tags: ["출원 경로", "Madrid", "Route Memo"],
    statusLabel: "Front trust layer",
    audience: "다국가 launch sequencing과 filing route를 먼저 정리해야 하는 브랜드 관리자, 인하우스 IP 팀",
    gatewayLabel: "Front Report",
    gatewayPlacement: "front",
    gatewayPriority: 0,
    whyNow:
      "ChaTm은 growth lane의 mature baseline으로 잠겼고, MexTm은 Sprint 2로 filing·maintenance·enforcement handoff까지 운영 문법을 더 선명하게 만들었습니다. EuTm도 validate stabilization과 docs sync를 마쳤기 때문에, 이제 route decision 질문을 Gateway 첫 화면의 buyer-facing trust layer로 다시 묶을 타이밍입니다.",
    trustLayerChecklist: [
      "어느 시장에서 local-fit pressure가 더 강한지 먼저 적는다.",
      "본국기초출원과 global bundle timing이 안정적인지 분리해 본다.",
      "owner split, filing pack owner, switch trigger를 빈칸 없이 잠근다."
    ],
    focusPoints: [
      {
        id: "china-local-fit",
        title: "ChaTm: local-fit pressure를 먼저 잠근다",
        summary:
          "중문 표기, goods/services fit, owner split이 direct filing 쪽으로 기우는지부터 본 뒤 route memo를 잠급니다.",
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
        title: "MexTm: bundle보다 execution control을 본다",
        summary:
          "IMPI 실행 흐름과 mixed route board를 기준으로, local execution control이 bundle 효율보다 먼저인지 정리합니다.",
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
        title: "EuTm: governance와 filing handoff를 묶는다",
        summary:
          "권역형 guide답게 route pack을 누가 잠그고 filing-to-evidence handoff를 어떻게 유지할지 먼저 확인합니다.",
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
      "출원 이후에 증거를 뒤늦게 모으는 방식에서 벗어나, 여러 국가에서 재사용 가능한 사용 증거 운영 체계를 어떻게 미리 설계할지 정리한 스페셜 리포트입니다.",
    publishedAt: "2026-04-02T09:00:00.000Z",
    jurisdictions: ["Global", "USA", "China", "Mexico", "Japan"],
    tags: ["사용 증거", "운영 시스템", "증거 보관"],
    statusLabel: "Supporting trust layer",
    audience: "여러 국가에서 evidence owner와 evidence vault 구조를 먼저 잠가야 하는 운영팀, 법무팀, 브랜드팀",
    gatewayLabel: "Supporting Report",
    gatewayPlacement: "supporting",
    gatewayPriority: 1,
    whyNow:
      "front report가 route decision 질문을 먼저 잠갔다면, supporting report는 그 다음 handoff인 evidence owner와 evidence vault 구조를 관할 공통 문법으로 다시 묶어 줘야 합니다. 국가별 가이드만 읽고 끝내면 filing 이후 운영 체계가 다시 흩어지기 쉬우므로, 지금 supporting lane에서 같은 증거 시스템 문법을 고정할 필요가 있습니다.",
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
          "여러 국가를 한 번에 운영할 때 어떤 증거 항목을 공통 기준으로 묶어야 하는지 flagship baseline으로 먼저 봅니다.",
        href: getProductPathBySlug("latam"),
        guideSlug: "latam",
        ctaLabel: "LatTm 기준 프레임 보기"
      },
      {
        id: "mexico-owner-map",
        title: "MexTm: 사용·갱신 owner를 함께 본다",
        summary:
          "멕시코는 실행 owner와 갱신 owner를 분리해 적지 않으면 filing 이후 handoff가 흐려지기 쉬운 시장입니다.",
        href: getProductPathBySlug("mexico"),
        guideSlug: "mexico",
        ctaLabel: "MexTm 운영 가이드 보기"
      },
      {
        id: "china-evidence-handoff",
        title: "ChaTm: route와 evidence를 같이 본다",
        summary:
          "중국은 route decision과 사용 증거 운영이 빨리 연결되므로, evidence owner를 filing packet 단계에서 같이 잠가야 합니다.",
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
        label: "EuTm 운영 가이드",
        href: getProductPathBySlug("europe")
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

export function buildReportArchivePath() {
  return "/reports";
}

export function buildReportPath(reportSlug: string) {
  return `${buildReportArchivePath()}/${reportSlug}`;
}

export function getReportBySlug(reportSlug: string) {
  return reports.find((report) => report.slug === reportSlug);
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
