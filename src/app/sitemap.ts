import { MetadataRoute } from 'next'

const BASE_URL = 'https://commitmentissues.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE_URL,             lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/legal`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
