import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://commitmentissues.dev', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://commitmentissues.dev/faq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://commitmentissues.dev/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://commitmentissues.dev/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://commitmentissues.dev/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
