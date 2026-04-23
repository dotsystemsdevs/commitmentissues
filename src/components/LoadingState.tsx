'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  'Checking for a pulse...',
  'None found. Proceeding.',
  'Reviewing commit history...',
  'Assessing cause of abandonment...',
  'Preparing the record...',
  'Filing the paperwork...',
  'Cause of death: confirmed.',
  'Stamping the certificate...',
]

const FONT = `var(--font-courier), system-ui, sans-serif`
const MONO = `var(--font-courier), system-ui, sans-serif`

export default function LoadingState() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 200)
    }, 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ width: '100%', textAlign: 'center', marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ fontSize: '56px', lineHeight: 1, animation: 'loading-float 1.8s ease-in-out infinite' }}>
        🪦
      </div>
      <p style={{
        fontFamily: FONT,
        fontSize: '15px',
        fontWeight: 600,
        color: '#160A06',
        margin: 0,
        minHeight: '1.5em',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        {MESSAGES[index]}
      </p>
      <p style={{
        fontFamily: MONO,
        fontSize: '10px',
        color: '#b0aca8',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        preparing the record
      </p>
      <style>{`
        @keyframes loading-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
