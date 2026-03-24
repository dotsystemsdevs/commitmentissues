'use client'

import { useRef, useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
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
  const [visible,    setVisible]    = useState(false)
  const [shareLabel, setShareLabel] = useState<string | null>(null)

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

  const stat = (counter: string) => fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter }) }).catch(() => {})

  async function handleShare() {
    track('share_clicked')
    if (navigator.canShare) {
      const blob = await exportBlob(2, true)
      if (blob) {
        const file = new File([blob], `${cert.repoData.name}.png`, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], title: cert.repoData.name, text: cert.shareText }) }
          catch { /* cancelled */ }
          stat('shared')
          return
        }
      }
    }
    try {
      await navigator.clipboard.writeText('https://commitmentissues.dev')
      setShareLabel('Link copied!')
      setTimeout(() => setShareLabel(null), 2000)
    } catch { /* ignore */ }
    stat('shared')
  }

  function handleTweet() {
    track('tweet_clicked')
    const text = encodeURIComponent(`RIP ${cert.repoData.fullName}.\n\nCause of death: ${cert.causeOfDeath}\n\n💀`)
    const url  = encodeURIComponent('https://commitmentissues.dev')
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    stat('shared')
  }

  async function handleDownload(pixelRatio: number, suffix: string) {
    const blob = await exportBlob(pixelRatio, true)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cert.repoData.name}-${suffix}.png`
    a.click()
    URL.revokeObjectURL(url)
    stat('downloaded')
  }

  const { repoData: r } = cert
  const UI = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div ref={topRef} style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>

        {/* Primary: Share */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', fontFamily: UI, fontSize: '17px', fontWeight: 700,
            background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '18px 24px', cursor: 'pointer', textAlign: 'center',
            transition: 'opacity 0.15s, transform 0.1s',
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        >
          💀 {shareLabel ?? 'Share this certificate →'}
        </button>

        {/* Platform row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {([
            { label: '𝕏  Post on X',       sub: 'Pre-filled tweet',          fn: handleTweet },
            { label: '📷  Instagram',        sub: 'Download optimised image',  fn: () => handleDownload(2, 'instagram') },
            { label: '↓  Download A4',      sub: 'High-res PNG',              fn: () => handleDownload(3, 'certificate') },
          ] as { label: string; sub: string; fn: () => void }[]).map(({ label, sub, fn }) => (
            <button
              key={label}
              type="button"
              onClick={fn}
              style={{
                flex: 1, fontFamily: UI, fontSize: '12px', fontWeight: 600,
                background: '#fff', color: '#0a0a0a',
                border: '1.5px solid #d0cac4', borderRadius: '10px',
                padding: '10px 6px', cursor: 'pointer', textAlign: 'center',
                transition: 'background 0.12s, border-color 0.12s, transform 0.1s',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#888'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0cac4'; e.currentTarget.style.transform = 'translateY(0)' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            >
              <div>{label}</div>
              <div style={{ fontSize: '10px', fontWeight: 400, color: '#938882', marginTop: '2px' }}>{sub}</div>
            </button>
          ))}
        </div>

        {/* Bury another */}
        <button
          type="button"
          onClick={() => { track('issue_another_clicked'); onReset() }}
          style={{
            fontFamily: UI, fontSize: '13px', color: '#938882',
            background: '#fff', border: '1.5px solid #e0dbd5', borderRadius: '10px',
            cursor: 'pointer', padding: '14px 24px', minHeight: '48px',
            textAlign: 'center', width: '100%', transition: 'color 0.15s, border-color 0.15s',
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#160A06'; e.currentTarget.style.borderColor = '#888' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#938882'; e.currentTarget.style.borderColor = '#e0dbd5' }}
        >
          Bury another →
        </button>

      </div>

    </div>
  )
}
