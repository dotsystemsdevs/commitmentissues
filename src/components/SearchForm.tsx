'use client'

import { FormEvent, useState } from 'react'
import { track } from '@vercel/analytics'
import { CTA_RED, CTA_RED_HOVER } from '@/lib/cta'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const PREFIX = 'https://github.com/'

const EXAMPLES = [
  { slug: 'atom/atom',       url: 'https://github.com/atom/atom' },
  { slug: 'bower/bower',     url: 'https://github.com/bower/bower' },
  { slug: 'adobe/brackets',  url: 'https://github.com/adobe/brackets' },
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>

        {/* Prefix + input combined */}
        <div style={{
          flex: 1,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: `2px solid ${focused ? '#888' : '#e0e0e0'}`,
          borderRight: 'none',
          borderRadius: '8px 0 0 8px',
          boxShadow: focused ? '0 0 0 3px rgba(22,10,6,0.08)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          overflow: 'hidden',
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
              padding: '0 12px 0 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#160A06',
              minWidth: 0,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Issue death certificate"
          style={{
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            width: 'auto',
            minWidth: '88px',
            padding: '0 18px',
            height: '60px',
            flexShrink: 0,
            background: CTA_RED,
            color: '#fff',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, transform 0.1s',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = CTA_RED_HOVER
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = CTA_RED
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.97)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'
          }}
        >
          {loading ? <span className="btn-spinner" /> : 'Generate certificate →'}
        </button>
      </form>

      <p style={{
        fontFamily: FONT,
        fontSize: '12px',
        color: '#b0aca8',
        textAlign: 'center',
        margin: '-8px 0 0 0',
      }}>
        Public repos only · No login · No storage
      </p>

      {/* Example repo chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {EXAMPLES.map(({ slug, url }) => (
          <button
            key={slug}
            type="button"
            onClick={() => { track('example_chip_clicked', { repo: slug }); onSelect(url) }}
            style={{
              fontFamily: FONT,
              fontSize: '12px',
              color: '#555',
              background: '#fff',
              border: '1.5px solid #d8d4d0',
              borderRadius: '100px',
              padding: '5px 13px',
              cursor: 'pointer',
              transition: 'border-color 0.12s, background 0.12s, color 0.12s',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#888'
              e.currentTarget.style.background = '#f5f0e8'
              e.currentTarget.style.color = '#160A06'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#d8d4d0'
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#555'
            }}
          >
            {slug}
          </button>
        ))}
      </div>
    </div>
  )
}
