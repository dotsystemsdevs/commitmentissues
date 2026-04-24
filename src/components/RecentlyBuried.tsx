'use client'

import { memo, useMemo, type MouseEvent } from 'react'
import { track } from '@vercel/analytics'
import type { LeaderboardEntry } from '@/lib/types'
import { HALL_OF_SHAME } from '@/lib/hallOfShame'
import { useCandles } from '@/components/useCandles'

const MONO = `var(--font-courier), system-ui, sans-serif`

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
      <p className="record-label" style={{ margin: 0, textAlign: 'center', letterSpacing: '0.18em' }}>
        {label}
      </p>
    </div>
  )
}

interface Props {
  onSelect: (url: string) => void
}

type MergedEntry = LeaderboardEntry & { commitLabel: string }

interface CardProps {
  entry: MergedEntry
  count: number
  placed: boolean
  onSelect: (url: string) => void
  onToggle: (fullName: string) => void
}

const Card = memo(function Card({ entry, count, placed, onSelect, onToggle }: CardProps) {
  function handleToggle(e: MouseEvent) {
    e.stopPropagation()
    onToggle(entry.fullName)
  }

  return (
    <div
      className="alive-card recent-card"
      onClick={() => {
        track('recent_clicked', { repo: entry.fullName })
        onSelect(`https://github.com/${entry.fullName}`)
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        width: 'clamp(260px, 76vw, 320px)',
        height: '200px',
        flexShrink: 0,
        padding: '18px 20px',
        background: '#EDE8E1',
        border: '2px solid #1a1a1a',
        borderRadius: '0px',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-label={placed ? `Remove your wreath · ${count} total` : `Leave a wreath for ${entry.fullName}`}
        title={placed ? 'Click again to take your wreath back' : 'Leave a wreath'}
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          padding: '4px 2px',
          fontFamily: MONO,
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: placed ? '#1a1a1a' : '#8a8278',
          cursor: 'pointer',
          transition: 'color 0.18s, transform 0.18s',
          zIndex: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <span aria-hidden style={{ fontSize: '16px', lineHeight: 1 }}>💐</span>
        <span>{count}</span>
      </button>

      <span aria-hidden style={{
        fontSize: '30px', lineHeight: 1, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '42px', height: '42px',
        background: 'radial-gradient(ellipse at 50% 85%, rgba(45,122,60,0.22) 0%, rgba(45,122,60,0.10) 45%, transparent 70%)',
        borderRadius: '4px',
      }}>🪦</span>
      <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%', paddingRight: '56px' }}>
        {entry.fullName}
      </span>
      <span className="recent-card-cause" style={{ fontFamily: MONO, fontSize: '12px', color: '#3d3832', lineHeight: 1.55, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {entry.cause}
      </span>
      {entry.lastWords && (
        <span className="recent-card-lastwords" style={{ fontFamily: MONO, fontSize: '11px', fontStyle: 'italic', color: '#7a7268', lineHeight: 1.5, fontWeight: 400, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          &ldquo;{entry.lastWords}&rdquo;
        </span>
      )}
      <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '10px' }}>
        {entry.commitLabel && (
          <span style={{ fontFamily: MONO, fontSize: '10px', color: '#878078', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            last commit · <span style={{ color: '#4d4d4d', fontWeight: 600 }}>{entry.commitLabel}</span>
          </span>
        )}
      </div>
    </div>
  )
})

export default function RecentlyBuried({ onSelect }: Props) {
  const merged = useMemo<MergedEntry[]>(
    () => HALL_OF_SHAME.map(e => ({ ...e, commitLabel: e.deathDate ?? '' })),
    []
  )

  // Subscribe once at the parent; Card is memoized so only the card whose
  // count/placed actually changes re-renders on a wreath toggle.
  const { totals, local, toggle } = useCandles()

  if (merged.length === 0) return null

  const duration = Math.max(80, Math.round(merged.length * 16))

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <SectionHeader label="Hall of Fame" />
      <div
        className="recent-marquee"
        style={{
          width: '100vw', marginLeft: 'calc(50% - 50vw)', overflow: 'hidden', height: '300px', padding: '14px 0 16px',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
        }}
      >
        <div
          className="recent-track"
          style={{
            display: 'flex',
            gap: '14px',
            animation: `marquee-reverse ${duration}s linear infinite`,
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {merged.map(entry => (
            <Card
              key={entry.fullName}
              entry={entry}
              count={totals[entry.fullName] ?? 0}
              placed={local.has(entry.fullName)}
              onSelect={onSelect}
              onToggle={toggle}
            />
          ))}
          <div aria-hidden style={{ display: 'contents' }}>
            {merged.map(entry => (
              <Card
                key={`loop-${entry.fullName}`}
                entry={entry}
                count={totals[entry.fullName] ?? 0}
                placed={local.has(entry.fullName)}
                onSelect={onSelect}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
