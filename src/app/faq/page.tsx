import Link from 'next/link'

const UI = `var(--font-dm), -apple-system, sans-serif`

const FAQS = [
  { q: 'Is the data real?', a: 'Yes — we use GitHub\'s public API: commits, stars, issues, archive status.' },
  { q: 'How is the cause of death determined?', a: 'A scoring model based on inactivity, open issues, and archive status. Highest match wins.' },
  { q: 'Can I analyze private repos?', a: 'No — public repos only. No login required.' },
  { q: 'How do I share the certificate?', a: 'Generate → click Share → instant image. One click.' },
  { q: 'What does the $4.99 get me?', a: 'A high-res, print-ready PNG. Clean typography, no watermark. Frame-worthy.' },
  { q: 'Is this serious?', a: 'Not really. That\'s the point.' },
]

export default function FaqPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: '620px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: '44px', paddingBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>🪦</div>
            <h1 style={{ fontFamily: 'var(--font-gothic), serif', fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', color: '#160A06', lineHeight: 0.95, marginBottom: '16px' }}>
              Certificate of Death
            </h1>
          </Link>
          <p style={{ fontFamily: UI, fontSize: '15px', color: '#938882', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: '420px' }}>
            Official death certificates for abandoned GitHub repos.<br />
            Data is real. The certificates are not.
          </p>

          {/* CTA above fold */}
          <Link href="/" style={{ display: 'inline-block', fontFamily: UI, fontSize: '14px', fontWeight: 700, background: '#1a1a1a', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '6px', letterSpacing: '0.02em' }}>
            ☠ Declare a repo dead
          </Link>
        </div>

        {/* FAQ */}
        <div style={{ borderTop: '1px solid #c8c8c8', paddingTop: '40px', paddingBottom: '48px' }}>
          <style>{`
            details summary { cursor: pointer; list-style: none; }
            details summary::-webkit-details-marker { display: none; }
            details[open] summary::after { content: '−'; }
            details summary::after { content: '+'; float: right; color: #8b0000; font-size: 18px; line-height: 1; }
            details[open] > div { animation: fadein 0.15s ease; }
            @keyframes fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>

          {FAQS.map(({ q, a }, i) => (
            <details key={q} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <summary style={{ fontFamily: UI, fontSize: '15px', fontWeight: 700, color: '#160A06', padding: '18px 0' }}>
                {q}
              </summary>
              <div style={{ fontFamily: UI, fontSize: '14px', color: '#555', lineHeight: 1.7, paddingBottom: '18px' }}>
                {a}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', paddingBottom: '64px' }}>
          <Link href="/" style={{ fontFamily: UI, fontSize: '14px', fontWeight: 700, color: '#8b0000', textDecoration: 'none' }}>
            ☠ Declare a repo dead →
          </Link>
        </div>

      </div>
    </main>
  )
}
