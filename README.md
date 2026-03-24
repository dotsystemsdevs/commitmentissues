# ☠️ commitmentissues.dev

<p align="center">
  <strong>Official death certificates for abandoned GitHub repos.</strong><br/>
  Paste a URL. Find out how dead it is.
</p>

<p align="center">
  <a href="https://commitmentissues.dev"><img src="https://img.shields.io/badge/live-commitmentissues.dev-black?style=flat-square" /></a>
  <img src="https://img.shields.io/github/license/dotsystemsdevs/saas-commitmentissues?style=flat-square" />
  <img src="https://img.shields.io/badge/built%20with-Next.js%2014-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel" />
</p>

---

## What it does

You paste a GitHub repo URL. We run it through our **death index scoring algorithm** and generate an official, downloadable death certificate — complete with cause of death, last words, and a score from 0 to 10.

```
https://github.com/facebook/react
              ↓
  Fetches repo metadata + latest commit
  via GitHub public API (no key needed)
              ↓
  Calculates death index (0–10)
              ↓
  ☠️ Certificate of Death
```

---

## Death Index

| Condition | Points |
|-----------|--------|
| Last commit > 2 years ago | +4 |
| Last commit 1–2 years ago | +2 |
| Repo is `archived: true` | +3 |
| 20+ open issues AND inactive 6+ months | +1 |
| 100+ stars but no activity for 1+ year | +1 |

**Maximum: 10.** 0 = alive. 10 = fossil.

**Cause of death** is rule-based — the highest-scoring match wins:

| Condition | Cause of Death |
|-----------|---------------|
| `archived = true` | "Officially declared dead by author" |
| Last commit: "fix typo" or "update readme" | "Died whispering: one last fix" |
| Only 1–3 commits total | "Died after 3 commits and a burst of motivation" |
| 200+ stars but inactive | "Started strong. Never finished." |
| No description | "No README. No hope." |
| Default | "Side project syndrome" |

---

## Features

Death certificate with cause, last words, age, mourners, language; CERTIFIED DEAD stamp animation; download as PNG; share on X; leaderboard with Hall of Shame + Recently Buried; premium features via Stripe.

---

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Fonts | Geist Sans + Geist Mono |
| Payments | Stripe |
| Deploy | Vercel |
| Data | GitHub Public API (no key required) |

---

## Run locally

```bash
git clone https://github.com/dotsystemsdevs/saas-commitmentissues
cd saas-commitmentissues
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Optional: add `GITHUB_TOKEN` to `.env.local` to raise rate limit from 60 → 5,000 req/hr.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 ← search + certificate UI
│   ├── certificate/             ← certificate view
│   ├── pricing/                 ← plans
│   ├── faq/                     ← FAQ
│   └── api/
│       ├── repo/                ← GitHub API proxy (CORS)
│       ├── generate-cert/       ← certificate logic
│       ├── stats/               ← usage stats
│       └── checkout/            ← Stripe
├── components/
│   ├── CertificateCard.tsx      ← certificate UI + animation + download
│   ├── Leaderboard.tsx          ← Hall of Shame + Recently Buried
│   └── SearchForm.tsx           ← URL input
└── lib/
    ├── scoring.ts               ← all death logic, no side effects
    └── types.ts                 ← TypeScript interfaces
```

---

Built by [Dot Systems](https://github.com/dotsystemsdevs)
