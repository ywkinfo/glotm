import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexHtmlPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

await copyFile(indexHtmlPath, notFoundPath);
await writeFile(noJekyllPath, "");

console.log("Prepared GitHub Pages artifact: 404.html and .nojekyll created.");
