import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const FREE_FEATURES = [
  'On-screen death certificate',
  'Shareable image (2x resolution)',
  'Instant result — no login',
]

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Print-quality PNG (3x resolution)',
  'No watermark — frame-worthy',
  'Official cause of death + last words',
]

export default function PricingPage() {
  return (
    <SubpageShell
      subtitle="Death is free. The paperwork costs $4.99."
      microcopy={null}
    >
      {/* Cards */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '28px' }}>

        {/* Free */}
        <div style={{
          flex: '1 1 220px',
          border: '1.5px solid #e0e0e0',
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
        }}>
          <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#938882', margin: '0 0 16px 0', fontWeight: 600 }}>
            Free
          </p>
          <p style={{ fontFamily: UI, fontSize: 'clamp(2rem, 8vw, 2.6rem)', fontWeight: 700, color: '#160A06', lineHeight: 1, margin: '0 0 4px 0' }}>
            $0
          </p>
          <p style={{ fontFamily: UI, fontSize: '13px', color: '#b0aca8', margin: '0 0 24px 0' }}>forever</p>

          <ul style={{ fontFamily: UI, fontSize: '14px', color: '#555', lineHeight: 1, listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '13px', flex: 1 }}>
            {FREE_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#c8c8c8', fontWeight: 700, lineHeight: '1.4', flexShrink: 0 }}>•</span>
                <span style={{ lineHeight: '1.4' }}>{f}</span>
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
            }}
          >
            issue a certificate →
          </Link>
        </div>

        {/* Premium */}
        <div style={{
          flex: '1 1 220px',
          border: '2px solid #0a0a0a',
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '20px',
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: UI,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '0 0 6px 6px',
          }}>
            Recommended
          </div>

          <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a0a0a', margin: '8px 0 16px 0', fontWeight: 600 }}>
            Premium
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
            <p style={{ fontFamily: UI, fontSize: 'clamp(2rem, 8vw, 2.6rem)', fontWeight: 700, color: '#160A06', lineHeight: 1, margin: 0 }}>
              $4.99
            </p>
            <span style={{ fontFamily: UI, fontSize: '13px', color: '#938882' }}>per certificate</span>
          </div>
          <p style={{ fontFamily: UI, fontSize: '13px', color: '#b0aca8', margin: '0 0 24px 0' }}>one-time · no subscription</p>

          <ul style={{ fontFamily: UI, fontSize: '14px', color: '#555', lineHeight: 1, listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '13px', flex: 1 }}>
            {PREMIUM_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#0a0a0a', fontWeight: 700, lineHeight: '1.4', flexShrink: 0 }}>•</span>
                <span style={{ lineHeight: '1.4' }}>{f}</span>
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
              background: '#0a0a0a',
              borderRadius: '8px',
              padding: '14px 16px',
              textAlign: 'center',
              display: 'block',
            }}
          >
            issue a certificate →
          </Link>
        </div>

      </div>

      <p style={{ fontFamily: UI, fontSize: '14px', color: '#938882', textAlign: 'center', margin: '0 0 8px 0' }}>
        Questions? <Link href="/faq" style={{ color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>See FAQ →</Link>
      </p>
    </SubpageShell>
  )
}
