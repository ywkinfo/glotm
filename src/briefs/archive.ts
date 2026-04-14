import { getProductPathBySlug } from "../products/registry";
import {
  buildChapterPath,
  buildRuntimeDocumentTitle,
  buildSectionHash
} from "../products/shared";

export type BriefGuideLink = {
  label: string;
  href: string;
};

export type BriefItem = {
  id: string;
  headline: string;
  whatChanged: string;
  whoShouldCare: string;
  whyItMatters: string;
  nextAction: string;
  relatedGuideLinks: BriefGuideLink[];
};

export type BriefIssue = {
  slug: string;
  title: string;
  summary: string;
  cadenceLabel: string;
  publishedAt: string;
  jurisdictions: string[];
  bodyParagraphs?: string[];
  items: BriefItem[];
};

function buildGuideSectionPath(
  productSlug: string,
  chapterSlug: string,
  sectionId?: string
) {
  return `${buildChapterPath(getProductPathBySlug(productSlug), chapterSlug)}${buildSectionHash(sectionId)}`;
}

const briefIssueSource: BriefIssue[] = [
  {
    slug: "2026-04-k-beauty-channel-translation",
    title: "2026년 4월 Hot Global TM Brief | 성공한 K-뷰티는 채널에서 쓰는 표현과 상표 등록·사용 표기를 함께 확정합니다",
    summary:
      "아모레퍼시픽의 아이오페·에스트라 세포라 사례를 바탕으로, 해외 채널 확장 전에 브랜드팀과 IP팀이 채널에서 쓸 표현과 상표 등록·사용 표기를 어떻게 함께 확정해야 하는지 정리한 이슈입니다.",
    cadenceLabel: "주간 브리프",
    publishedAt: "2026-04-14T09:00:00.000Z",
    jurisdictions: ["Global", "K-Beauty", "Sephora", "Channel Strategy"],
    bodyParagraphs: [
      "이번 주에 먼저 볼 포인트는 단순 입점 뉴스가 아닙니다. 해외 채널 확장이 시작될 때 브랜드팀과 IP팀이 어떤 표현을 먼저 확정해야 하는가입니다. 성공 사례를 보는 이유도 박수치기보다, 우리 팀이 같은 구조로 준비하고 있는지 확인하기 위해서입니다.",
      "최근 아모레퍼시픽 발표는 그 기준점을 줍니다. 2026년 3월 3일 아이오페는 세포라를 통해 미국 시장에 공식 진출했다고 밝혔고, 3월 5일 에스트라는 2월 세포라 유럽 온라인 선론칭 이후 유럽 17개국 약 680개 세포라 오프라인 매장으로 순차 입점한다고 발표했습니다. 같은 회사 안에서도 해외 채널에서 읽히는 핵심 표현은 같지 않았습니다.",
      "이 사례가 중요한 이유는 해외 성과가 제품 하나의 히트보다, 채널이 이해하는 표현과 상표 등록·사용 표기를 함께 맞춰 놓은 팀에서 나온다는 점을 보여주기 때문입니다. 어떤 브랜드를 앞세울지, 어떤 대표 제품명을 함께 밀지, 어떤 핵심 효능 문구를 쓸지, 어떤 카테고리 표현으로 배치될지, 실제로 어떤 표기를 등록하고 사용할지를 먼저 정리해야 패키지, 상품 상세, 상표, 사용 증빙이 같은 방향으로 움직입니다.",
      "회사 발표와 4월 초 보도 흐름을 함께 보면, 최근 K-뷰티 확장은 한 국가에서 한 번 크게 성공하는 문제보다 여러 채널에 맞는 브랜드 포트폴리오를 얼마나 안정적으로 펼칠 수 있는가의 문제로 이동하고 있습니다. 여기서 더 중요한 질문은 '어디에 들어갔는가'보다 '그 채널에서 어떤 표현으로 읽히는가, 그리고 그 표현이 본사가 관리하는 자산 체계와 연결돼 있는가'입니다.",
      "반대로 이 정리 없이 채널만 늘리면 매출은 늘어도 브랜드 자산은 쉽게 흩어집니다. 국가별로 제품명과 효능 문구가 먼저 달라지거나, 파트너가 상품 설명을 임의로 바꾸거나, 본사가 관리하지 않는 표기가 플랫폼 검색어로 굳으면 이후 상표 출원, 권리 행사, 채널 관리 비용이 함께 커집니다. 그래서 이번 주에는 핵심 브랜드 1개를 골라 입점 준비 가이드를 다시 확정하는 편이 좋습니다."
    ],
    items: [
      {
        id: "k-beauty-channel-translation",
        headline: "이번 사례의 핵심은 입점 뉴스보다 입점 준비 가이드 구조입니다",
        whatChanged:
          "이번 주 시사점의 핵심은 해외 성과를 설명하는 단위가 제품 히트보다, 채널에서 쓰는 표현과 상표 등록·사용 표기를 함께 관리하는 구조로 이동하고 있다는 점입니다.",
        whoShouldCare:
          "미국·유럽·중남미 리테일 입점을 준비하는 브랜드팀, 글로벌 사업팀, 사내 IP팀, 패키지·이커머스 운영 PM",
        whyItMatters:
          "해외 채널은 추상적인 브랜드 스토리보다 카테고리 적합성, 주력 제품 명확성, 상품 등록 정보의 일관성을 먼저 봅니다. 이 기준이 맞지 않으면 입점은 돼도 국가별 제품명, 설명 문구, 사용 증빙, 권리 관리가 쉽게 흩어집니다.",
        nextAction:
          "핵심 브랜드 1개를 골라 이번 주 안에 입점 준비 가이드를 만드세요. 대표 브랜드, 함께 밀 제품명, 핵심 효능 문구, 채널별 카테고리 표현, 국가별 우선 시장, 실제로 등록·사용할 표기, 현지 상품 설명 문구 담당자를 한 장으로 정리해 두는 편이 좋습니다.",
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
            label: "MexTm 운영 가이드",
            href: getProductPathBySlug("mexico")
          },
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      }
    ]
  },
  {
    slug: "2026-04-seller-evidence-structure",
    title: "2026년 4월 Hot Global TM Brief | 플랫폼별 신고보다 판매자 단위 증거 묶음을 먼저 구조화해야 합니다",
    summary:
      "영국의 위조 티셔츠 판매 사건을 바탕으로, 한국 기업이 해외 마켓플레이스와 자사몰을 오가는 침해 판매자에 대응할 때 무엇을 먼저 구조화해야 하는지 운영형으로 정리한 이슈입니다.",
    cadenceLabel: "주간 브리프",
    publishedAt: "2026-04-07T09:00:00.000Z",
    jurisdictions: ["UK", "Counterfeit", "Marketplace", "Brand Protection"],
    bodyParagraphs: [
      "이번 주 해외에서 나온 판결 하나가, 한국 기업의 위조 대응 방식을 다시 점검하게 만듭니다. 침해 게시물을 하나씩 내리는 방식보다 먼저 누가 어떤 구조로 여러 채널을 돌려 쓰는지 파악하는 체계가 필요하다는 점입니다.",
      "한국 기업 실무에서는 아직도 eBay, Amazon, Etsy, 자사몰, SNS 판매를 각각 따로 대응하는 경우가 많습니다. 하지만 실제 침해자는 채널을 나눠 움직입니다. 한 플랫폼에서 판매가 막히면 다른 플랫폼으로 옮기고, 마켓플레이스 계정이 내려가면 자사 웹사이트나 다른 판매 계정으로 이어집니다. 그러면 기업 내부에서는 신고 건수는 늘어나는데도 침해자는 잘 안 사라지는 상황이 반복됩니다.",
      "2026년 4월 2일 영국 North Somerset Council이 발표한 사례는 이 점을 아주 구체적으로 보여줍니다. 한 판매자는 The Beatles, Metallica, FA Three Lions 등 유명 상표가 들어간 위조 티셔츠를 여러 온라인 플랫폼에서 판매했습니다. 최초 단서는 브랜드 보호 전문 에이전시 Surelock Limited가 eBay 목록을 탐지하면서 나왔고, 이후 당국의 조사 과정에서 Etsy와 본인 웹사이트까지 판매가 이어진 사실이 확인됐습니다. 9개월간 약 2만6000파운드를 벌어들인 것으로 파악됐고, 수색 과정에서는 주문형 제작이 가능한 고급 인쇄 장비와 컴퓨터, 의류가 함께 압수됐습니다. 해당 판매자는 상표 무단 제조·소지·유통 4건에 대해 유죄를 인정했고, 법원은 6개월 징역 2년 집행유예와 기소 비용 8767파운드 납부를 명령했습니다.",
      "이 사례가 중요한 이유는 위조 대응의 단위를 다시 생각하게 만들기 때문입니다. 기업은 종종 상품 페이지를 캡처하고 플랫폼에 신고하는 데서 대응을 시작합니다. 물론 그것도 필요합니다. 하지만 그것만으로는 대응이 자주 끊깁니다. 같은 판매자가 스토어 이름을 조금 바꾸고, 같은 이미지를 돌려 쓰고, 비슷한 가격대와 설명 문구를 사용하면서 채널만 바꿔 다시 나타나기 때문입니다. 그러면 삭제는 되었는데 침해는 끝나지 않은 상태가 됩니다.",
      "이번 사례에서 주목할 점이 하나 더 있습니다. 최초 탐지를 한 것이 플랫폼 자체가 아니라 권리자를 대리한 브랜드 보호 에이전시였다는 점입니다. 에이전시가 eBay에서 수백 건의 복제 상품을 식별한 뒤 당국에 연계했고, 당국이 다른 플랫폼과 자사몰까지 조사 범위를 넓혀 판매자 전체 구조를 파악했습니다. 이 흐름 자체가 하나의 대응 모델입니다. 플랫폼 신고를 먼저 시작하되, 같은 판매자가 움직이는 다른 채널까지 연결하는 구조가 있어야 단속이 끝난 뒤에도 재발을 막을 수 있습니다.",
      "그래서 이번 주 핵심은 플랫폼별 신고 건수를 늘리는 것이 아니라 판매자 단위로 증거를 구조화하는 운영 체계를 먼저 만드는 것입니다. 스토어명 변형, 반복 사용되는 제품 이미지, 가격 패턴, 결제 방식, 배송 발송지, 연결된 도메인, 자사 웹사이트 존재 여부 같은 단서를 하나의 evidence packet으로 정리해야 합니다. 그래야 마켓플레이스 신고, 자사몰 차단 요청, 결제사 통지, 수사기관 협조, 세관 연계까지 같은 사실관계로 연결할 수 있습니다.",
      "한국 기업이 특히 이 지점을 놓치기 쉬운 이유도 분명합니다. 해외 판매가 빨라질수록 채널은 늘어나는데, 브랜드 방어 체계는 여전히 플랫폼별로 끊겨 있는 경우가 많기 때문입니다. 브랜드팀은 게시물 삭제를 보고, 법무팀은 상표권을 보고, 운영팀은 셀러 계정을 보고, 외부 대리인은 개별 침해 링크를 전달받습니다. 이렇게 나뉘면 정보는 많은데 판단은 느려집니다. 반대로 판매자 단위 packet이 있으면, 어떤 침해가 같은 운영자에서 나온 것인지 빠르게 묶을 수 있고, 어느 시장에서 먼저 강하게 대응할지도 더 빨리 정할 수 있습니다.",
      "이번 사례는 음악 굿즈와 스포츠 상품 분야에서 나온 것이지만, 한국 기업이 해외에서 겪는 K-뷰티, K-패션, K-팝 MD, 식품 브랜드 위조 대응에도 그대로 연결됩니다. 중요한 것은 업종이 아니라 구조입니다. 침해자가 여러 채널을 동시에 쓰고, 적발 이후에도 다른 계정이나 다른 사이트로 이동할 수 있다면, 기업도 대응 단위를 플랫폼이 아니라 판매자로 바꿔야 합니다."
    ],
    items: [
      {
        id: "seller-evidence-structure",
        headline: "기업이 이번 주 바로 점검해야 할 브랜드 방어 체크포인트",
        whatChanged:
          "지난주 이슈의 핵심은 영국 단속 사례 자체보다, 한국 기업이 해외 위조 대응의 기준 단위를 플랫폼이 아니라 판매자로 다시 정해야 한다는 점입니다.",
        whoShouldCare:
          "해외 매출이 늘고 있는 브랜드 오너, 글로벌 사업팀, 인하우스 IP팀, 플랫폼 운영 담당자, 외부 브랜드보호 대리인과 일하는 PM",
        whyItMatters:
          "침해 게시물을 하나씩 내려도 판매자 단위로 묶이지 않으면 같은 운영자가 다른 채널에서 다시 나타날 가능성이 높습니다. 플랫폼별 신고 체계만으로는 대응 속도와 누적 증거력이 모두 약해질 수 있습니다.",
        nextAction:
          "핵심 브랜드 1개를 골라 이번 주 안에 seller-based evidence sheet를 만들어 두는 편이 좋습니다. 판매 링크, 스토어명 변형, 공통 제품 이미지, 가격대, 연결 도메인, 결제 단서, 배송 단서를 같은 표에 모으고, 내부 대응 기준도 플랫폼별이 아니라 판매자별로 다시 정리하세요.",
        relatedGuideLinks: [
          {
            label: "UKTm 운영 가이드",
            href: getProductPathBySlug("uk")
          },
          {
            label: "ChaTm 운영 가이드",
            href: getProductPathBySlug("china")
          },
          {
            label: "MexTm 운영 가이드",
            href: getProductPathBySlug("mexico")
          },
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      }
    ]
  },
  {
    slug: "2026-04-k-brand-counterfeit-strategy",
    title: "왜 한국 브랜드는 이제 위조 대응을 사업 전략으로 봐야 하나?",
    summary:
      "지난 1주일간의 발표와 보도는 위조 대응이 단순한 법무 이슈가 아니라, 한국 기업이 해외에서 브랜드를 지키기 위해 미리 갖춰야 할 사업 운영 역량이라는 점을 분명히 보여줬습니다.",
    cadenceLabel: "주간 브리프",
    publishedAt: "2026-04-01T09:00:00.000Z",
    jurisdictions: ["Global", "K-Beauty", "K-Food", "K-Fashion"],
    bodyParagraphs: [
      "K-뷰티와 K-푸드, K-패션이 더 잘 팔릴수록 경쟁의 성격도 바뀝니다. 이제는 누가 더 빨리 브랜드를 알리느냐만큼, 누가 더 빨리 그 브랜드를 지키느냐가 중요합니다. 위조 대응은 판매가 커진 뒤 뒤늦게 처리하는 법무 문제가 아니라, 해외 진출을 준비할 때부터 함께 설계해야 하는 사업 운영 문제입니다.",
      "지난주 정부 발표도 이 점을 분명히 보여줬습니다. 3월 29일 지식재산처·식약처·관세청은 위조 화장품 대응 합동 브리핑을 열고, 2025년 K-화장품 수출이 114억3000만 달러에 이르렀고 한국 기업 지식재산권을 침해한 위조상품 규모가 약 97억 달러로 추정된다고 밝혔습니다. 이어 3월 31일에는 정부가 70개 주요 수출국에서 K-Brand 인증상표를 직접 등록하고 현지 조사·단속 요청까지 연결하는 제도를 발표했습니다. 정부가 움직이기 시작했다는 사실 자체가, 위조가 이미 개별 기업 혼자 감당하기 어려운 수준까지 커졌다는 뜻입니다.",
      "하지만 핵심은 정부가 대신 싸워준다는 데 있지 않습니다. 실제 시장에서 브랜드를 지키는 힘은 결국 기업 내부 준비에서 나옵니다. 상표를 먼저 잠갔는지, 패키지와 정품 식별 포인트를 정리했는지, 플랫폼 신고 루틴이 있는지, 세관·현지 대리인과 연결할 자료가 있는지, 유통 채널을 어떻게 관리할지까지 한 흐름으로 묶여 있어야 합니다. 준비된 기업은 정부 지원을 지렛대로 쓸 수 있지만, 준비가 없으면 지원만으로는 위조 확산을 막기 어렵습니다.",
      "한국 기업이 자주 놓치는 지점도 여기에 있습니다. 위조를 단순한 매출 손실로만 보면 대응이 늦어집니다. 왜냐하면 해외 소비자는 위조업자가 아니라 브랜드를 기억합니다. 가짜 화장품 문제가 생기면 화장품 브랜드가 의심받고, 가짜 식품이 유통되면 제품보다 브랜드 신뢰가 먼저 흔들립니다. 그래서 지금 기업이 최우선으로 고민해야 할 질문은 하나입니다. 상표를 등록했는가가 아니라, 우리 브랜드를 실제로 지킬 준비가 되어 있는가입니다."
    ],
    items: [
      {
        id: "k-brand-counterfeit-strategy",
        headline: "기업이 이번 주 바로 점검해야 할 브랜드 방어 체크포인트",
        whatChanged:
          "지난주 이슈의 핵심은 정부 정책 자체보다, 한국 기업이 위조 대응을 수출 이후의 사후 조치가 아니라 브랜드 운영 체계로 끌어올려야 한다는 점입니다.",
        whoShouldCare:
          "해외 매출이 늘고 있는 브랜드 오너, 글로벌 사업팀, 인하우스 IP팀, 플랫폼·유통 운영 담당자",
        whyItMatters:
          "상표 등록만으로는 브랜드를 지킬 수 없습니다. 위조와 모방은 패키지, 플랫폼, 유통, 세관, 소비자 인지까지 함께 흔들기 때문에 기업 내부의 대응 순서와 책임 구조가 먼저 정리돼 있어야 합니다.",
        nextAction:
          "핵심 수출 시장 우선순위, 정품 판매 채널, 플랫폼 신고 루틴, 세관·현지 대리인 연계, 정품 식별 포인트를 한 장의 브랜드 방어 시트로 이번 주 안에 정리하세요.",
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
            label: "JapTm 운영 가이드",
            href: getProductPathBySlug("japan")
          },
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      },
    ]
  },
  {
    slug: "2026-03-pilot-patterns",
    title: "2026년 3월 Hot Global TM Brief | 유럽·영국·중남미 파일럿 패턴 정리",
    summary:
      "파일럿 포트폴리오에서 반복해서 보이는 권역 판단 패턴과 단일국가 확장 포인트를 간결하게 정리한 archive seed issue입니다.",
    cadenceLabel: "월간 브리프",
    publishedAt: "2026-03-20T09:00:00.000Z",
    jurisdictions: ["Europe", "United Kingdom", "Latin America"],
    items: [
      {
        id: "europe-order",
        headline: "Europe: 어느 국가부터 볼지보다 EU 단위 운영 순서를 먼저 잠그는 편이 낫습니다",
        whatChanged:
          "유럽 진출 초기에는 개별 국가 체크리스트를 늘리기보다, EU 단위에서 어떤 순서로 포트폴리오를 설계할지 먼저 정리해야 한다는 점을 파일럿 패턴으로 고정했습니다.",
        whoShouldCare:
          "유럽 권역 확장을 검토하는 본사 브랜드팀, 인하우스 IP팀, 지역 사업 리드",
        whyItMatters:
          "개별 국가 이슈를 먼저 보기 시작하면 우선순위가 섞이기 쉽습니다. 권역 프레임을 먼저 만들면 후속 국가 판단 비용이 낮아집니다.",
        nextAction:
          "EU 진출 건은 국가 리스트를 만들기 전에 우선 launch market, 공통 지정상품, 후속 확장 시점을 먼저 정리하세요.",
        relatedGuideLinks: [
          {
            label: "EuTm 권역 가이드",
            href: getProductPathBySlug("europe")
          },
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      },
      {
        id: "uk-early-track",
        headline: "UK: 영국은 early track으로 따로 보는 것이 EU 후속 검토보다 빠를 때가 있습니다",
        whatChanged:
          "영국은 EU의 단순 부속 판단이 아니라 별도 단일국가 early track으로 보는 편이 더 빠른 경우가 있다는 점을 브리프 형식으로 분리했습니다.",
        whoShouldCare:
          "영국 판매 채널이나 파트너십이 먼저 열리는 팀, Brexit 이후 영국 전략을 따로 보는 담당자",
        whyItMatters:
          "영국을 EU 검토의 마지막 단계로 미루면 실제 사업 일정과 판단 순서가 어긋날 수 있습니다. early track으로 따로 열어두면 더 현실적인 planning이 가능합니다.",
        nextAction:
          "영국 비즈니스가 먼저 열리는 경우에는 EU 전체 판단과 별도로 UK single-market checklist를 먼저 검토하세요.",
        relatedGuideLinks: [
          {
            label: "UKTm early track",
            href: getProductPathBySlug("uk")
          },
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      },
      {
        id: "latam-priority",
        headline: "LatAm: 국가별 제도 차이보다 먼저 우선 국가와 운영 프레임을 고정해야 합니다",
        whatChanged:
          "중남미에서는 각국 제도 요약을 길게 읽기 전에, 어느 시장부터 먼저 보고 어떤 운영 리스크를 먼저 볼지 정하는 게 더 큰 결정이라는 점을 pilot framing으로 재확인했습니다.",
        whoShouldCare:
          "여러 중남미 국가를 동시에 검토하는 브랜드 관리자, 해외사업 리더, 지역 법무 담당자",
        whyItMatters:
          "권역형 판단이 없으면 개별국가 조사량만 늘어나고 내부 의사결정은 늦어집니다. LatTm은 바로 그 우선순위 프레임을 주는 기준 제품입니다.",
        nextAction:
          "중남미 진출 검토 시 각국 조사 메모를 늘리기 전에, 우선 국가 2-3개와 launch sequencing부터 먼저 정하세요.",
        relatedGuideLinks: [
          {
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          },
          {
            label: "MexTm 운영 가이드",
            href: getProductPathBySlug("mexico")
          }
        ]
      }
    ]
  },
  {
    slug: "2026-03-china-name-search-priority",
    title: "2026년 3월 Hot Global TM Brief | 중국 진출 직전에는 이름보다 표기·서브클래스 순서를 먼저 잠가야 합니다",
    summary:
      "중국 진출 초기에 가장 자주 틀어지는 표기·검색·출원 순서를 정리하고, 어떤 팀이 무엇을 먼저 잠가야 하는지 운영형으로 묶은 issue입니다.",
    cadenceLabel: "주간 브리프",
    publishedAt: "2026-03-13T09:00:00.000Z",
    jurisdictions: ["China", "Brand Naming", "Search", "Subclass"],
    bodyParagraphs: [
      "중국 상표 실무에서 흔한 실패는 이름 자체보다 순서에서 발생합니다. 영문 브랜드를 먼저 고정하고 중국어 표기를 뒤늦게 붙이거나, 클래스만 맞춘 뒤 서브클래스와 실제 판매 경로를 나중에 보면서 충돌과 수정비용이 커집니다.",
      "이번 이슈의 초점은 중국 진출 직전 팀이 무엇을 먼저 잠가야 하는지입니다. 중국어 표기 후보를 2~3개로 줄이고, 검색을 단순 중복확인이 아니라 go/revise/hold 판단 단계로 운영하며, search 결과가 바로 지정상품 설계와 출원 브리프로 넘어가게 만드는 흐름이 핵심입니다."
    ],
    items: [
      {
        id: "china-naming-sequence",
        headline: "중국 진출 직전 팀이 먼저 잠가야 할 것은 이름 하나가 아니라 표기 묶음입니다",
        whatChanged:
          "중국어 표기, 영문 표장, 결합표장, 서브클래스 방향을 따로 보지 말고 하나의 포트폴리오 묶음으로 잠가야 한다는 운영 기준을 현재 우선순위로 올렸습니다.",
        whoShouldCare:
          "중국 론칭을 준비하는 브랜드팀, 중국 사업팀, 인하우스 IP팀, 외부 대리인과 협업할 PM",
        whyItMatters:
          "표기 후보와 검색 기준이 분리되면 출원 직전 수정이 반복되고, 플랫폼 검색어와 실제 등록 포트폴리오가 어긋날 위험이 커집니다.",
        nextAction:
          "영문 표장, 중국어 표기 2~3개 후보, 핵심 상품군, 인접 확장 상품군, go/revise/hold 기준을 한 장 브리프로 묶어 search 회의부터 잠그세요.",
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
            label: "LatTm 기준 제품",
            href: getProductPathBySlug("latam")
          }
        ]
      }
    ]
  },
  {
    slug: "2026-03-mexico-entry-decisions",
    title: "2026년 3월 Hot Global TM Brief | 멕시코 진입 직전에는 출원 방식보다 운영 통제표가 먼저 필요합니다",
    summary:
      "멕시코 진입에서 직접출원 vs 마드리드 선택보다 먼저 잠가야 할 운영 통제표와 buyer entry 질문을 정리한 issue입니다.",
    cadenceLabel: "주간 브리프",
    publishedAt: "2026-03-06T09:00:00.000Z",
    jurisdictions: ["Mexico", "Madrid", "IMPI", "Domain"],
    bodyParagraphs: [
      "멕시코 실무는 출원 경로 선택만으로 정리되지 않습니다. IMPI를 중심으로 어떤 기한을 누가 볼지, 가제타와 후속 통지를 어떻게 놓치지 않을지, 본사와 현지 파트너 사이에서 도메인과 사용증빙을 누가 통제할지가 함께 잠겨야 합니다.",
      "즉, direct filing과 Madrid 중 무엇이 더 좋은지보다 먼저, 멕시코를 핵심국으로 보는지, 중앙관리 효율을 우선하는지, 현지 대응을 누가 맡는지에 대한 운영표가 필요합니다. 그 표가 있어야 경로 선택도 일관되게 됩니다."
    ],
    items: [
      {
        id: "mexico-entry-control-sheet",
        headline: "멕시코 진입 직전에는 IMPI 절차표와 도메인·사용증빙 통제를 같이 잠가야 합니다",
        whatChanged:
          "출원 방식 선택을 단독 이슈로 보지 않고, 가제타 모니터링, 도메인 명의, 사용증빙 owner, 현지 대리인 대응라인까지 한 장 control sheet로 묶는 방식이 현재 우선 패턴으로 올라왔습니다.",
        whoShouldCare:
          "멕시코 판매 개시를 앞둔 브랜드팀, IP팀, 현지 유통 파트너를 관리하는 사업 리드",
        whyItMatters:
          "멕시코에서는 등록 후 관리와 집행이 출원만큼 중요합니다. control sheet 없이 들어가면 권리 통제와 대응 기한이 쉽게 분산됩니다.",
        nextAction:
          "직접출원 vs Madrid를 고르기 전에 권리자, 실제 사용자, 도메인 등록 주체, 가제타 모니터링 owner, 사용증빙 저장 위치를 같은 문서에 먼저 적으세요.",
        relatedGuideLinks: [
          {
            label: "MexTm 운영 가이드",
            href: getProductPathBySlug("mexico")
          },
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
  }
];

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
