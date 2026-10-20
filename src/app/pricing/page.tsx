import type { Metadata } from 'next'
import PricingContent from './PricingContent'
import { pageMeta } from '@/lib/seo'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = pageMeta({
  title: 'Commitment Issues pricing: free GitHub repo certificates',
  description: 'Commitment Issues has no price, no paywall and no premium tier. It is free and open source, so you can generate death certificates for dead repos at no cost.',
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Pricing', path: '/pricing' }]} />
      <PricingContent />
    </>
  )
}
