"use client";

export function PrivacyNotice() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="flex gap-2">
        <span className="text-amber-600 dark:text-amber-400 shrink-0">&#9888;</span>
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <p className="font-medium">Data Privacy</p>
          <p className="mt-0.5">
            When using AI analysis (not mock mode), your input is sent to
            Anthropic&apos;s API for processing. <strong>Names and team identifiers
            are automatically anonymized</strong> before transmission and restored
            in the results. However, numerical data (velocity, costs, etc.) is
            sent as-is. Avoid entering highly confidential business data. In mock
            mode (sample scenarios), no data leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
