import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  initializeGa,
  trackGaPageView
} from "./ga";

describe("GA helpers", () => {
  const originalDataLayer = window.dataLayer;
  const originalGtag = window.gtag;
  const originalConfiguredIds = window.__glotmGaConfiguredIds;

  beforeEach(() => {
    document.head.innerHTML = "";
    window.dataLayer = [];
    window.gtag = undefined;
    window.__glotmGaConfiguredIds = undefined;
    window.history.replaceState({}, "", "/latam");
    document.title = "Initial title";
  });

  afterEach(() => {
    window.dataLayer = originalDataLayer;
    window.gtag = originalGtag;
    window.__glotmGaConfiguredIds = originalConfiguredIds;
    vi.restoreAllMocks();
  });

  it("injects the gtag loader and configures the measurement id once", () => {
    expect(initializeGa("G-TEST123")).toBe(true);
    expect(initializeGa("G-TEST123")).toBe(true);

    const scripts = document.head.querySelectorAll('script[data-ga4-id="G-TEST123"]');

    expect(scripts).toHaveLength(1);
    expect(window.dataLayer).toEqual([
      ["js", expect.any(Date), undefined],
      ["config", "G-TEST123", { send_page_view: false }]
    ]);
  });

  it("sends page_view events through gtag", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    document.title = "LatTm";

    expect(trackGaPageView("G-TEST123", "/latam")).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "page_view", {
      send_to: "G-TEST123",
      page_title: "LatTm",
      page_path: "/latam",
      page_location: "http://localhost:3000/latam"
    });
  });
});
