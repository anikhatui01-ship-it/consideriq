# ConsiderIQ — Test Plan

## Static
TypeScript, lint, production build.

## Unit
Validators, matching, classification, metrics.

## Integration
Auth, DB, RLS, crawler, provider adapters.

## E2E
Signup → project → persona → scenarios → simulation → result → deletion.

## Security
Cross-tenant access, IDOR, SSRF, redirect SSRF, prompt injection, secret leakage, rate limiting, invalid input.

## Failure
Provider 401/429/500/timeout, crawler timeout/malformed page, partial simulation failure.

## Performance
Lighthouse, bundle size, mobile, slow network.

## Release gate
No critical security failure, exposed secret, data leak, fake production result, broken build or unrecoverable migration.
