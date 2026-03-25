import type { MnAIntegrationAnalysis } from "./mna-types";

const MOCK_CROSS_BORDER: MnAIntegrationAnalysis = {
  executiveSummary:
    "This is a friendly but complex cross-border integration: 3 teams across NL-DE with completely different tool ecosystems (Linear/GitLab/Notion vs Jira/GitHub/Confluence), different languages in meetings, and a contractual client demo deadline at month 9. The primary risk is not cultural — it's tooling migration creating a proxy war for cultural dominance. Recommended approach: skill-based redistribution into 2 cross-functional teams over 12 months, with tool migration sequenced AFTER trust is established (not before). Estimated integration: 48 weeks with the client demo as the forcing function for the first major milestone.",
  overallRiskLevel: "medium",
  estimatedIntegrationWeeks: 48,
  risks: [
    { riskName: "Tooling migration as cultural proxy war", category: "tooling", severity: "high", description: "NL uses Linear/GitLab/Notion, DE uses Jira/GitHub/Confluence. Forcing either side's tools on the other will be perceived as 'our way won.' Tool choice becomes a symbol of whose culture is dominant.", mitigation: "Defer tool standardization until Phase 2 (after trust is built). Let each team keep their tools initially. Introduce a shared integration board (e.g., a new shared Linear workspace) for cross-team work only.", likelihood: "very_likely" },
    { riskName: "Language barrier in ceremonies", category: "communication", severity: "medium", description: "DE team's daily standups are in German. Some DE members are uncomfortable switching to English. Forcing English-only could suppress DE team participation.", mitigation: "Start with bilingual ceremonies: English as primary, with German sidebar allowed. Provide 2-3 months transition period. Offer English coaching budget for DE team members who want it.", likelihood: "likely" },
    { riskName: "Architecture decision authority unclear", category: "process", severity: "high", description: "NL uses ADRs with team consensus. DE Engineering Manager is used to making architecture decisions unilaterally. Without clarity, every technical decision becomes a power struggle.", mitigation: "Establish shared ADR process from Week 1. Give DE Engineering Manager explicit authority over legacy Java services architecture. Give NL tech leads authority over new platform features. Joint decisions for integration points.", likelihood: "likely" },
    { riskName: "DE senior engineer attrition", category: "culture", severity: "high", description: "8yr tenure senior engineer is resistant and worried about seniority recognition. In a startup-culture acquirer, formal seniority is less visible. If this person leaves, critical Java/Spring knowledge is lost.", mitigation: "1-on-1 with DE senior engineer within Week 1. Explicitly acknowledge their expertise. Assign them as tech lead for the legacy service migration — making them essential, not redundant.", likelihood: "possible" },
    { riskName: "Sprint cadence mismatch", category: "process", severity: "medium", description: "NL: 2-week sprints. DE: 3-week sprints. Kanban team has no sprints. Aligning cadence will disrupt DE team's rhythm.", mitigation: "Align to 2-week sprints after Phase 1. During Phase 1, let DE keep 3-week sprints but synchronize start/end dates so cross-team planning is possible.", likelihood: "likely" },
    { riskName: "Frozen tooling budget blocks migration", category: "tooling", severity: "medium", description: "NL tooling budget frozen Q1-Q2. Cannot purchase new licenses for 6 months. This limits migration options.", mitigation: "Use this constraint as a feature: 'We're deliberately not rushing tool migration.' Use the free tier of shared tools for cross-team collaboration. Full migration starts Q3 when budget unlocks.", likelihood: "very_likely" },
  ],
  toolingAnalysis: {
    categories: [
      { category: "Project Management", acquirerTool: "Linear", acquiredTool: "Jira", gapSeverity: "high", migrationComplexity: "high", recommendation: "Keep both for 6 months. Create shared Linear workspace for cross-team epics. Migrate DE to Linear in Phase 3 after trust is established.", migrationRisk: "Jira→Linear migration will be perceived as 'NL won.' Time it after DE team has positive experiences with Linear on joint projects." },
      { category: "CI/CD", acquirerTool: "GitLab CI", acquiredTool: "GitHub Actions", gapSeverity: "medium", migrationComplexity: "medium", recommendation: "Standardize on GitHub Actions (DE's tool). It's more widely used, has better marketplace, and letting DE 'win' one category builds goodwill.", migrationRisk: "NL team needs 2-3 sprint migration effort. Low emotional impact since CI/CD is not identity-forming." },
      { category: "Communication", acquirerTool: "Slack", acquiredTool: "Microsoft Teams", gapSeverity: "high", migrationComplexity: "low", recommendation: "Migrate to Slack immediately. Create shared channels Day 1. Communication tool migration is the easiest win and highest-impact for daily integration.", migrationRisk: "Teams→Slack is well-documented. DE team may resist if they have deep Teams integrations (calendar, calls). Bridge period: 2 weeks." },
      { category: "Repository", acquirerTool: "GitLab", acquiredTool: "GitHub", gapSeverity: "medium", migrationComplexity: "high", recommendation: "Migrate to GitHub over 6 months. GitLab→GitHub repo migration is straightforward but CI pipelines need rewriting. Sequence: new repos on GitHub, legacy repos migrate service-by-service.", migrationRisk: "NL CI/CD pipelines need rewriting (GitLab CI → GitHub Actions). Budget 3-4 sprints across both teams." },
      { category: "Design", acquirerTool: "Figma", acquiredTool: "Sketch (legacy)", gapSeverity: "low", migrationComplexity: "low", recommendation: "Standardize on Figma immediately. DE team's Sketch usage is legacy and they're likely willing to switch.", migrationRisk: "Minimal. Sketch→Figma migration tools exist. 1 sprint effort maximum." },
      { category: "Documentation", acquirerTool: "Notion", acquiredTool: "Confluence", gapSeverity: "medium", migrationComplexity: "medium", recommendation: "Keep both for 9 months. New shared documentation in Notion. Legacy Confluence content migrates gradually. Don't force DE to abandon 3 years of Confluence content overnight.", migrationRisk: "Confluence→Notion content migration is tedious but not technically complex. The real risk is institutional knowledge that's in people's heads, not in either tool." },
    ],
    migrationPriority: ["Communication (Slack)", "Design (Figma)", "Repository (GitHub)", "CI/CD (GitHub Actions)", "Project Management (Linear)", "Documentation (Notion)"],
    estimatedMigrationWeeks: 32,
    recommendation: "Phased migration over 8 months. Start with low-emotion tools (Communication, Design) to build confidence. Save high-emotion tools (PM, Documentation) for last, after trust is established.",
  },
  teamReorgPlan: {
    currentState: [
      { teamName: "NL-Platform", members: 7, keySkills: ["TypeScript", "Next.js", "GraphQL", "Frontend"], methodology: "Scrum", tools: ["Linear", "GitLab", "Slack", "Notion"] },
      { teamName: "NL-Data", members: 5, keySkills: ["Python", "FastAPI", "dbt", "Data Engineering"], methodology: "Kanban", tools: ["Linear", "GitLab", "Slack", "Notion"] },
      { teamName: "DE-Services", members: 6, keySkills: ["Java", "Spring Boot", "Angular", "Enterprise"], methodology: "Scrum", tools: ["Jira", "GitHub", "Teams", "Confluence"] },
    ],
    proposedState: [
      { teamName: "Platform & Integration", members: 9, keySkills: ["TypeScript", "Java", "Next.js", "Spring Boot", "API Design"], methodology: "Scrum", tools: ["Linear", "GitHub", "Slack", "Notion"] },
      { teamName: "Data & Intelligence", members: 9, keySkills: ["Python", "TypeScript", "Data Engineering", "Angular", "ML"], methodology: "Scrum", tools: ["Linear", "GitHub", "Slack", "Notion"] },
    ],
    reorgApproach: "skill_based_redistribution",
    phases: [
      { phaseNumber: 1, description: "Keep 3 teams intact. Introduce cross-team pairing and shared ceremonies.", durationWeeks: 8, teamsAfterPhase: [{ teamName: "NL-Platform", members: 7, keySkills: ["TypeScript", "Next.js"], methodology: "Scrum", tools: ["Linear"] }, { teamName: "NL-Data", members: 5, keySkills: ["Python", "Data"], methodology: "Kanban", tools: ["Linear"] }, { teamName: "DE-Services", members: 6, keySkills: ["Java", "Spring Boot"], methodology: "Scrum", tools: ["Jira"] }] },
      { phaseNumber: 2, description: "Merge NL-Data and 2 DE engineers into 'Data & Intelligence'. NL-Platform absorbs 4 DE engineers into 'Platform & Integration'.", durationWeeks: 12, teamsAfterPhase: [{ teamName: "Platform & Integration", members: 9, keySkills: ["TypeScript", "Java"], methodology: "Scrum", tools: ["Linear", "GitHub"] }, { teamName: "Data & Intelligence", members: 9, keySkills: ["Python", "Java", "Angular"], methodology: "Scrum", tools: ["Linear", "GitHub"] }] },
      { phaseNumber: 3, description: "Stabilize new teams. Full tool migration. Optimize team composition based on learnings.", durationWeeks: 28, teamsAfterPhase: [{ teamName: "Platform & Integration", members: 9, keySkills: ["TypeScript", "Java", "Next.js", "Spring Boot"], methodology: "Scrum", tools: ["Linear", "GitHub", "Slack", "Notion"] }, { teamName: "Data & Intelligence", members: 9, keySkills: ["Python", "TypeScript", "Data Engineering", "ML"], methodology: "Scrum", tools: ["Linear", "GitHub", "Slack", "Notion"] }] },
    ],
    retentionRisks: [
      "DE Senior Engineer (8yr tenure): resistant to culture change, seniority recognition concern. High risk if not given visible technical leadership role.",
      "DE Engineering Manager: role changes from decision-maker to facilitator. Identity shift may cause departure if not managed carefully.",
      "NL-Data team: Kanban→Scrum transition may frustrate team members who value continuous flow.",
    ],
  },
  playbook: [
    {
      phaseName: "Discovery",
      phaseNumber: 1,
      durationWeeks: 4,
      objectives: ["Build trust between teams", "Map technical landscape", "Establish shared communication"],
      keyActivities: ["Cross-team 1-on-1s (every NL member meets every DE member)", "Technical architecture mapping workshops", "Shared Slack workspace setup", "Joint retrospective on each team's strengths"],
      milestones: ["All team members have met individually", "Architecture map documented", "Shared communication channel active"],
      antiPatterns: ["Don't start with tool migration — tools are identity", "Don't schedule 'integration planning' meetings without social context first", "Don't let acquirer leadership dominate the first all-hands"],
      deliverables: ["Team relationship map", "Architecture compatibility assessment", "Communication plan"],
    },
    {
      phaseName: "Alignment",
      phaseNumber: 2,
      durationWeeks: 8,
      objectives: ["Align on shared practices", "Start cross-team pairing", "Begin low-impact tool migrations"],
      keyActivities: ["Shared Definition of Done workshop", "Cross-team pair programming rotation (1 day/week)", "Migrate to Slack and Figma", "Architecture Decision Records (ADR) process established", "Sprint cadence alignment discussions"],
      milestones: ["Shared DoD agreed", "First cross-team feature delivered", "Communication and Design tools unified", "ADR process adopted by all teams"],
      antiPatterns: ["Don't force sprint cadence alignment in the first month", "Don't let ADR process become a rubber stamp for NL decisions", "Don't dismiss DE's 3-week sprint rationale without understanding it"],
      deliverables: ["Shared DoD document", "ADR template and first 3 decisions", "Cross-team pairing schedule"],
    },
    {
      phaseName: "Integration",
      phaseNumber: 3,
      durationWeeks: 16,
      objectives: ["Redistribute into 2 teams", "Deliver client demo milestone", "Complete major tool migrations"],
      keyActivities: ["Team redistribution (Phase 2 of reorg plan)", "Client demo preparation (month 9)", "GitHub migration for all repositories", "Linear workspace consolidation", "Knowledge transfer from DE legacy services"],
      milestones: ["2 new teams operational", "Client demo delivered successfully", "All repos on GitHub", "All teams using Linear"],
      antiPatterns: ["Don't split people who work well together just for 'balanced' teams", "Don't rush the client demo at the cost of team stability", "Don't treat tool migration as complete when the migration is done — watch for 'shadow tool' usage"],
      deliverables: ["New team charters", "Client demo", "Migration completion report"],
    },
    {
      phaseName: "Optimization",
      phaseNumber: 4,
      durationWeeks: 20,
      objectives: ["Stabilize new teams", "Optimize velocity", "Complete documentation migration"],
      keyActivities: ["Team health checks (monthly)", "Velocity tracking and optimization", "Confluence→Notion migration", "Retrospective on integration process", "Career path clarification for all team members"],
      milestones: ["Team velocity stabilized at 80%+ of pre-merger combined", "All documentation in Notion", "Zero 'shadow tools' in use", "Team satisfaction survey shows positive trend"],
      antiPatterns: ["Don't declare 'integration complete' based on tool migration — integration is complete when people feel like one team", "Don't stop checking in with DE team members after month 6 — that's when retention bonuses might not be the only thing keeping them"],
      deliverables: ["Integration retrospective document", "Updated team health baseline", "Lessons learned for future acquisitions"],
    },
  ],
  communicationPlan: [
    { audience: "All teams (joint)", channel: "All-hands video call", frequency: "Bi-weekly", keyMessage: "Integration progress, wins, upcoming changes — transparent about challenges", timing: "Week 1 onwards", owner: "CTO + DE Engineering Manager (co-hosted)" },
    { audience: "DE-Services team", channel: "Dedicated team sync", frequency: "Weekly", keyMessage: "Your expertise is valued. Here's how your work fits into the bigger picture", timing: "Week 1 onwards", owner: "SM (NL) + DE Engineering Manager" },
    { audience: "NL teams", channel: "Existing team syncs", frequency: "Weekly", keyMessage: "Integration adds capability, not overhead. Here's what DE brings that we don't have", timing: "Week 1 onwards", owner: "NL SMs" },
    { audience: "Leadership / Board", channel: "Monthly report + quarterly review", frequency: "Monthly", keyMessage: "Integration milestones, risk status, velocity impact (honest)", timing: "Month 1 onwards", owner: "CTO" },
    { audience: "Client (demo stakeholders)", channel: "Quarterly update", frequency: "Quarterly", keyMessage: "Unified platform progress, demo readiness", timing: "Month 3 onwards", owner: "Head of Product" },
  ],
  weeklyCheckins: [
    { weekNumber: 1, phase: "Discovery", focusArea: "First impressions and relationship building", questionsToAsk: ["Has every team member met at least 3 people from the other team?", "Are there any immediate concerns or misconceptions to address?", "Is the shared Slack channel active?"], warningSignals: ["DE team members not joining shared channels", "Side conversations about 'them' vs 'us'", "DE Engineering Manager not included in planning discussions"], successIndicators: ["Casual conversations happening in shared channels", "At least one 'I didn't know you did that — cool!' moment", "DE team asking questions about NL architecture (curiosity, not defensiveness)"] },
    { weekNumber: 2, phase: "Discovery", focusArea: "Technical landscape mapping", questionsToAsk: ["Do both sides understand the other's architecture?", "Have we identified the integration points?", "Are there any 'this is worse than we thought' surprises?"], warningSignals: ["Technical discussions becoming competitive ('our way is better')", "DE team not sharing documentation or access", "Architecture mapping done by NL alone without DE input"], successIndicators: ["Joint architecture whiteboard session happened", "Both sides found something to learn from the other", "Integration points identified and assigned joint ownership"] },
    { weekNumber: 4, phase: "Discovery → Alignment", focusArea: "Transition to shared practices", questionsToAsk: ["Is the DoD workshop scheduled?", "Are cross-team 1-on-1s still happening?", "Any tool migration friction?"], warningSignals: ["DoD workshop keeps getting postponed", "Cross-team pairing feels forced", "DE team using Teams 'because it's easier'"], successIndicators: ["DoD draft exists and both sides contributed", "At least one spontaneous cross-team collaboration", "Slack adoption natural, not mandated"] },
    { weekNumber: 8, phase: "Alignment", focusArea: "Readiness for team redistribution", questionsToAsk: ["Do people know which team they'll be on?", "Are there concerns about the split?", "Has the DE senior engineer been given a leadership role?"], warningSignals: ["People learning about team changes from rumors, not management", "DE team feeling 'split up and absorbed'", "Senior engineer still resistant / updating LinkedIn"], successIndicators: ["Team redistribution plan co-created with input from all teams", "DE engineer leading architecture decisions on legacy services", "Cross-team feature delivery happening naturally"] },
  ],
  doFirstNeverDoChecklist: {
    doFirst: [
      "Schedule 1-on-1s between every NL and DE team member in Week 1 — relationships before process",
      "Set up shared Slack channels immediately — communication tool is the lowest-friction, highest-impact first move",
      "Acknowledge DE team's expertise publicly in the first all-hands — they need to hear 'we acquired you because you're good'",
      "Give DE Engineering Manager a visible role in the integration — exclusion = resistance",
      "Assign DE senior engineer as tech lead for legacy service migration — make them essential, not threatened",
      "Create a shared ADR process for architecture decisions — prevents informal NL-dominant decision-making",
    ],
    neverDo: [
      "Never force Jira→Linear (or vice versa) in the first 3 months — tool migration before trust = cultural war",
      "Never let the first all-hands be an NL leadership presentation — it must be co-hosted or DE feels 'presented to'",
      "Never say 'this is how we do things here' to the acquired team — say 'let's figure out the best approach together'",
      "Never split up DE team members into separate NL teams in Phase 1 — they need each other for psychological safety",
      "Never dismiss the 3-week sprint cadence as 'wrong' — understand WHY before proposing change",
      "Never treat tool migration as a technical task — it's an emotional and political task that happens to involve technology",
      "Never let the budget freeze become an excuse for inaction — use free-tier shared tools as a bridge",
    ],
  },
  judgmentLayers: [
    {
      aiSuggestion: "Tool ecosystems are completely different across 6 categories. Recommend immediate standardization to reduce fragmentation: pick the best tool in each category and migrate all teams within 3 months.",
      pmJudgment: "This is the single fastest way to destroy the acquisition. Tool choice is identity — telling the DE team to abandon Jira/GitHub/Confluence in month 1 says 'your way of working is wrong.' Instead: start with Communication (Slack) and Design (Figma) — these are low-identity tools where the switch is painless. Save Project Management (Linear vs Jira) for month 6+, AFTER the teams have built trust through shared work. And critically: let DE 'win' at least one tool choice (GitHub over GitLab) so the migration isn't one-directional.",
      rationale: "AI sees tool fragmentation as an efficiency problem to solve quickly. A DM who has led post-M&A integration knows that tool migration is never about the tools — it's about whose culture gets to define 'how we work.' Rushing it signals dominance. Sequencing it signals respect.",
    },
    {
      aiSuggestion: "Team redistribution should optimize for skill balance: distribute Java and TypeScript engineers evenly across both new teams to maximize cross-functional capability.",
      pmJudgment: "Skill balance is the secondary criterion. The primary criterion is psychological safety: don't isolate DE team members. In Phase 2, ensure each new team has at least 2-3 DE members together — never put a single DE engineer alone in a team of NL engineers. They need allies who share their context, language, and working style during the transition. Once the teams gel (Phase 3+), natural redistribution will happen as people find where they contribute most. Also: let people express preferences. Forced placement breeds resentment; choice breeds ownership.",
      rationale: "AI optimizes for skill distribution as if engineers are interchangeable resources. A DM who has integrated post-M&A teams knows that the first 3 months are about belonging, not capability. An isolated engineer from the acquired team will disengage faster than an unskilled one who has peers.",
    },
    {
      aiSuggestion: "The DE Engineering Manager's role changes significantly in a flatter NL culture. Recommend a clear conversation about the new role expectations and organizational structure.",
      pmJudgment: "A 'clear conversation about role expectations' is a euphemism for 'we're demoting you.' The DE EM went from being the technical authority for their team to being... what? In NL's flat structure, there's no equivalent role. This is the highest-risk personnel situation in the entire integration. Before having that conversation: (1) create a real role that leverages their skills — 'Integration Architect' for the legacy service migration, or 'Engineering Practice Lead' responsible for the ADR process across both teams. (2) Ensure the title and scope are meaningful, not a consolation prize. (3) Have the conversation as a collaboration ('we need your expertise to lead X') not a notification ('your role is changing to Y').",
      rationale: "AI treats role changes as an information-transfer problem. A DM with M&A experience knows that an Engineering Manager whose role is diminished will become the most effective saboteur of the integration — not out of malice, but out of self-preservation. The goal is to transform potential resistance into visible leadership.",
    },
  ],
};

