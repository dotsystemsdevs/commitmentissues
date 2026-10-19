import type { Metadata } from 'next'
import AboutContent from './AboutContent'
import { pageMeta } from '@/lib/seo'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = pageMeta({
  title: 'About · Commitment Issues · How It Works',
  description: 'How Commitment Issues reads the commit history, activity decay and open issues of a repo to pick a cause of death and make a printable death certificate.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'About', path: '/about' }]} />
      <AboutContent />
    </>
  )
}
