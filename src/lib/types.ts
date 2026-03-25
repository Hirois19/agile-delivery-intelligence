export interface HealthDimension {
  score: number;
  trend: "improving" | "stable" | "declining";
  rationale: string;
}

export interface RootCause {
  finding: string;
  evidence: string;
  severity: "high" | "medium" | "low";
}

export interface ActionItem {
  action: string;
  urgency: "act_now" | "next_retro" | "monitor";
  type: string;
  expectedOutcome: string;
}

export interface JudgmentLayerData {
  aiSuggestion: string;
  pmJudgment: string;
  rationale: string;
}

export interface TeamHealthAnalysis {
  overallScore: number;
  dimensions: {
    morale: HealthDimension;
    efficiency: HealthDimension;
    quality: HealthDimension;
    sustainability: HealthDimension;
  };
  rootCauses: RootCause[];
  actionItems: ActionItem[];
  judgmentLayers: JudgmentLayerData[];
}
