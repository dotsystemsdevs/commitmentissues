import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE } from '@/lib/cta'

export default function SuccessPage() {
  return (
    <SubpageShell
      subtitle="Payment confirmed."
      microcopy="Your A4 death certificate is ready for download. The deceased has been officially processed."
    >
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <Link href="/" className="subpage-pricing-cta" style={{ maxWidth: 320, margin: '0 auto' }}>
          {CTA_ISSUE}
        </Link>
      </div>
    </SubpageShell>
  )
}
