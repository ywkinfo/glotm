import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";
import { briefIssues as legacyBriefIssues } from "./archiveLegacy";
import type { BriefIssue } from "./archiveLegacy";

export type { BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

const latestBriefIssue: BriefIssue = {
  slug: "2026-07-kbrand-government-certification-mark",
  title:
    "2026년 7월 Hot Global TM Brief | 정부가 상표권자가 되는 K-브랜드 인증, 8월 말 시행 전에 기업이 정리할 것들",
  summary:
    "지식재산처가 해외 위조상품에 대응하는 K-브랜드 정부인증 제도를 도입합니다. 4월 6일 대한민국 정책브리핑에 따르면 정부가 인증상표의 권리자로서 해외에 직접 등록하고, 기업이 사용을 신청하면 정품인증기술을 적용해 위조상품 유통을 실시간으로 파악·대응하는 구조입니다. 인증표장은 6월까지 개발해 K-푸드·K-뷰티·K-패션 수출 비중과 위조 위험이 높은 해외 70개국에 출원·등록을 추진하며(서울경제 영문판 3월 31일 보도·6월 26일 정책브리핑 설명자료), 지식재산처가 5월 28일 브리핑에서 밝힌 대로 8월 말 제도 본격 시행과 기업 사용 신청 개시가 예정된 일정입니다. 수출기업 입장에서 정부가 권리자인 인증 레이어는 의미 있는 지원 장치이지만, 기업 자신의 상표 포트폴리오·세관 등록·증거 체계를 대체하지는 않습니다. 제도 시행 전인 지금이 자체 권리 공백을 점검할 시점입니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-07-04T00:00:00.000Z",
  jurisdictions: ["Korea", "Cross-Border Enforcement", "Counterfeit Control", "Certification Mark", "K-Brand"],
  bodyParagraphs: [
    "지식재산처는 4월 6일 대한민국 정책브리핑을 통해 K-브랜드 정부인증 제도의 구조를 밝혔습니다. 정부가 인증상표의 권리자가 되어 해외에 직접 등록하고, 기업이 사용을 신청하면 정품인증기술을 적용하는 방식입니다. 서울경제 영문판 3월 31일 보도와 6월 26일 정책브리핑 설명자료에 따르면 인증표장을 6월까지 개발해 K-푸드·K-뷰티·K-패션 수출 비중과 위조상품 유통 위험이 높은 해외 70개국에 출원·등록을 추진하고, 지식재산처는 5월 28일 브리핑에서 8월 말 본격 시행을 예고했습니다.",
    "이 구조의 핵심은 권리자가 정부라는 점입니다. 개별 수출기업이 70개국에서 위조상품을 모니터링하고 현지 조사와 세관 차단까지 끌고 가려면 시간과 비용 부담이 큽니다. 서울경제 보도는 이 대응이 상표 모니터링, 현지 당국 조사, 세관 단계 차단까지 여러 부처가 함께 움직이는 집행으로 이어진다고 설명하고, 정책브리핑은 위조상품 유통의 실시간 파악과 대응, 그리고 기업의 시간·비용 부담 감소를 기대 효과로 듭니다.",
    "소비자 쪽 장치도 함께 갑니다. 서울경제 보도에 따르면 인증표장이 부착된 제품에는 QR코드와 AI 워터마크 같은 인증 기술이 적용되어, 해외 소비자가 스마트폰으로 정품 여부를 바로 확인할 수 있습니다. 인증표장이 시장에서 정품 표시 레이어로 작동하는 셈입니다.",
    "다만 이 제도를 기업 자신의 상표 전략의 대체재로 읽으면 곤란합니다. 정부 인증표장은 정부가 권리자인 별도의 표장으로, 지식재산처도 5월 28일 브리핑에서 이를 법적으로 증명표장 방식이라고 설명했습니다. 즉 기업 고유 브랜드의 상표권과는 다른 레이어입니다. 인증마크가 정품·가품을 걸러 주더라도, 기업 상표 자체의 해외 선점·모용 문제, 주요 수출국 등록 공백, 세관 등록 미비, 자체 사용·유통 증거 부재는 그대로 남습니다. 오히려 정부 레이어가 강해질수록 자기 권리가 비어 있는 기업의 공백이 더 도드라질 수 있습니다.",
    "그래서 8월 말 시행 전인 지금 점검할 것은 인증제도 자체가 아니라 자기 쪽 준비입니다. 첫째, 주요 수출국에서 자사 핵심 상표의 등록·출원 상태를 국가별로 확인합니다. 둘째, 위조 위험이 큰 시장의 세관 등록(중국 해관 등록, 멕시코·중남미 국경 조치, EU 세관 AFA 신청 등) 여부를 채웁니다. 셋째, 정품 채널과 유통 구조를 증빙 가능한 형태로 정리해 둡니다. 넷째, 인증표장 사용 신청이 열렸을 때 바로 대조할 수 있도록 자사 제품군·수출국 목록을 표 하나로 준비합니다.",
    "정부가 직접 상표권자로 나서는 방식은 기존 지원책과 층위가 다른 장치입니다. 그 위에 자기 권리 체계까지 갖춘 기업은 인증 레이어와 자체 레이어를 이중으로 쓰게 되지만, 자기 체계가 비어 있으면 인증마크만으로는 분쟁에서 설 자리가 좁습니다. 지원 제도가 도착하기 전에 자기 쪽 공백부터 메우는 편이 순서입니다."
  ],
  items: [
    {
      id: "kbrand-certification-company-rights-gap-check",
      headline:
        "정부 인증표장이 생겨도 기업 자신의 상표·세관·증거 체계는 대체되지 않습니다 — 8월 말 시행 전에 자체 공백을 점검해야 합니다",
      whatChanged:
        "지식재산처가 4월 6일 정책브리핑에서 K-브랜드 정부인증 제도의 구조를 밝혔습니다. 정부가 인증상표 권리자로서 해외에 직접 등록하고, 기업이 사용을 신청하면 정품인증기술을 적용해 위조상품 유통을 실시간 파악·대응합니다. 인증표장은 6월까지 개발해 해외 70개국 출원·등록을 추진하고(서울경제 영문판 3월 31일 보도·6월 26일 정책브리핑 설명자료), 지식재산처 5월 28일 브리핑 기준 8월 말 본격 시행이 예정돼 있으며, 서울경제 보도 기준 QR코드·AI 워터마크로 해외 소비자가 정품을 확인할 수 있습니다.",
      whoShouldCare:
        "K-푸드·K-뷰티·K-패션 수출 기업의 브랜드·IP 담당자, 위조상품 대응을 자체 또는 외부 채널로 운영 중인 인하우스 법무팀, 해외 유통 파트너·정품 채널을 관리하는 사업팀, 세관 등록과 국경 조치를 담당하는 물류·컴플라이언스 담당자.",
      whyItMatters:
        "인증표장은 정품 표시와 범정부 집행 레이어를 더해 주지만, 기업 고유 상표의 해외 선점·모용, 주요 수출국 등록 공백, 세관 등록 미비, 사용·유통 증거 부재는 그대로 남습니다. 자기 권리 체계가 비어 있으면 분쟁·차단·회수 국면에서 인증마크만으로는 설 자리가 좁고, 정부 레이어가 강해질수록 그 공백이 더 도드라집니다.",
      nextAction:
        "주요 수출국 목록을 기준으로 ① 자사 핵심 상표의 국가별 등록·출원 상태 ② 위조 위험 시장의 세관 등록 여부(중국 해관, 중남미 국경 조치, EU AFA 등) ③ 정품 채널·유통 구조 증빙 ④ 위조 발견 시 신고·차단 대응 라인을 표 하나로 정리합니다. 인증표장 사용 신청 공고가 나오면 이 표를 기준으로 대상 제품군·수출국 목록을 바로 대조합니다.",
      relatedGuideLinks: [
        {
          label: "ChaTm 운영 가이드",
          href: getProductPathBySlug("china")
        },
        {
          label: "MexTm 운영 가이드",
          href: getProductPathBySlug("mexico")
        },
        {
          label: "EuTm 운영 가이드",
          href: getProductPathBySlug("europe")
        },
        {
          label: "LatTm 기준 제품",
          href: getProductPathBySlug("latam")
        }
      ]
    }
  ]
};

const briefIssueSource: BriefIssue[] = [latestBriefIssue, ...legacyBriefIssues];

export const briefIssues = [...briefIssueSource].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
);

export function buildBriefArchivePath() {
  return "/briefs";
}

export function buildBriefIssuePath(issueSlug: string) {
  return `${buildBriefArchivePath()}/${issueSlug}`;
}

export function getBriefIssueBySlug(issueSlug: string) {
  return briefIssues.find((issue) => issue.slug === issueSlug);
}

export function getLatestBriefIssue() {
  return briefIssues[0];
}

export function formatBriefDate(publishedAt: string) {
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

export function buildBriefDocumentTitle(issue?: BriefIssue) {
  return buildRuntimeDocumentTitle(issue ? issue.title : "Hot Global TM Brief");
}
