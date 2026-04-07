# Contributing

Thanks for helping improve `commitmentissues.dev`.

## Ground rules

- Keep PRs small and focused.
- One concern per PR (bugfix, feature, docs, or refactor).
- Preserve the existing product tone and UI style.
- Do not introduce heavy dependencies unless clearly justified.

## Local setup

```bash
npm install
npm run dev
```

Optional for higher GitHub API limits:

```env
GITHUB_TOKEN=ghp_yourtoken
```

## Before opening a PR

Run:

```bash
npm run lint
npm test
```

If you changed runtime behavior, also run:

```bash
npm run build
```

## Branch and PR flow

1. Fork repo
2. Create feature branch (`feat/...`, `fix/...`, `docs/...`, `chore/...`)
3. Commit with clear message
4. Open PR to `main`

## Issue hygiene

- Use issue templates when available.
- Include reproduction steps for bugs.
- Include acceptance criteria for feature requests.

## Scope expectations

Good first contributions:

- UI polish and micro-interactions
- Small bug fixes
- Docs improvements
- Tests around `src/lib/scoring.ts`

Avoid in first PRs:

- Large rewrites
- Broad architecture refactors
- Unrelated cleanup mixed into feature work

