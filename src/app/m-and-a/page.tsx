"use client";

import { useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { DataInput } from "@/components/ui/DataInput";
import { MnAForm } from "@/components/ui/MnAForm";
import { ResultSection } from "@/components/ui/AnalysisResult";
import { JudgmentLayer } from "@/components/ui/JudgmentLayer";
import { PhaseTimeline, RiskRadar, ToolingGapMatrix } from "@/components/charts/IntegrationTimeline";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ExportButton } from "@/components/ui/ExportButton";
import { MNA_SAMPLES } from "@/lib/mna-sample-data";
import type { MnAIntegrationAnalysis } from "@/lib/mna-types";
import type { ExportableTask } from "@/lib/export-tasks";
import { AnalyticsTracker, track } from "@/components/ui/AnalyticsTracker";

type InputMode = "guided" | "paste";

function riskBadge(severity: string) {
  const map: Record<string, { text: string; className: string }> = {
    high: { text: "High", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    medium: { text: "Medium", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    low: { text: "Low", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  };
  const item = map[severity] ?? map.low;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}>{item.text}</span>;
}

function categoryBadge(cat: string) {
  const colors: Record<string, string> = {
    culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    process: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    tooling: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    communication: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    technical: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[cat] ?? colors.technical}`}>{cat}</span>;
}

export default function MnAPage() {
  const [analysis, setAnalysis] = useState<MnAIntegrationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("guided");

  async function handleAnalyze(data: string) {
    track("analyze", "m-and-a");
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-mna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, scenarioId: selectedScenarioId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: MnAIntegrationAnalysis = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="M&A Integration Playbook"
      subtitle="Generate a phased integration playbook for post-acquisition agile team merges — with tooling gap analysis, team reorganization plan, and lessons from real M&A experience."
    >
      <AnalyticsTracker module="m-and-a" />
      {/* How It Works */}
      <div className="mb-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">How It Works</h2>
        <ol className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">1.</span>
            <span><strong>Describe both sides</strong> — team profiles, tooling inventory, and stakeholder dynamics for acquirer and acquired teams.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">2.</span>
            <span><strong>Set the constraints</strong> — integration goal, timeline, deadlines, and non-negotiables.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">3.</span>
            <span><strong>Get a playbook</strong> — phased plan, risk register, tooling migration strategy, team reorg plan, communication plan, and Do First / Never Do checklist from real M&amp;A experience.</span>
          </li>
        </ol>
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Try it with sample data:{" "}
          <button type="button" onClick={() => setInputMode("paste")} className="text-[var(--color-accent)] hover:underline">Switch to Paste Data</button>{" "}
          and load a scenario (same-tool merge, cross-border NL-DE, or resistant team).
        </p>
      </div>

      <div className="mb-6">
        <PrivacyNotice />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button onClick={() => setInputMode("guided")} className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${inputMode === "guided" ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}>Guided Form</button>
        <button onClick={() => setInputMode("paste")} className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${inputMode === "paste" ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}>Paste Data</button>
      </div>

      {inputMode === "guided" && <MnAForm onSubmit={handleAnalyze} isLoading={isLoading} />}
      {inputMode === "paste" && (
        <DataInput
          label="M&A Integration Data"
          placeholder={`Describe the integration scenario:\n\n- Acquirer team(s): size, stack, methodology, culture\n- Acquired team(s): same\n- Tooling each side uses\n- Integration goal and timeline\n- Key stakeholders and their stance\n- Constraints and context`}
          helpText="The more detail about team culture, tooling differences, and political dynamics, the more actionable the playbook."
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          samples={MNA_SAMPLES}
          onSampleLoad={(id) => { setSelectedScenarioId(id); track("sample_load", "m-and-a", { scenarioId: id }); }}
        />
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}

      {analysis && (
        <div className="mt-10 space-y-8">
          {/* Executive Summary */}
          <ResultSection title="Executive Summary">
            <p className="text-sm leading-relaxed">{analysis.executiveSummary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Overall Risk</p>
                <p className="mt-1">{riskBadge(analysis.overallRiskLevel)}</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Estimated Duration</p>
                <p className="mt-1 text-xl font-bold">{analysis.estimatedIntegrationWeeks} weeks</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Risks Identified</p>
                <p className="mt-1 text-xl font-bold">{analysis.risks.length}</p>
              </div>
            </div>
          </ResultSection>

          {/* Phase Timeline */}
          <ResultSection title="Integration Timeline">
            <PhaseTimeline phases={analysis.playbook} />
          </ResultSection>

          {/* Risk Radar */}
          <ResultSection title="Risk Profile">
            <RiskRadar risks={analysis.risks} />
            <div className="mt-4 space-y-3">
              {analysis.risks.map((risk, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    {riskBadge(risk.severity)}
                    {categoryBadge(risk.category)}
                    <span className="text-sm font-medium">{risk.riskName}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">{risk.description}</p>
                  <p className="mt-1.5 text-xs text-[var(--color-accent)]">Mitigation: {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Tooling Gap */}
          <ResultSection title="Tooling Gap Analysis">
            <ToolingGapMatrix categories={analysis.toolingAnalysis.categories} />
            <div className="mt-4 rounded-md border border-[var(--color-border)] p-3">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">Migration Strategy</p>
              <p className="mt-1 text-sm">{analysis.toolingAnalysis.recommendation}</p>
              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Priority: {analysis.toolingAnalysis.migrationPriority.join(" → ")}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Estimated migration: {analysis.toolingAnalysis.estimatedMigrationWeeks} weeks
              </p>
            </div>
          </ResultSection>

          {/* Team Reorg */}
          <ResultSection title="Team Reorganization Plan">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Current State</p>
                {analysis.teamReorgPlan.currentState.map((team, i) => (
                  <div key={i} className="mb-2 rounded-md border border-[var(--color-border)] p-2">
                    <p className="text-sm font-medium">{team.teamName} ({team.members})</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{team.methodology} · {team.keySkills.join(", ")}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Proposed State</p>
                {analysis.teamReorgPlan.proposedState.map((team, i) => (
                  <div key={i} className="mb-2 rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent-light)]/10 p-2">
                    <p className="text-sm font-medium">{team.teamName} ({team.members})</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{team.methodology} · {team.keySkills.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
            {analysis.teamReorgPlan.retentionRisks.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-red-600 dark:text-red-400">Retention Risks:</p>
                <ul className="mt-1 space-y-1">
                  {analysis.teamReorgPlan.retentionRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-[var(--color-text-secondary)]">&#8226; {risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </ResultSection>

          {/* Playbook Phases */}
          <ResultSection title="Integration Playbook">
            <div className="space-y-4">
              {analysis.playbook.map((phase, i) => (
                <div key={i} className="rounded-md border border-[var(--color-border)] p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold">Phase {phase.phaseNumber}: {phase.phaseName}</h4>
                    <span className="text-xs text-[var(--color-text-secondary)]">{phase.durationWeeks} weeks</span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)]">Key Activities</p>
                      <ul className="mt-1 space-y-0.5">{phase.keyActivities.map((a, j) => <li key={j} className="text-xs">&#8226; {a}</li>)}</ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)]">Milestones</p>
                      <ul className="mt-1 space-y-0.5">{phase.milestones.map((m, j) => <li key={j} className="text-xs">&#10003; {m}</li>)}</ul>
                    </div>
                  </div>
                  {phase.antiPatterns.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">Anti-Patterns (Never Do)</p>
                      <ul className="mt-1 space-y-0.5">{phase.antiPatterns.map((a, j) => <li key={j} className="text-xs text-[var(--color-text-secondary)]">&#10007; {a}</li>)}</ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Do First / Never Do */}
          <ResultSection title="Do First / Never Do Checklist">
            <div className="mb-4">
              <ExportButton
                filenamePrefix="mna-integration-actions"
                tasks={[
                  ...analysis.doFirstNeverDoChecklist.doFirst.map((item, i): ExportableTask => ({
                    title: `[DO FIRST] ${item}`,
                    description: item,
                    priority: i < 3 ? "Critical" : "High",
                    type: "Integration Action",
                    module: "M&A Integration Playbook",
                    urgency: "Do First",
                  })),
                  ...analysis.playbook.flatMap((phase) =>
                    phase.keyActivities.map((activity): ExportableTask => ({
                      title: `[${phase.phaseName}] ${activity}`,
                      description: `Phase ${phase.phaseNumber}: ${phase.phaseName} (${phase.durationWeeks} weeks)`,
                      priority: phase.phaseNumber <= 2 ? "High" : "Medium",
                      type: "Integration Activity",
                      module: "M&A Integration Playbook",
                      urgency: phase.phaseName,
                    }))
                  ),
                ]}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">DO FIRST</p>
                <ul className="space-y-1.5">
                  {analysis.doFirstNeverDoChecklist.doFirst.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs"><span className="text-green-600 shrink-0">&#10003;</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">NEVER DO</p>
                <ul className="space-y-1.5">
                  {analysis.doFirstNeverDoChecklist.neverDo.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs"><span className="text-red-600 shrink-0">&#10007;</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ResultSection>

          {/* Communication Plan */}
          <ResultSection title="Communication Plan">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                    <th className="pb-2 text-left font-medium">Audience</th>
                    <th className="pb-2 text-left font-medium">Channel</th>
                    <th className="pb-2 text-left font-medium">Frequency</th>
                    <th className="pb-2 text-left font-medium">Key Message</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.communicationPlan.map((item, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)]">
                      <td className="py-2 font-medium">{item.audience}</td>
                      <td className="py-2">{item.channel}</td>
                      <td className="py-2">{item.frequency}</td>
                      <td className="py-2 text-[var(--color-text-secondary)]">{item.keyMessage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultSection>

          {/* PM Judgment Layer */}
          <ResultSection title="PM Judgment Layer">
            <div className="space-y-4">
              {analysis.judgmentLayers.map((layer, i) => (
                <JudgmentLayer key={i} aiSuggestion={layer.aiSuggestion} pmJudgment={layer.pmJudgment} rationale={layer.rationale} />
              ))}
            </div>
          </ResultSection>
        </div>
      )}
    </ModuleLayout>
  );
}
