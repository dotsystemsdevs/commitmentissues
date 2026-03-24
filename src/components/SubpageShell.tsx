import type { ReactNode } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'

const UI = `var(--font-dm), -apple-system, sans-serif`

type Props = {
  subtitle: ReactNode
  title?: string
  microcopy?: ReactNode | null
  headerExtra?: ReactNode
  children: ReactNode
}

export default function SubpageShell({ subtitle, title, microcopy, headerExtra, children }: Props) {
  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">
        <div style={{ paddingBottom: '4px', marginBottom: '2px' }}>
          <Link
            href="/"
            aria-label="Back to home"
            style={{
              fontFamily: UI,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0a0a0a',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              padding: '4px 0',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
            back
          </Link>
        </div>

        <PageHero subtitle={subtitle} title={title} microcopy={microcopy} brandHref="/" hideEmoji />
        {headerExtra ? <div className="page-hero-extra">{headerExtra}</div> : null}

        <div className="page-shell-body page-shell-body--subpage">{children}</div>

        <SiteFooter />
      </div>
    </main>
  )
}
