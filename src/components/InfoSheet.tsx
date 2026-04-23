'use client'

import { useEffect, useState } from 'react'

const MONO = `var(--font-courier), system-ui, sans-serif`

const ABOUT_SECTIONS = [
  { title: 'About the Service', body: 'A parody examination tool for abandoned GitHub repositories. Submit a URL and receive an official-looking certificate of death, complete with cause, date, and last recorded words.' },
  { title: 'Method of Examination', body: "We query the GitHub public API — commit history, star count, open issues, archive status — and run a severity assessment. The cause of death is algorithmic, not editorial." },
  { title: 'Restricted Access', body: "Public repositories only. We do not access private code, credentials, or any data not already available through GitHub's public API." },
  { title: 'Records We Keep', body: 'No accounts. No signups. We log the most recent burials (repo name, generated cause, score, timestamp) to populate the public record on the homepage. Anonymous usage metrics only.' },
  { title: 'Contact', body: 'For anything that could not wait: ', email: 'dot.systems@proton.me' },
]

const LEGAL_SECTIONS = [
  {
    title: 'Terms of Use',
    body: 'Commitment Issues is a parody / entertainment tool. Generated "death certificates" are not legally valid documents. The tool analyzes public data from GitHub\'s public API. "Cause of death" labels are algorithmic and should not be treated as factual statements. By using the service you acknowledge we may display your submitted repo name publicly. We may update these terms; continued use means acceptance.',
  },
  {
    title: 'Privacy Notice',
    body: "We don't run accounts, logins, or collect passwords. When you submit a public GitHub URL or username, we use it to fetch public data from GitHub. We store a small recently-buried list on the homepage. We also use privacy-friendly analytics (aggregate counts, not personal profiles).",
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function InfoSheet({ open, onClose }: Props) {
  const [stats, setStats] = useState<{ buried: number; profiles: number } | null>(null)
  const [tab, setTab] = useState<'about' | 'legal'>('about')

  useEffect(() => {
    if (!open || stats) return
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setStats({ buried: d.buried ?? 0, profiles: d.profiles ?? 0 }))
      .catch(() => {})
  }, [open, stats])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 1100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#FAF6EF',
          borderTop: '2px solid #1a1a1a',
          zIndex: 1101,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drag handle + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 0' }}>
          <div style={{ width: '36px', height: '4px', background: '#cec6bb', borderRadius: '2px', margin: '0 auto' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: '16px', top: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: MONO, fontSize: '18px', color: '#9a9288',
              padding: '4px 8px', lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Stats bar */}
        {stats && (
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #e8e2d9', margin: '12px 20px 0' }}>
            <div style={{ flex: 1, textAlign: 'center', paddingBottom: '12px' }}>
              <p style={{ fontFamily: MONO, fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1 }}>{stats.buried.toLocaleString()}</p>
              <p style={{ fontFamily: MONO, fontSize: '10px', color: '#8a8278', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '4px 0 0' }}>repos buried</p>
            </div>
            <div style={{ width: '1px', background: '#e8e2d9', alignSelf: 'stretch' }} />
            <div style={{ flex: 1, textAlign: 'center', paddingBottom: '12px' }}>
              <p style={{ fontFamily: MONO, fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1 }}>{stats.profiles.toLocaleString()}</p>
              <p style={{ fontFamily: MONO, fontSize: '10px', color: '#8a8278', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '4px 0 0' }}>case files opened</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #1a1a1a', margin: '0 20px', marginTop: stats ? '16px' : '12px' }}>
          {(['about', 'legal'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, fontFamily: MONO, fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '10px 0',
                background: tab === t ? '#1a1a1a' : 'transparent',
                color: tab === t ? '#fff' : '#9a9288',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.12s, color 0.12s',
              }}
            >
              {t === 'about' ? 'About' : 'Legal'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px 24px' }}>
          {tab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ABOUT_SECTIONS.map(({ title, body, email }) => (
                <div key={title} style={{ padding: '14px 16px', border: '2px solid #1a1a1a', background: '#EDE8E1' }}>
                  <p style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8278', margin: '0 0 6px' }}>{title}</p>
                  <p style={{ fontFamily: MONO, fontSize: '13px', color: '#4a4440', lineHeight: 1.65, margin: 0 }}>
                    {body}
                    {email && <a href={`mailto:${email}`} style={{ color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{email}</a>}
                  </p>
                </div>
              ))}
              <a
                href="https://buymeacoffee.com/commitmentissues"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '14px', border: '2px solid #1a1a1a', background: '#EDE8E1',
                  fontFamily: MONO, fontSize: '13px', fontWeight: 700,
                  color: '#1a1a1a', textDecoration: 'none', letterSpacing: '0.04em',
                }}
              >
                ☕ don&apos;t let us die
              </a>
            </div>
          )}
          {tab === 'legal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LEGAL_SECTIONS.map(({ title, body }) => (
                <div key={title} style={{ padding: '14px 16px', border: '2px solid #1a1a1a', background: '#EDE8E1' }}>
                  <p style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a8278', margin: '0 0 6px' }}>{title}</p>
                  <p style={{ fontFamily: MONO, fontSize: '13px', color: '#4a4440', lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              ))}
              <p style={{ fontFamily: MONO, fontSize: '12px', color: '#9a9288', textAlign: 'center', margin: '4px 0 0' }}>
                Questions: <a href="mailto:dot.systems@proton.me" style={{ color: '#0a0a0a', textDecoration: 'underline' }}>dot.systems@proton.me</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
