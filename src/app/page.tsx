import Link from "next/link";

const modules = [
  {
    id: "team-health",
    title: "Team Health Diagnostic",
    description:
      "Multi-signal team health analysis combining velocity trends, retro themes, and PR metrics. Goes beyond surveys to diagnose why teams struggle — not just that they do.",
    status: "live" as const,
    icon: "pulse",
    tags: ["Scrum Master", "Team Lead"],
  },
  {
    id: "tech-debt",
    title: "Tech Debt Business Translator",
    description:
      "Converts technical debt from engineer-speak into business impact: delay days, velocity drag, and opportunity cost in euros. Makes the invisible visible to stakeholders.",
    status: "coming" as const,
    icon: "translate",
    tags: ["Product Manager", "Stakeholder Mgmt"],
  },
  {
    id: "estimation-bias",
    title: "Estimation Bias Analyzer",
    description:
      "Analyzes why estimates miss — not just by how much. Detects systematic patterns (optimism bias, anchoring, planning fallacy) and provides calibration factors.",
    status: "coming" as const,
    icon: "chart",
    tags: ["Scrum Master", "Continuous Improvement"],
  },
  {
    id: "m-and-a",
    title: "M&A Integration Playbook",
    description:
      "Generates phased integration playbooks for post-acquisition team merges. Built from real experience integrating 3 product teams across NL-DE after SITA × Materna IPS.",
    status: "coming" as const,
    icon: "merge",
    tags: ["Delivery Manager", "Post-M&A"],
  },
];

function StatusBadge({ status }: { status: "live" | "coming" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
      Coming Soon
    </span>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight">
          Agile Delivery Intelligence
        </h1>
        <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
          AI-powered analysis tools that augment PM/SM judgment.
          <br />
          Not replacements for experience — amplifiers of it.
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <span>Built by Hiroya Ishida</span>
          <span className="text-[var(--color-border)]">|</span>
          <a
            href="https://www.linkedin.com/in/hiroya-ishida/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text)]"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/hiroya-ishida"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text)]"
          >
            GitHub
          </a>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          The Problem
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Existing agile tools generate dashboards. They show you{" "}
          <em>what happened</em>. But PMs and Scrum Masters need to know{" "}
          <strong>why it happened</strong> and{" "}
          <strong>what to do about it</strong>. That judgment layer — the space
          between data and decision — is where this tool lives.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Modules
        </h2>
        <div className="grid gap-4">
          {modules.map((mod) => {
            const isLive = mod.status === "live";
            const className = `group block rounded-lg border border-[var(--color-border)] p-6 transition-colors ${
              isLive
                ? "cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]/30"
                : "opacity-60"
            }`;

            const content = (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{mod.title}</h3>
                  <StatusBadge status={mod.status} />
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {mod.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            );

            if (isLive) {
              return (
                <Link key={mod.id} href={`/${mod.id}`} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={mod.id} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-text-secondary)]">
        <p>
          Each module follows a three-step pattern:{" "}
          <strong>Input</strong> raw data →{" "}
          <strong>AI Analysis</strong> with structured frameworks →{" "}
          <strong>PM Judgment Layer</strong> showing what the AI suggests vs.
          what an experienced PM/SM should actually do.
        </p>
        <p className="mt-4">
          Built with Next.js, Tailwind CSS, Claude API, and Recharts.
          <br />
          Designed as a portfolio piece demonstrating PM/SM domain expertise
          applied through AI tooling.
        </p>
      </footer>
    </main>
  );
}
