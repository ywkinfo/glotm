import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexHtmlPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");
const indexHtml = await readFile(indexHtmlPath, "utf8");
const notFoundHtml = indexHtml
  .replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, "\n")
  .replace(/\s*<meta\s+name="robots"[^>]*>\s*/gi, "\n")
  .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, "\n")
  .replace(/\s*<meta[^>]+property="og:[^"]+"[^>]*>\s*/gi, "\n")
  .replace(/\s*<link[^>]+rel="canonical"[^>]*>\s*/gi, "\n")
  .replace(/<title>[\s\S]*?<\/title>/i, "<title>찾을 수 없는 페이지 | GloTm</title>")
  .replace(
    "</head>",
    [
      '    <meta name="description" content="GloTm에서 요청한 페이지를 찾을 수 없습니다." />',
      '    <meta name="robots" content="noindex, nofollow" />',
      "  </head>"
    ].join("\n")
  );

await writeFile(notFoundPath, notFoundHtml);
await writeFile(noJekyllPath, "");

console.log("Prepared GitHub Pages artifact: 404.html and .nojekyll created.");
