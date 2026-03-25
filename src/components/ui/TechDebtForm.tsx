"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import type { TechDebtFormData, DebtItemRow, SprintEconomics } from "@/lib/tech-debt-form-types";
import {
  createEmptyDebtFormData,
  createEmptyDebtItem,
  calcCostPerSP,
  techDebtFormDataToText,
} from "@/lib/tech-debt-form-types";

interface TechDebtFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
        {step}
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";
const numberInputClass = `${inputClass} text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

export function TechDebtForm({ onSubmit, isLoading = false }: TechDebtFormProps) {
  const [formData, setFormData] = useState<TechDebtFormData>(createEmptyDebtFormData());

  const costPerSP = useMemo(() => calcCostPerSP(formData.economics), [formData.economics]);

  // Economics
  const updateEconomics = <K extends keyof SprintEconomics>(key: K, value: SprintEconomics[K]) => {
    setFormData((prev) => ({
      ...prev,
      economics: { ...prev.economics, [key]: value },
    }));
  };

  // Debt Items
  const updateDebtItem = (index: number, field: keyof DebtItemRow, value: string | number | null) => {
    setFormData((prev) => {
      const items = [...prev.debtItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, debtItems: items };
    });
  };

  const addDebtItem = () => {
    setFormData((prev) => ({
      ...prev,
      debtItems: [...prev.debtItems, createEmptyDebtItem()],
    }));
  };

  const removeDebtItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      debtItems: prev.debtItems.filter((_, i) => i !== index),
    }));
  };

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  function normalizeHeader(h: string): string {
    return h.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function detectCol(header: string, patterns: string[]): boolean {
    const norm = normalizeHeader(header);
    return patterns.some((p) => norm.includes(p));
  }

  const processFile = useCallback((file: File) => {
    setUploadError(null);
    setUploadFileName(file.name);
    setUploadCount(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (rows.length === 0) {
          setUploadError("No data found in the file.");
          return;
        }

        const headers = Object.keys(rows[0]);
        const nameCol = headers.find((h) => detectCol(h, ["name", "title", "item", "debt"]));
        const descCol = headers.find((h) => detectCol(h, ["desc", "detail", "summary"]));
        const compCol = headers.find((h) => detectCol(h, ["component", "service", "module", "affected"]));
        const fixCol = headers.find((h) => detectCol(h, ["fix", "effort", "estimate", "cost"]));
        const velCol = headers.find((h) => detectCol(h, ["velocity", "impact", "drag", "lost"]));
        const sevCol = headers.find((h) => detectCol(h, ["severity", "priority", "level"]));

        if (!nameCol) {
          setUploadError("Could not detect a 'Name' column. Expected columns: Name, Description, Fix Effort, Velocity Impact, Severity");
          return;
        }

        const toNum = (val: unknown): number | null => {
          if (typeof val === "number") return val;
          if (typeof val === "string") {
            const n = parseFloat(val);
            return isNaN(n) ? null : n;
          }
          return null;
        };

        const toSeverity = (val: unknown): DebtItemRow["engineerSeverity"] => {
          if (!val) return "";
          const s = String(val).toLowerCase().trim();
          if (s === "critical") return "critical";
          if (s === "high") return "high";
          if (s === "medium") return "medium";
          if (s === "low") return "low";
          return "";
        };

        const items: DebtItemRow[] = rows
          .filter((row) => row[nameCol] && String(row[nameCol]).trim())
          .map((row) => ({
            name: String(row[nameCol] ?? "").trim(),
            description: descCol ? String(row[descCol] ?? "").trim() : "",
            affectedComponents: compCol ? String(row[compCol] ?? "").trim() : "",
            fixEffortSP: fixCol ? toNum(row[fixCol]) : null,
            velocityImpactSP: velCol ? toNum(row[velCol]) : null,
            engineerSeverity: sevCol ? toSeverity(row[sevCol]) : "",
          }));

        if (items.length === 0) {
          setUploadError("No valid debt items found in the file.");
          return;
        }

        setUploadCount(items.length);
        setFormData((prev) => ({ ...prev, debtItems: items }));
      } catch {
        setUploadError("Failed to parse file. Please check the format.");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = techDebtFormDataToText(formData);
    if (text.trim()) onSubmit(text);
  };

  const hasData = formData.debtItems.some((d) => d.name.trim());

  // Calculate totals
  const totalFixSP = formData.debtItems.reduce((sum, d) => sum + (d.fixEffortSP ?? 0), 0);
  const totalFixEur = costPerSP ? totalFixSP * costPerSP : null;
  const totalVelocityLossSP = formData.debtItems.reduce((sum, d) => sum + (d.velocityImpactSP ?? 0), 0);
  const totalAnnualLossEur =
    costPerSP && formData.economics.sprintsPerYear
      ? totalVelocityLossSP * formData.economics.sprintsPerYear * costPerSP
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Sprint Economics */}
      <div className="space-y-3">
        <SectionHeader
          step={1}
          title="Team & Sprint Economics"
          description="These numbers are used to convert story points into EUR — making tech debt visible to stakeholders."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <Label>Team Name</Label>
            <input
              type="text"
              value={formData.economics.teamName}
              onChange={(e) => updateEconomics("teamName", e.target.value)}
              placeholder="e.g. Platform Team"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Average Velocity (SP/sprint)</Label>
            <input
              type="number"
              min={1}
              value={formData.economics.avgVelocity ?? ""}
              onChange={(e) =>
                updateEconomics("avgVelocity", e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="e.g. 30"
              className={numberInputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Sprint Length (weeks)</Label>
            <input
              type="number"
              min={1}
              max={6}
              value={formData.economics.sprintLengthWeeks ?? ""}
              onChange={(e) =>
                updateEconomics("sprintLengthWeeks", e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="2"
              className={numberInputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Team Cost / Sprint (EUR)</Label>
            <input
              type="number"
              min={0}
              value={formData.economics.teamCostPerSprintEur ?? ""}
              onChange={(e) =>
                updateEconomics("teamCostPerSprintEur", e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="e.g. 25000"
              className={numberInputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Sprints / Year</Label>
            <input
              type="number"
              min={1}
              value={formData.economics.sprintsPerYear ?? ""}
              onChange={(e) =>
                updateEconomics("sprintsPerYear", e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="26"
              className={numberInputClass}
            />
          </div>
        </div>

        {/* SP → EUR Conversion Card */}
        {costPerSP && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent-light)]/10 p-3 text-center">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Cost per Story Point
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-accent)]">
                €{costPerSP.toLocaleString()}
              </p>
            </div>
            {totalFixEur !== null && totalFixSP > 0 && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Total Fix Cost
                </p>
                <p className="mt-1 text-xl font-bold">
                  €{totalFixEur.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">{totalFixSP} SP</p>
              </div>
            )}
            {totalAnnualLossEur !== null && totalVelocityLossSP > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-900/20">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Annual Loss (if unfixed)
                </p>
                <p className="mt-1 text-xl font-bold text-[var(--color-danger)]">
                  €{totalAnnualLossEur.toLocaleString()}/yr
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {totalVelocityLossSP} SP/sprint lost
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Import Debt Items (optional) */}
      <div className="space-y-3">
        <SectionHeader
          step={2}
          title="Import Debt Items (optional)"
          description="Upload a CSV or Excel file to auto-fill the debt items below. Expected columns: Name, Description, Fix Effort (SP), Velocity Impact, Severity."
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]/20"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            className="hidden"
          />
          <div className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-accent)]">Upload CSV or Excel</span>{" "}or drag and drop
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Expected columns: Name, Description, Affected Components, Fix Effort (SP), Velocity Impact, Severity
          </p>
        </div>
        {uploadFileName && !uploadError && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <span>&#10003;</span>
            <span>{uploadFileName} — {uploadCount} debt items loaded into form</span>
          </div>
        )}
        {uploadError && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {uploadError}
          </div>
        )}
      </div>

      {/* Step 3: Tech Debt Items */}
      <div className="space-y-3">
        <SectionHeader
          step={3}
          title="Tech Debt Items"
          description="List each piece of technical debt. The more detail, the better the business translation."
        />
        <div className="space-y-4">
          {formData.debtItems.map((item, i) => (
            <div
              key={i}
              className="group rounded-lg border border-[var(--color-border)] p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Debt Item {i + 1}
                  {item.fixEffortSP && costPerSP
                    ? ` — Fix: €${(item.fixEffortSP * costPerSP).toLocaleString()}`
                    : ""}
                </span>
                {formData.debtItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDebtItem(i)}
                    className="text-neutral-400 hover:text-red-500 text-sm"
                  >
                    &times;
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateDebtItem(i, "name", e.target.value)}
                    placeholder="e.g. Deprecated REST API v1"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Affected Components</Label>
                  <input
                    type="text"
                    value={item.affectedComponents}
                    onChange={(e) => updateDebtItem(i, "affectedComponents", e.target.value)}
                    placeholder="e.g. Payment service, User API"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateDebtItem(i, "description", e.target.value)}
                  placeholder="What is this debt and why does it exist?"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label>Fix Effort (SP)</Label>
                  <input
                    type="number"
                    min={0}
                    value={item.fixEffortSP ?? ""}
                    onChange={(e) =>
                      updateDebtItem(i, "fixEffortSP", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 40"
                    className={numberInputClass}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Velocity Impact (SP/sprint lost)</Label>
                  <input
                    type="number"
                    min={0}
                    value={item.velocityImpactSP ?? ""}
                    onChange={(e) =>
                      updateDebtItem(
                        i,
                        "velocityImpactSP",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="e.g. 3"
                    className={numberInputClass}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Engineer Severity</Label>
                  <select
                    value={item.engineerSeverity}
                    onChange={(e) => updateDebtItem(i, "engineerSeverity", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDebtItem}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          + Add debt item
        </button>
      </div>

      {/* Step 3: Roadmap Context */}
      <div className="space-y-3">
        <SectionHeader
          step={4}
          title="Product Roadmap Context (optional)"
          description="Upcoming features or initiatives that tech debt could delay or derail."
        />
        <textarea
          value={formData.roadmapContext}
          onChange={(e) => setFormData((prev) => ({ ...prev, roadmapContext: e.target.value }))}
          placeholder={`e.g.\nQ2: Launch payment gateway v2 (blocked by API v1 deprecation)\nQ3: Scale to 3 new EU markets (requires multi-region DB)\nBlack Friday peak in November (needs caching layer)`}
          rows={3}
          className={`${inputClass} font-mono`}
        />
      </div>

      {/* Step 4: Additional Context */}
      <div className="space-y-3">
        <SectionHeader
          step={5}
          title="Additional Context"
          description="Anything else: business pressures, team constraints, stakeholder expectations."
        />
        <textarea
          value={formData.additionalContext}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, additionalContext: e.target.value }))
          }
          placeholder={`e.g.\nCTO wants to modernize before Series B due diligence\nTeam has 2 new hires ramping up\nPrevious refactoring effort stalled due to competing priorities`}
          rows={3}
          className={`${inputClass} font-mono`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!hasData || isLoading}
        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Translating..." : "Translate to Business Impact"}
      </button>
    </form>
  );
}
