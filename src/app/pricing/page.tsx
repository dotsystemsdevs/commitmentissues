import type { Metadata } from 'next'
import PricingContent from './PricingContent'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Pricing · Commitment Issues · Death Is Free',
  description: 'Commitment Issues has no price, no paywall and no premium tier. It is free and open source, so you can generate death certificates for dead repos at no cost.',
  alternates: { canonical: 'https://commitmentissues.dev/pricing' },
  openGraph: {
    title: 'Pricing · Commitment Issues · Death Is Free',
    description: 'Commitment Issues has no price, no paywall and no premium tier. It is free and open source, so you can generate death certificates for dead repos at no cost.',
    url: 'https://commitmentissues.dev/pricing',
  },
}

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: 'Pricing', path: '/pricing' }]} />
      <PricingContent />
    </>
  )
}
