import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

function createScrollIntoViewMock() {
  return vi.fn();
}

function createMatchMediaMock() {
  return vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

class ResizeObserverMock {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
}

function installDomMocks() {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: createScrollIntoViewMock()
  });

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: createMatchMediaMock()
  });

  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverMock
  });
}

beforeEach(() => {
  installDomMocks();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
  installDomMocks();
});

installDomMocks();
