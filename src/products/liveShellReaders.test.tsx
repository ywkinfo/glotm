import { describe, expect, it } from "vitest";

import { liveShellReaderDefinitions, liveShellReaderEntries } from "./liveShellReaders";
import { liveShellProducts } from "./registry";

describe("liveShellReaders", () => {
  it("derives live reader definitions from registry live product order", () => {
    expect(liveShellReaderDefinitions.map((definition) => definition.slug)).toEqual(
      liveShellProducts.map((product) => product.slug)
    );
  });

  it("keeps reader entries aligned with registry products", () => {
    expect(liveShellReaderEntries.map((entry) => entry.product.slug)).toEqual(
      liveShellProducts.map((product) => product.slug)
    );
    expect(liveShellReaderEntries.every((entry) => entry.slug === entry.product.slug)).toBe(true);
  });
});
