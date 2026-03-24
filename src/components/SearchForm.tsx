'use client'

import { FormEvent, useState } from 'react'
import { track } from '@vercel/analytics'
import { CTA_RED, CTA_RED_HOVER } from '@/lib/cta'
import ClickSpark from '@/components/ClickSpark'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

const EXAMPLES = [
  { owner: 'atom',   repo: 'atom',     url: 'https://github.com/atom/atom',      color: '#8B6B4A' },
  { owner: 'bower',  repo: 'bower',    url: 'https://github.com/bower/bower',    color: '#7a5c8a' },
  { owner: 'adobe',  repo: 'brackets', url: 'https://github.com/adobe/brackets', color: '#4a7a6a' },
]
const TILTS = [-1.5, 1, -1]

interface Props {
  url: string
  setUrl: (v: string) => void
  onSubmit: (normalizedUrl: string) => void
  onSelect: (url: string) => void
  loading: boolean
}

export default function SearchForm({ url, setUrl, onSubmit, onSelect, loading }: Props) {
  const [focused, setFocused] = useState(false)
  const [invalid, setInvalid] = useState(false)

  function normalizeGithubInput(value: string): string | null {
    const trimmed = value.trim()
    if (!trimmed) return null

    const githubUrlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)(?:[/?#]|$)/i)
    if (githubUrlMatch) {
      const owner = githubUrlMatch[1]
      const repo = githubUrlMatch[2].replace(/\.git$/i, '')
      return `https://github.com/${owner}/${repo}`
    }

    const slugMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/)
    if (slugMatch) {
      const owner = slugMatch[1]
      const repo = slugMatch[2].replace(/\.git$/i, '')
      return `https://github.com/${owner}/${repo}`
    }

    // Also support loose pastes like "owner/repo/blob/main/..."
    const looseParts = trimmed.split('/').filter(Boolean)
    if (looseParts.length >= 2 && !trimmed.includes('github.com')) {
      const owner = looseParts[0]
      const repo = looseParts[1].replace(/\.git$/i, '')
      if (owner && repo) return `https://github.com/${owner}/${repo}`
    }

    return null
  }

  function handleChange(val: string) {
    setUrl(val)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const normalizedUrl = normalizeGithubInput(url)
    if (!normalizedUrl) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setUrl(normalizedUrl)
    track('repo_submitted')
    onSubmit(normalizedUrl)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Input + button — single row */}
      <div className="input-button-wrapper" style={{
        display: 'flex',
        border: `2px solid ${focused ? '#888' : '#e0e0e0'}`,
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: focused ? '0 0 0 3px rgba(22,10,6,0.08)' : '0 2px 12px rgba(0,0,0,0.1)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        background: '#fff',
      }}>
        {/* Input */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <input
            autoFocus
            type="url"
            inputMode="url"
            value={url}
            onChange={e => { if (invalid) setInvalid(false); handleChange(e.target.value) }}
            placeholder="user/repo or full GitHub URL"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              fontFamily: FONT,
              fontSize: '14px',
              flex: 1,
              height: '52px',
              padding: '0 12px 0 14px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#160A06',
              minWidth: 0,
            }}
          />
        </div>

        {/* Button */}
        <ClickSpark color="#fff">
        <button
          className="input-submit-button"
          type="submit"
          disabled={loading}
          aria-label="Issue death certificate"
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            flexShrink: 0,
            padding: '0 20px',
            height: '52px',
            background: CTA_RED,
            color: '#fff',
            border: '1px solid rgba(0,0,0,0.28)',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s, box-shadow 0.15s',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = CTA_RED_HOVER }}
          onMouseLeave={e => { e.currentTarget.style.background = CTA_RED }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? <span className="btn-spinner" /> : 'See what killed it →'}
        </button>
        </ClickSpark>
      </div>

      {invalid && (
        <p style={{ margin: '-2px 2px 0', fontFamily: FONT, fontSize: '12px', color: '#8B0000' }}>
          Paste a valid GitHub URL or user/repo.
        </p>
      )}

      {/* TRY ONE OF THESE chips */}
      <div className="chips-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: 0, marginBottom: '8px' }}>
        <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.18em', color: '#b0aca8', textTransform: 'uppercase' }}>
          try one of these
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {EXAMPLES.map(({ owner, repo, url, color }, i) => (
            <button
              key={owner + repo}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                track('example_chip_clicked', { repo: `${owner}/${repo}` })
                onSelect(url)
              }}
              style={{
                fontFamily: MONO,
                fontSize: '12px',
                background: '#fff',
                border: '1.5px solid #d8d4d0',
                borderRadius: '5px',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'border-color 0.12s, background 0.12s, transform 0.15s',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                transform: `rotate(${TILTS[i]}deg)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#888'
                e.currentTarget.style.background = '#faf7f3'
                e.currentTarget.style.transform = 'translateY(-2px) rotate(0deg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d8d4d0'
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.transform = `rotate(${TILTS[i]}deg)`
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
