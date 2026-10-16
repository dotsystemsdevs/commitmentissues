import type { Metadata } from 'next'
import AboutContent from './AboutContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'About · Commitment Issues · How It Works',
  description: 'How Commitment Issues reads the commit history, activity decay and open issues of a repo to pick a cause of death and make a printable death certificate.',
  alternates: { canonical: 'https://commitmentissues.dev/about' },
  openGraph: {
    title: 'About · Commitment Issues · How It Works',
    description: 'How Commitment Issues reads the commit history, activity decay and open issues of a repo to pick a cause of death and make a printable death certificate.',
    url: 'https://commitmentissues.dev/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'About', path: '/about' }]} />
      <AboutContent />
    </>
  )
}
