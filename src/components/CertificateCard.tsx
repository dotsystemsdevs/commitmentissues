'use client'

import { useRef, useState, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import { DeathCertificate } from '@/lib/types'
import { CTA_RED, CTA_RED_HOVER } from '@/lib/cta'
import PageHero from '@/components/PageHero'

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

export default function CertificateCard({ cert, onReset }: Props) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visible,   setVisible]   = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy link')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // ONE source of truth — watermark=true adds "commitmentissues.dev" footer to the canvas
  async function exportBlob(pixelRatio: number, watermark = false): Promise<Blob | null> {
    if (!cardRef.current) return null
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.zoom = '1'
    const blob = await toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: '#FAF6EF',
      width: 480,
      height: 679,
    })
    if (wrapper) wrapper.style.zoom = ''
    if (!blob || !watermark) return blob

    // Stamp "commitmentissues.dev" across the bottom of the shared image
    const img = await createImageBitmap(blob)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.font = `${9 * pixelRatio}px "Courier New", monospace`
    ctx.letterSpacing = `${0.12 * pixelRatio}px`
    ctx.textAlign = 'center'
    ctx.fillText('COMMITMENTISSUES.DEV', canvas.width / 2, canvas.height - 10 * pixelRatio)
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'))
  }

  async function handleShare() {
    // Share image gets watermark — social-friendly, not print-ready
    const blob = await exportBlob(2, true)
    if (blob && navigator.canShare) {
      const file = new File([blob], `${cert.repoData.name}.png`, { type: 'image/png' })
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: cert.repoData.name, text: cert.shareText }) }
        catch { /* cancelled */ }
        fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'shared' }) }).catch(() => {})
        return
      }
    }
    setShowModal(true)
  }

  // Download = paid product, links to pricing/checkout
  function handleDownload() {
    window.location.href = '/pricing'
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText('https://commitmentissues.dev')
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy link'), 2000)
    } catch { /* ignore */ }
    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'shared' }) }).catch(() => {})
  }

