import type { ReactNode } from 'react'
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
        <PageHero subtitle={subtitle} microcopy={microcopy} brandHref="/" />
        {headerExtra ? <div className="page-hero-extra">{headerExtra}</div> : null}

        <div className="page-shell-rule" role="presentation" />

        <div className="page-shell-body">{children}</div>

        <SiteFooter />
      </div>
    </main>
  )
}
