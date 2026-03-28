type ReadingProgressBarProps = {
  progress: number;
};

export function ReadingProgressBar({ progress }: ReadingProgressBarProps) {
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
