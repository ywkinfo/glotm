import type { ComponentType } from "react";

import { liveShellProducts } from "./registry";
import type { ProductMeta } from "./shared";
import {
  ChinaChapterPage,
  ChinaHomePage,
  ChinaReaderRoot
} from "./china";
import {
  EuropeChapterPage,
  EuropeHomePage,
  EuropeReaderRoot
} from "./europe";
import {
  JapanChapterPage,
  JapanHomePage,
  JapanReaderRoot
} from "./japan";
import {
  LatamChapterPage,
  LatamHomePage,
  LatamReaderRoot
} from "./latam";
import {
  MexicoChapterPage,
  MexicoHomePage,
  MexicoReaderRoot
} from "./mexico";
import {
  UsaChapterPage,
  UsaHomePage,
  UsaReaderRoot
} from "./usa";
import {
  UkChapterPage,
  UkHomePage,
  UkReaderRoot
} from "./uk";

export type LiveShellReaderDefinition = {
  slug: string;
  ReaderRoot: ComponentType;
  HomePage: ComponentType;
  ChapterPage: ComponentType;
};

export type LiveShellReaderEntry = LiveShellReaderDefinition & {
  product: ProductMeta;
};

type LiveShellReaderComponents = Omit<LiveShellReaderDefinition, "slug">;

const liveShellReaderComponentsBySlug = {
  latam: {
    ReaderRoot: LatamReaderRoot,
    HomePage: LatamHomePage,
    ChapterPage: LatamChapterPage
  },
  mexico: {
    ReaderRoot: MexicoReaderRoot,
    HomePage: MexicoHomePage,
    ChapterPage: MexicoChapterPage
  },
  usa: {
    ReaderRoot: UsaReaderRoot,
    HomePage: UsaHomePage,
    ChapterPage: UsaChapterPage
  },
  japan: {
    ReaderRoot: JapanReaderRoot,
    HomePage: JapanHomePage,
    ChapterPage: JapanChapterPage
  },
  china: {
    ReaderRoot: ChinaReaderRoot,
    HomePage: ChinaHomePage,
    ChapterPage: ChinaChapterPage
  },
  europe: {
    ReaderRoot: EuropeReaderRoot,
    HomePage: EuropeHomePage,
    ChapterPage: EuropeChapterPage
  },
  uk: {
    ReaderRoot: UkReaderRoot,
    HomePage: UkHomePage,
    ChapterPage: UkChapterPage
  }
} satisfies Record<string, LiveShellReaderComponents>;

type LiveShellReaderSlug = keyof typeof liveShellReaderComponentsBySlug;

const unknownReaderDefinitionSlugs = Object.keys(liveShellReaderComponentsBySlug).filter(
  (slug) => !liveShellProducts.some((product) => product.slug === slug)
);

if (unknownReaderDefinitionSlugs.length > 0) {
  throw new Error(
    `Unknown live shell reader definitions: ${unknownReaderDefinitionSlugs.join(", ")}`
  );
}

function getLiveShellReaderComponents(productSlug: string) {
  if (!(productSlug in liveShellReaderComponentsBySlug)) {
    throw new Error(`Missing live shell reader definition for ${productSlug}.`);
  }

  const components = liveShellReaderComponentsBySlug[productSlug as LiveShellReaderSlug];

  return components;
}

export const liveShellReaderEntries: LiveShellReaderEntry[] = liveShellProducts.map((product) => {
  const components = getLiveShellReaderComponents(product.slug);

  return {
    slug: product.slug,
    ...components,
    product
  };
});

export const liveShellReaderDefinitions: LiveShellReaderDefinition[] = liveShellReaderEntries.map(
  ({ product: _product, ...definition }) => definition
);
