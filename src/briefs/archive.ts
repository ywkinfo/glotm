import { getProductPathBySlug } from "../products/registry";
import { buildRuntimeDocumentTitle } from "../products/shared";
import { briefIssues as legacyBriefIssues } from "./archiveLegacy";
import type { BriefIssue } from "./archiveLegacy";

export type { BriefCorrection, BriefGuideLink, BriefIssue, BriefItem } from "./archiveLegacy";

const kbrandOverseasLicensingIssue: BriefIssue = {
  slug: "2026-08-kbrand-overseas-licensing-control",
  title:
    "2026년 8월 Hot Global TM Brief | K-브랜드 해외 라이선싱 지원, 신청 전에 계약보다 통제표를 먼저 만들 때입니다",
  summary:
    "지식재산처는 2026년 8월 3일 해외 권리 사용 허가 또는 가맹점 계약을 추진 중이거나 추진 예정인 중소·중견기업을 대상으로 「2026년 K-브랜드 해외 상표권 보호·라이선싱 전략 지원 시범사업」을 공고했습니다. 신청은 8월 21일까지이며, 사용권 계약 구조와 법률적 위험 분석, 주요 계약조항 검토 등 계약 전반의 전문 자문을 지원합니다. 이번 브리프는 지원사업 안내에 그치지 않고, 상담 전에 기업이 표장·상품·지역·채널·승인·정산·종료 구조를 한 장의 라이선싱 통제표로 정리하는 방법을 제안합니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-08-08T00:00:00.000Z",
  jurisdictions: [
    "Korea",
    "Trademark Licensing",
    "Franchising",
    "Royalty Governance",
    "Brand Control"
  ],
  bodyParagraphs: [
    "지식재산처는 2026년 8월 3일 「2026년 K-브랜드 해외 상표권 보호·라이선싱 전략 지원 시범사업」을 공고했습니다. 공식 보도자료에 따르면 지원 대상은 해외 권리 사용 허가 또는 가맹점 계약을 추진 중이거나 추진 예정인 중소·중견기업이며, 사용권 계약 구조와 법률적 위험 분석, 주요 계약조항 검토 등 계약 전반의 전문 자문을 제공합니다. 신청기간은 8월 3일부터 8월 21일까지입니다. 신청 자격과 제출서류, 접수 절차는 K-브랜드 보호 포털의 공식 공고를 기준으로 확인해야 합니다.",
    "이번 사업은 앞서 다룬 K-브랜드 정부인증 제도와 역할이 다릅니다. 정부인증은 정부가 권리자인 인증표장을 통해 정품 식별과 위조상품 대응을 보조하는 보호 레이어입니다. 반면 이번 사업은 기업이 소유한 상표를 현지 사업자에게 어떻게 사용하게 하고, 사용료를 어떻게 정산하며, 계약 종료 후 브랜드 통제권을 어떻게 회수할지 설계하는 수익화 레이어입니다. 인증표장을 사용할 수 있게 되더라도 기업 상표의 권리자·사용자·유통 관계가 자동으로 정리되는 것은 아니므로 두 제도는 별도의 통제 구조로 운영해야 합니다. 인증 여부를 사용허락 권한이나 가맹점 자격의 근거처럼 사용하면 두 표장의 권리 관계를 오히려 혼동시킬 수 있으므로, 계약과 소비자 표시에서도 각각의 역할을 구분할 필요가 있습니다.",
    "지식재산처 발표가 지원 범위를 설명한다면, 여기서부터는 GloTm 가이드의 라이선싱 원칙을 바탕으로 도출한 실무 준비 순서입니다. 라이선싱은 '이 상표를 사용해도 된다'는 계약서 한 장이 아니라, 권리자와 실제 사용자, 허용 표장, 상품, 지역, 판매 채널, 재허락 범위와 승인권을 잠그는 브랜드 통제 구조입니다. 이 범위가 불명확하면 라이선시가 등록되지 않은 표장을 사용하거나 합의하지 않은 상품과 채널로 사업을 확장하고, 총판이나 OEM 업체에 브랜드 파일과 사용권을 다시 넘기는 위험이 커질 수 있습니다. 계약 문구와 함께 승인 이메일, 샘플 검토표, 브랜드 가이드 배포 기록 같은 운영 흔적도 남겨야 합니다. 누가 승인 요청을 받고 언제까지 답하는지, 미승인 사용을 발견하면 누가 시정을 요구하는지까지 정해져야 계약 조항이 실제 통제로 이어집니다.",
    "통제의 초점은 시장에 따라 달라집니다. 미국에서는 권리자가 상품·서비스의 품질을 실제로 관리했는지 보여 줄 수 있도록 로고·포장·광고 승인, 샘플 검토와 시정 기록을 남기는 것이 중요합니다. 중국에서는 영문 상표뿐 아니라 중문 명칭과 로고 버전, 총판·온라인 운영사·OEM 공장별 사용 권한, 재하청과 파일 전달 범위를 나눠 봐야 합니다. 현지 파트너가 상세페이지·계정명·포장 도안을 직접 수정하는 구조라면 승인본의 버전과 접근권한 회수 기준도 필요합니다. 유럽에서는 국가와 온라인·오프라인 채널별 독점 범위를 구분하고, 라이선시의 사용자료가 권리자의 사용증거로 연결되도록 보관 구조를 정리할 필요가 있습니다. 국가별 언어 표현과 병행유통 가능성까지 같은 독점 조항에 뭉뚱그리지 않는 편이 안전합니다. 각 시장의 법률 효과와 증거 요건은 현지 기준을 별도로 확인해야 합니다.",
    "신청 전에는 다섯 항목을 한 장의 라이선싱 통제표로 만들어 볼 수 있습니다. 첫째, 허용할 영문·현지어 명칭과 로고, 상품, 지역, 채널의 범위입니다. 둘째, 라이선시·가맹점·총판·OEM 업체가 행사할 수 있는 권한과 재허락 제한입니다. 셋째, 제품 품질과 포장·광고·온라인 콘텐츠의 승인 절차, 담당자, 보관할 증거입니다. 넷째, 매출·수량 등에 따른 사용료 산식, 정산 주기, 보고 의무와 감사권입니다. 다섯째, 계약 종료 시 남은 재고와 판매 페이지·계정·도메인·금형·로고 및 디자인 파일의 사용 중단 또는 회수 방식입니다. 각 항목에 현재 합의, 미확정 공백, 확인 책임자를 표시하면 상담에서 먼저 다뤄야 할 위험이 드러납니다.",
    "이 통제표는 완성된 계약서를 대신하지 않습니다. 기업이 원하는 사업 구조를 먼저 설명하고, 이번 지원사업을 통해 계약과 운영 사이의 공백을 검토하기 위한 입력 문서입니다. 빈 계약서만 들고 상담을 시작하기보다 실제 사용할 표장, 거래 상대방, 예상 국가와 채널, 사용료 흐름, 승인 방식과 종료 시나리오를 정리해 제시하는 편이 검토 범위를 구체화하는 데 도움이 됩니다. 통제표에는 항목별로 '합의됨·협상 중·미정' 상태와 내부 책임자, 상대방 책임자, 필요한 현지 확인을 표시하면 됩니다. 여러 국가에서 같은 계약을 사용할 계획이라면 공통 통제 원칙과 국가별로 조정할 조항을 분리해 현지 전문가에게 확인하는 것이 안전합니다.",
    "해외 라이선싱의 성패는 계약 체결 건수만으로 판단하기 어렵습니다. 기업이 브랜드 사용 범위를 실제로 통제하고, 품질과 정산을 점검하며, 그 과정을 증거로 남기고, 관계 종료 후 통제권을 회수할 수 있어야 상표가 지속적인 수익 자산으로 기능합니다. 특히 신청 마감까지 남은 기간이 짧은 만큼, 모든 국가의 계약서를 먼저 완성하려 하기보다 실제 협상 중인 파트너 한 곳을 기준으로 통제표 초안을 만드는 편이 현실적입니다. 신청을 검토하는 기업은 2026년 8월 21일 전에 라이선싱 통제표를 먼저 작성하고, 세부 자격과 제출서류는 공식 공고에서, 국가별 계약과 법률 효과는 해당 지역 전문가를 통해 다시 확인하는 것이 바람직합니다."
  ],
  items: [
    {
      id: "kbrand-licensing-control-sheet-before-application",
      headline:
        "해외 라이선싱 지원을 신청하기 전에 표장·권한·승인·정산·종료를 한 장의 통제표로 정리해야 합니다",
      whatChanged:
        "지식재산처가 2026년 8월 3일 「2026년 K-브랜드 해외 상표권 보호·라이선싱 전략 지원 시범사업」을 공고했습니다. 해외 권리 사용 허가 또는 가맹점 계약을 추진 중이거나 추진 예정인 중소·중견기업이 대상이며, 사용권 계약 구조와 법률적 위험 분석, 주요 계약조항 검토 등 계약 전반의 전문 자문을 지원합니다. 신청기간은 2026년 8월 3일부터 8월 21일까지입니다.",
      whoShouldCare:
        "해외 라이선스·가맹·총판·OEM 계약을 추진하는 K-브랜드의 IP·법무팀, 현지 파트너와 사용료 및 독점 범위를 협의하는 글로벌 사업팀, 로고·포장·광고 승인을 담당하는 브랜드·품질팀, 계약 종료 후 채널과 자산 회수를 맡는 운영팀.",
      whyItMatters:
        "사용허락 범위가 불명확하면 현지 파트너가 합의하지 않은 표장·상품·채널로 사업을 넓히거나 제3자에게 브랜드 파일과 권한을 다시 넘길 수 있습니다. 미국의 품질통제 기록, 중국의 중문 표장·총판·OEM 통제, 유럽의 국가·채널별 독점과 사용증거 연결처럼 시장별 확인점도 다릅니다. 계약 조항만 있고 실제 승인·정산·회수 기록이 없으면 기업이 브랜드를 통제했다는 설명이 약해질 수 있습니다.",
      nextAction:
        "신청 전에 ① 허용 표장·상품·지역·채널 ② 라이선시·가맹점·총판·OEM의 권한과 재허락 제한 ③ 품질·포장·광고 승인 및 증거 보관 ④ 사용료 산식·정산·감사권 ⑤ 종료 후 재고·페이지·계정·도메인·파일 회수를 한 장에 적습니다. 각 항목에 합의된 내용, 미확정 공백, 책임자를 표시한 뒤 지원사업 상담에서 그 공백과 국가별 위험을 검토합니다.",
      relatedGuideLinks: [
        {
          label: "UsaTm 운영 가이드",
          href: getProductPathBySlug("usa")
        },
        {
          label: "ChaTm 운영 가이드",
          href: getProductPathBySlug("china")
        },
        {
          label: "EuTm 운영 가이드",
          href: getProductPathBySlug("europe")
        }
      ]
    }
  ]
};

