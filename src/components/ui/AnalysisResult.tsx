interface ScoreCardProps {
  label: string;
  score: number;
  maxScore: number;
  color: "success" | "warning" | "danger" | "neutral";
}

export function ScoreCard({ label, score, maxScore, color }: ScoreCardProps) {
  const colorMap = {
    success: "text-[var(--color-success)]",
    warning: "text-[var(--color-warning)]",
    danger: "text-[var(--color-danger)]",
    neutral: "text-[var(--color-text-secondary)]",
  };

  const bgMap = {
    success: "bg-green-50 dark:bg-green-900/20",
    warning: "bg-amber-50 dark:bg-amber-900/20",
    danger: "bg-red-50 dark:bg-red-900/20",
    neutral: "bg-neutral-50 dark:bg-neutral-800/50",
  };

  const pct = Math.round((score / maxScore) * 100);

  return (
    <div className={`rounded-lg p-4 ${bgMap[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${colorMap[color]}`}>
        {score}
        <span className="text-sm font-normal text-[var(--color-text-secondary)]">
          /{maxScore}
        </span>
      </p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-1.5 rounded-full transition-all ${
            color === "success"
              ? "bg-[var(--color-success)]"
              : color === "warning"
              ? "bg-[var(--color-warning)]"
              : color === "danger"
              ? "bg-[var(--color-danger)]"
              : "bg-neutral-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function ResultSection({ title, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        {title}
      </h3>
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        {children}
      </div>
    </section>
  );
}
