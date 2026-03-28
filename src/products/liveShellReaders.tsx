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

export type LiveShellReaderDefinition = {
  slug: string;
  ReaderRoot: ComponentType;
  HomePage: ComponentType;
  ChapterPage: ComponentType;
};

export type LiveShellReaderEntry = LiveShellReaderDefinition & {
  product: ProductMeta;
};

export const liveShellReaderDefinitions: LiveShellReaderDefinition[] = [
  {
    slug: "latam",
    ReaderRoot: LatamReaderRoot,
    HomePage: LatamHomePage,
    ChapterPage: LatamChapterPage
  },
  {
    slug: "mexico",
    ReaderRoot: MexicoReaderRoot,
    HomePage: MexicoHomePage,
    ChapterPage: MexicoChapterPage
  },
  {
    slug: "usa",
    ReaderRoot: UsaReaderRoot,
    HomePage: UsaHomePage,
    ChapterPage: UsaChapterPage
  },
  {
    slug: "japan",
    ReaderRoot: JapanReaderRoot,
    HomePage: JapanHomePage,
    ChapterPage: JapanChapterPage
  },
  {
    slug: "china",
    ReaderRoot: ChinaReaderRoot,
    HomePage: ChinaHomePage,
    ChapterPage: ChinaChapterPage
  },
  {
    slug: "europe",
    ReaderRoot: EuropeReaderRoot,
    HomePage: EuropeHomePage,
    ChapterPage: EuropeChapterPage
  }
];

const readerDefinitionBySlug = new Map(
  liveShellReaderDefinitions.map((definition) => [definition.slug, definition])
);

const unmatchedReaderDefinitions = liveShellReaderDefinitions.filter(
  (definition) => !liveShellProducts.some((product) => product.slug === definition.slug)
);

if (unmatchedReaderDefinitions.length > 0) {
  throw new Error(
    `Unknown live shell reader definitions: ${unmatchedReaderDefinitions
      .map((definition) => definition.slug)
      .join(", ")}`
  );
}

export const liveShellReaderEntries: LiveShellReaderEntry[] = liveShellProducts.map((product) => {
  const definition = readerDefinitionBySlug.get(product.slug);

  if (!definition) {
    throw new Error(`Missing live shell reader definition for ${product.slug}.`);
  }

  return {
    ...definition,
    product
  };
});