const ukInfluencerCounterfeitDamagesIssue: BriefIssue = {
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

const comparableUkMarkEuUseCutoffIssue: BriefIssue = {
  slug: "2026-08-comparable-uk-mark-eu-use-cutoff",
  title:
    "2026년 8월 Hot Global TM Brief | comparable UK mark를 EU 사용으로 방어하던 경과 규정이 2026년 1월 1일로 끝났습니다",
  summary:
    "Brexit 전환으로 기존 EUTM에서 자동 생성된 comparable UK trade mark는 지금까지 불사용 방어에서 전환 전 EU 사용을 일부 원용할 수 있었습니다. GOV.UK의 comparable UK trade marks 안내는 5년 구간에 2021년 1월 1일 이전이 포함되면 EU 사용을 고려하지만, 그 구간에 2021년 1월 1일 이후가 포함되면 EU에서의 사용은 산입하지 않는다고 설명합니다. 전환일로부터 5년이 지나 2026년 1월 1일부터는 관련 5년 look-back 구간이 전부 2021년 1월 1일 이후가 되므로, 이제 UK 실사용만 genuine use로 설명할 수 있습니다. 2026년은 EU 실적으로 영국 등록을 방어할 수 없는 첫 해이며, 이번 브리프는 comparable mark 재고조사와 증거 지역 태깅을 어떤 순서로 정리할지 제안합니다.",
  cadenceLabel: "주간 브리프",
  publishedAt: "2026-08-24T00:00:00.000Z",
  jurisdictions: [
    "United Kingdom",
    "Europe",
    "Non-Use Cancellation",
    "Brexit Transition",
    "Evidence Management"
  ],
  bodyParagraphs: [
    "GOV.UK의 EU trade mark protection and comparable UK trade marks 안내는 comparable UK right의 사용 인정 범위를 이렇게 설명합니다. 'any use of the mark in the EU made before 1 January 2021, whether inside or outside the UK, counts as use of the comparable UK right. Where the 5-year period includes time before 1 January 2021, use in the EU will be considered. Where the period includes any time after 1 January 2021, use of the comparable trade mark in the EU (and outside of the UK) within that period will not be taken into account.' 즉 EU 사용의 원용 가능 여부는 규정이 바뀌어서가 아니라, 문제되는 5년 구간이 전환일을 걸치는지에 따라 달라집니다.",
    "그 구간이 2026년 1월 1일부터 전환일을 더 이상 걸치지 않습니다. comparable UK mark는 2021년 1월 1일에 기존 EUTM에서 생성됐고, 그로부터 5년이 지나면 이후의 모든 5년 look-back 구간은 전부 2021년 1월 1일 이후에 들어갑니다. 경과 규정이 폐지된 것이 아니라, 적용될 구간이 사라진 것입니다. 결과적으로 지금부터 comparable UK right의 불사용 방어는 영국 내 실사용만으로 설명해야 합니다.",
    "이 변화는 다른 두 시계와 겹칩니다. 첫째, 영국에서 non-use revocation은 등록 후 5년이 지난 시점부터 문제될 수 있고, 연속 5년 불사용이 가장 위험한 신호입니다. 둘째, comparable UK mark는 원 EUTM의 갱신일을 그대로 유지하므로 신규 UK 출원과는 관리 이벤트가 어긋납니다. 갱신일 기준으로 포트폴리오를 보고 있으면 불사용 리스크가 열리는 시점을 놓치기 쉽습니다. 또한 일부 goods/services만 사용한 경우에는 실제 사용 범위를 기준으로 부분 취소가 이뤄질 수 있으므로, 등록 명세 전체가 아니라 클래스와 상품군 단위로 봐야 합니다.",
    "실무에서 가장 흔한 오해는 'EU에서 잘 팔리고 있으니 영국 등록도 설명된다'는 가정입니다. 전환 이후 EUTM은 자동으로 영국을 커버하지 않으며, 신규 영국 보호는 UK national filing이나 UK 지정 국제등록으로 따로 설계해야 합니다. 사용증거도 마찬가지입니다. 영국 판매 페이지, 영국 배송 기록, 영국 대상 마케팅 자료를 EU 자료와 섞어 보관해 두면, 취소 위협이 왔을 때 어느 자료가 영국 사용을 설명하는지 골라내는 데만 시간이 듭니다.",
    "그래서 지금 필요한 일은 새로운 서류가 아니라 재고조사입니다. 먼저 보유 등록에서 comparable UK mark를 분리해 목록으로 만듭니다. 원 EUTM에서 전환된 건이므로 UK 신규 출원건과 섞여 있는 경우가 많습니다. 그다음 각 mark별로 최근 5년 구간의 영국 실사용 여부를 확인하고, 판매·배송·광고·유통 자료를 UK, EU, Global로 지역 태그를 나눠 정리합니다. 사용이 약한 mark는 유지, 범위 축소, 집중 중 무엇으로 갈지 미리 정해 두면 취소 신청이 실제로 들어왔을 때 대응이 흔들리지 않습니다.",
    "증거는 모으는 것과 제출 형식이 다릅니다. 표장 형태(word, logo, composite), 채널, 증빙 자료, 최근 검토일, 권리자와 실제 사용 주체, 원본 URL이나 문서 ID, 지역 태그를 한 장의 카드로 유지하고 분기마다 갱신하면, 위협 인지 시점에 최신본을 그대로 꺼낼 수 있습니다. 라이선시나 유통사가 실제 사용 주체라면 사용권과 승인 라인을 함께 적어 두어야 누구의 사용인지 설명이 비지 않습니다.",
    "범위는 넘겨 읽지 않는 편이 안전합니다. 이 정리는 GOV.UK 안내가 설명하는 사용 인정 범위와 영국의 불사용 취소 구조를 운영 관점으로 옮긴 것이고, 개별 사건에서 무엇이 genuine use로 인정되는지, 부분 취소의 범위가 어디까지인지는 사실관계에 따라 달라집니다. EU 사용이 무의미해진 것도 아닙니다. EUTM 자체의 방어에는 EU 내 사용이 그대로 쓰이며, 달라진 것은 별개 권리가 된 comparable UK right를 무엇으로 설명하느냐입니다. 구체적 판단이 필요하면 현지 대리인 확인을 거쳐야 합니다."
  ],
  items: [
    {
      id: "comparable-uk-mark-uk-use-inventory",
      headline:
        "comparable UK mark를 따로 목록화하고 최근 5년 구간의 영국 실사용을 mark별로 확인해야 합니다",
      whatChanged:
        "GOV.UK의 comparable UK trade marks 안내에 따르면 5년 구간에 2021년 1월 1일 이전이 포함될 때만 EU 사용이 고려되고, 그 구간에 2021년 1월 1일 이후가 포함되면 EU에서의 사용은 산입되지 않습니다. 전환일로부터 5년이 지나 2026년 1월 1일부터는 관련 5년 구간이 전부 2021년 1월 1일 이후가 되므로, comparable UK right의 불사용 방어에서 전환 전 EU 사용조차 더 이상 원용할 수 없습니다. 규정 개정이 아니라 경과 구간의 소멸이며, 영국에서 non-use revocation은 등록 후 5년이 지난 시점부터 문제될 수 있습니다.",
      whoShouldCare:
        "Brexit 전환으로 comparable UK mark를 보유하게 된 K-브랜드의 IP·법무팀, 영국 매출은 작지만 EU 매출로 브랜드를 운영해 온 사업팀, 영국 유통사·마켓플레이스 셀러의 사용 자료를 관리하는 브랜드·채널팀, 갱신일 기준으로만 포트폴리오를 점검해 온 관리 담당.",
      whyItMatters:
        "comparable UK mark는 원 EUTM의 갱신일을 유지하기 때문에, 갱신 캘린더만 보고 있으면 불사용 리스크가 열리는 시점이 드러나지 않습니다. 영국 실사용이 얇은 등록은 취소 신청이 들어온 뒤에 증거를 모으기 시작하면 늦고, 일부 상품군만 사용한 경우에는 실제 사용 범위를 기준으로 부분 취소가 이뤄질 수 있습니다. EU 자료와 UK 자료를 섞어 보관해 온 팀일수록 방어 준비에 걸리는 시간이 길어집니다.",
      nextAction:
        "① 보유 등록에서 comparable UK mark를 분리해 원 EUTM 번호와 함께 목록화합니다. ② mark별로 최근 5년 구간의 영국 실사용 여부와 사용 중인 goods/services를 확인합니다. ③ 판매 페이지, 배송 기록, invoice, 광고, 유통 자료에 UK / EU / Global 지역 태그를 붙여 분리합니다. ④ 사용이 약한 mark를 유지·범위 축소·집중으로 triage하고 갱신 전 재평가 대상으로 표시합니다. ⑤ 표장 형태, 채널, 증빙, 최근 검토일, 권리자와 실제 사용 주체, 지역 태그를 담은 카드를 분기 루틴으로 갱신합니다. 개별 등록의 취소 위험 판단과 대응 서식은 현지 대리인과 확인합니다.",
      relatedGuideLinks: [
        {
          label: "UKTm 제8장 · 사용증거와 Non-Use Cancellation 운영",
          href: `${getProductPathBySlug("uk")}/chapter/사용증거와-non-use-cancellation-운영#euuk-사용증거를-분리-태깅한다`
        },
        {
          label: "EuTm 제8장 · EU / UK 분기 캘린더",
          href: `${getProductPathBySlug("europe")}/chapter/제8장-등록-후-사용-갱신-증거-관리#comparable-uk-mark는-이제-eu-사용으로-방어되지-않는다`
        }
      ]
    }
  ]
};

const briefIssueSource: BriefIssue[] = [
  comparableUkMarkEuUseCutoffIssue,
  kbrandOverseasLicensingIssue,
  ukInfluencerCounterfeitDamagesIssue,
  ...legacyBriefIssues
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

// supersededBy를 렌더 가능한 형태로 푼다. 가리키는 이슈가 아카이브에 없으면 깨진 링크를 그리는 대신
// undefined를 돌려주고, 구조 위반 자체는 archive.test.ts의 lane contract가 잡는다.
export function resolveBriefCorrection(issue: BriefIssue) {
  if (!issue.supersededBy) {
    return undefined;
  }

  const replacement = getBriefIssueBySlug(issue.supersededBy.slug);

  if (!replacement) {
    return undefined;
  }

  return { ...issue.supersededBy, replacement };
}

// 브리프의 마지막 갱신 시점. 정정 포인터가 붙은 이슈는 그 기록일이 곧 마지막 갱신일이다.
export function getBriefLastModified(issue: BriefIssue) {
  return issue.supersededBy?.updatedAt ?? issue.publishedAt;
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
