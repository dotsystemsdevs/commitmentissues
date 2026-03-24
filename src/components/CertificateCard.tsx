'use client'

import { useRef, useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import { toBlob } from 'html-to-image'
import { DeathCertificate } from '@/lib/types'
import CertificateFixed from '@/components/CertificateFixed'

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

function buildShareCopy(cert: DeathCertificate, shareUrl: string): string {
  const repo = cert.repoData.fullName
  const cause = cert.causeOfDeath

  if (cert.repoData.isArchived) {
    return `Archived and buried: ${repo}. Cause: ${cause}. ${shareUrl}`
  }

  if (cert.deathIndex >= 9) {
    return `Postmortem complete: ${repo} flatlined. Cause: ${cause}. ${shareUrl}`
  }

  if (cert.deathIndex >= 7) {
    return `RIP ${repo}. Official cause of death: ${cause}. ${shareUrl}`
  }

  return `${repo} is on life support. Cause of death: ${cause}. ${shareUrl}`
}

async function loadImageForCanvas(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(blob)
  }

  const img = new Image()
  const objectUrl = URL.createObjectURL(blob)
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to decode exported image'))
      img.src = objectUrl
    })
    return img
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default function CertificateCard({ cert, onReset }: Props) {
  const visibleCardRef = useRef<HTMLDivElement>(null)
  const exportCardRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const visibleStampRef = useRef<HTMLDivElement>(null)
  const exportStampRef = useRef<HTMLDivElement>(null)
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
    if (!exportCardRef.current) return null
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.zoom = '1'
    if (!watermark && exportStampRef.current) exportStampRef.current.style.visibility = 'hidden'
    const blob = await toBlob(exportCardRef.current, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: '#FAF6EF',
      width: 794,
      height: 1123,
    })
    if (!watermark && exportStampRef.current) exportStampRef.current.style.visibility = ''
    if (wrapper) wrapper.style.zoom = ''
    if (!blob || !watermark) return blob

    try {
      // Stamp "commitmentissues.dev" across the bottom of the shared image
      const img = await loadImageForCanvas(blob)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return blob
      ctx.drawImage(img, 0, 0)
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.font = `${9 * pixelRatio}px "Courier New", monospace`
      ctx.textAlign = 'center'
      ctx.fillText('COMMITMENTISSUES.DEV', canvas.width / 2, canvas.height - 10 * pixelRatio)
      return new Promise(resolve => canvas.toBlob(b => resolve(b ?? blob), 'image/png'))
    } catch {
      // Fallback: keep export working even if watermark post-process fails on this browser.
      return blob
    }
  }

  const stat = (counter: string) => fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter }) }).catch(() => {})

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const shareUrl = `https://commitmentissues.dev/?repo=${encodeURIComponent(cert.repoData.fullName)}`
  const shareText = buildShareCopy(cert, shareUrl)

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
    const tweet = encodeURIComponent(shareText)
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
        }}
      >
        <button
          className="certificate-action-back certificate-action-back-link"
          type="button"
          onClick={() => { track('issue_another_clicked'); onReset() }}
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6"></path>
            <path d="M9 12h12"></path>
          </svg>
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
            width: '794px',
            transformOrigin: 'top center',
            transform: 'scale(var(--cert-ui-scale, 0.604))',
            marginBottom: 'calc((1123px * var(--cert-ui-scale, 0.604)) - 1123px)',
          }}
        >
          <CertificateFixed
            ref={visibleCardRef}
            cert={cert}
            visible={visible}
            showStamp={true}
            stampRef={visibleStampRef}
          />
        </div>
      </div>

      {/* Hidden fixed export source - always identical across devices */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: '794px',
          height: '1123px',
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <CertificateFixed
          ref={exportCardRef}
          cert={cert}
          visible={true}
          showStamp={true}
          stampRef={exportStampRef}
        />
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
