import type { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  subtitle: ReactNode
  /** Second gray line under subtitle (same slot on every page). */
  microcopy?: ReactNode | null
  /** Wrap 🪦 + title in `<a href="/">` */
  brandHref?: string
  /** Wrap 🪦 + title in `<button>` (e.g. certificate reset) */
  onBrandClick?: () => void
}

export default function PageHero({
  subtitle,
  microcopy,
  brandHref,
  onBrandClick,
}: Props) {
  const titleBlock = (
    <>
      <div className="page-hero-emoji" aria-hidden>
        🪦
      </div>
      <h1 className="certificate-of-death-title page-hero-title">Certificate of Death</h1>
    </>
  )

  let brand: ReactNode
  if (brandHref) {
    brand = (
      <Link href={brandHref} className="page-hero-brand">
        {titleBlock}
      </Link>
    )
  } else if (onBrandClick) {
    brand = (
      <button type="button" onClick={onBrandClick} className="page-hero-brand page-hero-brand--btn">
        {titleBlock}
      </button>
    )
  } else {
    brand = <div className="page-hero-brand">{titleBlock}</div>
  }

  return (
    <header className="page-hero">
      <div className="page-hero-slot">
        <div className="page-hero-slot-spacer" aria-hidden />
      </div>
      {brand}
      <div className="page-hero-sub">{subtitle}</div>
      {microcopy != null && microcopy !== false ? <p className="page-hero-micro">{microcopy}</p> : null}
    </header>
  )
}
