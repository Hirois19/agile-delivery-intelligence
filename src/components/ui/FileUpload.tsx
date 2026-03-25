"use client";

import { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { SprintRow } from "@/lib/form-types";

interface FileUploadProps {
  onDataParsed: (sprints: SprintRow[]) => void;
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function detectColumn(
  header: string,
  patterns: string[]
): boolean {
  const norm = normalizeHeader(header);
  return patterns.some((p) => norm.includes(p));
}

function parseSprintRows(rows: Record<string, unknown>[]): SprintRow[] {
  if (rows.length === 0) return [];

  const headers = Object.keys(rows[0]);

  const sprintCol = headers.find((h) =>
    detectColumn(h, ["sprint", "iteration", "cycle"])
  );
  const plannedCol = headers.find((h) =>
    detectColumn(h, ["planned", "committed", "plan"])
  );
  const completedCol = headers.find((h) =>
    detectColumn(h, ["completed", "done", "actual", "delivered"])
  );
  const rolloverCol = headers.find((h) =>
    detectColumn(h, ["rollover", "carryover", "remaining", "spillover"])
  );
  const notesCol = headers.find((h) =>
    detectColumn(h, ["note", "comment", "remark"])
  );

  return rows
    .filter((row) => {
      const hasAnyNumber = headers.some((h) => {
        const val = row[h];
        return typeof val === "number" || (typeof val === "string" && /^\d+$/.test(val.trim()));
      });
      return hasAnyNumber;
    })
    .map((row, i) => {
      const toNum = (key: string | undefined): number | null => {
        if (!key) return null;
        const val = row[key];
        if (typeof val === "number") return val;
        if (typeof val === "string") {
          const n = parseInt(val, 10);
          return isNaN(n) ? null : n;
        }
        return null;
      };

      const sprintName = sprintCol
        ? String(row[sprintCol] ?? `Sprint ${i + 1}`)
        : `Sprint ${i + 1}`;

      return {
        name: sprintName,
        plannedSP: toNum(plannedCol),
        completedSP: toNum(completedCol),
        rolloverSP: toNum(rolloverCol),
        notes: notesCol ? String(row[notesCol] ?? "") : "",
      };
    });
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      setFileName(file.name);
      setParsedCount(0);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

          if (rows.length === 0) {
            setError("No data found in the file.");
            return;
          }

          const sprints = parseSprintRows(rows);
          if (sprints.length === 0) {
            setError(
              "Could not detect sprint data. Make sure your file has columns like: Sprint, Planned SP, Completed SP"
            );
            return;
          }

          setParsedCount(sprints.length);
          onDataParsed(sprints);
        } catch {
          setError("Failed to parse file. Please check the format.");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [onDataParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]/20"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-medium text-[var(--color-accent)]">
            Upload CSV or Excel
          </span>{" "}
          or drag and drop
        </div>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          Expected columns: Sprint, Planned SP, Completed SP, Rollover SP
        </p>
      </div>

      {fileName && !error && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <span>&#10003;</span>
          <span>
            {fileName} — {parsedCount} sprints loaded into form
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
