import type { TechDebtAnalysis } from "./tech-debt-types";

const MOCK_LEGACY_API: TechDebtAnalysis = {
  executiveSummary:
    "Your team is losing €273,000 per year to technical debt — the equivalent of hiring 2 senior engineers and getting zero output from them. The largest single cost is a deprecated API that forces every new feature to be built twice (€136,500/year). Three items can be fixed within 2 quarters for a total investment of €140,000, recovering 70% of the lost velocity. Delaying action increases risk of a Black Friday outage estimated at €50,000+ in lost revenue.",
  totalAnnualCostEur: 273000,
  totalVelocityDragPercent: 33,
  totalFixCostEur: 140000,
  businessImpacts: [
    {
      debtItemName: "Deprecated REST API v1",
      delayDaysPerSprint: 3.75,
      velocityDragPercent: 18.75,
      annualCostEur: 136500,
      riskDescription:
        "Mobile app v3 launch will be delayed by 3 weeks. Partner API marketplace cannot launch until v1 is fully deprecated. Every new feature takes 40% longer than it should.",
      businessLanguageSummary:
        "Imagine paying two construction crews to build the same room in two different styles — then throwing one away. That's what dual API implementation costs you every sprint.",
    },
    {
      debtItemName: "Monolithic Deployment Pipeline",
      delayDaysPerSprint: 1.9,
      velocityDragPercent: 9.4,
      annualCostEur: 68250,
      riskDescription:
        "Each deployment carries a 15% failure risk. Failed deploys cost 2-4 hours of team time. A critical hotfix takes 45+ minutes to reach production. During Black Friday, this delay could cost €15,000 per incident.",
      businessLanguageSummary:
        "Your delivery truck can only carry all packages at once — if one is wrong, everything goes back. You need separate trucks for separate services.",
    },
    {
      debtItemName: "Hardcoded Configuration",
      delayDaysPerSprint: 0.6,
      velocityDragPercent: 3.1,
      annualCostEur: 22750,
      riskDescription:
        "Toggling a feature flag requires a full deployment cycle (45 minutes + risk). Emergency feature disabling during an incident is dangerously slow.",
      businessLanguageSummary:
        "Changing the thermostat requires calling an electrician to rewire the building. It should be a switch on the wall.",
    },
    {
      debtItemName: "Missing API Rate Limiting",
      delayDaysPerSprint: 0.3,
      velocityDragPercent: 1.6,
      annualCostEur: 11375,
      riskDescription:
        "A repeat of the flash sale incident is inevitable. Next time, it could be a full outage instead of degraded performance. No protection against malicious traffic or partner misconfiguration.",
      businessLanguageSummary:
        "Your store has no bouncer — anyone can walk in with unlimited shopping carts and overwhelm the staff.",
    },
  ],
  roiCalculations: [
    {
      debtItemName: "Deprecated REST API v1",
      fixCostSP: 80,
      fixCostEur: 70000,
      annualSavingsEur: 136500,
      paybackMonths: 6,
      roiPercent: 95,
    },
    {
      debtItemName: "Monolithic Deployment Pipeline",
      fixCostSP: 45,
      fixCostEur: 39375,
      annualSavingsEur: 68250,
      paybackMonths: 7,
      roiPercent: 73,
    },
    {
      debtItemName: "Hardcoded Configuration",
      fixCostSP: 15,
      fixCostEur: 13125,
      annualSavingsEur: 22750,
      paybackMonths: 7,
      roiPercent: 73,
    },
    {
      debtItemName: "Missing API Rate Limiting",
      fixCostSP: 20,
      fixCostEur: 17500,
      annualSavingsEur: 11375,
      paybackMonths: 18,
      roiPercent: -35,
    },
  ],
  priorityMatrix: [
    {
      debtItemName: "Hardcoded Configuration",
      businessImpactScore: 35,
      fixCostScore: 15,
      quadrant: "quick_win",
      recommendation:
        "Low effort, immediate quality-of-life improvement. Do this in the next sprint as a confidence builder before tackling larger items.",
    },
    {
      debtItemName: "Deprecated REST API v1",
      businessImpactScore: 90,
      fixCostScore: 75,
      quadrant: "strategic",
      recommendation:
        "Highest ROI but requires sustained investment over 3-4 sprints. Phase the migration: start with highest-traffic endpoints, deprecate progressively.",
    },
    {
      debtItemName: "Monolithic Deployment Pipeline",
      businessImpactScore: 70,
      fixCostScore: 50,
      quadrant: "strategic",
      recommendation:
        "Start by extracting the checkout service pipeline first — it changes most frequently and has the highest deploy failure rate.",
    },
    {
      debtItemName: "Missing API Rate Limiting",
      businessImpactScore: 55,
      fixCostScore: 25,
      quadrant: "quick_win",
      recommendation:
        "Low fix cost but the ROI is driven by risk prevention, not velocity recovery. Insurance against a Black Friday disaster.",
    },
  ],
  repaymentPlan: [
    {
      quarter: "Q2 (Current)",
      debtItems: ["Hardcoded Configuration", "Missing API Rate Limiting"],
      sprintAllocation: 3,
      costEur: 30625,
      expectedVelocityGain: "+1.5 SP/sprint recovered, incident risk reduced by 80%",
      milestone: "Runtime-configurable feature flags, API rate limiting live before Black Friday prep",
    },
    {
      quarter: "Q3",
      debtItems: ["Deprecated REST API v1 (Phase 1: top 5 endpoints)"],
      sprintAllocation: 4,
      costEur: 35000,
      expectedVelocityGain: "+3 SP/sprint (dual implementation eliminated for high-traffic endpoints)",
      milestone: "Mobile app v3 unblocked, 60% of traffic migrated to v2",
    },
    {
      quarter: "Q4",
      debtItems: ["Deprecated REST API v1 (Phase 2)", "Monolithic Pipeline (Phase 1)"],
      sprintAllocation: 5,
      costEur: 43750,
      expectedVelocityGain: "+5 SP/sprint total recovered, deploy time halved",
      milestone: "API v1 fully deprecated, checkout service independently deployable",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "ROI analysis shows the API v1 migration has the highest annual savings (€136,500). Recommend starting with this item immediately as the top priority.",
      pmJudgment:
        "Don't start with the biggest item. Start with Hardcoded Configuration — it's a 2-sprint win that builds team confidence and gives you a visible success to show stakeholders. Use that momentum to get buy-in for the larger API migration. If you start with an 80 SP project, you'll burn 3 months before showing any result, and leadership will question the investment.",
      rationale:
        "AI optimizes for maximum ROI per euro spent. A PM who has presented tech debt business cases knows that organizational buy-in is earned through visible quick wins, not spreadsheet projections. The first debt repayment needs to be fast and visible — then you've earned trust for the bigger investment.",
    },
    {
      aiSuggestion:
        "Missing API Rate Limiting has a negative ROI (-35%) based on velocity recovery alone. Recommend deprioritizing this item in favor of higher-ROI investments.",
      pmJudgment:
        "This is insurance, not an investment — and insurance has negative ROI until the day you need it. The last flash sale incident cost 4 hours of downtime and €15,000. Black Friday traffic could cause a full outage worth €50,000+. Present this to leadership as risk mitigation, not velocity improvement. Frame it as: 'We can spend €17,500 now, or risk €50,000+ during our biggest revenue day.'",
      rationale:
        "AI evaluates debt items purely on velocity ROI. An experienced PM knows that some tech debt fixes are about risk prevention, not productivity — and that a single high-profile incident can destroy stakeholder trust in engineering far more than a few lost story points per sprint.",
    },
    {
      aiSuggestion:
        "Total tech debt fix cost is €140,000 with annual savings of €273,000. Recommend presenting this as a clear business case: 6-month payback period, then pure savings. Fix everything within 2 quarters.",
      pmJudgment:
        "Never propose fixing everything at once. That's how tech debt proposals get rejected — leadership sees €140,000 in cost and says 'not now.' Instead, propose a phased plan: Q2 quick wins (€30,000, visible results in 6 weeks), then decide on Q3 based on results. Make the first ask small and undeniable. Also: bundle debt work with feature work wherever possible. 'We're fixing the API as part of the mobile app v3 launch' is easier to approve than 'we need 4 sprints for technical debt.'",
      rationale:
        "AI presents the math as if organizations make rational investment decisions. A PM who has lived through budget cycles knows that the approval process is as important as the business case. Small, proven, visible wins build the political capital needed for larger investments.",
    },
  ],
};

