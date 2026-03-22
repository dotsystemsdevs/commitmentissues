import type { ReactNode } from 'react'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'

type Props = {
  subtitle: ReactNode
  microcopy?: ReactNode | null
  /** Primary CTA under the two-line hero (e.g. FAQ) */
  headerExtra?: ReactNode
  children: ReactNode
}

export default function SubpageShell({ subtitle, microcopy, headerExtra, children }: Props) {
  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">
        <Link
          href="/"
          style={{
            fontFamily: `var(--font-dm), -apple-system, sans-serif`,
            fontSize: '13px',
            color: '#938882',
            textDecoration: 'none',
            display: 'inline-block',
            paddingTop: '12px',
            paddingBottom: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#160A06')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#938882')}
        >
          ← back
        </Link>
        <PageHero subtitle={subtitle} microcopy={microcopy} brandHref="/" />
        {headerExtra ? <div className="page-hero-extra">{headerExtra}</div> : null}

        <div className="page-shell-rule" role="presentation" />

        <div className="page-shell-body">{children}</div>

        <SiteFooter />
      </div>
    </main>
  )
}
