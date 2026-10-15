'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import SubpageShell from '@/components/SubpageShell'
import { HAUNTED_HALL_2026, formatDeathMonth } from '@/lib/hauntedHall2026'

const MONO = `var(--font-courier), system-ui, sans-serif`

export default function HauntedHallContent() {
  return (
    <SubpageShell
      title="The 2026 Haunted Hall"
      subtitle={
        <span style={{
          fontFamily: MONO,
          fontSize: '12px',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}>
          {HAUNTED_HALL_2026.length} real repos, declared dead this year.
        </span>
      }
      microcopy="Verified against the live GitHub API — archived and buried in 2026. Not guesses."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {HAUNTED_HALL_2026
          .slice()
          .sort((a, b) => b.stars - a.stars)
          .map(entry => (
            <Link
              key={entry.fullName}
              href={`/?repo=${encodeURIComponent(entry.fullName)}`}
              onClick={() => track('haunted_hall_entry_clicked', { repo: entry.fullName })}
              className="record-card haunted-hall-row"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <p className="record-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--c-ink)', margin: 0 }}>
                  {entry.fullName}
                </p>
                <span style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>
                  {formatDeathMonth(entry.pushedAt)}
                </span>
              </div>
              {entry.description && (
                <p style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-ink-2)', margin: '8px 0 0', lineHeight: 1.6 }}>
                  {entry.description}
                </p>
              )}
              <p style={{ fontFamily: MONO, fontSize: '12px', fontStyle: 'italic', color: 'var(--c-red)', margin: '10px 0 0' }}>
                cause: {entry.cause}
              </p>
              <p style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--c-muted)', margin: '8px 0 0', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                view certificate →
              </p>
            </Link>
          ))}
      </div>
    </SubpageShell>
  )
}
