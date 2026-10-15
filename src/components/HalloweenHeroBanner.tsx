'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'

const MONO = `var(--font-courier), system-ui, sans-serif`

type Props = {
  onSelect: (url: string) => void
  loading: boolean
}

/** Above-the-fold Halloween extras: tagline, Trick or treat, Haunted Hall. */
export default function HalloweenHeroBanner({ onSelect, loading }: Props) {
  const [halloween, setHalloween] = useState(false)
  const [randomLoading, setRandomLoading] = useState(false)

  useEffect(() => {
    setHalloween(document.documentElement.dataset.halloween === '1')
  }, [])

  if (!halloween) return null

  async function handleTrickOrTreat() {
    setRandomLoading(true)
    try {
      const res = await fetch('/api/random')
      const data = await res.json() as { url?: string }
      if (data.url) {
        track('random_repo_clicked')
        track('trick_or_treat_clicked')
        onSelect(data.url)
      }
    } catch {
      // silently fail
    } finally {
      setRandomLoading(false)
    }
  }

  return (
    <div className="hw-hero-banner" style={{ width: '100%', textAlign: 'center', marginBottom: '14px' }}>
      <p style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--c-red)', margin: '0 0 10px' }}>
        🎃 Halloween edition — spookier certificates, haunted repos, through Nov 2
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleTrickOrTreat}
          disabled={randomLoading || loading}
          className="hw-trick-or-treat-btn"
          style={{
            fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
            padding: '10px 18px', minHeight: '40px',
            background: 'var(--c-ink)', color: 'var(--c-bg)',
            border: '2px solid var(--c-ink)', cursor: randomLoading || loading ? 'wait' : 'pointer',
          }}
        >
          {randomLoading ? 'exhuming…' : '🎃 Trick or treat'}
        </button>
        <Link
          href="/haunted-hall"
          onClick={() => track('haunted_hall_banner_clicked')}
          className="hw-haunted-hall-link"
          style={{
            fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
            padding: '10px 18px', minHeight: '40px',
            display: 'inline-flex', alignItems: 'center',
            background: 'transparent', color: 'var(--c-ink)',
            border: '2px solid var(--c-border)', textDecoration: 'none',
          }}
        >
          👻 The 2026 Haunted Hall
        </Link>
      </div>
    </div>
  )
}
