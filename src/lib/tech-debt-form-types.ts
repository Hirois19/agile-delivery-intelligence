export interface DebtItemRow {
  name: string;
  description: string;
  affectedComponents: string;
  fixEffortSP: number | null;
  velocityImpactSP: number | null; // SP/sprint lost due to this debt
  engineerSeverity: "critical" | "high" | "medium" | "low" | "";
}

export interface SprintEconomics {
  teamName: string;
  avgVelocity: number | null; // SP per sprint
  sprintLengthWeeks: number | null;
  teamCostPerSprintEur: number | null;
  sprintsPerYear: number | null;
}

export interface TechDebtFormData {
  economics: SprintEconomics;
  debtItems: DebtItemRow[];
  roadmapContext: string;
  additionalContext: string;
}

export function createEmptyDebtFormData(): TechDebtFormData {
  return {
    economics: {
      teamName: "",
      avgVelocity: null,
      sprintLengthWeeks: 2,
      teamCostPerSprintEur: null,
      sprintsPerYear: 26,
    },
    debtItems: [createEmptyDebtItem()],
    roadmapContext: "",
    additionalContext: "",
  };
}

export function createEmptyDebtItem(): DebtItemRow {
  return {
    name: "",
    description: "",
    affectedComponents: "",
    fixEffortSP: null,
    velocityImpactSP: null,
    engineerSeverity: "",
  };
}

export function calcCostPerSP(economics: SprintEconomics): number | null {
  if (!economics.avgVelocity || !economics.teamCostPerSprintEur) return null;
  return Math.round(economics.teamCostPerSprintEur / economics.avgVelocity);
}

export function techDebtFormDataToText(data: TechDebtFormData): string {
  const lines: string[] = [];
  const eco = data.economics;
  const costPerSP = calcCostPerSP(eco);

  // Team & Economics
  if (eco.teamName) {
    lines.push(`## Team: ${eco.teamName}`);
    lines.push("");
  }

  lines.push("### Sprint Economics");
  if (eco.avgVelocity) lines.push(`- Average velocity: ${eco.avgVelocity} SP/sprint`);
  if (eco.sprintLengthWeeks) lines.push(`- Sprint length: ${eco.sprintLengthWeeks} weeks`);
  if (eco.teamCostPerSprintEur) lines.push(`- Team cost per sprint: €${eco.teamCostPerSprintEur.toLocaleString()}`);
  if (eco.sprintsPerYear) lines.push(`- Sprints per year: ${eco.sprintsPerYear}`);
  if (costPerSP) lines.push(`- **Cost per story point: €${costPerSP.toLocaleString()}**`);
  lines.push("");

  // Debt Items
  const validItems = data.debtItems.filter((d) => d.name.trim());
  if (validItems.length > 0) {
    lines.push("### Tech Debt Items");
    lines.push("");
    for (const item of validItems) {
      lines.push(`**${item.name}**${item.engineerSeverity ? ` [${item.engineerSeverity}]` : ""}`);
      if (item.description) lines.push(`- Description: ${item.description}`);
      if (item.affectedComponents) lines.push(`- Affected components: ${item.affectedComponents}`);
      if (item.fixEffortSP !== null) {
        lines.push(`- Estimated fix effort: ${item.fixEffortSP} SP${costPerSP ? ` (€${(item.fixEffortSP * costPerSP).toLocaleString()})` : ""}`);
      }
      if (item.velocityImpactSP !== null && eco.sprintsPerYear) {
        const annualLostSP = item.velocityImpactSP * eco.sprintsPerYear;
        lines.push(`- Velocity impact: ${item.velocityImpactSP} SP/sprint lost (${annualLostSP} SP/year${costPerSP ? `, €${(annualLostSP * costPerSP).toLocaleString()}/year` : ""})`);
      }
      lines.push("");
    }
  }

  // Roadmap Context
  if (data.roadmapContext.trim()) {
    lines.push("### Product Roadmap Context");
    lines.push(data.roadmapContext.trim());
    lines.push("");
  }

  // Additional Context
  if (data.additionalContext.trim()) {
    lines.push("### Additional Context");
    lines.push(data.additionalContext.trim());
    lines.push("");
  }

  return lines.join("\n");
}
