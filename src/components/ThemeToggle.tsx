'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="alive-interactive"
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        padding: '8px',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--c-muted)',
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-ink)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}
    >
      {theme === 'light' ? '🕯️' : '💡'}
    </button>
  )
}
