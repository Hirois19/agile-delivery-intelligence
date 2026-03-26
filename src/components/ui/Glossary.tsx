"use client";

import { useState } from "react";

const GLOSSARY: Record<string, string> = {
  // Agile fundamentals
  "Story Points (SP)": "A relative unit of measure for estimating the effort needed to complete a user story. Not hours — a way for teams to compare work items against each other.",
  "Sprint": "A fixed time period (usually 1-4 weeks) during which a team commits to completing a set of work items. The core rhythm of Scrum.",
  "Velocity": "The average number of story points a team completes per sprint. Used for forecasting, not performance measurement.",
  "Rollover": "Work items that weren't completed in one sprint and carry over to the next. High rollover indicates estimation or capacity issues.",
  "Definition of Done (DoD)": "A shared checklist of criteria that every work item must meet before it's considered complete. Prevents 'almost done' items.",
  "Retrospective (Retro)": "A team meeting at the end of each sprint to reflect on what went well, what didn't, and what to improve. The engine of continuous improvement.",
  "Product Owner (PO)": "The person responsible for maximizing the value of the product by managing and prioritizing the backlog.",
  "Scrum Master (SM)": "A servant-leader who helps the team follow Scrum practices, removes impediments, and facilitates ceremonies.",
  // SAFe terms
  "PI Planning": "Program Increment Planning — a 2-day event where all teams in an Agile Release Train plan the next 8-12 weeks of work together. The heartbeat of SAFe.",
  "PI (Program Increment)": "A timebox of 4-6 sprints during which an Agile Release Train delivers incremental value. Think of it as a 'sprint of sprints.'",
  "ART (Agile Release Train)": "A team of agile teams (typically 50-125 people) that work together to deliver value in a SAFe organization.",
  "RTE (Release Train Engineer)": "The Scrum Master for the ART. Facilitates PI Planning, removes cross-team blockers, and keeps the train running.",
  "IP Sprint": "Innovation and Planning sprint — dedicated time between PIs for innovation, tech debt, and planning. SAFe's built-in sustainability mechanism.",
  // Tech Debt terms
  "Tech Debt": "Shortcuts in code or architecture that save time now but create extra work later. Like financial debt — it accumulates interest.",
  "ROI (Return on Investment)": "The ratio of benefit gained vs. cost invested. For tech debt: how much velocity you recover compared to the fix effort.",
  "Velocity Drag": "The reduction in team velocity caused by technical debt. Measured in SP/sprint lost.",
  // Estimation terms
  "Planning Poker": "An estimation technique where team members independently select a card with their estimate, then discuss differences. Reduces anchoring bias.",
  "Anchoring Bias": "When the first estimate shared influences everyone else's. Common when senior developers estimate first in Planning Poker.",
  "Optimism Bias": "The tendency to underestimate effort, especially for features. Teams estimate the 'happy path' and forget edge cases, testing, and integration.",
  "Planning Fallacy": "The tendency to underestimate time and costs while overestimating benefits. Even experts fall for it.",
  "Feature Breakdown": "Splitting a large feature into smaller, independently deliverable stories. Poor breakdown is the #1 cause of PI-level estimation failures.",
  // M&A terms
  "M&A (Mergers & Acquisitions)": "When one company buys or merges with another. Team integration is often the most challenging part.",
  "Bus Factor": "The number of team members who would need to leave before the team can't function. Bus factor of 1 = critical knowledge risk.",
  "PR (Pull Request)": "A code change submitted for review before merging into the main codebase. PR metrics indicate team collaboration health.",
  "Cycle Time": "The time from when work starts on a PR to when it's merged. Shorter is generally better.",
};

export function GlossaryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = Object.entries(GLOSSARY).filter(
    ([term, def]) =>
      term.toLowerCase().includes(search.toLowerCase()) ||
      def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg hover:bg-blue-700 transition-colors"
        title="Glossary — key terms explained"
      >
        ?
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-20 right-6 z-50 w-96 max-h-[70vh] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl flex flex-col">
            <div className="border-b border-[var(--color-border)] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Glossary</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-[var(--color-text)] text-lg"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search terms..."
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              {filtered.map(([term, definition]) => (
                <div key={term}>
                  <p className="text-sm font-medium">{term}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {definition}
                  </p>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  No matching terms found.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
