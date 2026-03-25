/**
 * Export action items/tasks to CSV format compatible with
 * Jira, Azure DevOps, and Asana import.
 */

export type ExportFormat = "jira" | "azure_devops" | "asana" | "generic";

export interface ExportableTask {
  title: string;
  description: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: string; // e.g. "Task", "Story", "Action Item"
  module: string; // e.g. "Team Health", "Tech Debt"
  urgency?: string; // e.g. "Act Now", "Next Retro", "Monitor"
  expectedOutcome?: string;
}

interface CSVColumn {
  header: string;
  getValue: (task: ExportableTask) => string;
}

const FORMAT_COLUMNS: Record<ExportFormat, CSVColumn[]> = {
  jira: [
    { header: "Summary", getValue: (t) => t.title },
    { header: "Description", getValue: (t) => t.description + (t.expectedOutcome ? `\n\nExpected Outcome: ${t.expectedOutcome}` : "") },
    { header: "Issue Type", getValue: (t) => t.type === "Escalation" ? "Task" : "Task" },
    { header: "Priority", getValue: (t) => t.priority },
    { header: "Labels", getValue: (t) => `agile-intelligence,${t.module.toLowerCase().replace(/\s+/g, "-")}` },
    { header: "Component", getValue: (t) => t.module },
  ],
  azure_devops: [
    { header: "Title", getValue: (t) => t.title },
    { header: "Description", getValue: (t) => t.description + (t.expectedOutcome ? `\n\nExpected Outcome: ${t.expectedOutcome}` : "") },
    { header: "Work Item Type", getValue: (t) => "Task" },
    { header: "Priority", getValue: (t) => { const m: Record<string, string> = { Critical: "1", High: "2", Medium: "3", Low: "4" }; return m[t.priority] ?? "3"; } },
    { header: "Tags", getValue: (t) => `agile-intelligence;${t.module}` },
    { header: "Area Path", getValue: (t) => t.module },
  ],
  asana: [
    { header: "Name", getValue: (t) => t.title },
    { header: "Notes", getValue: (t) => t.description + (t.expectedOutcome ? `\n\nExpected Outcome: ${t.expectedOutcome}` : "") },
    { header: "Section", getValue: (t) => t.urgency ?? t.module },
    { header: "Priority", getValue: (t) => t.priority },
    { header: "Type", getValue: (t) => t.type },
  ],
  generic: [
    { header: "Title", getValue: (t) => t.title },
    { header: "Description", getValue: (t) => t.description },
    { header: "Priority", getValue: (t) => t.priority },
    { header: "Type", getValue: (t) => t.type },
    { header: "Module", getValue: (t) => t.module },
    { header: "Urgency", getValue: (t) => t.urgency ?? "" },
    { header: "Expected Outcome", getValue: (t) => t.expectedOutcome ?? "" },
  ],
};

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSV(tasks: ExportableTask[], format: ExportFormat): string {
  const columns = FORMAT_COLUMNS[format];
  const header = columns.map((c) => escapeCSV(c.header)).join(",");
  const rows = tasks.map((task) =>
    columns.map((c) => escapeCSV(c.getValue(task))).join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(csv: string, filename: string): void {
  const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Module-specific extractors ----

export function urgencyToPriority(urgency: string): ExportableTask["priority"] {
  if (urgency === "act_now") return "Critical";
  if (urgency === "next_retro") return "High";
  return "Medium";
}
