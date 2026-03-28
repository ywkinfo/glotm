import type { Chapter } from "../../../shared/types/content";

type MarkdownArticleProps = {
  chapter: Chapter;
};

export function MarkdownArticle({ chapter }: MarkdownArticleProps) {
  return (
    <article
      className="article"
      dangerouslySetInnerHTML={{ __html: chapter.html }}
    />
  );
}
