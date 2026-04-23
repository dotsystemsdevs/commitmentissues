'use client'

import type { ReactNode } from 'react'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-courier), system-ui, sans-serif`
const MONO = `var(--font-courier), system-ui, sans-serif`

function SectionTitle({ children, id }: { children: string; id: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: '90px' }}>
      <p
        style={{
          fontFamily: MONO,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#8a8278',
          margin: '0 0 8px 0',
        }}
      >
        {children}
      </p>
    </div>
  )
}

function Para({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: UI,
        fontSize: 'clamp(14px, 3.8vw, 15px)',
        color: '#4a4440',
        lineHeight: 1.75,
        margin: '0 0 12px 0',
      }}
    >
      {children}
    </p>
  )
}

export default function LegalContent() {
  return (
    <SubpageShell
      title="Legal"
      subtitle={
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#7a7268', letterSpacing: '0.04em' }}>
          Terms of use and privacy policy.
        </span>
      }
      microcopy={null}
      headerExtra={null}
    >
      <div
        className="ux-live-section"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingTop: '6px',
        }}
      >
        <div style={{ padding: '20px 18px', border: '2px solid #1a1a1a', background: '#EDE8E1' }}>
          <SectionTitle id="terms">Terms</SectionTitle>
          <Para>
            Commitment Issues is a parody / entertainment tool. Generated “death certificates” are not legally valid documents.
          </Para>
          <Para>
            The tool analyzes public data from GitHub’s public API (for example repository metadata and activity). “Cause of death”
            labels and text are algorithmic and should not be treated as factual statements about a person or organization.
          </Para>
          <Para>
            By using the service, you acknowledge that we may process the public repo URL or username you submit and display recent
            public “burials” on the homepage (repo name, generated cause, score, and timestamp). We may update these terms from time to
            time; continued use means acceptance.
          </Para>
        </div>

        <div style={{ padding: '20px 18px', border: '2px solid #1a1a1a', background: '#EDE8E1' }}>
          <SectionTitle id="privacy">Privacy</SectionTitle>
          <Para>
            We don’t run accounts, logins, or collect passwords. When you submit a public GitHub URL or username, we use it to fetch
            public repository data from GitHub in order to generate results.
          </Para>
          <Para>
            We store a small “recently buried” list shown on the homepage (public repo name/full name plus generated fields like cause,
            score, and analyzed timestamp). This is not intended to contain private information.
          </Para>
          <Para>
            We also use privacy-friendly analytics to understand overall feature usage (aggregate counts, not personal profiles). You can
            always avoid submitting private or sensitive URLs—this tool is intended for public GitHub data only.
          </Para>
          <Para>
            Questions or requests: <a className="subpage-inline-mail" href="mailto:dot.systems@proton.me">dot.systems@proton.me</a>.
          </Para>
        </div>

      </div>
    </SubpageShell>
  )
}

