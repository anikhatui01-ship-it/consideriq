# ConsiderIQ — Git Workflow

## Branches
- `main` — production
- `staging` — beta/staging
- `feature/<name>` — new work
- `fix/<name>` — bug fixes
- `security/<name>` — security fixes
- `perf/<name>` — performance work

## Normal flow
feature → local tests → commit → Pull Request → CI → staging → QA → main → production → release tag

## Never work directly on main
```bash
git switch staging
git pull origin staging
git switch -c feature/<name>
```

## Commit prefixes
- `feat:` new feature
- `fix:` bug fix
- `security:` security fix
- `perf:` performance
- `test:` tests
- `docs:` docs
- `refactor:` refactoring
- `chore:` maintenance

## Before pushing
```bash
npm run lint
npm run typecheck
npm test
npm run build
```
Then:
```bash
git status
git add .
git commit -m "feat: ..."
git push -u origin feature/<name>
```

## Pull requests
Explain what changed, why, tests run, security implications, migrations, environment changes, and known limitations.

Do not merge failing required checks.

## Staging
Use separate Supabase project and environment variables. Never use production data or credentials.

## Production
Only release tested code from `staging` into `main`. Production must be reproducible from Git.

## Releases
Use semantic versioning:
- `v0.1.0-alpha.1`
- `v0.1.0-beta.1`
- `v0.2.0-beta.1`
- `v1.0.0`

Example:
```bash
git switch main
git pull origin main
git tag -a v0.1.0-beta.1 -m "ConsiderIQ beta 1"
git push origin v0.1.0-beta.1
```

## Database
All Supabase schema changes use migrations. Test locally → staging → production.

Never make undocumented production schema changes.

## Secrets
Never commit `.env`, `.env.local`, or production secrets. Commit only `.env.example` with empty values.

If a secret is committed, rotate/revoke it immediately.

## Hotfix
```bash
git switch main
git pull
git switch -c fix/<issue>
```
After fixing, synchronize the fix back into `staging`.

## Changelog
Update `CHANGELOG.md` for every release.

## Golden rule
Git is the history of what the product is, why it changed, and which version produced which behavior.
