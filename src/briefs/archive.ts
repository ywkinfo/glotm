import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";
import { briefIssues as legacyBriefIssues } from "./archiveLegacy";
import type { BriefIssue } from "./archiveLegacy";

export type { BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

const latestBriefIssue: BriefIssue = {
  slug: "2026-07-china-trademark-overhaul-2027-countdown",
  title:
    "2026년 7월 Hot Global TM Brief | 중국 상표법 전면 개정 통과, 2027년 1월 시행 전에 '보유한 등록의 질'을 재고조사할 때입니다",
  summary:
    "지난달 브리프에서 아직 공포·시행 전이라던 중국 상표법 개정이 확정됐습니다. 개정 상표법은 2026년 6월 26일 국가주석령 제77호로 공포되며 2027년 1월 1일 시행이 확정됐습니다. CNIPA 사이트는 7월 2일 신화사(新华网)의 해설 기사를, 7월 3일에는 전국인대 상무위원회 법제공작위원회 관계자 인터뷰를 담은 《중국지식산권보》 기사를 게재했습니다. 이번 개정의 핵심 방향 중 하나는 등록 수량보다 실제 사용과 등록의 질을 중시하는 쪽으로의 전환입니다. 그 결과 점검할 축이 하나 늘었습니다. 지난 이슈가 남의 선점에 대응하는 감시→이의 파이프라인이었다면, 이번에는 내가 이미 보유한 등록의 질입니다. 사용 목적 없는 과잉 출원, 장기 미사용 등록에 대한 당국의 직권취소, 등록상표를 소비자가 오인하도록 사용하는 행위가 새 리스크입니다. 세부 집행기준은 후속 시행규정을 계속 확인해야 하므로, 시행 전 남은 기간에 먼저 할 일은 중국 상표 재고조사입니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-07-11T00:00:00.000Z",
  jurisdictions: ["China", "Trademark Law Reform", "Non-Use Cancellation", "Misleading Use", "Portfolio Audit"],
  bodyParagraphs: [
    "지난달 6월 9일 브리프에서 \"아직 공포·시행 전\"이라고 전했던 중국 상표법 개정이 확정됐습니다. CNIPA 사이트에 7월 3일 게재된 《중국지식산권보》 기사(전국인대 상무위원회 법제공작위원회 관계자 인터뷰)에 따르면, 개정 상표법은 2026년 6월 26일 국가주석령 제77호로 공포되며 2027년 1월 1일 시행이 확정됐고, 이번 개정은 일부 조문을 손보는 부분 수정이 아니라 전면 개정입니다. 지난 이슈에서 미확인이라고 적었던 공포일·시행일이 못 박혔다는 점이 이번 주의 핵심 변화입니다.",
    "시행일이 확정되면서 점검할 축이 하나 늘었습니다. 지난 이슈가 남이 먼저 출원한 상표에 대응하는 감시→이의신청 파이프라인이었다면, 이번에는 내가 이미 중국에 보유한 등록의 질입니다. CNIPA 사이트에 7월 2일 게재된 신화사 해설 기사는 중국 상표제도가 안고 있던 '등록을 중시하고 사용을 가볍게 여기는' 문제를 지적하고, 사용 없는 과잉등록과 불사용 상표 정리를 주요 개혁 방향으로 설명합니다. 이번 개정의 핵심 방향 중 하나는 등록 수량보다 실제 사용과 등록의 질을 중시하는 쪽으로의 전환으로 요약할 수 있습니다.",
    "첫 번째 리스크는 실제 사업수요와 동떨어진 대량·과잉출원과 장기 미사용 등록입니다. 출원 단계에서는 사용 목적이 없고 정상적인 생산·경영 수요를 명백히 초과하는 출원이 등록 거절 대상이 되며, 그러한 행위가 부정적 영향을 초래한 경우 경고·행정상 벌금 등 법적 책임도 문제될 수 있습니다. 등록 이후에는 정당한 이유 없이 3년 연속 사용하지 않은 등록상표에 대해, 기존의 제3자 취소 신청 구조에 더해 당국이 직권으로 취소할 수 있는 근거가 강화됐습니다. 방어 목적으로만 쌓아 둔 미사용 등록이 자산이 아니라 유지비용과 리스크가 될 수 있다는 뜻입니다. 다만 이는 당국이 취소할 수 있다는 권한 부여이지, 3년이 지나면 자동으로 취소되거나 모든 등록이 전수조사된다는 의미는 아닙니다.",
    "두 번째는 오인 유발형 사용입니다. 개정법은 등록상표를 상품의 품질·제조공정·원재료·원산지 등에 관하여 소비자를 오인시키는 방식으로 사용하는 행위를 명시적으로 규율합니다. 7월 2일 신화사 기사는 표시된 충전기 출력과 실제 출력이 다른 경우, 기계로 생산한 제품을 수작업 제품처럼 표시하는 경우 등을 예로 듭니다. 이러한 사용은 시정명령과 행정상 벌금의 대상이 될 수 있고, 기한 내 시정하지 않는 경우 등록취소로 이어질 수 있습니다. 예컨대 '100%', '수제', '유기농', 특정 산지명처럼 상품 특성을 나타내는 표현이 상표와 결합돼 쓰이는 경우에는 실제 상품 속성과의 일치 여부를 점검할 필요가 있습니다. 등록만으로 안전하다고 보기 어렵다는 신호입니다.",
    "세 번째는 온라인 사용입니다. 개정법은 인터넷 등 정보네트워크를 통한 상표 사용행위도 법의 적용 범위에 포함된다는 점을 명확히 했습니다. 이에 따라 온라인몰·라이브커머스·앱과 플랫폼 화면·전자거래 자료가 상표 사용과 침해 판단에서 중요한 증거원이 될 가능성이 커졌고, 기업의 온라인 사용자료 수집·보존 중요성도 함께 높아졌습니다. 다만 모든 온라인 화면 노출이 곧바로 상표법상 유효한 사용으로 인정되거나, 불사용취소를 막기에 충분한 사용이라는 의미는 아닙니다.",
    "다만 시행 전에 확정된 것은 큰 틀의 '법'이지 세부 '집행기준'까지는 아닙니다. 직권 불사용취소의 세부 절차나 오인 유발형 사용의 집행기준 같은 실무 핵심은 후속 시행규정·집행지침에서 구체화될 부분이 남아 있어, 시행 전까지 계속 확인해야 합니다. 세부 규정을 기다리는 사이에도 지금 바로 할 수 있는 일이 있습니다.",
    "그것은 중국 상표 재고조사입니다. 2026년 7월 11일 기준 시행까지는 6개월이 채 남지 않았습니다(약 5개월 반). 이 기간에 보유 등록을 사용 중, 사용 예정, 장기 미사용, 오인 가능, 계약 미정비, 중문 미확보의 여섯 항목으로 전수 분류하면 개정법의 주요 리스크 대부분을 시행 전에 줄일 수 있습니다. 이는 현재 공개된 자료가 공통으로 가리키는 가장 현실적인 대응입니다."
  ],
  items: [
    {
      id: "china-overhaul-2027-portfolio-audit",
      headline:
        "중국 상표법이 전면 개정돼 2027년 1월 1일 시행이 확정된 만큼, 시행 전에 보유 등록을 '사용·진정성·오인 가능성' 기준으로 재고조사해야 합니다",
      whatChanged:
        "개정 상표법이 2026년 6월 26일 국가주석령 제77호로 공포되고 2027년 1월 1일 시행이 확정됐습니다. CNIPA 사이트는 7월 2일 신화사(新华网) 해설 기사와 7월 3일 전국인대 상무위원회 법제공작위원회 관계자 인터뷰(《중국지식산권보》)를 게재했으며, 이 자료들은 이번 개정을 부분 수정이 아닌 전면 개정으로 설명합니다. 실무상 무게가 큰 방향은 사용 목적 없는 과잉 출원의 규제(부정적 영향 시 경고·행정상 벌금), 장기 미사용 등록에 대한 당국의 직권취소 근거 강화, 등록상표를 소비자가 오인하도록 사용하는 행위에 대한 시정명령·행정상 벌금(미시정 시 등록취소 가능), 인터넷 사용의 상표 사용 명문화입니다. 직권 불사용취소의 세부 절차와 오인 유발형 사용의 집행기준 등은 후속 시행규정을 계속 확인해야 합니다.",
      whoShouldCare:
        "중국에 매출이 있거나 진출을 앞둔 K-브랜드의 IP팀, 광고·패키지 문구를 관리하는 마케팅·브랜드팀(오인 유발형 사용 축), 방어출원·갱신 포트폴리오를 쥔 글로벌 사업 PM, 라이선스·OEM·총판 계약과 중국 대리인을 관리하는 법무.",
      whyItMatters:
        "이번 개정은 권리 범위 확대만이 아니라 권리의 질과 사용의 정합성을 함께 요구합니다. 미사용 방어등록은 당국의 직권취소 대상이 될 수 있고, 등록상표라도 소비자를 오인시키는 방식으로 광고·패키지에 사용하면 시정명령·행정상 벌금과, 미시정 시 등록취소로 이어질 수 있습니다. 등록해 뒀다는 사실만으로는 안전이 보장되지 않으며, 시행일이 확정된 지금이 시행 전 정비 창구입니다.",
      nextAction:
        "중국을 기준으로 보유 등록을 ① 사용 중 ② 사용 예정 ③ 24개월+ 미사용 ④ 오인 가능(문구·산지·수치 결합) ⑤ 라이선스·총판 계약 미정비 ⑥ 중문 표기 미확보의 여섯 항목으로 전수 분류합니다. 미사용 후보는 사용개시·재출원·정리를 판단하고, 오인 가능 후보는 '상표+문구+패키지'를 법무·마케팅 공동심사로 돌립니다. 후속 시행규정·집행지침 확인 담당을 지정해 2027년 1월 1일 전에 정비를 마칩니다.",
      relatedGuideLinks: [
        {
          label: "ChaTm 운영 가이드",
          href: getProductPathBySlug("china")
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
