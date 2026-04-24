# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned

- Upgrade Next.js 15.x → 16.x (deferred CVEs).
- Optional Redis cache layer in front of `/api/certificate-image`.
- Repo comparison — bury two repos side by side.
- Chrome extension — tombstone badge injected on GitHub repo pages.
- Language-specific causes of death ("Died of PHP fatigue", "Last seen in CoffeeScript").

### Out of scope by design

- Private repo support — public data only.
- Accounts / login — the funeral is anonymous.
- Paywalls — coffee button stays, monetization doesn't.

## [1.0.0] — 2026-04-24

First public open-source release of `commitmentissues.dev`.

### Added

- Certificate of Death generator — A4 layout with cause of death, last words, repo age, and derived stats.
- Profile graveyard scanner — Dead / Struggling / Alive grouping with one-click certificate links.
- Live README badge — `/api/badge?username=…` SVG with dead / struggling / alive counts.
- Hall of Fame marquee — curated list of famously abandoned repos with click-to-light wreath counters.
- Multi-format export — A4, Instagram (4:5, 1:1), X (16:9), Facebook (1.91:1), Story (9:16).
- Mobile native share sheet (Web Share API) and desktop fallback (X intent + copy link + downloads).
- Live counters — buried + profiles scanned, persisted in Upstash Redis.
- Top-of-page burial ticker — falls back to Hall of Shame when Redis is empty.
- Random dead repo button (powered by GitHub search).
- `/about` and `/legal` pages with consistent typography and back navigation.
- Algorithmic scoring with curated overrides for famously abandoned repos.
- `next/og` certificate renderer at `/api/certificate-image/[owner]/[repo]` for README embeds.
- Hardened security headers via `next.config.mjs` (CSP, frame ancestors, referrer policy, etc.).
- GitHub issue templates, PR template, CI (`lint`, `test`, `build`), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- Unit tests for the scoring algorithm.

### Fixed

- Audited the 28 Hall of Fame entries against live GitHub — fixed transferred / renamed orgs (`angular/angular.js`, `facebook/flux`, `joyent/node`, `yahoo/mojito`, `mikeal/request`).
- Removed entries pointing to repos that no longer exist (`nicowillis/ratchet`, `microsoft/winjs`, `adobe/phonegap`).
- Synced curated `KNOWN_REPO_CAUSES` keys in `scoring.ts` to the corrected paths.
- Reset-to-form behavior on the error screen (no longer retries the broken URL).

### Migrated

- Live data backend moved from `@vercel/kv` to `@upstash/redis`.
- Legacy routes (`/pricing`, `/faq`, `/privacy`, `/terms`) redirect to `/` or `/about`.

[Unreleased]: https://github.com/dotsystemsdevs/commitmentissues/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dotsystemsdevs/commitmentissues/releases/tag/v1.0.0
