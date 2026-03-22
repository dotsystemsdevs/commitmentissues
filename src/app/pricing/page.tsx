'use client'

import Link from 'next/link'

const UI = `var(--font-dm), -apple-system, sans-serif`

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: '620px' }}>

        <div style={{ textAlign: 'center', paddingTop: '44px', paddingBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>🪦</div>
            <h1 style={{ fontFamily: 'var(--font-gothic), serif', fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', color: '#160A06', lineHeight: 0.95, marginBottom: '16px' }}>
              Certificate of Death
            </h1>
          </Link>
          <p style={{ fontFamily: UI, fontSize: '15px', color: '#938882', lineHeight: 1.6, margin: '0 auto', maxWidth: '420px' }}>
            Death is free. The paperwork costs $4.99.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #c8c8c8', paddingTop: '40px', paddingBottom: '64px' }}>

          {/* Premium — dominant */}
          <div style={{ border: '2px solid #160A06', borderRadius: '8px', padding: '32px', marginBottom: '12px', background: '#fff' }}>
            <p style={{ fontFamily: UI, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b0000', marginBottom: '12px' }}>Premium</p>
            <p style={{ fontFamily: UI, fontSize: '2.4rem', fontWeight: 700, color: '#160A06', marginBottom: '4px' }}>$4.99 <span style={{ fontSize: '14px', fontWeight: 400, color: '#938882' }}>per certificate</span></p>
            <p style={{ fontFamily: UI, fontSize: '13px', fontStyle: 'italic', color: '#938882', marginBottom: '24px' }}>one flat fee — no subscription, no nonsense</p>
            <ul style={{ fontFamily: UI, fontSize: '14px', color: '#555', lineHeight: 2.2, paddingLeft: '20px', margin: '0 0 28px 0' }}>
              <li>High resolution — print quality</li>
              <li>Clean typography, no watermark</li>
              <li>Frame-worthy</li>
            </ul>
            <Link href="/" style={{ display: 'block', fontFamily: UI, fontSize: '15px', fontWeight: 700, background: '#1a1a1a', color: '#fff', textDecoration: 'none', padding: '16px', borderRadius: '6px', textAlign: 'center', letterSpacing: '0.02em' }}>
              ☠ Generate certificate
            </Link>
          </div>

          {/* Free — secondary */}
          <div style={{ border: '1.5px solid #c8c8c8', borderRadius: '8px', padding: '24px', marginBottom: '40px' }}>
            <p style={{ fontFamily: UI, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#938882', marginBottom: '10px' }}>Free</p>
            <p style={{ fontFamily: UI, fontSize: '1.8rem', fontWeight: 700, color: '#938882', marginBottom: '16px' }}>$0</p>
            <ul style={{ fontFamily: UI, fontSize: '13px', color: '#888', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
              <li>Generate certificate</li>
              <li>Share image</li>
              <li>Instant result</li>
            </ul>
          </div>

          <Link href="/faq" style={{ fontFamily: UI, fontSize: '13px', fontStyle: 'italic', color: '#8b0000', textDecoration: 'none' }}>
            Questions? See FAQ →
          </Link>
        </div>
      </div>
    </main>
  )
}
