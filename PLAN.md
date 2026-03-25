# Agile Delivery Intelligence — Project Plan

## What is this?

AI-powered delivery analysis tools that augment PM/SM judgment. Not replacements for experience — amplifiers of it. Built as a portfolio piece for job applications (Berlin scale-ups, international PM/SM roles).

## Core concept

Existing agile tools show **what happened**. This tool explains **why it happened** and **what to do about it**. Each module includes a "PM Judgment Layer" that contrasts AI suggestions with what an experienced SM/PM should actually do.

## 4 Modules

| # | Module | Focus | Status |
|---|--------|-------|--------|
| 1 | Team Health Diagnostic | Multi-signal team health analysis (velocity + retro + PR metrics) | **Done (v2: GuidedForm + 3 scenarios + API connected)** |
| 2 | Tech Debt Business Translator | Convert tech debt to business impact (delay days, €) | Not started |
| 3 | Estimation Bias Analyzer | Pattern analysis of why estimates miss | Not started |
| 4 | M&A Integration Playbook | Post-acquisition team integration playbook generator | Not started |

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- Tailwind CSS v4
- Claude API (Anthropic SDK) — with mock fallback for demo
- Recharts for data visualization
- Vercel for deployment

## Running locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Mock mode: works without API key. Set `ANTHROPIC_API_KEY` in `.env.local` for real AI analysis.

## Architecture

Each module follows the same 3-step pattern:
1. **Input**: Guided form (6-step wizard) OR paste raw data. CSV/Excel upload supported.
2. **AI Analysis**: Claude API (Sonnet 4) with PM-domain-specific system prompt. Mock fallback with scenario-specific responses.
3. **Output**: Structured results + PM Judgment Layer (AI suggestion vs experienced SM/PM perspective)

## Module 1 Details (Team Health Diagnostic)

- **Input modes**: Guided Form (primary) / Paste Data (advanced)
- **3 demo scenarios**: Scrum Adoption, SAFe Adoption, Post-M&A Integration
- **Each scenario includes**: Sprint velocity data, retro themes, PR metrics, team context
- **Mock responses**: Scenario-aware (each returns unique analysis with PM Judgment Layers)
- **API key**: Set in `.env.local` for real Claude API analysis

## Background

Originally planned 6 standalone tools (Meeting Cost Calculator, Sprint Retro Dashboard, etc.). Research showed 5/6 were already covered by existing products (Jira AI, TeamRetro, Otter.ai). Pivoted to this approach: fewer tools, deeper domain knowledge embedded in each.

## Full design plan

See `C:\Users\hiroy\.claude\plans\lively-splashing-pearl.md` for complete specifications of all 4 modules.
