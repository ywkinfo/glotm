import type { Ref } from "react";

import type { Chapter } from "../../../shared/types/content";

type MarkdownArticleProps = {
  chapter: Chapter;
  articleRef?: Ref<HTMLElement>;
};

export function MarkdownArticle({ chapter, articleRef }: MarkdownArticleProps) {
  return (
    <article
      ref={articleRef}
      className="article"
      dangerouslySetInnerHTML={{ __html: chapter.html }}
    />
  );
}
