import type { EstimationBiasAnalysis } from "./estimation-types";

const MOCK_FEATURE_OPTIMISM: EstimationBiasAnalysis = {
  analysisMode: "sprint",
  overallAccuracy: 62,
  overallBias: "mixed",
  biasPatterns: [
    {
      patternName: "Systematic Feature Underestimation",
      biasType: "optimism",
      severity: "high",
      description: "Feature stories are consistently underestimated by 42% on average. Every single feature in the dataset took more SP than estimated. This is not random variance — it's a systematic blind spot.",
      evidence: "12 feature stories: average estimated 7.0 SP, average actual 10.8 SP. Worst cases: Multi-currency support (13→21, +62%), Real-time notifications (13→20, +54%). Zero features came in under estimate.",
      affectedSegment: "All feature stories",
      avgOverUnderPercent: -42,
    },
    {
      patternName: "Tech Debt Overestimation (Safety Padding)",
      biasType: "planning_fallacy",
      severity: "medium",
      description: "Tech debt items are overestimated by 30% on average. Charlie consistently pads estimates 'for safety' — but the padding exceeds actual uncertainty, wasting sprint capacity allocation.",
      evidence: "6 tech debt stories: average estimated 5.3 SP, average actual 3.7 SP. Charlie's pattern: estimated 8→actual 5, 5→3, 8→6, 5→4, 3→2, 3→2. Consistent 25-38% overestimate.",
      affectedSegment: "Tech debt stories (primarily Charlie)",
      avgOverUnderPercent: 30,
    },
    {
      patternName: "API Integration Complexity Blind Spot",
      biasType: "complexity_blind_spot",
      severity: "high",
      description: "Stories involving API integrations are underestimated by 55%. The team estimates coding time but not integration testing, error handling, and partner API quirks.",
      evidence: "API integration stories: Payment gateway (5→8), Multi-currency (13→21), Webhook retry (8→12), Batch payment (8→14), SSO (8→13), API rate limiting (5→8). Average: 7.8→12.7 SP.",
      affectedSegment: "Stories tagged 'API integration'",
      avgOverUnderPercent: -55,
    },
    {
      patternName: "Bug Fix Accuracy (Positive Pattern)",
      biasType: "optimism",
      severity: "low",
      description: "Bug fixes are estimated with 95% accuracy — nearly perfect. Bob's deep understanding of the codebase makes bug estimation reliable. This is a strength to preserve.",
      evidence: "12 bug stories: average estimated 2.8 SP, average actual 2.8 SP. Only 2 bugs exceeded estimate (by 1 SP each). Bob's personal accuracy on bugs: 100%.",
      affectedSegment: "Bug stories",
      avgOverUnderPercent: -2,
    },
  ],
  heatmapData: [
    { storyType: "Feature", dimension: "Sprint 1", estimatedAvg: 6.5, actualAvg: 10.5, accuracyPercent: 62, sampleSize: 2 },
    { storyType: "Feature", dimension: "Sprint 2", estimatedAvg: 9.0, actualAvg: 14.0, accuracyPercent: 64, sampleSize: 2 },
    { storyType: "Feature", dimension: "Sprint 3", estimatedAvg: 6.5, actualAvg: 10.5, accuracyPercent: 62, sampleSize: 2 },
    { storyType: "Feature", dimension: "Sprint 4", estimatedAvg: 9.0, actualAvg: 14.0, accuracyPercent: 64, sampleSize: 2 },
    { storyType: "Feature", dimension: "Sprint 5", estimatedAvg: 6.5, actualAvg: 11.0, accuracyPercent: 59, sampleSize: 2 },
    { storyType: "Feature", dimension: "Sprint 6", estimatedAvg: 6.5, actualAvg: 10.0, accuracyPercent: 65, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 1", estimatedAvg: 2.5, actualAvg: 2.5, accuracyPercent: 100, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 2", estimatedAvg: 4.0, actualAvg: 4.5, accuracyPercent: 89, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 3", estimatedAvg: 2.0, actualAvg: 2.5, accuracyPercent: 80, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 4", estimatedAvg: 3.5, actualAvg: 3.5, accuracyPercent: 100, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 5", estimatedAvg: 2.5, actualAvg: 2.5, accuracyPercent: 100, sampleSize: 2 },
    { storyType: "Bug", dimension: "Sprint 6", estimatedAvg: 3.0, actualAvg: 3.5, accuracyPercent: 86, sampleSize: 2 },
    { storyType: "Tech Debt", dimension: "Sprint 1", estimatedAvg: 8.0, actualAvg: 5.0, accuracyPercent: 160, sampleSize: 1 },
    { storyType: "Tech Debt", dimension: "Sprint 2", estimatedAvg: 5.0, actualAvg: 3.0, accuracyPercent: 167, sampleSize: 1 },
    { storyType: "Tech Debt", dimension: "Sprint 3", estimatedAvg: 8.0, actualAvg: 6.0, accuracyPercent: 133, sampleSize: 1 },
    { storyType: "Tech Debt", dimension: "Sprint 4", estimatedAvg: 5.0, actualAvg: 4.0, accuracyPercent: 125, sampleSize: 1 },
    { storyType: "Tech Debt", dimension: "Sprint 5", estimatedAvg: 3.0, actualAvg: 2.0, accuracyPercent: 150, sampleSize: 1 },
    { storyType: "Tech Debt", dimension: "Sprint 6", estimatedAvg: 3.0, actualAvg: 2.0, accuracyPercent: 150, sampleSize: 1 },
  ],
  correctionFactors: [
    { segment: "Feature stories (all)", currentMultiplier: 0.65, suggestedMultiplier: 1.45, confidence: "high", sampleSize: 12 },
    { segment: "API integration features", currentMultiplier: 0.61, suggestedMultiplier: 1.6, confidence: "high", sampleSize: 6 },
    { segment: "Full-stack features", currentMultiplier: 0.68, suggestedMultiplier: 1.5, confidence: "medium", sampleSize: 5 },
    { segment: "Tech debt (Charlie)", currentMultiplier: 1.33, suggestedMultiplier: 0.75, confidence: "medium", sampleSize: 6 },
    { segment: "Bug fixes (all)", currentMultiplier: 1.0, suggestedMultiplier: 1.0, confidence: "high", sampleSize: 12 },
  ],
  facilitationGuide: [
    {
      context: "When estimating feature stories in Planning Poker",
      technique: "After the team reveals cards, ask: 'What testing and integration work is NOT included in this estimate?' Force the team to explicitly add time for testing, error handling, and edge cases before finalizing.",
      expectedOutcome: "Feature estimates increase 30-40% but become much more accurate. Team learns to estimate the full scope, not just the coding.",
    },
    {
      context: "When estimating stories involving API integrations",
      technique: "Create a standard checklist: (1) API documentation review, (2) Error handling for all response codes, (3) Integration testing with partner sandbox, (4) Retry/timeout logic, (5) Monitoring & alerting. Estimate each item separately, then sum.",
      expectedOutcome: "API integration estimates become realistic. The checklist prevents the team from forgetting the 'invisible' work that consistently causes blowups.",
    },
    {
      context: "When Charlie estimates tech debt items",
      technique: "Ask Charlie to estimate the 'best case' and 'worst case' separately, then take the midpoint. His 'best case' is typically the accurate estimate. The safety padding is coming from worst-case thinking that rarely materializes.",
      expectedOutcome: "Tech debt estimates right-sized from ~30% overestimate to within 10% accuracy, freeing 1-2 SP per sprint for other work.",
    },
    {
      context: "At the start of each sprint planning",
      technique: "Review the previous sprint's estimation accuracy as a 5-minute exercise. Show estimated vs actual for each story. Don't assign blame — make it a learning moment. Track accuracy trend over time.",
      expectedOutcome: "Team develops estimation self-awareness. Patterns become visible. Natural correction happens within 2-3 sprints.",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion: "Feature stories are underestimated by 42%. Apply a 1.45x correction factor to all feature estimates going forward. This should bring accuracy to within 10%.",
      pmJudgment: "Don't blindly multiply. The correction factor is a crutch — it treats the symptom, not the cause. The real fix is changing HOW the team estimates features: they're estimating coding time and forgetting testing, integration, and edge cases. Introduce a 'Definition of Estimated' checklist: coding + testing + review + integration + deployment. If the team estimates each phase, the correction factor becomes unnecessary. Use the 1.45x factor as a sanity check for the next 2 sprints, then phase it out as the team's estimation process matures.",
      rationale: "AI applies a mathematical correction. An SM knows that sustainable estimation improvement comes from process change, not arithmetic adjustments. A team that understands why they underestimate will self-correct; a team given a multiplier will depend on it forever.",
    },
    {
      aiSuggestion: "Alice's estimates have the highest error rate (average 40% underestimate on features). Recommend individual coaching to improve her estimation accuracy.",
      pmJudgment: "Alice isn't bad at estimating — she's the most ambitious developer on the team. She estimates the 'happy path' because she's confident in her ability to figure things out. The problem isn't Alice; it's that the team doesn't challenge her estimates. In Planning Poker, when Alice shows a 5, others defer to her experience. Coach the TEAM to ask 'what could go wrong?' after every feature estimate. Also: Alice's bug estimates are actually good. The issue is specifically with feature scope, not estimation skill.",
      rationale: "AI identifies the individual with the highest error rate. An SM recognizes that estimation is a team sport — Alice's optimism is only a problem because the team doesn't counterbalance it. Targeting Alice individually would undermine her confidence and team dynamics.",
    },
  ],
};

const MOCK_PI_BREAKDOWN: EstimationBiasAnalysis = {
  analysisMode: "pi",
  overallAccuracy: 58,
  overallBias: "optimistic",
  biasPatterns: [
    {
      patternName: "Feature Breakdown Quality Predicts Accuracy",
      biasType: "planning_fallacy",
      severity: "high",
      description: "Features rated 'good' breakdown quality at PI Planning had 93% accuracy. Features rated 'poor' had 38% accuracy — a 2.5x blowup ratio. Breakdown quality is the single strongest predictor of estimation accuracy.",
      evidence: "Good breakdown features (API Gateway, Observability, CI/CD Pipeline): avg blowup ratio 1.06x. Poor breakdown features (Service Mesh, Config Management): avg blowup ratio 2.54x. PI 2 carryover features (re-estimated with better breakdown): 95% accuracy.",
      affectedSegment: "Features with 'poor' breakdown quality",
      avgOverUnderPercent: -62,
    },
    {
      patternName: "Hidden Story Discovery During Execution",
      biasType: "scope_creep",
      severity: "high",
      description: "Poorly broken-down features discovered 2-3x more stories during execution than originally planned. Service Mesh went from 8 to 22 stories; Config Management from 6 to 18. These weren't scope creep — they were scope that was always there but invisible at PI Planning level.",
      evidence: "Service Mesh: 8→22 stories (+175%). Config Management: 6→18 stories (+200%). Well-broken features: story count changed by <15%. The hidden stories were integration tests, migration scripts, and configuration edge cases.",
      affectedSegment: "Features with original story count < 10",
      avgOverUnderPercent: -150,
    },
    {
      patternName: "PI 2 Correction Effect",
      biasType: "optimism",
      severity: "low",
      description: "After experiencing PI 1 blowups, the team's PI 2 estimates were dramatically more accurate. Carryover features re-estimated within 5% accuracy. New PI 2 features within 8% accuracy. The team learned from failure.",
      evidence: "PI 1 accuracy: 62%. PI 2 accuracy: 96%. PI 2 breakdown avg: 13 stories/feature vs PI 1 avg: 7 stories/feature. Stricter breakdown requirements (3+ acceptance criteria per story) introduced at PI 2 Planning.",
      affectedSegment: "PI 2 features (all)",
      avgOverUnderPercent: -4,
    },
  ],
  heatmapData: [
    { storyType: "Good Breakdown", dimension: "PI 1", estimatedAvg: 32, actualAvg: 35, accuracyPercent: 91, sampleSize: 3 },
    { storyType: "Poor Breakdown", dimension: "PI 1", estimatedAvg: 53, actualAvg: 133, accuracyPercent: 40, sampleSize: 2 },
    { storyType: "Carryover (Re-estimated)", dimension: "PI 2", estimatedAvg: 80, actualAvg: 75, accuracyPercent: 107, sampleSize: 2 },
    { storyType: "New Feature", dimension: "PI 2", estimatedAvg: 40, actualAvg: 43, accuracyPercent: 93, sampleSize: 2 },
  ],
  correctionFactors: [
    { segment: "Features with 'poor' breakdown quality", currentMultiplier: 0.40, suggestedMultiplier: 2.5, confidence: "high", sampleSize: 2 },
    { segment: "Features with 'good' breakdown quality", currentMultiplier: 0.93, suggestedMultiplier: 1.1, confidence: "high", sampleSize: 5 },
    { segment: "Features with < 8 stories at PI Planning", currentMultiplier: 0.45, suggestedMultiplier: 2.2, confidence: "medium", sampleSize: 3 },
    { segment: "Features with dependencies", currentMultiplier: 0.70, suggestedMultiplier: 1.4, confidence: "medium", sampleSize: 2 },
  ],
  featureBreakdownAnalysis: [
    {
      featureName: "API Gateway v2",
      piPlanningEstimateSP: 40,
      actualTotalSP: 42,
      storyCount: 12,
      blowupRatio: 1.05,
      rootCause: "unknown_unknowns",
      explanation: "Well-broken-down with 12 stories at PI Planning. 3 refinement sessions before PI Planning ensured all acceptance criteria were clear. Minor overshoot from one unexpected edge case.",
    },
    {
      featureName: "Service Mesh Migration",
      piPlanningEstimateSP: 55,
      actualTotalSP: 140,
      storyCount: 22,
      blowupRatio: 2.55,
      rootCause: "poor_breakdown",
      explanation: "Estimated as a single lump sum ('about 55 SP'). During Sprint 2, discovered 3 undocumented API contracts. Original 8 stories grew to 22. The 'migration' was actually a rebuild — the team didn't examine the existing system closely enough before estimating.",
    },
    {
      featureName: "Observability Dashboard",
      piPlanningEstimateSP: 30,
      actualTotalSP: 35,
      storyCount: 9,
      blowupRatio: 1.17,
      rootCause: "dependency_cost",
      explanation: "Well-broken-down feature. Minor overshoot from Platform Data API dependency — 2 days of wait time not in original estimate. Otherwise accurate.",
    },
    {
      featureName: "Config Management Overhaul",
      piPlanningEstimateSP: 50,
      actualTotalSP: 125,
      storyCount: 18,
      blowupRatio: 2.50,
      rootCause: "hidden_complexity",
      explanation: "Original 6 stories split into 18 in Sprint 3 after discovering hidden dependencies between config modules. The team knew the system was complex but underestimated how deeply interconnected the config layers were. Classic iceberg problem — visible scope was 40% of actual scope.",
    },
    {
      featureName: "CI/CD Pipeline Modernization",
      piPlanningEstimateSP: 25,
      actualTotalSP: 28,
      storyCount: 8,
      blowupRatio: 1.12,
      rootCause: "unknown_unknowns",
      explanation: "Good breakdown, well-understood scope. Slight overshoot from Docker image optimization that wasn't in original plan.",
    },
  ],
  piCarryoverAnalysis: [
    {
      featureName: "Service Mesh Migration",
      originalPI: "PI 1",
      plannedCompletionSprint: "PI 1 Sprint 4",
      actualCompletionSprint: "PI 2 Sprint 2",
      delaySprintCount: 3,
      carryoverReason: "Scope was 2.5x larger than estimated. Poor initial breakdown meant hidden work wasn't discovered until Sprint 2. Dependency on Team Bravo added further delays.",
    },
    {
      featureName: "Config Management Overhaul",
      originalPI: "PI 1",
      plannedCompletionSprint: "PI 1 Sprint 5",
      actualCompletionSprint: "PI 2 Sprint 3",
      delaySprintCount: 3,
      carryoverReason: "Hidden complexity discovered in Sprint 3 when stories split from 6 to 18. The interconnected config layers required a different approach than originally planned.",
    },
  ],
  facilitationGuide: [
    {
      context: "At PI Planning when a feature has fewer than 8 stories",
      technique: "Flag it as a 'breakdown risk.' Require a dedicated 2-hour breakdown session before the feature enters the PI backlog. Use the question: 'If I gave this to a new team member, could they start working from these stories alone?' If the answer is no, the breakdown isn't done.",
      expectedOutcome: "Features enter PI with sufficient granularity. Story count per feature increases 50-80%, but estimates become 2-3x more accurate.",
    },
    {
      context: "When a feature is estimated as a lump sum ('about 50 SP')",
      technique: "Never accept lump-sum estimates at PI Planning. Break the rule: every feature must have at least 1 story per 5 SP of estimate. A 50 SP feature needs minimum 10 stories. If the team can't break it down, they don't understand it well enough to estimate it.",
      expectedOutcome: "Eliminates the 2.5x blowup pattern. Forces the team to confront complexity before committing.",
    },
    {
      context: "When reviewing PI 1→PI 2 carryover at Inspect & Adapt",
      technique: "For each carryover feature, run a '5 Whys' analysis. Don't stop at 'it was bigger than we thought.' Ask: Why didn't we know the size? Why wasn't the breakdown thorough? What would we need to do differently at PI Planning to catch this?",
      expectedOutcome: "Root causes surface. Team builds shared understanding of what 'good enough breakdown' looks like for their domain.",
    },
  ],
  judgmentLayers: [
    {
      aiSuggestion: "Features with poor breakdown quality had 2.5x blowup. Apply a 2.5x correction factor to any feature estimated with fewer than 8 stories at PI Planning.",
      pmJudgment: "A 2.5x multiplier on a bad estimate is still a bad estimate — it's just a bigger bad estimate. The fix isn't to multiply; it's to refuse the estimate until the breakdown is done properly. At PI Planning, when a team presents a 55 SP feature with 8 stories, the RTE's job is to say 'this isn't ready for commitment — take it to a breakdown session and come back.' It's better to commit to fewer well-understood features than to fill the PI with poorly-understood ones and carry them over.",
      rationale: "AI applies a mathematical correction to compensate for poor process. An experienced RTE knows that the correction factor enables the bad behavior — teams will keep doing lump-sum estimates if they know the number gets multiplied later. The only sustainable fix is enforcing breakdown quality at the gate.",
    },
    {
      aiSuggestion: "PI 2 estimates were dramatically more accurate (96% vs 62%). The team has self-corrected. Recommend continuing current practices with no changes needed.",
      pmJudgment: "PI 2's accuracy is partly real improvement and partly survivorship bias — the team planned less ambitiously (116 SP vs 165 SP) and the carryover features had already been explored in PI 1, so their estimates benefited from hindsight. The true test is PI 3: will the team apply the same rigor to brand new features they haven't touched before? Maintain the stricter breakdown requirements, and at PI 3 Planning, specifically watch new features (not carryover) for the old patterns. One good PI doesn't mean the problem is solved — it means the learning has started.",
      rationale: "AI sees the metric improvement and declares victory. An SM who has guided teams through process changes knows that one good iteration can be an anomaly. Sustainable improvement needs 3+ data points and must survive the introduction of new, unfamiliar work.",
    },
  ],
};

const MOCK_ANCHORING: EstimationBiasAnalysis = {
  ...MOCK_FEATURE_OPTIMISM,
  biasPatterns: [
    {
      patternName: "Senior Developer Anchoring Effect",
      biasType: "anchoring",
      severity: "high",
      description: "When Maria (senior dev) is present and estimates first, the team's accuracy drops to 68%. When she's absent (Sprint 4, 6), accuracy jumps to 95%. Maria's estimates aren't wrong — but her confidence anchors the entire team.",
      evidence: "Sprints with Maria: avg accuracy 68%, 6 stories exceeded estimate. Sprints without Maria: avg accuracy 95%, 1 story exceeded estimate. Maria's personal estimates are 85% accurate — the problem isn't her skill, it's the social dynamic.",
      affectedSegment: "All stories estimated when Maria is present",
      avgOverUnderPercent: -32,
    },
    ...MOCK_FEATURE_OPTIMISM.biasPatterns.slice(3),
  ],
};

const MOCK_PI_DEPENDENCY: EstimationBiasAnalysis = {
  ...MOCK_PI_BREAKDOWN,
  overallAccuracy: 55,
  biasPatterns: [
    {
      patternName: "Dependency Wait Time Not Estimated",
      biasType: "planning_fallacy",
      severity: "high",
      description: "PI 1 features with external dependencies were 58% accurate vs 96% for independent features. The team estimated 'our work' but not the wait time, review cycles, and rework caused by dependencies. PI 2 introduced dependency buffers and accuracy jumped to 94%.",
      evidence: "PI 1 dependent features: PCI DSS (40→65, +63%), Multi-Currency (35→55, +57%), Merchant Onboarding (25→40, +60%). PI 1 independent features: Fraud Detection (30→32, +7%), Reporting (20→22, +10%). PI 2 with buffers: Chargeback (45→48, +7%), Balance API (30→28, -7%).",
      affectedSegment: "Features with external dependencies (PI 1)",
      avgOverUnderPercent: -58,
    },
    {
      patternName: "Before/After Dependency Estimation",
      biasType: "optimism",
      severity: "low",
      description: "PI 2 introduced explicit dependency buffer stories. Result: dependent features went from 58% to 94% accuracy. The fix was simple — estimate the wait, not just the work.",
      evidence: "PI 2 dependent features added 5-8 SP buffer per dependency. Actual dependency overhead: 3-6 SP. Buffers were slightly generous but dramatically more accurate than zero buffer.",
      affectedSegment: "PI 2 features with dependency buffers",
      avgOverUnderPercent: -4,
    },
  ],
};

export const ESTIMATION_MOCK_RESPONSES: Record<string, EstimationBiasAnalysis> = {
  "feature-optimism": MOCK_FEATURE_OPTIMISM,
  "anchoring-bias": MOCK_ANCHORING,
  "pi-breakdown-failure": MOCK_PI_BREAKDOWN,
  "pi-dependency-blindspot": MOCK_PI_DEPENDENCY,
};

export const DEFAULT_ESTIMATION_MOCK = MOCK_FEATURE_OPTIMISM;
