# Commitment Issues

Your abandoned repos deserve a proper funeral.

**Live:** [commitmentissues.dev](https://commitmentissues.dev) &nbsp;·&nbsp; Built by [Dot Systems](https://github.com/dotsystemsdevs)

[![MIT License](https://img.shields.io/github/license/dotsystemsdevs/commitmentissues?style=flat-square)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://commitmentissues.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)

---

Paste a public GitHub URL **or** a GitHub username. Get a shareable **Certificate of Death** — algorithmic cause of death, last commit as last words, repo age, and exportable graphics. Or run an autopsy across an entire user's public repos and get a Graveyard Report. No signup. No account. Completely free.

## Two ways to autopsy

- **Certify a Repo** — paste a GitHub URL, get a certificate of death for that single repo
- **Examine a Profile** — paste a username, get a graveyard report card with every dead, struggling, and alive repo, plus a README badge you can embed

## Embed your graveyard

Paste the generated `![commitmentissues](...)` markdown in your README and you'll get a live-updating badge:

```
🪦 GITHUB REPO GRAVEYARD
94 DEAD · 35 STRUGGLING · 14 ALIVE
```

The badge and full certificate embed markdown are generated automatically on the certificate/profile page — just hit **Copy**.

## Screenshots

![Homepage](docs/screenshots/homepage.png)

![Certificate of Death](docs/screenshots/certificate.png)

![The Mortician — About page](docs/screenshots/about.png)

## Features

- **Certificate of Death** — A4 layout with cause of death, last words, repo age, stars, forks, and language
- **Profile Graveyard Report** — scan any user's public repos, grouped by Dead / Struggling / Alive, with per-repo descriptions and certificates
- **Field Record badge** — dynamic SVG for READMEs showing live dead/struggling/alive counts for a user
- **Algorithmic scoring** — `src/lib/scoring.ts` computes a death index from commit activity, archive status, issue count, and time since last push
- **Export** — PNG downloads in multiple aspect ratios: A4, Instagram (4:5 and 1:1), X/Twitter (16:9), Facebook feed, and Stories (9:16)
- **Mobile share** — Native share sheet on iOS/Android with a story-formatted image
- **Certificate embed** — Full certificate image via `/api/certificate-image/[owner]/[repo]` for GitHub READMEs
- **Recently Buried** — Live scrolling feed of the latest burials, interleaved with a curated Hall of Shame
- **Rate limiting** — Redis-backed per-IP limiting with graceful fallback
- **Timeout + race condition handling** — AbortController on every GitHub API call

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + inline styles |
| Fonts | UnifrakturMaguntia, Courier Prime, Inter |
| Export | `html-to-image`, Canvas API |
| Certificate image | `next/og` (Satori, Node.js runtime) |
| Hosting | Vercel |
| Storage | Upstash Redis (rate limiting + recent burials + stats) |
| Data | GitHub public API |
| Analytics | Vercel Analytics + Plausible |

## Getting started

**Prerequisites:** Node 18+

```bash
git clone https://github.com/dotsystemsdevs/commitmentissues.git
cd commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` in the project root:

```env
# GitHub — optional but strongly recommended (raises API rate limits from 60 to 5000 req/hr)
GITHUB_TOKEN=ghp_yourtoken

# Upstash Redis — optional (enables Recently Buried feed, rate limiting, and buried counter)
KV_REST_API_URL=https://your-instance.upstash.io
KV_REST_API_TOKEN=your_token
```

**Without any env vars** the app still works fully — you just get GitHub's unauthenticated rate limits (60 req/hr) and the Recently Buried feed is hidden.

Generate a GitHub token at **Settings → Developer settings → Personal access tokens**. Fine-grained or classic both work; no special scopes needed for public repo access.

## How we pronounce repos dead

| Step | What happens |
|------|-------------|
| Input | User submits a public GitHub URL |
| Fetch | App fetches repo metadata + latest commit via GitHub API |
| Score | `computeDeathIndex()` in `src/lib/scoring.ts` produces a 0–10 death index |
| Narrative | `determineCauseOfDeath()` picks a cause based on the index and repo signals |
| Output | Certificate rendered client-side, exportable as high-res PNG |

The scoring algorithm weighs: time since last commit, archive status, open issues, fork ratio, star count, and whether the last commit message reads like a final sigh.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    ← homepage (repo + profile scan)
│   ├── about/page.tsx              ← /about
│   ├── legal/page.tsx              ← /legal
│   ├── user/[username]/page.tsx    ← permalink to a profile graveyard
│   ├── layout.tsx                  ← root layout, fonts, analytics, JSON-LD
│   └── api/
│       ├── repo/route.ts           ← single-repo analysis
│       ├── user/route.ts           ← user profile scan
│       ├── recent/route.ts         ← recently buried feed
│       ├── recent-profiles/        ← top-ticker profile feed
│       ├── random/route.ts         ← random dead repo picker
│       ├── stats/route.ts          ← buried + profiles counter
│       ├── badge/route.ts          ← dynamic graveyard SVG (for READMEs)
│       ├── badge/[owner]/[repo]/   ← single-repo shields.io badge
│       └── certificate-image/[owner]/[repo]/  ← OG image for README embeds
├── components/
│   ├── CertificateCard.tsx         ← certificate view + export/share logic
│   ├── CertificateFixed.tsx        ← certificate layout (A4)
│   ├── SearchForm.tsx              ← URL input + rotating placeholder
│   ├── UserDashboard.tsx           ← profile graveyard (Dead/Struggling/Alive)
│   ├── ReadmeBadge.tsx             ← README badge preview + copy
│   ├── RecentlyBuried.tsx          ← scrolling marquee feed
│   ├── ScannerBanner.tsx           ← top-bar profile ticker
│   ├── LoadingState.tsx            ← unified loading indicator
│   ├── ErrorDisplay.tsx            ← error + retry UI
│   ├── PageHero.tsx                ← shared hero (emoji, title, subtitle)
│   ├── SubpageShell.tsx            ← shell for /about, /legal, /user
│   └── SiteFooter.tsx              ← fixed bottom footer
└── lib/
    ├── scoring.ts                  ← death index + cause of death logic
    ├── scoring.test.ts             ← scoring unit tests
    ├── rateLimit.ts                ← Redis-backed rate limiting
    ├── recentStore.ts              ← recently buried Redis store
    ├── hallOfShame.ts              ← curated famous dead repos
    └── types.ts                    ← shared TypeScript types
```

## Running tests

```bash
npm test
```

Tests cover the scoring algorithm in `src/lib/scoring.test.ts`.

## Contributing

Contributions are welcome. Please read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) before opening a PR.

- Use the issue templates for bugs and feature requests
- CI runs lint, tests, and build on every pull request to `master`
- Keep PRs focused — one thing at a time

## Roadmap

Items are loosely prioritized. Community PRs welcome on anything marked **good first issue**.

### Near-term
- [ ] Upgrade to Next.js 16 (planned within one month of launch)
- [ ] Dark mode
- [ ] `/api/certificate-image` caching layer (currently no Redis cache)
- [ ] Repo comparison — bury two repos side by side

### Longer-term
- [ ] Chrome extension — tombstone badge injected on GitHub repo pages
- [ ] Language-specific causes of death ("Died of PHP fatigue", "Last seen in CoffeeScript")
- [ ] Death anniversary emails — opt-in reminders on the date of last commit
- [ ] API for third-party integrations

### Won't do (by design)
- Private repo support — we don't break into houses
- Accounts / login — the funeral is free and anonymous
- Monetization — coffee button stays, paywalls don't

## License

MIT — see [`LICENSE`](LICENSE).

---

Built with too much free time by [Dot Systems](https://github.com/dotsystemsdevs). If it made you laugh, [keep us alive](https://buymeacoffee.com/commitmentissues).
