'use client'

import { useEffect, useState, useRef } from 'react'

const MONO = `var(--font-courier), 'Courier New', monospace`

// ~5 per hour = 1 every 12 minutes
const TICK_MS = 12 * 60 * 1000
// Seed count — added on top of real DB count
const BASE_COUNT = 1449

export function incrementStat(counter: 'buried' | 'shared' | 'downloaded') {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter }),
  }).catch(() => {})
}

export default function StatsBar() {
  const [count, setCount] = useState<number | null>(null)
  const [display, setDisplay] = useState<number | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then((data: { buried: number }) => {
        const real = BASE_COUNT + (data.buried ?? 0)
        setCount(real)

        // Count-up animation: start 8 below, step up every 80ms
        const start = real - 8
        setDisplay(start)
        let cur = start
        const up = setInterval(() => {
          cur++
          setDisplay(cur)
          if (cur >= real) clearInterval(up)
        }, 80)
      })
      .catch(() => {})
  }, [])

  // Tick up ~5/hour after initial load
  useEffect(() => {
    if (count === null) return
    tickRef.current = setInterval(() => {
      setCount(c => (c ?? 0) + 1)
      setDisplay(c => (c ?? 0) + 1)
    }, TICK_MS)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [count !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  if (display === null) return null

  return (
    <div style={{ textAlign: 'center', margin: '0 0 24px 0' }}>
      <p style={{
        fontFamily: MONO,
        fontSize: 'clamp(22px, 6vw, 28px)',
        fontWeight: 700,
        color: '#160A06',
        margin: '0 0 4px 0',
        letterSpacing: '-0.02em',
      }}>
        {display.toLocaleString()} repos buried
      </p>
      <p style={{
        fontFamily: MONO,
        fontSize: '11px',
        color: '#b0aca8',
        margin: 0,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        and counting
      </p>
    </div>
  )
}
