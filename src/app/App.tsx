import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import {
  getGaMeasurementId,
  initializeGa,
  trackGaPageView
} from "../analytics/ga";
import {
  buildBriefArchivePath
} from "../briefs/archive";
import {
  buildReportArchivePath
} from "../reports/registry";
import {
  liveShellProducts
} from "../products/registry";
import { liveShellReaderEntries } from "../products/liveShellReaders";
import {
  buildProductPath,
  getRouterBasename
} from "../products/shared";
import { BriefArchivePage, BriefIssuePage } from "./BriefPages";
import { GatewayLandingPage } from "./GatewayPage";
import { ReportArchivePage, ReportPage } from "./ReportPages";
import {
  FullDocumentLink,
  buildGuideTrackingParams,
  getLifecycleStatusLabel,
  getPortfolioTierLabel,
  orderGatewayProducts,
  trackEngagement
} from "./appShared";

function AppLayout() {
  const location = useLocation();
  const activeNavItemRef = useRef<HTMLAnchorElement | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const orderedNavProducts = orderGatewayProducts(liveShellProducts);
  const activeProduct = liveShellProducts.find(
    (product) =>
      location.pathname === buildProductPath(product)
      || location.pathname.startsWith(`${buildProductPath(product)}/`)
  );
  const isBriefActive =
    location.pathname === buildBriefArchivePath()
    || location.pathname.startsWith(`${buildBriefArchivePath()}/`);
  const isReportActive =
    location.pathname === buildReportArchivePath()
    || location.pathname.startsWith(`${buildReportArchivePath()}/`);
  const isGatewayActive = location.pathname === buildProductPath("/");
  const getGlobalNavClassName = (isActive: boolean) =>
    isActive ? "global-nav-link active" : "global-nav-link";

  useEffect(() => {
    activeNavItemRef.current?.scrollIntoView?.({
      block: "nearest",
      inline: "center"
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    trackEngagement(
      "guide_open",
      buildGuideTrackingParams(activeProduct, "route", {
        route_kind:
          location.pathname === buildProductPath(activeProduct)
            ? "home"
            : "reader"
      })
    );
  }, [activeProduct, location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const rootElement = document.documentElement;
    const topbarElement = topbarRef.current;

    if (!topbarElement) {
      return undefined;
    }

    const updateTopbarHeight = () => {
      rootElement.style.setProperty(
        "--global-topbar-height",
        `${topbarElement.getBoundingClientRect().height}px`
      );
    };

    updateTopbarHeight();
    window.addEventListener("resize", updateTopbarHeight);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        window.removeEventListener("resize", updateTopbarHeight);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateTopbarHeight();
    });

    resizeObserver.observe(topbarElement);

    return () => {
      window.removeEventListener("resize", updateTopbarHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="glotm-app">
      <header ref={topbarRef} className="global-topbar">
        <div className="global-topbar-brand">
          <FullDocumentLink className="global-brand" to={buildProductPath("/")}>
            GloTm
          </FullDocumentLink>
          <p className="global-tagline">인하우스 팀을 위한 cross-border trademark operating guides</p>
        </div>

        <nav className="global-nav" aria-label="제품 전환">
          <FullDocumentLink
            to={buildProductPath("/")}
            ref={isGatewayActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isGatewayActive)}
            aria-current={isGatewayActive ? "page" : undefined}
          >
            <span className="global-nav-label">Gateway</span>
          </FullDocumentLink>
          <FullDocumentLink
            to={buildBriefArchivePath()}
            ref={isBriefActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isBriefActive)}
            aria-current={isBriefActive ? "page" : undefined}
          >
            <span className="global-nav-label">Brief</span>
          </FullDocumentLink>
          <FullDocumentLink
            to={buildReportArchivePath()}
            ref={isReportActive ? activeNavItemRef : undefined}
            className={getGlobalNavClassName(isReportActive)}
            aria-current={isReportActive ? "page" : undefined}
          >
            <span className="global-nav-label">Report</span>
          </FullDocumentLink>
          {orderedNavProducts.map((product) => {
            const isProductActive = activeProduct?.id === product.id;

            return (
              <FullDocumentLink
                key={product.id}
                to={buildProductPath(product)}
                ref={isProductActive ? activeNavItemRef : undefined}
                className={getGlobalNavClassName(isProductActive)}
                aria-current={isProductActive ? "page" : undefined}
              >
                <span className="global-nav-label">{product.shortLabel}</span>
                <span className={`status-pill status-pill--${product.lifecycleTone}`}>
                  {getLifecycleStatusLabel(product.lifecycleStatus)}
                </span>
              </FullDocumentLink>
            );
          })}
        </nav>

        <div className="global-status-panel">
          {activeProduct ? (
            <span className="status-pill status-pill--neutral">
              {getPortfolioTierLabel(activeProduct.portfolioTier)}
            </span>
          ) : isReportActive ? (
            <span className="status-pill status-pill--neutral">
              Special Report
            </span>
          ) : isBriefActive ? (
            <span className="status-pill status-pill--neutral">
              Hot Global TM Brief
            </span>
          ) : (
            <span className="status-pill status-pill--neutral">
              4-tier operating guide portfolio
            </span>
          )}
        </div>
      </header>

      <main className="glotm-main">
        <Outlet />
      </main>
    </div>
  );
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const measurementId = getGaMeasurementId();

    if (!measurementId) {
      return;
    }

    initializeGa(measurementId);
  }, []);

  useEffect(() => {
    const measurementId = getGaMeasurementId();

    if (!measurementId || typeof window === "undefined") {
      return undefined;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    const timeoutId = window.setTimeout(() => {
      trackGaPageView(measurementId, pagePath, document.title);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export function AppRoutes() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<GatewayLandingPage />} />
          <Route path={buildBriefArchivePath().replace(/^\//, "")} element={<BriefArchivePage />} />
          <Route path={`${buildBriefArchivePath().replace(/^\//, "")}/:issueSlug`} element={<BriefIssuePage />} />
          <Route path={buildReportArchivePath().replace(/^\//, "")} element={<ReportArchivePage />} />
          <Route path={`${buildReportArchivePath().replace(/^\//, "")}/:reportSlug`} element={<ReportPage />} />
          {liveShellReaderEntries.map(({ product, ReaderRoot, HomePage, ChapterPage }) => (
            <Route
              key={product.slug}
              path={buildProductPath(product).replace(/^\//, "")}
              element={<ReaderRoot />}
            >
              <Route index element={<HomePage />} />
              <Route path="chapter/:chapterSlug" element={<ChapterPage />} />
            </Route>
          ))}
          <Route path="*" element={<Navigate to={buildProductPath("/")} replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <AppRoutes />
    </BrowserRouter>
  );
}
