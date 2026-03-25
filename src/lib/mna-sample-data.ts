import type { SampleScenario } from "./sample-data";

export const MNA_SAMPLES: SampleScenario[] = [
  {
    id: "classic-merge",
    name: "Classic Same-Tool Merge",
    description: "Two Scrum teams (8+6), same tools (Jira/Slack/GitHub), different processes and culture",
    data: `## Acquirer Team(s)

**Alpha Team**
- Size: 8 engineers, 1 PO, 1 SM
- Tech stack: TypeScript, React, Node.js, PostgreSQL
- Agile maturity: advanced
- Methodology: Scrum (2-week sprints, avg velocity 34 SP)
- Culture: Process-oriented, strong documentation habits, formal code review policy (2 approvals required), weekly architecture review meetings
- Location: Berlin, Germany

## Acquired Team(s)

**Beta Team**
- Size: 6 engineers, 1 PO (part-time, shared with another product)
- Tech stack: TypeScript, React, Node.js, PostgreSQL
- Agile maturity: intermediate
- Methodology: Scrum (2-week sprints, avg velocity 22 SP)
- Culture: Move fast, minimal documentation, code review is optional (trusted devs merge without review), informal decision-making via Slack threads
- Location: Berlin, Germany

## Tooling Inventory
| Category | Acquirer | Acquired |
|----------|----------|----------|
| Project Management | Jira | Jira (same) |
| CI/CD | GitHub Actions | GitHub Actions (same) |
| Communication | Slack | Slack (same) |
| Repository | GitHub | GitHub (same) |
| Design | Figma | Figma (same) |
| Documentation | Confluence | Confluence (same) |

## Integration Goals & Timeline
- Goal: Full merge into one team
- Timeline: 3 months
- Key deadline: Unified team must deliver Q3 product roadmap as one unit

## Key Stakeholders
- **VP Engineering** (acquirer) — Influence: high, Stance: supportive. Concerns: "Don't slow down Alpha's velocity"
- **Beta Tech Lead** — Influence: high, Stance: neutral. Concerns: "Will we have to adopt all of Alpha's processes? We move faster without heavy process"
- **Product Director** — Influence: high, Stance: supportive. Concerns: "Need combined team to deliver Q3 roadmap on time"

## Constraints & Non-Negotiables
- Must maintain current feature delivery velocity during merge (no "integration sprint" allowed)
- Beta's PO will leave in 2 months — need to transition product knowledge before then
- Q3 roadmap is already committed to customers

## Additional Context
- Same tools everywhere — the difference is HOW they use them
- Alpha's Jira: strict workflow (To Do → In Progress → In Review → Done), story point estimates required, sprint retrospectives documented in Confluence
- Beta's Jira: flexible workflow (just "To Do" and "Done"), no story points (they use gut feel), retros are verbal-only
- Alpha's code review: mandatory 2 approvals, CI must pass, PR template required
- Beta's code review: optional, senior devs often merge directly to main
- Beta team members feel Alpha is "too bureaucratic"; Alpha team feels Beta is "cowboy coding"`,
  },
  {
    id: "cross-border",
    name: "Cross-Border Integration (NL-DE)",
    description: "SITA × Materna IPS pattern: 3 teams across NL-DE, completely different tools, skill-based redistribution",
    data: `## Acquirer Team(s)

**NL-Platform (Netherlands)**
- Size: 7 engineers, 1 PO, 1 SM
- Tech stack: TypeScript, Next.js, GraphQL, MongoDB
- Agile maturity: advanced
- Methodology: Scrum (2-week sprints)
- Culture: Flat hierarchy, direct communication, English as working language, remote-first, informal decision-making
- Location: Amsterdam, Netherlands

**NL-Data (Netherlands)**
- Size: 5 engineers, 1 PO (shared with NL-Platform)
- Tech stack: Python, FastAPI, PostgreSQL, dbt
- Agile maturity: intermediate
- Methodology: Kanban
- Culture: Data-driven, documentation-heavy (Notion), async communication preferred
- Location: Amsterdam, Netherlands (2 remote in Rotterdam)

## Acquired Team(s)

**DE-Services (Germany)**
- Size: 6 engineers, 1 PO, 1 SM
- Tech stack: Java, Spring Boot, MySQL, Angular
- Agile maturity: intermediate
- Methodology: Scrum (3-week sprints)
- Culture: Hierarchical, German-language in daily meetings, office-first (Berlin), formal approval processes, strong work-life boundaries
- Location: Berlin, Germany

## Tooling Inventory
| Category | Acquirer (NL) | Acquired (DE) |
|----------|--------------|---------------|
| Project Management | Linear | Jira |
| CI/CD | GitLab CI | GitHub Actions |
| Communication | Slack | Microsoft Teams |
| Repository | GitLab | GitHub |
| Design | Figma | Sketch (legacy) |
| Documentation | Notion | Confluence |

## Integration Goals & Timeline
- Goal: Skill-based redistribution into 2 cross-functional teams
- Timeline: 12 months
- Key deadline: Unified client demo at month 9 (client contractual milestone)

## Key Stakeholders
- **CTO (NL, acquirer)** — Influence: high, Stance: supportive. Concerns: "Maintain innovation speed, don't let process slow us down"
- **Engineering Manager (DE, acquired)** — Influence: high, Stance: neutral-to-resistant. Concerns: "My team's expertise in enterprise Java/Spring is being undervalued. Will we all have to learn TypeScript?"
- **Head of Product** — Influence: high, Stance: supportive. Concerns: "Client demo at month 9 is non-negotiable"
- **DE Senior Engineer (8yr tenure)** — Influence: medium, Stance: resistant. Concerns: "I didn't sign up to work in a startup culture. Will my seniority be recognized?"

## Constraints & Non-Negotiables
- Client demo at month 9 must show unified platform (contractual)
- DE team members have German employment contracts — cannot change core working hours or office requirements unilaterally
- NL tooling budget frozen for Q1-Q2 — cannot purchase new licenses for another 6 months
- DE team's Java/Spring services must continue operating during migration (no big-bang rewrite)

## Additional Context
- Friendly acquisition — DE team generally positive about the merger but anxious about cultural differences
- NL teams communicate in English; DE team's daily standups are in German (some members uncomfortable switching to English)
- Different holiday schedules (NL: Koningsdag, DE: Tag der Deutschen Einheit) — affects sprint planning
- DE Engineering Manager is used to making architecture decisions; NL teams use ADRs with team consensus
- The 2 NL teams already work well together; integrating DE-Services is the challenge
- Target: 3 teams → 2 teams, redistributed by domain expertise, each team has NL + DE members`,
  },
  {
    id: "hostile-acquisition",
    name: "Resistant Team Integration",
    description: "Acquired team resistant, tooling is political (Jira forced vs Linear loved), retention risk, board pressure",
    data: `## Acquirer Team(s)

**Enterprise Platform**
- Size: 10 engineers, 1 PO, 1 SM, 1 Engineering Manager
- Tech stack: Java, Spring Boot, React, PostgreSQL, Kubernetes
- Agile maturity: advanced
- Methodology: SAFe (part of an ART, PI Planning, 5-sprint cadence)
- Culture: Enterprise culture — formal processes, detailed documentation, change advisory boards, security reviews for every deployment
- Location: Munich, Germany

## Acquired Team(s)

**Startup Product Team**
- Size: 7 engineers, 1 PO, 1 CTO-turned-Tech-Lead
- Tech stack: TypeScript, Next.js, Prisma, PostgreSQL, Vercel
- Agile maturity: intermediate
- Methodology: Kanban (no sprints, no story points, continuous deployment)
- Culture: Startup culture — ship fast, fix later, minimal process, founder-driven decisions, no formal code review, deploy 5-10 times per day
- Location: Berlin, Germany (fully remote)

## Tooling Inventory
| Category | Acquirer | Acquired |
|----------|----------|----------|
| Project Management | Jira (SAFe board configuration) | Linear |
| CI/CD | Jenkins + ArgoCD | Vercel + GitHub Actions |
| Communication | Microsoft Teams | Slack |
| Repository | Bitbucket | GitHub |
| Design | Figma | Figma (same) |
| Documentation | Confluence (extensive) | README files only |

## Integration Goals & Timeline
- Goal: Gradual alignment — shared platform within 12 months, but acquired product continues as separate offering
- Timeline: 12 months
- Key deadline: Board expects "synergies report" in Q1 (3 months), unified architecture proposal by month 6

## Key Stakeholders
- **VP Engineering (acquirer)** — Influence: high, Stance: supportive but impatient. Concerns: "We bought them for their product, not their process. But they need to align with our standards"
- **Acquired CTO (now Tech Lead)** — Influence: high, Stance: resistant. Concerns: "Jira and SAFe will kill our speed. We ship 10x per day, they ship once a sprint"
- **Board Representative** — Influence: very high, Stance: demanding. Concerns: "Show me synergies by Q1 or I question the acquisition price"
- **3 Senior Engineers (acquired)** — Influence: medium, Stance: resistant. Concerns: "Retention bonuses expire in 6 months. After that, we're leaving if things don't improve"

## Constraints & Non-Negotiables
- 3 acquired senior engineers have retention bonuses expiring in 6 months — losing them means losing 80% of product domain knowledge
- Board requires Q1 "synergies" report (real or perceived)
- Acquired product must continue operating and shipping features during integration (it generates revenue)
- Acquirer's security team requires all services to pass security review before production access — acquired team has never done one
- SAFe ceremony overhead is non-negotiable for acquirer (part of enterprise-wide framework)

## Additional Context
- Acquired CTO was the company founder — now reports to VP Engineering. Ego dynamics are significant
- Acquired team views Jira as "where productivity goes to die" — this is emotional, not rational
- Acquirer's team views acquired team as "undisciplined cowboys" — also emotional
- The acquired product is actually higher quality (fewer bugs, faster releases) despite less process
- Forcing Jira immediately would be perceived as "erasure" of the acquired team's identity
- Previous acquisition by this company (2 years ago) went badly — 60% of acquired team left within 8 months. Lessons were not documented`,
  },
];
