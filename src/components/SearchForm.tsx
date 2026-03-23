'use client'

import { FormEvent, useState } from 'react'
import { track } from '@vercel/analytics'
import { CTA_RED, CTA_RED_HOVER } from '@/lib/cta'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`
const PREFIX = 'https://github.com/'

const EXAMPLES = [
  { owner: 'atom',   repo: 'atom',     url: 'https://github.com/atom/atom',      color: '#8B6B4A' },
  { owner: 'bower',  repo: 'bower',    url: 'https://github.com/bower/bower',    color: '#7a5c8a' },
  { owner: 'adobe',  repo: 'brackets', url: 'https://github.com/adobe/brackets', color: '#4a7a6a' },
]

interface Props {
  url: string
  setUrl: (v: string) => void
  onSubmit: () => void
  onSelect: (url: string) => void
  loading: boolean
}

export default function SearchForm({ url, setUrl, onSubmit, onSelect, loading }: Props) {
  const [focused, setFocused] = useState(false)

  const displayValue = url.startsWith(PREFIX) ? url.slice(PREFIX.length) : url

  function handleChange(val: string) {
    const slug = val.replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    setUrl(PREFIX + slug)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!displayValue.trim()) return
    track('repo_submitted')
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Input + button — stacked, connected as one block */}
      <div style={{
        border: `2px solid ${focused ? '#888' : '#e0e0e0'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: focused ? '0 0 0 3px rgba(22,10,6,0.08)' : '0 2px 12px rgba(0,0,0,0.1)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
        {/* Input */}
        <div style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: `1.5px solid #e0e0e0`,
        }}>
          <span style={{
            fontFamily: FONT,
            fontSize: '16px',
            color: '#160A06',
            fontWeight: 700,
            paddingLeft: '16px',
            paddingRight: '2px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            flexShrink: 0,
          }}>
            github.com/
          </span>
          <input
            autoFocus
            type="text"
            value={displayValue}
            onChange={e => handleChange(e.target.value)}
            placeholder="owner/repo"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              fontFamily: FONT,
              fontSize: '16px',
              flex: 1,
              height: '100%',
              padding: '0 16px 0 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#160A06',
              minWidth: 0,
            }}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Issue death certificate"
          style={{
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            width: '100%',
            height: '52px',
            background: CTA_RED,
            color: '#fff',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = CTA_RED_HOVER }}
          onMouseLeave={e => { e.currentTarget.style.background = CTA_RED }}
        >
          {loading ? <span className="btn-spinner" /> : 'Issue death certificate →'}
        </button>
      </div>

      {/* Microcopy */}
      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#b0aca8', textAlign: 'center', margin: '-6px 0 0', letterSpacing: '0.05em' }}>
        No login. No storage. Just closure.
      </p>

      {/* TRY ONE OF THESE chips */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
        <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em', color: '#b0aca8', textTransform: 'uppercase' }}>
          try a famous corpse:
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {EXAMPLES.map(({ owner, repo, url, color }) => (
            <button
              key={owner + repo}
              type="button"
              onClick={() => { track('example_chip_clicked', { repo: `${owner}/${repo}` }); onSelect(url) }}
              style={{
                fontFamily: MONO,
                fontSize: '12px',
                background: '#fff',
                border: '1.5px solid #d8d4d0',
                borderRadius: '5px',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'border-color 0.12s, background 0.12s, transform 0.12s',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#888'
                e.currentTarget.style.background = '#faf7f3'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d8d4d0'
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ color }}>{owner}</span>
              <span style={{ color: '#b0aca8' }}>/</span>
              <span style={{ color: '#160A06', fontWeight: 600 }}>{repo}</span>
            </button>
          ))}
        </div>
      </div>

    </form>
  )
}