const MOCK_SCALING_DEBT: TechDebtAnalysis = {
  executiveSummary:
    "Your infrastructure debt will block your growth at approximately 500 concurrent users — you're currently at 350 and growing. At current trajectory, you'll hit this wall in 8-12 weeks. The total annual cost of these 4 debt items is €175,000, but the real risk is existential: Series B investors will discover a platform that can't scale during due diligence. Total fix investment: €160,000, with the payment processing and database issues as the critical path.",
  totalAnnualCostEur: 175000,
  totalVelocityDragPercent: 27,
  totalFixCostEur: 160416,
  businessImpacts: [
    {
      debtItemName: "Synchronous Payment Processing",
      delayDaysPerSprint: 1.7,
      velocityDragPercent: 8.3,
      annualCostEur: 47667,
      riskDescription:
        "Payment timeouts start at 500 concurrent users. At projected Q4 volume (2,000 users), checkout will become unusable. Every failed payment is lost revenue and a customer who may never return.",
      businessLanguageSummary:
        "Your cash register can only process one customer at a time. When the line gets long enough, customers walk out.",
    },
    {
      debtItemName: "Single-Region Database",
      delayDaysPerSprint: 0.8,
      velocityDragPercent: 4.2,
      annualCostEur: 23833,
      riskDescription:
        "Zero failover capability. If eu-west-1 goes down, the entire platform is offline. RTO is unknown (never tested). RPO is 24 hours — a day's worth of transactions could be lost. This will be the first question in Series B technical due diligence.",
      businessLanguageSummary:
        "All your customer data and transactions are stored in a single filing cabinet with no backup. If that cabinet is damaged, you lose up to 24 hours of business.",
    },
    {
      debtItemName: "No Caching Layer",
      delayDaysPerSprint: 1.3,
      velocityDragPercent: 6.3,
      annualCostEur: 35750,
      riskDescription:
        "Every page load generates 12 database queries. Under load, response times exceed 3 seconds — studies show 53% of users abandon sites that take longer than 3 seconds to load.",
      businessLanguageSummary:
        "Every time a customer walks into your store, an employee runs to the warehouse to check every shelf instead of looking at the display in front of them.",
    },
    {
      debtItemName: "Manual Deployment Process",
      delayDaysPerSprint: 1.7,
      velocityDragPercent: 8.3,
      annualCostEur: 47667,
      riskDescription:
        "Single point of failure: one person knows how to deploy. Deployment takes 30 minutes with no rollback procedure. A critical bug fix takes 45+ minutes to reach production. This is incompatible with the deployment frequency a scaling SaaS needs.",
      businessLanguageSummary:
        "Only one person has the keys to the delivery truck, and they have to drive it manually every time. If they're sick, nothing ships.",
    },
  ],
  roiCalculations: [
    {
      debtItemName: "Synchronous Payment Processing",
      fixCostSP: 60,
      fixCostEur: 55000,
      annualSavingsEur: 47667,
      paybackMonths: 14,
      roiPercent: -13,
    },
    {
      debtItemName: "Single-Region Database",
      fixCostSP: 50,
      fixCostEur: 45833,
      annualSavingsEur: 23833,
      paybackMonths: 23,
      roiPercent: -48,
    },
    {
      debtItemName: "No Caching Layer",
      fixCostSP: 30,
      fixCostEur: 27500,
      annualSavingsEur: 35750,
      paybackMonths: 9,
      roiPercent: 30,
    },
    {
      debtItemName: "Manual Deployment Process",
      fixCostSP: 35,
      fixCostEur: 32083,
      annualSavingsEur: 47667,
      paybackMonths: 8,
      roiPercent: 49,
    },
  ],
  priorityMatrix: [
    {
      debtItemName: "No Caching Layer",
      businessImpactScore: 60,
      fixCostScore: 30,
      quadrant: "quick_win",
      recommendation: "Fastest win with clear user-facing improvement. Reduces DB load, improves response times, and buys time for the larger infrastructure work.",
    },
    {
      debtItemName: "Manual Deployment Process",
      businessImpactScore: 65,
      fixCostScore: 35,
      quadrant: "quick_win",
      recommendation: "Eliminates single point of failure and enables the deployment frequency needed for rapid scaling. Also a prerequisite for CI/CD pipeline that investors expect.",
    },
    {
      debtItemName: "Synchronous Payment Processing",
      businessImpactScore: 95,
      fixCostScore: 70,
      quadrant: "strategic",
      recommendation: "Critical path for scaling beyond 500 concurrent users. Must be done before Q4 growth hits the wall. Non-negotiable for Series B.",
    },
    {
      debtItemName: "Single-Region Database",
      businessImpactScore: 85,
      fixCostScore: 75,
      quadrant: "strategic",
      recommendation: "Essential for US market launch and Series B due diligence. Complex migration that needs careful planning and testing.",
    },
  ],
  repaymentPlan: [
    {
      quarter: "Q2 (Current — urgent)",
      debtItems: ["No Caching Layer", "Manual Deployment Process"],
      sprintAllocation: 5,
      costEur: 59583,
      expectedVelocityGain: "+3.5 SP/sprint recovered, deployment frequency from weekly to daily",
      milestone: "Sub-1s page loads, automated deployments with rollback, no more single-person dependency",
    },
    {
      quarter: "Q3 (Before Series B due diligence)",
      debtItems: ["Synchronous Payment Processing"],
      sprintAllocation: 5,
      costEur: 55000,
      expectedVelocityGain: "+2 SP/sprint, platform supports 5,000+ concurrent users",
      milestone: "Async payment processing live, load-tested to 5,000 concurrent users for investor demo",
    },
    {
      quarter: "Q4 (Before US launch)",
      debtItems: ["Single-Region Database"],
      sprintAllocation: 4,
      costEur: 45833,
      expectedVelocityGain: "+1 SP/sprint, disaster recovery operational, GDPR data residency compliant",
      milestone: "Multi-region database with automated failover, US data residency in place",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "Payment processing and database have negative velocity ROI (-13% and -48%). Based on ROI alone, prioritize caching and deployment automation first, then evaluate whether the others are worth fixing.",
      pmJudgment:
        "ROI is irrelevant here — this is survival math. If you can't process payments above 500 concurrent users and you're growing to 2,000, you don't have a velocity problem — you have an existential problem. And if Series B due diligence reveals a single-region database with no failover and 'unknown' RTO, the round is dead. Frame these as 'scaling prerequisites' not 'tech debt fixes.' The ROI is the company's ability to exist next year.",
      rationale:
        "AI applies standard ROI analysis appropriate for mature companies. A PM at a scaling startup knows that pre-Series B infrastructure investments are not evaluated by velocity ROI — they're evaluated by whether the platform can survive the growth the fundraise is meant to fuel.",
    },
    {
      aiSuggestion:
        "CTO resistance to infrastructure changes is noted. Recommend presenting data-driven business case with ROI calculations to align CTO with the modernization effort.",
      pmJudgment:
        "Don't present a spreadsheet to a founder-CTO who wrote the code. They know it needs fixing — the resistance is emotional, not rational. Instead: (1) frame it as 'evolving your architecture to match the company's growth' not 'fixing your bad code,' (2) involve the CTO in the architectural decisions so they feel ownership, (3) start with the deployment automation — it's a clear win that even the most protective founder can't argue against. Once you've demonstrated that change can happen without breaking things, the bigger conversations get easier.",
      rationale:
        "AI treats stakeholder resistance as an information problem (provide data → get alignment). A PM who has worked with founder-CTOs knows that code ownership is identity — and that the path to change runs through respect and inclusion, not ROI slides.",
    },
  ],
};

