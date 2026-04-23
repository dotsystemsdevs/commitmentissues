import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About — Commitment Issues | How It Works',
  description: 'How Commitment Issues works: we analyze your GitHub repo\'s commit history, activity decay, and open issues to assign a cause of death and generate a printable death certificate.',
  alternates: { canonical: 'https://commitmentissues.dev/about' },
  openGraph: {
    title: 'About — Commitment Issues | How It Works',
    description: 'How Commitment Issues works: we analyze your GitHub repo\'s commit history, activity decay, and open issues to assign a cause of death and generate a printable death certificate.',
    url: 'https://commitmentissues.dev/about',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
