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

type ReportSource = {
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
  value?: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "content", "source");
const generatedRootDir = path.join(rootDir, "generated");

const officialDomains = new Set([
  "wipo.int",
  "gob.mx",
  "impi.gob.mx",
  "gov.br",
  "inpi.gov.br",
  "sic.gov.co",
  "inpi.gob.ar",
  "inapi.cl",
  "indecopi.gob.pe",
  "derechosintelectuales.gob.ec",
  "senadi.gob.ec",
  "digerpi.mici.gob.pa",
  "mici.gob.pa",
  "kipo.go.kr",
  "kipris.or.kr"
]);

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeEnhance)
  .use(rehypeStringify);

async function main() {
  await fs.rm(generatedRootDir, { force: true, recursive: true });
  await fs.mkdir(generatedRootDir, { recursive: true });

  const sourceEntries = await fs.readdir(sourceDir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  });
  const markdownFiles = sourceEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

  if (markdownFiles.length === 0) {
    console.log(`No report sources found in ${sourceDir}.`);
    return;
  }

  let reportCount = 0;
  let searchEntryCount = 0;

  for (const fileEntry of markdownFiles) {
    const slug = fileEntry.name.replace(/\.md$/, "");
    const source = await fs.readFile(path.join(sourceDir, fileEntry.name), "utf-8");
    const reportSource = parseDocument(source, slug);
    const { chapter, entries } = await buildReport(reportSource);
    const targetDir = path.join(generatedRootDir, slug);
    const documentDataPath = path.join(targetDir, "document-data.json");
    const searchIndexPath = path.join(targetDir, "search-index.json");

    const documentData: DocumentData = {
      meta: {
        title: reportSource.title,
        builtAt: new Date().toISOString(),
        chapterCount: 1
      },
      chapters: [chapter]
    };

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(documentDataPath, JSON.stringify(documentData, null, 2) + "\n", "utf-8");
    await fs.writeFile(searchIndexPath, JSON.stringify(entries, null, 2) + "\n", "utf-8");

    reportCount += 1;
    searchEntryCount += entries.length;
  }

  console.log(`Generated ${reportCount} reports and ${searchEntryCount} search entries.`);
}

function parseDocument(source: string, fallbackSlug: string): ReportSource {
  const lines = source.split(/\r?\n/);

  let documentTitle = fallbackSlug;
  let sawH1 = false;
  const documentLines: string[] = [];

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);

    if (h1Match && !sawH1) {
      documentTitle = h1Match[1].trim();
      sawH1 = true;
      continue;
    }

    if (/^##\s+/.test(line)) {
      throw new Error(`Report ${fallbackSlug} must not contain H2 headings. Use H3-H5 only.`);
    }

    documentLines.push(line);
  }

  if (!sawH1) {
    throw new Error(`Report ${fallbackSlug} is missing a top-level H1 title.`);
  }

  return {
    title: documentTitle,
    slug: fallbackSlug,
    lines: trimLines(documentLines)
  };
}

