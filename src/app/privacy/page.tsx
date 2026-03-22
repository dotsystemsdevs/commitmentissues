import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE_ARROW } from '@/lib/cta'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  { title: 'What we collect', body: 'Nothing personal. No accounts, no emails, no stored URLs.' },
  { title: 'GitHub API', body: 'Public repo data only. We do not access private repositories.' },
  { title: 'Payments', body: 'Handled by Stripe. We never see your card details.' },
  { title: 'Analytics', body: 'Plausible. No cookies, no personal data, aggregate counts only.' },
  { title: 'Cookies', body: 'None. Recently analyzed repos live in your own localStorage.' },
  { title: 'Contact', body: 'Questions? ', email: 'dot.systems@proton.me' },
]

export default function PrivacyPage() {
  return (
    <SubpageShell
      subtitle="We know nothing. We store nothing. We are ghosts."
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
        <Link href="/terms" className="subpage-bottom-secondary">
          Terms of Service →
        </Link>
      </div>
    </SubpageShell>
  )
}
