'use client'

import { useRef, useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import { toBlob } from 'html-to-image'
import { DeathCertificate } from '@/lib/types'
import CertificateSheet from '@/components/CertificateSheet'

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

export default function CertificateCard({ cert, onReset }: Props) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stampRef   = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [showDesktopShareMenu, setShowDesktopShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

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

  const shareText = `RIP ${cert.repoData.fullName}. Cause of death: ${cert.causeOfDeath} 🪦 commitmentissues.dev`
  const shareUrl = `https://commitmentissues.dev/?repo=${encodeURIComponent(cert.repoData.fullName)}`

  async function generateShareBlob() {
    // 480 * 2.5 = 1200px, 679 * 2.5 ≈ 1700px
    return exportBlob(2.5, true)
  }

  async function handleShare() {
    track('share_clicked')
    setIsGeneratingShare(true)
    try {
      const blob = await generateShareBlob()
      if (!blob) return

      const file = new File([blob], `${cert.repoData.name}-certificate-of-death.png`, { type: 'image/png' })
      const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator
      const hasCanShare = typeof navigator !== 'undefined' && 'canShare' in navigator
      const canNativeShareFiles = hasNativeShare && (!hasCanShare || navigator.canShare({ files: [file] }))

      if (canNativeShareFiles) {
        try {
          await navigator.share({
            title: 'Certificate of Death',
            text: shareText,
            url: shareUrl,
            files: [file],
          })
          stat('shared')
        } catch (error) {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            triggerDownload(blob, `${cert.repoData.name}-share.png`)
            stat('downloaded')
          }
        }
        return
      }

      // Desktop path: open action menu instead of direct download.
      setShowDesktopShareMenu(true)
    } finally {
      setIsGeneratingShare(false)
    }
  }

  function handleShareToX() {
    const tweet = encodeURIComponent(`RIP ${cert.repoData.fullName}. Cause of death: ${cert.causeOfDeath}. 🪦 ${shareUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank')
    stat('shared')
    setShowDesktopShareMenu(false)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore clipboard errors
    }
  }

  async function handleDownloadShareImage() {
    const blob = await generateShareBlob()
    if (!blob) return
    triggerDownload(blob, `${cert.repoData.name}-share.png`)
    stat('downloaded')
    setShowDesktopShareMenu(false)
  }

  async function handleDownload(pixelRatio: number, suffix: string) {
    const blob = await exportBlob(pixelRatio, true)
    if (!blob) return
    triggerDownload(blob, `${cert.repoData.name}-${suffix}.png`)
    stat('downloaded')
  }

  const UI = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div className="certificate-card-shell" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* ── Top actions: back left, download/share right ── */}
      <div
        className="certificate-top-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          marginBottom: '14px',
          borderBottom: '1px solid #cfcfcf',
        }}
      >
        <button
          className="certificate-action-back certificate-action-back-link"
          type="button"
          onClick={() => { track('issue_another_clicked'); onReset() }}
          aria-label="Back"
        >
          ←
        </button>

        <div className="certificate-actions-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="certificate-action-a4"
            type="button"
            onClick={() => handleDownload(3, 'certificate')}
            aria-label="Download A4 certificate"
            style={{
              minHeight: '44px',
              height: '44px',
              border: '1px solid #0a0a0a',
              background: '#f6f6f6',
              color: '#0a0a0a',
              padding: '0 10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontFamily: UI,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12"></path>
              <path d="M7 10l5 5 5-5"></path>
              <path d="M4 20h16"></path>
            </svg>
            <span>A4</span>
          </button>

          <button
            className="certificate-action-share"
            type="button"
            onClick={handleShare}
            aria-label="Share death certificate"
            disabled={isGeneratingShare}
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid #0a0a0a',
              background: '#f6f6f6',
              color: '#0a0a0a',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isGeneratingShare ? (
              <span className="btn-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.7" y1="10.7" x2="15.3" y2="6.3"></line>
                <line x1="8.7" y1="13.3" x2="15.3" y2="17.7"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Certificate — fixed 480×679, CSS var scales on mobile ── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '14px' }}>
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

      {showDesktopShareMenu && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowDesktopShareMenu(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #d0cac4',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ margin: '0 0 4px 0', fontFamily: UI, fontSize: '14px', fontWeight: 700, color: '#160A06', letterSpacing: '0.01em' }}>
              Share this death certificate
            </p>

            <button
              type="button"
              onClick={handleShareToX}
              style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, border: '1px solid #000', background: '#0a0a0a', color: '#fff', borderRadius: '9px', minHeight: '44px' }}
            >
              Post on X
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, border: '1px solid #000', background: '#fff', color: '#160A06', borderRadius: '9px', minHeight: '44px' }}
            >
              {copied ? 'Copied ✓' : 'Copy link'}
            </button>

            <button
              type="button"
              onClick={handleDownloadShareImage}
              style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, border: '1px solid #000', background: '#fff', color: '#160A06', borderRadius: '9px', minHeight: '44px' }}
            >
              Download image
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
