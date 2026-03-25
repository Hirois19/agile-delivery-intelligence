"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
  BarChart,
  Bar,
} from "recharts";
import type { PriorityMatrixItem, ROICalculation } from "@/lib/tech-debt-types";

const QUADRANT_COLORS: Record<string, string> = {
  quick_win: "#22c55e",
  strategic: "#3b82f6",
  fill_in: "#a3a3a3",
  deprioritize: "#ef4444",
};

const QUADRANT_LABELS: Record<string, string> = {
  quick_win: "Quick Win",
  strategic: "Strategic",
  fill_in: "Fill-in",
  deprioritize: "Deprioritize",
};

interface DebtPriorityMatrixProps {
  data: PriorityMatrixItem[];
}

export function DebtPriorityMatrix({ data }: DebtPriorityMatrixProps) {
  const chartData = data.map((item) => ({
    x: item.fixCostScore,
    y: item.businessImpactScore,
    name: item.debtItemName,
    quadrant: item.quadrant,
  }));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(QUADRANT_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: QUADRANT_COLORS[key] }}
            />
            <span className="text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            stroke="var(--color-text-secondary)"
          >
            <Label
              value="Fix Cost →"
              position="bottom"
              offset={10}
              style={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            stroke="var(--color-text-secondary)"
          >
            <Label
              value="Business Impact →"
              angle={-90}
              position="left"
              offset={10}
              style={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            />
          </YAxis>
          <ReferenceLine x={50} stroke="var(--color-border)" strokeDasharray="3 3" />
          <ReferenceLine y={50} stroke="var(--color-border)" strokeDasharray="3 3" />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
                  <p className="font-medium">{d.name}</p>
                  <p className="text-[var(--color-text-secondary)]">
                    {QUADRANT_LABELS[d.quadrant]}
                  </p>
                </div>
              );
            }}
          />
          <Scatter data={chartData}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={QUADRANT_COLORS[entry.quadrant] ?? "#a3a3a3"}
                r={8}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AnnualCostBarProps {
  data: ROICalculation[];
}

export function AnnualCostBar({ data }: AnnualCostBarProps) {
  const sorted = [...data].sort((a, b) => b.annualSavingsEur - a.annualSavingsEur);
  const chartData = sorted.map((d) => ({
    name: d.debtItemName.length > 25 ? d.debtItemName.slice(0, 25) + "..." : d.debtItemName,
    annualCost: d.annualSavingsEur,
    fixCost: d.fixCostEur,
    payback: d.paybackMonths,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 50)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          stroke="var(--color-text-secondary)"
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          stroke="var(--color-text-secondary)"
          width={110}
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.[0]) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
                <p className="font-medium">{d.name}</p>
                <p>Annual cost: €{d.annualCost.toLocaleString()}</p>
                <p>Fix cost: €{d.fixCost.toLocaleString()}</p>
                <p>Payback: {d.payback} months</p>
              </div>
            );
          }}
        />
        <Bar dataKey="annualCost" fill="#ef4444" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
