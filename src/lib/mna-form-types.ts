export interface TeamProfileInput {
  teamName: string;
  teamSize: string;
  techStack: string;
  agileMaturity: "beginner" | "intermediate" | "advanced" | "";
  methodology: "scrum" | "kanban" | "scrumban" | "other" | "";
  cultureTraits: string;
  location: string;
}

export interface ToolingInventoryItem {
  category: string;
  acquirerTool: string;
  acquiredTool: string;
}

export interface StakeholderInput {
  name: string;
  role: string;
  influence: "high" | "medium" | "low" | "";
  stance: "supportive" | "neutral" | "resistant" | "";
  concerns: string;
}

export interface MnAFormData {
  acquirerTeams: TeamProfileInput[];
  acquiredTeams: TeamProfileInput[];
  tooling: ToolingInventoryItem[];
  integrationGoal: string;
  timeline: string;
  deadline: string;
  stakeholders: StakeholderInput[];
  constraints: string;
  context: string;
}

export function createEmptyTeamProfile(): TeamProfileInput {
  return {
    teamName: "",
    teamSize: "",
    techStack: "",
    agileMaturity: "",
    methodology: "",
    cultureTraits: "",
    location: "",
  };
}

export function createEmptyStakeholder(): StakeholderInput {
  return { name: "", role: "", influence: "", stance: "", concerns: "" };
}

const DEFAULT_TOOLING_CATEGORIES = [
  "Project Management",
  "CI/CD",
  "Communication",
  "Repository",
  "Design",
  "Documentation",
];

export function createEmptyMnAFormData(): MnAFormData {
  return {
    acquirerTeams: [createEmptyTeamProfile()],
    acquiredTeams: [createEmptyTeamProfile()],
    tooling: DEFAULT_TOOLING_CATEGORIES.map((cat) => ({
      category: cat,
      acquirerTool: "",
      acquiredTool: "",
    })),
    integrationGoal: "",
    timeline: "",
    deadline: "",
    stakeholders: [],
    constraints: "",
    context: "",
  };
}

export function mnaFormDataToText(data: MnAFormData): string {
  const lines: string[] = [];

  // Acquirer Teams
  const validAcq = data.acquirerTeams.filter((t) => t.teamName.trim());
  if (validAcq.length > 0) {
    lines.push("## Acquirer Team(s)");
    for (const t of validAcq) {
      lines.push(`\n**${t.teamName}**`);
      if (t.teamSize) lines.push(`- Size: ${t.teamSize}`);
      if (t.techStack) lines.push(`- Tech stack: ${t.techStack}`);
      if (t.agileMaturity) lines.push(`- Agile maturity: ${t.agileMaturity}`);
      if (t.methodology) lines.push(`- Methodology: ${t.methodology}`);
      if (t.cultureTraits) lines.push(`- Culture: ${t.cultureTraits}`);
      if (t.location) lines.push(`- Location: ${t.location}`);
    }
    lines.push("");
  }

  // Acquired Teams
  const validAcqd = data.acquiredTeams.filter((t) => t.teamName.trim());
  if (validAcqd.length > 0) {
    lines.push("## Acquired Team(s)");
    for (const t of validAcqd) {
      lines.push(`\n**${t.teamName}**`);
      if (t.teamSize) lines.push(`- Size: ${t.teamSize}`);
      if (t.techStack) lines.push(`- Tech stack: ${t.techStack}`);
      if (t.agileMaturity) lines.push(`- Agile maturity: ${t.agileMaturity}`);
      if (t.methodology) lines.push(`- Methodology: ${t.methodology}`);
      if (t.cultureTraits) lines.push(`- Culture: ${t.cultureTraits}`);
      if (t.location) lines.push(`- Location: ${t.location}`);
    }
    lines.push("");
  }

  // Tooling
  const validTools = data.tooling.filter((t) => t.acquirerTool.trim() || t.acquiredTool.trim());
  if (validTools.length > 0) {
    lines.push("## Tooling Inventory");
    lines.push("| Category | Acquirer | Acquired |");
    lines.push("|----------|----------|----------|");
    for (const t of validTools) {
      const match = t.acquirerTool.toLowerCase() === t.acquiredTool.toLowerCase();
      lines.push(`| ${t.category} | ${t.acquirerTool} | ${t.acquiredTool}${match ? " (same)" : ""} |`);
    }
    lines.push("");
  }

  // Integration Goals
  if (data.integrationGoal || data.timeline || data.deadline) {
    lines.push("## Integration Goals & Timeline");
    if (data.integrationGoal) lines.push(`- Goal: ${data.integrationGoal}`);
    if (data.timeline) lines.push(`- Timeline: ${data.timeline}`);
    if (data.deadline) lines.push(`- Key deadline: ${data.deadline}`);
    lines.push("");
  }

  // Stakeholders
  const validStake = data.stakeholders.filter((s) => s.name.trim());
  if (validStake.length > 0) {
    lines.push("## Key Stakeholders");
    for (const s of validStake) {
      lines.push(`- **${s.name}** (${s.role}) — Influence: ${s.influence}, Stance: ${s.stance}${s.concerns ? `. Concerns: ${s.concerns}` : ""}`);
    }
    lines.push("");
  }

  // Constraints
  if (data.constraints.trim()) {
    lines.push("## Constraints & Non-Negotiables");
    lines.push(data.constraints.trim());
    lines.push("");
  }

  // Context
  if (data.context.trim()) {
    lines.push("## Additional Context");
    lines.push(data.context.trim());
    lines.push("");
  }

  return lines.join("\n");
}
