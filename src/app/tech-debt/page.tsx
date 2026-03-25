"use client";

import { useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { DataInput } from "@/components/ui/DataInput";
import { TechDebtForm } from "@/components/ui/TechDebtForm";
import { ResultSection } from "@/components/ui/AnalysisResult";
import { JudgmentLayer } from "@/components/ui/JudgmentLayer";
import { DebtPriorityMatrix, AnnualCostBar } from "@/components/charts/DebtPriorityMatrix";
import { TECH_DEBT_SAMPLES } from "@/lib/tech-debt-sample-data";
import type { TechDebtAnalysis } from "@/lib/tech-debt-types";

type InputMode = "guided" | "paste";

function quadrantLabel(q: string) {
  const map: Record<string, { text: string; className: string }> = {
    quick_win: {
      text: "Quick Win",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    strategic: {
      text: "Strategic",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    fill_in: {
      text: "Fill-in",
      className: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    },
    deprioritize: {
      text: "Deprioritize",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };
  const item = map[q] ?? map.fill_in;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}>
      {item.text}
    </span>
  );
}

export default function TechDebtPage() {
  const [analysis, setAnalysis] = useState<TechDebtAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("guided");

  async function handleAnalyze(data: string) {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, scenarioId: selectedScenarioId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: TechDebtAnalysis = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="Tech Debt Business Translator"
      subtitle="Convert technical debt from engineer-speak into business impact: delay days, velocity drag, and cost in EUR."
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
              <strong>Enter sprint economics</strong> — team cost and velocity
              are used to calculate what each story point costs in EUR.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">2.</span>
            <span>
              <strong>List your tech debt items</strong> — describe each item,
              its fix effort, and velocity impact. EUR costs are calculated
              automatically.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">3.</span>
            <span>
              <strong>Get a stakeholder-ready report</strong> — executive
              summary, priority matrix, ROI calculations, and a quarterly
              repayment plan. All in business language.
            </span>
          </li>
        </ol>
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Want to see it in action?{" "}
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className="text-[var(--color-accent)] hover:underline"
          >
            Switch to Paste Data
          </button>{" "}
          and load a sample scenario.
        </p>
      </div>

      {/* Input Mode Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setInputMode("guided")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "guided"
              ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          }`}
        >
          Guided Form
        </button>
        <button
          onClick={() => setInputMode("paste")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "paste"
              ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          }`}
        >
          Paste Data
        </button>
      </div>

      {inputMode === "guided" && (
        <TechDebtForm onSubmit={handleAnalyze} isLoading={isLoading} />
      )}

      {inputMode === "paste" && (
        <DataInput
          label="Tech Debt Data"
          placeholder={`Describe your tech debt items, including:\n\n- Item name and description\n- Affected components\n- Estimated fix effort (story points)\n- Velocity impact (SP/sprint lost)\n- Sprint economics (team cost, velocity)\n\nThe more detail, the better the business translation.`}
          helpText="Include sprint economics (team cost per sprint, velocity) for automatic EUR conversion."
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          samples={TECH_DEBT_SAMPLES}
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
          {/* Executive Summary */}
          <ResultSection title="Executive Summary">
            <p className="text-sm leading-relaxed">{analysis.executiveSummary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-900/20">
                <p className="text-xs text-[var(--color-text-secondary)]">Annual Cost of Debt</p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-danger)]">
                  €{analysis.totalAnnualCostEur.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Velocity Drag</p>
                <p className="mt-1 text-2xl font-bold">{analysis.totalVelocityDragPercent}%</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Total Fix Investment</p>
                <p className="mt-1 text-2xl font-bold">
                  €{analysis.totalFixCostEur.toLocaleString()}
                </p>
              </div>
            </div>
          </ResultSection>

          {/* Business Impact */}
          <ResultSection title="Business Impact per Item">
            <div className="space-y-4">
              {analysis.businessImpacts.map((impact, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold">{impact.debtItemName}</h4>
                    <span className="text-sm font-bold text-[var(--color-danger)]">
                      €{impact.annualCostEur.toLocaleString()}/yr
                    </span>
                  </div>
                  <p className="mt-2 text-xs italic text-[var(--color-text-secondary)]">
                    &ldquo;{impact.businessLanguageSummary}&rdquo;
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span>{impact.delayDaysPerSprint} days delay/sprint</span>
                    <span>{impact.velocityDragPercent}% velocity drag</span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                    {impact.riskDescription}
                  </p>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Priority Matrix Chart */}
          <ResultSection title="Priority Matrix">
            <DebtPriorityMatrix data={analysis.priorityMatrix} />
            <div className="mt-4 space-y-2">
              {analysis.priorityMatrix.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  {quadrantLabel(item.quadrant)}
                  <div>
                    <span className="text-sm font-medium">{item.debtItemName}</span>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Annual Cost Chart */}
          <ResultSection title="Annual Cost by Item">
            <AnnualCostBar data={analysis.roiCalculations} />
          </ResultSection>

          {/* ROI Table */}
          <ResultSection title="ROI Calculations">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                    <th className="pb-2 text-left font-medium">Item</th>
                    <th className="pb-2 text-right font-medium">Fix Cost</th>
                    <th className="pb-2 text-right font-medium">Annual Savings</th>
                    <th className="pb-2 text-right font-medium">Payback</th>
                    <th className="pb-2 text-right font-medium">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.roiCalculations.map((roi, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)]">
                      <td className="py-2 text-sm">{roi.debtItemName}</td>
                      <td className="py-2 text-right text-sm">€{roi.fixCostEur.toLocaleString()}</td>
                      <td className="py-2 text-right text-sm">€{roi.annualSavingsEur.toLocaleString()}</td>
                      <td className="py-2 text-right text-sm">{roi.paybackMonths}mo</td>
                      <td className={`py-2 text-right text-sm font-medium ${roi.roiPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {roi.roiPercent > 0 ? "+" : ""}{roi.roiPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultSection>

          {/* Repayment Plan */}
          <ResultSection title="Quarterly Repayment Plan">
            <div className="space-y-4">
              {analysis.repaymentPlan.map((quarter, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold">{quarter.quarter}</h4>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {quarter.sprintAllocation} sprints · €{quarter.costEur.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quarter.debtItems.map((item, j) => (
                      <span
                        key={j}
                        className="rounded bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                    Expected: {quarter.expectedVelocityGain}
                  </p>
                  <p className="mt-1 text-xs font-medium">
                    Milestone: {quarter.milestone}
                  </p>
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
