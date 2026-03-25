"use client";

import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import type {
  EstimationFormData,
  StoryRow,
  PIFeatureRow,
  SprintEventRow,
  AnalysisMode,
} from "@/lib/estimation-form-types";
import {
  createEmptyEstimationFormData,
  createEmptyStory,
  createEmptyPIFeature,
  createEmptyEvent,
  estimationFormDataToText,
} from "@/lib/estimation-form-types";

interface EstimationFormProps {
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

export function EstimationForm({ onSubmit, isLoading = false }: EstimationFormProps) {
  const [formData, setFormData] = useState<EstimationFormData>(createEmptyEstimationFormData());

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const mode = formData.mode;

  // Generic updater
  const updateField = <K extends keyof EstimationFormData>(key: K, value: EstimationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Story helpers
  const updateStory = (i: number, field: keyof StoryRow, value: string | number | null) => {
    setFormData((prev) => {
      const stories = [...prev.stories];
      stories[i] = { ...stories[i], [field]: value };
      return { ...prev, stories };
    });
  };
  const addStory = () => setFormData((prev) => ({ ...prev, stories: [...prev.stories, createEmptyStory()] }));
  const removeStory = (i: number) => setFormData((prev) => ({ ...prev, stories: prev.stories.filter((_, idx) => idx !== i) }));

  // Feature helpers
  const updateFeature = (i: number, field: keyof PIFeatureRow, value: string | number | null) => {
    setFormData((prev) => {
      const features = [...prev.features];
      features[i] = { ...features[i], [field]: value };
      return { ...prev, features };
    });
  };
  const addFeature = () => setFormData((prev) => ({ ...prev, features: [...prev.features, createEmptyPIFeature()] }));
  const removeFeature = (i: number) => setFormData((prev) => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));

  // Event helpers
  const updateEvent = (i: number, field: keyof SprintEventRow, value: string) => {
    setFormData((prev) => {
      const events = [...prev.events];
      events[i] = { ...events[i], [field]: value };
      return { ...prev, events };
    });
  };
  const addEvent = () => setFormData((prev) => ({ ...prev, events: [...prev.events, createEmptyEvent()] }));
  const removeEvent = (i: number) => setFormData((prev) => ({ ...prev, events: prev.events.filter((_, idx) => idx !== i) }));

  // File upload
  function norm(h: string) { return h.toLowerCase().replace(/[^a-z0-9]/g, ""); }
  function detect(header: string, patterns: string[]) { const n = norm(header); return patterns.some((p) => n.includes(p)); }

  const processFile = useCallback((file: File) => {
    setUploadError(null);
    setUploadFileName(file.name);
    setUploadCount(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]]);
        if (rows.length === 0) { setUploadError("No data found."); return; }

        const headers = Object.keys(rows[0]);
        const toNum = (val: unknown): number | null => {
          if (typeof val === "number") return val;
          if (typeof val === "string") { const n = parseFloat(val); return isNaN(n) ? null : n; }
          return null;
        };
        const toStr = (val: unknown): string => val ? String(val).trim() : "";

        if (mode === "sprint") {
          const nameCol = headers.find((h) => detect(h, ["name", "title", "story", "item"]));
          const idCol = headers.find((h) => detect(h, ["id", "key", "ticket"]));
          const typeCol = headers.find((h) => detect(h, ["type", "category", "kind"]));
          const estCol = headers.find((h) => detect(h, ["estimate", "planned", "original"]));
          const actCol = headers.find((h) => detect(h, ["actual", "completed", "real", "spent"]));
          const sprintCol = headers.find((h) => detect(h, ["sprint", "iteration"]));
          const assigneeCol = headers.find((h) => detect(h, ["assignee", "owner", "developer", "dev"]));

          if (!estCol && !actCol) { setUploadError("Could not detect Estimated/Actual SP columns."); return; }

          const items: StoryRow[] = rows
            .filter((r) => (estCol && r[estCol] !== undefined) || (actCol && r[actCol] !== undefined))
            .map((r, idx) => {
              const typeVal = typeCol ? toStr(r[typeCol]).toLowerCase() : "";
              let storyType: StoryRow["storyType"] = "";
              if (typeVal.includes("feature") || typeVal.includes("story")) storyType = "feature";
              else if (typeVal.includes("bug")) storyType = "bug";
              else if (typeVal.includes("tech") || typeVal.includes("debt")) storyType = "tech_debt";
              return {
                storyId: idCol ? toStr(r[idCol]) : `S-${idx + 1}`,
                storyName: nameCol ? toStr(r[nameCol]) : "",
                storyType,
                estimatedSP: estCol ? toNum(r[estCol]) : null,
                actualSP: actCol ? toNum(r[actCol]) : null,
                sprint: sprintCol ? toStr(r[sprintCol]) : "",
                assignee: assigneeCol ? toStr(r[assigneeCol]) : "",
                complexityTag: "",
              };
            });

          if (items.length === 0) { setUploadError("No valid story data found."); return; }
          setUploadCount(items.length);
          setFormData((prev) => ({ ...prev, stories: items }));
        } else {
          const nameCol = headers.find((h) => detect(h, ["feature", "name", "title"]));
          const estCol = headers.find((h) => detect(h, ["estimate", "planned", "planning"]));
          const actCol = headers.find((h) => detect(h, ["actual", "real", "spent"]));
          const countCol = headers.find((h) => detect(h, ["stories", "count", "items"]));
          const piCol = headers.find((h) => detect(h, ["pi", "increment"]));

          if (!nameCol) { setUploadError("Could not detect Feature Name column."); return; }

          const items: PIFeatureRow[] = rows
            .filter((r) => nameCol && r[nameCol] && toStr(r[nameCol]))
            .map((r) => ({
              featureName: toStr(r[nameCol!]),
              piPlanningEstimateSP: estCol ? toNum(r[estCol]) : null,
              actualSP: actCol ? toNum(r[actCol]) : null,
              storyCount: countCol ? toNum(r[countCol]) : null,
              plannedSprints: "",
              actualSprints: "",
              pi: piCol ? toStr(r[piCol]) : "",
              dependencies: "",
              breakdownQuality: "",
            }));

          if (items.length === 0) { setUploadError("No valid feature data found."); return; }
          setUploadCount(items.length);
          setFormData((prev) => ({ ...prev, features: items }));
        }
      } catch { setUploadError("Failed to parse file."); }
    };
    reader.readAsArrayBuffer(file);
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = estimationFormDataToText(formData);
    if (text.trim()) onSubmit(text);
  };

  const hasData =
    mode === "sprint"
      ? formData.stories.some((s) => s.storyName.trim() || s.estimatedSP !== null)
      : formData.features.some((f) => f.featureName.trim() || f.piPlanningEstimateSP !== null);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Analysis Mode */}
      <div className="space-y-3">
        <SectionHeader
          step={1}
          title="Analysis Mode"
          description="Choose the level of estimation analysis."
        />
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          {(["sprint", "pi"] as AnalysisMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => updateField("mode", m)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-white text-[var(--color-text)] shadow-sm dark:bg-neutral-700"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {m === "sprint" ? "Sprint Mode (Stories)" : "PI Mode (Features)"}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {mode === "sprint"
            ? "Analyze story-level estimation accuracy across sprints. Best for Scrum teams."
            : "Analyze feature-level estimation at PI Planning scale. Detects breakdown failures, dependency costs, and PI carryover patterns."}
        </p>
      </div>

      {/* Step 2: File Upload */}
      <div className="space-y-3">
        <SectionHeader
          step={2}
          title={`Import ${mode === "sprint" ? "Story" : "Feature"} Data (optional)`}
          description={mode === "sprint"
            ? "Upload CSV/Excel with columns: Story ID, Name, Type, Estimated SP, Actual SP, Sprint, Assignee"
            : "Upload CSV/Excel with columns: Feature Name, PI Planning Estimate, Actual SP, Story Count, PI"}
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]/20" : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />
          <div className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-accent)]">Upload CSV or Excel</span> or drag and drop
          </div>
        </div>
        {uploadFileName && !uploadError && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <span>&#10003;</span>
            <span>{uploadFileName} — {uploadCount} {mode === "sprint" ? "stories" : "features"} loaded</span>
          </div>
        )}
        {uploadError && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{uploadError}</div>
        )}
      </div>

      {/* Step 3: Team Info */}
      <div className="space-y-3">
        <SectionHeader step={3} title="Team Information" description="Basic context about the team and analysis period." />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Team Name</Label>
            <input type="text" value={formData.teamName} onChange={(e) => updateField("teamName", e.target.value)} placeholder="e.g. PayCore" className={inputClass} />
          </div>
          <div className="space-y-1">
            <Label>{mode === "sprint" ? "Number of Sprints" : "Number of PIs"}</Label>
            <input type="text" value={formData.periodCount} onChange={(e) => updateField("periodCount", e.target.value)} placeholder={mode === "sprint" ? "e.g. 6" : "e.g. 2"} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Step 4: Data Table */}
      <div className="space-y-3">
        <SectionHeader
          step={4}
          title={mode === "sprint" ? "Story-Level Data" : "Feature-Level Data"}
          description={mode === "sprint" ? "Enter estimated vs actual SP for each story. Minimum 10 stories for meaningful analysis." : "Enter PI Planning estimates vs actual SP for each feature."}
        />

        {mode === "sprint" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[var(--color-text-secondary)]">
                    <th className="pb-2 text-left font-medium">ID</th>
                    <th className="pb-2 text-left font-medium">Name</th>
                    <th className="pb-2 text-left font-medium">Type</th>
                    <th className="pb-2 text-center font-medium">Est SP</th>
                    <th className="pb-2 text-center font-medium">Actual SP</th>
                    <th className="pb-2 text-left font-medium">Sprint</th>
                    <th className="pb-2 text-left font-medium">Assignee</th>
                    <th className="pb-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.stories.map((s, i) => (
                    <tr key={i} className="group">
                      <td className="py-1 pr-1"><input type="text" value={s.storyId} onChange={(e) => updateStory(i, "storyId", e.target.value)} placeholder="S-1" className={`${inputClass} w-16`} /></td>
                      <td className="py-1 px-1"><input type="text" value={s.storyName} onChange={(e) => updateStory(i, "storyName", e.target.value)} placeholder="Story name" className={`${inputClass} w-32`} /></td>
                      <td className="py-1 px-1">
                        <select value={s.storyType} onChange={(e) => updateStory(i, "storyType", e.target.value)} className={`${inputClass} w-24`}>
                          <option value="">--</option>
                          <option value="feature">Feature</option>
                          <option value="bug">Bug</option>
                          <option value="tech_debt">Tech Debt</option>
                        </select>
                      </td>
                      <td className="py-1 px-1"><input type="number" min={0} value={s.estimatedSP ?? ""} onChange={(e) => updateStory(i, "estimatedSP", e.target.value ? parseInt(e.target.value) : null)} className={`${numberInputClass} w-16`} /></td>
                      <td className="py-1 px-1"><input type="number" min={0} value={s.actualSP ?? ""} onChange={(e) => updateStory(i, "actualSP", e.target.value ? parseInt(e.target.value) : null)} className={`${numberInputClass} w-16`} /></td>
                      <td className="py-1 px-1"><input type="text" value={s.sprint} onChange={(e) => updateStory(i, "sprint", e.target.value)} placeholder="Sprint 1" className={`${inputClass} w-20`} /></td>
                      <td className="py-1 px-1"><input type="text" value={s.assignee} onChange={(e) => updateStory(i, "assignee", e.target.value)} placeholder="Name" className={`${inputClass} w-20`} /></td>
                      <td className="py-1 pl-1">
                        {formData.stories.length > 1 && (
                          <button type="button" onClick={() => removeStory(i)} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100">&times;</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addStory} className="text-xs text-[var(--color-accent)] hover:underline">+ Add story</button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              {formData.features.map((f, i) => (
                <div key={i} className="group rounded-lg border border-[var(--color-border)] p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">Feature {i + 1}</span>
                    {formData.features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(i)} className="text-neutral-400 hover:text-red-500 text-sm">&times;</button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1"><Label>Feature Name</Label><input type="text" value={f.featureName} onChange={(e) => updateFeature(i, "featureName", e.target.value)} placeholder="e.g. API Gateway v2" className={inputClass} /></div>
                    <div className="space-y-1"><Label>PI</Label><input type="text" value={f.pi} onChange={(e) => updateFeature(i, "pi", e.target.value)} placeholder="e.g. PI 1" className={inputClass} /></div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="space-y-1"><Label>PI Planning Est (SP)</Label><input type="number" min={0} value={f.piPlanningEstimateSP ?? ""} onChange={(e) => updateFeature(i, "piPlanningEstimateSP", e.target.value ? parseInt(e.target.value) : null)} className={numberInputClass} /></div>
                    <div className="space-y-1"><Label>Actual SP</Label><input type="number" min={0} value={f.actualSP ?? ""} onChange={(e) => updateFeature(i, "actualSP", e.target.value ? parseInt(e.target.value) : null)} className={numberInputClass} /></div>
                    <div className="space-y-1"><Label>Story Count</Label><input type="number" min={0} value={f.storyCount ?? ""} onChange={(e) => updateFeature(i, "storyCount", e.target.value ? parseInt(e.target.value) : null)} className={numberInputClass} /></div>
                    <div className="space-y-1"><Label>Breakdown Quality</Label>
                      <select value={f.breakdownQuality} onChange={(e) => updateFeature(i, "breakdownQuality", e.target.value)} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="good">Good</option>
                        <option value="partial">Partial</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1"><Label>Planned Sprints</Label><input type="text" value={f.plannedSprints} onChange={(e) => updateFeature(i, "plannedSprints", e.target.value)} placeholder="e.g. Sprint 1-3" className={inputClass} /></div>
                    <div className="space-y-1"><Label>Actual Sprints</Label><input type="text" value={f.actualSprints} onChange={(e) => updateFeature(i, "actualSprints", e.target.value)} placeholder="e.g. Sprint 1-5" className={inputClass} /></div>
                  </div>
                  <div className="space-y-1"><Label>Dependencies</Label><input type="text" value={f.dependencies} onChange={(e) => updateFeature(i, "dependencies", e.target.value)} placeholder="e.g. Team Bravo (auth service)" className={inputClass} /></div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addFeature} className="text-xs text-[var(--color-accent)] hover:underline">+ Add feature</button>
          </>
        )}
      </div>

      {/* Step 5: Events */}
      <div className="space-y-3">
        <SectionHeader
          step={5}
          title="Events & Context (optional)"
          description="Blockers, scope changes, or team changes that affected estimates."
        />
        {formData.events.length > 0 && (
          <div className="space-y-2">
            {formData.events.map((ev, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input type="text" value={ev.period} onChange={(e) => updateEvent(i, "period", e.target.value)} placeholder={mode === "sprint" ? "Sprint 3" : "PI 1"} className={`${inputClass} w-24`} />
                <select value={ev.eventType} onChange={(e) => updateEvent(i, "eventType", e.target.value)} className={`${inputClass} w-32`}>
                  <option value="">Type...</option>
                  <option value="blocker">Blocker</option>
                  <option value="scope_change">Scope Change</option>
                  <option value="team_change">Team Change</option>
                  {mode === "pi" && <option value="dependency_block">Dependency Block</option>}
                  {mode === "pi" && <option value="breakdown_revision">Breakdown Revision</option>}
                </select>
                <input type="text" value={ev.description} onChange={(e) => updateEvent(i, "description", e.target.value)} placeholder="Description" className={`${inputClass} flex-1`} />
                <button type="button" onClick={() => removeEvent(i)} className="text-neutral-400 hover:text-red-500 text-sm px-1">&times;</button>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={addEvent} className="text-xs text-[var(--color-accent)] hover:underline">+ Add event</button>
      </div>

      {/* Step 6: Additional Context */}
      <div className="space-y-3">
        <SectionHeader step={6} title="Additional Context" description="Estimation method, team experience, PI Planning approach." />
        <textarea
          value={formData.context}
          onChange={(e) => updateField("context", e.target.value)}
          placeholder={mode === "sprint"
            ? "e.g.\nUsing Planning Poker\nTeam has 2 junior developers (joined 3 months ago)\nRecently switched from t-shirt sizing to story points"
            : "e.g.\nPI Planning conducted as 2-day event\nRTE facilitates but is new to the role\nDependencies identified at PI Planning but not tracked during execution"}
          rows={3}
          className={`${inputClass} font-mono`}
        />
      </div>

      <button
        type="submit"
        disabled={!hasData || isLoading}
        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Estimation Bias"}
      </button>
    </form>
  );
}
