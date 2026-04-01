import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  buildStaticPageDefinitions,
  getSeoRuntimeOptions,
  loadDocumentDataBySlug,
  writeStaticPageFiles
} from "./seo";

const runtime = getSeoRuntimeOptions();
const templatePath = path.join(runtime.distDir, "index.html");
const templateHtml = await readFile(templatePath, "utf8");
const documentDataBySlug = await loadDocumentDataBySlug(runtime);
const pages = buildStaticPageDefinitions(documentDataBySlug, runtime);

await writeStaticPageFiles(templateHtml, pages);

console.log(`Prerendered ${pages.length} static HTML pages into ${runtime.distDir}.`);
