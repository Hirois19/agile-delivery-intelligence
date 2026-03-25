export interface SampleScenario {
  id: string;
  name: string;
  description: string;
  data: string;
}

export const TEAM_HEALTH_SAMPLES: SampleScenario[] = [
  {
    id: "scrum-adoption",
    name: "Scrum Adoption (Early Stage)",
    description: "Scrum導入3ヶ月目 — SP見積もり精度が低く、ロールオーバーが頻発するチーム",
    data: `## Team: SmartShip Logistics (7 engineers, 1 PO, 1 SM — first-time SM)

### Context
- Team transitioned from ad-hoc/waterfall to Scrum 3 months ago (Sprint 1 = first ever sprint)
- SM was promoted internally from senior engineer role — no prior SM experience
- 2-week sprint cadence, using story points for the first time
- Team previously worked on 4-6 week release cycles with no formal estimation
- Management pushed Scrum adoption after delays in last 2 waterfall releases

### Sprint Velocity (Sprint 1-6, all sprints since Scrum adoption)
| Sprint | Planned SP | Completed SP | Rollover SP | Completion % | Notes |
|--------|-----------|-------------|-------------|-------------|-------|
| Sprint 1 | 55 | 18 | 37 | 33% | First sprint ever — wildly overcommitted |
| Sprint 2 | 45 | 22 | 23 | 49% | Carried over 15 SP from Sprint 1 + new work |
| Sprint 3 | 40 | 25 | 15 | 63% | Some stories split mid-sprint |
| Sprint 4 | 38 | 24 | 14 | 63% | 3 stories "almost done" at sprint end |
| Sprint 5 | 35 | 28 | 7  | 80% | Team starting to right-size stories |
| Sprint 6 | 34 | 26 | 8  | 76% | Regression — 2 large stories blocked by external API |

### Story Point Distribution (Sprint 6 snapshot)
| Size | Count | % of Backlog | Avg Completion Rate |
|------|-------|-------------|-------------------|
| 1-2 SP | 3 stories | 15% | 100% completed in sprint |
| 3-5 SP | 5 stories | 40% | 80% completed in sprint |
| 8 SP | 3 stories | 30% | 33% completed in sprint |
| 13 SP | 1 story | 15% | 0% completed in sprint (rolled over) |

### Retrospective Themes (Sprint 3-6)

**Sprint 3 Retro:**
- "I still don't know how to estimate — is a login page 3 or 8 points?"
- "We keep splitting stories mid-sprint, which messes up our tracking"
- "Daily standups feel like status reports to the manager, not team syncs"
- "Good: having a sprint goal helps focus, even if we miss it"

**Sprint 4 Retro:**
- "Three stories were 90% done at sprint end — feels wrong to call them incomplete"
- "We need a Definition of Done — everyone has a different idea of 'done'"
- "PO added 2 stories mid-sprint because stakeholder escalated"
- "Estimation poker is getting better but 8-point stories are always a gamble"

**Sprint 5 Retro:**
- "Best sprint so far — smaller stories made a big difference"
- "We actually finished most of what we planned for the first time!"
- "Still struggle with the 'no changes mid-sprint' rule — urgent bugs come in"
- "Refinement sessions are too long (2 hours) — we argue about points too much"

**Sprint 6 Retro:**
- "External API dependency killed two stories — we had no fallback plan"
- "Rollover stories are demoralizing — feels like we never finish"
- "SM is learning but sometimes doesn't push back when PO adds mid-sprint work"
- "Good: pair estimation with the other team gave us useful reference points"

### PR Metrics (Sprint 4-6 avg)
- Average PR cycle time: 2.8 days
- Average review turnaround: 1.2 days
- PRs merged without review: 1 per sprint (usually urgent bug fixes)
- Average PR size: 350 lines (too large — stories not broken down enough)

### Rollover Pattern Detail
- Sprint 1→2: 5 stories rolled over (3 were "in progress", 2 never started)
- Sprint 2→3: 4 stories rolled over (all "in progress")
- Sprint 3→4: 3 stories rolled over (2 were split, 1 blocked)
- Sprint 4→5: 2 stories rolled over (both "almost done")
- Sprint 5→6: 1 story rolled over (blocked by external dependency)
- Sprint 6→7: 2 stories rolling over (1 blocked, 1 underestimated at 13 SP)`,
  },
  {
    id: "safe-adoption",
    name: "SAFe Adoption (PI Planning + Scrum)",
    description: "SAFe導入6ヶ月 — PI Planningとスプリントの2層で分析。PI間のフィーチャー繰越パターンに注目",
    data: `## Team: InfraPlatform (9 engineers, 1 PO, 1 SM, part of ART "Cloud Foundation" — 4 teams)

### Context
- Team has been doing Scrum for 2 years with stable velocity (~30 SP/sprint)
- SAFe (Scaled Agile Framework) introduced 6 months ago across the ART
- PI cadence: 5 sprints per PI (2-week sprints) + 1 Innovation & Planning (IP) sprint
- This data covers PI 1 (Sprint 1-5) and PI 2 (Sprint 6-10)
- RTE (Release Train Engineer) joined 3 months ago — first RTE for this ART
- Team had no prior experience with PI Planning, ART Sync, or cross-team dependency management

---

### PI 1 Planning Outcomes (Planned at PI Planning event)

| Feature | Planned SP | Target Sprint | Dependencies |
|---------|-----------|--------------|--------------|
| F1: API Gateway v2 | 45 | Sprint 1-3 | None |
| F2: Service Mesh Migration | 60 | Sprint 1-5 | Team Bravo (auth service) |
| F3: Observability Dashboard | 35 | Sprint 3-5 | Platform Data team (metrics API) |
| F4: Config Management Overhaul | 25 | Sprint 4-5 | None |
| **PI 1 Total Planned** | **165** | | |

### PI 1 Sprint-Level Velocity

| Sprint | Planned SP | Completed SP | Rollover SP | Completion % | Features Worked On |
|--------|-----------|-------------|-------------|-------------|-------------------|
| Sprint 1 | 38 | 30 | 8  | 79% | F1 (20), F2 (10) |
| Sprint 2 | 40 | 28 | 12 | 70% | F1 (15), F2 (13) — F2 blocked 3 days by Team Bravo |
| Sprint 3 | 36 | 32 | 4  | 89% | F1 (10, completed), F2 (12), F3 (10) |
| Sprint 4 | 34 | 26 | 8  | 76% | F2 (14), F3 (8), F4 (4) — F3 blocked by Platform Data API delay |
| Sprint 5 | 32 | 28 | 4  | 88% | F2 (15), F3 (8), F4 (5) |
| **PI 1 Total** | **180** | **144** | | **80%** | |

### PI 1 Feature Completion at PI Boundary

| Feature | Planned SP | Completed SP | Status at PI 1 End | Carryover to PI 2 |
|---------|-----------|-------------|-------------------|-------------------|
| F1: API Gateway v2 | 45 | 45 | ✅ Done | — |
| F2: Service Mesh Migration | 60 | 49 | ⚠️ 82% — testing incomplete | 11 SP |
| F3: Observability Dashboard | 35 | 26 | ⚠️ 74% — blocked by dependency | 9 SP |
| F4: Config Management Overhaul | 25 | 9 | ❌ 36% — deprioritized mid-PI | 16 SP |
| **PI 1 Total** | **165** | **129** | **78% completed** | **36 SP carryover** |

---

### PI 2 Planning Outcomes

| Feature | Planned SP | Target Sprint | Dependencies | Notes |
|---------|-----------|--------------|--------------|-------|
| F2: Service Mesh (carryover) | 11 | Sprint 6 | Team Bravo (resolved) | Must finish first |
| F3: Observability (carryover) | 9 | Sprint 6-7 | Platform Data (API now ready) | Dependency cleared |
| F4: Config Management (carryover) | 16 | Sprint 7-8 | None | Re-prioritized by PO |
| F5: Zero-Trust Network Policy | 50 | Sprint 7-10 | Security team (policy review) | New PI 2 feature |
| F6: Developer Portal MVP | 30 | Sprint 8-10 | None | New PI 2 feature |
| **PI 2 Total Planned** | **116** | | | 36 SP carryover + 80 SP new |

### PI 2 Sprint-Level Velocity

| Sprint | Planned SP | Completed SP | Rollover SP | Completion % | Features Worked On |
|--------|-----------|-------------|-------------|-------------|-------------------|
| Sprint 6 | 34 | 31 | 3  | 91% | F2 (11, completed), F3 (9, completed), F5 (11) |
| Sprint 7 | 32 | 30 | 2  | 94% | F4 (10), F5 (12), F6 (8) |
| Sprint 8 | 34 | 27 | 7  | 79% | F4 (6, completed), F5 (13), F6 (8) — F5 blocked by Security team review |
| Sprint 9 | 30 | 28 | 2  | 93% | F5 (14), F6 (14) |
| Sprint 10 | 28 | 26 | 2  | 93% | F5 (completed), F6 (completed) — stretch goal pulled in |
| **PI 2 Total** | **158** | **142** | | **90%** | |

### PI 2 Feature Completion at PI Boundary

| Feature | Planned SP | Completed SP | Status at PI 2 End |
|---------|-----------|-------------|-------------------|
| F2: Service Mesh (carryover) | 11 | 11 | ✅ Done Sprint 6 |
| F3: Observability (carryover) | 9 | 9 | ✅ Done Sprint 6 |
| F4: Config Management (carryover) | 16 | 16 | ✅ Done Sprint 8 |
| F5: Zero-Trust Network Policy | 50 | 50 | ✅ Done Sprint 10 |
| F6: Developer Portal MVP | 30 | 30 | ✅ Done Sprint 10 |
| **PI 2 Total** | **116** | **116** | **100% completed** |

---

### Retrospective Themes

**PI 1 Retros (selected themes across sprints):**
- Sprint 1: "PI Planning was overwhelming — 2 days felt like a marathon but we have clearer goals now"
- Sprint 2: "Dependency on Team Bravo killed 3 days of work. How do we prevent this?"
- Sprint 3: "We over-committed at PI Planning — 165 SP was based on pre-SAFe velocity without accounting for ceremony overhead"
- Sprint 4: "F4 got deprioritized mid-PI because leadership shifted focus. Feels like our PI plan means nothing"
- Sprint 5: "ART Sync meetings feel like status reports, not problem-solving. Who is this for?"
- IP Sprint: "Finally had time to pay down tech debt, but management questioned why we weren't delivering features"

**PI 2 Retros (selected themes across sprints):**
- Sprint 6: "Finishing carryover features first was the right call — clean slate for new work"
- Sprint 7: "PI Planning was better this time — we padded estimates for dependency risk and it paid off"
- Sprint 8: "Security team dependency is the new bottleneck — same pattern as Team Bravo in PI 1"
- Sprint 9: "Starting to see the value of ART-level visibility — we flagged the Security blocker early via ART Sync and RTE helped unblock"
- Sprint 10: "Best PI so far. 100% feature completion. Team confidence is high"
- IP Sprint: "Used IP sprint for a cross-team hackathon — built a shared CI/CD template that all 4 ART teams adopted"

### PR Metrics (PI 1 vs PI 2 comparison)
| Metric | PI 1 Avg | PI 2 Avg | Change |
|--------|---------|---------|--------|
| PR cycle time | 2.8 days | 2.1 days | -25% |
| Review turnaround | 1.1 days | 0.9 days | -18% |
| PRs without review | 2/sprint | 0.4/sprint | -80% |
| Cross-team PRs | 5% | 15% | +200% |

### Dependency Tracking (PI 1 vs PI 2)
| Metric | PI 1 | PI 2 |
|--------|------|------|
| Dependencies identified at PI Planning | 2 | 3 |
| Dependencies that caused sprint-level blocks | 2 (100%) | 1 (33%) |
| Avg days blocked per dependency | 3.5 days | 1.5 days |
| Dependencies resolved via ART Sync | 0 | 2 |`,
  },
  {
    id: "post-merger",
    name: "Post-M&A Integration",
    description: "Two teams merging after acquisition, culture clash, tool mismatch",
    data: `## Team: Unified Logistics (merged team — 11 engineers, 1 PO, 2 SMs transitioning to 1)

### Background
- AcquirerCo bought TargetCo 4 months ago
- "Team Alpha" (AcquirerCo, 6 engineers, Scrum) merged with "Team Bravo" (TargetCo, 5 engineers, Kanban)
- Merged into single team "Unified Logistics" at Sprint 1
- Different tech stacks: Alpha uses TypeScript/React, Bravo used Python/Django
- Sprint cadence standardized to 2-week Scrum (new for Bravo members)

### Sprint Velocity (first 6 sprints as merged team)
| Sprint | Planned SP | Completed SP | Rollover SP | Completion % |
|--------|-----------|-------------|-------------|-------------|
| Sprint 1 | 40 | 22 | 18 | 55% |
| Sprint 2 | 35 | 25 | 10 | 71% |
| Sprint 3 | 32 | 28 | 4  | 88% |
| Sprint 4 | 34 | 26 | 8  | 76% |
| Sprint 5 | 30 | 27 | 3  | 90% |
| Sprint 6 | 32 | 29 | 3  | 91% |

### Retrospective Themes (Sprint 3-6)

**Sprint 3 Retro:**
- "Getting better at working together but still feels like two sub-teams"
- "Code reviews take forever — we don't understand each other's codebases"
- "Who decides the architecture? Alpha's tech lead or Bravo's?"
- "Good: joint backlog refinement is actually working well"

**Sprint 4 Retro:**
- "Sprint 4 regression: mid-sprint scope change from management to 'show quick wins'"
- "Bravo members feel their input is dismissed — 'we already have a way to do that'"
- "Testing strategy is a mess — two different CI pipelines, no shared standards"
- "Good: the pair-programming rotation between Alpha and Bravo devs is helping"

**Sprint 5 Retro:**
- "Best sprint yet — team is starting to gel"
- "Architecture decision records (ADRs) are helping resolve tech disagreements"
- "Still awkward in retros — Bravo team used async retros, not used to speaking up live"
- "PO is doing a good job balancing features from both legacy products"

**Sprint 6 Retro:**
- "Velocity is stabilizing, feels like real progress"
- "Two Bravo engineers are still maintaining old Django app part-time — split focus hurts"
- "We need a team working agreement — coding standards, review expectations, definition of done"
- "Concern: management expects 'merged velocity' (Alpha + Bravo historical) which is unrealistic"

### PR Metrics (last 4 sprints avg)
- Average PR cycle time: 3.1 days (improving from 5.2 days in Sprint 1-2)
- Average review turnaround: 1.5 days (cross-team reviews are slower: 2.2 days)
- PRs merged without review: 1 per sprint (down from 4 in Sprint 1)
- Cross-team PR reviews: 35% of all reviews (up from 10% in Sprint 1)

### Context
- Management expects merged team to reach combined pre-merger velocity (65 SP) within 2 quarters
- Two Bravo engineers still maintain legacy Django application 20% of their time
- Team has two Scrum Masters — plan to transition to one by Sprint 10
- AcquirerCo engineering culture: strong process, documentation-heavy
- TargetCo engineering culture: move fast, informal communication, less ceremony`,
  },
];

// Backward compatibility
export const TEAM_HEALTH_SAMPLE = TEAM_HEALTH_SAMPLES[0].data;
