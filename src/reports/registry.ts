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

export type ReportMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  jurisdictions: string[];
  tags: string[];
  relatedGuideLinks: ReportGuideLink[];
};

function buildGuideSectionPath(
  productSlug: string,
  chapterSlug: string,
  sectionId?: string
) {
  return `${buildChapterPath(getProductPathBySlug(productSlug), chapterSlug)}${buildSectionHash(sectionId)}`;
}

const reportSource: ReportMeta[] = [
  {
    id: "global-filing-route-framework",
    slug: "global-filing-route-framework",
    title: "출원 경로 결정 프레임워크: 직접출원 vs 마드리드",
    summary:
      "중국·멕시코·유럽·중남미·일본 가이드에 흩어진 route decision 질문을 하나의 trust layer로 묶어, local-fit과 central-management를 어떻게 나눠 볼지 정리한 스페셜 리포트입니다.",
    publishedAt: "2026-04-04T12:00:00.000Z",
    jurisdictions: ["Global", "China", "Mexico", "Europe", "Japan"],
    tags: ["출원 경로", "Madrid", "Route Memo"],
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
  },
  {
    id: "global-use-evidence-system",
    slug: "global-use-evidence-system",
    title: "글로벌 사용 증거 수집 운영 시스템 구축",
    summary:
      "출원 이후에 증거를 뒤늦게 모으는 방식에서 벗어나, 여러 국가에서 재사용 가능한 사용 증거 운영 체계를 어떻게 미리 설계할지 정리한 스페셜 리포트입니다.",
    publishedAt: "2026-04-02T09:00:00.000Z",
    jurisdictions: ["Global", "USA", "China", "Mexico", "Japan"],
    tags: ["사용 증거", "운영 시스템", "증거 보관"],
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
  }
];

export const reports = [...reportSource].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
);

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
