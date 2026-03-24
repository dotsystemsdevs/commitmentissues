# commitmentissues.dev ☠️

> Official death certificates for abandoned GitHub repos.

Paste any public GitHub repo URL. Get a beautifully formatted death certificate — cause of death, last words, death index score, and more.

**Live at [commitmentissues.dev](https://commitmentissues.dev)**

---

## How it works

```
User pastes: https://github.com/facebook/react
                        ↓
          Extracts owner + repo name
                        ↓
     Calls GitHub public API (no key required)
       — repo metadata + latest commit —
                        ↓
        Scores the repo: 0–10 death index
                        ↓
          Renders the death certificate
```

No database. No login required for public repos. Just the GitHub API and rule-based logic.

---

## Death Index

| Condition | Points |
|-----------|--------|
| Last commit > 2 years ago | +4 |
| Last commit 1–2 years ago | +2 |
| Repo is archived | +3 |
| 20+ open issues AND inactive 6+ months | +1 |
| 100+ stars but no activity 1+ year | +1 |

**Cause of death** is determined by matching the highest-scoring rule — from `"Officially declared dead by author"` to `"Side project syndrome"`.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Fonts:** Geist (sans) + Geist Mono (mono) via `next/font`
- **Payments:** Stripe (premium features)
- **Deploy:** Vercel

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← main UI: search + certificate
│   ├── certificate/          ← certificate view
│   ├── pricing/              ← premium plans
│   ├── faq/                  ← FAQ page
│   ├── about/                ← about page
│   └── api/
│       ├── repo/             ← proxies GitHub API (avoids CORS)
│       ├── generate-cert/    ← certificate generation
│       ├── stats/            ← usage stats
│       ├── recent/           ← recently analyzed repos
│       └── checkout/         ← Stripe payment flow
├── components/
│   ├── CertificateCard.tsx   ← certificate UI + download + animation
│   ├── Leaderboard.tsx       ← Hall of Shame + Recently Buried
│   ├── SearchForm.tsx        ← URL input
│   ├── LoadingState.tsx      ← skeleton loading
│   └── ErrorDisplay.tsx      ← error states
└── lib/
    ├── scoring.ts            ← all death logic
    └── types.ts              ← TypeScript interfaces
```

---

## Run locally

```bash
git clone https://github.com/dotsystemsdevs/saas-commitmentissues
cd saas-commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Add a `GITHUB_TOKEN` in `.env.local` to raise rate limit from 60 to 5,000 req/hr:

```
GITHUB_TOKEN=your_token_here
```

---

## Features

- Death certificate with cause of death, last words, death index
- Download certificate as PNG
- Share on X with pre-filled text
- Leaderboard — Hall of Shame + Recently Buried (localStorage)
- Entry animation + "CERTIFIED DEAD" stamp
- Premium features via Stripe
- SEO: sitemap, robots, OpenGraph image

---

Built by [Dot Systems](https://github.com/dotsystemsdevs)
