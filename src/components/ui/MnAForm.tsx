"use client";

import { useState } from "react";
import type {
  MnAFormData,
  TeamProfileInput,
  StakeholderInput,
  ToolingInventoryItem,
} from "@/lib/mna-form-types";
import {
  createEmptyMnAFormData,
  createEmptyTeamProfile,
  createEmptyStakeholder,
  mnaFormDataToText,
} from "@/lib/mna-form-types";

interface MnAFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

function SectionHeader({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">{step}</span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-[var(--color-text-secondary)]">{children}</label>;
}

const inputClass = "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

function TeamProfileSection({
  title,
  teams,
  onUpdate,
  onAdd,
  onRemove,
}: {
  title: string;
  teams: TeamProfileInput[];
  onUpdate: (i: number, field: keyof TeamProfileInput, value: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-3">
      {teams.map((t, i) => (
        <div key={i} className="group rounded-lg border border-[var(--color-border)] p-4 space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{title} {teams.length > 1 ? i + 1 : ""}</span>
            {teams.length > 1 && (
              <button type="button" onClick={() => onRemove(i)} className="text-neutral-400 hover:text-red-500 text-sm">&times;</button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Team Name</Label><input type="text" value={t.teamName} onChange={(e) => onUpdate(i, "teamName", e.target.value)} placeholder="e.g. Platform Team" className={inputClass} /></div>
            <div className="space-y-1"><Label>Team Size</Label><input type="text" value={t.teamSize} onChange={(e) => onUpdate(i, "teamSize", e.target.value)} placeholder="e.g. 8 engineers" className={inputClass} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Tech Stack</Label><input type="text" value={t.techStack} onChange={(e) => onUpdate(i, "techStack", e.target.value)} placeholder="e.g. TypeScript, React, Node.js" className={inputClass} /></div>
            <div className="space-y-1"><Label>Location</Label><input type="text" value={t.location} onChange={(e) => onUpdate(i, "location", e.target.value)} placeholder="e.g. Berlin, Germany" className={inputClass} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Agile Maturity</Label>
              <select value={t.agileMaturity} onChange={(e) => onUpdate(i, "agileMaturity", e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Methodology</Label>
              <select value={t.methodology} onChange={(e) => onUpdate(i, "methodology", e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                <option value="scrum">Scrum</option>
                <option value="kanban">Kanban</option>
                <option value="scrumban">Scrumban</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Culture Traits</Label>
            <input type="text" value={t.cultureTraits} onChange={(e) => onUpdate(i, "cultureTraits", e.target.value)} placeholder='e.g. "Move fast, informal communication" or "Process-heavy, documentation-first"' className={inputClass} />
          </div>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="text-xs text-[var(--color-accent)] hover:underline">+ Add team</button>
    </div>
  );
}

export function MnAForm({ onSubmit, isLoading = false }: MnAFormProps) {
  const [formData, setFormData] = useState<MnAFormData>(createEmptyMnAFormData());

  // Acquirer teams
  const updateAcquirerTeam = (i: number, field: keyof TeamProfileInput, value: string) => {
    setFormData((prev) => { const t = [...prev.acquirerTeams]; t[i] = { ...t[i], [field]: value }; return { ...prev, acquirerTeams: t }; });
  };
  const addAcquirerTeam = () => setFormData((prev) => ({ ...prev, acquirerTeams: [...prev.acquirerTeams, createEmptyTeamProfile()] }));
  const removeAcquirerTeam = (i: number) => setFormData((prev) => ({ ...prev, acquirerTeams: prev.acquirerTeams.filter((_, idx) => idx !== i) }));

  // Acquired teams
  const updateAcquiredTeam = (i: number, field: keyof TeamProfileInput, value: string) => {
    setFormData((prev) => { const t = [...prev.acquiredTeams]; t[i] = { ...t[i], [field]: value }; return { ...prev, acquiredTeams: t }; });
  };
  const addAcquiredTeam = () => setFormData((prev) => ({ ...prev, acquiredTeams: [...prev.acquiredTeams, createEmptyTeamProfile()] }));
  const removeAcquiredTeam = (i: number) => setFormData((prev) => ({ ...prev, acquiredTeams: prev.acquiredTeams.filter((_, idx) => idx !== i) }));

  // Tooling
  const updateTooling = (i: number, field: keyof ToolingInventoryItem, value: string) => {
    setFormData((prev) => { const t = [...prev.tooling]; t[i] = { ...t[i], [field]: value }; return { ...prev, tooling: t }; });
  };

  // Stakeholders
  const updateStakeholder = (i: number, field: keyof StakeholderInput, value: string) => {
    setFormData((prev) => { const s = [...prev.stakeholders]; s[i] = { ...s[i], [field]: value }; return { ...prev, stakeholders: s }; });
  };
  const addStakeholder = () => setFormData((prev) => ({ ...prev, stakeholders: [...prev.stakeholders, createEmptyStakeholder()] }));
  const removeStakeholder = (i: number) => setFormData((prev) => ({ ...prev, stakeholders: prev.stakeholders.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = mnaFormDataToText(formData);
    if (text.trim()) onSubmit(text);
  };

  const hasData = formData.acquirerTeams.some((t) => t.teamName.trim()) || formData.acquiredTeams.some((t) => t.teamName.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Acquirer Teams */}
      <div className="space-y-3">
        <SectionHeader step={1} title="Acquirer Team(s)" description="The team(s) from the acquiring company. Add multiple if merging several teams." />
        <TeamProfileSection title="Acquirer Team" teams={formData.acquirerTeams} onUpdate={updateAcquirerTeam} onAdd={addAcquirerTeam} onRemove={removeAcquirerTeam} />
      </div>

      {/* Step 2: Acquired Teams */}
      <div className="space-y-3">
        <SectionHeader step={2} title="Acquired Team(s)" description="The team(s) from the acquired company." />
        <TeamProfileSection title="Acquired Team" teams={formData.acquiredTeams} onUpdate={updateAcquiredTeam} onAdd={addAcquiredTeam} onRemove={removeAcquiredTeam} />
      </div>

      {/* Step 3: Tooling Inventory */}
      <div className="space-y-3">
        <SectionHeader step={3} title="Tooling Inventory" description="What tools does each side use? Differences create integration friction and migration decisions." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--color-text-secondary)]">
                <th className="pb-2 text-left font-medium">Category</th>
                <th className="pb-2 text-left font-medium">Acquirer Tool</th>
                <th className="pb-2 text-left font-medium">Acquired Tool</th>
              </tr>
            </thead>
            <tbody>
              {formData.tooling.map((t, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2 text-xs font-medium text-[var(--color-text-secondary)]">{t.category}</td>
                  <td className="py-1 px-1"><input type="text" value={t.acquirerTool} onChange={(e) => updateTooling(i, "acquirerTool", e.target.value)} placeholder="e.g. Jira" className={inputClass} /></td>
                  <td className="py-1 pl-1"><input type="text" value={t.acquiredTool} onChange={(e) => updateTooling(i, "acquiredTool", e.target.value)} placeholder="e.g. Linear" className={inputClass} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 4: Integration Goals */}
      <div className="space-y-3">
        <SectionHeader step={4} title="Integration Goals & Timeline" description="What's the target end state and how long do you have?" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label>Integration Goal</Label>
            <select value={formData.integrationGoal} onChange={(e) => setFormData((p) => ({ ...p, integrationGoal: e.target.value }))} className={inputClass}>
              <option value="">Select...</option>
              <option value="Full merge into one team">Full merge into one team</option>
              <option value="Shared platform, separate backlogs">Shared platform, separate backlogs</option>
              <option value="Gradual alignment over time">Gradual alignment</option>
              <option value="Skill-based redistribution into new teams">Skill-based redistribution</option>
            </select>
          </div>
          <div className="space-y-1"><Label>Timeline</Label><input type="text" value={formData.timeline} onChange={(e) => setFormData((p) => ({ ...p, timeline: e.target.value }))} placeholder="e.g. 6 months" className={inputClass} /></div>
          <div className="space-y-1"><Label>Key Deadline</Label><input type="text" value={formData.deadline} onChange={(e) => setFormData((p) => ({ ...p, deadline: e.target.value }))} placeholder="e.g. Client demo in month 9" className={inputClass} /></div>
        </div>
      </div>

      {/* Step 5: Stakeholders */}
      <div className="space-y-3">
        <SectionHeader step={5} title="Key Stakeholders" description="Who are the decision-makers and influencers in this integration?" />
        {formData.stakeholders.length > 0 && (
          <div className="space-y-2">
            {formData.stakeholders.map((s, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-start rounded-md border border-[var(--color-border)] p-3">
                <input type="text" value={s.name} onChange={(e) => updateStakeholder(i, "name", e.target.value)} placeholder="Name" className={`${inputClass} w-28`} />
                <input type="text" value={s.role} onChange={(e) => updateStakeholder(i, "role", e.target.value)} placeholder="Role" className={`${inputClass} w-32`} />
                <select value={s.influence} onChange={(e) => updateStakeholder(i, "influence", e.target.value)} className={`${inputClass} w-24`}>
                  <option value="">Influence</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select value={s.stance} onChange={(e) => updateStakeholder(i, "stance", e.target.value)} className={`${inputClass} w-28`}>
                  <option value="">Stance</option>
                  <option value="supportive">Supportive</option>
                  <option value="neutral">Neutral</option>
                  <option value="resistant">Resistant</option>
                </select>
                <input type="text" value={s.concerns} onChange={(e) => updateStakeholder(i, "concerns", e.target.value)} placeholder="Concerns" className={`${inputClass} flex-1 min-w-[120px]`} />
                <button type="button" onClick={() => removeStakeholder(i)} className="text-neutral-400 hover:text-red-500 text-sm px-1">&times;</button>
              </div>
            ))}
          </div>
        )}
        <button type="button" onClick={addStakeholder} className="text-xs text-[var(--color-accent)] hover:underline">+ Add stakeholder</button>
      </div>

      {/* Step 6: Constraints */}
      <div className="space-y-3">
        <SectionHeader step={6} title="Constraints & Non-Negotiables" description="Budget limits, immovable deadlines, contractual obligations, retention commitments." />
        <textarea value={formData.constraints} onChange={(e) => setFormData((p) => ({ ...p, constraints: e.target.value }))} placeholder={`e.g.\nRetention bonuses expire in 6 months for 3 key engineers\nBoard expects "synergies" report in Q1\nNo budget for new tooling licenses this fiscal year`} rows={3} className={`${inputClass} font-mono`} />
      </div>

      {/* Step 7: Context */}
      <div className="space-y-3">
        <SectionHeader step={7} title="Additional Context" description="M&A experience, political dynamics, friction points, cultural observations." />
        <textarea value={formData.context} onChange={(e) => setFormData((p) => ({ ...p, context: e.target.value }))} placeholder={`e.g.\nThis is a friendly acquisition — acquired team is generally positive\nAcquirer's tech lead tends to impose architecture decisions\nLanguage differences (NL team primarily Dutch-speaking in meetings)`} rows={3} className={`${inputClass} font-mono`} />
      </div>

      <button type="submit" disabled={!hasData || isLoading} className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? "Generating..." : "Generate Integration Playbook"}
      </button>
    </form>
  );
}
