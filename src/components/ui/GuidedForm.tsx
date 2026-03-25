"use client";

import { useState, useCallback } from "react";
import type {
  TeamFormData,
  SprintRow,
  RetroSprint,
} from "@/lib/form-types";
import {
  createEmptyFormData,
  createEmptySprint,
  formDataToText,
} from "@/lib/form-types";
import { FileUpload } from "./FileUpload";

interface GuidedFormProps {
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
        <p className="text-xs text-[var(--color-text-secondary)]">
          {description}
        </p>
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

export function GuidedForm({ onSubmit, isLoading = false }: GuidedFormProps) {
  const [formData, setFormData] = useState<TeamFormData>(createEmptyFormData());

  const updateField = <K extends keyof TeamFormData>(
    key: K,
    value: TeamFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Sprint table
  const updateSprint = (index: number, field: keyof SprintRow, value: string | number | null) => {
    setFormData((prev) => {
      const sprints = [...prev.sprints];
      sprints[index] = { ...sprints[index], [field]: value };
      return { ...prev, sprints };
    });
  };

  const addSprint = () => {
    setFormData((prev) => ({
      ...prev,
      sprints: [...prev.sprints, createEmptySprint(prev.sprints.length + 1)],
    }));
  };

  const removeSprint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sprints: prev.sprints.filter((_, i) => i !== index),
    }));
  };

  // Retro themes
  const syncRetrosWithSprints = useCallback((sprints: SprintRow[]) => {
    setFormData((prev) => {
      const existing = new Map(prev.retros.map((r) => [r.sprintName, r]));
      const retros: RetroSprint[] = sprints.map((s) => {
        const ex = existing.get(s.name);
        return ex ?? { sprintName: s.name, comments: [""] };
      });
      return { ...prev, retros };
    });
  }, []);

  const updateRetroComment = (
    retroIndex: number,
    commentIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const retros = [...prev.retros];
      const comments = [...retros[retroIndex].comments];
      comments[commentIndex] = value;
      retros[retroIndex] = { ...retros[retroIndex], comments };
      return { ...prev, retros };
    });
  };

  const addRetroComment = (retroIndex: number) => {
    setFormData((prev) => {
      const retros = [...prev.retros];
      retros[retroIndex] = {
        ...retros[retroIndex],
        comments: [...retros[retroIndex].comments, ""],
      };
      return { ...prev, retros };
    });
  };

  const removeRetroComment = (retroIndex: number, commentIndex: number) => {
    setFormData((prev) => {
      const retros = [...prev.retros];
      const comments = retros[retroIndex].comments.filter(
        (_, i) => i !== commentIndex
      );
      retros[retroIndex] = {
        ...retros[retroIndex],
        comments: comments.length > 0 ? comments : [""],
      };
      return { ...prev, retros };
    });
  };

  // PR Metrics
  const updatePRMetric = (
    field: keyof TeamFormData["prMetrics"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      prMetrics: { ...prev.prMetrics, [field]: value },
    }));
  };

  // File upload handler
  const handleFileParsed = useCallback(
    (sprints: SprintRow[]) => {
      setFormData((prev) => ({ ...prev, sprints }));
      syncRetrosWithSprints(sprints);
    },
    [syncRetrosWithSprints]
  );

  // Add sprint and sync retros
  const handleAddSprint = () => {
    addSprint();
    setFormData((prev) => {
      const newName = prev.sprints[prev.sprints.length - 1]?.name ?? `Sprint ${prev.sprints.length}`;
      return {
        ...prev,
        retros: [...prev.retros, { sprintName: newName, comments: [""] }],
      };
    });
  };

  const handleRemoveSprint = (index: number) => {
    removeSprint(index);
    setFormData((prev) => ({
      ...prev,
      retros: prev.retros.filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = formDataToText(formData);
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const hasData =
    formData.sprints.some((s) => s.plannedSP !== null || s.completedSP !== null) ||
    formData.context.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* File Upload */}
      <div className="space-y-3">
        <SectionHeader
          step={1}
          title="Import Sprint Data (optional)"
          description="Upload a CSV or Excel file to auto-fill the sprint velocity table below."
        />
        <FileUpload onDataParsed={handleFileParsed} />
      </div>

      {/* Team Info */}
      <div className="space-y-3">
        <SectionHeader
          step={2}
          title="Team Information"
          description="Basic info about the team being analyzed."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label>Team Name</Label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => updateField("teamName", e.target.value)}
              placeholder="e.g. FleetOps Platform"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Team Size</Label>
            <input
              type="text"
              value={formData.teamSize}
              onChange={(e) => updateField("teamSize", e.target.value)}
              placeholder="e.g. 8"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Composition</Label>
            <input
              type="text"
              value={formData.composition}
              onChange={(e) => updateField("composition", e.target.value)}
              placeholder="e.g. 6 engineers, 1 PO, 1 SM"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Sprint Velocity */}
      <div className="space-y-3">
        <SectionHeader
          step={3}
          title="Sprint Velocity"
          description="Enter at least 3 sprints of data. More sprints = richer analysis."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--color-text-secondary)]">
                <th className="pb-2 pr-2 text-left font-medium">Sprint</th>
                <th className="pb-2 px-2 text-center font-medium">
                  Planned SP
                </th>
                <th className="pb-2 px-2 text-center font-medium">
                  Completed SP
                </th>
                <th className="pb-2 px-2 text-center font-medium">
                  Rollover SP
                </th>
                <th className="pb-2 px-2 text-left font-medium">Notes</th>
                <th className="pb-2 pl-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {formData.sprints.map((sprint, i) => (
                <tr key={i} className="group">
                  <td className="py-1 pr-2">
                    <input
                      type="text"
                      value={sprint.name}
                      onChange={(e) =>
                        updateSprint(i, "name", e.target.value)
                      }
                      className={`${inputClass} w-28`}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      min={0}
                      value={sprint.plannedSP ?? ""}
                      onChange={(e) =>
                        updateSprint(
                          i,
                          "plannedSP",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className={`${numberInputClass} w-20`}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      min={0}
                      value={sprint.completedSP ?? ""}
                      onChange={(e) =>
                        updateSprint(
                          i,
                          "completedSP",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className={`${numberInputClass} w-20`}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="number"
                      min={0}
                      value={sprint.rolloverSP ?? ""}
                      onChange={(e) =>
                        updateSprint(
                          i,
                          "rolloverSP",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className={`${numberInputClass} w-20`}
                    />
                  </td>
                  <td className="py-1 px-2">
                    <input
                      type="text"
                      value={sprint.notes}
                      onChange={(e) =>
                        updateSprint(i, "notes", e.target.value)
                      }
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </td>
                  <td className="py-1 pl-2">
                    {formData.sprints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSprint(i)}
                        className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove sprint"
                      >
                        &times;
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAddSprint}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          + Add sprint
        </button>
      </div>

      {/* Retrospective Themes */}
      <div className="space-y-3">
        <SectionHeader
          step={4}
          title="Retrospective Themes"
          description="What did team members say in retros? Add actual quotes or summarized themes."
        />
        <div className="space-y-4">
          {formData.retros.map((retro, ri) => (
            <div
              key={ri}
              className="rounded-md border border-[var(--color-border)] p-3 space-y-2"
            >
              <div className="text-xs font-medium text-[var(--color-text-secondary)]">
                {retro.sprintName} Retro
              </div>
              {retro.comments.map((comment, ci) => (
                <div key={ci} className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) =>
                      updateRetroComment(ri, ci, e.target.value)
                    }
                    placeholder='e.g. "Requirements keep changing mid-sprint"'
                    className={`${inputClass} flex-1`}
                  />
                  {retro.comments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRetroComment(ri, ci)}
                      className="text-neutral-400 hover:text-red-500 text-sm px-1"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRetroComment(ri)}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                + Add comment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PR Metrics */}
      <div className="space-y-3">
        <SectionHeader
          step={5}
          title="PR Metrics (optional)"
          description="Code review and pull request data, if available."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Average PR Cycle Time</Label>
            <input
              type="text"
              value={formData.prMetrics.cycleTime}
              onChange={(e) => updatePRMetric("cycleTime", e.target.value)}
              placeholder="e.g. 2.1 days"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Average Review Turnaround</Label>
            <input
              type="text"
              value={formData.prMetrics.reviewTurnaround}
              onChange={(e) =>
                updatePRMetric("reviewTurnaround", e.target.value)
              }
              placeholder="e.g. 0.8 days"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>PRs Merged Without Review</Label>
            <input
              type="text"
              value={formData.prMetrics.unreviewedPRs}
              onChange={(e) =>
                updatePRMetric("unreviewedPRs", e.target.value)
              }
              placeholder="e.g. 0 per sprint"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <Label>Average PR Size</Label>
            <input
              type="text"
              value={formData.prMetrics.prSize}
              onChange={(e) => updatePRMetric("prSize", e.target.value)}
              placeholder="e.g. 150 lines"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="space-y-3">
        <SectionHeader
          step={6}
          title="Additional Context"
          description="Anything else the AI should know: org changes, team history, special circumstances."
        />
        <textarea
          value={formData.context}
          onChange={(e) => updateField("context", e.target.value)}
          placeholder={`e.g.\nCompany announced reorganization 6 weeks ago\nProduct Owner is shared across 2 teams\nOne senior developer gave notice`}
          rows={4}
          className={`${inputClass} font-mono`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!hasData || isLoading}
        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Team Health"}
      </button>
    </form>
  );
}
