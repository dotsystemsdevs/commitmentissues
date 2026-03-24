# ☠️ commitmentissues.dev

Official death certificates for abandoned GitHub repos.

**Live demo:** [https://commitmentissues.dev](https://commitmentissues.dev)

Drop a GitHub URL. Get a shareable certificate in seconds.

![MIT License](https://img.shields.io/github/license/dotsystemsdevs/commitmentissues?style=flat-square)
![Vercel Deploy](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)

## Screenshots

Home:

![Homepage screenshot](docs/screenshots/homepage.png)

Certificate view:

![Certificate screenshot](docs/screenshots/certificate.png)

About page:

![About page screenshot](docs/screenshots/about.png)

## How it works

1. Paste a GitHub repository URL.
2. Fetch public repo metadata from the GitHub API.
3. Calculate a death score and cause-of-death.
4. Generate and export a Certificate of Death.

## Features

- A4-style death certificate with cause, last words, age, and stats
- Multi-format social exports (Instagram 4:5 / square, X, Facebook, Story)
- Native mobile Story/Reel-friendly share (9:16 on mobile)
- Hall of Shame leaderboard of famously abandoned repos
- Recently Buried live feed (latest public burials)

## Privacy

- No login required
- Only public GitHub data is used
- Recently Buried stores the latest public burial entries (repo, cause, score, timestamp)
- Anonymous aggregate analytics are used for product metrics

## Leaderboard data

The Hall of Shame list is currently curated for recognizable dead repos and fast first-load UX.

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Fonts | UnifrakturMaguntia · Courier Prime · Inter |
| Deploy | Vercel |
| Storage | Vercel KV (usage counters only) |
| Data | GitHub Public API |

## Run locally

```bash
git clone https://github.com/dotsystemsdevs/commitmentissues
cd commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: add a `GITHUB_TOKEN` in `.env.local` to raise GitHub API limits.

```env
GITHUB_TOKEN=ghp_yourtoken
```

## Testing

```bash
npm test
```

## Contributing

- Read `.github/CONTRIBUTING.md` before opening a PR
- Use the issue templates and PR template
- CI runs lint, tests, and build on `master` PRs

## Project structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── terms/
│   └── api/
│       ├── repo/
│       ├── stats/
│       └── recent/
├── components/
│   ├── CertificateCard.tsx
│   ├── Leaderboard.tsx
│   ├── SearchForm.tsx
│   └── LoadingState.tsx
└── lib/
    ├── scoring.ts
    ├── rateLimit.ts
    ├── recentStore.ts
    └── types.ts
```

Scoring logic is isolated in `src/lib/scoring.ts` so it is easy to test and iterate.

## Docs

- Release notes: `docs/releases/`
- Screenshots and GIFs: `docs/screenshots/`
- Naming and structure rules: `docs/repository-conventions.md`

Built by [Dot Systems](https://github.com/dotsystemsdevs)
