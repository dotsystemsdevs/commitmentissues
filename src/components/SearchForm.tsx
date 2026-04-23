'use client'

import { FormEvent, useState, useCallback } from 'react'
import { track } from '@vercel/analytics'
import ClickSpark from '@/components/ClickSpark'

const FONT = `var(--font-courier), system-ui, sans-serif`
const MONO = `var(--font-courier), system-ui, sans-serif`

interface Props {
  url: string
  setUrl: (v: string) => void
  onSubmit: (normalizedUrl: string) => void
  onSelect: (url: string) => void
  loading: boolean
}

export default function SearchForm({ url, setUrl, onSubmit, onSelect, loading }: Props) {
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

      <div className="input-button-wrapper input-block" style={{
        display: 'flex',
        border: '2px solid #1a1a1a',
        overflow: 'hidden',
        background: '#FAF6EF',
      }}>
        <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#666', padding: '0 0 0 14px', display: 'flex', alignItems: 'center', flexShrink: 0, userSelect: 'none' }}>
          github.com/
        </span>
        <input
          autoFocus
          type="text"
          inputMode="url"
          value={url.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')}
          onChange={e => { if (invalid) setInvalid(false); handleChange(e.target.value) }}
          placeholder="owner/repo"
          style={{
            fontFamily: MONO,
            fontSize: '14px',
            flex: 1,
            height: '52px',
            padding: '0 8px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#160A06',
            minWidth: 0,
          }}
        />

        <ClickSpark color="#2b2b2b">
        <button
          className="input-submit-button alive-interactive"
          type="submit"
          disabled={loading}
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            flexShrink: 0,
            padding: '0 20px',
            height: '52px',
            background: '#1a1a1a',
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
          onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a' }}
        >
          {loading ? <span className="btn-spinner" /> : 'Declare Dead →'}
        </button>
        </ClickSpark>
      </div>

      {invalid && (
        <p style={{ margin: '-2px 2px 0', fontFamily: FONT, fontSize: '12px', color: '#8B0000' }}>
          Invalid URL. Expected github.com/owner/repo.
        </p>
      )}

      <div className="chips-section" style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
        <button
          className="alive-interactive"
          type="button"
          onClick={handleRandom}
          disabled={randomLoading || loading}
          style={{
            fontFamily: MONO, fontSize: '11px', fontWeight: 400,
            padding: '6px 12px',
            background: 'transparent', border: '2px solid #cec6bb',
            cursor: randomLoading || loading ? 'wait' : 'pointer',
            color: randomLoading || loading ? '#bbb' : '#9a9288',
            transition: 'border-color 0.15s, color 0.15s',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={e => { if (!randomLoading && !loading) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a' } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cec6bb'; e.currentTarget.style.color = '#9a9288' }}
        >
          {randomLoading ? 'exhuming...' : '↯ exhume at random'}
        </button>
      </div>

    </form>
  )
}
