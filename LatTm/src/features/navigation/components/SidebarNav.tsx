import { Link, NavLink } from "react-router-dom";

import { flattenOutlineHeadings } from "../../reader/components/ChapterOutline";
import type { Chapter } from "../../../shared/types/content";

type SidebarNavProps = {
  chapters: Chapter[];
  currentChapterSlug?: string;
  currentSectionId?: string;
  onNavigate?: () => void;
};

export function SidebarNav({
  chapters,
  currentChapterSlug,
  currentSectionId,
  onNavigate
}: SidebarNavProps) {
  return (
    <nav className="sidebar-nav" aria-label="전체 문서 목차">
      <div className="sidebar-eyebrow">문서 구조</div>
      <ul className="sidebar-list">
        {chapters.map((chapter) => {
          const isActive = chapter.slug === currentChapterSlug;
          const sectionItems = isActive ? flattenOutlineHeadings(chapter.headings) : [];

          return (
            <li key={chapter.slug} className="sidebar-item">
              <NavLink
                to={`/chapter/${chapter.slug}`}
                className={({ isActive: routeActive }) =>
                  routeActive || isActive ? "sidebar-link active" : "sidebar-link"
                }
                onClick={onNavigate}
              >
                {chapter.title}
              </NavLink>
              {isActive && sectionItems.length > 0 ? (
                <ul className="sidebar-section-list" aria-label={`${chapter.title} 섹션 목차`}>
                  {sectionItems.map((section) => {
                    const isCurrentSection = section.id === currentSectionId;

                    return (
                      <li key={section.id}>
                        <Link
                          to={{
                            pathname: `/chapter/${chapter.slug}`,
                            hash: `#${section.id}`
                          }}
                          className={
                            isCurrentSection
                              ? "sidebar-section-link active"
                              : "sidebar-section-link"
                          }
                          onClick={onNavigate}
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
