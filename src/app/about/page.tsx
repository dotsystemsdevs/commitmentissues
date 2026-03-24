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
    body: "No accounts and no signup. We process the GitHub URL you submit, store the latest public burials shown on the homepage (repo name, generated cause, score, timestamp), and collect anonymous usage metrics to understand feature usage.",
  },
  {
    title: 'Support the Undertaker ⚰️',
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
      title="The Mortician"
      subtitle="Everything you need to know before the funeral."
      microcopy="Last updated March 2026"
    >
      <div className="about-cards" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SECTIONS.map(({ title, body, email, coffee }) => (
          <div
            key={title}
            style={{
              padding: '20px 18px',
              border: '2px solid #1a1a1a',
              borderRadius: '0',
              background: '#f2f2f2',
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
              <a
                className="coffee-btn"
                href="https://buymeacoffee.com/commitmentissues"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '12px',
                  minHeight: '42px',
                  padding: '0 14px',
                  border: '1px solid #0a0a0a',
                  background: '#f6f6f6',
                  color: '#1f1f1f',
                  textDecoration: 'none',
                  fontFamily: `var(--font-courier), monospace`,
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Keep the server alive →
              </a>
            ) : null}
          </div>
        ))}
      </div>

    </SubpageShell>
  )
}
