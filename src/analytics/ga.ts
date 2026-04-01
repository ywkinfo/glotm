type GaEventParams = Record<string, string | number | boolean | undefined>;

type GtagFunction = (
  command: "js" | "config" | "event",
  target: Date | string,
  params?: GaEventParams
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
    __glotmGaConfiguredIds?: string[];
  }

  interface ImportMetaEnv {
    readonly VITE_GA_MEASUREMENT_ID?: string;
  }
}

function normalizeMeasurementId(rawValue?: string) {
  const trimmedValue = rawValue?.trim();

  return trimmedValue ? trimmedValue : undefined;
}

export function getGaMeasurementId() {
  return normalizeMeasurementId(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

export function initializeGa(measurementId: string) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  const normalizedId = normalizeMeasurementId(measurementId);

  if (!normalizedId) {
    return false;
  }

  const configuredIds = window.__glotmGaConfiguredIds ?? [];

  if (!window.__glotmGaConfiguredIds) {
    window.__glotmGaConfiguredIds = configuredIds;
  }

  if (!document.querySelector(`script[data-ga4-id="${normalizedId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(normalizedId)}`;
    script.dataset.ga4Id = normalizedId;
    document.head.appendChild(script);
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = function gtag(command, target, params) {
      window.dataLayer?.push([command, target, params]);
    };
  }

  if (!configuredIds.includes(normalizedId)) {
    window.gtag("js", new Date());
    window.gtag("config", normalizedId, {
      send_page_view: false
    });
    configuredIds.push(normalizedId);
  }

  return true;
}

export function trackGaPageView(measurementId: string, pagePath: string, pageTitle?: string) {
  const normalizedId = normalizeMeasurementId(measurementId);

  if (
    !normalizedId
    || typeof window === "undefined"
    || typeof document === "undefined"
    || typeof window.gtag !== "function"
  ) {
    return false;
  }

  window.gtag("event", "page_view", {
    send_to: normalizedId,
    page_title: pageTitle ?? document.title,
    page_path: pagePath,
    page_location: window.location.href
  });

  return true;
}
