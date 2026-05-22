'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

const REVEAL_AT = 180 // px scrolled before the pill fades in

export default function CoffinPill() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > REVEAL_AT)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a
      href="https://buymeacoffee.com/dotdevs"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffin: support the morgue"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => track('buy_me_a_coffin_clicked', { from: 'top_right_pill' })}
      className={`coffin-pill${visible ? ' coffin-pill--visible' : ''}`}
    >
      <span aria-hidden style={{ fontSize: '13px', lineHeight: 1 }}>⚰</span>
      <span className="coffin-pill-text">Buy me a coffin</span>
    </a>
  )
}
