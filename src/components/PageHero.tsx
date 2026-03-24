import type { ReactNode } from 'react'
import Link from 'next/link'
import TombstoneIcon from '@/components/TombstoneIcon'

type Props = {
  subtitle: ReactNode
  /** Override the h1 text — defaults to "Certificate of Death" */
  title?: string
  /** Second gray line under subtitle (same slot on every page). */
  microcopy?: ReactNode | null
  /** Wrap 🪦 + title in `<a href="/">` */
  brandHref?: string
  /** Wrap 🪦 + title in `<button>` (e.g. certificate reset) */
  onBrandClick?: () => void
  /** Hide the tombstone emoji (subpages) */
  hideEmoji?: boolean
}

export default function PageHero({
  subtitle,
  title = 'Certificate of Death',
  microcopy,
  brandHref,
  onBrandClick,
  hideEmoji = false,
}: Props) {
  // Gothic font only for the product title "Certificate of Death"
  const isGothic = title === 'Certificate of Death'

  const titleBlock = (
    <>
      {!hideEmoji && (
        <div className="page-hero-emoji" aria-hidden>
          <TombstoneIcon className="tombstone-icon tombstone-icon--fade-bottom" />
        </div>
      )}
      <h1 className={`page-hero-title${isGothic ? ' certificate-of-death-title' : ' page-hero-title--sans'}`}>
        {title}
      </h1>
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
      {brand}
      <div className="page-hero-sub">{subtitle}</div>
      {microcopy != null && microcopy !== false ? <p className="page-hero-micro">{microcopy}</p> : null}
    </header>
  )
}
