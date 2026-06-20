export type LegalPageSlug = "privacy" | "legal" | "contact";

export type LegalPageSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageDefinition = {
  slug: LegalPageSlug;
  path: `/${LegalPageSlug}`;
  navLabel: string;
  kicker: string;
  title: string;
  summary: string;
  sections: LegalPageSection[];
};

export const legalNoticeTitle = "GloTm trust / legal notice";

export const legalNoticeSummary =
  "GloTm은 해외 상표 운영 판단을 돕는 일반 정보 자료이며, 법률 자문이나 특정 사안에 대한 의견서가 아닙니다.";

export const legalNoticeBullets = [
  "법률 자문, 대리, 감정, 의견서 또는 변호사·변리사와의 전문직 관계를 형성하지 않습니다.",
  "각 관할의 법령, 수수료, 심사 관행, 플랫폼 정책은 바뀔 수 있으므로 실제 의사결정 전에는 현지 전문가와 1차 출처를 확인해야 합니다.",
  "GloTm은 공공기관, 특허청, 로펌, 플랫폼 또는 국제기구의 공식 자료가 아니며, 별도 표시가 없는 한 특정 기관과 제휴되어 있지 않습니다.",
  "사이트와 저장소의 문서, 리포트, 브리프, generated content, 디자인, 소스 코드는 별도 허락 없이 복제·배포·재게시할 수 없습니다."
];

export const legalNavLinks = [
  { path: "/legal", label: "Legal" },
  { path: "/privacy", label: "Privacy" },
  { path: "/contact", label: "Contact" }
] as const;

