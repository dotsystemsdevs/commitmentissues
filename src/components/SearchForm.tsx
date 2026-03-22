'use client'

import { FormEvent } from 'react'

const FONT = `var(--font-dm), -apple-system, sans-serif`

interface Props {
  url: string
  setUrl: (v: string) => void
  onSubmit: () => void
  onExample: () => void
  loading: boolean
}

export default function SearchForm({ url, setUrl, onSubmit, onExample, loading }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <input
          autoFocus
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          style={{
            fontFamily: FONT,
            fontSize: '16px',
            width: '100%',
            height: '48px',
            padding: '0 18px',
            background: '#1e1e1e',
            border: '1.5px solid #333',
            borderRadius: '6px 6px 0 0',
            color: '#edebe8',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#8b0000')}
          onBlur={e => (e.currentTarget.style.borderColor = '#333')}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          style={{
            fontFamily: FONT,
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            width: '100%',
            height: '48px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '0 0 6px 6px',
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !url.trim() ? 0.65 : 1,
            transition: 'opacity 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#8b0000' }}
          onMouseLeave={e => (e.currentTarget.style.background = '#000')}
        >
          {loading ? 'Diagnosing…' : 'Issue Certificate'}
        </button>
      </form>

      <button
        type="button"
        onClick={onExample}
        style={{
          fontFamily: FONT,
          fontSize: '13px',
          fontStyle: 'italic',
          color: '#666',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#8b0000')}
        onMouseLeave={e => (e.currentTarget.style.color = '#938882')}

      >
        try an example →
      </button>
    </div>
  )
}
