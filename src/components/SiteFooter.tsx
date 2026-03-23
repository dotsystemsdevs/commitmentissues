const FONT = `var(--font-dm), -apple-system, sans-serif`

const LINKS = [
  { href: '/faq',     label: 'FAQ'     },
  { href: '/terms',   label: 'Terms'   },
  { href: '/privacy', label: 'Privacy' },
] as const

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-nav" aria-label="Footer">
        {LINKS.map(({ href, label }) => (
          <a key={href} href={href} style={{ fontFamily: FONT }}>{label}</a>
        ))}
      </nav>
      <p className="site-footer-copy" style={{ fontFamily: FONT }}>For projects that were "almost done". · © commitmentissues.dev</p>
    </footer>
  )
}
