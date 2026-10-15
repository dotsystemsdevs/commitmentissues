'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import SubpageShell from '@/components/SubpageShell'
import { HAUNTED_HALL_2026, formatDeathMonth } from '@/lib/hauntedHall2026'
import { pickSpookyCause, hashString } from '@/lib/halloween'
import './haunted-hall.css'

const MONO = `var(--font-courier), system-ui, sans-serif`

const SHAPES = ['round', 'gothic', 'cross', 'classic'] as const
type Shape = (typeof SHAPES)[number]

/** Deterministic per-repo cosmetics so the yard looks hand-placed, not generated: a headstone
 * shape, a slight tilt, which corner the moss grows in, and which crack pattern it got. */
function stoneStyle(fullName: string): { shape: Shape; tilt: number; moss: number; crack: number; shift: number } {
  const h = hashString(fullName)
  const shape = SHAPES[h % SHAPES.length]
  const tilt = ((h >> 3) % 7) - 3 // -3deg..3deg
  const moss = (h >> 6) % 4 // which corner(s)
  const crack = (h >> 8) % 3 // which crack pattern
  const shift = ((h >> 10) % 5) - 2 // -2px..2px vertical jitter, graveyard isn't a ruler
  return { shape, tilt, moss, crack, shift }
}

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
          const { shape, tilt, moss, crack, shift } = stoneStyle(entry.fullName)
          const spookyCause = pickSpookyCause(entry.fullName)
          return (
            // The mound sits in this unclipped wrapper; the gothic shape's clip-path lives on the
            // <Link> alone, so it can crop its own stone face without cropping the mound below it.
            <div
              key={entry.fullName}
              className="hh-plot"
              style={{ '--hh-tilt': `${tilt}deg`, '--hh-shift': `${shift}px` } as CSSProperties}
            >
              <span className="hh-grave-mound" aria-hidden />
              <Link
                href={`/?repo=${encodeURIComponent(entry.fullName)}`}
                onClick={() => track('haunted_hall_entry_clicked', { repo: entry.fullName })}
                className={`hh-stone hh-stone--${shape} hh-moss-${moss} hh-crack-${crack}`}
                title={entry.description ?? entry.fullName}
              >
                {shape === 'cross' && <span className="hh-cross-top" aria-hidden>✝</span>}
                <span className="hh-engraved">
                  <span className="hh-rip">R.I.P.</span>
                  <span className="hh-name">{name}</span>
                  <span className="hh-owner">{owner}</span>
                  <span className="hh-date">died {formatDeathMonth(entry.pushedAt)}</span>
                  <span className="hh-cause-label">cause of death</span>
                  <span className="hh-cause">{spookyCause}</span>
                </span>
                <span className="hh-stars">★ {entry.stars.toLocaleString('en-US')}</span>
                <span className="hh-cta">view certificate</span>
              </Link>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center', padding: '28px 0 8px' }}>
        <Link href="/" className="subpage-faq-cta">
          ⚰ Issue your own death certificate →
        </Link>
      </div>
    </SubpageShell>
  )
}
