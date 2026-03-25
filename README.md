# Commitment Issues

Official death certificates for abandoned GitHub repositories.

**Live:** [commitmentissues.dev](https://commitmentissues.dev)

![MIT License](https://img.shields.io/github/license/dotsystemsdevs/commitmentissues?style=flat-square)
![Vercel Deploy](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)

## What is Commitment Issues?

Paste a public GitHub repository URL and get a shareable **Certificate of Death**: a tongue-in-cheek summary of how "dead" the repo looks, with a score, cause of death, last words, and exportable graphics for social posts. No account required.

## Features

- **Certificate of Death** - A4-style layout with cause, last words, repo age, and derived stats
- **Exports** - Multiple aspect ratios (feed, square, story-style) for common social platforms
- **Mobile share** - Native share uses a tall story-friendly format on small screens to reduce bad crops
- **Hall of Shame** - Curated leaderboard of famously abandoned repositories
- **Recently Buried** - Live feed of the latest public burials (repo, cause, score, time)

## How scoring works (high level)

| Step | What happens |
|------|----------------|
| Input | You provide a public repo URL |
| Data | The app reads public metadata from the GitHub API |
| Score | A death score and narrative (cause, last words) are computed in `src/lib/scoring.ts` |
| Output | You get an on-screen certificate and optional image exports |

Hall of Shame entries are curated for recognizable repos and fast first paint; Recently Buried reflects real recent usage.

## Screenshots

Home:

![Homepage screenshot](docs/screenshots/homepage.png)

Certificate:

![Certificate screenshot](docs/screenshots/certificate.png)

About:

![About page screenshot](docs/screenshots/about.png)

## Privacy

- No login required
- Only public GitHub data is used
- Recently Buried stores recent public burial entries (repo, cause, score, timestamp)
- Anonymous aggregate analytics may be used for product metrics

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Fonts | UnifrakturMaguntia, Courier Prime, Inter |
| Hosting | Vercel |
| Storage | Upstash Redis (usage counters and recent burials) |
| Data | GitHub public API |

## Getting started

```bash
git clone https://github.com/dotsystemsdevs/commitmentissues.git
cd commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Optional: add a GitHub token to raise API rate limits.

```env
GITHUB_TOKEN=ghp_yourtoken
```

Create a token under GitHub **Settings -> Developer settings -> Personal access tokens**. Fine-grained tokens work if you limit scope to what this app needs; classic tokens are also fine for local dev.

## Testing

```bash
npm test
```

## Contributing

- Read `.github/CONTRIBUTING.md` before opening a PR
- Use the issue and PR templates
- CI runs lint, tests, and build on pull requests to `master`

## Project structure

```text
src/
+-- app/
¦   +-- page.tsx
¦   +-- about/
¦   +-- terms/
¦   +-- api/
¦       +-- repo/
¦       +-- stats/
¦       +-- recent/
+-- components/
¦   +-- CertificateCard.tsx
¦   +-- Leaderboard.tsx
¦   +-- SearchForm.tsx
¦   +-- LoadingState.tsx
+-- lib/
    +-- scoring.ts
    +-- rateLimit.ts
    +-- recentStore.ts
    +-- types.ts
```

Scoring logic lives in `src/lib/scoring.ts` so it stays easy to test and change.

## Docs

- Release notes: `docs/releases/`
- Screenshots: `docs/screenshots/`
- Repository conventions: `docs/repository-conventions.md`

## License

MIT - see repository license file.

Built by [Dot Systems](https://github.com/dotsystemsdevs).

## Chrome extension (MVP)

A local MV3 extension is included under `extension/`.

### Load unpacked in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the repository folder `extension/`

### Test flow

1. Open a GitHub repo root page such as `https://github.com/vercel/next.js`
2. Verify a tombstone badge appears near the repo header
3. Click the badge to open the full certificate on `commitmentissues.dev`
4. Navigate to another repo without full reload; verify no duplicate badge appears

If the API is rate-limited or unavailable, the badge falls back to `Reaper busy`.
