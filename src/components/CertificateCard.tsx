'use client'

import { useRef, useState, useEffect } from 'react'
import type React from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { DeathCertificate } from '@/lib/types'
import CertificateFixed from '@/components/CertificateFixed'
import GitHubIcon from '@/components/GitHubIcon'

// Lazy-load html-to-image (~40KB) on first share/download interaction so it
// stays out of the critical bundle.
type ToBlobFn = typeof import('html-to-image').toBlob
let toBlobPromise: Promise<ToBlobFn> | null = null
function loadToBlob(): Promise<ToBlobFn> {
  if (!toBlobPromise) toBlobPromise = import('html-to-image').then(m => m.toBlob)
  return toBlobPromise
}

interface Props {
  cert: DeathCertificate
  onReset: () => void
}

const DESKTOP_CERT_UI_SCALE = 0.5
const CERT_RENDER_WIDTH = 794
const CERT_RENDER_HEIGHT = 1123

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getCertificateUiScale(viewportWidth: number) {
  if (viewportWidth > 900) return DESKTOP_CERT_UI_SCALE
  if (viewportWidth <= 640) {
    // Mobile: scale to fit the viewport width with comfortable margins.
    return clamp((viewportWidth * 0.82) / CERT_RENDER_WIDTH, 0.34, 0.46)
  }
  // Tablet / small desktop: gradual ramp to desktop size.
  return clamp((viewportWidth * 0.72) / CERT_RENDER_WIDTH, 0.42, DESKTOP_CERT_UI_SCALE)
}

