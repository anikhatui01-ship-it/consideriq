# ConsiderIQ — Architecture

## Stack
- Next.js + TypeScript
- Tailwind + shadcn/ui + Radix
- Supabase Postgres/Auth/Storage
- Netlify initially
- Cloudflare DNS + Turnstile
- Resend
- GitHub + GitHub Actions

## High-level
Browser → Next.js UI → authenticated server route → authorization → service layer → crawler/provider → Postgres → analysis → UI.

Provider keys and privileged Supabase keys never reach the browser.

## Repository boundaries
- `app/` routes/pages/api
- `components/` UI
- `lib/auth` auth helpers
- `lib/db` database
- `lib/security` security controls
- `lib/crawler` safe URL fetching/extraction
- `lib/providers` LLM adapters
- `lib/analysis` classification/metrics
- `tests/` unit/integration/security
- `e2e/` Playwright
- `supabase/migrations/` schema history

## Database
Every tenant-owned row has `organization_id`.
Use foreign keys, timestamps, constraints, indexes and RLS on all exposed tenant tables.

Raw provider data and derived analysis are separate.

## Provider abstraction
```ts
interface LLMProvider {
  id: string;
  getModels(): Promise<ModelInfo[]>;
  runConversation(input: SimulationInput): Promise<ProviderRun>;
}
```
Store provider, model, raw response, usage, latency, citations/annotations when supplied, errors, prompt/classifier versions.

## Crawler
Server-side only. Validate URL → DNS/IP safety → redirects → bounded fetch → extract text/metadata → deduplicate → source-grounded profile.
Reject localhost/private/link-local/metadata targets and uncontrolled redirects.

## Environment separation
- Supabase staging
- Supabase production
- separate secrets/config per environment
- never use production DB locally

## Deployment
feature branch → PR → CI → staging → QA → merge main → production → release tag.

## Failure model
Provider failures are preserved and retriable. Raw responses are never replaced by mock data. Crawl failures are surfaced, not faked. Long runs must have explicit status/retry/error fields.
