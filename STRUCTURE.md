# ConsiderIQ — Project Structure

```text
consideriq/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── features/
│   │   ├── how-it-works/
│   │   ├── pricing/
│   │   ├── waitlist/
│   │   ├── blog/
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── contact/
│   ├── (auth)/login/signup/forgot-password/
│   ├── app/projects/[projectId]/
│   └── api/
├── components/
│   ├── ui/
│   ├── marketing/
│   ├── project/
│   ├── simulation/
│   └── buyer-journey/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── security/
│   ├── crawler/
│   ├── analysis/
│   ├── simulation/
│   ├── providers/
│   ├── email/
│   └── validation/
├── supabase/migrations/
├── tests/unit integration security/
├── e2e/
├── public/
├── content/
├── .github/workflows/
├── .env.example
├── AGENTS.md
├── PRD.md
├── ARCHITECTURE.md
├── RULES.md
├── DESIGN.md
├── STRUCTURE.md
├── MEMORY.md
├── SECURITY.md
├── PRIVACY.md
├── TERMS.md
├── TEST_PLAN.md
├── GIT_WORKFLOW.md
├── CHANGELOG.md
└── README.md
```

## Route map
Public: `/`, `/features`, `/how-it-works`, `/waitlist`, `/pricing`, `/blog/*`, `/privacy`, `/terms`, `/contact`.

App: `/app`, `/app/projects`, `/app/projects/[projectId]`, `/personas`, `/scenarios`, `/simulations`, `/findings`, `/settings`.

All mutations run server-side and authorize before database access.
