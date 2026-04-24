'use client'

import type { ReactNode } from 'react'
import SubpageShell from '@/components/SubpageShell'

const MONO = `var(--font-courier), system-ui, sans-serif`

type Section = {
  id: string
  heading: string
  body: ReactNode
}

const SECTIONS: Section[] = [
  {
    id: 'terms',
    heading: 'Terms of Use',
    body: 'Commitment Issues is a parody / entertainment tool. Generated "death certificates" are not legally valid documents. "Cause of death" labels are algorithmic and should not be treated as factual statements about a person or organization. By using the service you acknowledge we may display your submitted repo name publicly. Terms may update; continued use means acceptance.',
  },
  {
    id: 'data-sources',
    heading: 'Data Sources',
    body: "The tool analyzes public data from GitHub's public API — repository metadata, commit activity, archive status, open issues. We do not access private code, credentials, or anything not already publicly available on GitHub.",
  },
  {
    id: 'privacy',
    heading: 'Privacy',
    body: "No accounts. No logins. No passwords collected. When you submit a public GitHub URL or username we use it to fetch public data from GitHub. We store a small recently-buried list on the homepage (repo name, generated cause, score, analyzed timestamp). Nothing sensitive.",
  },
  {
    id: 'analytics',
    heading: 'Analytics',
    body: 'Privacy-friendly analytics only — aggregate counts, not personal profiles. You can avoid submitting private or sensitive URLs; this tool is intended for public GitHub data only.',
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: 'For questions or requests: ',
    email: 'dot.systems@proton.me',
  } as Section & { email: string },
]

export default function LegalContent() {
  return (
    <SubpageShell
      title="Legal"
      subtitle={
        <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-muted)', letterSpacing: '0.04em' }}>
          Terms of use and privacy policy.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map((section) => {
          const email = (section as Section & { email?: string }).email
          return (
            <div
              key={section.id}
              id={section.id}
              className="record-card"
              style={{ border: '2px solid var(--c-border)' }}
            >
              <p className="record-label">{section.heading}</p>
              <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
                {section.body}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="subpage-inline-mail"
                    style={{ fontFamily: MONO }}
                  >
                    {email}
                  </a>
                )}
              </p>
            </div>
          )
        })}
      </div>
    </SubpageShell>
  )
}
