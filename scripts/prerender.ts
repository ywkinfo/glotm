import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  buildStaticPageDefinitions,
  getSeoRuntimeOptions,
  loadDocumentDataBySlug,
  loadReportDocumentDataBySlug,
  writeStaticPageFiles
} from "./seo";

const runtime = getSeoRuntimeOptions();
const templatePath = path.join(runtime.distDir, "index.html");
const templateHtml = await readFile(templatePath, "utf8");
const documentDataBySlug = await loadDocumentDataBySlug(runtime);
const reportDocumentDataBySlug = await loadReportDocumentDataBySlug(runtime);
const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, runtime);

await writeStaticPageFiles(templateHtml, pages);

console.log(`Prerendered ${pages.length} static HTML pages into ${runtime.distDir}.`);
