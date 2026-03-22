import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE_ARROW } from '@/lib/cta'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  { title: 'What this is', body: 'A parody tool. Certificates are not legally valid documents.' },
  { title: 'Use at your own risk', body: 'Data is from GitHub\'s public API. Causes of death are algorithmic. Do not take them seriously.' },
  { title: 'Acceptable use', body: 'Personal use only. Do not harass, defame, or abuse the API.' },
  { title: 'Paid downloads', body: '$4.99 per certificate. Digital product, delivered immediately.' },
  { title: 'Refunds', body: 'Non-refundable. If it broke on our end, contact us: ', email: 'dot.systems@proton.me' },
  { title: 'Changes', body: 'We may update these at any time. Continued use = acceptance.' },
  { title: 'Contact', body: '', email: 'dot.systems@proton.me' },
]

export default function TermsPage() {
  return (
    <SubpageShell
      subtitle="The fine print for the fine dead. Terms and refund policy."
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
        <Link href="/" className="subpage-bottom-primary">
          {CTA_ISSUE_ARROW}
        </Link>
        <Link href="/privacy" className="subpage-bottom-secondary">
          Privacy Policy →
        </Link>
      </div>
    </SubpageShell>
  )
}
