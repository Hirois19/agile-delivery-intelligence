import type { TeamHealthAnalysis } from "./types";

// Scenario 1: Scrum Adoption (Early Stage)
export const MOCK_SCRUM_ADOPTION: TeamHealthAnalysis = {
  overallScore: 48,
  dimensions: {
    morale: {
      score: 5,
      trend: "improving",
      rationale:
        "Morale is cautiously positive. Sprint 5 was a breakthrough moment ('best sprint so far') and the team sees progress. However, recurring rollover is creating a 'never finish' feeling (Sprint 6 retro). The trajectory is upward but fragile — one bad sprint could reset the mood. Key positive: the team is still engaged enough to critique the process, which means they haven't given up on Scrum yet.",
    },
    efficiency: {
      score: 4,
      trend: "improving",
      rationale:
        "Completion rate improved from 33% to 76-80% over 6 sprints — a genuine learning curve, not a crisis. The core problem is estimation maturity: 13 SP stories have a 0% completion rate, 8 SP stories complete only 33% of the time. The team is learning that 'big stories don't fit in sprints' but hasn't fully internalized the discipline of splitting them. PR size (350 lines avg) confirms stories are too large.",
    },
    quality: {
      score: 5,
      trend: "stable",
      rationale:
        "Quality practices are adequate but immature. PR cycle time (2.8 days) and review turnaround (1.2 days) are reasonable for a team this new to structured development. The 1 unreviewed PR per sprint (urgent bug fixes) is a minor concern but not a pattern of negligence. The real quality risk is the absence of a Definition of Done — without it, 'done' is subjective and technical debt accumulates invisibly.",
    },
    sustainability: {
      score: 4,
      trend: "stable",
      rationale:
        "The first-time SM is learning but lacks confidence to push back on mid-sprint scope changes. This is the biggest sustainability risk: if the PO continues to inject work mid-sprint without consequence, the team will never achieve predictable delivery. The 2-hour refinement sessions signal that estimation conversations are unfocused — this will burn people out if not addressed.",
    },
  },
  rootCauses: [
    {
      finding: "Story sizing is the primary bottleneck — large stories consistently fail to complete",
      evidence:
        "8 SP stories: 33% completion rate. 13 SP stories: 0% completion rate. Sprint 4 retro: 'three stories were 90% done at sprint end.' This is a classic pattern — the team estimates in 'effort to code' but ignores testing, review, and integration time. Stories above 5 SP are essentially multi-sprint work items disguised as single stories.",
      severity: "high",
    },
    {
      finding: "No Definition of Done creates ambiguity and phantom progress",
      evidence:
        "Sprint 4 retro: 'everyone has a different idea of done.' Stories marked as '90% complete' at sprint end are not 90% done — they're 100% coded and 0% validated. Without a shared DoD, the team can't distinguish between 'code complete' and 'shippable,' which inflates perceived progress and guarantees rollover.",
      severity: "high",
    },
    {
      finding: "Sprint boundary is not being protected — mid-sprint scope injection undermines commitment",
      evidence:
        "Sprint 4: PO added 2 stories mid-sprint. Sprint 5 retro: 'still struggle with no changes mid-sprint rule.' Sprint 6 retro: 'SM doesn't push back when PO adds mid-sprint work.' Each mid-sprint addition trains the team that sprint commitments are negotiable, which destroys the predictability Scrum is supposed to create.",
      severity: "high",
    },
    {
      finding: "External dependencies are unmanaged — no risk mitigation in sprint planning",
      evidence:
        "Sprint 6: two stories blocked by external API with no fallback plan. This is a planning maturity issue — the team doesn't yet distinguish between 'work we control' and 'work that depends on others.' Dependency management wasn't needed in their waterfall days because timelines were longer.",
      severity: "medium",
    },
    {
      finding: "Refinement sessions are inefficient — 2 hours of estimation debate with diminishing returns",
      evidence:
        "Sprint 5 retro: 'refinement sessions are too long, we argue about points too much.' The team is treating estimation as a precision exercise instead of a relative sizing conversation. This is normal for teams new to story points but needs correction before it becomes entrenched.",
      severity: "medium",
    },
  ],
  actionItems: [
    {
      action:
        "Establish a team-wide Definition of Done as a collaborative workshop — include code review, testing, and PO acceptance as minimum criteria",
      urgency: "act_now",
      type: "Workshop",
      expectedOutcome:
        "Shared understanding of 'done' eliminates the '90% complete' illusion. Stories are either done or not done — no middle ground. Expect rollover count to initially increase (honest accounting) before decreasing.",
    },
    {
      action:
        "Enforce a hard rule: no stories larger than 5 SP enter a sprint. Any 8+ SP story must be split in refinement before sprint planning",
      urgency: "act_now",
      type: "Process change",
      expectedOutcome:
        "Completion rate should jump to 85-90% within 2 sprints. Smaller stories flow through the system faster and reduce the 'almost done' problem.",
    },
    {
      action:
        "Coach the SM on sprint protection: practice specific phrases for pushing back on mid-sprint additions ('We can add this to next sprint, or we can swap it for an equal-sized item — which do you prefer?')",
      urgency: "act_now",
      type: "1-on-1 coaching",
      expectedOutcome:
        "SM gains confidence and tools to protect sprint integrity. PO learns that mid-sprint changes have a visible cost (swapping, not adding).",
    },
    {
      action:
        "Timebox refinement to 60 minutes. Use reference stories (a 'known 3' and a 'known 5') as anchors instead of debating each story from scratch",
      urgency: "next_retro",
      type: "Process change",
      expectedOutcome:
        "Faster estimation, less fatigue. Reference stories calibrate the team's shared understanding of what a '3' feels like vs. an '8.'",
    },
    {
      action:
        "Add a 'dependency check' step to sprint planning: for each story, ask 'Does this depend on anyone outside our team? What's the fallback if they're blocked?'",
      urgency: "next_retro",
      type: "Process change",
      expectedOutcome:
        "External blockers identified before sprint starts. Team can sequence work to avoid idle time when dependencies stall.",
    },
    {
      action:
        "Monitor: track the ratio of stories completed vs. rolled over by size bucket (1-2, 3-5, 8, 13) for the next 3 sprints to validate that the 5 SP cap is working",
      urgency: "monitor",
      type: "Metrics review",
      expectedOutcome:
        "Data to confirm whether the sizing rule is effective, or whether the real issue is elsewhere (e.g., unclear acceptance criteria, not story size).",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "Completion rate is 76% with frequent rollover. Recommend reducing planned SP to match actual velocity (~26 SP) to improve completion rate and team morale.",
      pmJudgment:
        "Don't just lower the target — the real fix is smaller stories. A team that plans 34 SP of well-sized stories (all ≤5 SP) will complete more than a team that plans 26 SP of poorly-sized stories (including 13 SP monsters). Fix the input quality, not the quantity. Also: the improving trend (33% → 80%) shows this team is learning fast. Artificially capping velocity now could signal that management has low expectations.",
      rationale:
        "AI optimizes for the completion metric. An experienced SM recognizes that the root cause isn't overcommitment in volume — it's underinvestment in story decomposition. The team's natural velocity is likely higher than 26 SP once stories are properly sized.",
    },
    {
      aiSuggestion:
        "Estimation accuracy is low with high variance. Recommend switching to #NoEstimates or t-shirt sizing to reduce estimation overhead and frustration.",
      pmJudgment:
        "Abandoning estimation 3 months into Scrum adoption would be premature — the team hasn't yet learned what estimation teaches: how to decompose work, surface assumptions, and align on scope. The 2-hour refinement sessions aren't a sign that estimation is broken; they're a sign that the team is still learning to think in increments. Timebox refinement, introduce reference stories, and give it 2 more quarters before reconsidering the estimation approach.",
      rationale:
        "AI sees estimation pain and suggests eliminating it. An experienced SM knows that the conversation around estimation is more valuable than the number itself — it forces the team to discuss unknowns, dependencies, and assumptions they'd otherwise skip. Removing that conversation too early robs the team of a critical learning mechanism.",
    },
    {
      aiSuggestion:
        "Stories frequently roll over between sprints. Recommend implementing a WIP limit and Kanban-style continuous flow instead of fixed sprint commitments.",
      pmJudgment:
        "Switching to Kanban now would be retreating from the discomfort of sprint discipline — which is exactly what this team needs to grow through. Rollover is decreasing (37 SP → 8 SP over 6 sprints). The sprint boundary creates healthy pressure to finish and forces difficult conversations about scope. Instead of removing the boundary, strengthen it: enforce the DoD, cap story size at 5 SP, and protect the sprint from mid-sprint injection. Revisit Kanban in 6 months if the team outgrows Scrum's structure.",
      rationale:
        "AI identifies the symptom (rollover) and suggests a framework that eliminates sprint boundaries. An SM who has guided teams through Scrum adoption knows that the sprint boundary is a teaching tool — it makes waste visible. Removing it too early lets the team avoid the root causes (poor sizing, no DoD, scope creep) instead of fixing them.",
    },
  ],
};

