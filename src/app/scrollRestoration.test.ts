import { afterEach, describe, expect, it } from "vitest";

import { syncScrollRestorationForLocation } from "./scrollRestoration";

const originalDescriptor = Object.getOwnPropertyDescriptor(
  window.history,
  "scrollRestoration"
);

function installScrollRestorationSupport(initial: ScrollRestoration = "auto") {
  let value = initial;

  Object.defineProperty(window.history, "scrollRestoration", {
    configurable: true,
    get: () => value,
    set: (next: ScrollRestoration) => {
      value = next;
    }
  });

  return () => value;
}

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(window.history, "scrollRestoration", originalDescriptor);
    return;
  }

  delete (window.history as Partial<History>).scrollRestoration;
});

describe("syncScrollRestorationForLocation", () => {
  it("hands anchor positioning to the app while a hash is present", () => {
    const read = installScrollRestorationSupport("auto");

    syncScrollRestorationForLocation("#buyer-entry-경로-선택표");

    expect(read()).toBe("manual");
  });

  it("returns restoration to the browser when no hash is present", () => {
    const read = installScrollRestorationSupport("manual");

    syncScrollRestorationForLocation("");

    expect(read()).toBe("auto");
  });

  it("stays silent where the browser does not expose scrollRestoration", () => {
    delete (window.history as Partial<History>).scrollRestoration;

    expect(() => {
      syncScrollRestorationForLocation("#anything");
    }).not.toThrow();
  });
});
