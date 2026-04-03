import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";

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

const reportSource: ReportMeta[] = [
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
