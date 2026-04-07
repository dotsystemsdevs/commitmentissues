[![Dead](https://commitmentissues.dev/api/badge/blueminder/flycast-netplay-savestates)](https://commitmentissues.dev/?repo=blueminder%2Fflycast-netplay-savestates)

# Commitment Issues

Your abandoned repos deserve a proper funeral.

**Live:** [commitmentissues.dev](https://commitmentissues.dev)

![MIT License](https://img.shields.io/github/license/dotsystemsdevs/commitmentissues?style=flat-square)
![Vercel Deploy](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)

Paste a public GitHub URL. Get a shareable **Certificate of Death** — cause of death, last words, repo age, exportable graphics. No account required.

## Screenshots

Home:

![Homepage screenshot](docs/screenshots/homepage.png)

Certificate:

![Certificate screenshot](docs/screenshots/certificate.png)

About:

![About page screenshot](docs/screenshots/about.png)

## Features

- **Certificate of Death** — A4-style layout with cause, last words, repo age, and derived stats
- **Exports** — Multiple aspect ratios (feed, square, story-style) for Instagram, X, Facebook
- **Mobile share** — Native share sheet on mobile with story-friendly format
- **Hall of Shame** — Curated leaderboard of famously abandoned repos
- **Recently Buried** — Live feed of the latest public burials
- **Chrome extension** — Tombstone badge injected on any GitHub repo page (MVP)

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Fonts | UnifrakturMaguntia, Courier Prime, Inter |
| Hosting | Vercel |
| Storage | Upstash Redis (counters + recent burials) |
| Data | GitHub public API |

## Getting started

Prerequisites: Node 18+

```bash
git clone https://github.com/dotsystemsdevs/commitmentissues.git
cd commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Add a GitHub token to raise API rate limits (optional but recommended):

```env
GITHUB_TOKEN=ghp_yourtoken
```

Generate one at **GitHub → Settings → Developer settings → Personal access tokens**. Fine-grained or classic tokens both work.

> **Note:** The Recently Buried feed requires Upstash Redis (`KV_REST_API_URL` + `KV_REST_API_TOKEN`). Without it, the feed is hidden and the buried counter falls back to the historical baseline.

## How we pronounce repos dead

| Step | What happens |
|------|----------------|
| Input | You submit a public GitHub URL |
| Data | The app fetches public metadata via the GitHub API |
| Score | A death index and narrative are computed in `src/lib/scoring.ts` |
| Output | Certificate rendered on-screen, exportable as PNG |

Hall of Shame entries are hand-curated; Recently Buried reflects real usage.

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
├── app/
│   ├── page.tsx
│   ├── about/
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
extension/          ← Chrome extension (MV3, load unpacked)
```

## Chrome extension (MVP)

A MV3 extension lives under `extension/`. It injects a tombstone badge on GitHub repo pages and links to the full certificate.

### Load unpacked in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension/` subfolder

### Test flow

1. Open a GitHub repo page (e.g. `https://github.com/vercel/next.js`)
2. Verify a tombstone badge appears near the repo header
3. Click the badge to open the full certificate on `commitmentissues.dev`
4. Navigate to another repo without a full reload; verify no duplicate badge appears

If the API is rate-limited or unavailable, the badge falls back to `Reaper busy`.

## Docs

- Release notes: `docs/releases/`
- Screenshots: `docs/screenshots/`
- Repository conventions: `docs/repository-conventions.md`

## License

MIT — see repository license file.

Built by [Dot Systems](https://github.com/dotsystemsdevs).
