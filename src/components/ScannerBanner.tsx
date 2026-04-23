'use client'

import { useEffect, useState } from 'react'

const MONO = `var(--font-courier), system-ui, sans-serif`

const FALLBACK = [
  'torvalds', 'gaearon', 'sindresorhus', 'nicolo', 'tj',
  'mxstbr', 'addyosmani', 'paulirish', 'kentcdodds', 'wesbos',
]

export default function ScannerBanner() {
  const [profiles, setProfiles] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/recent-profiles')
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length >= 4) setProfiles(data as string[])
      })
      .catch(() => {})
  }, [])

  const names = profiles.length >= 4 ? profiles : FALLBACK
  const items = [...names, ...names, ...names]

  const duration = names.length * 18

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      background: '#0a0a0a',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* scrolling marquee — fills remaining width */}
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
        }}>
          {items.map((name, i) => (
            <span key={i} style={{
              fontFamily: MONO,
              fontSize: '11px',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0',
            }}>
              <span style={{ color: '#555', padding: '0 20px' }}>✦</span>
              <a
                href={`/user/${name}`}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#aaa' }}>@</span>
                <span style={{ color: '#e8e2d9', textDecoration: 'underline', textUnderlineOffset: '2px', textDecorationColor: 'rgba(232,226,217,0.3)' }}>{name}</span>
              </a>
              <span style={{ color: '#888' }}>&nbsp;— case filed</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
