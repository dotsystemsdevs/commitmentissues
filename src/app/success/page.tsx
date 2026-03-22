'use client'

import Link from 'next/link'

const SERIF = `var(--font-dm), -apple-system, sans-serif`

export default function SuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🪦</div>
        <h1 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 700, color: '#160A06', marginBottom: '16px' }}>
          Payment confirmed.
        </h1>
        <p style={{ fontFamily: SERIF, fontSize: '15px', fontStyle: 'italic', color: '#462D21', lineHeight: 1.8, marginBottom: '36px' }}>
          Your A4 death certificate is ready for download. The deceased has been officially processed.
        </p>
        <Link href="/" style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 700, background: '#1a1a1a', color: '#fff', textDecoration: 'none', padding: '14px 28px', display: 'block', marginBottom: '16px', textAlign: 'center', borderRadius: '6px' }}>
          ☠ Kill another repo →
        </Link>
        <Link href="/" style={{ fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: '#938882', textDecoration: 'none' }}>
          back to home
        </Link>
      </div>
    </main>
  )
}
