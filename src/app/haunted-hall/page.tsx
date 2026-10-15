import type { Metadata } from 'next'
import HauntedHallContent from './HauntedHallContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'The 2026 Haunted Hall · Commitment Issues',
  description: 'The real GitHub repos that got archived or abandoned in 2026 — verified via the GitHub API, with cause of death and a certificate for each.',
  alternates: { canonical: 'https://commitmentissues.dev/haunted-hall' },
  openGraph: {
    title: 'The 2026 Haunted Hall · Commitment Issues',
    description: 'The real GitHub repos that got archived or abandoned in 2026, verified via the GitHub API.',
    url: 'https://commitmentissues.dev/haunted-hall',
  },
}

export default function HauntedHallPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Haunted Hall', path: '/haunted-hall' }]} />
      <HauntedHallContent />
    </>
  )
}
