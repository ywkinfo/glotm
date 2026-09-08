import { useEffect, useRef, useState } from "react";

import {
  buildSectionLocation,
  getRouterBasePath,
  getTrackedSectionId
} from "./shared";

export {
  ChapterOutline,
  flattenOutlineHeadings,
  SidebarNav
} from "./readerNavigation";
export { SearchPanel } from "./searchPanel";
export { MarkdownArticle } from "./markdownArticle";

type ReaderActionBarProps = {
  activeSectionTitle?: string;
  onDismiss: () => void;
  onScrollToTop: () => void;
  visible: boolean;
};

type ReaderChapterToolsProps = {
  chapterSlug: string;
  outlineIds: string[];
  productPath: string;
};

type CopyState =
  | { kind: "idle" }
  | { kind: "copied"; sectionLabel: string }
  | { kind: "manual"; url: string };

type StatusPageProps = {
  kicker: string;
  title: string;
  message: string;
};

export function StatusPage({ kicker, title, message }: StatusPageProps) {
  return (
    <div className="status-page">
      <section className="status-card">
        <p className="gateway-kicker">{kicker}</p>
        <h1 className="status-title">{title}</h1>
        <p className="status-message">{message}</p>
      </section>
    </div>
  );
}

export function ReaderActionBar({
  activeSectionTitle,
  onDismiss,
  onScrollToTop,
  visible
}: ReaderActionBarProps) {
  if (!visible) {
    return null;
  }

  const sectionLabel = activeSectionTitle ? `현재 섹션: ${activeSectionTitle}` : undefined;

  return (
    <aside className="reader-action-bar" aria-label="읽기 도구">
      <button
        className="reader-action-button"
        type="button"
        title={sectionLabel}
        onClick={onScrollToTop}
      >
        맨 위로
      </button>
      <button
        className="reader-action-dismiss"
        type="button"
        aria-label="맨 위로 버튼 숨기기"
        onClick={onDismiss}
      >
        x
      </button>
    </aside>
  );
}

// 지금 읽고 있는 섹션을 기하로 정한다.
//
// `location.href`도 `activeSectionId`도 쓸 수 없다. hash로 진입하면 섹션 추적이 통째로 꺼져
// (`configuredReaderChapterHooks.ts`) 둘 다 진입 시점 값에 머무르기 때문이다.
// `getTrackedSectionId`는 순수 기하 함수라 언제든 그대로 호출할 수 있다.
export function resolveCurrentSectionId(outlineIds: string[]) {
  const targets = outlineIds
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => Boolean(element));

  return targets.length > 0 ? getTrackedSectionId(targets) : undefined;
}

// 섹션을 특정할 수 없으면 장 링크로 대체한다(빈 hash를 붙이지 않는다).
// `basePath` 기본값이 `getRouterBasePath()`라 `/glotm/` 같은 배포 경로가 절대 URL에 보존된다
// (인자는 테스트에서 배포 경로를 명시하기 위한 seam이다).
export function buildSectionUrl(
  productPath: string,
  chapterSlug: string,
  sectionId: string | undefined,
  basePath = getRouterBasePath()
) {
  const sectionLocation = buildSectionLocation(productPath, chapterSlug, sectionId);

  return `${window.location.origin}${basePath}${sectionLocation.pathname}${sectionLocation.hash}`;
}

export function buildCurrentSectionUrl(
  productPath: string,
  chapterSlug: string,
  outlineIds: string[],
  basePath = getRouterBasePath()
) {
  const sectionId = resolveCurrentSectionId(outlineIds);

  return {
    sectionId,
    url: buildSectionUrl(productPath, chapterSlug, sectionId, basePath)
  };
}

