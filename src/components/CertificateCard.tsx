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
  const [visible, setVisible] = useState(false)

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

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleShare() {
    track('share_clicked')
    const shareText = `RIP ${cert.repoData.fullName}. Cause of death: ${cert.causeOfDeath} 💀 commitmentissues.dev`
    const shareUrl = `https://commitmentissues.dev/?repo=${encodeURIComponent(cert.repoData.fullName)}`

    try {
      const blob = await exportBlob(2, true)
      if (!blob) return

      const file = new File([blob], `${cert.repoData.name}-certificate-of-death.png`, { type: 'image/png' })
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: 'Certificate of Death',
          text: shareText,
          url: shareUrl,
          files: [file],
        })
        stat('shared')
        return
      }

      // Desktop / unsupported share fallback: download image.
      triggerDownload(blob, `${cert.repoData.name}-share.png`)
      stat('downloaded')
    } catch (error) {
      // User cancelled share dialog; do nothing.
      if (error instanceof DOMException && error.name === 'AbortError') return

      // If sharing truly fails, fallback to download.
      const blob = await exportBlob(2, true)
      if (!blob) return
      triggerDownload(blob, `${cert.repoData.name}-share.png`)
      stat('downloaded')
    }
  }

  async function handleDownload(pixelRatio: number, suffix: string) {
    const blob = await exportBlob(pixelRatio, true)
    if (!blob) return
    triggerDownload(blob, `${cert.repoData.name}-${suffix}.png`)
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

        {/* Share + Download row */}
        <div style={{ display: 'flex', gap: '8px' }}>

          {/* Share */}
          <button type="button" onClick={handleShare}
            style={{ flex: 1, fontFamily: UI, fontSize: '14px', fontWeight: 700, background: '#0a0a0a', color: '#fff', border: '1.5px solid #000', borderRadius: '10px', padding: '14px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.15s, transform 0.1s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          >
            Share →
          </button>

          {/* Download */}
          <button type="button" onClick={() => handleDownload(3, 'certificate')}
            style={{ flex: 1, fontFamily: UI, fontSize: '14px', fontWeight: 700, background: '#fff', color: '#160A06', border: '1.5px solid #000', borderRadius: '10px', padding: '14px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s, border-color 0.15s, transform 0.1s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#888'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.transform = 'translateY(0)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#160A06" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download A4
          </button>

        </div>

        {/* Bury another */}
        <button
          type="button"
          onClick={() => { track('issue_another_clicked'); onReset() }}
          style={{
            fontFamily: UI, fontSize: '13px', color: '#b0aca8',
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '10px 0 4px',
            textAlign: 'center', width: '100%', transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#160A06' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#b0aca8' }}
        >
          Bury another →
        </button>

        <a
          href="https://buymeacoffee.com/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            fontFamily: UI,
            fontSize: '12px',
            color: '#c8c4c0',
            textDecoration: 'none',
            textAlign: 'center',
            paddingBottom: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#938882' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#c8c4c0' }}
        >
          ☕ keep it running
        </a>

      </div>

    </div>
  )
}
