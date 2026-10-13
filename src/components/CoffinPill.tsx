'use client'

import { track } from '@vercel/analytics'

/** Top-right pill: who made the morgue, linking to Stackpine. */
export default function CoffinPill() {
  return (
    <a
      href="https://stackpine.app/?ref=commitmentissues"
      target="_blank"
      rel="noopener"
      aria-label="Powered by Stackpine"
      onClick={() => track('stackpine_clicked', { from: 'top_right_pill' })}
      className="coffin-pill coffin-pill--visible"
    >
      <svg aria-hidden width="13" height="13" viewBox="0 0 48 48" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M24 6 31 15H17Z" />
        <path d="M18.5 18h11l6 8h-23Z" />
        <path d="M14 29h20l7 9H7Z" />
      </svg>
      <span className="coffin-pill-text">Powered by Stackpine</span>
    </a>
  )
}
