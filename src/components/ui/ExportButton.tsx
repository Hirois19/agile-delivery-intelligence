"use client";

import { useState } from "react";
import type { ExportableTask, ExportFormat } from "@/lib/export-tasks";
import { generateCSV, downloadCSV } from "@/lib/export-tasks";

interface ExportButtonProps {
  tasks: ExportableTask[];
  filenamePrefix: string;
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; description: string }[] = [
  { value: "jira", label: "Jira", description: "CSV with Summary, Priority, Labels, Component" },
  { value: "azure_devops", label: "Azure DevOps", description: "CSV with Title, Work Item Type, Priority, Tags" },
  { value: "asana", label: "Asana", description: "CSV with Name, Notes, Section, Priority" },
  { value: "generic", label: "Generic CSV", description: "Universal format with all fields" },
];

export function ExportButton({ tasks, filenamePrefix }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (tasks.length === 0) return null;

  function handleExport(format: ExportFormat) {
    const csv = generateCSV(tasks, format);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `${filenamePrefix}-${format}-${timestamp}.csv`);
    setShowMenu(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
      >
        Export {tasks.length} Action Items ▾
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
            <div className="px-3 py-2 border-b border-[var(--color-border)]">
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                Export as CSV for import into:
              </p>
            </div>
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleExport(opt.value)}
                className="block w-full px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-accent-light)]/30"
              >
                <span className="block text-sm font-medium">{opt.label}</span>
                <span className="block text-xs text-[var(--color-text-secondary)]">
                  {opt.description}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
