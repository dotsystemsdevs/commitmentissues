'use client'

import { useState } from 'react'

const MONO = `var(--font-courier), system-ui, sans-serif`

interface Props {
  username: string
}

export default function ReadmeBadge({ username }: Props) {
  const [copied, setCopied] = useState(false)

  const badgeUrl   = `https://commitmentissues.dev/api/badge?username=${username}`
  const profileUrl = `https://commitmentissues.dev/user/${username}`
  const altText    = `Commitment Issues — @${username}'s graveyard`
  const markdown   = `[![${altText}](${badgeUrl})](${profileUrl})`

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: '#cec6bb' }} />
        <p style={{
          fontFamily: MONO, fontSize: '10px', fontWeight: 700,
          color: '#8a8278', margin: 0, letterSpacing: '0.16em',
          textTransform: 'uppercase', flexShrink: 0,
        }}>
          Field Record
        </p>
        <div style={{ flex: 1, height: '1px', background: '#cec6bb' }} />
      </div>

      {/* Badge preview */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/badge?username=${username}&v=11`}
        alt={altText}
        style={{ width: '100%', display: 'block', marginBottom: '10px' }}
      />

      {/* Copy row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '10px' }}>
        <p style={{ fontFamily: MONO, fontSize: '10px', color: '#b0a89e', margin: 0, letterSpacing: '0.04em' }}>
          ↻ paste once — updates automatically
        </p>
        <button
          onClick={handleCopy}
          className="readme-copy-btn"
          style={{
            fontFamily: MONO,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '8px 14px',
            minHeight: '44px',
            background: copied ? '#2d7a3c' : 'transparent',
            color: copied ? '#fff' : '#4a4440',
            border: `2px solid ${copied ? '#2d7a3c' : '#cec6bb'}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a' } }}
          onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = '#cec6bb'; e.currentTarget.style.color = '#4a4440' } }}
        >
          {copied ? '✓ copied!' : '⎘ copy to readme'}
        </button>
      </div>
    </div>
  )
}
