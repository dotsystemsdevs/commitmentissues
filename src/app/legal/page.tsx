import type { Metadata } from 'next'
import LegalContent from './legalContent'
import { pageMeta } from '@/lib/seo'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = pageMeta({
  title: 'Legal · Commitment Issues',
  description: 'Terms of use and privacy policy for Commitment Issues: no accounts, no logins, only public GitHub data, and privacy-friendly analytics only.',
  path: '/legal',
})

export default function LegalPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Legal', path: '/legal' }]} />
      <LegalContent />
    </>
  )
}

