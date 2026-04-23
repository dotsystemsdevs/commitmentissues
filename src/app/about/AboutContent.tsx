'use client'

import SubpageShell from '@/components/SubpageShell'

const SECTIONS = [
  {
    id: 'about-the-service',
    heading: 'About the Service',
    body: "A parody examination tool for abandoned GitHub repositories. Submit a URL and receive an official-looking certificate of death, complete with cause, date, and last recorded words.",
  },
  {
    id: 'method-of-examination',
    heading: 'Method of Examination',
    body: "We query the GitHub public API — commit history, star count, open issues, archive status — and run a severity assessment. The cause of death is algorithmic, not editorial. The results are accurate. The framing is not.",
  },
  {
    id: 'records-we-keep',
    heading: 'Records We Keep',
    body: "No accounts. No signups. We log the most recent burials (repo name, generated cause, score, timestamp) to populate the public record on the homepage. Anonymous usage metrics only.",
  },
  {
    id: 'restricted-access',
    heading: 'Restricted Access',
    body: "Public repositories only. We do not access private code, credentials, or any data not already available through GitHub's public API.",
  },
  {
    id: 'support-the-undertaker',
    heading: 'Support the Undertaker',
    body: "This service runs on a cheap server and a questionable amount of free time. If it made you laugh, a coffee keeps the lights on.",
    coffee: true,
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: 'For anything that could not wait: ',
    email: 'dot.systems@proton.me',
  },
]

export default function AboutContent() {
  return (
    <SubpageShell
      title="The Undertaker's Office"
      subtitle={
        <span style={{
          fontFamily: `var(--font-courier), system-ui, sans-serif`,
          fontSize: '12px',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}>
          Everything you need to know before the burial.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map(({ id, heading, body, email, coffee }) => (
          <div
            key={id}
            className="record-card"
            style={{ border: '2px solid var(--c-border)' }}
          >
            <p className="record-label">{heading}</p>
            <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
              {body}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="subpage-inline-mail"
                  style={{ fontFamily: `var(--font-courier), system-ui, sans-serif` }}
                >
                  {email}
                </a>
              )}
            </p>
            {coffee && (
              <a
                href="https://buymeacoffee.com/commitmentissues"
                target="_blank"
                rel="noopener noreferrer"
                className="subpage-faq-cta"
                style={{ marginTop: '14px', display: 'inline-flex' }}
              >
                ☕ don&apos;t let us die
              </a>
            )}
          </div>
        ))}
      </div>
    </SubpageShell>
  )
}
