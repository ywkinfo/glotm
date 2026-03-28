import introMarkdown from "../../glotm-intro-chapter-v2.md?raw";

type IntroSubsection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type IntroSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
  subsections: IntroSubsection[];
};

export type IntroDocument = {
  title: string;
  quote: string[];
  sections: IntroSection[];
};

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseIntroDocument(raw: string): IntroDocument {
  const lines = raw.split(/\r?\n/);
  const sections: IntroSection[] = [];
  const quote: string[] = [];
  let title = "GloTm";
  let currentSection: IntroSection | undefined;
  let currentSubsection: IntroSubsection | undefined;
  let paragraphBuffer = "";
  let activeBulletList: string[] | undefined;
  let activeBulletIndex = -1;

  const pushParagraph = () => {
    if (!paragraphBuffer) {
      return;
    }

    if (currentSubsection) {
      currentSubsection.paragraphs.push(paragraphBuffer);
    } else if (currentSection) {
      currentSection.paragraphs.push(paragraphBuffer);
    }

    paragraphBuffer = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed === "---") {
      pushParagraph();
      activeBulletList = undefined;
      activeBulletIndex = -1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      title = cleanInlineMarkdown(trimmed.slice(2));
      continue;
    }

    if (trimmed.startsWith(">")) {
      pushParagraph();
      quote.push(cleanInlineMarkdown(trimmed.replace(/^>\s?/, "")));
      activeBulletList = undefined;
      activeBulletIndex = -1;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      pushParagraph();
      currentSubsection = {
        title: cleanInlineMarkdown(trimmed.slice(4)),
        paragraphs: [],
        bullets: []
      };
      currentSection?.subsections.push(currentSubsection);
      activeBulletList = undefined;
      activeBulletIndex = -1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      pushParagraph();
      currentSection = {
        title: cleanInlineMarkdown(trimmed.slice(3)),
        paragraphs: [],
        bullets: [],
        subsections: []
      };
      sections.push(currentSection);
      currentSubsection = undefined;
      activeBulletList = undefined;
      activeBulletIndex = -1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      pushParagraph();
      const bulletTarget = currentSubsection?.bullets ?? currentSection?.bullets;

      if (bulletTarget) {
        bulletTarget.push(cleanInlineMarkdown(trimmed.slice(2)));
        activeBulletList = bulletTarget;
        activeBulletIndex = bulletTarget.length - 1;
      }

      continue;
    }

    if ((line.startsWith("  ") || line.startsWith("\t")) && activeBulletList && activeBulletIndex >= 0) {
      const previous = activeBulletList[activeBulletIndex];

      if (previous) {
        activeBulletList[activeBulletIndex] = `${previous} ${cleanInlineMarkdown(trimmed)}`.trim();
      }

      continue;
    }

    activeBulletList = undefined;
    activeBulletIndex = -1;
    paragraphBuffer = paragraphBuffer
      ? `${paragraphBuffer} ${cleanInlineMarkdown(trimmed)}`
      : cleanInlineMarkdown(trimmed);
  }

  pushParagraph();

  return {
    title,
    quote,
    sections
  };
}

export const introDocument = parseIntroDocument(introMarkdown);

export function getIntroSection(title: string) {
  return introDocument.sections.find((section) => section.title === title);
}