function handleTweet() {
    const text = encodeURIComponent(`${cert.repoData.fullName} has officially died.\n\nCause of death: ${cert.causeOfDeath}\n\nRIP 🪦`)
    const url  = encodeURIComponent('https://commitmentissues.dev')
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'shared' }) }).catch(() => {})
  }

  const { repoData: r } = cert
  const MONO = `var(--font-courier), "Courier New", monospace`
  const UI   = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── Share modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '360px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #eee' }}>
              <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#938882', margin: '0 0 4px 0' }}>Share</p>
              <p style={{ fontFamily: UI, fontSize: '1.05rem', fontWeight: 600, color: '#160A06', margin: 0, lineHeight: 1.25 }}>{r.name} is officially dead</p>
            </div>
            {([
              { label: copyLabel, sub: 'commitmentissues.dev', fn: handleCopyLink },
              { label: 'Post on X', sub: 'Opens X with pre-filled text', fn: handleTweet },
            ] as { label: string; sub: string; fn: () => void }[]).map(({ label, sub, fn }) => (
              <button
                key={label}
                onClick={fn}
                style={{ display: 'block', width: '100%', padding: '16px 24px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#160A06' }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: '12px', color: '#938882', marginTop: '2px' }}>{sub}</div>
              </button>
            ))}
            <button
              onClick={() => setShowModal(false)}
              style={{ display: 'block', width: '100%', padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: '13px', color: '#938882', textAlign: 'center' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <PageHero
        subtitle={
          <>
            The death of <strong style={{ color: '#160A06' }}>{r.fullName}</strong> has been officially recorded.
          </>
        }
        microcopy={null}
        onBrandClick={onReset}
      />

      {/* ── Actions ── */}
      <div className="cert-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>

        {/* Download — filled black, paid, top = primary */}
        <button
          onClick={handleDownload}
          style={{ width: '100%', fontFamily: UI, background: CTA_RED, color: '#fff', border: 'none', borderRadius: '8px', padding: '17px 20px', cursor: 'pointer', transition: 'background 0.15s, transform 0.12s, box-shadow 0.12s', transform: 'translateY(0)', boxShadow: 'none', textAlign: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = CTA_RED_HOVER; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.22)' }}
          onMouseLeave={e => { e.currentTarget.style.background = CTA_RED; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Get the official certificate →</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '4px', letterSpacing: '0.02em' }}>Printable · High-res · No watermark · $4.99</div>
        </button>

        {/* Share — outlined, free */}
        <button
          onClick={handleShare}
          style={{ width: '100%', fontFamily: UI, background: 'transparent', color: CTA_RED, border: `1.5px solid ${CTA_RED}`, borderRadius: '8px', padding: '15px 20px', cursor: 'pointer', transition: 'background 0.15s, transform 0.12s', transform: 'translateY(0)', textAlign: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Share</div>
        </button>

      </div>

      {/* ── Certificate — fixed 480×679, wrapper handles mobile scale ── */}
      <div ref={wrapperRef} className="certificate-wrapper relative" style={{ width: '480px' }}>

        {/* Stamp overlay — display only, not captured */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="select-none" style={{ transform: 'rotate(-12deg)', border: '5px solid rgba(139,26,26,0.75)', borderRadius: '4px', padding: '12px 40px', background: 'rgba(139,26,26,0.04)' }}>
            <span style={{ fontFamily: UI, fontSize: '2.15rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(139,26,26,0.72)', display: 'block', textAlign: 'center', lineHeight: 1 }}>CERTIFIED DEAD</span>
            <p style={{ fontFamily: 'var(--font-courier), monospace', fontSize: '9px', letterSpacing: '0.4em', textAlign: 'center', marginTop: '6px', color: 'rgba(139,26,26,0.45)', textTransform: 'uppercase' }}>COMMITMENTISSUES.DEV</p>
          </div>
        </div>

        {/* cardRef — the single source for all exports */}
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
            width: '480px',
            height: '679px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            WebkitFontSmoothing: 'antialiased' as const,
            textRendering: 'optimizeLegibility' as const,
            boxSizing: 'border-box' as const,
          }}
        >
          <div style={{ flex: 1, border: '1px solid #1A0F06', display: 'flex', flexDirection: 'column', padding: '4% 7%', overflow: 'hidden', boxSizing: 'border-box' }}>

            {/* HEADER */}
            <div style={{ textAlign: 'center', paddingBottom: '3%', borderBottom: '2px solid #1A0F06' }}>
              <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.6em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 2% 0' }}>
                commitmentissues.dev
              </p>
              <h2 className="certificate-of-death-title" style={{ fontSize: '2.5rem', color: '#1A0F06', lineHeight: 1.05, margin: '0 0 2% 0' }}>
                Certificate of Death
              </h2>
              <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.25em', color: '#8B6B4A', margin: 0, fontStyle: 'italic' }}>
                official record of abandonment
              </p>
            </div>

            {/* REPO */}
            <div style={{ textAlign: 'center', padding: '3% 0', borderBottom: '1px solid #C4A882' }}>
              <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.4em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 2% 0' }}>
                this is to certify the death of
              </p>
              <p style={{ fontFamily: MONO, fontSize: '8px', color: '#8B6B4A', margin: '0 0 1% 0' }}>
                {r.fullName.split('/')[0]} /
              </p>
              <h3 style={{ fontFamily: UI, fontWeight: 700, fontSize: '2.05rem', color: '#1A0F06', lineHeight: 1.08, margin: 0, letterSpacing: '-0.02em' }}>
                {r.name}
              </h3>
              {r.description && (
                <p style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', margin: '2% 0 0 0', lineHeight: 1.6 }}>
                  {r.description}
                </p>
              )}
            </div>

            {/* CAUSE */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3% 0', borderBottom: '1px solid #C4A882' }}>
              <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.55em', color: '#8B6B4A', textTransform: 'uppercase', margin: '0 0 3% 0' }}>
                cause of death
              </p>
              <p style={{ fontFamily: UI, fontStyle: 'italic', fontWeight: 500, fontSize: '1.25rem', color: '#8B0000', lineHeight: 1.45, maxWidth: '24ch', margin: 0 }}>
                {cert.causeOfDeath}
              </p>
            </div>

            {/* DATE + AGE */}
            <div style={{ padding: '2.5% 0', borderBottom: '1px solid #C4A882' }}>
              {[
                { label: 'Date of death', value: cert.deathDate },
                { label: 'Age at death',  value: cert.age },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1% 0', borderBottom: i === 0 ? '1px solid #EDE5D8' : 'none' }}>
                  <span style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: '10px', color: '#1A0F06', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* STATS */}
            <div style={{ display: 'flex', padding: '2.5% 0', borderBottom: '1px solid #C4A882' }}>
              {[
                { icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="#1A0F06"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>, value: r.stargazersCount.toLocaleString(), label: 'stars' },
                { icon: <svg width="12" height="12" viewBox="0 0 16 16" fill="#1A0F06"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>, value: r.forksCount.toLocaleString(), label: 'forks' },
                ...(r.language ? [{ icon: null as React.ReactNode, value: r.language, label: 'language' }] : []),
              ].map(({ icon, value, label }, i, arr) => (
                <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
                  <div style={{ flex: 1, textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {icon}
                      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '0.9rem', color: '#1A0F06', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                    </div>
                    <p style={{ fontFamily: MONO, fontSize: '6px', color: '#8B6B4A', letterSpacing: '0.4em', textTransform: 'uppercase', margin: '4px 0 0 0' }}>{label}</p>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: '1px', background: '#C4A882', flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {/* LAST WORDS */}
            <div style={{ padding: '2.5% 0', textAlign: 'center' }}>
              <p style={{ fontFamily: MONO, fontSize: '7px', letterSpacing: '0.5em', textTransform: 'uppercase', color: '#8B6B4A', margin: '0 0 2% 0' }}>Last words</p>
              <p style={{ fontFamily: UI, fontStyle: 'italic', fontSize: '0.88rem', color: '#1A0F06', lineHeight: 1.6, margin: 0 }}>
                &ldquo;{cert.lastWords}&rdquo;
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
