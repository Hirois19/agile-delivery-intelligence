"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Label,
} from "recharts";
import type { HeatmapCell, FeatureBreakdownItem } from "@/lib/estimation-types";

// ---- Heatmap (table-based) ----

function accuracyColor(pct: number): string {
  if (pct >= 90 && pct <= 110) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (pct >= 70 && pct < 90) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  if (pct > 110 && pct <= 130) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  if (pct < 70) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  return "bg-blue-200 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300";
}

interface BiasHeatmapProps {
  data: HeatmapCell[];
}

export function BiasHeatmap({ data }: BiasHeatmapProps) {
  // Build grid: rows = storyType, cols = dimension (sprint/PI)
  const types = [...new Set(data.map((d) => d.storyType))];
  const dims = [...new Set(data.map((d) => d.dimension))];

  const lookup = new Map<string, HeatmapCell>();
  data.forEach((d) => lookup.set(`${d.storyType}|${d.dimension}`, d));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-green-200" /> Accurate (90-110%)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-200" /> Overestimated (70-90%)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-red-200" /> Underestimated (&lt;70%)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-blue-200" /> Overestimated (&gt;110%)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="pb-2 text-left font-medium text-[var(--color-text-secondary)]">Type</th>
              {dims.map((d) => (
                <th key={d} className="pb-2 text-center font-medium text-[var(--color-text-secondary)]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type}>
                <td className="py-1 pr-2 font-medium">{type}</td>
                {dims.map((dim) => {
                  const cell = lookup.get(`${type}|${dim}`);
                  if (!cell) return <td key={dim} className="py-1 px-1 text-center">—</td>;
                  return (
                    <td key={dim} className="py-1 px-1">
                      <div className={`rounded px-2 py-1 text-center font-medium ${accuracyColor(cell.accuracyPercent)}`}>
                        {cell.accuracyPercent}%
                        <div className="text-[10px] font-normal opacity-70">
                          {cell.estimatedAvg}→{cell.actualAvg} (n={cell.sampleSize})
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Estimation Scatter ----

interface EstimationScatterProps {
  data: HeatmapCell[];
}

export function EstimationScatter({ data }: EstimationScatterProps) {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.estimatedAvg, d.actualAvg)),
    10
  );
  const domain = [0, Math.ceil(maxVal * 1.2)];

  const chartData = data.map((d) => ({
    x: d.estimatedAvg,
    y: d.actualAvg,
    name: `${d.storyType} (${d.dimension})`,
    type: d.storyType,
  }));

  const typeColors: Record<string, string> = {
    feature: "#3b82f6",
    bug: "#ef4444",
    tech_debt: "#a3a3a3",
    Feature: "#3b82f6",
    Bug: "#ef4444",
    "Tech Debt": "#a3a3a3",
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(typeColors).slice(0, 3).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[var(--color-text-secondary)]">{key}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis type="number" dataKey="x" domain={domain} tick={{ fontSize: 11 }} stroke="var(--color-text-secondary)">
            <Label value="Estimated SP →" position="bottom" offset={10} style={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
          </XAxis>
          <YAxis type="number" dataKey="y" domain={domain} tick={{ fontSize: 11 }} stroke="var(--color-text-secondary)">
            <Label value="Actual SP →" angle={-90} position="left" offset={10} style={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
          </YAxis>
          <ReferenceLine segment={[{ x: domain[0], y: domain[0] }, { x: domain[1], y: domain[1] }]} stroke="var(--color-accent)" strokeDasharray="5 5" label={{ value: "Perfect estimate", position: "insideTopLeft", fontSize: 10, fill: "var(--color-text-secondary)" }} />
          <Tooltip content={({ payload }) => {
            if (!payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
                <p className="font-medium">{d.name}</p>
                <p>Est: {d.x} SP → Actual: {d.y} SP</p>
              </div>
            );
          }} />
          <Scatter data={chartData}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={typeColors[entry.type] ?? "#6b7280"} r={6} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-xs text-[var(--color-text-secondary)] text-center">
        Points above the diagonal = underestimated. Below = overestimated.
      </p>
    </div>
  );
}

// ---- Feature Blowup Chart (PI Mode) ----

const ROOT_CAUSE_COLORS: Record<string, string> = {
  poor_breakdown: "#ef4444",
  hidden_complexity: "#f97316",
  dependency_cost: "#eab308",
  scope_creep: "#8b5cf6",
  unknown_unknowns: "#6b7280",
};

const ROOT_CAUSE_LABELS: Record<string, string> = {
  poor_breakdown: "Poor Breakdown",
  hidden_complexity: "Hidden Complexity",
  dependency_cost: "Dependency Cost",
  scope_creep: "Scope Creep",
  unknown_unknowns: "Unknown Unknowns",
};

interface FeatureBlowupChartProps {
  data: FeatureBreakdownItem[];
}

export function FeatureBlowupChart({ data }: FeatureBlowupChartProps) {
  const sorted = [...data].sort((a, b) => b.blowupRatio - a.blowupRatio);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(ROOT_CAUSE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ROOT_CAUSE_COLORS[key] }} />
            <span className="text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.map((item, i) => {
          const maxSP = Math.max(item.piPlanningEstimateSP, item.actualTotalSP);
          const estWidth = (item.piPlanningEstimateSP / maxSP) * 100;
          const actWidth = (item.actualTotalSP / maxSP) * 100;
          const color = ROOT_CAUSE_COLORS[item.rootCause] ?? "#6b7280";

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{item.featureName}</span>
                <span className="font-bold" style={{ color }}>
                  {item.blowupRatio.toFixed(1)}x
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] text-[var(--color-text-secondary)]">Planned</span>
                  <div className="flex-1 h-4 bg-neutral-100 rounded dark:bg-neutral-800">
                    <div className="h-full rounded bg-neutral-400" style={{ width: `${estWidth}%` }} />
                  </div>
                  <span className="w-12 text-[10px] text-right">{item.piPlanningEstimateSP} SP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] text-[var(--color-text-secondary)]">Actual</span>
                  <div className="flex-1 h-4 bg-neutral-100 rounded dark:bg-neutral-800">
                    <div className="h-full rounded" style={{ width: `${actWidth}%`, backgroundColor: color }} />
                  </div>
                  <span className="w-12 text-[10px] text-right">{item.actualTotalSP} SP</span>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                {ROOT_CAUSE_LABELS[item.rootCause]}: {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
