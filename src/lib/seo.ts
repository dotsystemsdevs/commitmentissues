import type { Metadata } from 'next'

const BASE = 'https://commitmentissues.dev'
const OG_IMAGE = { url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'Commitment Issues: death certificates for dead GitHub repos' }

/** Full per-page metadata: canonical, Open Graph (with image) and Twitter card. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${BASE}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Commitment Issues',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
  }
}
