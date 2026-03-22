import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  { title: 'No refunds on digital downloads', body: 'The A4 PDF certificate is a digital product delivered immediately upon payment. Because the product is delivered instantly and cannot be returned, we do not offer refunds.' },
  { title: 'Something went wrong?', body: 'If your download failed or the certificate was generated incorrectly due to a technical error on our end, contact us and we will make it right. ', email: 'dot.systems@proton.me' },
  { title: 'Charged but no download?', body: 'If you were charged but did not receive your download link, contact us immediately with your payment confirmation and we will resolve it.' },
]

export default function RefundPage() {
  return (
    <SubpageShell
      subtitle="Refund policy for paid certificate downloads."
      microcopy="Last updated March 2026"
    >
      {SECTIONS.map(({ title, body, email }, i) => (
        <div
          key={title}
          style={{
            padding: '18px 0',
            borderBottom: i < SECTIONS.length - 1 ? '1px solid #e0e0e0' : 'none',
          }}
        >
          <p style={{ fontFamily: UI, fontSize: 'clamp(15px, 4vw, 16px)', fontWeight: 700, color: '#160A06', marginBottom: '8px' }}>
            {title}
          </p>
          <p style={{ fontFamily: UI, fontSize: 'clamp(14px, 3.8vw, 15px)', color: '#555', lineHeight: 1.75, margin: 0 }}>
            {body}
            {email ? (
              <a href={`mailto:${email}`} className="subpage-inline-mail">
                {email}
              </a>
            ) : null}
          </p>
        </div>
      ))}

      <div className="subpage-bottom-links">
        <Link href="/terms" className="subpage-bottom-secondary">
          Terms of Service →
        </Link>
        <Link href="/privacy" className="subpage-bottom-secondary">
          Privacy Policy →
        </Link>
      </div>
    </SubpageShell>
  )
}
