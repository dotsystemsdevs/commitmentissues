'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import type { LeaderboardEntry } from '@/lib/types'
import { HALL_OF_SHAME } from '@/lib/hallOfShame'

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

type MergedEntry = LeaderboardEntry & { searchedLabel: string; commitLabel: string }

export default function RecentlyBuried({ onSelect }: Props) {
  const [recent, setRecent] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetch('/api/recent')
      .then(r => r.ok ? r.json() : [])
      .then((data: LeaderboardEntry[]) => {
        if (Array.isArray(data)) setRecent(data.slice(0, 10))
      })
      .catch(() => {})
  }, [])

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

  // Merge: recent first, then a curated slice from Hall of Shame. Dedupe by fullName.
  const recentWithLabels: MergedEntry[] = recent.map(e => ({
    ...e,
    searchedLabel: e.analyzedAt ? timeAgo(e.analyzedAt) : '',
    commitLabel: e.deathDate ?? '',
  }))
  const seen = new Set(recentWithLabels.map(e => e.fullName.toLowerCase()))
  const shameWithLabels: MergedEntry[] = HALL_OF_SHAME
    .filter(e => !seen.has(e.fullName.toLowerCase()))
    .map(e => ({
      ...e,
      searchedLabel: '',
      commitLabel: e.deathDate ?? '',
    }))
  const merged: MergedEntry[] = [...recentWithLabels, ...shameWithLabels]
  if (merged.length === 0) return null

  const duration = Math.max(80, Math.round((merged.length * 16)))

  function Card({ entry }: { entry: MergedEntry }) {
    return (
      <button
        type="button"
        onClick={() => {
          track('recent_clicked', { repo: entry.fullName })
          onSelect(`https://github.com/${entry.fullName}`)
        }}
        className="alive-card recent-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          width: 'clamp(260px, 76vw, 320px)',
          height: '250px',
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
        <span aria-hidden style={{
          fontSize: '30px', lineHeight: 1, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '42px', height: '42px',
          background: 'radial-gradient(ellipse at 50% 85%, rgba(45,122,60,0.22) 0%, rgba(45,122,60,0.10) 45%, transparent 70%)',
          borderRadius: '4px',
        }}>🪦</span>
        <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '100%' }}>
          {entry.fullName}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#3d3832', lineHeight: 1.55, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {entry.cause}
        </span>
        {entry.lastWords && (
          <span style={{ fontFamily: MONO, fontSize: '11px', fontStyle: 'italic', color: '#7a7268', lineHeight: 1.5, fontWeight: 400, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            &ldquo;{entry.lastWords}&rdquo;
          </span>
        )}
        <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {entry.commitLabel && (
            <span style={{ fontFamily: MONO, fontSize: '9px', color: '#878078', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              last commit · <span style={{ color: '#4d4d4d', fontWeight: 600 }}>{entry.commitLabel}</span>
            </span>
          )}
          {entry.searchedLabel && (
            <span style={{ fontFamily: MONO, fontSize: '9px', color: '#878078', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              searched · <span style={{ color: '#4d4d4d', fontWeight: 600 }}>{entry.searchedLabel}</span>
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <SectionHeader label="Recently Buried" />
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
          }}
        >
          {merged.map(entry => <Card key={entry.fullName} entry={entry} />)}
          <div aria-hidden style={{ display: 'contents' }}>
            {merged.map(entry => <Card key={`loop-${entry.fullName}`} entry={entry} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