const MOCK_POST_ACQUISITION: TechDebtAnalysis = {
  executiveSummary:
    "The acquired codebase carries €385,000/year in technical debt costs — 46% of the merged team's velocity is lost to debt-related friction. The most damaging items are not the ones engineers highlight (CVEs) but the structural ones: duplicated services costing €89,000/year in data sync bugs, and a shared database costing €119,000/year in coupled deployments. The 'unified platform within 12 months' target is at risk unless debt repayment is sequenced with integration milestones. Total investment needed: €348,000 over 4 quarters.",
  totalAnnualCostEur: 385000,
  totalVelocityDragPercent: 46,
  totalFixCostEur: 348571,
  businessImpacts: [
    {
      debtItemName: "Test Coverage at 12%",
      delayDaysPerSprint: 3.6,
      velocityDragPercent: 17.9,
      annualCostEur: 148571,
      riskDescription:
        "3 production bugs last month. 2-day manual QA per release. Engineers are afraid to refactor — every change is a gamble. This isn't just a quality issue — it's slowing the entire integration because no one trusts the acquired codebase.",
      businessLanguageSummary:
        "Your team is building on quicksand. Every step forward risks sinking, so they move slowly and carefully instead of running. The cost isn't bugs — it's the speed you're not reaching.",
    },
    {
      debtItemName: "Duplicated Microservices",
      delayDaysPerSprint: 2.1,
      velocityDragPercent: 10.7,
      annualCostEur: 89143,
      riskDescription:
        "Two user services and two auth services running in parallel. Weekly data inconsistency tickets. Neither team wants to deprecate their version — it's become a proxy war for whose architecture 'won.'",
      businessLanguageSummary:
        "Two departments are keeping two different customer filing systems. They occasionally send conflicting letters to the same customer.",
    },
    {
      debtItemName: "Outdated Dependencies with CVEs",
      delayDaysPerSprint: 0.7,
      velocityDragPercent: 3.6,
      annualCostEur: 29714,
      riskDescription:
        "3 critical CVEs unpatched. Security audit rated this 'immediate action required.' Q4 compliance audit will flag this as a blocker. Regulatory risk is higher than operational risk.",
      businessLanguageSummary:
        "Your building has fire code violations that inspectors have already flagged. The fine isn't the problem — the problem is that they can shut you down until you fix it.",
    },
    {
      debtItemName: "Shared Database Between Services",
      delayDaysPerSprint: 2.9,
      velocityDragPercent: 14.3,
      annualCostEur: 118857,
      riskDescription:
        "4 services share one database with no API boundaries. Schema migration in one service breaks 3 others. No service can be deployed independently. This is the single biggest blocker to the 'unified platform' goal.",
      businessLanguageSummary:
        "Four departments share one spreadsheet with no version control. When accounting changes a column, HR's formulas break. No one can update their section without coordinating with everyone else.",
    },
  ],
  roiCalculations: [
    {
      debtItemName: "Test Coverage at 12%",
      fixCostSP: 120,
      fixCostEur: 137143,
      annualSavingsEur: 148571,
      paybackMonths: 11,
      roiPercent: 8,
    },
    {
      debtItemName: "Duplicated Microservices",
      fixCostSP: 70,
      fixCostEur: 80000,
      annualSavingsEur: 89143,
      paybackMonths: 11,
      roiPercent: 11,
    },
    {
      debtItemName: "Outdated Dependencies with CVEs",
      fixCostSP: 25,
      fixCostEur: 28571,
      annualSavingsEur: 29714,
      paybackMonths: 12,
      roiPercent: 4,
    },
    {
      debtItemName: "Shared Database Between Services",
      fixCostSP: 90,
      fixCostEur: 102857,
      annualSavingsEur: 118857,
      paybackMonths: 10,
      roiPercent: 16,
    },
  ],
  priorityMatrix: [
    {
      debtItemName: "Outdated Dependencies with CVEs",
      businessImpactScore: 60,
      fixCostScore: 20,
      quadrant: "quick_win",
      recommendation: "Non-negotiable for Q4 compliance. Low effort, removes regulatory risk. Do this first and get it off the table.",
    },
    {
      debtItemName: "Duplicated Microservices",
      businessImpactScore: 75,
      fixCostScore: 60,
      quadrant: "strategic",
      recommendation: "The service consolidation is technically the integration itself. Frame it as 'building the unified platform' not 'fixing debt.' Let the acquired team lead the architecture — it's their code they know best.",
    },
    {
      debtItemName: "Test Coverage at 12%",
      businessImpactScore: 85,
      fixCostScore: 85,
      quadrant: "strategic",
      recommendation: "Don't aim for 80% overnight. Set a rule: every new change and bug fix adds tests. Coverage will grow organically from 12% to 40% over 2 quarters without dedicated 'test sprints.'",
    },
    {
      debtItemName: "Shared Database Between Services",
      businessImpactScore: 90,
      fixCostScore: 80,
      quadrant: "strategic",
      recommendation: "The architectural endgame. Start by extracting the service with the most schema changes first (likely order service). Each extraction reduces coupling for the remaining services.",
    },
  ],
  repaymentPlan: [
    {
      quarter: "Q2",
      debtItems: ["Outdated Dependencies with CVEs", "Test coverage improvement (new code only)"],
      sprintAllocation: 3,
      costEur: 28571,
      expectedVelocityGain: "+1 SP/sprint, compliance blocker removed",
      milestone: "Zero critical CVEs, test-on-write policy established, coverage trending up",
    },
    {
      quarter: "Q3",
      debtItems: ["Duplicated Microservices (user service consolidation)"],
      sprintAllocation: 5,
      costEur: 80000,
      expectedVelocityGain: "+3 SP/sprint, data inconsistency tickets eliminated",
      milestone: "Single user/auth service, Q2 authentication consolidation unblocked",
    },
    {
      quarter: "Q4",
      debtItems: ["Shared Database (extract order service)"],
      sprintAllocation: 5,
      costEur: 60000,
      expectedVelocityGain: "+2 SP/sprint, order service independently deployable",
      milestone: "First service fully decoupled, new pricing model launch unblocked",
    },
    {
      quarter: "Q1 (Next Year)",
      debtItems: ["Shared Database (remaining services)", "Test coverage push to 40%"],
      sprintAllocation: 6,
      costEur: 180000,
      expectedVelocityGain: "+7 SP/sprint total recovered from debt-free state",
      milestone: "Unified platform achieved, all services independently deployable",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion:
        "Test coverage at 12% is the highest annual cost item (€148,571). Recommend a dedicated 'testing sprint' to rapidly increase coverage from 12% to 50% as the top priority.",
      pmJudgment:
        "A 'testing sprint' will produce low-value tests written to hit a coverage number, not to catch real bugs. Worse, it signals to the acquired team that their code is being treated as a problem to be fixed, not an asset to build on. Instead: establish a test-on-write policy (every PR must include tests for the code it touches) and let coverage grow organically. In 6 months you'll be at 40%+ with tests that actually matter. And frame it as 'we're investing in the codebase' not 'we're cleaning up your mess.'",
      rationale:
        "AI sees a number gap (12% vs target) and suggests closing it fast. A PM managing a post-acquisition integration knows that how you fix the debt matters as much as what you fix. The acquired team is already feeling that their work is being dismissed — a 'fix your tests' mandate will accelerate attrition.",
    },
    {
      aiSuggestion:
        "VP Engineering proposes a full rewrite. Given the scope of debt (€385,000/year, 46% velocity drag), a rewrite may be more cost-effective than incremental fixes totaling €348,571.",
      pmJudgment:
        "Rewrites in post-acquisition contexts have a catastrophic failure rate. You're not just rewriting code — you're telling the acquired team that 3 years of their work is worthless. The 2 engineers already interviewing elsewhere will leave immediately. The knowledge of WHY the code works the way it does walks out with them. Instead: extract and modernize incrementally, service by service. Keep the acquired engineers as the domain experts guiding the migration. They wrote the code — they know where the dragons are. A rewrite without them will recreate the same problems in a shinier codebase.",
      rationale:
        "AI sees a cost-benefit calculation where rewrite might be cheaper. An SM who has managed M&A integrations knows that rewrites destroy the most valuable asset you acquired — the people who understand the domain. The code is replaceable; the knowledge isn't.",
    },
  ],
};

export const TECH_DEBT_MOCK_RESPONSES: Record<string, TechDebtAnalysis> = {
  "legacy-api": MOCK_LEGACY_API,
  "scaling-debt": MOCK_SCALING_DEBT,
  "post-acquisition": MOCK_POST_ACQUISITION,
};

export const DEFAULT_TECH_DEBT_MOCK = MOCK_LEGACY_API;
