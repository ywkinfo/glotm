import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

type HeadingNode = {
  id: string;
  depth: number;
  title: string;
  children: HeadingNode[];
};

type ChapterSource = {
  title: string;
  slug: string;
  lines: string[];
};

type Chapter = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  html: string;
  headings: HeadingNode[];
};

type SearchEntry = {
  id: string;
  chapterSlug: string;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  text: string;
  excerpt: string;
};

type DocumentData = {
  meta: {
    title: string;
    builtAt: string;
    chapterCount: number;
  };
  chapters: Chapter[];
};

type FlatHeading = {
  id: string;
  depth: number;
  title: string;
  lineIndex: number;
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const DEFAULT_DOCUMENT_TITLE = "중국 상표 실무 운영 가이드";
const OVERVIEW_SECTION_TITLE = "개요";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "content", "source", "master.md");
const generatedDir = path.join(rootDir, "content", "generated");
const documentDataPath = path.join(generatedDir, "document-data.json");
const searchIndexPath = path.join(generatedDir, "search-index.json");
const contentSourceDir = path.join(rootDir, "content", "source");

const officialDomains = new Set([
  "cnipa.gov.cn",
  "samr.gov.cn",
  "court.gov.cn",
  "npc.gov.cn",
  "wipo.int"
]);

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeEnhance)
  .use(rehypeStringify);

// meta.builtAt은 이 가이드 인덱스와 전 챕터의 sitemap lastmod가 된다(scripts/seo.ts).
// 빌드 시각을 찍으면 콘텐츠가 그대로여도 배포마다 전 코퍼스가 갱신됐다고 신고하므로,
// 1차 근거는 콘텐츠 소스의 git 커밋일로 잡는다 — CI든 로컬이든 같은 값이 나오고 배포 횟수에 흔들리지 않는다.
// git을 쓸 수 없거나(비-git 아카이브) 믿을 수 없을 때만 2차 방어인 withStableBuiltAt으로 내려간다.
function gitLastModifiedIso(targetPath: string) {
  const runGit = (args: string[]) =>
    execFileSync("git", args, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();

  try {
    if (runGit(["rev-parse", "--is-inside-work-tree"]) !== "true") {
      return undefined;
    }

    // shallow clone에서는 모든 경로의 마지막 커밋이 체크아웃 커밋 하나로 붕괴돼 배포 시각과 다를 바 없다.
    // 워크플로는 fetch-depth: 0을 쓰지만, 그 설정이 사라지면 조용히 틀리는 대신 fallback으로 내려간다.
    if (runGit(["rev-parse", "--is-shallow-repository"]) !== "false") {
      return undefined;
    }

    // 커밋되지 않은 편집이 있으면 커밋일은 지금 빌드하는 내용을 설명하지 못한다. 거짓 날짜 대신 fallback.
    if (runGit(["status", "--porcelain", "--", targetPath]) !== "") {
      return undefined;
    }

    const committedAt = runGit(["log", "-1", "--format=%cI", "--", targetPath]);

    return committedAt ? new Date(committedAt).toISOString() : undefined;
  } catch {
    return undefined;
  }
}

// git 경로를 못 쓸 때의 2차 방어. 재생성 결과가 직전 산출물과 같으면 이전 스탬프를 유지해
// no-op 재빌드가 lastmod를 흔들지 않게 한다. 단, 산출물이 없는 신규 클론에서는 걸릴 것이 없으므로
// 이 경로에만 기대면 CI에서는 아무 효과가 없다 — 그래서 git 커밋일이 1차다.
async function withStableBuiltAt(next: DocumentData): Promise<DocumentData> {
  let existing: DocumentData;

  try {
    existing = JSON.parse(await fs.readFile(documentDataPath, "utf-8")) as DocumentData;
  } catch {
    return next;
  }

  if (typeof existing?.meta?.builtAt !== "string" || existing.meta.builtAt === "") {
    return next;
  }

  const comparable = (data: DocumentData) =>
    JSON.stringify({ ...data, meta: { ...data.meta, builtAt: "" } });

  return comparable(existing) === comparable(next)
    ? { ...next, meta: { ...next.meta, builtAt: existing.meta.builtAt } }
    : next;
}

async function resolveBuiltAt(next: DocumentData): Promise<DocumentData> {
  const committedAt = gitLastModifiedIso(contentSourceDir);

  return committedAt ? { ...next, meta: { ...next.meta, builtAt: committedAt } } : withStableBuiltAt(next);
}

async function main() {
  const source = await fs.readFile(sourcePath, "utf-8");
  const { documentTitle, chapters } = parseDocument(source);

  const builtChapters: Chapter[] = [];
  const searchEntries: SearchEntry[] = [];

  for (const chapterSource of chapters) {
    const { chapter, entries } = await buildChapter(chapterSource);
    builtChapters.push(chapter);
    searchEntries.push(...entries);
  }

  const documentData: DocumentData = {
    meta: {
      title: documentTitle,
      builtAt: new Date().toISOString(),
      chapterCount: builtChapters.length
    },
    chapters: builtChapters
  };

  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(
    documentDataPath,
    JSON.stringify(await resolveBuiltAt(documentData), null, 2) + "\n",
    "utf-8"
  );
  await fs.writeFile(searchIndexPath, JSON.stringify(searchEntries, null, 2) + "\n", "utf-8");

  console.log(
    `ChaTm generated ${builtChapters.length} chapters and ${searchEntries.length} search entries.`
  );
}

function parseDocument(source: string) {
  const lines = source.split(/\r?\n/);
  const chapterSlugger = new GithubSlugger();

  let documentTitle = DEFAULT_DOCUMENT_TITLE;
  const chapters: ChapterSource[] = [];
  let currentChapterTitle: string | null = null;
  let currentChapterLines: string[] = [];

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match && documentTitle === DEFAULT_DOCUMENT_TITLE) {
      documentTitle = h1Match[1].trim();
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentChapterTitle) {
        chapters.push({
          title: currentChapterTitle,
          slug: chapterSlugger.slug(currentChapterTitle),
          lines: trimLines(currentChapterLines)
        });
      }

      currentChapterTitle = h2Match[1].trim();
      currentChapterLines = [];
      continue;
    }

    if (currentChapterTitle) {
      currentChapterLines.push(line);
    }
  }

  if (currentChapterTitle) {
    chapters.push({
      title: currentChapterTitle,
      slug: chapterSlugger.slug(currentChapterTitle),
      lines: trimLines(currentChapterLines)
    });
  }

  return { documentTitle, chapters };
}

