import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI   = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), "Courier New", monospace`

const SECTIONS = [
  { title: 'What we collect', body: 'Nothing personal. No accounts, no emails, no stored URLs.' },
  { title: 'GitHub API', body: 'Public repo data only. We do not access private repositories.' },
  { title: 'Payments', body: 'Handled by Stripe. We never see your card details.' },
  { title: 'Analytics', body: 'None. We do not track individual users.' },
  { title: 'Cookies', body: 'None. Recently analyzed repos live in your own localStorage.' },
  { title: 'Contact', body: 'Questions? ', email: 'dot.systems@proton.me' },
]

export default function PrivacyPage() {
  return (
    <SubpageShell
      title="Privacy"
      subtitle="We don't want your data. We only want your abandoned repos. No accounts, no tracking, no ghosts in the machine."
      microcopy="Last updated March 2026"
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {SECTIONS.map(({ title, body, email }, i) => (
          <div
            key={title}
            className="faq-row"
            style={{
              padding: '22px 0',
              borderBottom: i < SECTIONS.length - 1 ? '1px solid #e8e4de' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
              <span style={{
                fontFamily: MONO,
                fontSize: '10px',
                color: '#C4A882',
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontFamily: UI, fontSize: 'clamp(15px, 4vw, 16px)', fontWeight: 700, color: '#160A06', margin: 0 }}>
                {title}
              </p>
            </div>
            <div style={{ paddingLeft: '24px' }}>
              <p style={{
                fontFamily: UI,
                fontSize: 'clamp(14px, 3.8vw, 15px)',
                color: '#6b6560',
                lineHeight: 1.75,
                margin: 0,
                borderLeft: '2px solid #EDE5D8',
                paddingLeft: '14px',
              }}>
                {body}
                {email ? (
                  <a href={`mailto:${email}`} className="subpage-inline-mail">
                    {email}
                  </a>
                ) : null}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '36px', paddingBottom: '8px', textAlign: 'center' }}>
        <Link href="/" className="subpage-faq-cta">
          issue a certificate →
        </Link>
      </div>
    </SubpageShell>
  )
}
