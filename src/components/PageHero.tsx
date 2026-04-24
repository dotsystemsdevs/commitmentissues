import type { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  subtitle: ReactNode
  /** Override the h1 text — defaults to "Certificate of Death" */
  title?: string
  /** Second gray line under subtitle (same slot on every page). */
  microcopy?: ReactNode | null
  /** Wrap 🪦 + title in `<a href="/">` */
  brandHref?: string
  /** Hide the tombstone emoji (subpages) */
  hideEmoji?: boolean
}

export default function PageHero({
  subtitle,
  title = 'Certificate of Death',
  microcopy,
  brandHref,
  hideEmoji = false,
}: Props) {
  const isGothic = title === 'Certificate of Death'

  const titleBlock = (
    <>
      {!hideEmoji && (
        <div className="page-hero-emoji" aria-hidden>
          🪦
        </div>
      )}
      <h1 className={`page-hero-title${isGothic ? ' certificate-of-death-title' : ' page-hero-title--sans'}`}>
        {title}
      </h1>
    </>
  )

  const brand = brandHref ? (
    <Link href={brandHref} className="page-hero-brand">
      {titleBlock}
    </Link>
  ) : (
    <div className="page-hero-brand">{titleBlock}</div>
  )

  return (
    <header className="page-hero">
      {brand}
      <div className="page-hero-sub">{subtitle}</div>
      {microcopy != null && microcopy !== false ? <p className="page-hero-micro">{microcopy}</p> : null}
    </header>
  )
}
