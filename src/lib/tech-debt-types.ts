import type { JudgmentLayerData } from "./types";

export interface BusinessImpactItem {
  debtItemName: string;
  delayDaysPerSprint: number;
  velocityDragPercent: number;
  annualCostEur: number;
  riskDescription: string;
  businessLanguageSummary: string;
}

export interface ROICalculation {
  debtItemName: string;
  fixCostSP: number;
  fixCostEur: number;
  annualSavingsEur: number;
  paybackMonths: number;
  roiPercent: number;
}

export interface PriorityMatrixItem {
  debtItemName: string;
  businessImpactScore: number; // 0-100
  fixCostScore: number; // 0-100
  quadrant: "quick_win" | "strategic" | "fill_in" | "deprioritize";
  recommendation: string;
}

export interface RepaymentPlanItem {
  quarter: string;
  debtItems: string[];
  sprintAllocation: number;
  costEur: number;
  expectedVelocityGain: string;
  milestone: string;
}

export interface TechDebtAnalysis {
  executiveSummary: string;
  totalAnnualCostEur: number;
  totalVelocityDragPercent: number;
  totalFixCostEur: number;
  businessImpacts: BusinessImpactItem[];
  roiCalculations: ROICalculation[];
  priorityMatrix: PriorityMatrixItem[];
  repaymentPlan: RepaymentPlanItem[];
  judgmentLayers: JudgmentLayerData[];
}
