import type { SampleScenario } from "./sample-data";

export const TECH_DEBT_SAMPLES: SampleScenario[] = [
  {
    id: "legacy-api",
    name: "Legacy API Migration",
    description: "EC platform with deprecated API v1 serving 60% of traffic, monolithic deploy pipeline",
    data: `## Team: Commerce Platform (8 engineers, 1 PO, 1 SM)

### Sprint Economics
- Average velocity: 32 SP/sprint
- Sprint length: 2 weeks
- Team cost per sprint: €28,000
- Sprints per year: 26
- **Cost per story point: €875**

### Tech Debt Items

**Deprecated REST API v1** [critical]
- Description: API v1 was scheduled for deprecation 18 months ago but still serves 60% of traffic. Every new feature requires dual implementation (v1 + v2). No OpenAPI spec for v1.
- Affected components: All customer-facing endpoints, mobile app, 3 partner integrations
- Estimated fix effort: 80 SP (€70,000)
- Velocity impact: 6 SP/sprint lost (dual implementation overhead)

**Monolithic Deployment Pipeline** [high]
- Description: Single deployment pipeline for all services. A change to the checkout service requires deploying the entire platform. Deploys take 45 minutes with 15% failure rate.
- Affected components: CI/CD, all microservices
- Estimated fix effort: 45 SP (€39,375)
- Velocity impact: 3 SP/sprint lost (deploy queue + rollback time)

**Hardcoded Configuration** [medium]
- Description: Feature flags and environment config are hardcoded in source code. Changing a flag requires a full deploy cycle. 12 config values that should be runtime-configurable.
- Affected components: Feature flag system, environment management
- Estimated fix effort: 15 SP (€13,125)
- Velocity impact: 1 SP/sprint lost (unnecessary deploy cycles)

**Missing API Rate Limiting** [high]
- Description: No rate limiting on public APIs. During the last flash sale, a partner's bot hammered the API and caused 20 minutes of degraded performance. Only a matter of time before a real outage.
- Affected components: API gateway, all public endpoints
- Estimated fix effort: 20 SP (€17,500)
- Velocity impact: 0.5 SP/sprint (incident response and monitoring workarounds)

### Product Roadmap Context
- Q2: Mobile app v3 launch (blocked by API v1 — dual implementation adds 3 weeks)
- Q3: Partner API marketplace (requires rate limiting and proper API versioning)
- Black Friday in November (performance risk from missing rate limits)

### Additional Context
- CTO has been asking for a "tech debt budget" but VP Product keeps pushing features
- Last quarter, an incident caused by the monolithic pipeline cost 4 hours of downtime (estimated €15,000 in lost revenue)
- Team morale is dropping — retro themes mention "always fighting fires"`,
  },
  {
    id: "scaling-debt",
    name: "Pre-Scale Infrastructure",
    description: "SaaS startup preparing for 10x growth: sync processing, single-region DB, no caching",
    data: `## Team: Platform Engineering (6 engineers, 1 PO, 1 Tech Lead as SM)

### Sprint Economics
- Average velocity: 24 SP/sprint
- Sprint length: 2 weeks
- Team cost per sprint: €22,000
- Sprints per year: 26
- **Cost per story point: €917**

### Tech Debt Items

**Synchronous Payment Processing** [critical]
- Description: Payment confirmations are processed synchronously in the request-response cycle. Above 500 concurrent users, response times exceed 10 seconds and timeouts start occurring. Current daily peak: 350 concurrent users. Growth projection: 2,000 by Q4.
- Affected components: Payment service, checkout flow, webhook handlers
- Estimated fix effort: 60 SP (€55,000)
- Velocity impact: 2 SP/sprint (workarounds for timeout issues, manual retry handling)

**Single-Region Database** [critical]
- Description: PostgreSQL instance in eu-west-1 only. No read replicas, no failover. RTO is currently "unknown." RPO is 24 hours (daily backup). GDPR compliance requires data residency consideration for US expansion.
- Affected components: All services using the database
- Estimated fix effort: 50 SP (€45,833)
- Velocity impact: 1 SP/sprint (performance workarounds, manual backup verification)

**No Caching Layer** [high]
- Description: Every page load hits the database directly. Product catalog queries run 200ms+ under load. Homepage makes 12 DB queries per request. Caching was "planned for later" 18 months ago.
- Affected components: Product catalog, search, homepage, API responses
- Estimated fix effort: 30 SP (€27,500)
- Velocity impact: 1.5 SP/sprint (performance optimization workarounds)

**Manual Deployment Process** [medium]
- Description: Deployments require SSH into production servers, pulling from git, running migrations manually. Average deploy time: 30 minutes. No rollback procedure documented. "The person who knows how to deploy" is a single point of failure.
- Affected components: All services, deployment infrastructure
- Estimated fix effort: 35 SP (€32,083)
- Velocity impact: 2 SP/sprint (deploy time, failed deploys, coordination overhead)

### Product Roadmap Context
- Series B due diligence starts in Q3 — investors will ask about infrastructure scalability
- US market launch planned for Q1 next year (requires multi-region, data residency compliance)
- 10x user growth projected over 12 months based on current pipeline

### Additional Context
- CTO founded the company and wrote much of the original code — emotionally attached to "it works fine"
- One engineer handles all deployments — if they're on vacation, no one deploys
- Competitor just raised €20M and is scaling aggressively in our market`,
  },
  {
    id: "post-acquisition",
    name: "Post-Acquisition Technical Debt",
    description: "Acquired company's 3-year accumulated debt: 12% test coverage, CVEs, shared database",
    data: `## Team: Unified Product (10 engineers from 2 merged teams, 1 PO, 1 SM)

### Sprint Economics
- Average velocity: 28 SP/sprint
- Sprint length: 2 weeks
- Team cost per sprint: €32,000
- Sprints per year: 26
- **Cost per story point: €1,143**

### Tech Debt Items

**Test Coverage at 12%** [critical]
- Description: The acquired codebase has 12% test coverage (vs. acquirer's 78%). Every change is a gamble — 3 production bugs in the last month were caused by untested edge cases. Manual QA takes 2 days per release. Team is afraid to refactor anything.
- Affected components: Entire acquired codebase (45,000 LOC)
- Estimated fix effort: 120 SP (€137,143) — spread over 6 months
- Velocity impact: 5 SP/sprint (manual testing, bug fixes, fear-driven slow development)

**Duplicated Microservices** [high]
- Description: Both teams built a "user service" and an "auth service" independently. Now running 2 of each in production. Data inconsistencies between them cause support tickets weekly. Neither team wants to deprecate theirs.
- Affected components: User management, authentication, session handling
- Estimated fix effort: 70 SP (€80,000)
- Velocity impact: 3 SP/sprint (data sync issues, duplicate bug fixes, confusion about which service to call)

**Outdated Dependencies with CVEs** [critical]
- Description: 14 npm packages have known CVEs, 3 rated critical. Node.js version is 2 major versions behind. Security audit flagged this as "immediate action required" but no sprint capacity has been allocated.
- Affected components: All services using affected packages
- Estimated fix effort: 25 SP (€28,571)
- Velocity impact: 1 SP/sprint (security workarounds, audit responses)

**Shared Database Between Services** [high]
- Description: 4 microservices share a single PostgreSQL database with direct table access (no API boundaries). Schema changes in one service break others. Migration conflicts are a weekly occurrence. No service can be deployed independently.
- Affected components: Order service, inventory service, reporting service, notification service
- Estimated fix effort: 90 SP (€102,857)
- Velocity impact: 4 SP/sprint (migration conflicts, coupled deployments, debugging cross-service data issues)

### Product Roadmap Context
- Board expects "unified platform" within 12 months
- Q2: Consolidate user authentication (blocked by duplicated services)
- Q3: New pricing model launch (requires reliable data flow between order and inventory)
- Security compliance audit in Q4 (CVEs must be resolved)

### Additional Context
- Acquired team feels their code is being dismissed as "bad" — morale issue
- Acquirer's VP Engineering wants to rewrite everything from scratch; CTO disagrees
- Integration budget was set before technical due diligence revealed the full scope of debt
- 2 acquired engineers are already interviewing elsewhere`,
  },
];
