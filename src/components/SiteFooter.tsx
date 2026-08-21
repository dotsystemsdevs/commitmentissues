'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import GitHubIcon from '@/components/GitHubIcon'

interface SiteFooterProps {
  compact?: boolean
}

function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default function SiteFooter({ compact = false }: SiteFooterProps) {
  return (
    <footer className={`site-footer${compact ? ' site-footer--compact' : ''}`}>
      <nav className="footer-row" aria-label="Site footer">
        <div className="footer-group">
          <Link href="/about" className="footer-link">About</Link>
          <span className="footer-sep" aria-hidden>·</span>
          <Link href="/legal" className="footer-link">Legal</Link>
          <span className="footer-sep" aria-hidden>·</span>
          <a
            href="https://github.com/dotsystemsdevs/commitmentissues"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <GitHubIcon size={13} />
            <span className="footer-link-text">Open source</span>
          </a>
        </div>

        <span className="footer-divider" aria-hidden />

        <div className="footer-group footer-group--socials">
          <a
            href="https://x.com/Dotsystemsdevs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on X"
            title="Follow on X"
            onClick={() => track('social_clicked', { platform: 'x', from: 'footer' })}
            className="footer-link footer-link--icon"
          >
            <XIcon size={14} />
          </a>
          <a
            href="https://www.instagram.com/dotsystemsdevs/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on Instagram"
            title="Follow on Instagram"
            onClick={() => track('social_clicked', { platform: 'instagram', from: 'footer' })}
            className="footer-link footer-link--icon"
          >
            <InstagramIcon size={15} />
          </a>
        </div>
      </nav>
    </footer>
  )
}
