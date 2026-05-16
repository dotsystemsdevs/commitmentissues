'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { LeaderboardEntry } from '@/lib/types'
import { HALL_OF_SHAME } from '@/lib/hallOfShame'
import ThemeToggle from '@/components/ThemeToggle'

const MONO = `var(--font-courier), system-ui, sans-serif`

export default function ScannerBanner() {
  const [recent, setRecent] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/recent')
      .then(r => r.ok ? r.json() : [])
      .then((data: LeaderboardEntry[]) => {
        if (Array.isArray(data)) setRecent(data.slice(0, 10))
      })
      .catch(() => {})
  }, [])

  // Top ticker = latest burials. If empty (cold start), fall back to Hall of Shame.
  const merged = recent.length >= 4 ? recent : HALL_OF_SHAME.slice(0, 12)

  if (merged.length === 0) return null

  function timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const items = [...merged, ...merged, ...merged]
  const duration = merged.length * 12

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      background: 'var(--c-border)',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div
        style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}
        onMouseEnter={e => { const t = e.currentTarget.querySelector<HTMLElement>('[data-marquee]'); if (t) t.style.animationPlayState = 'paused' }}
        onMouseLeave={e => { const t = e.currentTarget.querySelector<HTMLElement>('[data-marquee]'); if (t) t.style.animationPlayState = 'running' }}
      >
        <div
          data-marquee
          style={{
            display: 'flex',
            animation: `marquee-reverse ${duration}s linear infinite`,
            width: 'max-content',
            alignItems: 'center',
          }}
        >
          {items.map((entry, i) => {
            const label = entry.analyzedAt
              ? `buried ${timeAgo(entry.analyzedAt)}`
              : entry.deathDate
                ? `RIP ${entry.deathDate}`
                : 'RIP'
            return (
              <span key={`${entry.fullName}-${i}`} style={{
                fontFamily: MONO,
                fontSize: '11px',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0',
                color: 'var(--c-bg)',
              }}>
                <span style={{ color: 'var(--c-muted)', opacity: 0.6, padding: '0 20px' }}>✦</span>
                <Link
                  href={`/?repo=${entry.fullName}`}
                  prefetch={false}
                  style={{ color: 'var(--c-bg)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span aria-hidden style={{ opacity: 0.9 }}>🪦</span>
                  <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                    {entry.fullName}
                  </span>
                </Link>
                <span style={{ color: 'var(--c-muted)', opacity: 0.9 }}>&nbsp;— {label}</span>
              </span>
            )
          })}
        </div>
      </div>
      <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
        <ThemeToggle />
      </div>
    </div>
  )
}
