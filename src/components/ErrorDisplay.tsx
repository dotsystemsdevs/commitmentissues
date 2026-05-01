'use client'

import { AnalysisError } from '@/hooks/useRepoAnalysis'

const FONT = `var(--font-courier), system-ui, sans-serif`

interface Props {
  error: AnalysisError
  onRetry: () => void
}

export default function ErrorDisplay({ error, onRetry }: Props) {
  return (
    <div style={{ width: '100%', marginTop: '24px', fontFamily: FONT }}>
      <div style={{ borderLeft: '2px solid var(--c-red)', paddingLeft: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--c-red)', margin: '0 0 4px 0' }}>
          {error.message}
        </p>
        {error.retryAfter ? (
          <p style={{ fontSize: '13px', color: 'var(--c-muted)', margin: 0 }}>retry in {error.retryAfter}s</p>
        ) : (
          <button
            className="alive-interactive"
            onClick={onRetry}
            style={{
              fontFamily: FONT,
              fontSize: '13px',
              color: 'var(--c-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
          >
            bury something else →
          </button>
        )}
      </div>
    </div>
  )
}
