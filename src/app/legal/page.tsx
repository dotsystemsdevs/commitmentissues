import type { Metadata } from 'next'
import LegalContent from './legalContent'

export const metadata: Metadata = {
  title: 'Legal — Commitment Issues',
  description: 'Terms of use and privacy policy for Commitment Issues.',
  alternates: { canonical: 'https://commitmentissues.dev/legal' },
  openGraph: {
    title: 'Legal — Commitment Issues',
    description: 'Terms of use and privacy policy for Commitment Issues.',
    url: 'https://commitmentissues.dev/legal',
  },
}

export default function LegalPage() {
  return <LegalContent />
}

