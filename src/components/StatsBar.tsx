'use client'

import { useEffect, useState } from 'react'

const FONT = `var(--font-dm), -apple-system, sans-serif`

export function incrementStat(counter: 'buried' | 'shared' | 'downloaded') {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter }),
  }).catch(() => {})
}

export default function StatsBar() {
  const [stats, setStats] = useState<{ buried: number; shared: number; downloaded: number } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  if (!stats || (stats.buried === 0 && stats.shared === 0 && stats.downloaded === 0)) return null

  return (
    <p style={{
      fontFamily: FONT,
      fontSize: '13px',
      color: '#938882',
      textAlign: 'center',
      margin: '0 0 28px 0',
      letterSpacing: '0.01em',
    }}>
      {stats.buried.toLocaleString()} repos buried · {stats.shared.toLocaleString()} shared · {stats.downloaded.toLocaleString()} downloaded
    </p>
  )
}
