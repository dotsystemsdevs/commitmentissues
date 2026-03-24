import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  { title: 'What this is', body: 'A parody tool. Certificates are not legally valid documents.' },
  { title: 'Use at your own risk', body: 'Data is from GitHub\'s public API. Causes of death are algorithmic. Do not take them seriously.' },
  { title: 'Data use', body: 'By using the service, you acknowledge that we process submitted public repo URLs, publish recent public burials on the homepage, and collect anonymous aggregate analytics needed to operate and improve the product.' },
  { title: 'Acceptable use', body: 'Personal use only. Do not harass, defame, or abuse the API.' },
  { title: 'Changes', body: 'We may update these at any time. Continued use = acceptance.' },
  { title: 'Contact', body: '', email: 'dot.systems@proton.me' },
]

export default function TermsPage() {
  return (
    <SubpageShell
      title="Terms"
      subtitle="The fine print for the final rest. We aren't lawyers, we're undertakers."
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
