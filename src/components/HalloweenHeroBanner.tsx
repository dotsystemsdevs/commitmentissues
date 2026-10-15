'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'

const MONO = `var(--font-courier), system-ui, sans-serif`

/**
 * Halloween: one quiet line above the search, linking to the Haunted Hall. Trick or treat lives on
 * the random-repo button in SearchForm, so it is not repeated here (her call 16 Oct: no duplicates,
 * and the homepage must fit one screen without scrolling).
 */
export default function HalloweenHeroBanner(_: { onSelect?: (url: string) => void; loading?: boolean }) {
  const [halloween, setHalloween] = useState(false)
  useEffect(() => {
    setHalloween(document.documentElement.dataset.halloween === '1')
  }, [])
  if (!halloween) return null
  return (
    <Link
      href="/haunted-hall"
      onClick={() => track('haunted_hall_banner_clicked')}
      className="hw-hero-banner"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: MONO, fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
        color: 'var(--c-red)', textDecoration: 'none', margin: '0 auto 10px',
        padding: '6px 14px', border: '1.5px solid var(--c-red)',
      }}
    >
      🎃 Halloween edition · 🪦 visit the 2026 Haunted Hall →
    </Link>
  )
}
