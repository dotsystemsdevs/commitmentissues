'use client'

import Link from 'next/link'
import GitHubIcon from '@/components/GitHubIcon'

const FONT = `var(--font-courier), system-ui, sans-serif`

interface SiteFooterProps {
  compact?: boolean
}

const linkStyle = {
  fontFamily: FONT, fontSize: '13px', color: '#8a8a8a',
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
  gap: '4px', transition: 'color 0.15s',
  WebkitTapHighlightColor: 'transparent',
} as const

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  return (
    <footer className={`site-footer${compact ? ' site-footer--compact' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <Link
          href="/about"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
        >
          About
        </Link>
        <span style={{ color: '#d0c8be', fontSize: '12px' }}>·</span>
        <Link
          href="/legal"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
        >
          Legal
        </Link>
        <span style={{ color: '#d0c8be', fontSize: '12px' }}>·</span>
        <a
          href="https://github.com/dotsystemsdevs/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
        >
          <GitHubIcon size={13} />
          GitHub
        </a>
        <span style={{ color: '#d0c8be', fontSize: '12px' }}>·</span>
        <a
          href="https://buymeacoffee.com/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = '#1f1f1f')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8a8a8a')}
        >
          ☕ Don&apos;t let us die
        </a>
      </div>
    </footer>
  )
}
