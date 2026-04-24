'use client'

import { FormEvent, useState, useCallback } from 'react'
import { track } from '@vercel/analytics'
import ClickSpark from '@/components/ClickSpark'

const MONO = `var(--font-courier), system-ui, sans-serif`

const PLACEHOLDER = 'username or owner/repo'

const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

type ParsedInput =
  | { kind: 'repo', url: string }
  | { kind: 'user', username: string }
  | null

interface Props {
  url: string
  setUrl: (v: string) => void
  onSubmit: (normalizedUrl: string) => void
  onUserSubmit: (username: string) => void
  onSelect: (url: string) => void
  loading: boolean
}

export default function SearchForm({ url, setUrl, onSubmit, onUserSubmit, onSelect, loading }: Props) {
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

  function parseInput(value: string): ParsedInput {
    const trimmed = value.trim()
    if (!trimmed) return null

    // Full github URL with owner/repo
    const githubRepoUrl = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)(?:[/?#]|$)/i)
    if (githubRepoUrl) {
      const owner = githubRepoUrl[1]
      const repo = githubRepoUrl[2].replace(/\.git$/i, '')
      return { kind: 'repo', url: `https://github.com/${owner}/${repo}` }
    }

    // Github URL with just owner (profile)
    const githubUserUrl = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s?#]+)\/?$/i)
    if (githubUserUrl && VALID_USERNAME.test(githubUserUrl[1])) {
      return { kind: 'user', username: githubUserUrl[1] }
    }

    // owner/repo slug
    const slugMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/)
    if (slugMatch) {
      const owner = slugMatch[1]
      const repo = slugMatch[2].replace(/\.git$/i, '')
      return { kind: 'repo', url: `https://github.com/${owner}/${repo}` }
    }

    // Loose paste like "owner/repo/blob/main/..."
    const looseParts = trimmed.split('/').filter(Boolean)
    if (looseParts.length >= 2 && !trimmed.includes('github.com')) {
      const owner = looseParts[0]
      const repo = looseParts[1].replace(/\.git$/i, '')
      if (owner && repo) return { kind: 'repo', url: `https://github.com/${owner}/${repo}` }
    }

    // Just a username (no slashes)
    if (VALID_USERNAME.test(trimmed)) {
      return { kind: 'user', username: trimmed }
    }

    return null
  }

  function handleChange(val: string) {
    setUrl(val)
  }

  // Live-detect what the user is typing so the button can adapt
  const detected = parseInput(url)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = parseInput(url)
    if (!parsed) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    if (parsed.kind === 'repo') {
      setUrl(parsed.url)
      track('repo_submitted')
      onSubmit(parsed.url)
    } else {
      track('user_submitted')
      onUserSubmit(parsed.username)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      <div className="input-button-wrapper input-block" style={{
        display: 'flex',
        border: '2px solid #1a1a1a',
        overflow: 'hidden',
        background: '#FAF6EF',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#666', padding: '0 2px 0 16px', display: 'flex', alignItems: 'center', flexShrink: 0, userSelect: 'none' }}>
          github.com/
        </span>
        <input
          autoFocus
          type="text"
          inputMode="url"
          value={url.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')}
          onChange={e => { if (invalid) setInvalid(false); handleChange(e.target.value) }}
          placeholder={PLACEHOLDER}
          style={{
            fontFamily: MONO,
            fontSize: '16px',
            fontWeight: 600,
            flex: 1,
            height: '60px',
            padding: '0 10px 0 2px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#160A06',
            minWidth: 0,
          }}
        />

        <ClickSpark color="#2b2b2b">
        <button
          className="input-submit-button input-submit-button--dark alive-interactive"
          type="submit"
          disabled={loading}
          style={{
            fontFamily: MONO,
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            flexShrink: 0,
            padding: '0 24px',
            minWidth: '160px',
            height: '60px',
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
        >
          {loading
            ? <span className="btn-spinner" />
            : detected?.kind === 'user'
              ? 'Autopsy Profile →'
              : detected?.kind === 'repo'
                ? 'Declare Dead →'
                : 'Run Autopsy →'
          }
        </button>
        </ClickSpark>
      </div>

      {invalid && (
        <p style={{ margin: '-2px 2px 0', fontFamily: MONO, fontSize: '12px', color: '#8B0000' }}>
          Invalid URL. Expected github.com/owner/repo.
        </p>
      )}

      <div className="chips-section" style={{ marginTop: '2px', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={handleRandom}
          disabled={randomLoading || loading}
          aria-label="Dig up a random corpse"
          style={{
            fontFamily: MONO, fontSize: '12px', letterSpacing: '0.04em',
            background: 'none', border: 'none', padding: '4px 2px',
            cursor: randomLoading || loading ? 'wait' : 'pointer',
            color: '#9a9288',
            textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(154,146,136,0.4)',
            transition: 'color 0.15s, text-decoration-color 0.15s',
            opacity: randomLoading || loading ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!randomLoading && !loading) { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.textDecorationColor = '#1a1a1a' } }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9a9288'; e.currentTarget.style.textDecorationColor = 'rgba(154,146,136,0.4)' }}
        >
          {randomLoading ? 'exhuming…' : 'or dig up a corpse →'}
        </button>
      </div>

    </form>
  )
}
