'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import type { LeaderboardEntry } from '@/lib/types'

const MONO = `var(--font-courier), system-ui, sans-serif`

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: '14px', textAlign: 'center' }}>
      <p className="record-label" style={{ margin: 0, textAlign: 'center', letterSpacing: '0.16em' }}>
        {label}
      </p>
    </div>
  )
}

interface Props {
  onSelect: (url: string) => void
}

export default function RecentlyBuried({ onSelect }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch('/api/recent')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: LeaderboardEntry[]) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data.slice(0, 10))
      })
      .catch(() => setFailed(true))
  }, [])

  if (failed || entries.length === 0) return null

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

  // Keep a calmer marquee pace.
  const duration = Math.round((entries.length * 310) / 30)

  function Card({ entry }: { entry: typeof entries[number] }) {
    return (
      <button
        type="button"
        onClick={() => {
          track('recent_clicked', { repo: entry.fullName })
          onSelect(`https://github.com/${entry.fullName}`)
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          width: 'clamp(220px, 70vw, 280px)',
          height: 'clamp(110px, 18vh, 150px)',
          flexShrink: 0,
          padding: '12px 14px',
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border-light)',
          borderLeft: '3px solid var(--c-border)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-surface-raised)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-surface)' }}
        onMouseDown={e => { e.currentTarget.style.opacity = '0.9' }}
        onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
      >
        <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1.3, wordBreak: 'break-word' }}>
          {entry.fullName}
        </span>
        <span style={{ fontFamily: `var(--font-dm), Georgia, serif`, fontSize: '12px', fontStyle: 'italic', color: 'var(--c-ink-2)', lineHeight: 1.55, marginTop: '2px', flex: 1 }}>
          {entry.cause}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '10px', color: 'var(--c-muted)', letterSpacing: '0.04em' }}>
          {entry.analyzedAt ? timeAgo(entry.analyzedAt) : ''}
        </span>
      </button>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SectionHeader label="Recently Buried" />
      <div
        style={{
            flex: 1, minHeight: 0,
            width: '100vw', marginLeft: 'calc(50% - 50vw)', overflow: 'hidden', padding: '4px 0 8px',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
          }}
        onMouseEnter={e => { (e.currentTarget.querySelector('.recent-track') as HTMLElement).style.animationPlayState = 'paused' }}
        onMouseLeave={e => { (e.currentTarget.querySelector('.recent-track') as HTMLElement).style.animationPlayState = 'running' }}
      >
        <div
          className="recent-track"
          style={{
            display: 'flex',
            gap: '14px',
            animation: `marquee-reverse ${duration}s linear infinite`,
            width: 'max-content',
          }}
        >
          {entries.map(entry => <Card key={entry.fullName} entry={entry} />)}
          <div aria-hidden style={{ display: 'contents' }}>
            {entries.map(entry => <Card key={`loop-${entry.fullName}`} entry={entry} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