async function buildChapter(chapterSource: ChapterSource) {
  const markdown = chapterSource.lines.join("\n").trim();
  const { tree, flat } = extractHeadings(chapterSource.lines);
  const summary = extractSummary(chapterSource.lines);
  const html = await markdownToHtml(markdown);
  const entries = buildSearchEntries(chapterSource, flat);

  const chapter: Chapter = {
    id: chapterSource.slug,
    slug: chapterSource.slug,
    title: chapterSource.title,
    summary,
    html,
    headings: tree
  };

  return { chapter, entries };
}

function extractHeadings(lines: string[]) {
  const slugger = new GithubSlugger();
  const flat: FlatHeading[] = [];

  lines.forEach((line, lineIndex) => {
    const match = line.match(/^(#{3,5})\s+(.+?)\s*$/);
    if (!match) {
      return;
    }

    const depth = match[1].length;
    const title = cleanHeadingText(match[2]);
    const id = slugger.slug(title);

    flat.push({ id, depth, title, lineIndex });
  });

  const tree: HeadingNode[] = [];
  const stack: HeadingNode[] = [];

  for (const heading of flat) {
    const node: HeadingNode = {
      id: heading.id,
      depth: heading.depth,
      title: heading.title,
      children: []
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return { tree, flat };
}

function buildSearchEntries(chapter: ChapterSource, headings: FlatHeading[]) {
  const entries: SearchEntry[] = [];
  const introLines = headings.length > 0 ? chapter.lines.slice(0, headings[0].lineIndex) : chapter.lines;
  const introText = stripMarkdown(introLines.join("\n"));

  if (introText) {
    entries.push({
      id: `${chapter.slug}::overview`,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      sectionId: "",
      sectionTitle: OVERVIEW_SECTION_TITLE,
      text: introText,
      excerpt: createExcerpt(introText)
    });
  }

  if (headings.length === 0) {
    return entries;
  }

  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index];
    const next = headings[index + 1];
    const sectionLines = chapter.lines.slice(
      current.lineIndex,
      next ? next.lineIndex : chapter.lines.length
    );
    const sectionText = stripMarkdown(sectionLines.join("\n"));

    if (!sectionText) {
      continue;
    }

    entries.push({
      id: `${chapter.slug}::${current.id}`,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      sectionId: current.id,
      sectionTitle: current.title,
      text: sectionText,
      excerpt: createExcerpt(sectionText)
    });
  }

  return entries;
}

function extractSummary(lines: string[]) {
  const firstHeadingIndex = lines.findIndex((line) => /^(#{3,5})\s+/.test(line));
  const summarySource =
    firstHeadingIndex > 0 ? lines.slice(0, firstHeadingIndex) : lines;

  const paragraphs = summarySource
    .join("\n")
    .split(/\n\s*\n/)
    .map((paragraph) => stripMarkdown(paragraph))
    .filter(Boolean);

  return paragraphs[0] ? createExcerpt(paragraphs[0], 220) : undefined;
}

async function markdownToHtml(markdown: string) {
  const file = await markdownProcessor.process(markdown);
  return String(file);
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

function cleanHeadingText(value: string) {
  return stripInlineMarkdown(value.replace(/\s+#+\s*$/, "").trim());
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
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

function createExcerpt(text: string, maxLength = 180) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function rehypeEnhance() {
  return (tree: HastNode) => {
    visit(tree, "element", (node: HastNode, index, parent) => {
      if (node.tagName && /^h[3-5]$/.test(node.tagName)) {
        node.properties = {
          ...node.properties,
          className: mergeClassNames(node.properties?.className, [
            "article-heading",
            `depth-${node.tagName}`
          ])
        };
      }

      if (node.tagName === "blockquote") {
        node.properties = {
          ...node.properties,
          className: mergeClassNames(node.properties?.className, ["callout-quote"])
        };
      }

      if (node.tagName === "a") {
        const href = String(node.properties?.href ?? "");

        if (/^https?:\/\//.test(href)) {
          const host = safeHostname(href);
          const classNames = ["external-link"];

          if (host && isOfficialDomain(host)) {
            classNames.push("official-link");
          }

          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: "noreferrer noopener",
            className: mergeClassNames(node.properties?.className, classNames)
          };
        }
      }

      if (
        node.tagName === "table" &&
        parent &&
        typeof index === "number" &&
        !nodeAlreadyWrapped(parent as HastNode)
      ) {
        const wrapper: HastNode = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["table-scroll"]
          },
          children: [node]
        };

        const parentNode = parent as HastNode;
        const children = parentNode.children ?? [];
        children[index] = wrapper;
        parentNode.children = children;

        return [SKIP, index];
      }

      return undefined;
    });
  };
}

function mergeClassNames(existing: unknown, additions: string[]) {
  const current = Array.isArray(existing)
    ? existing.map(String)
    : typeof existing === "string"
      ? existing.split(/\s+/).filter(Boolean)
      : [];

  const merged = new Set([...current, ...additions]);
  return [...merged];
}

function nodeAlreadyWrapped(parent: HastNode) {
  return (
    parent.tagName === "div" &&
    Array.isArray(parent.properties?.className) &&
    parent.properties.className.map(String).includes("table-scroll")
  );
}

function safeHostname(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isOfficialDomain(hostname: string) {
  return [...officialDomains].some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
