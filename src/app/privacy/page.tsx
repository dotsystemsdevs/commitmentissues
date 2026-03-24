import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'No accounts, passwords, or profile setup. When you submit a repo URL, we fetch public GitHub metadata (for example stars, commits, issues, archive status) to generate the certificate.',
  },
  {
    title: 'What we store',
    body: 'To power "Recently Buried", we store up to 10 recent public entries: repo name (owner/repo), generated cause, score, and timestamp. These entries are public on the homepage.',
  },
  {
    title: 'GitHub API',
    body: 'Public repos only. We read metadata that is already public on GitHub. We never request OAuth access and cannot see private repositories.',
  },
  {
    title: 'Analytics',
    body: 'We use privacy-focused analytics (Vercel Analytics and Plausible) for aggregate product metrics such as visits and feature events (e.g. generated, downloaded, shared). We do not use this for advertising profiles.',
  },
  {
    title: 'Cookies & localStorage',
    body: 'We do not set our own marketing cookies. Your browser may store the last analyzed repo in localStorage so your session can be restored. Analytics providers may process technical request metadata to deliver aggregate stats.',
  },
  {
    title: 'Legal basis & consent',
    body: 'We process data to deliver the service you request (certificate generation) and to run the site securely. For aggregate analytics, we rely on legitimate interest where permitted. If we ever enable consent-required tracking in your region, we will add consent controls first.',
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
