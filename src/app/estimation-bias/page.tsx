"use client";

import { useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { DataInput } from "@/components/ui/DataInput";
import { EstimationForm } from "@/components/ui/EstimationForm";
import { ResultSection } from "@/components/ui/AnalysisResult";
import { JudgmentLayer } from "@/components/ui/JudgmentLayer";
import { BiasHeatmap, EstimationScatter, FeatureBlowupChart } from "@/components/charts/BiasHeatmap";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ExportButton } from "@/components/ui/ExportButton";
import { ESTIMATION_BIAS_SAMPLES } from "@/lib/estimation-sample-data";
import type { EstimationBiasAnalysis } from "@/lib/estimation-types";
import type { ExportableTask } from "@/lib/export-tasks";

type InputMode = "guided" | "paste";

function severityBadge(severity: string) {
  const map: Record<string, { text: string; className: string }> = {
    high: { text: "High", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    medium: { text: "Medium", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    low: { text: "Low", className: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" },
  };
  const item = map[severity] ?? map.low;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}>{item.text}</span>;
}

function biasTypeLabel(type: string) {
  const map: Record<string, string> = {
    optimism: "Optimism Bias",
    anchoring: "Anchoring",
    planning_fallacy: "Planning Fallacy",
    scope_creep: "Scope Creep",
    complexity_blind_spot: "Complexity Blind Spot",
  };
  return map[type] ?? type;
}

export default function EstimationBiasPage() {
  const [analysis, setAnalysis] = useState<EstimationBiasAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("guided");

  async function handleAnalyze(data: string) {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, scenarioId: selectedScenarioId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: EstimationBiasAnalysis = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="Estimation Bias Analyzer"
      subtitle="Detect systematic patterns in why estimates miss — not just by how much. Supports sprint-level stories and PI-level features."
    >
      {/* How It Works */}
      <div className="mb-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          How It Works
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">1.</span>
            <span>
              <strong>Choose your mode</strong> — Sprint Mode for story-level
              analysis, or PI Mode for feature-level analysis with breakdown
              quality and carryover tracking.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">2.</span>
            <span>
              <strong>Provide estimation data</strong> — estimated vs actual SP
              for each story or feature. Upload CSV/Excel or enter manually.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">3.</span>
            <span>
              <strong>Get bias patterns &amp; corrections</strong> — cognitive
              bias classification, correction factors, facilitation tips, and
              PM Judgment Layer.
            </span>
          </li>
        </ol>
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Try it with sample data:{" "}
          <button type="button" onClick={() => setInputMode("paste")} className="text-[var(--color-accent)] hover:underline">
            Switch to Paste Data
          </button>{" "}
          and load a scenario (Sprint or PI mode).
        </p>
      </div>

      <div className="mb-6">
        <PrivacyNotice />
      </div>

      {/* Input Mode Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setInputMode("guided")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "guided" ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          }`}
        >Guided Form</button>
        <button
          onClick={() => setInputMode("paste")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "paste" ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          }`}
        >Paste Data</button>
      </div>

      {inputMode === "guided" && <EstimationForm onSubmit={handleAnalyze} isLoading={isLoading} />}

      {inputMode === "paste" && (
        <DataInput
          label="Estimation Data"
          placeholder={`Paste your estimation data here. Include:\n\n- Story/Feature name, estimated SP, actual SP\n- Type (feature/bug/tech_debt)\n- Sprint or PI assignment\n- Assignee (optional)\n\nThe more data, the better the pattern detection.`}
          helpText="Supports both sprint-level (story) and PI-level (feature) data. Minimum 10 items for meaningful analysis."
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          samples={ESTIMATION_BIAS_SAMPLES}
          onSampleLoad={(id) => setSelectedScenarioId(id)}
        />
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-10 space-y-8">
          {/* Overall Score */}
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
              Overall Estimation Accuracy
            </p>
            <p className={`mt-1 text-5xl font-bold ${
              analysis.overallAccuracy >= 80 ? "text-[var(--color-success)]" :
              analysis.overallAccuracy >= 60 ? "text-[var(--color-warning)]" :
              "text-[var(--color-danger)]"
            }`}>
              {analysis.overallAccuracy}
              <span className="text-lg font-normal text-[var(--color-text-secondary)]">/100</span>
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Overall bias: <strong>{analysis.overallBias}</strong>
              {analysis.analysisMode === "pi" && " (PI Mode)"}
            </p>
          </div>

          {/* Bias Patterns */}
          <ResultSection title="Bias Patterns Detected">
            <div className="space-y-4">
              {analysis.biasPatterns.map((pattern, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold">{pattern.patternName}</h4>
                      <div className="mt-1 flex gap-2">
                        {severityBadge(pattern.severity)}
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                          {biasTypeLabel(pattern.biasType)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${pattern.avgOverUnderPercent < 0 ? "text-red-600" : pattern.avgOverUnderPercent > 15 ? "text-blue-600" : "text-green-600"}`}>
                      {pattern.avgOverUnderPercent > 0 ? "+" : ""}{pattern.avgOverUnderPercent}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{pattern.description}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Evidence: {pattern.evidence}
                  </p>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Heatmap */}
          <ResultSection title="Accuracy Heatmap">
            <BiasHeatmap data={analysis.heatmapData} />
          </ResultSection>

          {/* Estimation Scatter */}
          <ResultSection title="Estimated vs Actual">
            <EstimationScatter data={analysis.heatmapData} />
          </ResultSection>

          {/* Feature Blowup (PI Mode) */}
          {analysis.featureBreakdownAnalysis && analysis.featureBreakdownAnalysis.length > 0 && (
            <ResultSection title="Feature Breakdown Analysis">
              <FeatureBlowupChart data={analysis.featureBreakdownAnalysis} />
            </ResultSection>
          )}

          {/* PI Carryover (PI Mode) */}
          {analysis.piCarryoverAnalysis && analysis.piCarryoverAnalysis.length > 0 && (
            <ResultSection title="PI Carryover Tracking">
              <div className="space-y-3">
                {analysis.piCarryoverAnalysis.map((item, i) => (
                  <div key={i} className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold">{item.featureName}</h4>
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        +{item.delaySprintCount} sprints delayed
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      Planned: {item.plannedCompletionSprint} → Actual: {item.actualCompletionSprint}
                    </p>
                    <p className="mt-1 text-xs">{item.carryoverReason}</p>
                  </div>
                ))}
              </div>
            </ResultSection>
          )}

          {/* Correction Factors */}
          <ResultSection title="Correction Factors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                    <th className="pb-2 text-left font-medium">Segment</th>
                    <th className="pb-2 text-center font-medium">Current Ratio</th>
                    <th className="pb-2 text-center font-medium">Suggested Multiplier</th>
                    <th className="pb-2 text-center font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.correctionFactors.map((cf, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)]">
                      <td className="py-2">{cf.segment}</td>
                      <td className="py-2 text-center">{cf.currentMultiplier.toFixed(2)}x</td>
                      <td className="py-2 text-center font-medium text-[var(--color-accent)]">{cf.suggestedMultiplier.toFixed(1)}x</td>
                      <td className="py-2 text-center">{severityBadge(cf.confidence)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultSection>

          {/* Facilitation Guide */}
          <ResultSection title="Facilitation Guide">
            <div className="mb-4">
              <ExportButton
                filenamePrefix="estimation-bias-actions"
                tasks={analysis.facilitationGuide.map((tip, i): ExportableTask => ({
                  title: `Estimation improvement: ${tip.context}`,
                  description: `Technique: ${tip.technique}\n\nExpected: ${tip.expectedOutcome}`,
                  priority: i === 0 ? "High" : "Medium",
                  type: "Process Improvement",
                  module: "Estimation Bias Analyzer",
                  expectedOutcome: tip.expectedOutcome,
                }))}
              />
            </div>
            <div className="space-y-3">
              {analysis.facilitationGuide.map((tip, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-3">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">{tip.context}</p>
                  <p className="mt-1 text-sm">{tip.technique}</p>
                  <p className="mt-1 text-xs text-[var(--color-accent)]">Expected: {tip.expectedOutcome}</p>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* PM Judgment Layer */}
          <ResultSection title="PM Judgment Layer">
            <div className="space-y-4">
              {analysis.judgmentLayers.map((layer, i) => (
                <JudgmentLayer
                  key={i}
                  aiSuggestion={layer.aiSuggestion}
                  pmJudgment={layer.pmJudgment}
                  rationale={layer.rationale}
                />
              ))}
            </div>
          </ResultSection>
        </div>
      )}
    </ModuleLayout>
  );
}
