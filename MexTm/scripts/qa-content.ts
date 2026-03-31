import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ManifestChapter = {
  title: string;
};

type Manifest = {
  title: string;
  chapters: ManifestChapter[];
};

type Issue = {
  level: "error" | "warning";
  section: string;
  message: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "content", "source", "manifest.json");
const masterPath = path.join(rootDir, "content", "source", "master.md");

const EXPECTED_CHAPTER_COUNT = 15;

const prohibitedPatterns = [
  { pattern: /cite|entity|image_group/g, message: "리서치 마커가 남아 있습니다." },
  { pattern: /turn\d+(?:search|view|open|fetch)\d*/g, message: "내부 검색 턴 표식이 남아 있습니다." },
  { pattern: /【\d+†/g, message: "브라우저 인용 표식이 남아 있습니다." }
];

// Minimum content thresholds (warning only — not a build failure)
const MIN_CONTENT_CHARS = 200;
const MIN_SECTION_HEADINGS = 2;

async function main() {
  const manifest = await readManifest();
  const master = await fs.readFile(masterPath, "utf-8");
  const issues: Issue[] = [];

  if (manifest.chapters.length !== EXPECTED_CHAPTER_COUNT) {
    issues.push({
      level: "error",
      section: relative(manifestPath),
      message: `장/부록 개수가 ${EXPECTED_CHAPTER_COUNT}개가 아닙니다. 현재 ${manifest.chapters.length}개입니다.`
    });
  }

  issues.push(...validateMaster(master, manifest));
  issues.push(...validateChapterDepth(master, manifest));

  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");

  for (const issue of issues) {
    const label = issue.level.toUpperCase().padEnd(7, " ");
    console.log(`${label} [${issue.section}]: ${issue.message}`);
  }

  console.log(
    `QA complete: ${errors.length} error(s), ${warnings.length} warning(s), ${manifest.chapters.length} section(s) checked.`
  );

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

async function readManifest(): Promise<Manifest> {
  const raw = await fs.readFile(manifestPath, "utf-8");
  return JSON.parse(raw) as Manifest;
}

function validateMaster(source: string, manifest: Manifest): Issue[] {
  const issues: Issue[] = [];
  const lines = source.split(/\r?\n/);
  const label = relative(masterPath);

  const firstContentLine = lines.find((line) => line.trim() !== "");
  if (firstContentLine !== `# ${manifest.title}`) {
    issues.push({
      level: "error",
      section: label,
      message: `마스터 문서 H1이 manifest title과 일치하지 않습니다. expected="# ${manifest.title}", actual="${firstContentLine}".`
    });
  }

  const h2Titles = lines
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim());
  const expectedTitles = manifest.chapters.map((ch) => ch.title);

  if (JSON.stringify(h2Titles) !== JSON.stringify(expectedTitles)) {
    const missing = expectedTitles.filter((t) => !h2Titles.includes(t));
    const extra = h2Titles.filter((t) => !expectedTitles.includes(t));

    if (missing.length > 0) {
      issues.push({
        level: "error",
        section: label,
        message: `manifest에 있으나 마스터에 없는 장: ${missing.map((t) => `"${t}"`).join(", ")}`
      });
    }

    if (extra.length > 0) {
      issues.push({
        level: "error",
        section: label,
        message: `마스터에 있으나 manifest에 없는 장: ${extra.map((t) => `"${t}"`).join(", ")}`
      });
    }

    if (missing.length === 0 && extra.length === 0) {
      issues.push({
        level: "error",
        section: label,
        message: "마스터 문서의 장 순서가 manifest와 일치하지 않습니다."
      });
    }
  }

  if (countCodeFences(source) % 2 !== 0) {
    issues.push({
      level: "error",
      section: label,
      message: "마스터 문서에 닫히지 않은 코드 펜스가 있습니다."
    });
  }

  for (const rule of prohibitedPatterns) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(source)) {
      issues.push({
        level: "error",
        section: label,
        message: `마스터 문서에 ${rule.message}`
      });
    }
  }

  issues.push(...checkTableConsistency(label, lines));
  issues.push(...detectDuplicateParagraphs(label, source));

  return issues;
}

function validateChapterDepth(source: string, manifest: Manifest): Issue[] {
  const issues: Issue[] = [];
  const sections = splitIntoSections(source);

  for (const chapter of manifest.chapters) {
    const section = sections.get(chapter.title);

    if (!section) {
      continue;
    }

    const contentChars = stripMarkdown(section).length;
    if (contentChars < MIN_CONTENT_CHARS) {
      issues.push({
        level: "warning",
        section: chapter.title,
        message: `콘텐츠가 매우 짧습니다. (${contentChars}자). 최소 ${MIN_CONTENT_CHARS}자 이상 권장.`
      });
    }

    const sectionHeadings = [...section.matchAll(/^#{3,5}\s+/gm)].length;
    if (sectionHeadings < MIN_SECTION_HEADINGS) {
      issues.push({
        level: "warning",
        section: chapter.title,
        message: `H3 이하 섹션이 ${sectionHeadings}개입니다. 최소 ${MIN_SECTION_HEADINGS}개 이상 권장.`
      });
    }
  }

  return issues;
}

function splitIntoSections(source: string): Map<string, string> {
  const map = new Map<string, string>();
  const lines = source.split(/\r?\n/);
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentTitle !== null) {
        map.set(currentTitle, currentLines.join("\n"));
      }
      currentTitle = h2Match[1].trim();
      currentLines = [];
    } else if (currentTitle !== null) {
      currentLines.push(line);
    }
  }

  if (currentTitle !== null) {
    map.set(currentTitle, currentLines.join("\n"));
  }

  return map;
}

function detectDuplicateParagraphs(label: string, source: string): Issue[] {
  const issues: Issue[] = [];
  const paragraphMap = new Map<string, number>();

  const paragraphs = source
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length >= 140 &&
        !p.startsWith("#") &&
        !p.startsWith("|") &&
        !p.startsWith("```") &&
        !p.startsWith("- ") &&
        !p.startsWith("* ")
    );

  for (const paragraph of paragraphs) {
    const normalized = paragraph.replace(/\s+/g, " ");
    paragraphMap.set(normalized, (paragraphMap.get(normalized) ?? 0) + 1);
  }

  for (const [paragraph, count] of paragraphMap.entries()) {
    if (count > 1) {
      issues.push({
        level: "warning",
        section: label,
        message: `길이가 긴 중복 문단이 ${count}회 감지되었습니다: "${paragraph.slice(0, 80)}..."`
      });
    }
  }

  return issues;
}

function checkTableConsistency(label: string, lines: string[]): Issue[] {
  const issues: Issue[] = [];
  let currentBlock: string[] = [];

  const flush = () => {
    if (currentBlock.length < 2) {
      currentBlock = [];
      return;
    }

    const counts = currentBlock
      .filter((line) => line.trim() !== "")
      .map((line) => line.split("|").length);
    const expected = counts[0];

    if (counts.some((count) => count !== expected)) {
      issues.push({
        level: "warning",
        section: label,
        message: "열 수가 일정하지 않은 표 블록이 있습니다."
      });
    }

    currentBlock = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("|")) {
      currentBlock.push(line);
    } else {
      flush();
    }
  }

  flush();
  return issues;
}

function countCodeFences(source: string) {
  return [...source.matchAll(/^```/gm)].length;
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^ *\|?[-:| ]+\|? *$/gm, "")
    .replace(/\|/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function relative(filePath: string) {
  return path.relative(rootDir, filePath) || filePath;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
