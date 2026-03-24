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
  const [showInlineShare, setShowInlineShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

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

      // Desktop: show inline options
      setShowInlineShare(true)
    } finally {
      setIsGeneratingShare(false)
    }
  }

  function handleShareToX() {
    const tweet = encodeURIComponent(shareText)
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank')
    stat('shared')
    setShowInlineShare(false)
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
    setShowInlineShare(false)
  }

  async function handleDownloadA4() {
    const blob = await exportBlob(3, true)
    if (!blob) return
    triggerDownload(blob, `${cert.repoData.name}-certificate.png`)
    stat('downloaded')
  }

  const UI = `var(--font-dm), -apple-system, sans-serif`

  return (
    <div className="certificate-card-shell" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── Top: back arrow only ── */}
      <div style={{ paddingBottom: '12px', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => { track('issue_another_clicked'); onReset() }}
          aria-label="Back"
          style={{
            fontFamily: UI,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            color: '#0a0a0a',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          back
        </button>
      </div>

      {/* ── Certificate ── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div
          ref={wrapperRef}
          style={{
            width: '794px',
            flexShrink: 0,
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

      {/* Hidden fixed export source */}
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

      {/* ── Actions below certificate ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>

        {/* Share button — primary */}
        {!showInlineShare && (
          <button
            type="button"
            onClick={handleShare}
            disabled={isGeneratingShare}
            style={{
              fontFamily: UI,
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              width: '100%',
              height: '52px',
              background: '#0a0a0a',
              color: '#fff',
              border: '2px solid #0a0a0a',
              cursor: isGeneratingShare ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.12s',
            }}
            onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {isGeneratingShare ? <span className="btn-spinner" /> : 'Share →'}
          </button>
        )}

        {/* Inline share options (desktop) */}
        {showInlineShare && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={handleShareToX}
              style={{
                fontFamily: UI,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                width: '100%',
                height: '52px',
                background: '#0a0a0a',
                color: '#fff',
                border: '2px solid #0a0a0a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.12s',
              }}
              onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Post on X →
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                fontFamily: UI,
                fontSize: '14px',
                fontWeight: 600,
                width: '100%',
                height: '52px',
                background: '#fff',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.12s',
              }}
              onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {copied ? 'Copied ✓' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={handleDownloadShareImage}
              style={{
                fontFamily: UI,
                fontSize: '14px',
                fontWeight: 600,
                width: '100%',
                height: '52px',
                background: '#fff',
                color: '#0a0a0a',
                border: '2px solid #0a0a0a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.12s',
              }}
              onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Download image
            </button>
            <button
              type="button"
              onClick={() => setShowInlineShare(false)}
              style={{
                fontFamily: UI,
                fontSize: '12px',
                fontWeight: 500,
                color: '#787878',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              cancel
            </button>
          </div>
        )}

        {/* Download A4 — secondary */}
        {!showInlineShare && (
          <button
            type="button"
            onClick={handleDownloadA4}
            style={{
              fontFamily: UI,
              fontSize: '13px',
              fontWeight: 600,
              width: '100%',
              height: '44px',
              background: '#fff',
              color: '#0a0a0a',
              border: '2px solid #0a0a0a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              letterSpacing: '0.02em',
              transition: 'opacity 0.12s',
            }}
            onMouseDown={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseUp={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Download A4
          </button>
        )}

        {/* Bury another — text link */}
        <div style={{ textAlign: 'center', marginTop: '6px', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={() => { track('issue_another_clicked'); onReset() }}
            style={{
              fontFamily: UI,
              fontSize: '13px',
              fontWeight: 500,
              color: '#5f5f5f',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(0,0,0,0.2)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#1f1f1f' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5f5f5f' }}
          >
            or bury another repo →
          </button>
        </div>

      </div>
    </div>
  )
}
