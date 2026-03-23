import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI   = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), "Courier New", monospace`

const FREE_FEATURES    = ['Cause of death analysis', 'Full certificate preview', 'Watermarked 960px PNG']
const PREMIUM_FEATURES = ['Watermark-free export', '2480 × 3508px · 300 DPI', 'Print-ready A4 · frame it']

export default function PricingPage() {
  return (
    <SubpageShell
      title="Pricing"
      subtitle="Death is free. The paperwork costs $4.99."
      microcopy={null}
    >
      {/* Cards */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '28px' }}>

        {/* Free */}
        <div className="subpage-pricing-tier--free" style={{
          flex: '1 1 220px',
          border: '1.5px solid #e0e0e0',
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}>
          <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#938882', margin: '0 0 16px 0', fontWeight: 600 }}>
            Free
          </p>
          <p style={{ fontFamily: UI, fontSize: 'clamp(2rem, 8vw, 2.4rem)', fontWeight: 600, color: '#160A06', lineHeight: 1, margin: '0 0 24px 0' }}>
            $0
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FREE_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#C4A882', flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: UI, fontSize: '13px', color: '#6b6560', lineHeight: 1.5 }}>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            style={{
              fontFamily: UI,
              fontSize: '14px',
              fontWeight: 600,
              color: '#0a0a0a',
              textDecoration: 'none',
              border: '1.5px solid #0a0a0a',
              borderRadius: '8px',
              padding: '14px 16px',
              textAlign: 'center',
              display: 'block',
              transition: 'background 0.15s',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            try it free →
          </Link>
        </div>

        {/* Premium */}
        <div className="subpage-pricing-tier--premium" style={{
          flex: '1 1 220px',
          border: '2px solid #8b0000',
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          background: '#FAF3E8',
          position: 'relative',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}>
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '20px',
            background: '#8b0000',
            color: '#fff',
            fontFamily: MONO,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '0 0 6px 6px',
          }}>
            Recommended
          </div>

          <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b0000', margin: '8px 0 16px 0', fontWeight: 600 }}>
            Premium
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
            <p style={{ fontFamily: UI, fontSize: 'clamp(2rem, 8vw, 2.4rem)', fontWeight: 700, color: '#160A06', lineHeight: 1, margin: 0 }}>
              $4.99
            </p>
            <span style={{ fontFamily: UI, fontSize: '12px', color: '#938882' }}>one-time · incl. VAT</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PREMIUM_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#8b0000', flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: UI, fontSize: '13px', color: '#4a3a30', lineHeight: 1.5 }}>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            style={{
              fontFamily: UI,
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              background: '#8b0000',
              borderRadius: '8px',
              padding: '14px 16px',
              textAlign: 'center',
              display: 'block',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            get the certificate →
          </Link>
        </div>

      </div>

      <p style={{ fontFamily: UI, fontSize: '13px', color: '#b0aca8', marginTop: '8px', marginBottom: 0, textAlign: 'center' }}>
        Questions? <Link href="/faq" style={{ color: '#938882', textDecoration: 'underline', textUnderlineOffset: '3px' }}>See FAQ →</Link>
      </p>
    </SubpageShell>
  )
}
