import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

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

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();

  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: createScrollIntoViewMock()
  });

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: createMatchMediaMock()
  });
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: createScrollIntoViewMock()
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  writable: true,
  value: createMatchMediaMock()
});
