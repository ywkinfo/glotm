import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";
import { briefIssues as legacyBriefIssues } from "./archiveLegacy";
import type { BriefIssue } from "./archiveLegacy";

export type { BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

const latestBriefIssue: BriefIssue = {
  slug: "2026-07-uk-influencer-counterfeit-damages-formula",
  title:
    "2026년 7월 Hot Global TM Brief | 인플루언서 위조 유통의 £213,000 배상액은 판매규모·대체율·이익률의 산식에서 나왔습니다",
  summary:
    "영국 고등법원 지식재산기업법원(IPEC)이 인플루언서가 운영한 위조 명품 판매에 대해 합계 £213,000의 손해배상을 명령했습니다(Fendi Italia Srl & Ors v Rolo Fashion Limited & Anor, [2026] EWHC 1703 (IPEC), 2026년 7월 9일 선고, HHJ Hacon). 주목할 점은 금액이 아니라 산정 방식입니다. 법원은 거래를 하나씩 검사해 분류한 것이 아니라, 피고 계좌의 7개월 입금액을 피고 평균 판매가로 나눠 판매 규모를 추정하고, 여기에 대체율과 원고의 건당 이익을 곱해 일실이익을 냈습니다. 나머지 거래에는 비교 가능한 라이선스 자료가 없어 '최소한'의 3% 사용료만 적용됐습니다. 반면 브랜드 명성이 훼손됐다는 청구는 증거가 뒷받침되지 않아 받아들여지지 않았고, 원고 측 전문가가 세운 WhatsApp 그룹원 전원 구매 가정도 근거 부족으로 배척됐습니다. 해외 채널에서 위조 유통을 겪는 K-브랜드가 가져갈 함의는 자료를 많이 모으는 것보다, 각 자료가 손해 산식의 어느 입력값을 증명하는지 설명할 수 있어야 한다는 것입니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-07-20T00:00:00.000Z",
  jurisdictions: ["United Kingdom", "Counterfeit Damages", "Damages Calculation", "Social Commerce", "IPEC"],
  bodyParagraphs: [
    "영국 고등법원 지식재산기업법원(IPEC)이 위조 명품 판매에 대한 손해액을 산정했습니다. Fendi Italia Srl & Ors v Rolo Fashion Limited & Anor, [2026] EWHC 1703 (IPEC) 사건에서 HHJ Hacon은 2026년 7월 9일 피고 측에 합계 £213,000을 지급하도록 명령했습니다(The Fashion Law 7월 16일, FashionUnited·TheIndustry.fashion 7월 15일 보도). 이 사건이 눈에 띄는 이유는 금액보다 판매자의 성격과 산정 방식에 있습니다. 판매자는 노점상이나 마켓플레이스 셀러가 아니라 소셜미디어 마케팅을 업으로 하는 인플루언서였고, 위조품 사업은 본업인 마케팅 회사와 별개의 법인으로 운영됐습니다.",
    "유통 구조는 기존 위조 대응 모델이 겨냥해 온 지점과 어긋납니다. 판매는 인스타그램 계정과 거기서 유입된 WhatsApp 그룹을 통해 이뤄졌습니다. 판결문에는 AliExpress·DHgate·Xu Qiu가 공급처로 등장하며, 피고는 재고 없이 전적으로 드롭시핑 방식으로 운영했다고 주장했지만 법원은 WhatsApp 대화의 재고 보유 표현과 일치하지 않는다고 지적했습니다. 공개 리스팅이 아니라 초대 기반 폐쇄 채널이었다는 점도 중요합니다. 플랫폼 신고와 리스팅 삭제 중심의 대응은 이런 채널에 직접 닿지 않고, 노출된 계정을 내려도 거래는 대화방 안에서 계속될 수 있습니다.",
    "실무적으로 가장 중요한 대목은 법원이 손해액을 만든 산식입니다. 법원은 개별 거래를 하나씩 검사해 분류하지 않았습니다. 대신 피고 계좌의 7개월치 입금액 £51,551.14를 피고 평균 판매가 £110으로 나눠 월 약 66건을 얻고, 이를 침해 기간 72개월로 확장해 총 4,752건을 추정했습니다. 여기에 대체율 15%를 적용해 진품 판매를 대체한 것으로 볼 수 있는 약 713건을 도출하고, 원고 측 건당 이익 약 £280을 곱해 £199,640, 반올림해 £200,000을 인정했습니다. 나머지 4,039건에는 이른바 사용자 원칙에 따라 사용료 상당액을 인정했는데, 비교 가능한 라이선스 자료가 제출되지 않아 법원은 피고 판매가의 3%라는 '최소한'의 요율을 적용해 £13,000만 인정했습니다.",
    "받아들여지지 않은 청구도 분명합니다. 청구인들은 위조품 판매가 상표의 가치를 떨어뜨렸다며 명성 손해를 함께 주장했지만, 법원은 이를 뒷받침할 증거가 없다고 판단했습니다. 구매자들이 문제된 상품을 원고에게서 온 것으로 믿었다고 볼 근거가 없고, 오히려 병행적이고 의도적으로 규제 밖에 있는 시장에서 위조품을 산다는 점을 이해하고 있었다고 봤습니다. 상표침해가 인정됐다는 사실만으로 명성 손해가 추정되지는 않았습니다. 이 사건에서 배상액을 만든 것은 건별 분류가 아니라 추정 판매량, 대체율, 원고의 평균 이익과 최저 사용료를 연결한 손해 산식이었습니다.",
    "원고 측 증거가 어디까지 받아들여졌는지도 눈여겨볼 대목입니다. 원고 측 전문가는 WhatsApp 그룹원 1,311명이 각자 최소 1회는 구매했다고 가정해 총 판매량을 산출했지만, 법원은 그 가정에 아무런 근거가 제시되지 않았다며 핵심 축을 받아들일 수 없다고 판단했습니다. 고품질 위조품이 소비자를 진품으로 오인하게 한다는 주장도, 피고 판매가가 원고 평균가의 15%에 못 미친다는 점을 들어 받아들이지 않았습니다. 정리하면 피고의 불충분한 자료 제출이 피고에게 유리한 추정을 막은 것은 맞지만, 그렇다고 원고의 근거 없는 추정이 그대로 받아들여진 것도 아닙니다. 법원은 원고 측 가정을 배척한 뒤 계좌 입금액·피고 평균 판매가·대체율·원고 평균 이익을 조합해 손해액을 추정했습니다. 이 사건의 교훈은 자료가 많아야 한다는 데 그치지 않고, 각 자료가 손해 산식의 어느 입력값을 증명하는지 설명할 수 있어야 한다는 것입니다.",
    "그래서 K-뷰티·K-패션 브랜드가 가져갈 정리는 증거 패킷을 손해 산식의 입력값에 맞춰 다시 짜는 것입니다. 계정 캡처, 팔로워 수, 광고 문구는 침해 사실과 고의를 보이는 데는 쓰이지만 그 자체로 배상액을 만들지 못했습니다. 특히 이 사건에서 사용료 상당액이 £13,000에 그친 이유는 침해 규모가 작아서가 아니라, 적정 요율을 판단할 라이선스 자료가 없어 법원이 최소치를 적용했기 때문입니다. 자사 라이선스·로열티 실적을 정리해 두는 일이 곧 배상 산정의 입력값을 갖추는 일이라는 뜻입니다. 폐쇄형 채널에서는 적법한 시험구매와 대화 로그 보존이 거래 흐름과 상품 상태를 재구성하는 유력한 보완수단이 될 수 있습니다. 다만 이는 판결이 직접 제시한 조치가 아니라 사건의 채널 구조에서 도출한 실무 제안이므로, 현지 절차와 증거 보존 요건을 함께 확인해야 합니다.",
    "다만 범위를 넘겨 읽지 않는 편이 안전합니다. 첫째, 이 사건은 궐석판결로 책임이 이미 확정된 뒤 손해액만 다툰 절차이므로, 쟁점을 정면으로 다툰 본안 판단과는 성격이 다릅니다. 둘째, 영국 IPEC의 손해액 산정 방식이 다른 나라에 그대로 옮겨지지는 않습니다. 셋째, 일반 매체가 표기한 미화 약 28만 5천 달러는 £213,000의 환산치이며, 판결 금액은 파운드 기준입니다. 넷째, 법원이 인정한 손해액과 실제로 회수되는 금액은 다른 문제입니다. 이 사건에서도 피고 측은 유의미한 자금이 없어 상당한 판결금 지급이 불가능하다고 주장했습니다. 구체적 사건에 적용할 판단이 필요하다면 판결문과 현지 대리인 확인을 거쳐야 합니다."
  ],
  items: [
    {
      id: "uk-counterfeit-damages-formula-inputs",
      headline:
        "위조 대응 증거는 '많이 모으는 것'이 아니라 손해 산식의 입력값(판매규모·대체율·이익률·사용료)을 증명하는 방향으로 설계해야 합니다",
      whatChanged:
        "영국 IPEC이 인플루언서가 운영한 위조 명품 판매에 대해 합계 £213,000의 배상을 명령했습니다(Fendi Italia Srl & Ors v Rolo Fashion Limited & Anor, [2026] EWHC 1703 (IPEC), 2026년 7월 9일 선고, HHJ Hacon). 법원은 거래를 개별 검사해 분류한 것이 아니라, 피고 계좌 7개월 입금액 £51,551.14를 피고 평균 판매가 £110으로 나눠 월 약 66건을 얻고 72개월로 확장해 총 4,752건을 추정한 뒤, 대체율 15%로 약 713건을 도출하고 원고 건당 이익 약 £280을 곱해 £200,000을 인정했습니다. 나머지 4,039건에는 비교 가능한 라이선스 자료가 없어 피고 판매가의 3%라는 최소 요율만 적용해 £13,000을 인정했습니다. 명성 손해 청구는 증거 부족으로 기각됐고, 원고 측 전문가의 WhatsApp 그룹원 전원 구매 가정도 근거가 제시되지 않았다는 이유로 배척됐습니다.",
      whoShouldCare:
        "영국·EU 등 해외 채널에서 위조 유통을 겪는 K-뷰티·K-패션 브랜드의 IP팀과 브랜드보호 담당, 인플루언서·어필리에이트 채널을 운영하는 이커머스·마케팅팀, 침해 대응 예산과 배상 가능성을 판단해야 하는 법무·경영진, 라이선스·로열티 자료를 관리하는 사업팀.",
      whyItMatters:
        "위조 대응에서 흔히 준비하는 자료는 계정 캡처와 팔로워 규모, 광고 문구입니다. 그러나 이번 사건에서 배상액을 만든 것은 판매 규모 추정과 대체율, 원고의 건당 이익을 연결한 산식이었고, 브랜드 훼손 주장과 근거 없는 판매량 가정은 모두 배척됐습니다. 특히 사용료 상당액이 £13,000에 그친 이유는 침해 규모가 아니라 적정 요율을 판단할 라이선스 자료가 없었기 때문입니다. 각 자료가 산식의 어느 입력값을 증명하는지 설명할 수 없으면, 침해가 인정되더라도 인정되는 손해액의 근거가 약해질 수 있습니다.",
      nextAction:
        "위조 대응 증거 패킷을 ① 채널·운영자 식별(계정·대화방·운영 법인) ② 판매규모 근거(계좌·결제 내역, 판매 기간, 침해자 평균 판매가) ③ 대체율 근거(가격 차이, 상품 품질, 구매자 인식 정황) ④ 자사 손실 근거(진품 평균 판매가, 이익률, 제품별 마진) ⑤ 사용료 근거(비교 가능한 라이선스 계약과 로열티율)의 다섯 층으로 다시 짭니다. 특히 ⑤는 평소에 정리해 두지 않으면 분쟁 시점에 만들 수 없고, 자료가 없으면 최소 요율이 적용될 수 있습니다. 폐쇄 채널이 의심되면 리스팅 삭제 요청 전에 적법한 시험구매와 대화 로그부터 확보하고, 영국·EU 대응은 현지 대리인과 손해액 산정 방식을 미리 맞춰 둡니다.",
      relatedGuideLinks: [
        {
          label: "UKTm 운영 가이드",
          href: getProductPathBySlug("uk")
        },
        {
          label: "EuTm 운영 가이드",
          href: getProductPathBySlug("europe")
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
