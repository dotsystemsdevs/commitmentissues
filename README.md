# ☠️ commitmentissues.dev

<p align="center">
  <strong>Official death certificates for abandoned GitHub repos.</strong><br/>
  Drop a URL. Find out how dead it is.
</p>

<p align="center">
  <a href="https://commitmentissues.dev"><img src="https://img.shields.io/badge/live-commitmentissues.dev-black?style=flat-square" /></a>
  <img src="https://img.shields.io/github/license/dotsystemsdevs/saas-commitmentissues?style=flat-square" />
  <img src="https://img.shields.io/badge/built%20with-Next.js%2014-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel" />
</p>

## What it does

Paste a GitHub repo URL. The app fetches commit history, archive status, and issue count from the public GitHub API — then generates a downloadable **Certificate of Death** complete with cause of death, last words, and time of death.

No account required. No data stored.

## Features

- A4 death certificate with cause of death, last words, age, and repo stats
- Download as PNG — share-ready or print-quality
- Share on X with pre-filled text
- Hall of Shame leaderboard of 30 famously dead repos

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
git clone https://github.com/dotsystemsdevs/saas-commitmentissues
cd saas-commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Optional:** add a `GITHUB_TOKEN` to `.env.local` to raise the rate limit from 60 → 5,000 req/hr.

```env
GITHUB_TOKEN=ghp_yourtoken
```

## Project structure

```
src/
├── app/
│   ├── page.tsx              ← main UI (search + certificate)
│   ├── about/                ← about / FAQ / privacy info
│   ├── terms/                ← terms of service
│   ├── privacy/              ← privacy policy
│   └── api/
│       ├── repo/             ← GitHub API proxy + death scoring
│       ├── stats/            ← usage counters
│       └── recent/           ← recently analyzed repos
├── components/
│   ├── CertificateCard.tsx   ← certificate UI + export + share
│   ├── CertificateSheet.tsx  ← printable A4 certificate (480×679px)
│   ├── Leaderboard.tsx       ← Hall of Shame marquee
│   ├── SearchForm.tsx        ← URL input + example chips
│   └── LoadingState.tsx      ← loading animation
└── lib/
    ├── scoring.ts            ← death index logic, no side effects
    ├── rateLimit.ts          ← per-IP rate limiting
    └── types.ts              ← TypeScript interfaces
```

Built by [Dot Systems](https://github.com/dotsystemsdevs)
