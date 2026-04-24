# Contributing

Thanks for taking the time. The bar is "small, focused, and consistent with what's already there."

## Ground rules

- One concern per PR — bugfix, feature, docs, or refactor.
- Match the existing tone, design system, and file conventions (see below).
- No heavyweight dependencies unless clearly justified in the PR description.
- No telemetry, accounts, or anything that requires the user to log in.

## Local setup

```bash
git clone https://github.com/dotsystemsdevs/commitmentissues.git
cd commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Every environment variable is optional — see [`.env.example`](../.env.example).

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm test
```

If you changed runtime behaviour (anything outside docs / tests), also run:

```bash
npm run build
```

CI runs the same three commands plus `build` on every push and PR to `main`.

## Branch and PR flow

1. Fork the repo.
2. Create a branch named `feat/...`, `fix/...`, `docs/...`, or `chore/...`.
3. Keep commits small. Conventional Commit prefixes are appreciated but not required.
4. Open the PR against `main`. Fill in the PR template — what changed, why, and screenshots if anything visual moved.

## File and folder conventions

- React components: `PascalCase.tsx` in `src/components/`.
- Hooks: `useCamelCase.ts` — co-located with the component if scoped to one feature, otherwise in `src/hooks/`.
- Library / pure logic: `camelCase.ts` in `src/lib/`. Keep this layer free of React imports.
- API routes follow the App Router convention: `src/app/api/<name>/route.ts`.
- Docs and config: `kebab-case.md`.
- Folders: lowercase.

## Scope expectations

Good first contributions:

- UI polish, micro-interactions, accessibility fixes.
- Small bug fixes with a clear repro.
- New rules in [`scoring.ts`](../src/lib/scoring.ts) — with a test case.
- Docs and screenshot updates.

Please check in before opening:

- Larger refactors or architecture changes.
- New runtime dependencies.
- Anything that adds backend state (we already lean heavily on Redis).

Avoid in first PRs:

- Sweeping rewrites mixed into a feature.
- Unrelated cleanup bundled into a fix.
- Style-only changes that fight the design tokens in [`globals.css`](../src/app/globals.css).

## Reporting bugs and requesting features

Use the issue templates in [`.github/ISSUE_TEMPLATE/`](ISSUE_TEMPLATE). Include a reproduction for bugs and acceptance criteria for features.
