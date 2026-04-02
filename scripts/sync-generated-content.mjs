import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const products = [
  { sourceDir: "LatTm", slug: "latam" },
  { sourceDir: "MexTm", slug: "mexico" },
  { sourceDir: "UsaTm", slug: "usa" },
  { sourceDir: "JapTm", slug: "japan" },
  { sourceDir: "ChaTm", slug: "china" },
  { sourceDir: "EuTm", slug: "europe" },
  { sourceDir: "UKTm", slug: "uk" }
];

const publicGeneratedRoot = path.resolve("public/generated");

async function copyGeneratedContent(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  await copyFile(
    path.join(sourceDir, "document-data.json"),
    path.join(targetDir, "document-data.json")
  );
  await copyFile(
    path.join(sourceDir, "search-index.json"),
    path.join(targetDir, "search-index.json")
  );
}

async function listDirectories(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true }).catch((error) => {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  });

  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

await rm(publicGeneratedRoot, { force: true, recursive: true });
await mkdir(publicGeneratedRoot, { recursive: true });

for (const product of products) {
  const sourceDir = path.resolve(product.sourceDir, "content/generated");
  const targetDir = path.join(publicGeneratedRoot, product.slug);

  await copyGeneratedContent(sourceDir, targetDir);
}

const reportGeneratedRoot = path.resolve("Reports/generated");
const reportSlugs = await listDirectories(reportGeneratedRoot);

for (const reportSlug of reportSlugs) {
  const sourceDir = path.join(reportGeneratedRoot, reportSlug);
  const targetDir = path.join(publicGeneratedRoot, "reports", reportSlug);

  await copyGeneratedContent(sourceDir, targetDir);
}

console.log(`Synced generated reader content to ${publicGeneratedRoot}`);