async function buildReport(reportSource: ReportSource) {
  const markdown = reportSource.lines.join("\n").trim();

  if (!markdown) {
    throw new Error(`Report ${reportSource.slug} has no body content.`);
  }

  const { tree, flat } = extractHeadings(reportSource.lines);
  const summary = extractSummary(reportSource.lines);
  const html = await markdownToHtml(markdown);
  const entries = buildSearchEntries(reportSource, flat);

  const chapter: Chapter = {
    id: reportSource.slug,
    slug: reportSource.slug,
    title: reportSource.title,
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

function buildSearchEntries(report: ReportSource, headings: FlatHeading[]) {
  const entries: SearchEntry[] = [];
  const introLines = headings.length > 0 ? report.lines.slice(0, headings[0].lineIndex) : report.lines;
  const introText = stripMarkdown(introLines.join("\n"));

  if (introText) {
    entries.push({
      id: `${report.slug}::overview`,
      chapterSlug: report.slug,
      chapterTitle: report.title,
      sectionId: "",
      sectionTitle: "도입",
      text: introText,
      excerpt: createExcerpt(introText)
    });
  }

  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index];
    const next = headings[index + 1];
    const sectionLines = report.lines.slice(
      current.lineIndex,
      next ? next.lineIndex : report.lines.length
    );
    const sectionText = stripMarkdown(sectionLines.join("\n"));

    if (!sectionText) {
      continue;
    }

    entries.push({
      id: `${report.slug}::${current.id}`,
      chapterSlug: report.slug,
      chapterTitle: report.title,
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
  const summarySource = firstHeadingIndex > 0 ? lines.slice(0, firstHeadingIndex) : lines;
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
        node.tagName === "table"
        && parent
        && typeof index === "number"
        && !nodeAlreadyWrapped(parent as HastNode)
      ) {
        const wrapper = createTableWrapper(node);
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

function createTableWrapper(tableNode: HastNode) {
  const variant = getWideTableVariant(tableNode);
  const fitModifier = getTableFitModifier(tableNode);

  if (!variant) {
    return createTableViewport(tableNode, getTableWrapperClassNames(tableNode));
  }

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: [
        "table-shell",
        `table-shell--${variant}`,
        ...(fitModifier ? [`table-shell--${fitModifier}`] : [])
      ],
      "data-table-scroll-root": "",
      "data-has-overflow": "false",
      "data-can-scroll-left": "false",
      "data-can-scroll-right": "false"
    },
    children: [
      createTableScrollButton("left"),
      createTableViewport(tableNode, getTableWrapperClassNames(tableNode), {
        "data-table-scroll-viewport": ""
      }),
      createTableScrollButton("right")
    ]
  } satisfies HastNode;
}

function createTableViewport(
  tableNode: HastNode,
  className: string[],
  properties: Record<string, unknown> = {}
) {
  return {
    type: "element",
    tagName: "div",
    properties: {
      ...properties,
      className
    },
    children: [tableNode]
  } satisfies HastNode;
}

function createTableScrollButton(direction: "left" | "right") {
  return {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      className: ["table-scroll-button", `table-scroll-button--${direction}`],
      "data-table-scroll-button": direction,
      "aria-label": direction === "left" ? "표를 왼쪽으로 스크롤" : "표를 오른쪽으로 스크롤",
      disabled: true
    },
    children: [
      {
        type: "text",
        value: direction === "left" ? "←" : "→"
      }
    ]
  } satisfies HastNode;
}

function getTableWrapperClassNames(tableNode: HastNode) {
  const classNames = ["table-scroll"];
  const variant = getWideTableVariant(tableNode);
  const fitModifier = getTableFitModifier(tableNode);

  if (variant) {
    classNames.push(`table-scroll--${variant}`);
  }

  if (fitModifier) {
    classNames.push(`table-scroll--${fitModifier}`);
  }

  return classNames;
}

function getTableFitModifier(tableNode: HastNode) {
  return getTableColumnCount(tableNode) === 9 ? "fit-9" : null;
}

function getWideTableVariant(tableNode: HastNode) {
  const columnCount = getTableColumnCount(tableNode);

  if (columnCount >= 12) {
    return "xwide";
  }

  if (columnCount >= 8) {
    return "wide";
  }

  return null;
}

function getTableColumnCount(tableNode: HastNode) {
  const firstRow = findFirstTableRow(tableNode);

  if (!firstRow?.children) {
    return 0;
  }

  return firstRow.children.filter((child) => child.tagName === "th" || child.tagName === "td").length;
}

function findFirstTableRow(node: HastNode): HastNode | undefined {
  if (node.tagName === "tr") {
    return node;
  }

  for (const child of node.children ?? []) {
    const row = findFirstTableRow(child);

    if (row) {
      return row;
    }
  }

  return undefined;
}

function nodeAlreadyWrapped(parent: HastNode) {
  return (
    parent.tagName === "div"
    && Array.isArray(parent.properties?.className)
    && parent.properties.className.map(String).includes("table-scroll")
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
