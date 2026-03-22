'use client'

import { useState } from 'react'
import Link from 'next/link'

const SERIF = `var(--font-dm), -apple-system, sans-serif`
const SANS  = `var(--font-dm), -apple-system, sans-serif`

const NAV_LINKS = [
  { href: '/faq',     label: 'FAQ'     },
  { href: '/pricing', label: 'Pricing' },
]

export default function TopBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="topbar" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '52px',
        background: '#160A06',
        borderBottom: '1px solid #222',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 28px',
        zIndex: 100,
      }}>

        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>🪦</span>
          <span style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, fontStyle: 'italic', color: '#f5f0e8', letterSpacing: '0.01em' }}>
            commitmentissues
          </span>
          <span style={{ fontFamily: SANS, fontSize: '10px', color: '#a89070', letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: '2px', marginTop: '2px' }}>
            .dev
          </span>
        </Link>

        {/* Center nav — hidden on mobile */}
        <div className="topbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'center' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontFamily: SERIF, fontSize: '14px', color: '#c8b99a', textDecoration: 'none', borderRadius: '4px', padding: '5px 12px', transition: 'color 0.12s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#c8b99a')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right — Star (desktop) + Hamburger (mobile) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>

          {/* Hamburger — visible on mobile */}
          <button
            className="topbar-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ display: 'block', width: '22px', height: '2px', background: open ? 'transparent' : '#f5f0e8', transition: 'background 0.15s' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#f5f0e8', transform: open ? 'translateY(-7px) rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#f5f0e8', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '52px',
          left: 0,
          right: 0,
          background: '#160A06',
          borderBottom: '1px solid #222',
          zIndex: 99,
          padding: '8px 0 16px',
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ display: 'block', fontFamily: SERIF, fontSize: '16px', color: '#c8b99a', textDecoration: 'none', padding: '12px 28px' }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
