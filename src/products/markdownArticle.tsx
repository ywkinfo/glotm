import {
  memo,
  useCallback,
  useEffect,
  useRef,
  type Ref
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  type Chapter,
  buildProductPath,
  isSafeExternalHref,
  normalizeAppHref
} from "./shared";
import { liveShellProducts } from "./registry";

type MarkdownArticleProps = {
  chapter: Chapter;
  articleRef?: Ref<HTMLElement>;
};

type TableScrollDirection = "left" | "right";

type TableScrollElements = {
  root: HTMLElement;
  viewport: HTMLElement;
  leftButton: HTMLButtonElement | null;
  rightButton: HTMLButtonElement | null;
};

const TABLE_SCROLL_STEP_RATIO = 0.72;
const TABLE_SCROLL_STEP_MIN_PX = 240;
const TABLE_SCROLL_EPSILON = 2;

function isOwnedAppHref(href: string) {
  if (href.startsWith("#")) {
    return true;
  }

  const [pathname] = href.split(/[?#]/, 1);

  if (!pathname) {
    return false;
  }

  if (pathname === buildProductPath("/")) {
    return true;
  }

  return liveShellProducts.some((product) => {
    const productPath = buildProductPath(product);

    return pathname === productPath || pathname.startsWith(`${productPath}/`);
  });
}

function mergeArticleRefs(
  articleRef: Ref<HTMLElement> | undefined,
  node: HTMLElement | null
) {
  if (!articleRef) {
    return;
  }

  if (typeof articleRef === "function") {
    articleRef(node);
    return;
  }

  (articleRef as { current: HTMLElement | null }).current = node;
}

function getTableScrollElements(root: HTMLElement): TableScrollElements | null {
  const viewport = root.querySelector<HTMLElement>("[data-table-scroll-viewport]");

  if (!viewport) {
    return null;
  }

  return {
    root,
    viewport,
    leftButton: root.querySelector<HTMLButtonElement>('[data-table-scroll-button="left"]'),
    rightButton: root.querySelector<HTMLButtonElement>('[data-table-scroll-button="right"]')
  };
}

function getTableScrollStep(viewport: HTMLElement) {
  return Math.max(TABLE_SCROLL_STEP_MIN_PX, viewport.clientWidth * TABLE_SCROLL_STEP_RATIO);
}

function syncTableScrollState({ root, viewport, leftButton, rightButton }: TableScrollElements) {
  const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
  const hasOverflow = maxScrollLeft > TABLE_SCROLL_EPSILON;
  const canScrollLeft = hasOverflow && viewport.scrollLeft > TABLE_SCROLL_EPSILON;
  const canScrollRight = hasOverflow && viewport.scrollLeft < maxScrollLeft - TABLE_SCROLL_EPSILON;

  root.dataset.hasOverflow = String(hasOverflow);
  root.dataset.canScrollLeft = String(canScrollLeft);
  root.dataset.canScrollRight = String(canScrollRight);

  if (leftButton) {
    leftButton.disabled = !canScrollLeft;
  }

  if (rightButton) {
    rightButton.disabled = !canScrollRight;
  }
}

function scrollWideTable(root: HTMLElement, direction: TableScrollDirection) {
  const elements = getTableScrollElements(root);

  if (!elements) {
    return;
  }

  const offset = getTableScrollStep(elements.viewport);

  elements.viewport.scrollBy({
    left: direction === "left" ? -offset : offset,
    behavior: "smooth"
  });
}

export const MarkdownArticle = memo(function MarkdownArticle({ chapter, articleRef }: MarkdownArticleProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const articleElementRef = useRef<HTMLElement | null>(null);
  const handleArticleRef = useCallback((node: HTMLElement | null) => {
    articleElementRef.current = node;
    mergeArticleRefs(articleRef, node);
  }, [articleRef]);

  useEffect(() => {
    const articleElement = articleElementRef.current;

    if (!articleElement || typeof window === "undefined") {
      return;
    }

    for (const anchor of articleElement.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const rawHref = anchor.getAttribute("href")?.trim();

      if (!rawHref) {
        continue;
      }

      const normalizedHref = normalizeAppHref(rawHref, {
        baseUrl: import.meta.env.BASE_URL ?? "/",
        currentOrigin: window.location.origin,
        currentPathname: `${location.pathname}${location.search}`
      });

      if (normalizedHref && isOwnedAppHref(normalizedHref)) {
        anchor.setAttribute("href", normalizedHref);
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
        continue;
      }

      if (isSafeExternalHref(rawHref)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noreferrer noopener");
        continue;
      }

      if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(rawHref) && !/^mailto:|^tel:/i.test(rawHref)) {
        anchor.removeAttribute("href");
      }
    }
  }, [chapter.html, location.pathname, location.search]);

  useEffect(() => {
    const articleElement = articleElementRef.current;

    if (!articleElement || typeof window === "undefined") {
      return;
    }

    const roots = Array.from(
      articleElement.querySelectorAll<HTMLElement>("[data-table-scroll-root]")
    );

    if (roots.length === 0) {
      return;
    }

    const cleanups: Array<() => void> = [];
    const syncCallbacks: Array<() => void> = [];
    const resizeTargets = new Map<Element, () => void>();
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver((entries) => {
        const scheduled = new Set<() => void>();

        for (const entry of entries) {
          const sync = resizeTargets.get(entry.target);

          if (sync && !scheduled.has(sync)) {
            scheduled.add(sync);
            sync();
          }
        }
      })
      : null;

    for (const root of roots) {
      const elements = getTableScrollElements(root);

      if (!elements) {
        continue;
      }

      const sync = () => {
        syncTableScrollState(elements);
      };

      syncCallbacks.push(sync);
      sync();

      const handleScroll = () => {
        sync();
      };

      elements.viewport.addEventListener("scroll", handleScroll, { passive: true });
      cleanups.push(() => {
        elements.viewport.removeEventListener("scroll", handleScroll);
      });

      if (resizeObserver) {
        resizeTargets.set(elements.viewport, sync);
        resizeObserver.observe(elements.viewport);

        const table = elements.viewport.querySelector("table");

        if (table) {
          resizeTargets.set(table, sync);
          resizeObserver.observe(table);
        }
      }
    }

    if (resizeObserver) {
      cleanups.push(() => {
        resizeObserver.disconnect();
      });
    } else {
      const handleResize = () => {
        syncCallbacks.forEach((sync) => {
          sync();
        });
      };

      window.addEventListener("resize", handleResize);
      cleanups.push(() => {
        window.removeEventListener("resize", handleResize);
      });
    }

    return () => {
      cleanups.forEach((cleanup) => {
        cleanup();
      });
    };
  }, [chapter.html]);

  return (
    <article
      ref={handleArticleRef}
      className="article"
      onClick={(event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
          return;
        }

        const scrollButton = target.closest("[data-table-scroll-button]");

        if (scrollButton instanceof HTMLButtonElement) {
          const direction = scrollButton.dataset.tableScrollButton;
          const root = scrollButton.closest("[data-table-scroll-root]");

          if (
            (direction === "left" || direction === "right")
            && root instanceof HTMLElement
          ) {
            event.preventDefault();
            scrollWideTable(root, direction);
          }

          return;
        }

        const anchor = target.closest("a[href]");

        if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") {
          return;
        }

        if (
          event.metaKey
          || event.ctrlKey
          || event.shiftKey
          || event.altKey
          || anchor.hasAttribute("download")
        ) {
          return;
        }

        const rawHref = anchor.getAttribute("href");

        if (!rawHref) {
          return;
        }

        const normalizedHref = normalizeAppHref(rawHref, {
          baseUrl: import.meta.env.BASE_URL ?? "/",
          currentOrigin: window.location.origin,
          currentPathname: `${location.pathname}${location.search}`
        });

        if (!normalizedHref || !isOwnedAppHref(normalizedHref)) {
          return;
        }

        event.preventDefault();

        if (normalizedHref.startsWith("#")) {
          navigate({
            pathname: location.pathname,
            search: location.search,
            hash: normalizedHref
          });
          return;
        }

        navigate(normalizedHref);
      }}
      dangerouslySetInnerHTML={{ __html: chapter.html }}
    />
  );
});
