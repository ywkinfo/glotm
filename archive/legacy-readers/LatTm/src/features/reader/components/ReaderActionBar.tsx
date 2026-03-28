type ReaderActionBarProps = {
  activeSectionTitle?: string;
  copyState: "idle" | "success" | "error";
  onCopyLink: () => void;
  onScrollToTop: () => void;
  visible: boolean;
};

export function ReaderActionBar({
  activeSectionTitle,
  copyState,
  onCopyLink,
  onScrollToTop,
  visible
}: ReaderActionBarProps) {
  if (!visible) {
    return null;
  }

  const copyLabel =
    copyState === "success"
      ? "링크 복사됨"
      : copyState === "error"
        ? "복사 실패"
        : "현재 위치 링크";

  return (
    <aside className="reader-action-bar" aria-label="읽기 도구">
      <div className="reader-action-context">
        <p className="reader-action-kicker">Current Section</p>
        <strong className="reader-action-title">
          {activeSectionTitle ?? "이 장을 읽는 중"}
        </strong>
      </div>
      <div className="reader-action-buttons">
        <button className="reader-action-button" type="button" onClick={onCopyLink}>
          {copyLabel}
        </button>
        <button className="reader-action-button" type="button" onClick={onScrollToTop}>
          맨 위로
        </button>
      </div>
    </aside>
  );
}
