'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import SubpageShell from '@/components/SubpageShell'
import { HAUNTED_HALL_2026, formatDeathMonth } from '@/lib/hauntedHall2026'
import './haunted-hall.css'

const MONO = `var(--font-courier), system-ui, sans-serif`

/** A gravestone per repo: tap it to open the death certificate. Biggest (most stars) first. */
export default function HauntedHallContent() {
  const graves = HAUNTED_HALL_2026.slice().sort((a, b) => b.stars - a.stars)
  return (
    <SubpageShell
      title="The 2026 Haunted Hall"
      subtitle={
        <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-muted)', letterSpacing: '0.04em' }}>
          {graves.length} real repos, declared dead this year. Tap a stone.
        </span>
      }
      microcopy="Verified against the live GitHub API: archived and buried in 2026. Not guesses."
    >
      <div className="hh-yard">
        {graves.map((entry) => {
          const [owner, name] = entry.fullName.split('/')
          return (
            <Link
              key={entry.fullName}
              href={`/?repo=${encodeURIComponent(entry.fullName)}`}
              onClick={() => track('haunted_hall_entry_clicked', { repo: entry.fullName })}
              className="hh-stone"
              title={entry.description ?? entry.fullName}
            >
              <span className="hh-rip">R.I.P.</span>
              <span className="hh-name">{name}</span>
              <span className="hh-owner">{owner}</span>
              <span className="hh-date">† {formatDeathMonth(entry.pushedAt)}</span>
              <span className="hh-stars">★ {entry.stars.toLocaleString('en-US')}</span>
              <span className="hh-cta">view certificate</span>
            </Link>
          )
        })}
      </div>
    </SubpageShell>
  )
}
