'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'

const MONO = `var(--font-courier), system-ui, sans-serif`

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
            className="subpage-back-link alive-interactive"
            style={{
              fontFamily: MONO,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#9a9288',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.06em',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9a9288' }}
          >
            ← home
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
