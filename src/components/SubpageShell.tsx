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
  hideHero?: boolean
  children: ReactNode
}

export default function SubpageShell({ subtitle, title, microcopy, headerExtra, hideHero = false, children }: Props) {
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
              color: 'var(--c-muted)',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.06em',
              WebkitTapHighlightColor: 'transparent',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--c-ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--c-muted)' }}
          >
            ← home
          </Link>
        </div>

        {!hideHero ? (
          <>
            <PageHero subtitle={subtitle} title={title} microcopy={microcopy} brandHref="/" hideEmoji />
            {headerExtra ? <div className="page-hero-extra">{headerExtra}</div> : null}
          </>
        ) : null}

        <div className="page-shell-body page-shell-body--subpage">{children}</div>

        <SiteFooter />
      </div>
    </main>
  )
}
