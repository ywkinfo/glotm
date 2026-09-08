import { useEffect } from "react";

import { setRuntimeDocumentTitle } from "../../products/shared";
import { buildGatewayViewModel } from "./gatewayData";
import {
  GatewayHero,
  GuideEntryGrid,
  LatestBriefBanner,
  TrustLayerReports,
  WhatGloTmSolves,
  WhyItMattersEarly
} from "./gatewaySections";
import { GatewayOperationsPanel, OperatorSection } from "./gatewayOperationsSections";

export function GatewayLandingPage() {
  const view = buildGatewayViewModel();

  useEffect(() => {
    setRuntimeDocumentTitle();
  }, []);

  // 순서의 근거: 이용자가 게이트웨이에서 해야 할 첫 업무는 "읽을 나라를 고르는 것"이다.
  // 히어로는 제목 + 짧은 문단으로 줄이고, 국가 진입을 바로 뒤에 둔다. 운영 체계(tier·빌드
  // 순서·스냅샷)는 삭제하지 않고 접힌 운영 영역으로 내렸다.
  //
  // 중복 통합: 최신 브리프는 배너에서 한 번만, 최신 리포트는 트러스트 레이어에서 한 번만
  // 노출한다. Recommended Start는 국가 진입 그리드에 흡수됐고, Portfolio Focus의 tier 그룹은
  // 독자용 가이드 목록이 아니라 운영 정보라 운영 영역으로 옮겼다.
  return (
    <div className="gateway-page">
      <GatewayHero />
      <GuideEntryGrid view={view} />
      <LatestBriefBanner view={view} />
      <TrustLayerReports view={view} />
      <WhyItMattersEarly view={view} />
      <WhatGloTmSolves />
      <GatewayOperationsPanel view={view} />
      <OperatorSection view={view} />

      <footer className="gateway-copyright">
        <p>© 2026 GloTm. All rights reserved.</p>
      </footer>
    </div>
  );
}
