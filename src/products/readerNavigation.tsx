import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  type Chapter,
  type HeadingNode,
  buildChapterPath,
  buildSectionLocation
} from "./shared";

type SidebarNavProps = {
  chapters: Chapter[];
  basePath: string;
  currentChapterSlug?: string;
  currentSectionId?: string;
  onClose?: () => void;
  onSectionJump?: (sectionId: string) => void;
  onNavigate?: () => void;
  showSections?: boolean;
};

type ChapterOutlineProps = {
  basePath: string;
  chapterSlug: string;
  headings: HeadingNode[];
  activeSectionId?: string;
  onSectionJump?: (sectionId: string) => void;
};

type OutlineItem = {
  id: string;
  title: string;
  level: number;
};

function isSmallViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  const mobileViewportQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 640px)")
      : undefined;

  return mobileViewportQuery?.matches ?? false;
}

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

export function SidebarNav({
  chapters,
  basePath,
  currentChapterSlug,
  currentSectionId,
  onClose,
  onSectionJump,
  onNavigate,
  showSections = true
}: SidebarNavProps) {
  return (
    <nav className="sidebar-nav" aria-label="전체 문서 목차">
      {onClose ? (
        <button
          className="topbar-button mobile-only sidebar-close-button"
          type="button"
          onClick={onClose}
        >
          패널 닫기
        </button>
      ) : null}
      <div className="sidebar-eyebrow">문서 구조</div>
      <ul className="sidebar-list">
        {chapters.map((chapter) => {
          const isActive = chapter.slug === currentChapterSlug;
          const sectionItems = isActive && showSections
            ? flattenOutlineHeadings(chapter.headings)
            : [];

          return (
            <li key={chapter.slug} className="sidebar-item">
              <NavLink
                to={buildChapterPath(basePath, chapter.slug)}
                className={({ isActive: routeActive }) =>
                  routeActive || isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={onNavigate}
              >
                {chapter.title}
              </NavLink>
              {sectionItems.length > 0 ? (
                <ul className="sidebar-section-list" aria-label={`${chapter.title} 섹션 목차`}>
                  {sectionItems.map((section) => {
                    const isCurrentSection = section.id === currentSectionId;

                    return (
                      <li key={section.id}>
                        <Link
                          to={buildSectionLocation(basePath, chapter.slug, section.id)}
                          className={
                            isCurrentSection
                              ? "sidebar-section-link active"
                              : "sidebar-section-link"
                          }
                          onClick={(event) => {
                            if (onSectionJump) {
                              event.preventDefault();
                              onSectionJump(section.id);
                            }
                            onNavigate?.();
                          }}
                          style={{ paddingInlineStart: `${0.85 + section.level * 0.85}rem` }}
                          aria-current={isCurrentSection ? "location" : undefined}
                        >
                          {section.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ChapterOutline({
  basePath,
  chapterSlug,
  headings,
  activeSectionId,
  onSectionJump
}: ChapterOutlineProps) {
  const items = flattenOutlineHeadings(headings);
  const [isExpanded, setIsExpanded] = useState(() => !isSmallViewport());

  useEffect(() => {
    setIsExpanded(!isSmallViewport());
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
              to={buildSectionLocation(basePath, chapterSlug, item.id)}
              className={isActive ? "chapter-outline-link active" : "chapter-outline-link"}
              aria-current={isActive ? "location" : undefined}
              style={{ paddingInlineStart: `${1 + item.level}rem` }}
              onClick={() => {
                onSectionJump?.(item.id);
              }}
            >
              <span className="chapter-outline-link-title">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
