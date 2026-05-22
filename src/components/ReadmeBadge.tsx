'use client'

import { useState } from 'react'
import { copyText, promptCopy } from '@/lib/clipboard'

const MONO = `var(--font-courier), system-ui, sans-serif`

interface Props {
  username: string
}

export default function ReadmeBadge({ username }: Props) {
  const [copied, setCopied] = useState(false)

  // Version param forces GitHub's camo proxy to refetch when we redesign the badge.
  const BADGE_VERSION = '3'
  const badgeUrl   = `https://commitmentissues.dev/api/badge?username=${username}&v=${BADGE_VERSION}&frame=1`
  const profileUrl = `https://commitmentissues.dev/user/${username}`
  const altText    = `Commitment Issues — @${username}'s graveyard`
  const markdown   = `[![${altText}](${badgeUrl})](${profileUrl})`

  async function handleCopy() {
    const ok = await copyText(markdown)
    if (!ok) promptCopy(markdown, 'Copy this README badge markdown')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="readme-badge-block readme-badge-block--profile record-card"
      style={{
        width: '100%',
        marginBottom: '22px',
        background: 'var(--c-surface)',
        border: '2px solid var(--c-border)',
        padding: '16px 18px',
      }}
    >
      {/* Badge preview — the SVG already has its own border; keep the wrapper borderless */}
      <div className="readme-badge-preview" style={{ width: '100%', aspectRatio: '440 / 96' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/badge?username=${encodeURIComponent(username)}&v=${BADGE_VERSION}&frame=0`}
          alt={altText}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Copy row */}
      <div className="readme-badge-row" style={{ marginTop: '10px' }}>
        <p className="readme-badge-caption" style={{ fontFamily: MONO, margin: 0, textAlign: 'left' }}>
          ↻ paste once, updates automatically
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
            minHeight: '36px',
            background: copied ? 'var(--c-green)' : 'transparent',
            color: copied ? 'var(--c-bg)' : 'var(--c-ink-2)',
            border: `2px solid ${copied ? 'var(--c-green)' : 'var(--c-border-light)'}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!copied) {
              e.currentTarget.style.borderColor = 'var(--c-ink)'
              e.currentTarget.style.color = 'var(--c-ink)'
            }
          }}
          onMouseLeave={e => {
            if (!copied) {
              e.currentTarget.style.borderColor = 'var(--c-border-light)'
              e.currentTarget.style.color = 'var(--c-ink-2)'
            }
          }}
        >
          {copied ? '✓ copied!' : '⎘ copy to readme'}
        </button>
      </div>
    </div>
  )
}
