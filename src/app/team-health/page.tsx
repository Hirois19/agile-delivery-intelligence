"use client";

import { useState } from "react";
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { DataInput } from "@/components/ui/DataInput";
import { GuidedForm } from "@/components/ui/GuidedForm";
import { ScoreCard, ResultSection } from "@/components/ui/AnalysisResult";
import { JudgmentLayer } from "@/components/ui/JudgmentLayer";
import { HealthRadar } from "@/components/charts/HealthRadar";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ExportButton } from "@/components/ui/ExportButton";
import { TEAM_HEALTH_SAMPLES } from "@/lib/sample-data";
import type { TeamHealthAnalysis } from "@/lib/types";
import type { ExportableTask } from "@/lib/export-tasks";
import { urgencyToPriority } from "@/lib/export-tasks";
import { AnalyticsTracker, track } from "@/components/ui/AnalyticsTracker";

type InputMode = "guided" | "paste";

function scoreColor(score: number): "success" | "warning" | "danger" {
  if (score >= 7) return "success";
  if (score >= 4) return "warning";
  return "danger";
}

function urgencyLabel(urgency: string) {
  const map: Record<string, { text: string; className: string }> = {
    act_now: {
      text: "Act Now",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    next_retro: {
      text: "Next Retro",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    monitor: {
      text: "Monitor",
      className:
        "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    },
  };
  const item = map[urgency] ?? map.monitor;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.className}`}
    >
      {item.text}
    </span>
  );
}

function trendIcon(trend: string) {
  if (trend === "improving") return "↑";
  if (trend === "declining") return "↓";
  return "→";
}

function severityDot(severity: string) {
  const colors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-neutral-400",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[severity] ?? colors.low}`}
    />
  );
}

export default function TeamHealthPage() {
  const [analysis, setAnalysis] = useState<TeamHealthAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("guided");

  async function handleAnalyze(data: string) {
    track("analyze", "team-health");
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, scenarioId: selectedScenarioId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const result: TeamHealthAnalysis = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModuleLayout
      title="Team Health Diagnostic"
      subtitle="AI-powered multi-signal analysis that goes beyond dashboards — diagnosing why your team struggles, not just that it does."
    >
      <AnalyticsTracker module="team-health" />
      {/* How It Works */}
      <div className="mb-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          How It Works
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">1.</span>
            <span>
              <strong>Provide your team data</strong> — Use the{" "}
              <strong>Guided Form</strong> to enter data step by step (you can
              also upload a CSV/Excel file to auto-fill sprint velocity). Or
              switch to <strong>Paste Data</strong> to paste raw text directly.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">2.</span>
            <span>
              <strong>AI analyzes multiple signals</strong> — Sprint velocity
              trends, retrospective themes, PR metrics, and team context are
              cross-referenced to identify root causes.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[var(--color-text)]">3.</span>
            <span>
              <strong>Get actionable results</strong> — Health scores, root
              cause analysis, prioritized actions, and a PM Judgment Layer
              showing what AI suggests vs. what an experienced SM/PM should
              actually do.
            </span>
          </li>
        </ol>
        <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
          Want to see it in action first?{" "}
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className="text-[var(--color-accent)] hover:underline"
          >
            Switch to Paste Data
          </button>{" "}
          and load one of the pre-built sample scenarios (Scrum adoption, SAFe
          PI Planning, or post-M&amp;A integration).
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

      {/* Guided Form */}
      {inputMode === "guided" && (
        <GuidedForm onSubmit={handleAnalyze} isLoading={isLoading} />
      )}

      {/* Paste Mode */}
      {inputMode === "paste" && (
        <DataInput
          label="Team Data"
          placeholder={`Paste your sprint data here. Include any of:\n\n- Sprint velocity (planned vs completed story points)\n- Retrospective themes/comments\n- PR metrics (cycle time, review turnaround)\n- Team composition and context\n\nThe more data you provide, the richer the diagnosis.`}
          helpText="Supports free-text, tables, or structured data. Minimum: 3 sprints of velocity + retro notes."
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          samples={TEAM_HEALTH_SAMPLES}
          onSampleLoad={(id) => { setSelectedScenarioId(id); track("sample_load", "team-health", { scenarioId: id }); }}
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
              Overall Team Health
            </p>
            <p
              className={`mt-1 text-5xl font-bold ${
                analysis.overallScore >= 70
                  ? "text-[var(--color-success)]"
                  : analysis.overallScore >= 40
                  ? "text-[var(--color-warning)]"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {analysis.overallScore}
              <span className="text-lg font-normal text-[var(--color-text-secondary)]">
                /100
              </span>
            </p>
          </div>

          {/* Dimension Scores */}
          <ResultSection title="Health Dimensions">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(analysis.dimensions).map(([key, dim]) => (
                <div key={key}>
                  <ScoreCard
                    label={`${key} ${trendIcon(dim.trend)}`}
                    score={dim.score}
                    maxScore={10}
                    color={scoreColor(dim.score)}
                  />
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                    {dim.rationale}
                  </p>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Radar Chart */}
          <ResultSection title="Health Profile">
            <HealthRadar dimensions={analysis.dimensions} />
          </ResultSection>

          {/* Root Causes */}
          <ResultSection title="Root Cause Analysis">
            <div className="space-y-4">
              {analysis.rootCauses.map((cause, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5">{severityDot(cause.severity)}</div>
                  <div>
                    <p className="text-sm font-medium">{cause.finding}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      Evidence: {cause.evidence}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ResultSection>

          {/* Action Items */}
          <ResultSection title="Recommended Actions">
            <div className="mb-4">
              <ExportButton
                filenamePrefix="team-health-actions"
                tasks={analysis.actionItems.map((item): ExportableTask => ({
                  title: item.action,
                  description: `Type: ${item.type}. ${item.expectedOutcome}`,
                  priority: urgencyToPriority(item.urgency),
                  type: item.type,
                  module: "Team Health Diagnostic",
                  urgency: item.urgency === "act_now" ? "Act Now" : item.urgency === "next_retro" ? "Next Retro" : "Monitor",
                  expectedOutcome: item.expectedOutcome,
                }))}
              />
            </div>
            <div className="space-y-3">
              {analysis.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-[var(--color-border)] p-3"
                >
                  <div className="mt-0.5">{urgencyLabel(item.urgency)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      Type: {item.type} &middot; Expected: {item.expectedOutcome}
                    </p>
                  </div>
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
