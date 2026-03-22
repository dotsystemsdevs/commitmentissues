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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <input
          autoFocus
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="e.g. facebook/react"
          style={{
            fontFamily: FONT,
            fontSize: '16px',
            width: '100%',
            height: '48px',
            padding: '0 18px',
            background: '#fff',
            border: '1.5px solid #ddd',
            borderRadius: '6px 6px 0 0',
            color: '#160A06',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#8b0000')}
          onBlur={e => (e.currentTarget.style.borderColor = '#ddd')}
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
            opacity: loading || !url.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#8b0000'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,0,0,0.3)' } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {loading ? 'Issuing…' : 'Issue death certificate'}
        </button>
      </form>

      <p style={{ fontFamily: FONT, fontSize: '11px', color: '#b0aca8', textAlign: 'center', margin: '-8px 0 0 0', letterSpacing: '0.03em' }}>
        no auth · no setup · instant result
      </p>

      <button
        type="button"
        onClick={onExample}
        style={{
          fontFamily: FONT,
          fontSize: '13px',
          color: '#938882',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          transition: 'color 0.15s',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textUnderlineOffset: '3px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#8b0000')}
        onMouseLeave={e => (e.currentTarget.style.color = '#938882')}
      >
        Try killing a famous repo →
      </button>
    </div>
  )
}
