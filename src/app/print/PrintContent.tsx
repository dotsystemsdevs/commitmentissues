'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { track } from '@vercel/analytics'
import SubpageShell from '@/components/SubpageShell'

const MONO = `var(--font-courier), system-ui, sans-serif`

const SPECS: { label: string; value: string }[] = [
  { label: 'Size', value: 'A4 · 210 × 297 mm' },
  { label: 'Paper', value: 'Archival matte, 200 gsm' },
  { label: 'Frame', value: 'Solid wood, black or oak' },
  { label: 'Price', value: '$29 + shipping' },
  { label: 'Status', value: 'Not built yet' },
]

export default function PrintContent() {
  const repo = useSearchParams().get('repo')
  const [registered, setRegistered] = useState(false)

  return (
    <SubpageShell
      title="Framed prints"
      subtitle={
        <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-muted)', letterSpacing: '0.04em' }}>
          The certificate, on your wall instead of your screen.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

        <div className="record-card">
          <p className="record-label">The idea</p>
          <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
            {repo ? `The death certificate for ${repo}, ` : 'Your death certificate, '}
            printed properly and framed, shipped to your door. Same document you just generated,
            except it outlives the repo.
          </p>
        </div>

        <div className="record-card">
          <p className="record-label">What it would be</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
            {SPECS.map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  gap: '16px', padding: '10px 0',
                  borderBottom: i < SPECS.length - 1 ? '1px solid var(--c-border-light)' : 'none',
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-muted)', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontFamily: MONO, fontSize: '13px', color: 'var(--c-ink)', fontWeight: 600, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="record-card">
          <p className="record-label">Honest disclosure</p>
          <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
            This does not exist yet. There is no checkout, nothing is charged, and no email is
            collected. The button below only records that one more person wanted it. If enough
            people press it, the prints get made. If not, they never do.
          </p>
        </div>

        <div style={{ marginTop: '12px' }}>
          <button
            type="button"
            disabled={registered}
            onClick={() => {
              track('print_demand_registered', repo ? { repo } : undefined)
              setRegistered(true)
            }}
            className="cert-btn-primary"
            style={{
              fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
              width: '100%', height: '48px',
              background: registered ? 'transparent' : 'var(--c-ink)',
              color: registered ? 'var(--c-ink)' : 'var(--c-bg)',
              border: '2px solid var(--c-ink)',
              cursor: registered ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {registered ? 'Counted ✓' : 'I would buy this'}
          </button>
          <p style={{
            fontFamily: MONO, fontSize: '11px', color: 'var(--c-muted)', textAlign: 'center',
            margin: '12px 0 0', lineHeight: 1.7,
          }}>
            {registered
              ? 'Noted. Nothing was charged and nothing was sent. Come back and check the graveyard.'
              : 'One anonymous count. No email, no payment, no follow-up.'}
          </p>
        </div>

      </div>
    </SubpageShell>
  )
}
