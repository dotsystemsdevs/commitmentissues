import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

const SECTIONS = [
  {
    title: 'What is this?',
    body: "A parody tool for dead repos. Paste a GitHub URL and get an official-looking death certificate for your abandoned side project.",
  },
  {
    title: 'Is the data real?',
    body: "Yes. We use GitHub's public API (commits, stars, issues, archive status). Cause of death is generated from those signals.",
  },
  {
    title: 'Private repos?',
    body: "No. We don't break into houses. Public repos only.",
  },
  {
    title: 'What we collect',
    body: "No accounts, no emails, no tracking cookies. We only process the URL you submit to generate the certificate, then move on.",
  },
  {
    title: 'Support the Undertaker ☕',
    body: "This site runs on a cheap server and a questionable amount of free time. If it made you laugh, a coffee keeps the lights on.",
    coffee: true,
  },
  {
    title: 'Contact',
    body: 'Questions, bugs, or legal threats:',
    email: 'dot.systems@proton.me',
  },
]

export default function AboutPage() {
  return (
    <SubpageShell
      title="About"
      subtitle="Everything you need to know before the funeral."
      microcopy="Last updated March 2026"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SECTIONS.map(({ title, body, email, coffee }, i) => (
          <div
            key={title}
            style={{
              padding: '18px 16px',
              border: '1px solid #c9c9c9',
              borderRadius: '0',
              background: '#f3f3f3',
              boxShadow: i === 0 ? '0 1px 6px rgba(0,0,0,0.04)' : 'none',
            }}
          >
            <p style={{ fontFamily: UI, fontSize: 'clamp(16px, 4.2vw, 17px)', fontWeight: 700, color: '#160A06', margin: '0 0 10px 0' }}>
              {title}
            </p>
            <p style={{
              fontFamily: UI,
              fontSize: 'clamp(15px, 4vw, 16px)',
              color: '#555',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {body}
              {email ? (
                <a href={`mailto:${email}`} className="subpage-inline-mail">{email}</a>
              ) : null}
            </p>
            {coffee ? (
              <a href="https://buymeacoffee.com/commitmentissues" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '12px', fontFamily: `var(--font-courier), monospace`, fontSize: '12px', color: '#555', textDecoration: 'none', letterSpacing: '0.04em' }}>
                Keep the server alive →
              </a>
            ) : null}
          </div>
        ))}
      </div>

    </SubpageShell>
  )
}