// Scenario 2: SAFe Adoption (PI Planning + Scrum)
export const MOCK_SAFE_ADOPTION: TeamHealthAnalysis = {
  overallScore: 62,
  dimensions: {
    morale: {
      score: 7,
      trend: "improving",
      rationale:
        "Morale shows a clear PI 1 → PI 2 improvement arc. PI 1 was marked by frustration: 'PI Planning was overwhelming,' 'our PI plan means nothing' (mid-PI reprioritization), and 'ART Sync feels like status reports.' By PI 2, tone shifted to confidence: 'PI Planning was better this time,' 'best PI so far,' '100% feature completion.' The cross-team hackathon in the IP sprint was a morale high point. The team is beginning to see SAFe's value — but only because PI 2 went well. One bad PI could reset this fragile buy-in.",
    },
    efficiency: {
      score: 6,
      trend: "improving",
      rationale:
        "PI-level efficiency improved dramatically: PI 1 completed 78% of planned features (129/165 SP), PI 2 completed 100% (116/116 SP). Sprint-level completion improved from 70-89% (PI 1) to 79-94% (PI 2). However, PI 1's 165 SP plan was unrealistic — the team over-committed by ~20% because they applied pre-SAFe velocity without accounting for SAFe ceremony overhead (PI Planning, ART Sync, System Demos). PI 2's 100% completion partly reflects better planning, not just better execution.",
    },
    quality: {
      score: 6,
      trend: "improving",
      rationale:
        "PR metrics improved across every dimension: cycle time down 25%, review turnaround down 18%, unreviewed PRs down 80%. Cross-team PRs tripled (5%→15%), indicating growing collaboration beyond team boundaries. The IP sprint hackathon producing a shared CI/CD template is a quality multiplier. Remaining concern: the team's quality practices are solid within their team but untested at ART scale — cross-team integration quality is still an unknown.",
    },
    sustainability: {
      score: 5,
      trend: "stable",
      rationale:
        "SAFe ceremony overhead is the biggest sustainability question. The team is absorbing PI Planning (2 days), ART Sync (weekly), System Demo (bi-weekly), and Inspect & Adapt — on top of existing Scrum ceremonies. PI 1 retro: 'management questioned why we weren't delivering features during IP sprint' reveals organizational misunderstanding of SAFe's built-in sustainability mechanisms. If IP sprints are pressured into feature work, the team loses its only recovery time.",
    },
  },
  rootCauses: [
    {
      finding: "PI Planning estimation is not yet calibrated — PI 1 over-committed by 22% due to ignoring SAFe overhead",
      evidence:
        "PI 1 planned 165 SP but delivered 129 SP (78%). Sprint 3 retro: 'We over-committed at PI Planning — 165 SP was based on pre-SAFe velocity without accounting for ceremony overhead.' The team's pre-SAFe velocity was ~30 SP/sprint × 5 = 150 SP, but SAFe ceremonies consume roughly 10-15% of capacity. PI 2 corrected to 116 SP and achieved 100% — confirming that the issue was planning calibration, not team capability.",
      severity: "high",
    },
    {
      finding: "Cross-team dependencies are the primary source of sprint-level disruption",
      evidence:
        "PI 1: 2/2 identified dependencies caused blocks (100% failure rate), averaging 3.5 days blocked per dependency. Team Bravo blocked F2 for 3 days in Sprint 2; Platform Data team delayed F3 across Sprint 4-5. PI 2 improved: only 1/3 dependencies caused blocks (33%), resolved in 1.5 days via ART Sync. The dependency management mechanism is working but still maturing.",
      severity: "high",
    },
    {
      finding: "Mid-PI reprioritization undermines PI commitment and team trust in the planning process",
      evidence:
        "PI 1, Sprint 4: F4 (Config Management) was deprioritized mid-PI because 'leadership shifted focus.' Team retro: 'Feels like our PI plan means nothing.' F4 completed only 36% in PI 1 and had to carry over 16 SP to PI 2. This is the #1 risk to SAFe adoption — if leadership treats PI plans as suggestions rather than commitments, teams will stop investing effort in PI Planning.",
      severity: "high",
    },
    {
      finding: "IP sprint value is not understood by management — creating pressure to use it for feature delivery",
      evidence:
        "PI 1 IP sprint retro: 'management questioned why we weren't delivering features.' The IP sprint exists for innovation, planning, and tech debt reduction — it's SAFe's built-in sustainability mechanism. When management pressures teams to deliver features during IP sprints, they're borrowing from the team's recovery time. PI 2's successful hackathon demonstrates IP sprint value, but one data point may not be enough to change management's mindset.",
      severity: "medium",
    },
    {
      finding: "ART Sync meetings need restructuring to shift from status reporting to problem-solving",
      evidence:
        "PI 1, Sprint 5 retro: 'ART Sync meetings feel like status reports, not problem-solving. Who is this for?' However, PI 2 Sprint 9 retro shows improvement: 'flagged the Security blocker early via ART Sync and RTE helped unblock.' The RTE's arrival and growing facilitation maturity is converting ART Sync from overhead to value — but this transition is incomplete.",
      severity: "medium",
    },
  ],
  actionItems: [
    {
      action:
        "Establish a PI Planning calibration formula: use (pre-SAFe velocity × 0.85) as baseline capacity for PI commitments, adjusted by known dependency risk. Present the PI 1 vs PI 2 data as evidence",
      urgency: "act_now",
      type: "Process change",
      expectedOutcome:
        "Realistic PI commitments that account for SAFe overhead. Teams stop over-promising and under-delivering. Stakeholders get reliable forecasts instead of optimistic fantasies.",
    },
    {
      action:
        "Present a 'PI commitment protection' proposal to leadership: once features are committed at PI Planning, they can only be changed through a formal process with trade-off visibility (swap, not add)",
      urgency: "act_now",
      type: "Escalation",
      expectedOutcome:
        "PI plans become meaningful commitments. Teams invest in PI Planning because they trust the output will be respected. Leadership learns to make prioritization decisions at PI boundaries, not mid-PI.",
    },
    {
      action:
        "Formalize dependency management: every identified dependency gets an owner, a resolution date, and a fallback plan before leaving PI Planning. Track as a risk on the ART board",
      urgency: "act_now",
      type: "Process change",
      expectedOutcome:
        "Dependency block rate continues to decrease (PI 1: 100% → PI 2: 33% → target PI 3: <20%). Average block duration drops below 1 day.",
    },
    {
      action:
        "Educate management on IP sprint purpose: present the PI 2 hackathon ROI (shared CI/CD template adopted by 4 teams) as concrete evidence of IP sprint value. Propose a protected IP sprint charter",
      urgency: "next_retro",
      type: "Workshop",
      expectedOutcome:
        "IP sprints protected from feature pressure. Teams use the time for innovation, tech debt, and cross-team improvements that compound over multiple PIs.",
    },
    {
      action:
        "Evolve ART Sync format: RTE to facilitate with a 'blockers and asks' agenda instead of team-by-team status updates. Time-box to 30 minutes with action items tracked",
      urgency: "next_retro",
      type: "Process change",
      expectedOutcome:
        "ART Sync perceived as valuable by team members, not just management. Problems surfaced and resolved faster at ART level.",
    },
    {
      action:
        "Monitor: track PI-level predictability (planned vs. delivered SP) and feature carryover rate across PI 3-4 to confirm the calibration formula is working",
      urgency: "monitor",
      type: "Metrics review",
      expectedOutcome:
        "PI predictability reaches 90%+ by PI 4. Feature carryover drops below 10% of planned SP. Data supports (or challenges) continued SAFe investment.",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "PI 1 delivered only 78% of planned features while PI 2 achieved 100%. The data shows clear improvement. Recommend maintaining current trajectory and scaling SAFe practices to other ARTs.",
      pmJudgment:
        "The PI 1→PI 2 improvement is real but misleading if taken at face value. PI 2 planned 116 SP vs. PI 1's 165 SP — a 30% reduction in scope. The team didn't get 28% more productive; they got 100% better at planning. That's a crucial distinction for stakeholders: SAFe is improving predictability, not velocity. Scaling to other ARTs should wait until this ART demonstrates 2 more PIs of consistent performance — premature scaling is the #1 cause of SAFe failure.",
      rationale:
        "AI sees the completion percentage improvement and attributes it to execution. An experienced RTE/SM knows that the biggest SAFe win is planning calibration, not speed — and that overselling early results leads to unrealistic expectations when the framework scales.",
    },
    {
      aiSuggestion:
        "Cross-team dependencies caused significant delays in PI 1. Recommend reducing dependencies by restructuring teams around value streams to minimize cross-team handoffs.",
      pmJudgment:
        "Team restructuring is the nuclear option — save it for after you've exhausted process improvements. The data shows dependency management is already improving: block rate dropped from 100% to 33%, resolution time halved. The RTE + ART Sync combination is working. Before reorganizing teams, focus on: (1) better dependency identification at PI Planning, (2) earlier escalation via ART Sync, (3) fallback plans for every dependency. If after 2 more PIs dependencies still cause >20% of sprint disruptions, then consider structural changes.",
      rationale:
        "AI jumps to the architectural solution (restructure teams). An SM experienced with SAFe knows that most dependency problems are communication problems, not structural ones — and that reorganizing teams mid-adoption creates chaos that dwarfs the dependency cost.",
    },
    {
      aiSuggestion:
        "Feature F4 (Config Management) was deprioritized mid-PI and only reached 36% completion, carrying over 16 SP to PI 2. Recommend building buffer into PI plans to absorb priority changes from leadership.",
      pmJudgment:
        "Adding buffer treats the symptom. The root cause is that leadership is changing priorities mid-PI — which violates the fundamental SAFe contract between teams and stakeholders. PI Planning exists so that trade-off conversations happen before commitment, not after. The fix is organizational discipline, not planning padding: present the cost of mid-PI changes in concrete terms (F4 took 2 PIs instead of 1, consuming sprint capacity that could have started F5 earlier). If leadership needs the flexibility to reprioritize, shorten the PI cadence to 4 sprints — don't undermine the one you have.",
      rationale:
        "AI suggests a planning technique (buffer) to work around an organizational behavior (mid-PI reprioritization). An experienced SM/RTE knows that accommodating bad behavior makes it permanent. The goal is to change the behavior by making its cost visible, not to absorb it by planning defensively.",
    },
  ],
};

