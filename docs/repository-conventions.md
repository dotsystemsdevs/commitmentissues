# Repository conventions

Lightweight conventions used across this repo. The goal is consistency, not ceremony.

## Naming

| Kind | Convention | Example |
| --- | --- | --- |
| Docs and config files | `kebab-case` | `repository-conventions.md`, `next.config.mjs` |
| Folders | lowercase | `docs/`, `screenshots/` |
| React components | `PascalCase.tsx` | `CertificateCard.tsx` |
| Hooks | `useCamelCase.ts` | `useRepoAnalysis.ts`, `useCandles.ts` |
| Library / pure logic | `camelCase.ts` | `rateLimit.ts`, `recentStore.ts` |

## Folder layout

| Folder | Purpose |
| --- | --- |
| `src/app/` | Routes, API handlers, layouts, SEO files. App Router only. |
| `src/components/` | UI components and feature-scoped hooks. |
| `src/hooks/` | Cross-feature React hooks. |
| `src/lib/` | Pure logic and shared utilities — no React imports. |
| `docs/screenshots/` | README images. |
| `.github/` | Templates, workflows, and contributor docs. |

## Scope rule

Prefer small, focused changes over broad refactors. If a change spans several concerns, open a tracking issue first.

## Commit messages

Conventional Commit prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `test:`) are used in history but not enforced. Aim for a one-line summary that describes the user-facing change, not the file you touched.
