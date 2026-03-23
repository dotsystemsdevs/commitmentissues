'use client'

import { useRef, useState, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import { DeathCertificate } from '@/lib/types'
import PageHero from '@/components/PageHero'
import CertificateSheet from '@/components/CertificateSheet'

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

export default function CertificateCard({ cert, onReset }: Props) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stampRef   = useRef<HTMLDivElement>(null)
  const topRef     = useRef<HTMLDivElement>(null)
  const [visible,   setVisible]   = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy link')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Auto-scroll so certificate top is visible after load
  useEffect(() => {
    if (visible && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [visible])

  // watermark=false → paid clean export (stamp hidden, pixelRatio 5.167 = 2480px, true 300 DPI on A4)
  // watermark=true  → free share export (pixelRatio 2 = 960px, stamp visible)
  async function exportBlob(pixelRatio: number, watermark = false): Promise<Blob | null> {
    if (!cardRef.current) return null
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.zoom = '1'
    if (!watermark && stampRef.current) stampRef.current.style.visibility = 'hidden'
    const blob = await toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: '#FAF6EF',
      width: 480,
      height: 679,
    })
    if (!watermark && stampRef.current) stampRef.current.style.visibility = ''
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
    if (navigator.canShare) {
      const blob = await exportBlob(2, true)
      if (blob) {
        const file = new File([blob], `${cert.repoData.name}.png`, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], title: cert.repoData.name, text: cert.shareText }) }
          catch { /* cancelled */ }
          fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'shared' }) }).catch(() => {})
          return
        }
      }
    }
    setShowModal(true)
  }

  async function handleDownload() {
    try {
      localStorage.setItem('pending_cert', JSON.stringify(cert))
    } catch { /* ignore */ }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: cert.repoData.fullName }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      window.location.href = '/pricing'
    }
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

  async function handleDownloadWatermarked() {
    const blob = await exportBlob(2, true)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cert.repoData.name}-death-certificate.png`
    a.click()
    URL.revokeObjectURL(url)
    fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'shared' }) }).catch(() => {})
    setShowModal(false)
  }

  const { repoData: r } = cert
  const UI = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div ref={topRef} style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── Share modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '360px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'modal-fadein 0.18s ease' }}
          >
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #eee' }}>
              <p style={{ fontFamily: UI, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#938882', margin: '0 0 4px 0' }}>Share</p>
              <p style={{ fontFamily: UI, fontSize: '1.05rem', fontWeight: 600, color: '#160A06', margin: 0, lineHeight: 1.25 }}>{r.name} is officially dead</p>
            </div>
            {([
              { key: 'copy',     label: copyLabel,                     sub: 'commitmentissues.dev',           fn: handleCopyLink },
              { key: 'tweet',    label: 'Post on X',                   sub: 'Opens X with pre-filled text',   fn: handleTweet },
              { key: 'download', label: 'Download image (watermarked)', sub: 'Free PNG · 960px · includes site URL', fn: handleDownloadWatermarked },
            ] as { key: string; label: string; sub: string; fn: () => void }[]).map(({ key, label, sub, fn }) => (
              <button
                key={key}
                onClick={fn}
                style={{ display: 'block', width: '100%', padding: '16px 24px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#160A06' }}>{label}</div>
                <div style={{ fontFamily: UI, fontSize: '12px', color: '#938882', marginTop: '2px' }}>{sub}</div>
              </button>
            ))}
            <button
              onClick={() => setShowModal(false)}
              style={{ display: 'block', width: '100%', padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: '13px', color: '#938882', textAlign: 'center', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Title ── */}
      <PageHero
        subtitle={
          <>
            The death of <strong style={{ color: '#160A06' }}>{r.fullName}</strong> has been officially recorded.
          </>
        }
        microcopy={null}
        onBrandClick={onReset}
      />

      {/* ── Certificate — fixed 480×679, CSS var scales on mobile ── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div
          ref={wrapperRef}
          style={{
            width: '480px',
            transformOrigin: 'top center',
            transform: 'scale(var(--cert-scale, 1))',
            marginBottom: 'calc((679px * var(--cert-scale, 1)) - 679px)',
          }}
        >
          <CertificateSheet
            ref={cardRef}
            cert={cert}
            visible={visible}
            showStamp={true}
            stampRef={stampRef}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="cert-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '16px' }}>

        {/* Share — PRIMARY: full width, black, 18px */}
        <button
          onClick={handleShare}
          className="cert-share-btn"
          style={{
            width: '100%',
            fontFamily: UI,
            fontSize: '18px',
            fontWeight: 700,
            background: '#0a0a0a',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '18px 24px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'opacity 0.15s, transform 0.1s',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            marginBottom: '16px',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        >
          Share the obituary →
        </button>

        {/* Download — SECONDARY: outlined, price as subtext below */}
        <button
          onClick={handleDownload}
          className="cert-buy-btn"
          style={{
            width: '100%',
            fontFamily: UI,
            fontSize: '14px',
            fontWeight: 600,
            background: 'transparent',
            color: '#0a0a0a',
            border: '1.5px solid #c8c8c8',
            borderRadius: '10px',
            padding: '14px 24px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#888'; e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#c8c8c8'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        >
          Download in high resolution
        </button>

        {/* Dimensions subtext — converts technical users */}
        <p style={{
          fontFamily: UI,
          fontSize: '11px',
          color: '#b0aca8',
          textAlign: 'center',
          margin: '6px 0 0 0',
        }}>
          2480 × 3508px · 300 DPI · print-ready · no watermark
        </p>

        {/* Price + pixel pitch — discovered, not announced */}
        <p style={{
          fontFamily: UI,
          fontSize: '11px',
          color: '#b0aca8',
          textAlign: 'center',
          fontStyle: 'italic',
          margin: '4px 0 0 0',
        }}>
          $4.99 · free share is 960px, this is 2480px
        </p>

        {/* Issue another link */}
        <button
          type="button"
          onClick={onReset}
          style={{
            fontFamily: UI,
            fontSize: '13px',
            color: '#938882',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px 0 4px',
            textAlign: 'center',
            width: '100%',
            transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#160A06'; e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.textUnderlineOffset = '3px' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#938882'; e.currentTarget.style.textDecoration = 'none' }}
        >
          issue another →
        </button>

      </div>

    </div>
  )
}
