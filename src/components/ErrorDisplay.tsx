'use client'

import { AnalysisError } from '@/hooks/useRepoAnalysis'

const FONT = `var(--font-dm), -apple-system, sans-serif`

interface Props {
  error: AnalysisError
  onRetry: () => void
}

export default function ErrorDisplay({ error, onRetry }: Props) {
  return (
    <div style={{ width: '100%', marginTop: '24px', fontFamily: FONT }}>
      <div style={{ borderLeft: '3px solid #8B1A1A', paddingLeft: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#8B1A1A', margin: '0 0 4px 0' }}>
          {error.message}
        </p>
        {error.retryAfter ? (
          <p style={{ fontSize: '13px', color: '#7A5C38', margin: 0 }}>retry in {error.retryAfter}s</p>
        ) : (
          <button
            className="alive-interactive"
            onClick={onRetry}
            style={{
              fontFamily: FONT,
              fontSize: '13px',
              color: '#7A5C38',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2A1A0E')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A5C38')}
          >
            bury something else →
          </button>
        )}
      </div>
    </div>
  )
}
