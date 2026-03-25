interface JudgmentLayerProps {
  aiSuggestion: string;
  pmJudgment: string;
  rationale: string;
}

export function JudgmentLayer({
  aiSuggestion,
  pmJudgment,
  rationale,
}: JudgmentLayerProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-[var(--color-accent)]/30 bg-[var(--color-accent-light)]/10 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        <span className="inline-block h-4 w-4 rounded-full border-2 border-[var(--color-accent)]" />
        PM Judgment Layer
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-[var(--color-text-secondary)]">
            AI suggests
          </p>
          <p className="text-sm leading-relaxed">{aiSuggestion}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-[var(--color-accent)]">
            An experienced SM/PM would
          </p>
          <p className="text-sm font-medium leading-relaxed">{pmJudgment}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-[var(--color-border)] pt-3">
        <p className="mb-1 text-xs font-medium uppercase text-[var(--color-text-secondary)]">
          Why the difference
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {rationale}
        </p>
      </div>
    </div>
  );
}
