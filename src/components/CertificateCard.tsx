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
    // Paid download: hide stamp so it doesn't appear in the clean version
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
    // Only attempt native share if the API is available
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

  // Download = paid product — saves cert locally, then Stripe checkout
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

  const { repoData: r } = cert
  const UI = `var(--font-dm), -apple-system, sans-serif`

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
              { key: 'copy', label: copyLabel, sub: 'commitmentissues.dev', fn: handleCopyLink },
              { key: 'tweet', label: 'Post on X', sub: 'Opens X with pre-filled text', fn: handleTweet },
            ] as { key: string; label: string; sub: string; fn: () => void }[]).map(({ key, label, sub, fn }) => (
              <button
                key={key}
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
      <div className="cert-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '16px' }}>

        {/* Download — premium card */}
        <button
          onClick={handleDownload}
          style={{
            width: '100%', fontFamily: UI, background: '#160A06', color: '#fff', border: 'none',
            borderRadius: '14px', padding: '20px 22px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'opacity 0.15s, transform 0.1s',
            marginBottom: '10px',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '5px' }}>
              Print it. Frame it. Send it to the author.
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 400, letterSpacing: '0.03em' }}>
              A4 · 300 dpi · no watermark
            </div>
          </div>
          <div style={{ flexShrink: 0, marginLeft: '20px', textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>$4.99</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '3px', letterSpacing: '0.04em' }}>one-time</div>
          </div>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e4e0db' }} />
          <span style={{ fontFamily: UI, fontSize: '11px', color: '#b8b2ac', letterSpacing: '0.04em', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e4e0db' }} />
        </div>

        {/* Share — clean text */}
        <button
          onClick={handleShare}
          style={{ width: '100%', fontFamily: UI, fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'center', color: '#6b6560', letterSpacing: '-0.01em', transition: 'color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#160A06' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6b6560' }}
        >
          share for free →
        </button>

      </div>

      {/* ── Certificate — fixed 480×679, CSS var scales on mobile ── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
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

    </div>
  )
}