const MOCK_CLASSIC_MERGE: MnAIntegrationAnalysis = {
  executiveSummary:
    "Same tools, different cultures. Both teams use Jira/Slack/GitHub but with vastly different practices: Alpha requires 2 code review approvals and documented sprint retros; Beta trusts senior devs to merge without review and runs retros verbally. The risk isn't technical — it's the 'bureaucracy vs cowboys' perception on both sides. With a 3-month timeline and Q3 roadmap commitment, the integration must happen fast without alienating either team's identity. Recommended approach: full merge with a jointly-created team working agreement that cherry-picks the best practices from each side.",
  overallRiskLevel: "medium",
  estimatedIntegrationWeeks: 12,
  risks: [
    { riskName: "Culture clash: process vs speed", category: "culture", severity: "high", description: "Alpha sees Beta as 'undisciplined cowboys.' Beta sees Alpha as 'bureaucratic and slow.' Both are wrong — and both are right. Forcing either culture wholesale will alienate the other half.", mitigation: "Joint workshop to create a new team working agreement. Neither team's current practices are adopted wholesale — both contribute.", likelihood: "very_likely" },
    { riskName: "Code review practice gap", category: "process", severity: "high", description: "Alpha: 2 mandatory approvals. Beta: optional reviews, senior devs merge directly. Imposing Alpha's standard will slow Beta's velocity. Keeping Beta's standard will alarm Alpha about quality.", mitigation: "Compromise: 1 mandatory approval (not 2), CI must pass, PR template simplified. Senior devs from both sides earn 'trusted reviewer' status after demonstrating quality.", likelihood: "likely" },
    { riskName: "Beta PO departure in 2 months", category: "communication", severity: "high", description: "Beta's part-time PO is leaving. Their product knowledge hasn't been transferred. If they leave without handover, the team loses domain context.", mitigation: "Immediate knowledge transfer plan. Pair Beta PO with Alpha PO for remaining 8 weeks. Document all product decisions and roadmap context in Confluence.", likelihood: "very_likely" },
    { riskName: "Jira workflow mismatch", category: "tooling", severity: "medium", description: "Same tool, completely different configuration. Alpha: strict 4-stage workflow with story points. Beta: 2-stage workflow, no story points. Merging Jira boards will be contentious.", mitigation: "Create a NEW shared Jira board with a 3-stage workflow (To Do → In Progress → Done + a Review sub-state). Neither team's existing board 'wins.'", likelihood: "likely" },
  ],
  toolingAnalysis: {
    categories: [
      { category: "Project Management", acquirerTool: "Jira", acquiredTool: "Jira", gapSeverity: "medium", migrationComplexity: "low", recommendation: "Same tool but different configurations. Create new unified board with simplified workflow. Archive both old boards.", migrationRisk: "Alpha may resist losing their detailed workflow. Beta may resist adding any structure. New board = neutral ground." },
      { category: "CI/CD", acquirerTool: "GitHub Actions", acquiredTool: "GitHub Actions", gapSeverity: "none", migrationComplexity: "low", recommendation: "Same tool. Merge CI configs. Standardize on Alpha's pipeline quality gates (they're better).", migrationRisk: "Minimal. Beta may need to add test steps they don't currently have." },
      { category: "Communication", acquirerTool: "Slack", acquiredTool: "Slack", gapSeverity: "none", migrationComplexity: "low", recommendation: "Merge into shared channels. Create new team channel.", migrationRisk: "None." },
      { category: "Repository", acquirerTool: "GitHub", acquiredTool: "GitHub", gapSeverity: "none", migrationComplexity: "low", recommendation: "Same org. Standardize branch protection rules (Alpha's are better).", migrationRisk: "Beta devs will need to adjust to required reviews on PRs." },
      { category: "Design", acquirerTool: "Figma", acquiredTool: "Figma", gapSeverity: "none", migrationComplexity: "low", recommendation: "Merge team spaces.", migrationRisk: "None." },
      { category: "Documentation", acquirerTool: "Confluence", acquiredTool: "Confluence", gapSeverity: "low", migrationComplexity: "low", recommendation: "Same tool. Merge spaces. Adopt Alpha's documentation standards for new content.", migrationRisk: "Beta has minimal documentation. Adopting documentation standards feels like 'extra work' to them." },
    ],
    migrationPriority: ["Slack (merge channels)", "GitHub (branch protection)", "Jira (new unified board)", "Confluence (merge spaces)"],
    estimatedMigrationWeeks: 4,
    recommendation: "All tools are the same — migration is about unifying configurations and practices, not switching platforms. Focus on creating NEW shared configurations rather than forcing either team's existing setup.",
  },
  teamReorgPlan: {
    currentState: [
      { teamName: "Alpha", members: 8, keySkills: ["TypeScript", "React", "Node.js", "Strong process"], methodology: "Scrum", tools: ["Jira", "GitHub", "Slack"] },
      { teamName: "Beta", members: 6, keySkills: ["TypeScript", "React", "Node.js", "Fast shipping"], methodology: "Scrum (loose)", tools: ["Jira", "GitHub", "Slack"] },
    ],
    proposedState: [
      { teamName: "Unified Product Team", members: 14, keySkills: ["TypeScript", "React", "Node.js", "Balanced process + speed"], methodology: "Scrum", tools: ["Jira", "GitHub", "Slack", "Confluence"] },
    ],
    reorgApproach: "full_merge",
    phases: [
      { phaseNumber: 1, description: "Shadow period: Beta members join Alpha ceremonies as observers. Alpha members pair with Beta on features.", durationWeeks: 4, teamsAfterPhase: [{ teamName: "Alpha + Beta (shadow)", members: 14, keySkills: ["TypeScript", "React", "Node.js"], methodology: "Scrum", tools: ["Jira"] }] },
      { phaseNumber: 2, description: "Full merge: single backlog, shared board, new team working agreement in effect.", durationWeeks: 8, teamsAfterPhase: [{ teamName: "Unified Product Team", members: 14, keySkills: ["TypeScript", "React", "Node.js"], methodology: "Scrum", tools: ["Jira", "GitHub", "Slack"] }] },
    ],
    retentionRisks: [
      "Beta Tech Lead: may feel their autonomy is lost in a larger team with more process",
      "Alpha senior devs: may feel their velocity drops because of 'slower' Beta members",
      "Beta PO leaving: critical knowledge transfer needed before departure",
    ],
  },
  playbook: [
    { phaseName: "Discovery", phaseNumber: 1, durationWeeks: 2, objectives: ["Build relationships", "Understand each team's practices"], keyActivities: ["Cross-team 1-on-1s", "Practice mapping workshop: 'How do you do X?'", "Joint lunch/coffee"], milestones: ["Every member met someone from the other team", "Practice differences documented"], antiPatterns: ["Don't start with 'here are the new rules'", "Don't skip Beta team members in planning"], deliverables: ["Practice comparison document", "Relationship map"] },
    { phaseName: "Alignment", phaseNumber: 2, durationWeeks: 4, objectives: ["Create shared working agreement", "Merge Jira boards", "PO knowledge transfer"], keyActivities: ["Team working agreement workshop", "New Jira board creation", "Beta PO → Alpha PO pairing", "Code review standard negotiation"], milestones: ["Working agreement signed", "Unified Jira board live", "PO handover 50% complete"], antiPatterns: ["Don't let Alpha dictate the working agreement", "Don't frame code review as 'fixing Beta's bad practice'"], deliverables: ["Team working agreement", "Unified Jira board", "PO transition plan"] },
    { phaseName: "Integration", phaseNumber: 3, durationWeeks: 4, objectives: ["Operate as one team", "Deliver first unified sprint"], keyActivities: ["Single sprint planning", "Cross-team code reviews", "Unified retro", "PO handover completion"], milestones: ["First sprint completed as unified team", "PO transition complete", "Team velocity baseline established"], antiPatterns: ["Don't compare Alpha and Beta velocity separately", "Don't blame 'the other team' when things slip"], deliverables: ["Sprint report", "Velocity baseline", "PO handover complete"] },
    { phaseName: "Optimization", phaseNumber: 4, durationWeeks: 2, objectives: ["Stabilize and improve"], keyActivities: ["Retro on integration process", "Working agreement revision", "Q3 roadmap planning as unified team"], milestones: ["Team self-identifies as 'one team'", "Q3 roadmap planned"], antiPatterns: ["Don't stop retros on the integration just because the merge is 'done'"], deliverables: ["Integration retrospective", "Q3 roadmap"] },
  ],
  communicationPlan: [
    { audience: "Both teams", channel: "Joint all-hands", frequency: "Weekly for first month", keyMessage: "We're building something better together — here's this week's progress", timing: "Week 1", owner: "VP Engineering + Beta Tech Lead (co-hosted)" },
    { audience: "Leadership", channel: "Bi-weekly report", frequency: "Bi-weekly", keyMessage: "Integration milestones, velocity impact, Q3 readiness", timing: "Week 2", owner: "VP Engineering" },
  ],
  weeklyCheckins: [
    { weekNumber: 1, phase: "Discovery", focusArea: "First impressions", questionsToAsk: ["Have cross-team 1-on-1s happened?", "Any immediate concerns?"], warningSignals: ["'Us vs them' language", "Beta members excluded from discussions"], successIndicators: ["Genuine curiosity about each other's practices", "Shared Slack channel active"] },
    { weekNumber: 4, phase: "Alignment", focusArea: "Working agreement progress", questionsToAsk: ["Is the working agreement co-created or imposed?", "Is the code review compromise working?"], warningSignals: ["Beta team feels overruled", "Alpha team feels standards are dropping"], successIndicators: ["Both teams contributed to working agreement", "First cross-team PR reviewed smoothly"] },
  ],
  doFirstNeverDoChecklist: {
    doFirst: [
      "Create a NEW Jira board — don't adopt either team's existing board",
      "Schedule a joint 'Practice Mapping' workshop — make differences visible and non-judgmental",
      "Start PO knowledge transfer immediately — this is time-critical",
      "Negotiate code review standards together — neither team's current standard 'wins'",
    ],
    neverDo: [
      "Never say 'this is how Alpha does it' as justification for a practice",
      "Never merge Beta into Alpha's Jira board — create neutral ground",
      "Never skip Beta's input on the team working agreement",
      "Never dismiss Beta's 'move fast' culture as unprofessional — it's a strength when channeled",
    ],
  },
  judgmentLayers: [
    {
      aiSuggestion: "Alpha has stronger engineering practices (2 code review approvals, documented retros, strict Jira workflow). Recommend adopting Alpha's practices as the standard for the merged team.",
      pmJudgment: "Adopting Alpha's practices wholesale tells Beta 'you were doing it wrong.' Instead: create a NEW standard that's better than either team's current practice. Take Alpha's code review rigor but simplify it (1 approval, not 2). Take Beta's bias toward action but add guardrails. The merged team's practices should feel like an upgrade for BOTH sides, not a takeover by either side.",
      rationale: "AI evaluates practices on a quality axis and picks the 'better' one. A DM who has merged teams knows that the process of creating shared practices is as important as the practices themselves. Co-creation builds buy-in; imposition builds resentment.",
    },
  ],
};

const MOCK_HOSTILE: MnAIntegrationAnalysis = {
  ...MOCK_CROSS_BORDER,
  executiveSummary:
    "High-risk integration: acquired startup team is resistant, tooling differences are politically charged (Linear vs Jira/SAFe), 3 senior engineers have retention bonuses expiring in 6 months, and the board demands a 'synergies report' in 3 months. The acquired product is actually higher quality than the acquirer's — but the acquirer's process is being imposed. The previous acquisition by this company lost 60% of the team within 8 months. This integration requires political sophistication: visible 'synergies' for the board while protecting the acquired team's autonomy long enough to retain key talent past the bonus cliff.",
  overallRiskLevel: "high",
  estimatedIntegrationWeeks: 52,
};

export const MNA_MOCK_RESPONSES: Record<string, MnAIntegrationAnalysis> = {
  "classic-merge": MOCK_CLASSIC_MERGE,
  "cross-border": MOCK_CROSS_BORDER,
  "hostile-acquisition": MOCK_HOSTILE,
};

export const DEFAULT_MNA_MOCK = MOCK_CROSS_BORDER;
