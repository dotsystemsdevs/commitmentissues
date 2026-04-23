'use client'

import { useState } from 'react'
import InfoSheet from '@/components/InfoSheet'

const FONT = `var(--font-courier), system-ui, sans-serif`

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

interface SiteFooterProps {
  compact?: boolean
}

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <footer className={`site-footer${compact ? ' site-footer--compact' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              fontFamily: FONT, fontSize: '13px', color: '#8a8a8a',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 0', transition: 'color 0.15s',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
          >
            About · Legal
          </button>
          <span style={{ color: '#d0c8be', fontSize: '12px' }}>·</span>
          <a
            href="https://github.com/dotsystemsdevs/commitmentissues"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT, fontSize: '13px', color: '#8a8a8a',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              gap: '4px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
        <p style={{ fontFamily: FONT, fontSize: '11px', color: '#b0aca8', letterSpacing: '0.04em', margin: 0 }}>
          official records of abandonment
        </p>
      </footer>
      <InfoSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}
