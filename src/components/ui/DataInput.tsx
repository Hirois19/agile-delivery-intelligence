"use client";

import { useState } from "react";
import type { SampleScenario } from "@/lib/sample-data";

interface DataInputProps {
  label: string;
  placeholder: string;
  helpText?: string;
  onSubmit: (data: string) => void;
  isLoading?: boolean;
  sampleData?: string;
  samples?: SampleScenario[];
  onSampleLoad?: (scenarioId: string) => void;
}

export function DataInput({
  label,
  placeholder,
  helpText,
  onSubmit,
  isLoading = false,
  sampleData,
  samples,
  onSampleLoad,
}: DataInputProps) {
  const [value, setValue] = useState("");
  const [showSamples, setShowSamples] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  }

  function loadSample() {
    if (sampleData) {
      setValue(sampleData);
    }
  }

  function handleSampleSelect(sample: SampleScenario) {
    setValue(sample.data);
    onSampleLoad?.(sample.id);
    setShowSamples(false);
  }

  const hasSamples = samples && samples.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-end justify-between">
        <label className="block text-sm font-medium">{label}</label>
        {hasSamples ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSamples(!showSamples)}
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              Load sample data ▾
            </button>
            {showSamples && (
              <div className="absolute right-0 top-6 z-10 w-80 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleSelect(sample)}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-[var(--color-accent-light)]/30 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className="block text-sm font-medium">
                      {sample.name}
                    </span>
                    <span className="block text-xs text-[var(--color-text-secondary)]">
                      {sample.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          sampleData && (
            <button
              type="button"
              onClick={loadSample}
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              Load sample data
            </button>
          )
        )}
      </div>
      {helpText && (
        <p className="text-xs text-[var(--color-text-secondary)]">{helpText}</p>
      )}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-mono leading-relaxed placeholder:text-neutral-400 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
      />
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
