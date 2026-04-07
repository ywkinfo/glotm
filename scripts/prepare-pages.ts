import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { render404Html } from "./seo";

export async function preparePagesArtifacts(distDir = path.resolve("dist")) {
  const indexHtmlPath = path.join(distDir, "index.html");
  const notFoundPath = path.join(distDir, "404.html");
  const noJekyllPath = path.join(distDir, ".nojekyll");
  const indexHtml = await readFile(indexHtmlPath, "utf8");
  const notFoundHtml = render404Html(indexHtml);

  await writeFile(notFoundPath, notFoundHtml);
  await writeFile(noJekyllPath, "");

  return { noJekyllPath, notFoundPath };
}

const entryHref = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === entryHref) {
  await preparePagesArtifacts();
  console.log("Prepared GitHub Pages artifact: 404.html and .nojekyll created.");
}
