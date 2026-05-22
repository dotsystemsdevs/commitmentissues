import type { Metadata } from 'next'
import PricingContent from './PricingContent'

export const metadata: Metadata = {
  title: 'Pricing · Commitment Issues · Death Is Free',
  description: 'No price. No paywall. No premium tier. Commitment Issues is free and open source forever. Death does not charge admission.',
  alternates: { canonical: 'https://commitmentissues.dev/pricing' },
  openGraph: {
    title: 'Pricing · Commitment Issues · Death Is Free',
    description: 'No price. No paywall. No premium tier. Commitment Issues is free and open source forever.',
    url: 'https://commitmentissues.dev/pricing',
  },
}

export default function PricingPage() {
  return <PricingContent />
}
