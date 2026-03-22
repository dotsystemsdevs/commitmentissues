'use client'

import { useRef, useState, useEffect } from 'react'
import { DeathCertificate } from '@/lib/types'

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

export default function CertificateCard({ cert, onReset }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const igRef  = useRef<HTMLDivElement>(null)
  const [visible,      setVisible]      = useState(false)
  const [showStamp,    setShowStamp]    = useState(false)
  const [stampFading,  setStampFading]  = useState(false)
  const [shareLabel,   setShareLabel]   = useState('Share')

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => setShowStamp(true), 700)
    const t3 = setTimeout(() => setStampFading(true), 1700)
    const t4 = setTimeout(() => { setShowStamp(false); setStampFading(false) }, 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // Download → A4 PNG from the visible certificate card
  async function handleDownload() {
    if (!cardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#FAF6EF',
      scale: 3,
      useCORS: true,
      logging: false,
    })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${cert.repoData.name}-death-certificate.png`
    a.click()
  }

  // Share → Instagram 1080×1350 PNG from hidden ig card
  async function handleShare() {
    if (!igRef.current) return
    setShareLabel('…')
    const { default: html2canvas } = await import('html2canvas')
    // igRef is 360×450 → scale 3 = 1080×1350
    const canvas = await html2canvas(igRef.current, {
      backgroundColor: '#FAF6EF',
      scale: 3,
      useCORS: true,
      logging: false,
    })

    if (navigator.canShare) {
      await new Promise<void>(resolve => {
        canvas.toBlob(async blob => {
          if (blob) {
            const file = new File([blob], `${cert.repoData.name}.png`, { type: 'image/png' })
            if (navigator.canShare({ files: [file] })) {
              try { await navigator.share({ files: [file], title: cert.repoData.name, text: cert.shareText }) }
              catch { /* cancelled */ }
              resolve()
              return
            }
          }
          // fallback: share URL
          try { await navigator.share({ title: cert.repoData.name, text: cert.shareText, url: 'https://commitmentissues.dev' }) }
          catch { /* cancelled */ }
          resolve()
        })
      })
    } else {
      // Desktop: download the Instagram image
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${cert.repoData.name}-ig.png`
      a.click()
    }

    setShareLabel('✓ done')
    setTimeout(() => setShareLabel('Share'), 2000)
  }

  const { repoData: r } = cert
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const MONO  = `var(--font-courier), "Courier New", monospace`
  const SERIF = `var(--font-playfair), Georgia, serif`
  const UI    = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── Page heading above buttons — matches homepage hero exactly ── */}
      <div style={{ textAlign: 'center', marginTop: '44px', marginBottom: '20px' }}>
        <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>🪦</div>
        <h1 style={{ fontFamily: 'var(--font-gothic), serif', fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', color: '#160A06', lineHeight: 0.95, margin: 0 }}>
          Certificate of Death
        </h1>
      </div>

      {/* ── Actions ── 3 buttons (outside zoom wrapper so they stay full-size on mobile) */}
      <div className="cert-actions" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={handleDownload}
          style={{
            flex: 1,
            fontFamily: UI,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '11px 12px',
            cursor: 'pointer',
            transition: 'background 0.15s, transform 0.12s, box-shadow 0.12s',
            transform: 'translateY(0)',
            boxShadow: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#8b0000'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,0,0,0.25)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ⬇ Download A4 — $4.99
        </button>

        <button
          onClick={handleShare}
          style={{
            flex: 1,
            fontFamily: UI,
            fontSize: '13px',
            fontWeight: 600,
            fontStyle: 'italic',
            background: 'transparent',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a',
            borderRadius: '6px',
            padding: '11px 12px',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s, transform 0.12s, box-shadow 0.12s',
            transform: 'translateY(0)',
            boxShadow: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1a1a1a'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {shareLabel === 'Share' ? 'Share free' : shareLabel}
        </button>

        <button
          onClick={onReset}
          style={{
            flex: 1,
            fontFamily: UI,
            fontSize: '13px',
            fontStyle: 'italic',
            background: 'transparent',
            color: '#938882',
            border: '1px solid #b0aca8',
            borderRadius: '6px',
            padding: '11px 12px',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s, transform 0.12s',
            transform: 'translateY(0)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#1a1a1a'
            e.currentTarget.style.borderColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#938882'
            e.currentTarget.style.borderColor = '#b0aca8'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          issue another →
        </button>
      </div>

      {/* ── Certificate (zoomed on mobile) ── */}
      <div className="certificate-wrapper relative" style={{ width: '480px' }}>

      {/* ── Stamp overlay ── */}
      {showStamp && (
        <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${stampFading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="px-12 py-6 select-none" style={{ transform: 'rotate(-12deg)', border: '4px solid #8B1A1A', background: 'rgba(139,26,26,0.04)', boxShadow: '0 0 0 1px rgba(139,26,26,0.1)' }}>
            <span className="font-serif text-4xl font-bold tracking-[0.15em] uppercase block text-center" style={{ color: '#8B1A1A' }}>CERTIFIED DEAD</span>
            <p className="font-mono text-[10px] tracking-[0.4em] text-center mt-1" style={{ color: 'rgba(139,26,26,0.5)' }}>COMMITMENTISSUES.DEV</p>
          </div>
        </div>
      )}

      {/* ── A4 Certificate ── */}
      <div
        ref={cardRef}
        className="certificate-card"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          background: '#FAF6EF',
          border: '3px solid #1A0F06',
          boxShadow: '0 4px 32px rgba(42,26,14,0.15)',
          aspectRatio: '210 / 297',
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
        }}
      >
        {/* Inner frame */}
        <div style={{ flex: 1, border: '1px solid #1A0F06', display: 'flex', flexDirection: 'column', padding: '6% 8%' }}>

          {/* HEADER */}
          <div style={{ textAlign: 'center', paddingBottom: '5%', borderBottom: '2px solid #1A0F06' }}>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.6em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 4% 0' }}>
              commitmentissues.dev
            </p>
            <div style={{ fontSize: '2.2rem', lineHeight: 1, marginBottom: '3%' }}>🪦</div>
            <h2 style={{ fontFamily: 'var(--font-gothic), serif', fontSize: '3rem', color: '#1A0F06', lineHeight: 1.05, margin: '0 0 3% 0' }}>
              Certificate of Death
            </h2>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.25em', color: '#8B6B4A', margin: 0, fontStyle: 'italic' }}>
              official record of abandonment
            </p>
          </div>

          {/* REPO */}
          <div style={{ textAlign: 'center', padding: '5% 0', borderBottom: '1px solid #C4A882' }}>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.4em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 3% 0' }}>
              this is to certify the death of
            </p>
            <p style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', margin: '0 0 1% 0' }}>
              {r.fullName.split('/')[0]} /
            </p>
            <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '2.8rem', color: '#1A0F06', lineHeight: 1.05, margin: 0 }}>
              {r.name}
            </h3>
            {r.description && (
              <p style={{ fontFamily: MONO, fontSize: '10px', color: '#8B6B4A', margin: '3% 0 0 0', lineHeight: 1.7 }}>
                {r.description}
              </p>
            )}
          </div>

          {/* CAUSE — hero, fills remaining space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5% 0', borderBottom: '1px solid #C4A882' }}>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.55em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 5% 0' }}>
              cause of death
            </p>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.75rem', color: '#8B0000', lineHeight: 1.4, maxWidth: '22ch', margin: 0 }}>
              {cert.causeOfDeath}
            </p>
          </div>

          {/* DATE + AGE */}
          <div style={{ padding: '4% 0', borderBottom: '1px solid #C4A882' }}>
            {[
              { label: 'Date of death', value: cert.deathDate },
              { label: 'Age at death',  value: cert.age },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1.5% 0', borderBottom: i === 0 ? '1px solid #EDE5D8' : 'none' }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#8B6B4A', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontFamily: MONO, fontSize: '11px', color: '#1A0F06', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div style={{ display: 'flex', padding: '4% 0', borderBottom: '1px solid #C4A882' }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="#1A0F06"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>, value: r.stargazersCount.toLocaleString(), label: 'stars' },
              { icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="#1A0F06"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>, value: r.forksCount.toLocaleString(), label: 'forks' },
              ...(r.language ? [{ icon: null as React.ReactNode, value: r.language, label: 'language' }] : []),
            ].map(({ icon, value, label }, i, arr) => (
              <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    {icon}
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '1rem', color: '#1A0F06', lineHeight: 1, wordBreak: 'break-all' }}>{value}</span>
                  </div>
                  <p style={{ fontFamily: MONO, fontSize: '7px', color: '#8B6B4A', letterSpacing: '0.4em', textTransform: 'uppercase', margin: '6% 0 0 0' }}>{label}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', background: '#C4A882' }} />}
              </div>
            ))}
          </div>

          {/* LAST WORDS */}
          <div style={{ padding: '4% 0', borderBottom: '1px solid #C4A882' }}>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#8B6B4A', margin: '0 0 3% 0' }}>Last words</p>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1rem', color: '#1A0F06', lineHeight: 1.7, margin: 0 }}>
              &ldquo;{cert.lastWords}&rdquo;
            </p>
          </div>


        </div>
      </div>

      {/* ── Hidden Instagram card 360×450 → renders at 1080×1350 ── */}
      <div
        ref={igRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '360px',
          height: '450px',
          background: '#FAF6EF',
          border: '1px solid #C4A882',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* IG: top label */}
        <div style={{ padding: '28px 32px 20px', textAlign: 'center', borderBottom: '1px solid #DDD0B8' }}>
          <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.35em', color: '#C4A882', textTransform: 'uppercase', marginBottom: '10px' }}>commitmentissues.dev</p>
          <p style={{ fontFamily: 'var(--font-gothic), serif', fontSize: '22px', color: '#2A1A0E', lineHeight: 1 }}>Certificate of Death</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#C4A882' }} />
            <span style={{ color: '#C4A882', fontSize: '10px' }}>☠</span>
            <div style={{ flex: 1, height: '1px', background: '#C4A882' }} />
          </div>
        </div>

        {/* IG: repo name */}
        <div style={{ padding: '20px 32px', textAlign: 'center', borderBottom: '1px solid #DDD0B8' }}>
          <p style={{ fontFamily: MONO, fontSize: '7px', color: '#C4A882', marginBottom: '4px', letterSpacing: '0.05em' }}>{r.fullName.split('/')[0]} /</p>
          <p style={{ fontFamily: SERIF, fontSize: '30px', color: '#2A1A0E', lineHeight: 1.05 }}>{r.name}</p>
        </div>

        {/* IG: cause — fills remaining space */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', textAlign: 'center', borderBottom: '1px solid #DDD0B8' }}>
          <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.3em', color: '#9C7E5A', textTransform: 'uppercase', marginBottom: '12px' }}>has passed away due to</p>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '18px', color: '#8B1A1A', lineHeight: 1.35 }}>{cert.causeOfDeath}</p>
        </div>

        {/* IG: date + footer */}
        <div style={{ padding: '14px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: MONO, fontSize: '7px', color: '#9C7E5A', marginBottom: '6px' }}>{cert.deathDate} · {cert.age}</p>
          <p style={{ fontFamily: MONO, fontSize: '6px', letterSpacing: '0.25em', color: '#C4A882', textTransform: 'uppercase' }}>commitmentissues.dev</p>
        </div>
      </div>

      </div>{/* end certificate-wrapper */}
    </div>
  )
}