// Scenario 3: Post-M&A Integration
export const MOCK_POST_MERGER: TeamHealthAnalysis = {
  overallScore: 52,
  dimensions: {
    morale: {
      score: 5,
      trend: "improving",
      rationale:
        "Morale is recovering but unevenly distributed. Sprint 5 was a turning point ('team is starting to gel') but Sprint 4 revealed a deeper issue: Bravo members feel their input is dismissed. This is the classic acquirer-dominant dynamic — 'we already have a way to do that' shuts down the acquired team's contributions and breeds resentment. The pair-programming rotation and ADRs are helping, but cultural integration lags behind process integration.",
    },
    efficiency: {
      score: 6,
      trend: "improving",
      rationale:
        "Velocity improved from 55% to 91% completion over 6 sprints — a strong recovery trajectory. However, the Sprint 4 regression (76%) shows the team is vulnerable to management pressure ('show quick wins'). True efficiency is also masked by the 2 Bravo engineers maintaining the legacy Django app 20% of their time — effectively, the team is operating at 9.6 FTE, not 11.",
    },
    quality: {
      score: 5,
      trend: "improving",
      rationale:
        "PR cycle time improved from 5.2 to 3.1 days, and unreviewed PRs dropped from 4 to 1 per sprint. Cross-team reviews (35%, up from 10%) are a strong positive signal — people are learning each other's code. But cross-team reviews are still significantly slower (2.2 days vs. team average of 1.5 days), reflecting the two-codebase reality. The absence of shared CI/testing standards is the biggest quality risk — inconsistent quality gates mean bugs can ship through the weaker pipeline.",
    },
    sustainability: {
      score: 4,
      trend: "stable",
      rationale:
        "Three structural issues threaten long-term sustainability: (1) Unrealistic velocity expectations from management (combined pre-merger velocity of 65 SP is a fantasy for a newly merged team). (2) Two SMs transitioning to one — someone loses their role, creating political tension. (3) Legacy Django app maintenance is splitting focus for 2 engineers. Until these structural issues are resolved, the team is running on goodwill and early-merger energy that will eventually fade.",
    },
  },
  rootCauses: [
    {
      finding: "Acquirer-dominant culture dynamic is suppressing contributions from TargetCo engineers",
      evidence:
        "Sprint 4 retro: 'Bravo members feel their input is dismissed — we already have a way to do that.' Sprint 3 retro: 'Who decides the architecture? Alpha's tech lead or Bravo's?' This is the most common failure mode in post-M&A integration: the acquiring team treats the merge as an onboarding of new members into their existing culture, rather than a genuine synthesis of two teams.",
      severity: "high",
    },
    {
      finding: "Management velocity expectations are unrealistic and creating pressure to cut corners",
      evidence:
        "Sprint 6 retro: 'management expects merged velocity (65 SP) which is unrealistic.' Sprint 4 regression was caused by management pushing for 'quick wins.' Research shows merged teams typically operate at 60-70% of combined pre-merger velocity for 3-6 months. Expecting 100% within 2 quarters ignores integration overhead entirely.",
      severity: "high",
    },
    {
      finding: "Legacy application maintenance is fragmenting team focus",
      evidence:
        "Sprint 6 retro: 'Two Bravo engineers still maintaining old Django app part-time — split focus hurts.' These engineers are context-switching between two codebases, two tech stacks, and two sets of priorities. They can't fully integrate into the merged team while anchored to the legacy system.",
      severity: "high",
    },
    {
      finding: "No shared engineering standards — two CI pipelines, no common Definition of Done",
      evidence:
        "Sprint 4 retro: 'Testing strategy is a mess — two different CI pipelines, no shared standards.' Sprint 6 retro: 'We need a team working agreement.' Without shared standards, code review becomes a cultural negotiation rather than a quality check. Each review is an implicit debate about whose standards are 'right.'",
      severity: "medium",
    },
    {
      finding: "Dual SM structure creates ambiguity and delays the formation of a unified team identity",
      evidence:
        "Plan to transition from 2 SMs to 1 by Sprint 10, but no clarity on how or who. This creates uncertainty for both SMs and the team. Retro facilitation style, conflict resolution approach, and team norms all depend on which SM stays — leaving this unresolved means the team can't fully commit to a single way of working.",
      severity: "medium",
    },
  ],
  actionItems: [
    {
      action:
        "Facilitate an explicit team working agreement workshop: coding standards, review expectations, DoD, and decision-making process — built jointly, not inherited from either team",
      urgency: "act_now",
      type: "Workshop",
      expectedOutcome:
        "Shared standards reduce cross-team PR friction. Decision-making clarity prevents 'whose architecture wins' debates. Both teams feel ownership of the merged culture.",
    },
    {
      action:
        "Present realistic velocity data to management: show the 55%→91% improvement trajectory and propose a 6-month target of 40-45 SP (not 65 SP), backed by industry benchmarks on post-M&A team integration",
      urgency: "act_now",
      type: "Escalation",
      expectedOutcome:
        "Management resets expectations based on data rather than fantasy math. Team is protected from pressure to deliver an impossible number.",
    },
    {
      action:
        "Create a dedicated plan to sunset the legacy Django app: define a migration timeline, allocate the 2 Bravo engineers full-time to the merged team, and establish a maintenance rotation instead of permanent assignment",
      urgency: "act_now",
      type: "Process change",
      expectedOutcome:
        "Bravo engineers fully integrate into the team. Legacy maintenance becomes a shared responsibility (or eliminated). Team operates at 11 FTE, not 9.6.",
    },
    {
      action:
        "Address the acquirer-dominant dynamic directly: in the next retro, run a 'What did Team Bravo do better?' exercise. Identify at least 2 Bravo practices to adopt into the merged team's workflow",
      urgency: "next_retro",
      type: "Workshop",
      expectedOutcome:
        "Bravo engineers feel valued and heard. The merged team adopts the best of both cultures rather than defaulting to the acquirer's way. Reduces attrition risk for TargetCo engineers.",
    },
    {
      action:
        "Resolve the SM transition plan: decide on the single SM by Sprint 8, with a clear transition plan and a role for the other SM (Agile Coach, second team, etc.)",
      urgency: "next_retro",
      type: "1-on-1",
      expectedOutcome:
        "Clarity on team leadership. The selected SM can fully invest in the team's development without political uncertainty.",
    },
    {
      action:
        "Monitor: track cross-team PR review percentage and cycle time as a measure of integration progress. Target: cross-team reviews at 50%+ with cycle time within 0.5 days of same-team reviews by Sprint 12",
      urgency: "monitor",
      type: "Metrics review",
      expectedOutcome:
        "Objective measure of whether the team is truly integrating or still operating as two sub-teams sharing a board.",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "Team velocity is only 29 SP with 11 engineers (2.6 SP per person). Industry benchmark for similar teams is 4-5 SP per person. Recommend identifying and removing efficiency blockers to close the gap.",
      pmJudgment:
        "Per-person velocity benchmarks are meaningless for a team 6 sprints into a merger. The '11 engineers' number is misleading — 2 are part-time on legacy maintenance, the team is still learning each other's codebases, and cross-team reviews take 50% longer than same-team reviews. This is integration overhead, not inefficiency. The right benchmark is the team's own trajectory: 55% → 91% completion in 6 sprints is rapid improvement. Focus on removing structural blockers (legacy maintenance, dual CI, unclear standards) rather than chasing a per-person productivity number.",
      rationale:
        "AI applies a generic productivity benchmark to a non-generic situation. An experienced SM knows that post-M&A teams have legitimate integration costs that don't appear in industry averages, and that pressuring for 'benchmark' productivity during integration accelerates attrition rather than performance.",
    },
    {
      aiSuggestion:
        "Two different tech stacks (TypeScript/React and Python/Django) create maintenance burden. Recommend migrating all code to a single stack to reduce cognitive load and improve team velocity.",
      pmJudgment:
        "A full migration right now would be catastrophic. The team is already stressed by the merger, learning new processes, and dealing with unrealistic expectations. Adding a rewrite on top would destroy morale and delay integration by 6+ months. Instead, draw a clear boundary: new features in TypeScript/React, legacy app in maintenance-only mode with a sunset date. Migrate incrementally as features are replaced, not as a big-bang rewrite. The Bravo engineers' Django expertise is an asset during the transition — frame it as 'you know what this code does, so you're the best people to help us migrate it correctly.'",
      rationale:
        "AI sees two stacks and suggests consolidation — technically correct but organizationally disastrous. An SM who has lived through post-M&A integration knows that big rewrites during mergers are the #1 cause of engineer attrition: the acquired team feels their work is being thrown away, and the acquiring team resents the 'distraction' from new features.",
    },
    {
      aiSuggestion:
        "Retro comments indicate cultural friction between the two sub-teams. Recommend team-building activities and social events to improve interpersonal relationships.",
      pmJudgment:
        "Team-building events help but don't fix structural power imbalances. If Bravo engineers feel their technical input is dismissed in daily work, a team dinner won't change that. The fix is structural: (1) adopt specific Bravo practices into the merged workflow so they see their influence, (2) assign Bravo engineers as tech leads on features where their domain knowledge is strongest, (3) make architectural decisions through ADRs where both teams have equal voice, not through informal conversations dominated by the acquiring team's existing relationships. Social bonds follow from professional respect, not the other way around.",
      rationale:
        "AI suggests the default corporate integration playbook (team-building). An SM with M&A experience knows that cultural integration happens through shared work and mutual respect in daily interactions — not through organized fun. The real fix is ensuring the acquired team has structural influence, not just social inclusion.",
    },
  ],
};

// Default mock (backward compatibility) — uses Scrum Adoption scenario
export const MOCK_HEALTH_ANALYSIS: TeamHealthAnalysis = MOCK_SCRUM_ADOPTION;

// Map scenario IDs to mock responses
export const MOCK_RESPONSES: Record<string, TeamHealthAnalysis> = {
  "scrum-adoption": MOCK_SCRUM_ADOPTION,
  "safe-adoption": MOCK_SAFE_ADOPTION,
  "post-merger": MOCK_POST_MERGER,
};

