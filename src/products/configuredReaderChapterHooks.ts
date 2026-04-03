import { useEffect, useRef, useState, type RefObject } from "react";

import {
  getTrackedSectionId,
  type Chapter,
  type ReadingBookmark
} from "./shared";

type OutlineItem = {
  id: string;
  title: string;
};

type UseTrackedActiveSectionOptions = {
  chapter?: Chapter;
  firstOutlineId?: string;
  hasLocationHash: boolean;
  initialSectionId?: string;
  isProgrammaticScrollActive: boolean;
  outlineItems: OutlineItem[];
  outlineSignature: string;
  syncCurrentSectionId: (sectionId?: string) => void;
};

type UseReadingProgressOptions = {
  articleRef: RefObject<HTMLElement | null>;
  chapter?: Chapter;
};

type UseChapterBookmarkOptions = {
  activeSectionId?: string;
  activeSectionTitle?: string;
  chapter?: Chapter;
  commitReadingBookmark: (bookmark: ReadingBookmark) => void;
  progressBucket: number;
};

export function useTrackedActiveSection({
  chapter,
  firstOutlineId,
  hasLocationHash,
  initialSectionId,
  isProgrammaticScrollActive,
  outlineItems,
  outlineSignature,
  syncCurrentSectionId
}: UseTrackedActiveSectionOptions) {
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(initialSectionId);

  useEffect(() => {
    if (!chapter) {
      setActiveSectionId(undefined);
      return;
    }

    if (initialSectionId) {
      setActiveSectionId(initialSectionId);
      return;
    }

    setActiveSectionId(firstOutlineId);
  }, [chapter, firstOutlineId, initialSectionId]);

  useEffect(() => {
    if (!chapter || hasLocationHash) {
      return undefined;
    }

    let frameId = 0;
    let timeoutId = 0;

    const collectTargets = () =>
      outlineItems
        .map((item) => document.getElementById(item.id))
        .filter((element): element is HTMLElement => Boolean(element));

    const updateActiveSection = () => {
      if (isProgrammaticScrollActive) {
        return;
      }

      const targets = collectTargets();

      if (targets.length === 0) {
        return;
      }

      const nextActiveSectionId = getTrackedSectionId(targets);

      if (nextActiveSectionId) {
        setActiveSectionId((currentSectionId) =>
          currentSectionId === nextActiveSectionId ? currentSectionId : nextActiveSectionId
        );
      }
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateActiveSection, 120);
    };

    updateActiveSection();
    timeoutId = window.setTimeout(updateActiveSection, 180);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [chapter, hasLocationHash, isProgrammaticScrollActive, outlineItems, outlineSignature]);

  useEffect(() => {
    syncCurrentSectionId(activeSectionId);
  }, [activeSectionId, syncCurrentSectionId]);

  return [activeSectionId, setActiveSectionId] as const;
}

export function useReadingProgress({ articleRef, chapter }: UseReadingProgressOptions) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!chapter) {
      setReadingProgress(0);
      return undefined;
    }

    let frameId = 0;

    const updateProgress = () => {
      const articleElement = articleRef.current;

      if (!articleElement) {
        setReadingProgress(0);
        return;
      }

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const maxScrollableDistance = Math.max(articleHeight - viewportHeight * 0.45, 1);
      const nextProgress =
        ((scrollTop - articleTop + viewportHeight * 0.22) / maxScrollableDistance) * 100;

      setReadingProgress(Math.max(0, Math.min(100, nextProgress)));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [articleRef, chapter]);

  return readingProgress;
}

export function useChapterBookmark({
  activeSectionId,
  activeSectionTitle,
  chapter,
  commitReadingBookmark,
  progressBucket
}: UseChapterBookmarkOptions) {
  const lastBookmarkSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!chapter) {
      return;
    }

    const bookmarkSignature = [
      chapter.slug,
      activeSectionId ?? "",
      activeSectionTitle ?? "",
      String(progressBucket)
    ].join("|");

    if (lastBookmarkSignatureRef.current === bookmarkSignature) {
      return;
    }

    lastBookmarkSignatureRef.current = bookmarkSignature;

    commitReadingBookmark({
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
      sectionId: activeSectionId,
      sectionTitle: activeSectionTitle,
      progress: Math.max(0, Math.min(100, progressBucket)),
      updatedAt: new Date().toISOString()
    });
  }, [activeSectionId, activeSectionTitle, chapter, commitReadingBookmark, progressBucket]);
}
