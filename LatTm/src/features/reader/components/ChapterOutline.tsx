import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { HeadingNode } from "../../../shared/types/content";

type OutlineItem = {
  id: string;
  title: string;
  level: number;
};

type ChapterOutlineProps = {
  chapterSlug: string;
  headings: HeadingNode[];
  activeSectionId?: string;
};

export function flattenOutlineHeadings(
  headings: HeadingNode[],
  level = 0
): OutlineItem[] {
  const items: OutlineItem[] = [];

  for (const heading of headings) {
    items.push({
      id: heading.id,
      title: heading.title,
      level
    });
    items.push(...flattenOutlineHeadings(heading.children, level + 1));
  }

  return items;
}

export function ChapterOutline({
  chapterSlug,
  headings,
  activeSectionId
}: ChapterOutlineProps) {
  const items = flattenOutlineHeadings(headings);
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return !window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setIsExpanded(!window.matchMedia("(max-width: 640px)").matches);
  }, [chapterSlug]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="chapter-outline" aria-labelledby="chapter-outline-title">
      <div className="chapter-outline-header">
        <div>
          <p className="chapter-outline-kicker">Quick Jump</p>
          <h2 id="chapter-outline-title" className="chapter-outline-title">
            이 장의 섹션 목차
          </h2>
        </div>
        <div className="chapter-outline-actions">
          <p className="chapter-outline-meta">총 {items.length}개 섹션</p>
          <button
            className="chapter-outline-toggle"
            type="button"
            aria-expanded={isExpanded}
            aria-controls="chapter-outline-list"
            onClick={() => {
              setIsExpanded((expanded) => !expanded);
            }}
          >
            {isExpanded ? "목차 접기" : "목차 펼치기"}
          </button>
        </div>
      </div>

      <div
        id="chapter-outline-list"
        className={isExpanded ? "chapter-outline-list" : "chapter-outline-list collapsed"}
      >
        {items.map((item) => {
          const isActive = item.id === activeSectionId;

          return (
            <Link
              key={item.id}
              to={{
                pathname: `/chapter/${chapterSlug}`,
                hash: `#${item.id}`
              }}
              className={isActive ? "chapter-outline-link active" : "chapter-outline-link"}
              aria-current={isActive ? "location" : undefined}
              style={{ paddingInlineStart: `${1 + item.level}rem` }}
            >
              <span className="chapter-outline-link-title">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
