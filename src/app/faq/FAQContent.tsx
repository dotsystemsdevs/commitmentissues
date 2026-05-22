'use client'

import SubpageShell from '@/components/SubpageShell'

const MONO = `var(--font-courier), system-ui, sans-serif`

type FAQItem = { q: string; a: string }

export default function FAQContent({ items }: { items: FAQItem[] }) {
  return (
    <SubpageShell
      title="Frequently Asked Questions"
      subtitle={
        <span style={{
          fontFamily: MONO,
          fontSize: '12px',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}>
          Everything about the death certificate generator for dead GitHub repos.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(({ q, a }, i) => (
          <section
            key={i}
            className="record-card"
            style={{ border: '2px solid var(--c-border)' }}
          >
            <h2 className="record-label" style={{ fontSize: '11px', margin: '0 0 8px 0' }}>{q}</h2>
            <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
              {a}
            </p>
          </section>
        ))}
      </div>
    </SubpageShell>
  )
}
