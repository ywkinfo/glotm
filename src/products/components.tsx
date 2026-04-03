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

  return (
    <div className="reading-progress" aria-label="읽기 진행률">
      <div
        className="reading-progress-bar"
        style={{ width: `${normalizedProgress}%` }}
      />
      <span className="reading-progress-label">{Math.round(normalizedProgress)}% 읽음</span>
    </div>
  );
}
