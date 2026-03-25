import type { JudgmentLayerData } from "./types";

export interface BiasPattern {
  patternName: string;
  biasType:
    | "optimism"
    | "anchoring"
    | "planning_fallacy"
    | "scope_creep"
    | "complexity_blind_spot";
  severity: "high" | "medium" | "low";
  description: string;
  evidence: string;
  affectedSegment: string;
  avgOverUnderPercent: number; // positive = overestimated, negative = underestimated
}

export interface HeatmapCell {
  storyType: string;
  dimension: string; // sprint name or PI name
  estimatedAvg: number;
  actualAvg: number;
  accuracyPercent: number;
  sampleSize: number;
}

export interface CorrectionFactor {
  segment: string;
  currentMultiplier: number;
  suggestedMultiplier: number;
  confidence: "high" | "medium" | "low";
  sampleSize: number;
}

export interface FeatureBreakdownItem {
  featureName: string;
  piPlanningEstimateSP: number;
  actualTotalSP: number;
  storyCount: number;
  blowupRatio: number;
  rootCause:
    | "poor_breakdown"
    | "hidden_complexity"
    | "dependency_cost"
    | "scope_creep"
    | "unknown_unknowns";
  explanation: string;
}

export interface PICarryoverItem {
  featureName: string;
  originalPI: string;
  plannedCompletionSprint: string;
  actualCompletionSprint: string;
  delaySprintCount: number;
  carryoverReason: string;
}

export interface FacilitationTip {
  context: string;
  technique: string;
  expectedOutcome: string;
}

export interface EstimationBiasAnalysis {
  analysisMode: "sprint" | "pi";
  overallAccuracy: number;
  overallBias: "optimistic" | "pessimistic" | "mixed";
  biasPatterns: BiasPattern[];
  heatmapData: HeatmapCell[];
  correctionFactors: CorrectionFactor[];
  featureBreakdownAnalysis?: FeatureBreakdownItem[];
  piCarryoverAnalysis?: PICarryoverItem[];
  facilitationGuide: FacilitationTip[];
  judgmentLayers: JudgmentLayerData[];
}
