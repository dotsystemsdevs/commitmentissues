import { MetadataRoute } from 'next'

const BASE_URL = 'https://commitmentissues.dev'

// User-graveyard URLs to expose the dynamic /user/[name] route shape to
// crawlers. These pages have their own metadata (per-user title/description).
// Mix of (a) developers whose READMEs already embed our badge — Google
// notices the cross-link — and (b) well-known orgs whose archive status
// makes their graveyard page interesting on its own.
const SAMPLE_USERS = [
  // Our own org
  'dotsystemsdevs',
  // Confirmed badge embedders (verified via gh code search 2026-05-22)
  'JohanSanSebastian',
  'adiz777',
  'lord-vinayak',
  'jaritrix02',
  // Curated-list maintainers who already link to us
  'pegaltier',
  'YamilAyma',
  'Diego2005z',
  // Famous casualty orgs (from Hall of Shame)
  'atom',
  'angular',
  'apache',
  'facebookarchive',
  'YahooArchive',
  'gulpjs',
  'gruntjs',
  'bower',
  'mootools',
  'knockout',
  'jashkenas',
  'ariya',
  'meteor',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE_URL,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/faq`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/print`,   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/legal`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    ...SAMPLE_USERS.map((u) => ({
      url: `${BASE_URL}/user/${u}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]
}
