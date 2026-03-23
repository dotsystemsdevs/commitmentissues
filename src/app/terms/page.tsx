import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

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
