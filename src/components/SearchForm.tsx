'use client'

import { FormEvent } from 'react'
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
    onSubmit()
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <input
          autoFocus
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          style={{
            fontFamily: FONT,
            fontSize: '16px',
            flex: 1,
            height: '52px',
            padding: '0 16px',
            background: '#fff',
            border: '2px solid #e0e0e0',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            color: '#160A06',
            outline: 'none',
            minWidth: 0,
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
          style={{
            fontFamily: FONT,
            fontSize: '20px',
            width: '56px',
            height: '52px',
            flexShrink: 0,
            background: CTA_RED,
            color: '#fff',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, transform 0.12s',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = CTA_RED_HOVER
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = CTA_RED
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {loading ? '…' : '→'}
        </button>
      </form>

      <button
        type="button"
        onClick={onExample}
        style={{
          fontFamily: FONT,
          fontSize: '13px',
          color: '#aaa',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          textAlign: 'left',
          transition: 'color 0.15s',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#555' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#aaa' }}
      >
        Try on atom/atom — already dead →
      </button>
    </div>
  )
}
