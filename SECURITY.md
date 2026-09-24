# ConsiderIQ — Security Checklist

## Identity
- Supabase Auth
- secure session handling
- recovery flow

## Authorization
- org membership check
- resource ownership check
- RLS
- server-side authorization
- cross-tenant tests

## Crawler
- HTTPS only
- reject loopback/private/link-local/metadata IPs
- revalidate redirects
- size/page/depth/time limits
- content-type restrictions

## AI
- keys server-side
- schema validation
- prompt-injection boundaries
- token/turn limits
- abuse/rate limits
- cost controls

## Web
- CSP
- HSTS
- X-Content-Type-Options
- Referrer-Policy
- secure cookies
- XSS-safe rendering
- SQL parameterization

## Operations
- security audit logs
- dependency scanning
- backup/recovery plan
- error monitoring without secrets

## Release blockers
- secret exposure
- cross-tenant leak
- critical SSRF
- auth bypass
- unrecoverable migration
- fake production result
