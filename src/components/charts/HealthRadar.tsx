"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { HealthDimension } from "@/lib/types";

interface HealthRadarProps {
  dimensions: Record<string, HealthDimension>;
}

export function HealthRadar({ dimensions }: HealthRadarProps) {
  const data = Object.entries(dimensions).map(([key, dim]) => ({
    dimension: key.charAt(0).toUpperCase() + key.slice(1),
    score: dim.score,
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: "var(--color-text-secondary)", fontSize: 10 }}
        />
        <Radar
          name="Health"
          dataKey="score"
          stroke="var(--color-accent)"
          fill="var(--color-accent)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