export const legalPages: LegalPageDefinition[] = [
  {
    slug: "legal",
    path: "/legal",
    navLabel: "Legal",
    kicker: "Legal Notice",
    title: "GloTm legal notice",
    summary:
      "GloTm의 모든 guide, report, brief, Gateway copy는 일반 정보 제공과 운영 판단 보조를 위한 자료입니다.",
    sections: [
      {
        title: "일반 정보 제공",
        paragraphs: [
          "GloTm은 해외 상표 운영에 관한 일반 정보와 체크리스트를 제공합니다. 이 자료는 특정 사실관계에 대한 법률 자문, 법률 의견, 감정, 대리, 출원 전략 확정 또는 분쟁 대응 지시가 아닙니다.",
          "사이트를 읽거나 링크를 클릭하거나 문의를 보내는 것만으로 변호사, 변리사, 특허법인, 로펌 또는 기타 전문가와의 의뢰인 관계가 형성되지 않습니다."
        ]
      },
      {
        title: "정확성 및 최신성",
        paragraphs: [
          "GloTm은 공개 자료와 운영 경험을 바탕으로 정보를 정리하지만, 각 관할의 법령, 관납료, 심사 실무, 플랫폼 정책, 국경 조치, 행정 절차는 예고 없이 변경될 수 있습니다.",
          "실제 출원, 갱신, 이의신청, 침해 대응, 계약, 세관 조치 또는 분쟁 대응 전에 반드시 현지 전문가와 공식 1차 출처를 확인해야 합니다."
        ]
      },
      {
        title: "비공식성 및 비소속성",
        paragraphs: [
          "GloTm은 공공기관, 특허청, 법원, 국제기구, 플랫폼, 로펌 또는 기타 제3자의 공식 웹사이트가 아닙니다.",
          "별도 표시가 없는 한 GloTm의 문서와 리포트는 특정 기관의 승인, 후원, 제휴 또는 공식 입장을 의미하지 않습니다."
        ]
      },
      {
        title: "저작권 및 사용 제한",
        paragraphs: [
          "GloTm의 guide, report, brief, generated content, 문서, 디자인, 소스 코드는 별도 허락이 없는 한 모든 권리가 보유됩니다.",
          "저작권법상 허용되는 범위를 넘는 복제, 수정, 번역, 배포, 재게시, 호스팅, 판매, 학습 데이터 편입 또는 상업적 재사용은 사전 서면 허락 없이 허용되지 않습니다."
        ]
      }
    ]
  },
  {
    slug: "privacy",
    path: "/privacy",
    navLabel: "Privacy",
    kicker: "Privacy Notice",
    title: "GloTm privacy notice",
    summary:
      "GloTm은 현재 공개 GitHub Pages 사이트로 운영되며, 계정 생성이나 결제 기능을 제공하지 않습니다.",
    sections: [
      {
        title: "현재 수집 구조",
        paragraphs: [
          "GloTm은 현재 서버 로그인, 결제, 이메일 게이트, 회원 계정, 별도 데이터베이스 기반 사용자 프로필을 운영하지 않습니다.",
          "브라우저 기능상 일부 읽기 경험은 localStorage 같은 클라이언트 저장소를 사용할 수 있습니다. 이 정보는 사용자의 브라우저에 남는 읽기 편의 데이터이며, 별도 서버 계정으로 전송되는 회원 정보가 아닙니다."
        ]
      },
      {
        title: "분석 및 호스팅 로그",
        paragraphs: [
          "사이트 운영자는 GitHub Pages, GitHub Actions, 브라우저 분석 도구 또는 유사한 호스팅·계측 인프라가 제공하는 집계 통계를 볼 수 있습니다.",
          "현재 Phase 2.5 운영 목적은 active promotion이나 paywall이 아니라 유기 색인, 핵심 클릭 흐름, 공개본 안정성을 확인하는 것입니다."
        ]
      },
      {
        title: "민감 정보 금지",
        paragraphs: [
          "GloTm은 문의나 GitHub 이슈를 통해 영업비밀, 미공개 브랜드명, 출원 전 표장, 분쟁 자료, 고객 정보, 개인식별정보, 계정 토큰 또는 기타 민감 정보를 받기 위한 채널이 아닙니다.",
          "보안 취약점 보고는 공개 이슈에 세부 재현 정보나 토큰을 포함하지 말고, 저장소의 SECURITY.md 지침에 따라 비공개 경로를 먼저 요청해야 합니다."
        ]
      }
    ]
  },
  {
    slug: "contact",
    path: "/contact",
    navLabel: "Contact",
    kicker: "Contact",
    title: "Contact GloTm",
    summary:
      "GloTm 관련 문의는 공개 저장소 owner 경로를 통해 시작하되, 민감 정보는 공개 채널에 올리지 않습니다.",
    sections: [
      {
        title: "일반 문의",
        paragraphs: [
          "오탈자, 깨진 링크, 공개 정보 정정 제안, 문서 구조 제안은 GitHub 저장소의 일반 review channel을 통해 남길 수 있습니다.",
          "법률 자문, 사건 의뢰, 출원 대리, 분쟁 상담, 비용 견적, 개별 회사의 전략 검토 요청은 GloTm 공개 사이트의 처리 범위가 아닙니다."
        ]
      },
      {
        title: "보안 문의",
        paragraphs: [
          "취약점, 토큰 노출, 배포 무결성, XSS, 공급망 리스크처럼 보안에 해당하는 사안은 SECURITY.md의 reporting path를 먼저 따릅니다.",
          "공개 이슈에는 악용 가능한 세부 정보, 비밀값, 계정 정보 또는 실제 공격 payload를 포함하지 않습니다."
        ]
      },
      {
        title: "운영자 경계",
        paragraphs: [
          "GloTm은 현재 무료 공개 정보 사이트로 운영되며, active promotion, pricing, paywall, email gate는 현 Phase 2.5 범위가 아닙니다.",
          "문의에 대한 응답은 best-effort이며, 응답 여부나 속도가 법률 검토, 자문 수임 또는 서비스 수준 약정을 의미하지 않습니다."
        ]
      }
    ]
  }
];

export function getLegalPageBySlug(slug: string | undefined) {
  return legalPages.find((page) => page.slug === slug);
}
