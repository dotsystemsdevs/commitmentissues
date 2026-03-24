'use client'

import { FormEvent, useState, useCallback } from 'react'
import { track } from '@vercel/analytics'
import ClickSpark from '@/components/ClickSpark'

const FONT = `var(--font-dm), -apple-system, sans-serif`


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
  const [randomLoading, setRandomLoading] = useState(false)

  const handleRandom = useCallback(async () => {
    setRandomLoading(true)
    try {
      const res = await fetch('/api/random')
      const data = await res.json() as { url?: string }
      if (data.url) {
        track('random_repo_clicked')
        onSelect(data.url)
      }
    } catch {
      // silently fail
    } finally {
      setRandomLoading(false)
    }
  }, [onSelect])

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
      <div className="input-button-wrapper input-block" style={{
        display: 'flex',
        border: `2px solid ${focused ? '#0a0a0a' : '#0a0a0a'}`,
        borderRadius: '0px',
        overflow: 'hidden',
        boxShadow: 'none',
        transition: 'border-color 0.15s',
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
            placeholder="paste-your-repo-url-here"
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
        <ClickSpark color="#2b2b2b">
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
            background: '#0a0a0a',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
              transition: 'background 0.15s, opacity 0.12s',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0a0a0a' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a' }}
          onMouseDown={e => { e.currentTarget.style.opacity = '0.9' }}
          onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
        >
          {loading ? <span className="btn-spinner" /> : 'Issue Death Certificate →'}
        </button>
        </ClickSpark>
      </div>

      {invalid && (
        <p style={{ margin: '-2px 2px 0', fontFamily: FONT, fontSize: '12px', color: '#8B0000' }}>
          Paste a valid GitHub URL or user/repo.
        </p>
      )}

      {/* Random dead repo */}
      <div className="chips-section" style={{ display: 'flex', justifyContent: 'center', marginTop: '6px', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={handleRandom}
          disabled={randomLoading || loading}
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 500,
            color: randomLoading || loading ? '#aaa' : '#5f5f5f',
            background: 'transparent',
            border: 'none',
            padding: '6px 4px',
            cursor: randomLoading || loading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationColor: 'rgba(0,0,0,0.2)',
            transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#1f1f1f' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#5f5f5f' }}
        >
          {randomLoading
            ? 'finding a corpse...'
            : 'or pick a random dead repo →'
          }
        </button>
      </div>

    </form>
  )
}
