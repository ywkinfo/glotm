import { useEffect } from "react";

import { setRuntimeDocumentTitle } from "../../products/shared";
import { buildGatewayViewModel } from "./gatewayData";
import {
  GatewayHero,
  LatestBriefBanner,
  RecommendedStart,
  TrustLayerReports,
  WhatGloTmSolves,
  WhyItMattersEarly
} from "./gatewaySections";
import {
  BriefSection,
  CurrentBuildOrder,
  OperatorSection,
  PortfolioFocus,
  ReportSection
} from "./gatewayOperationsSections";

export function GatewayLandingPage() {
  const view = buildGatewayViewModel();

  useEffect(() => {
    setRuntimeDocumentTitle();
  }, []);

  return (
    <div className="gateway-page">
      <GatewayHero view={view} />
      <LatestBriefBanner view={view} />
      <TrustLayerReports view={view} />
      <RecommendedStart view={view} />
      <WhyItMattersEarly view={view} />
      <WhatGloTmSolves />
      <BriefSection view={view} />
      <ReportSection view={view} />
      <PortfolioFocus view={view} />
      <CurrentBuildOrder view={view} />
      <OperatorSection view={view} />

      <footer className="gateway-copyright">
        <p>© 2026 GloTm. All rights reserved.</p>
      </footer>
    </div>
  );
}
