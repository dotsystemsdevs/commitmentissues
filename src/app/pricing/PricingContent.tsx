'use client'

import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const SECTIONS = [
  {
    id: 'no-tiers',
    heading: 'No Tiers, No Trials, No Tricks',
    body: 'There is no Basic. There is no Pro. There is no Enterprise. Every funeral receives the same rites, the same paperwork, the same dignified treatment.',
  },
  {
    id: 'no-accounts',
    heading: 'No Account Required',
    body: 'You will not be asked for an email. You will not be asked to subscribe. The deceased never asked for credentials, and neither do we.',
  },
  {
    id: 'no-ads',
    heading: 'No Advertisements',
    body: 'No banners. No popups. No "sponsored by". The morgue is not a marketplace.',
  },
  {
    id: 'open-source',
    heading: 'Open Source Forever',
    body: 'The code is on GitHub under MIT license. Fork it. Self-host it. Improve it. The undertaker has no secrets.',
    github: true,
  },
  {
    id: 'how-we-survive',
    heading: 'How We Stay Alive',
    body: 'Commitment Issues is built and maintained by Dot Systems — an indie studio that funds this work from other projects. If you want to support it, fork it, share it, or open a pull request with new famous casualties.',
  },
]

export default function PricingContent() {
  return (
    <SubpageShell
      title="Death Is Free."
      subtitle={
        <span style={{
          fontFamily: `var(--font-courier), system-ui, sans-serif`,
          fontSize: '12px',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}>
          So is this.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map(({ id, heading, body, github }) => (
          <div
            key={id}
            className="record-card"
            style={{ border: '2px solid var(--c-border)' }}
          >
            <p className="record-label">{heading}</p>
            <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
              {body}
            </p>
            {github && (
              <a
                href="https://github.com/dotsystemsdevs/commitmentissues"
                target="_blank"
                rel="noopener noreferrer"
                className="subpage-faq-cta"
                style={{ marginTop: '14px', display: 'inline-flex' }}
              >
                ★ View on GitHub
              </a>
            )}
          </div>
        ))}

        <div
          className="record-card"
          style={{
            border: '2px solid var(--c-border)',
            background: 'var(--c-panel-2, transparent)',
            textAlign: 'center',
            padding: '28px 20px',
            marginTop: '8px',
          }}
        >
          <p className="record-label" style={{ marginBottom: '14px' }}>Begin the Examination</p>
          <Link
            href="/"
            className="subpage-faq-cta"
            style={{ display: 'inline-flex', justifyContent: 'center' }}
          >
            ⚰  Bury a repo →
          </Link>
        </div>
      </div>
    </SubpageShell>
  )
}
