import type { Metadata } from 'next'
import { Suspense } from 'react'
import PrintContent from './PrintContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Framed prints · Commitment Issues',
  description: 'Order a death certificate for your abandoned repo, printed on archival paper and framed. We are gauging interest before we build it, so tell us if you want one.',
  alternates: { canonical: 'https://commitmentissues.dev/print' },
  openGraph: {
    title: 'Framed prints · Commitment Issues',
    description: 'Order a death certificate for your abandoned repo, printed on archival paper and framed. We are gauging interest before we build it, so tell us if you want one.',
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
