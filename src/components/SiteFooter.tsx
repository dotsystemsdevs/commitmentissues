'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import GitHubIcon from '@/components/GitHubIcon'

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

function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

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
          Open source
        </a>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <a
          href="https://x.com/Dotsystemsdevs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X"
          onClick={() => track('social_clicked', { platform: 'x', from: 'footer' })}
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          <XIcon size={12} />
          X
        </a>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <a
          href="https://www.instagram.com/dotsystemsdevs/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          onClick={() => track('social_clicked', { platform: 'instagram', from: 'footer' })}
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          <InstagramIcon size={13} />
          Instagram
        </a>
        <span style={{ color: 'var(--c-border-light)', fontSize: '12px' }}>·</span>
        <a
          href="https://buymeacoffee.com/dotdevs"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('buy_me_a_coffin_clicked', { from: 'footer' })}
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}
        >
          ⚰  Buy me a coffin
        </a>
      </div>
    </footer>
  )
}
