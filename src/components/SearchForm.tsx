'use client'

import { FormEvent } from 'react'
import { track } from '@vercel/analytics'
import { CTA_RED, CTA_RED_HOVER } from '@/lib/cta'

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
    if (!url.trim()) return
    track('repo_submitted')
    onSubmit()
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <input
          autoFocus
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          style={{
            fontFamily: FONT,
            fontSize: '16px',
            flex: 1,
            height: '54px',
            padding: '0 16px',
            background: '#fff',
            border: '2px solid #e0e0e0',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            color: '#160A06',
            outline: 'none',
            minWidth: 0,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#888'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,10,6,0.08)'
            e.currentTarget.style.transform = 'scale(1.01)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#e0e0e0'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Issue death certificate"
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            width: '88px',
            height: '54px',
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
          {loading ? '…' : 'BURY IT'}
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
          padding: '4px 0',
          textAlign: 'center',
          width: '100%',
          transition: 'color 0.15s',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#555'
          e.currentTarget.style.textDecoration = 'underline'
          e.currentTarget.style.textUnderlineOffset = '3px'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#938882'
          e.currentTarget.style.textDecoration = 'none'
        }}
      >
        Try a known repo →
      </button>
    </div>
  )
}
