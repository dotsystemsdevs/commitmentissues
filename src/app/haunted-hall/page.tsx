import type { Metadata } from 'next'
import HauntedHallContent from './HauntedHallContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'The 2026 Haunted Hall · Commitment Issues',
  description: 'The real GitHub repos that were archived or abandoned in 2026, checked against the GitHub API, each with a cause of death and its own death certificate.',
  alternates: { canonical: 'https://commitmentissues.dev/haunted-hall' },
  openGraph: {
    title: 'The 2026 Haunted Hall · Commitment Issues',
    description: 'The real GitHub repos that were archived or abandoned in 2026, checked against the GitHub API, each with a cause of death and its own death certificate.',
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
