# ConsiderIQ — Product Requirements Document

## Product
ConsiderIQ is an AI Buyer Journey Simulator / AI brand-visibility intelligence product.

### Core promise
Show how a realistic buyer's AI-mediated research journey changes as the buyer adds requirements, compares vendors, eliminates options, and asks for a recommendation.

### Not the promise
It does not predict human purchases, guarantee rankings, or expose hidden model reasoning.

## Target users
- SaaS founders
- Product/growth marketers
- SEO/GEO/AEO practitioners
- Demand-generation teams
- Agencies running AI-search research

## Core workflow
Visitor → waitlist/signup → project → website/brand profile → buyer persona → scenarios → real provider run → raw responses → analysis → buyer journey → findings → history.

## Beta V1 must have
- Marketing site
- Waitlist
- Auth
- Project creation
- Public-website analysis
- One approved buyer persona
- Scenario generation
- 10-scenario real simulation
- One real AI provider
- Immutable raw provider responses
- Brand/competitor classification
- Buyer-journey visualization
- Scenario detail
- Findings
- History
- Delete/export
- Privacy + Terms
- Security controls/tests
- Production deployment

## Beta V1 should have
- 2nd/3rd provider adapters
- repeated runs
- provider comparison
- counterfactual scenario
- citation/evidence extraction

## V1 excludes
- Stripe
- teams/SSO
- browser extension
- autonomous publishing
- giant prompt databases
- CRM integrations
- enterprise analytics suite

## Product principles
1. Evidence over one-number scores.
2. Raw AI responses remain inspectable.
3. Observed/calculated/inferred must be separated.
4. Never fabricate provider output or citations.
5. Prioritize unbranded discovery over branded mentions.
6. Model variability is visible, not hidden.
7. Every metric traces to scenarios.
8. Simulations are not customer research.
9. Answer “where did we lose?” before “what is our score?”.
10. Optimize beta for learning, not feature count.

## Success criteria
A stranger can complete the core loop without founder intervention and can identify at least one consideration point, one competitor replacement, one journey change, and one next question.

## Core entities
Organization, User, Project, BrandProfile, Competitor, Persona, Scenario, SimulationRun, ConversationTurn, ProviderResponse, Analysis, EvidenceSource, Finding, UsageRecord, AuditEvent, WaitlistEntry.
