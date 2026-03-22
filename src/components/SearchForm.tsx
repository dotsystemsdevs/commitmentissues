'use client'

import { FormEvent } from 'react'
import { CTA_ISSUE, CTA_ISSUING, CTA_RED, CTA_RED_HOVER } from '@/lib/cta'

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
    onSubmit()
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <input
          autoFocus
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          style={{
            fontFamily: FONT,
            fontSize: '16px',
            width: '100%',
            height: '52px',
            padding: '0 20px',
            background: '#fff',
            border: '2px solid #e0e0e0',
            borderBottom: 'none',
            borderRadius: '8px 8px 0 0',
            color: '#160A06',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#888'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#e0e0e0'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="cta-btn"
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            width: '100%',
            height: '52px',
            background: CTA_RED,
            color: '#fff',
            border: 'none',
            borderRadius: '0 0 8px 8px',
            cursor: loading ? 'wait' : 'pointer',
            transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = CTA_RED_HOVER
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = CTA_RED
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading ? CTA_ISSUING : CTA_ISSUE}
        </button>
      </form>

      <button
        type="button"
        onClick={onExample}
        style={{
          fontFamily: FONT,
          fontSize: '13px',
          color: '#8a7060',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          textAlign: 'left',
          transition: 'color 0.15s, letter-spacing 0.15s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = CTA_RED
          e.currentTarget.style.letterSpacing = '0.03em'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#8a7060'
          e.currentTarget.style.letterSpacing = '0.01em'
        }}
      >
        ☠ Try it on atom/atom — already dead →
      </button>
    </div>
  )
}
