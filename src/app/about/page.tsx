import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  {
    title: 'What is this?',
    body: "A parody tool. Paste a GitHub URL and get an official-looking death certificate for your abandoned repo. Certificates are not legally valid documents. Do not use at a real funeral.",
  },
  {
    title: 'Is the data real?',
    body: "Yes — we use GitHub's public API: commits, stars, issues, archive status. Causes of death are algorithmic. A scoring model based on inactivity, open issues, and archive status picks the best match.",
  },
  {
    title: 'Private repos?',
    body: "No. We don't break into houses. Public repos only.",
  },
  {
    title: 'What we collect',
    body: "Nothing. No accounts, no emails, no stored URLs. No cookies, no tracking. The repo URL you type never leaves your browser until you hit submit — and we don't store it after.",
  },
  {
    title: 'Acceptable use',
    body: "Personal use, sharing, laughing. Not for harassment, defamation, or anything that would make a real lawyer nervous.",
  },
  {
    title: 'Contact',
    body: '',
    email: 'dot.systems@proton.me',
  },
]

export default function AboutPage() {
  return (
    <SubpageShell
      title="About"
      subtitle="Everything you need to know. It fits on one page."
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
                <a href={`mailto:${email}`} className="subpage-inline-mail">{email}</a>
              ) : null}
            </p>
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
