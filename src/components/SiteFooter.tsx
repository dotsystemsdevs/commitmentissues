'use client'

import Link from 'next/link'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

const LINKS = [
  { href: '/faq',     label: 'FAQ'     },
  { href: '/pricing', label: 'Pricing' },
  { href: '/terms',   label: 'Terms'   },
  { href: '/privacy', label: 'Privacy' },
] as const

export default function SiteFooter() {
  return (
    <footer style={{
      width: '100vw',
      marginLeft: 'calc(50% - 50vw)',
      background: '#0a0a0a',
      marginTop: 'auto',
    }}>
      {/* Nav row */}
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '18px 24px',
        borderBottom: '1px solid #2a1a10',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px 8px',
        justifyContent: 'center',
      }}>
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: FONT,
              fontSize: '13px',
              color: '#6b5040',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c8b99a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b5040')}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '14px 24px max(14px, env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ fontFamily: MONO, fontSize: '12px', color: '#4a3020', fontStyle: 'italic' }}>
          no repos were harmed in the making of this site.
        </span>
        <span style={{ fontFamily: FONT, fontSize: '12px', color: '#4a3020' }}>
          © commitmentissues.dev
        </span>
      </div>
    </footer>
  )
}
