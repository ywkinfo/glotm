import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildRobotsTxt,
  buildSitemapXml,
  buildStaticPageDefinitions,
  getSeoRuntimeOptions,
  loadDocumentDataBySlug,
  loadReportDocumentDataBySlug
} from "./seo";

const runtime = getSeoRuntimeOptions();
const documentDataBySlug = await loadDocumentDataBySlug(runtime);
const reportDocumentDataBySlug = await loadReportDocumentDataBySlug(runtime);
const pages = buildStaticPageDefinitions(documentDataBySlug, reportDocumentDataBySlug, runtime);
const sitemapXml = buildSitemapXml(pages);
const robotsTxt = buildRobotsTxt(runtime.siteOrigin, runtime.basePath);

await writeFile(path.join(runtime.distDir, "sitemap.xml"), sitemapXml);
await writeFile(path.join(runtime.distDir, "robots.txt"), robotsTxt);

console.log(`Generated sitemap.xml and robots.txt for ${pages.length} public routes.`);
