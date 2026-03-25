import type { SampleScenario } from "./sample-data";

export const ESTIMATION_BIAS_SAMPLES: SampleScenario[] = [
  {
    id: "feature-optimism",
    name: "Feature Optimism (Sprint Mode)",
    description: "Features consistently underestimated by 40%, bugs accurate, tech debt overestimated",
    data: `## Team: PayCore (6 engineers, 1 PO, 1 SM)
**Analysis Mode**: Sprint-Level (Story)
**Period**: 6 sprints

### Story-Level Estimation Data
| Story ID | Name | Type | Estimated SP | Actual SP | Sprint | Assignee | Complexity |
|----------|------|------|-------------|----------|--------|----------|------------|
| S-1 | Payment gateway integration | feature | 5 | 8 | Sprint 1 | Alice | API integration |
| S-2 | Fix checkout timeout | bug | 3 | 3 | Sprint 1 | Bob | Backend |
| S-3 | Refactor auth module | tech_debt | 8 | 5 | Sprint 1 | Charlie | Refactoring |
| S-4 | User dashboard redesign | feature | 8 | 13 | Sprint 1 | Alice | Full-stack |
| S-5 | Fix email notification bug | bug | 2 | 2 | Sprint 1 | Bob | Backend |
| S-6 | Add subscription tier | feature | 5 | 7 | Sprint 2 | Alice | Full-stack |
| S-7 | Fix mobile responsive layout | bug | 3 | 4 | Sprint 2 | Diana | Frontend |
| S-8 | Remove deprecated endpoints | tech_debt | 5 | 3 | Sprint 2 | Charlie | Backend |
| S-9 | Multi-currency support | feature | 13 | 21 | Sprint 2 | Alice | API integration |
| S-10 | Fix race condition in cart | bug | 5 | 5 | Sprint 2 | Bob | Backend |
| S-11 | Invoice PDF generation | feature | 5 | 9 | Sprint 3 | Diana | Full-stack |
| S-12 | Fix search pagination | bug | 2 | 2 | Sprint 3 | Bob | Backend |
| S-13 | Upgrade ORM version | tech_debt | 8 | 6 | Sprint 3 | Charlie | Backend |
| S-14 | Webhook retry mechanism | feature | 8 | 12 | Sprint 3 | Alice | API integration |
| S-15 | Fix timezone display | bug | 2 | 3 | Sprint 3 | Diana | Frontend |
| S-16 | Admin bulk actions | feature | 5 | 8 | Sprint 4 | Bob | Full-stack |
| S-17 | Fix CSV export encoding | bug | 2 | 2 | Sprint 4 | Charlie | Backend |
| S-18 | Migrate to new logging lib | tech_debt | 5 | 4 | Sprint 4 | Charlie | Backend |
| S-19 | Real-time notifications | feature | 13 | 20 | Sprint 4 | Alice | Full-stack |
| S-20 | Fix double charge bug | bug | 5 | 5 | Sprint 4 | Bob | Backend |
| S-21 | API rate limiting | feature | 5 | 8 | Sprint 5 | Bob | API integration |
| S-22 | Fix session expiry | bug | 3 | 3 | Sprint 5 | Diana | Backend |
| S-23 | Clean up test fixtures | tech_debt | 3 | 2 | Sprint 5 | Charlie | Testing |
| S-24 | Batch payment processing | feature | 8 | 14 | Sprint 5 | Alice | API integration |
| S-25 | Fix address validation | bug | 2 | 2 | Sprint 5 | Bob | Backend |
| S-26 | Customer export feature | feature | 5 | 7 | Sprint 6 | Diana | Full-stack |
| S-27 | Fix webhook signature | bug | 3 | 3 | Sprint 6 | Bob | Backend |
| S-28 | Remove feature flags | tech_debt | 3 | 2 | Sprint 6 | Charlie | Backend |
| S-29 | SSO integration | feature | 8 | 13 | Sprint 6 | Alice | API integration |
| S-30 | Fix currency rounding | bug | 3 | 4 | Sprint 6 | Bob | Backend |

### Additional Context
- Using Planning Poker for estimation
- Alice is the most experienced developer (5 years on the team)
- Bob joined 18 months ago, very accurate on bugs
- Charlie tends to overestimate tech debt ("padding for safety")
- Team has not discussed estimation patterns before`,
  },
  {
    id: "anchoring-bias",
    name: "Senior Dev Anchoring (Sprint Mode)",
    description: "When senior dev estimates first, team anchors. Her absence improves accuracy 30%",
    data: `## Team: SearchPlatform (5 engineers, 1 PO, 1 SM)
**Analysis Mode**: Sprint-Level (Story)
**Period**: 6 sprints

### Story-Level Estimation Data
| Story ID | Name | Type | Estimated SP | Actual SP | Sprint | Assignee | Complexity |
|----------|------|------|-------------|----------|--------|----------|------------|
| S-1 | Search index rebuild | feature | 8 | 8 | Sprint 1 | Maria* | Backend |
| S-2 | Add filter by date | feature | 3 | 5 | Sprint 1 | Tom | Frontend |
| S-3 | Fix relevance scoring | bug | 5 | 5 | Sprint 1 | Maria* | Backend |
| S-4 | Autocomplete suggestions | feature | 5 | 8 | Sprint 1 | Jun | Full-stack |
| S-5 | Search analytics dashboard | feature | 8 | 13 | Sprint 2 | Tom | Full-stack |
| S-6 | Fix UTF-8 search bug | bug | 2 | 2 | Sprint 2 | Maria* | Backend |
| S-7 | Faceted search | feature | 13 | 13 | Sprint 2 | Maria* | Backend |
| S-8 | Mobile search UX | feature | 5 | 9 | Sprint 2 | Jun | Frontend |
| S-9 | Synonym dictionary | feature | 5 | 5 | Sprint 3 | Maria* | Backend |
| S-10 | Fix search timeout | bug | 3 | 3 | Sprint 3 | Tom | Backend |
| S-11 | Geo-location search | feature | 8 | 14 | Sprint 3 | Jun | Full-stack |
| S-12 | Search history feature | feature | 3 | 6 | Sprint 3 | Lisa | Frontend |
| S-13 | Voice search MVP | feature | 8 | 7 | Sprint 4** | Tom | Frontend |
| S-14 | Fix stale cache issue | bug | 5 | 4 | Sprint 4** | Jun | Backend |
| S-15 | Search A/B testing | feature | 5 | 5 | Sprint 4** | Lisa | Full-stack |
| S-16 | Batch reindex tool | feature | 8 | 7 | Sprint 4** | Tom | Backend |
| S-17 | Image search beta | feature | 13 | 20 | Sprint 5 | Jun | Full-stack |
| S-18 | Fix ranking decay | bug | 3 | 3 | Sprint 5 | Maria* | Backend |
| S-19 | Search suggestions ML | feature | 8 | 14 | Sprint 5 | Lisa | ML |
| S-20 | Personalized results | feature | 8 | 13 | Sprint 5 | Tom | Full-stack |
| S-21 | NLP query parsing | feature | 13 | 12 | Sprint 6** | Jun | ML |
| S-22 | Fix index corruption | bug | 5 | 5 | Sprint 6** | Tom | Backend |
| S-23 | Search export feature | feature | 3 | 3 | Sprint 6** | Lisa | Full-stack |
| S-24 | Contextual search | feature | 8 | 8 | Sprint 6** | Jun | Full-stack |
| S-25 | Category tree search | feature | 5 | 5 | Sprint 6** | Tom | Frontend |

*Maria is the senior developer (8yr experience). She typically estimates first in Planning Poker.
**Sprint 4 and Sprint 6: Maria was on vacation. Team estimated without her.

### Events & Context
- Sprint 4: Maria on vacation — team estimated independently
- Sprint 6: Maria on vacation — team estimated independently

### Additional Context
- Planning Poker used, but Maria always reveals her card first
- When Maria is absent, the team takes 20% longer to estimate but results are more accurate
- Maria is aware she might be influencing estimates but says "someone needs to go first"
- SM has not addressed the anchoring pattern`,
  },
  {
    id: "pi-breakdown-failure",
    name: "Feature Breakdown Failure (PI Mode)",
    description: "PI 1: 5 features, well-broken-down ones on track, poorly broken-down ones blow up 2.5x",
    data: `## Team: InfraPlatform (9 engineers, 1 PO, 1 SM, part of ART "Cloud Foundation")
**Analysis Mode**: PI-Level (Feature)
**Period**: 2 PIs (PI 1 and PI 2, 5 sprints each)

### PI-Level Feature Estimation Data

**PI 1 Features:**
| Feature | PI Planning Est (SP) | Actual SP | Stories | Planned Sprints | Actual Sprints | PI | Dependencies | Breakdown Quality |
|---------|---------------------|----------|---------|----------------|---------------|-----|-------------|------------------|
| API Gateway v2 | 40 | 42 | 12 | Sprint 1-3 | Sprint 1-3 | PI 1 | None | good |
| Service Mesh Migration | 55 | 140 | 8→22 | Sprint 1-4 | Sprint 1-5 + PI 2 Sprint 1-2 | PI 1 | Team Bravo (auth) | poor |
| Observability Dashboard | 30 | 35 | 9 | Sprint 3-5 | Sprint 3-5 | PI 1 | Platform Data (API) | good |
| Config Management Overhaul | 50 | 125 | 6→18 | Sprint 2-5 | Sprint 3-5 + PI 2 Sprint 1-3 | PI 1 | None | poor |
| CI/CD Pipeline Modernization | 25 | 28 | 8 | Sprint 4-5 | Sprint 4-5 | PI 1 | None | good |

**PI 2 Features (including carryover):**
| Feature | PI Planning Est (SP) | Actual SP | Stories | Planned Sprints | Actual Sprints | PI | Dependencies | Breakdown Quality |
|---------|---------------------|----------|---------|----------------|---------------|-----|-------------|------------------|
| Service Mesh (carryover) | 85 | 80 | 14 | Sprint 1-2 | Sprint 1-2 | PI 2 | Resolved | partial |
| Config Management (carryover) | 75 | 70 | 12 | Sprint 1-3 | Sprint 1-3 | PI 2 | None | partial |
| Zero-Trust Network Policy | 45 | 48 | 14 | Sprint 2-5 | Sprint 2-5 | PI 2 | Security team | good |
| Developer Portal MVP | 35 | 38 | 11 | Sprint 3-5 | Sprint 3-5 | PI 2 | None | good |

### Events & Context
- PI 1 Sprint 2: Service Mesh — discovered 3 undocumented API contracts that required new stories
- PI 1 Sprint 3: Config Management — original 6 stories split into 18 after discovering hidden dependencies between config modules
- PI 2: RTE enforced stricter breakdown requirements at PI Planning — minimum 3 acceptance criteria per story

### Additional Context
- First PI Planning was "best effort" — team hadn't done feature breakdown at scale before
- Features with "good" breakdown had 3+ refinement sessions before PI Planning
- Features with "poor" breakdown were estimated as a lump sum ("we think it's about 50 SP")
- PI 2 estimates for carryover features were more realistic because team now understood the actual scope
- Team is learning: PI 1 breakdown avg 7 stories/feature, PI 2 avg 13 stories/feature`,
  },
  {
    id: "pi-dependency-blindspot",
    name: "PI Dependency Blind Spot (PI Mode)",
    description: "PI 1: dependencies cause delays (wait time not in SP). PI 2: explicit dependency estimation fixes it",
    data: `## Team: PaymentGateway (7 engineers, 1 PO, 1 SM, part of ART "FinTech Platform")
**Analysis Mode**: PI-Level (Feature)
**Period**: 2 PIs (PI 1 and PI 2, 5 sprints each)

### PI-Level Feature Estimation Data

**PI 1 Features (dependencies NOT estimated):**
| Feature | PI Planning Est (SP) | Actual SP | Stories | Planned Sprints | Actual Sprints | PI | Dependencies | Breakdown Quality |
|---------|---------------------|----------|---------|----------------|---------------|-----|-------------|------------------|
| PCI DSS Compliance Update | 40 | 65 | 12 | Sprint 1-3 | Sprint 1-5 | PI 1 | Security team (audit review, 2 rounds) | partial |
| Multi-Currency Settlement | 35 | 55 | 10 | Sprint 1-3 | Sprint 1-4 + PI 2 Sprint 1 | PI 1 | Banking partner (API spec changes mid-PI) | good |
| Fraud Detection Rules Engine | 30 | 32 | 9 | Sprint 2-4 | Sprint 2-4 | PI 1 | None | good |
| Merchant Onboarding Portal | 25 | 40 | 7 | Sprint 3-5 | Sprint 3-5 + PI 2 Sprint 1-2 | PI 1 | Compliance team (KYC review process) | partial |
| Transaction Reporting Dashboard | 20 | 22 | 8 | Sprint 4-5 | Sprint 4-5 | PI 1 | None | good |

**PI 2 Features (dependencies explicitly estimated):**
| Feature | PI Planning Est (SP) | Actual SP | Stories | Planned Sprints | Actual Sprints | PI | Dependencies | Breakdown Quality |
|---------|---------------------|----------|---------|----------------|---------------|-----|-------------|------------------|
| Multi-Currency (carryover) | 20 | 18 | 6 | Sprint 1 | Sprint 1 | PI 2 | Banking partner (resolved) | good |
| Merchant Onboarding (carryover) | 15 | 16 | 5 | Sprint 1-2 | Sprint 1-2 | PI 2 | Compliance (process agreed) | good |
| Chargeback Automation | 45 | 48 | 15 | Sprint 1-4 | Sprint 1-4 | PI 2 | Card network (API integration) — 8 SP buffer added | good |
| Real-Time Balance API | 30 | 28 | 10 | Sprint 3-5 | Sprint 3-5 | PI 2 | Core Banking (data feed) — 5 SP buffer added | good |
| Payment Link Generator | 20 | 20 | 7 | Sprint 4-5 | Sprint 4-5 | PI 2 | None | good |

### Events & Context
- PI 1 Sprint 2: PCI DSS — Security team audit returned 14 findings, required 2nd review cycle (added 3 weeks of wait time)
- PI 1 Sprint 3: Multi-Currency — Banking partner changed API spec mid-PI, 8 stories required rework
- PI 1 Sprint 4: Merchant Onboarding — KYC review process took 3 weeks (not accounted for in estimate)
- PI 2: Team added "dependency buffer" stories at PI Planning for every external dependency

### Additional Context
- PI 1: Team estimated only "our work" — didn't account for wait time, review cycles, or external partner response times
- PI 2: RTE introduced "dependency estimation" practice — for each dependency, add buffer stories for: wait time, review cycles, rework risk
- PI 1 features with no dependencies: 96% accuracy. PI 1 features with dependencies: 58% accuracy
- PI 2 features with dependencies (buffered): 94% accuracy
- Key learning: dependencies add 40-60% hidden effort that teams don't estimate because it's "not our work"`,
  },
];
