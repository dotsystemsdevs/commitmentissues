import type { Metadata } from 'next'
import UserPageContent from './UserPageContent'

const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

function sanitizeUsername(raw: string): string {
  const trimmed = raw.slice(0, 39)
  return VALID_USERNAME.test(trimmed) ? trimmed : ''
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params
  const safe = sanitizeUsername(username)

  if (!safe) {
    return {
      title: 'Graveyard · Commitment Issues',
      description: 'Browse the GitHub graveyard for any developer on Commitment Issues.',
      robots: { index: false, follow: true },
    }
  }

  const title = `@${safe}'s GitHub Graveyard · Commitment Issues`
  const description = `See how many of @${safe}'s GitHub repositories are alive, on life support, or deceased. Free abandonment analysis with death certificates for any developer's projects.`
  const canonical = `https://commitmentissues.dev/user/${safe}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'profile',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export default function UserPage() {
  return <UserPageContent />
}