// 장 헤더에 늘 붙어 있는 도구.
//
// 기존 `ReaderActionBar`는 `readingProgress >= 20`일 때만 보이므로, 처음부터 인쇄하거나 링크를
// 넘기려는 사용자는 기능을 찾지 못한다. 그래서 '맨 위로' 바의 노출 조건과 분리했다.
//
// 위치는 스크롤 중에 **계속** 샘플링해 둔다. 클릭 시점에만 재면 안 되는 이유가 있다: 도구가
// 장 헤더에 있으므로 사용자가 본문을 읽다가 이 버튼을 쓰려면 위로 올라와야 하고, 브라우저가
// 버튼으로 스크롤을 옮긴 뒤 재면 "지금 읽던 섹션"이 아니라 장 첫 섹션이 잡힌다.
export function ReaderChapterTools({
  chapterSlug,
  outlineIds,
  productPath
}: ReaderChapterToolsProps) {
  const [copyState, setCopyState] = useState<CopyState>({ kind: "idle" });
  const manualInputRef = useRef<HTMLInputElement | null>(null);
  const trackedSectionIdRef = useRef<string | undefined>(undefined);
  const outlineSignature = outlineIds.join("|");

  useEffect(() => {
    setCopyState({ kind: "idle" });
    trackedSectionIdRef.current = undefined;
  }, [chapterSlug]);

  useEffect(() => {
    if (copyState.kind === "manual") {
      manualInputRef.current?.select();
    }
  }, [copyState]);

  useEffect(() => {
    const ids = outlineSignature ? outlineSignature.split("|") : [];

    if (typeof window === "undefined" || ids.length === 0) {
      return undefined;
    }

    let frameId = 0;

    const sampleCurrentSection = () => {
      const sectionId = resolveCurrentSectionId(ids);

      if (sectionId) {
        trackedSectionIdRef.current = sectionId;
      }
    };

    const scheduleSample = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(sampleCurrentSection);
    };

    sampleCurrentSection();
    window.addEventListener("scroll", scheduleSample, { passive: true });
    window.addEventListener("resize", scheduleSample);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleSample);
      window.removeEventListener("resize", scheduleSample);
    };
  }, [outlineSignature]);

  const handleCopyLink = async () => {
    const sectionId = trackedSectionIdRef.current ?? resolveCurrentSectionId(outlineIds);
    const url = buildSectionUrl(productPath, chapterSlug, sectionId);
    const sectionLabel = sectionId
      ? document.getElementById(sectionId)?.textContent?.trim() || "현재 섹션"
      : "이 장";

    // 클립보드 권한 거부·비보안 컨텍스트에서도 막다른 길로 끝내지 않는다.
    try {
      if (!window.isSecureContext || !navigator.clipboard?.writeText) {
        throw new Error("clipboard unavailable");
      }

      await navigator.clipboard.writeText(url);
      setCopyState({ kind: "copied", sectionLabel });
    } catch {
      setCopyState({ kind: "manual", url });
    }
  };

  return (
    <div className="reader-chapter-tools" data-reader-chapter-tools="">
      <button
        className="reader-chapter-tool"
        type="button"
        onClick={() => {
          void handleCopyLink();
        }}
      >
        이 위치 링크 복사
      </button>
      <button
        className="reader-chapter-tool"
        type="button"
        onClick={() => {
          window.print();
        }}
      >
        인쇄
      </button>
      <p className="reader-chapter-tools-status" role="status">
        {copyState.kind === "copied" ? `${copyState.sectionLabel} 링크를 복사했습니다.` : null}
        {copyState.kind === "manual" ? "복사 권한이 없어 주소를 직접 복사해 주세요." : null}
      </p>
      {copyState.kind === "manual" ? (
        <input
          ref={manualInputRef}
          className="reader-chapter-tools-manual"
          type="text"
          readOnly
          aria-label="복사할 주소"
          value={copyState.url}
          onFocus={(event) => {
            event.currentTarget.select();
          }}
        />
      ) : null}
    </div>
  );
}

export function ReadingProgressBar({ progress }: { progress: number }) {
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const progressRef = useRef<HTMLDivElement | null>(null);

  // 진행률 바의 실측 높이를 `--reader-progress-height`로 올려 둔다. 이 값은
  // `--reader-anchor-clearance`(styles.css)로 들어가고, 그 clearance를 CSS scroll-margin-top과
  // JS 도착 판정이 함께 소비한다. 폰트 로딩이나 줄바꿈으로 바 높이가 변하면 세 곳이 같이 따라온다.
  useEffect(() => {
    const progressElement = progressRef.current;

    if (typeof document === "undefined" || !progressElement) {
      return undefined;
    }

    const rootElement = document.documentElement;
    const syncProgressHeight = () => {
      const { height } = progressElement.getBoundingClientRect();

      if (height > 0) {
        rootElement.style.setProperty("--reader-progress-height", `${height}px`);
      }
    };

    syncProgressHeight();

    const restore = () => {
      rootElement.style.removeProperty("--reader-progress-height");
    };

    if (typeof ResizeObserver === "undefined") {
      return restore;
    }

    const resizeObserver = new ResizeObserver(syncProgressHeight);

    resizeObserver.observe(progressElement);

    return () => {
      resizeObserver.disconnect();
      restore();
    };
  }, []);

  return (
    <div className="reading-progress" ref={progressRef} aria-label="읽기 진행률">
      <div
        className="reading-progress-bar"
        style={{ width: `${normalizedProgress}%` }}
      />
      <span className="reading-progress-label">{Math.round(normalizedProgress)}% 읽음</span>
    </div>
  );
}
