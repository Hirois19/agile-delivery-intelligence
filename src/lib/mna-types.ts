import type { JudgmentLayerData } from "./types";

export interface IntegrationRisk {
  riskName: string;
  category: "culture" | "process" | "tooling" | "communication" | "technical";
  severity: "high" | "medium" | "low";
  description: string;
  mitigation: string;
  likelihood: "very_likely" | "likely" | "possible" | "unlikely";
}

export interface ToolingCategory {
  category: string;
  acquirerTool: string;
  acquiredTool: string;
  gapSeverity: "high" | "medium" | "low" | "none";
  migrationComplexity: "high" | "medium" | "low";
  recommendation: string;
  migrationRisk: string;
}

export interface ToolingGapAnalysis {
  categories: ToolingCategory[];
  migrationPriority: string[];
  estimatedMigrationWeeks: number;
  recommendation: string;
}

export interface TeamState {
  teamName: string;
  members: number;
  keySkills: string[];
  methodology: string;
  tools: string[];
}

export interface ReorgPhase {
  phaseNumber: number;
  description: string;
  durationWeeks: number;
  teamsAfterPhase: TeamState[];
}

export interface TeamReorgPlan {
  currentState: TeamState[];
  proposedState: TeamState[];
  reorgApproach: "full_merge" | "gradual_merge" | "skill_based_redistribution";
  phases: ReorgPhase[];
  retentionRisks: string[];
}

export interface PlaybookPhase {
  phaseName: string;
  phaseNumber: number;
  durationWeeks: number;
  objectives: string[];
  keyActivities: string[];
  milestones: string[];
  antiPatterns: string[];
  deliverables: string[];
}

export interface CommunicationPlanItem {
  audience: string;
  channel: string;
  frequency: string;
  keyMessage: string;
  timing: string;
  owner: string;
}

export interface WeeklyCheckinTemplate {
  weekNumber: number;
  phase: string;
  focusArea: string;
  questionsToAsk: string[];
  warningSignals: string[];
  successIndicators: string[];
}

export interface MnAIntegrationAnalysis {
  executiveSummary: string;
  overallRiskLevel: "high" | "medium" | "low";
  estimatedIntegrationWeeks: number;
  risks: IntegrationRisk[];
  toolingAnalysis: ToolingGapAnalysis;
  teamReorgPlan: TeamReorgPlan;
  playbook: PlaybookPhase[];
  communicationPlan: CommunicationPlanItem[];
  weeklyCheckins: WeeklyCheckinTemplate[];
  doFirstNeverDoChecklist: {
    doFirst: string[];
    neverDo: string[];
  };
  judgmentLayers: JudgmentLayerData[];
}
