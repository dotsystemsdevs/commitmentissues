import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE } from '@/lib/cta'

const UI = `var(--font-dm), -apple-system, sans-serif`

export default function PricingPage() {
  return (
    <SubpageShell
      subtitle="Death is free. The paperwork costs $4.99."
      microcopy="One price · no subscription · instant download"
    >
      <div className="subpage-pricing-tier subpage-pricing-tier--premium">
        <p style={{ fontFamily: UI, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0a0a0a', marginBottom: '12px' }}>
          Premium
        </p>
        <p style={{ fontFamily: UI, fontSize: 'clamp(1.85rem, 8vw, 2.4rem)', fontWeight: 700, color: '#160A06', marginBottom: '4px' }}>
          $4.99{' '}
          <span style={{ fontSize: '14px', fontWeight: 400, color: '#938882' }}>per certificate</span>
        </p>
        <p style={{ fontFamily: UI, fontSize: '13px', fontStyle: 'italic', color: '#938882', marginBottom: '22px' }}>
          one flat fee — no subscription, no nonsense
        </p>
        <ul style={{ fontFamily: UI, fontSize: 'clamp(14px, 3.8vw, 15px)', color: '#555', lineHeight: 2.1, paddingLeft: '20px', margin: '0 0 24px 0' }}>
          <li>High resolution — print quality</li>
          <li>Clean typography, no watermark</li>
          <li>Frame-worthy</li>
        </ul>
        <Link href="/" className="subpage-pricing-cta">
          {CTA_ISSUE}
        </Link>
      </div>

      <div className="subpage-pricing-tier subpage-pricing-tier--free">
        <p style={{ fontFamily: UI, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#938882', marginBottom: '10px' }}>
          Free
        </p>
        <p style={{ fontFamily: UI, fontSize: 'clamp(1.5rem, 6vw, 1.8rem)', fontWeight: 700, color: '#938882', marginBottom: '14px' }}>
          $0
        </p>
        <ul style={{ fontFamily: UI, fontSize: 'clamp(13px, 3.6vw, 14px)', color: '#888', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
          <li>On-screen certificate</li>
          <li>Share image</li>
          <li>Instant result</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link
          href="/faq"
          style={{
            fontFamily: UI,
            fontSize: '15px',
            fontWeight: 500,
            color: '#0a0a0a',
            textDecoration: 'none',
            display: 'inline-flex',
            minHeight: 48,
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: 8,
          }}
        >
          Questions? See FAQ →
        </Link>
      </div>
    </SubpageShell>
  )
}
