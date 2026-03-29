import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const products = [
  { sourceDir: "LatTm", slug: "latam" },
  { sourceDir: "MexTm", slug: "mexico" },
  { sourceDir: "UsaTm", slug: "usa" },
  { sourceDir: "JapTm", slug: "japan" },
  { sourceDir: "ChaTm", slug: "china" },
  { sourceDir: "EuTm", slug: "europe" }
];

const publicGeneratedRoot = path.resolve("public/generated");

await rm(publicGeneratedRoot, { force: true, recursive: true });
await mkdir(publicGeneratedRoot, { recursive: true });

for (const product of products) {
  const sourceDir = path.resolve(product.sourceDir, "content/generated");
  const targetDir = path.join(publicGeneratedRoot, product.slug);

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

console.log(`Synced generated reader content to ${publicGeneratedRoot}`);