const SOCIAL_BG = '#FAF6EF'
const SOCIAL_EXPORT_FORMATS = {
  instagramPortrait: { width: 1080, height: 1350, padding: 64, filename: 'instagram-portrait' },
  instagramSquare: { width: 1080, height: 1080, padding: 48, filename: 'instagram-square' },
  xLandscape: { width: 1200, height: 675, padding: 40, filename: 'x-landscape' },
  facebookFeed: { width: 1200, height: 630, padding: 40, filename: 'facebook-feed' },
  story: { width: 1080, height: 1920, padding: 80, filename: 'story' },
} as const
type SocialFormatKey = keyof typeof SOCIAL_EXPORT_FORMATS

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
  const router = useRouter()
  const visibleCardRef = useRef<HTMLDivElement>(null)
  const exportCardRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const visibleStampRef = useRef<HTMLDivElement>(null)
  const exportStampRef = useRef<HTMLDivElement>(null)
  const [referrerUser, setReferrerUser] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Prefer explicit ?from=username param (when clicking from UserDashboard inline)
    const fromParam = new URLSearchParams(window.location.search).get('from')
    if (fromParam && /^[a-zA-Z0-9_.-]+$/.test(fromParam)) {
      setReferrerUser(fromParam)
      return
    }

    // Fallback: /user/[name] referrer (direct nav from the permalink page)
    const ref = document.referrer
    if (!ref) return
    try {
      const url = new URL(ref)
      if (url.origin !== window.location.origin) return
      const match = url.pathname.match(/^\/user\/([a-zA-Z0-9_.-]+)\/?$/)
      if (match) setReferrerUser(match[1])
    } catch { /* ignore */ }
  }, [])

  function handleBack() {
    track('issue_another_clicked')
    if (referrerUser) {
      router.push(`/user/${referrerUser}`)
    } else {
      onReset()
    }
  }
  const [visible, setVisible] = useState(false)
  const [uiScale, setUiScale] = useState(DESKTOP_CERT_UI_SCALE)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [showInlineShare, setShowInlineShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [badgeCopied, setBadgeCopied] = useState(false)

  function getPixelRatio(highQuality = false): number {
    if (typeof navigator === 'undefined') return 2
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const isLowEnd = memory !== undefined && memory <= 2
    if (isLowEnd) return 1.5
    if (isMobileViewport) return highQuality ? 2 : 1.5
    return highQuality ? 3 : 2.5
  }

  useEffect(() => {
    // Flip visibility on the next frame so the CSS transition has a
    // stable "from" state; avoids an arbitrary setTimeout delay.
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const applyScale = () => {
      setUiScale(getCertificateUiScale(window.innerWidth))
      setIsMobileViewport(window.innerWidth <= 640)
    }
    applyScale()
    window.addEventListener('resize', applyScale)
    return () => window.removeEventListener('resize', applyScale)
  }, [])

  async function exportBlob(pixelRatio: number, watermark = false): Promise<Blob | null> {
    if (!exportCardRef.current) return null
    const toBlob = await loadToBlob()
    const wrapper = wrapperRef.current
    if (wrapper) wrapper.style.zoom = '1'
    if (!watermark && exportStampRef.current) exportStampRef.current.style.visibility = 'hidden'
    const blob = await toBlob(exportCardRef.current, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: '#FAF6EF',
      width: CERT_RENDER_WIDTH,
      height: CERT_RENDER_HEIGHT,
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

  async function composeSocialBlob(
    masterBlob: Blob,
    format: { width: number; height: number; padding: number }
  ): Promise<Blob | null> {
    try {
      const img = await loadImageForCanvas(masterBlob)
      const canvas = document.createElement('canvas')
      canvas.width = format.width
      canvas.height = format.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      ctx.fillStyle = SOCIAL_BG
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const availableWidth = canvas.width - format.padding * 2
      const availableHeight = canvas.height - format.padding * 2
      const scale = Math.min(availableWidth / img.width, availableHeight / img.height)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const x = (canvas.width - drawWidth) / 2
      const y = (canvas.height - drawHeight) / 2

      ctx.drawImage(img, x, y, drawWidth, drawHeight)
      return await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'))
    } catch {
      return null
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

  async function generateSocialBlob(formatKey: SocialFormatKey) {
    const masterBlob = await exportBlob(getPixelRatio(), true)
    if (!masterBlob) return null
    return composeSocialBlob(masterBlob, SOCIAL_EXPORT_FORMATS[formatKey])
  }

  async function generateShareBlob() {
    return generateSocialBlob('instagramPortrait')
  }

  async function handleShare() {
    track('share_clicked')
    setIsGeneratingShare(true)
    setExportError(null)
    try {
      const shareFormat: SocialFormatKey = isMobileViewport ? 'story' : 'instagramPortrait'
      const blob = await generateSocialBlob(shareFormat)
      if (!blob) {
        setExportError('Could not generate image. Try downloading instead.')
        return
      }

      const file = new File([blob], `${cert.repoData.name}-${SOCIAL_EXPORT_FORMATS[shareFormat].filename}.png`, { type: 'image/png' })
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
            triggerDownload(blob, `${cert.repoData.name}-${SOCIAL_EXPORT_FORMATS[shareFormat].filename}.png`)
            stat('downloaded')
          }
        }
        return
      }

      // Desktop: show inline options
      setShowInlineShare(true)
    } catch {
      setExportError('Something went wrong generating the image. Try again.')
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
    setIsDownloading(true)
    setExportError(null)
    try {
      const blob = await generateShareBlob()
      if (!blob) { setExportError('Could not generate image. Try again.'); return }
      triggerDownload(blob, `${cert.repoData.name}-${SOCIAL_EXPORT_FORMATS.instagramPortrait.filename}.png`)
      stat('downloaded')
      setShowInlineShare(false)
    } catch {
      setExportError('Download failed. Try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  async function handleDownloadFormat(formatKey: SocialFormatKey) {
    setIsDownloading(true)
    setExportError(null)
    try {
      const masterBlob = await exportBlob(getPixelRatio(), true)
      if (!masterBlob) { setExportError('Could not generate image. Try again.'); return }
      const format = SOCIAL_EXPORT_FORMATS[formatKey]
      const blob = await composeSocialBlob(masterBlob, format)
      if (!blob) { setExportError('Could not generate image. Try again.'); return }
      triggerDownload(blob, `${cert.repoData.name}-${format.filename}.png`)
      stat('downloaded')
    } catch {
      setExportError('Download failed. Try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  async function handleDownloadA4() {
    setIsDownloading(true)
    setExportError(null)
    try {
      const blob = await exportBlob(getPixelRatio(true), true)
      if (!blob) { setExportError('Could not generate image. Try again.'); return }
      triggerDownload(blob, `${cert.repoData.name}-certificate.png`)
      stat('downloaded')
    } catch {
      setExportError('Download failed. Try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const MONO = `var(--font-courier), system-ui, sans-serif`

  return (
    <div className="certificate-card-shell" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>

      {/* ── Top: back arrow + GitHub link ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2px', marginBottom: '2px' }}>
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          className="subpage-back-link alive-interactive"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            letterSpacing: '0.06em',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9288' }}
        >
          ← {referrerUser ? `back to @${referrerUser}` : 'back'}
        </button>

        <a
          href={`https://github.com/${cert.repoData.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${cert.repoData.fullName} on GitHub`}
          title="View on GitHub"
          style={{
            fontFamily: MONO,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 0',
            color: '#5f5f5f',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            minHeight: '44px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1a1a1a')}
          onMouseLeave={e => (e.currentTarget.style.color = '#5f5f5f')}
        >
          <GitHubIcon size={14} />
          view on github
        </a>
      </div>

      {/* ── Certificate ── */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '8px', overflow: 'hidden' }}>
        <div
          ref={wrapperRef}
          style={{
            width: `${CERT_RENDER_WIDTH}px`,
            flexShrink: 0,
            transformOrigin: 'top center',
            transform: `scale(${uiScale})`,
            marginBottom: `calc((${CERT_RENDER_HEIGHT}px * ${uiScale}) - ${CERT_RENDER_HEIGHT}px)`,
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
      <p className="cert-mobile-hint">Preview scaled for mobile. Download for full-size version.</p>

      {/* Hidden fixed export source */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: `${CERT_RENDER_WIDTH}px`,
          height: `${CERT_RENDER_HEIGHT}px`,
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>

        {/* Share + Download — side by side */}
        {!showInlineShare && (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={handleShare}
              disabled={isGeneratingShare}
              className="cert-btn-primary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                flex: 1, height: '44px',
                background: '#1a1a1a', color: '#fff',
                border: '2px solid #1a1a1a',
                cursor: isGeneratingShare ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {isGeneratingShare || isDownloading ? <span className="btn-spinner" /> : (isMobileViewport ? 'Share as Story' : 'Share certificate')}
            </button>
            <button
              type="button"
              onClick={handleDownloadA4}
              disabled={isDownloading || isGeneratingShare}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                flex: 1, height: '44px',
                background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a',
                cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download A4'}
            </button>
          </div>
        )}

        {/* Inline share options (desktop) */}
        {showInlineShare && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={handleShareToX}
              className="cert-btn-primary"
              style={{
                fontFamily: MONO, fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#1a1a1a', color: '#fff',
                border: '2px solid #1a1a1a', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              Post on X →
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {copied ? 'Copied ✓' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={handleDownloadShareImage}
              disabled={isDownloading}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download Instagram (4:5)'}
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFormat('instagramSquare')}
              disabled={isDownloading}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download Square (1:1)'}
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFormat('xLandscape')}
              disabled={isDownloading}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download X (16:9)'}
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFormat('facebookFeed')}
              disabled={isDownloading}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download Facebook (1.91:1)'}
            </button>
            <button
              type="button"
              onClick={() => handleDownloadFormat('story')}
              disabled={isDownloading}
              className="cert-btn-secondary"
              style={{
                fontFamily: MONO, fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                width: '100%', height: '44px', background: '#FAF6EF', color: '#1a1a1a',
                border: '2px solid #1a1a1a', cursor: isDownloading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isDownloading ? <span className="btn-spinner" style={{ borderColor: '#1a1a1a', borderTopColor: 'transparent' }} /> : 'Download Story (9:16)'}
            </button>
            <button
              type="button"
              onClick={() => setShowInlineShare(false)}
              style={{
                fontFamily: MONO,
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

        {/* Badge copy with preview — matches ReadmeBadge on /user */}
        {!showInlineShare && (() => {
          const repoUrl = `https://commitmentissues.dev/?repo=${encodeURIComponent(cert.repoData.fullName)}`
          const shieldsUrl = `https://img.shields.io/badge/%F0%9F%AA%A6%20declared%20dead-view%20certificate-555?style=for-the-badge&labelColor=cc0000`
          const badgeMd = `[![commitmentissues](${shieldsUrl})](${repoUrl})`
          return (
            <div className="readme-badge-block">
              <div className="readme-badge-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shieldsUrl}
                  alt="README badge preview"
                  loading="lazy"
                  decoding="async"
                  style={{ height: '28px', width: 'auto', display: 'block', flexShrink: 0 }}
                />
                <button
                  type="button"
                  onClick={async () => { try { await navigator.clipboard.writeText(badgeMd); setBadgeCopied(true); setTimeout(() => setBadgeCopied(false), 2000) } catch { /* ignore */ } }}
                  className="readme-copy-btn"
                  style={{
                    fontFamily: MONO, fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '8px 14px', minHeight: '36px',
                    background: badgeCopied ? '#2d7a3c' : 'transparent',
                    color: badgeCopied ? '#fff' : '#4a4440',
                    border: `2px solid ${badgeCopied ? '#2d7a3c' : '#cec6bb'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!badgeCopied) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a' } }}
                  onMouseLeave={e => { if (!badgeCopied) { e.currentTarget.style.borderColor = '#cec6bb'; e.currentTarget.style.color = '#4a4440' } }}
                >
                  {badgeCopied ? '✓ copied!' : '⎘ copy to readme'}
                </button>
              </div>
              <p className="readme-badge-caption" style={{ fontFamily: MONO }}>
                ↻ paste once — updates automatically
              </p>
            </div>
          )
        })()}

        {/* Export error */}
        {exportError && (
          <p style={{ fontFamily: MONO, fontSize: '12px', color: '#8B1A1A', textAlign: 'center', margin: '0' }}>
            {exportError}
          </p>
        )}

        {/* Certify another — text link */}
        <div style={{ textAlign: 'center', marginTop: '6px', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              fontFamily: MONO,
              fontSize: '13px',
              fontWeight: 500,
              color: '#5f5f5f',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 8px',
              minHeight: '44px',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(0,0,0,0.2)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#1f1f1f' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5f5f5f' }}
          >
            {referrerUser ? `back to @${referrerUser}'s graveyard →` : 'certify another repo →'}
          </button>
        </div>

      </div>
    </div>
  )
}
