'use client'

import Link from 'next/link'
import GitHubIcon from '@/components/GitHubIcon'
import ThemeToggle from '@/components/ThemeToggle'

const FONT = `var(--font-courier), system-ui, sans-serif`

interface SiteFooterProps {
  compact?: boolean
}

const linkStyle = {
  fontFamily: FONT, fontSize: '13px', color: 'var(--c-muted)',
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
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          About
        </Link>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <Link
          href="/legal"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          Legal
        </Link>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <a
          href="https://github.com/dotsystemsdevs/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          <GitHubIcon size={13} />
          GitHub
        </a>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <a
          href="https://buymeacoffee.com/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          ☕ Don&apos;t let us die
        </a>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
