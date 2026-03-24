import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'No accounts. No emails. No names. When you submit a repo URL, we fetch its public GitHub metadata (stars, last commit date, open issues) to generate the certificate. That is all we touch.',
  },
  {
    title: 'What we store',
    body: 'The last 10 repos analyzed are saved to our database to power the "Recently Buried" section on the homepage. We store: the repo name (e.g. owner/repo), the generated cause of death, the death score, and a timestamp. No IP addresses, no user IDs, nothing personal. These entries are visible to everyone who visits the site.',
  },
  {
    title: 'GitHub API',
    body: 'Public repos only. We read metadata that is already public on GitHub. We never request OAuth access and cannot see private repositories.',
  },
  {
    title: 'Analytics',
    body: 'We count anonymous aggregate events — how many certificates are generated, downloaded, and shared. No individual is tracked. No cookies are set for this.',
  },
  {
    title: 'Cookies & localStorage',
    body: 'We set no tracking cookies. Your browser may store the last repo you analyzed in localStorage so the page remembers your session — this never leaves your device.',
  },
  { title: 'Contact', body: 'Questions or removal requests: ', email: 'dot.systems@proton.me' },
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
