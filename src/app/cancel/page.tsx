import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE } from '@/lib/cta'

export default function CancelPage() {
  return (
    <SubpageShell
      subtitle="Payment cancelled."
      microcopy="No charge was made. The repo remains unprinted — but no less dead."
    >
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <Link href="/" className="subpage-pricing-cta" style={{ maxWidth: 320, margin: '0 auto' }}>
          {CTA_ISSUE}
        </Link>
      </div>
    </SubpageShell>
  )
}
