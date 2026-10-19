import type { Metadata } from 'next'
import { Suspense } from 'react'
import PrintContent from './PrintContent'
import PageHero from '@/components/PageHero'
import { pageMeta } from '@/lib/seo'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = pageMeta({
  title: 'Framed prints · Commitment Issues',
  description: 'Order a death certificate for your abandoned repo, printed on archival paper and framed. We are gauging interest before we build it, so tell us if you want one.',
  path: '/print',
})

export default function PrintPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Prints', path: '/print' }]} />
      <Suspense fallback={<main className="page-shell-main"><div className="page-shell-inner"><PageHero title="Framed prints" subtitle={null} microcopy={null} hideEmoji /></div></main>}>
        <PrintContent />
      </Suspense>
    </>
  )
}
