import { MetadataRoute } from 'next'

const BASE_URL = 'https://commitmentissues.dev'

// Sample user-graveyard URLs to expose the dynamic /user/[name] route shape
// to crawlers. These pages have their own metadata (per-user title/description).
const SAMPLE_USERS = [
  'dotsystemsdevs',
  'atom',
  'angular',
  'apache',
  'facebookarchive',
  'YahooArchive',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE_URL,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/faq`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/legal`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    ...SAMPLE_USERS.map((u) => ({
      url: `${BASE_URL}/user/${u}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]
}
