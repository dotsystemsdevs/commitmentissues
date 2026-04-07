# Roadmap — commitmentissues.dev

Living document. Completed work at the top, upcoming at the bottom. Add new entries as changes ship.

---

## Shipped

### Launch foundation
- Initial Next.js app setup — certificate generation, SEO metadata, JSON-LD, sitemap
- A4 certificate design with cause of death, last words, repo age, derived stats
- Rubber stamp branding ("REST IN PRODUCTION")
- Satori-based server-side certificate rendering
- Leaderboard / graveyard carousel (Famous Casualties)
- Submit form with example repo chips
- FAQ, Terms, Privacy consolidated into single About page
- Footer with GitHub source link and "keep the server alive" coffee CTA

### Social & exports
- Multi-format exports (feed, square, story 9:16) without zip
- Mobile native share sheet (Web Share API)
- Platform-aware share flow (X, Instagram, desktop fallback menu)

### Live data (Upstash / Redis)
- Real buried counter with historical baseline (800+)
- Recently Buried section — live feed of analyzed repos
- Animated count tick-up on load
- Migrated from `@vercel/kv` to `@upstash/redis`

### UX polish
- Full UI/UX audit — back buttons, consistent gray design system, CSS cleanup
- Brutalist outlined control style across key surfaces
- Hover states and micro-interactions across all clickable elements
- Mobile certificate scaling — viewport-based, no sideways scroll
- Marquee scroll speed and reverse-direction Recently Buried row
- Random dead repo button (replaces example chips)
- Hover effects on all certificate action buttons
- Fixed Buy Me a Coffee button (top-right, all pages)

### Routing & SEO
- Legacy route redirects (`/pricing`, `/faq`, `/privacy`) → `/about`
- `/terms` removed from sitemap and merged into `/about`
- OG image aligned with live hero (light theme, correct fonts)
- Custom roast line for commitmentissues repo itself

### Bug fixes
- Fixed "bury something else →" on error screen — was retrying same broken URL instead of resetting to the form

### Data integrity
- Audited all 28 Famous Casualties graveyard entries against live GitHub API
- Fixed `angularjs/angular.js` → `angular/angular.js` (org transferred, old path 404)
- Fixed `facebook/flux` → `facebookarchive/flux` (archived org move)
- Fixed `joyent/node` → `nodejs/node-v0.x-archive` (org transferred)
- Fixed `yahoo/mojito` → `YahooArchive/mojito` (org transferred)
- Fixed `mikeal/request` → `request/request` (repo transferred)
- Removed `nicowillis/ratchet` — repo deleted with no replacement
- Removed `microsoft/winjs` — repo deleted with no replacement
- Removed `adobe/phonegap` — repo deleted with no replacement
- Synced `scoring.ts` known-cause keys to match updated repo paths

### Open-source prep
- GitHub issue templates
- Repository conventions doc (`docs/repository-conventions.md`)
- `docs/releases/` changelog structure (v1.0.0)
- README refresh with screenshots, stack, and onboarding sections

---

## Up next

### Infrastructure
- [ ] Upgrade Next.js 14.x → 16.x (deferred CVEs — target: within one month of launch)

### Features
- [ ] *(add items here)*

### Fixes / polish
- [ ] *(add items here)*

---

## How to use this file

When a change ships, move it from **Up next** to the relevant **Shipped** section.
For brand-new ideas, add them under **Up next** with a `[ ]` checkbox.
Keep entries short — one line per change, same tone as the commit messages above.
