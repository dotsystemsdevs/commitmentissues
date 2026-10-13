import type { Metadata } from 'next'
import LegalContent from './legalContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Legal · Commitment Issues',
  description: 'Terms of use and privacy policy for Commitment Issues: no accounts, no logins, only public GitHub data, and privacy-friendly analytics with aggregate counts, not profiles.',
  alternates: { canonical: 'https://commitmentissues.dev/legal' },
  openGraph: {
    title: 'Legal · Commitment Issues',
    description: 'Terms of use and privacy policy for Commitment Issues: no accounts, no logins, only public GitHub data, and privacy-friendly analytics with aggregate counts, not profiles.',
    url: 'https://commitmentissues.dev/legal',
  },
}

export default function LegalPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Legal', path: '/legal' }]} />
      <LegalContent />
    </>
  )
}

