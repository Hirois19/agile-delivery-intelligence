export type AnalysisMode = "sprint" | "pi";

// Sprint Mode
export interface StoryRow {
  storyId: string;
  storyName: string;
  storyType: "feature" | "bug" | "tech_debt" | "";
  estimatedSP: number | null;
  actualSP: number | null;
  sprint: string;
  assignee: string;
  complexityTag: string;
}

// PI Mode
export interface PIFeatureRow {
  featureName: string;
  piPlanningEstimateSP: number | null;
  actualSP: number | null;
  storyCount: number | null;
  plannedSprints: string;
  actualSprints: string;
  pi: string;
  dependencies: string;
  breakdownQuality: "good" | "partial" | "poor" | "";
}

export interface SprintEventRow {
  period: string; // sprint name or PI name
  eventType: string;
  description: string;
  impactSP: string;
}

export interface EstimationFormData {
  mode: AnalysisMode;
  teamName: string;
  periodCount: string; // sprints or PIs
  // Sprint Mode
  stories: StoryRow[];
  // PI Mode
  features: PIFeatureRow[];
  // Shared
  events: SprintEventRow[];
  context: string;
}

export function createEmptyStory(): StoryRow {
  return {
    storyId: "",
    storyName: "",
    storyType: "",
    estimatedSP: null,
    actualSP: null,
    sprint: "",
    assignee: "",
    complexityTag: "",
  };
}

export function createEmptyPIFeature(): PIFeatureRow {
  return {
    featureName: "",
    piPlanningEstimateSP: null,
    actualSP: null,
    storyCount: null,
    plannedSprints: "",
    actualSprints: "",
    pi: "",
    dependencies: "",
    breakdownQuality: "",
  };
}

export function createEmptyEvent(): SprintEventRow {
  return { period: "", eventType: "", description: "", impactSP: "" };
}

export function createEmptyEstimationFormData(): EstimationFormData {
  return {
    mode: "sprint",
    teamName: "",
    periodCount: "",
    stories: [createEmptyStory()],
    features: [createEmptyPIFeature()],
    events: [],
    context: "",
  };
}

export function estimationFormDataToText(data: EstimationFormData): string {
  const lines: string[] = [];

  if (data.teamName) {
    lines.push(`## Team: ${data.teamName}`);
    lines.push(`**Analysis Mode**: ${data.mode === "sprint" ? "Sprint-Level (Story)" : "PI-Level (Feature)"}`);
    if (data.periodCount) lines.push(`**Period**: ${data.periodCount} ${data.mode === "sprint" ? "sprints" : "PIs"}`);
    lines.push("");
  }

  if (data.mode === "sprint") {
    const valid = data.stories.filter((s) => s.storyName.trim() || s.estimatedSP !== null);
    if (valid.length > 0) {
      lines.push("### Story-Level Estimation Data");
      lines.push("| Story ID | Name | Type | Estimated SP | Actual SP | Sprint | Assignee | Complexity |");
      lines.push("|----------|------|------|-------------|----------|--------|----------|------------|");
      for (const s of valid) {
        lines.push(
          `| ${s.storyId} | ${s.storyName} | ${s.storyType} | ${s.estimatedSP ?? "-"} | ${s.actualSP ?? "-"} | ${s.sprint} | ${s.assignee} | ${s.complexityTag} |`
        );
      }
      lines.push("");
    }
  } else {
    const valid = data.features.filter((f) => f.featureName.trim() || f.piPlanningEstimateSP !== null);
    if (valid.length > 0) {
      lines.push("### PI-Level Feature Estimation Data");
      lines.push("| Feature | PI Planning Est (SP) | Actual SP | Stories | Planned Sprints | Actual Sprints | PI | Dependencies | Breakdown Quality |");
      lines.push("|---------|---------------------|----------|---------|----------------|---------------|-----|-------------|------------------|");
      for (const f of valid) {
        lines.push(
          `| ${f.featureName} | ${f.piPlanningEstimateSP ?? "-"} | ${f.actualSP ?? "-"} | ${f.storyCount ?? "-"} | ${f.plannedSprints} | ${f.actualSprints} | ${f.pi} | ${f.dependencies} | ${f.breakdownQuality} |`
        );
      }
      lines.push("");
    }
  }

  const validEvents = data.events.filter((e) => e.description.trim());
  if (validEvents.length > 0) {
    lines.push("### Events & Context");
    for (const e of validEvents) {
      lines.push(`- **${e.period}** [${e.eventType}]: ${e.description}${e.impactSP ? ` (Impact: ${e.impactSP} SP)` : ""}`);
    }
    lines.push("");
  }

  if (data.context.trim()) {
    lines.push("### Additional Context");
    lines.push(data.context.trim());
    lines.push("");
  }

  return lines.join("\n");
}
