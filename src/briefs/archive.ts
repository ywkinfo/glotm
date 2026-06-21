import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";
import { briefIssues as legacyBriefIssues } from "./archiveLegacy";
import type { BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

export type { BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

const latestBriefIssue: BriefIssue = {
  slug: "2026-07-short-brand-name-clearance",
  title:
    "2026년 7월 Hot Global TM Brief | VB·Swift·Caviar: 짧은 브랜드명일수록, 출시 전에 먼저 점검해야 하는 이유",
  summary:
    "2026년 상반기, 짧은 표장을 둘러싼 분쟁이 잇따랐습니다. 빅토리아 베컴 측은 미국에서 Vera Bradley의 VB 표장에 대한 이의신청을 끝까지 진행하지 않았고, Taylor Swift 측 TAS Rights Management는 침구업체 Cathay Home의 Swift Home 표장에 이의를 제기했습니다. 주얼리 브랜드 Lagos는 CAVIAR 표장을 근거로 신생 브랜드 Coastal Caviar를 상대로 소송을 제기했고, 상대방은 결국 Club Coastal로 리브랜딩했습니다. 세 사건의 공통점은 짧고 흔한 단어·이니셜일수록 기억하기 쉽지만 이미 누군가 사용하거나 등록했을 가능성도 높다는 점입니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-07-01T09:00:00.000Z",
  jurisdictions: ["United States", "Trademark Clearance", "Celebrity Brand", "Short Mark", "False Association"],
  bodyParagraphs: [
    "세 건 모두 연예·패션 가십처럼 보이지만, 실제 쟁점은 같은 IP 질문 하나로 모입니다. 짧고 흔한 단어나 이니셜, 즉 보호범위가 좁고 경쟁자가 많은 표장을 누가 어디까지 독점할 수 있느냐입니다. 짧은 이름은 기억하기 쉽고 확장성이 좋지만, 같은 이유로 이미 누군가 선점하고 있을 가능성도 높습니다.",
    "첫 번째는 이니셜입니다. 빅토리아 베컴 측은 미국 핸드백 브랜드 Vera Bradley의 VB 표장에 대해 이의신청 가능성을 열어 두었지만, 끝내 본안 이의신청으로 이어가지 않았습니다. 두 글자 이니셜은 본질적으로 식별력이 강하지 않고, 여러 상품류와 국가에서 다양한 권리자가 공존하기 쉽습니다. 유명세가 있더라도 국가별 저명성, 실제 사용 증거, 상품 간 관련성, 선등록 현황을 따로 봐야 합니다.",
    "두 번째는 흔한 단어이자 사람 이름입니다. Taylor Swift 측 권리관리사 TAS Rights Management는 2026년 2월 11일 Cathay Home의 Swift Home 표장에 이의를 제기했습니다. 쟁점은 swift라는 단어 자체보다, 해당 표시가 Taylor Swift의 시그니처 스타일을 연상시키고 소비자에게 후원·승인·연관성을 떠올리게 할 수 있는지에 놓여 있습니다. 흔한 성씨나 일반 단어를 둘러싼 분쟁은 단어 점유가 아니라 표시 방식과 연상에서 시작되는 경우가 많습니다.",
    "세 번째는 흔한 단어 한 개입니다. 미국 주얼리 브랜드 Lagos는 CAVIAR를 보석류 분야에서 오래 사용·등록해 왔고, Coastal Caviar의 사용을 문제 삼아 2026년 1월 23일 소송을 제기했습니다. Coastal Caviar 측은 혼동가능성을 다툴 여지가 있다고 봤지만, 실제 결말은 법리보다 비용 계산에 가까웠습니다. 후발 주자는 시간과 자원 부담을 고려해 Club Coastal로 리브랜딩했고, 사건은 4월 21일 with prejudice로 취하됐습니다.",
    "이 사례들은 짧은 표장이 약하다는 말이 곧 쓸모없다는 뜻은 아니라는 점도 보여줍니다. 흔한 단어라도 특정 카테고리에서 오래, 일관되게 쓰면 실무상 강한 집행 수단이 될 수 있습니다. 반대로 신규 진입자는 출시 후에 이름을 바꾸는 비용이 출원 전 clearance 비용보다 훨씬 크다는 점을 계산해야 합니다.",
    "결국 세 사건은 같은 세 가지 과제로 정리됩니다. 첫째, 약한 표장의 강화입니다. 흔한 단어·이니셜은 사용·홍보로 2차적 의미를 쌓고, 단어만이 아니라 로고·서체·시그니처 스타일까지 자산화해야 합니다. 둘째, 유명인·브랜드의 상품군 확장입니다. 인접 카테고리로 넓힐수록 false association은 무기이자 리스크가 됩니다. 셋째, 네이밍 clearance입니다. 짧고 흔한 이름일수록 쓸 수 있는가가 아니라 막힐 수 있는가, 막을 수 있는가를 출원 전에 점검해야 합니다.",
    "짧은 이름은 매력적이지만 그만큼 붐비는 골목입니다. 출시 마케팅을 키우기 전에 핵심 표장 하나를 기준으로 선등록, 표장 강도, 연관 리스크, 국가별 저명성, 대안 시나리오를 한 장으로 정리해 두는 편이 나중에 거절·이의·소송·리브랜딩으로 되돌아오는 비용을 가장 크게 줄여 줍니다."
  ],
  items: [
    {
      id: "short-brand-name-clearance-before-launch",
      headline:
        "짧은 단어·이니셜 브랜드는 쓸 수 있는가보다 막힐 수 있는가와 막을 수 있는가를 출원 전에 점검해야 합니다",
      whatChanged:
        "2026년 상반기 VB, Swift Home, Caviar 관련 분쟁이 이어지면서 짧은 표장의 clearance 리스크가 다시 부각됐습니다. VB 건은 두 글자 이니셜의 공존 가능성을, Swift Home 건은 흔한 단어와 시그니처 연상의 false association 리스크를, Coastal Caviar 건은 흔한 단어라도 장기 사용·등록이 있으면 후발 브랜드의 리브랜딩 비용으로 이어질 수 있음을 보여줍니다.",
      whoShouldCare:
        "짧은 브랜드명·이니셜·흔한 단어로 글로벌 출시를 준비하는 브랜드 오너와 마케팅팀, 네이밍 clearance를 관리하는 인하우스 IP·법무팀, 유명인·인플루언서 IP 매니지먼트, 인접 카테고리 확장을 검토하는 브랜드 전략팀.",
      whyItMatters:
        "짧은 표장은 기억하기 쉽지만 충돌 가능성이 높고 보호범위도 쉽게 흔들립니다. 출시 후 USPTO 거절, 이의신청, 침해소송, 리브랜딩이 이어지면 이름값보다 회수 비용이 더 커집니다. 특히 유명인·셀럽 브랜드는 단어 자체보다 서체, 시그니처, 상품군 확장, 소비자 연상까지 함께 검토해야 합니다.",
      nextAction:
        "핵심 표장 1개를 기준으로 ① 동일·유사 선등록 현황 ② 표장 강도 ③ 유명인·시그니처 스타일 연상 리스크 ④ 진출국별 저명성·사용증거 공백 ⑤ 거절·이의·소송 시 리브랜딩 대안과 비용을 한 장으로 정리합니다. 네이밍 후보 단계에서 이 표를 만들고, 출시 직전이 아니라 출원 전 go/revise/hold 판단에 사용합니다.",
      relatedGuideLinks: [
        {
          label: "UsaTm 운영 가이드",
          href: getProductPathBySlug("usa")
        },
        {
          label: "EuTm 운영 가이드",
          href: getProductPathBySlug("europe")
        },
        {
          label: "UKTm 운영 가이드",
          href: getProductPathBySlug("uk")
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
