'use client'

import { track } from '@vercel/analytics'

export default function CoffinPill() {
  return (
    <a
      href="https://buymeacoffee.com/dotdevs"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffin — support the morgue"
      onClick={() => track('buy_me_a_coffin_clicked', { from: 'top_right_pill' })}
      className="coffin-pill"
    >
      <span aria-hidden style={{ fontSize: '13px', lineHeight: 1 }}>⚰</span>
      <span className="coffin-pill-text">Buy me a coffin</span>
    </a>
  )
}
