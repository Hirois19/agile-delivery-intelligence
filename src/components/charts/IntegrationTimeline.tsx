"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import type { PlaybookPhase, IntegrationRisk, ToolingCategory } from "@/lib/mna-types";

// ---- Phase Timeline (Gantt-style) ----

const PHASE_COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e"];

interface PhaseTimelineProps {
  phases: PlaybookPhase[];
}

export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  let cumulativeWeeks = 0;
  const chartData = phases.map((p, i) => {
    const start = cumulativeWeeks;
    cumulativeWeeks += p.durationWeeks;
    return {
      name: p.phaseName,
      start,
      duration: p.durationWeeks,
      end: cumulativeWeeks,
      color: PHASE_COLORS[i % PHASE_COLORS.length],
      milestones: p.milestones,
    };
  });

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={Math.max(160, phases.length * 50)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            type="number"
            domain={[0, cumulativeWeeks]}
            tick={{ fontSize: 11 }}
            stroke="var(--color-text-secondary)"
            tickFormatter={(v) => `W${v}`}
          />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-text-secondary)" width={90} />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
                  <p className="font-medium">{d.name}</p>
                  <p>Week {d.start + 1} — Week {d.end} ({d.duration} weeks)</p>
                  {d.milestones.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {d.milestones.map((m: string, i: number) => (
                        <li key={i}>&#8226; {m}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }}
          />
          <Bar dataKey="duration" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 text-xs">
        {chartData.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--color-text-secondary)]">{d.name} (W{d.start + 1}-{d.end})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- Risk Radar ----

interface RiskRadarProps {
  risks: IntegrationRisk[];
}

const SEVERITY_SCORE: Record<string, number> = { high: 9, medium: 5, low: 2 };

export function RiskRadar({ risks }: RiskRadarProps) {
  const categories = ["culture", "process", "tooling", "communication", "technical"];
  const radarData = categories.map((cat) => {
    const catRisks = risks.filter((r) => r.category === cat);
    const avgScore = catRisks.length > 0
      ? catRisks.reduce((sum, r) => sum + (SEVERITY_SCORE[r.severity] ?? 2), 0) / catRisks.length
      : 0;
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      score: Math.round(avgScore * 10) / 10,
      count: catRisks.length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
        <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9 }} stroke="var(--color-border)" />
        <Radar dataKey="score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
                <p className="font-medium">{d.category}</p>
                <p>Risk score: {d.score}/10 ({d.count} risks)</p>
              </div>
            );
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ---- Tooling Gap Matrix ----

interface ToolingGapMatrixProps {
  categories: ToolingCategory[];
}

const GAP_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  none: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function ToolingGapMatrix({ categories }: ToolingGapMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
            <th className="pb-2 text-left font-medium">Category</th>
            <th className="pb-2 text-left font-medium">Acquirer</th>
            <th className="pb-2 text-left font-medium">Acquired</th>
            <th className="pb-2 text-center font-medium">Gap</th>
            <th className="pb-2 text-left font-medium">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]">
              <td className="py-2 font-medium">{cat.category}</td>
              <td className="py-2">{cat.acquirerTool}</td>
              <td className="py-2">{cat.acquiredTool}</td>
              <td className="py-2 text-center">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${GAP_COLORS[cat.gapSeverity] ?? GAP_COLORS.low}`}>
                  {cat.gapSeverity === "none" ? "Same" : cat.gapSeverity}
                </span>
              </td>
              <td className="py-2 text-xs text-[var(--color-text-secondary)]">{cat.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
