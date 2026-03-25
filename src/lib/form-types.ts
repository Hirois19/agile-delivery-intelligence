export interface SprintRow {
  name: string;
  plannedSP: number | null;
  completedSP: number | null;
  rolloverSP: number | null;
  notes: string;
}

export interface RetroSprint {
  sprintName: string;
  comments: string[];
}

export interface PRMetrics {
  cycleTime: string;
  reviewTurnaround: string;
  unreviewedPRs: string;
  prSize: string;
}

export interface TeamFormData {
  teamName: string;
  teamSize: string;
  composition: string; // e.g. "7 engineers, 1 PO, 1 SM"
  sprints: SprintRow[];
  retros: RetroSprint[];
  prMetrics: PRMetrics;
  context: string;
}

export function createEmptyFormData(): TeamFormData {
  return {
    teamName: "",
    teamSize: "",
    composition: "",
    sprints: [createEmptySprint(1)],
    retros: [{ sprintName: "Sprint 1", comments: [""] }],
    prMetrics: {
      cycleTime: "",
      reviewTurnaround: "",
      unreviewedPRs: "",
      prSize: "",
    },
    context: "",
  };
}

export function createEmptySprint(num: number): SprintRow {
  return {
    name: `Sprint ${num}`,
    plannedSP: null,
    completedSP: null,
    rolloverSP: null,
    notes: "",
  };
}

export function formDataToText(data: TeamFormData): string {
  const lines: string[] = [];

  // Team Info
  const teamHeader = [data.teamName, data.composition]
    .filter(Boolean)
    .join(" (");
  if (teamHeader) {
    lines.push(`## Team: ${teamHeader}${data.composition ? ")" : ""}`);
    lines.push("");
  }

  // Sprint Velocity
  const validSprints = data.sprints.filter(
    (s) => s.plannedSP !== null || s.completedSP !== null
  );
  if (validSprints.length > 0) {
    lines.push("### Sprint Velocity");
    lines.push(
      "| Sprint | Planned SP | Completed SP | Rollover SP | Completion % | Notes |"
    );
    lines.push(
      "|--------|-----------|-------------|-------------|-------------|-------|"
    );
    for (const s of validSprints) {
      const planned = s.plannedSP ?? 0;
      const completed = s.completedSP ?? 0;
      const rollover = s.rolloverSP ?? planned - completed;
      const pct = planned > 0 ? Math.round((completed / planned) * 100) : 0;
      lines.push(
        `| ${s.name} | ${planned} | ${completed} | ${rollover} | ${pct}% | ${s.notes} |`
      );
    }
    lines.push("");
  }

  // Retrospective Themes
  const validRetros = data.retros.filter((r) =>
    r.comments.some((c) => c.trim())
  );
  if (validRetros.length > 0) {
    lines.push("### Retrospective Themes");
    lines.push("");
    for (const retro of validRetros) {
      lines.push(`**${retro.sprintName} Retro:**`);
      for (const comment of retro.comments) {
        if (comment.trim()) {
          lines.push(`- "${comment.trim()}"`);
        }
      }
      lines.push("");
    }
  }

  // PR Metrics
  const pm = data.prMetrics;
  if (pm.cycleTime || pm.reviewTurnaround || pm.unreviewedPRs || pm.prSize) {
    lines.push("### PR Metrics");
    if (pm.cycleTime)
      lines.push(`- Average PR cycle time: ${pm.cycleTime}`);
    if (pm.reviewTurnaround)
      lines.push(`- Average review turnaround: ${pm.reviewTurnaround}`);
    if (pm.unreviewedPRs)
      lines.push(`- PRs merged without review: ${pm.unreviewedPRs}`);
    if (pm.prSize) lines.push(`- Average PR size: ${pm.prSize}`);
    lines.push("");
  }

  // Context
  if (data.context.trim()) {
    lines.push("### Context");
    for (const line of data.context.trim().split("\n")) {
      lines.push(`- ${line.trim()}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
