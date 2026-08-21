import type { Metadata } from 'next'
import { Suspense } from 'react'
import PrintContent from './PrintContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Framed prints · Commitment Issues',
  description: 'A death certificate for your abandoned repo, printed on archival paper and framed. Gauging interest before we build it.',
  alternates: { canonical: 'https://commitmentissues.dev/print' },
  openGraph: {
    title: 'Framed prints · Commitment Issues',
    description: 'A death certificate for your abandoned repo, printed on archival paper and framed.',
    url: 'https://commitmentissues.dev/print',
  },
}

export default function PrintPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Prints', path: '/print' }]} />
      <Suspense fallback={null}>
        <PrintContent />
      </Suspense>
    </>
  )
}
