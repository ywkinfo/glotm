import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ManifestEntry = {
  title: string;
  path: string;
};

type Manifest = {
  title: string;
  chapters: ManifestEntry[];
};

type Issue = {
  level: "error" | "warning";
  file: string;
  message: string;
};

const WORKSPACE_LABEL = "ChaTm";
const EXPECTED_CHAPTER_COUNT = 15;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "content", "source", "manifest.json");
const masterPath = path.join(rootDir, "content", "source", "master.md");

const prohibitedPatterns = [
  { pattern: /cite|entity|image_group/g, message: "리서치 마커가 남아 있습니다." },
  { pattern: /turn\d+(?:search|view|open|fetch)\d*/g, message: "내부 검색 턴 표식이 남아 있습니다." },
  { pattern: /【\d+†/g, message: "브라우저 인용 표식이 남아 있습니다." }
];

async function main() {
  const manifest = await readManifest();
  const issues: Issue[] = [];

  if (manifest.chapters.length !== EXPECTED_CHAPTER_COUNT) {
    issues.push({
      level: "warning",
      file: relative(manifestPath),
      message: `장 개수가 ${EXPECTED_CHAPTER_COUNT}개가 아닙니다. 현재 ${manifest.chapters.length}개입니다.`
    });
  }

  for (const entry of manifest.chapters) {
    const sourcePath = path.join(rootDir, entry.path);
    const source = await fs.readFile(sourcePath, "utf-8");
    issues.push(...validateDocument(sourcePath, source, entry.title));
  }

  const master = await fs.readFile(masterPath, "utf-8");
  issues.push(...validateMaster(masterPath, master, manifest));

  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");

  for (const issue of issues) {
    const label = issue.level.toUpperCase().padEnd(7, " ");
    console.log(`${label} ${issue.file}: ${issue.message}`);
  }

  console.log(
    `${WORKSPACE_LABEL} QA complete: ${errors.length} error(s), ${warnings.length} warning(s), ${manifest.chapters.length} source file(s) checked.`
  );

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

async function readManifest() {
  const raw = await fs.readFile(manifestPath, "utf-8");
  return JSON.parse(raw) as Manifest;
}

function validateDocument(filePath: string, source: string, expectedTitle: string) {
  const issues: Issue[] = [];
  const lines = source.split(/\r?\n/);
  const firstContentLine = lines.find((line) => line.trim() !== "");
  const h1 = lines.find((line) => /^#\s+/.test(line));

  if (!firstContentLine?.startsWith("# ")) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "첫 번째 비어 있지 않은 줄이 H1이 아닙니다."
    });
  }

  if (!h1) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "H1 제목이 없습니다."
    });
  } else {
    const title = h1.replace(/^#\s+/, "").trim();
    if (title !== expectedTitle) {
      issues.push({
        level: "error",
        file: relative(filePath),
        message: `장 제목이 manifest와 다릅니다. expected="${expectedTitle}", actual="${title}".`
      });
    }
  }

  const extraH1Count = lines.filter((line) => /^#\s+/.test(line)).length;
  if (extraH1Count !== 1) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: `H1 제목은 정확히 1개여야 합니다. 현재 ${extraH1Count}개입니다.`
    });
  }

  const sectionHeadingCount = lines.filter((line) => /^(##|###)\s+/.test(line)).length;
  if (sectionHeadingCount < 3) {
    issues.push({
      level: "warning",
      file: relative(filePath),
      message: `실무 섹션(H2/H3)이 3개 미만입니다. 현재 ${sectionHeadingCount}개입니다.`
    });
  }

  if (countCodeFences(source) % 2 !== 0) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "코드 펜스 개수가 홀수여서 닫히지 않은 블록이 있습니다."
    });
  }

  issues.push(...checkTableConsistency(filePath, lines));

  for (const rule of prohibitedPatterns) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(source)) {
      issues.push({
        level: "error",
        file: relative(filePath),
        message: rule.message
      });
    }
  }

  return issues;
}

function validateMaster(filePath: string, source: string, manifest: Manifest) {
  const issues: Issue[] = [];
  const lines = source.split(/\r?\n/);
  const firstContentLine = lines.find((line) => line.trim() !== "");

  if (firstContentLine !== `# ${manifest.title}`) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "마스터 문서 H1이 manifest title과 일치하지 않습니다."
    });
  }

  const h2Titles = lines
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim());
  const expectedTitles = manifest.chapters.map((chapter) => chapter.title);

  if (JSON.stringify(h2Titles) !== JSON.stringify(expectedTitles)) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "마스터 문서의 장 순서 또는 제목이 manifest와 일치하지 않습니다."
    });
  }

  if (countCodeFences(source) % 2 !== 0) {
    issues.push({
      level: "error",
      file: relative(filePath),
      message: "마스터 문서에 닫히지 않은 코드 펜스가 있습니다."
    });
  }

  for (const rule of prohibitedPatterns) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(source)) {
      issues.push({
        level: "error",
        file: relative(filePath),
        message: `마스터 문서에 ${rule.message}`
      });
    }
  }

  return issues;
}

function checkTableConsistency(filePath: string, lines: string[]) {
  const issues: Issue[] = [];

  lines.forEach((line, index) => {
    if (!line.trim().startsWith("|")) {
      return;
    }

    const cells = line.split("|").length;
    const nextLine = lines[index + 1] ?? "";
    if (nextLine.trim().startsWith("|") && nextLine.split("|").length !== cells) {
      issues.push({
        level: "warning",
        file: relative(filePath),
        message: `표 열 개수가 일치하지 않을 수 있습니다. line ${index + 1}.`
      });
    }
  });

  return issues;
}

function countCodeFences(source: string) {
  return (source.match(/^```/gm) ?? []).length;
}

function relative(filePath: string) {
  return path.relative(rootDir, filePath) || path.basename(filePath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
