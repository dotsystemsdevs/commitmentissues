import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  { title: 'What we collect', body: 'Nothing personal. No accounts, no emails, no stored URLs.' },
  { title: 'GitHub API', body: 'Public repo data only. We do not access private repositories.' },
  { title: 'Analytics', body: 'No personal data. We count anonymous events only — how many certificates are generated, downloaded, and shared. No individual is tracked.' },
  { title: 'Cookies', body: 'None. Recently analyzed repos live in your own localStorage — we never see them.' },
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
            <p style={{ fontFamily: UI, fontSize: 'clamp(15px, 4vw, 16px)', fontWeight: 700, color: '#160A06', margin: '0 0 10px 0' }}>
              {title}
            </p>
            <div>
              <p style={{
                fontFamily: UI,
                fontSize: 'clamp(14px, 3.8vw, 15px)',
                color: '#555',
                lineHeight: 1.75,
                margin: 0,
                borderLeft: '2px solid #cfcfcf',
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
