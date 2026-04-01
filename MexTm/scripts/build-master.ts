import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ManifestEntry = {
  title: string;
  path?: string;
};

type Manifest = {
  title: string;
  chapters: ManifestEntry[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "content", "source", "manifest.json");
const masterPath = path.join(rootDir, "content", "source", "master.md");

async function main() {
  const manifest = await readManifest();
  const sourcePathByTitle = await buildSourcePathIndex();
  const parts: string[] = [
    `# ${manifest.title}`,
    "",
    "> 이 문서는 MexTm 공개용 정본 마스터입니다.",
    "> 장별 원고를 조립해 생성하며, 로컬 리더와 generated JSON 파이프라인은 이 파일을 기준으로 읽습니다."
  ];

  for (const entry of manifest.chapters) {
    const sourcePath = resolveSourcePath(entry, sourcePathByTitle);
    const source = await fs.readFile(sourcePath, "utf-8");
    const body = promoteHeadings(stripSourceTitle(source, entry.title));

    parts.push("", `## ${entry.title}`);

    if (body) {
      parts.push("", body);
    }
  }

  await fs.writeFile(masterPath, parts.join("\n").trimEnd() + "\n", "utf-8");
  console.log(`Generated MexTm master manuscript from ${manifest.chapters.length} sources.`);
}

async function buildSourcePathIndex() {
  const sourceRoot = path.join(rootDir, "content", "source");
  const directories = ["chapters", "appendix"];
  const pairs = await Promise.all(
    directories.map(async (directory) => {
      const directoryPath = path.join(sourceRoot, directory);
      try {
        const filenames = await fs.readdir(directoryPath);
        return filenames
          .filter((filename) => filename.endsWith(".md"))
          .map((filename) => path.join(directoryPath, filename));
      } catch {
        return [];
      }
    })
  );

  const titleToPath = new Map<string, string>();
  for (const filePath of pairs.flat()) {
    const source = await fs.readFile(filePath, "utf-8");
    const title = readSourceTitle(source);
    titleToPath.set(title, filePath);
  }

  return titleToPath;
}

async function readManifest() {
  const raw = await fs.readFile(manifestPath, "utf-8");
  return JSON.parse(raw) as Manifest;
}

function resolveSourcePath(entry: ManifestEntry, sourcePathByTitle: Map<string, string>) {
  if (entry.path) {
    return path.join(rootDir, entry.path);
  }

  const resolved = sourcePathByTitle.get(entry.title);
  if (!resolved) {
    throw new Error(`Missing source path for "${entry.title}" in manifest and source index.`);
  }

  return resolved;
}

function readSourceTitle(source: string) {
  const lines = source.split(/\r?\n/);
  const heading = lines.find((line) => /^#\s+/.test(line));

  if (!heading) {
    throw new Error("Missing H1 while indexing MexTm source.");
  }

  return heading.replace(/^#\s+/, "").trim();
}

function stripSourceTitle(source: string, expectedTitle: string) {
  const lines = source.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^#\s+/.test(line));

  if (headingIndex === -1) {
    throw new Error(`Missing H1 in source for "${expectedTitle}".`);
  }

  const body = lines.slice(headingIndex + 1);
  return trimLines(body).join("\n");
}

function trimLines(lines: string[]) {
  const next = [...lines];

  while (next.length > 0 && next[0].trim() === "") {
    next.shift();
  }

  while (next.length > 0 && next[next.length - 1].trim() === "") {
    next.pop();
  }

  return next;
}

function promoteHeadings(source: string) {
  return source.replace(/^(#{2,6})(\s+)/gm, (match, hashes: string, spacing: string) => {
    if (hashes.length >= 6) {
      return match;
    }

    return `${hashes}#${spacing}`;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
