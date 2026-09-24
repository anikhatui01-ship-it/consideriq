# ConsiderIQ — Engineering Rules

## Truth
- Never invent production results, statistics, citations, provider responses or rankings.
- Never silently replace an API failure with mock data.
- Label simulations clearly.

## Secrets
- No hardcoded secrets.
- No provider keys in client code.
- No Supabase service-role key in browser.
- `.env` never committed; maintain `.env.example`.

## Authorization
- Auth != authorization.
- Every protected server operation checks org membership.
- Never trust client-supplied organization/project IDs.
- Cross-tenant access tests are mandatory.

## Database
- RLS on every exposed tenant table.
- Every tenant table has `organization_id`.
- Schema changes require migrations.

## Validation
Validate URLs, IDs, strings, arrays, limits, provider settings and pagination with typed schemas.

## SSRF
Crawler accepts only safe HTTP(S) URLs, rejects private/internal targets, re-checks redirects, limits bytes/pages/depth/concurrency/timeouts.

## Prompt injection
Crawled/external content is untrusted data. It must never override system/developer instructions. Delimit source content explicitly and use schema-constrained outputs.

## AI
Store raw output unchanged. Version derived analysis. Never claim hidden model reasoning is known.

## Spending/abuse
Every provider call has timeout, retry policy, rate limit, scenario/turn cap and usage accounting.

## Web security
Use secure headers/CSP/HSTS where appropriate, safe cookies, output encoding, parameterized queries, CSRF protection where applicable.

## UX/performance
No fake loading, fake metrics, dead buttons, lorem ipsum, excessive animation or arbitrary UI libraries. Every async action has loading/success/empty/error states. Optimize client JS and images.

## Accessibility
Target WCAG 2.2 AA where practical. Keyboard navigation, visible focus, labels, semantic HTML, contrast.

## Git
No direct commits to `main`. Branch `feature/*` or `fix/*`. Use conventional commit prefixes.

## Completion gate
Before declaring a feature done: tests, build, security review, performance review, accessibility review, SEO review, happy-path test, failure-path test.
