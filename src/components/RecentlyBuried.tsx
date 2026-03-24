'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import type { LeaderboardEntry } from '@/lib/types'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

interface Props {
  onSelect: (url: string) => void
}

export default function RecentlyBuried({ onSelect }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/recent')
      .then(r => r.json())
      .then((data: LeaderboardEntry[]) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  if (entries.length === 0) return null

  return (
    <div style={{ width: '100%', marginTop: '32px' }}>
      <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#727272', margin: '0 0 10px 0', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
        Recently Buried
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {entries.map(entry => (
          <button
            key={entry.fullName}
            type="button"
            onClick={() => {
              track('recent_clicked', { repo: entry.fullName })
              onSelect(`https://github.com/${entry.fullName}`)
            }}
            style={{
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              background: '#f2f2f2',
              border: '1px solid #c8c8c8',
              borderRadius: '0',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0a0a0a'
              e.currentTarget.style.background = '#eaeaea'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#c8c8c8'
              e.currentTarget.style.background = '#f2f2f2'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: '#0a0a0a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.fullName}
              </span>
              <span style={{ fontFamily: FONT, fontSize: '12px', fontStyle: 'italic', color: '#5f5f5f', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                {entry.cause}
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: '#8B0000', flexShrink: 0 }}>
              {entry.score}/10
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
