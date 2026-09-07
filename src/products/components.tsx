import { useEffect, useRef } from "react";

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
