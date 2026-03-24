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

  function handleTweet() {
    track('tweet_clicked')
    const repoUrl = `https://github.com/${cert.repoData.fullName}`
    const text = encodeURIComponent(
      `RIP ${cert.repoData.fullName}\nCause of death: ${cert.causeOfDeath}\n${repoUrl}\n\nBury yours:`
    )
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

        {/* Platform row */}
        <div style={{ display: 'flex', gap: '8px' }}>

          {/* X */}
          <button type="button" onClick={handleTweet}
            style={{ flex: 1, fontFamily: UI, fontSize: '13px', fontWeight: 700, background: '#fff', color: '#000', border: '1.5px solid #000', borderRadius: '10px', padding: '14px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'background 0.15s, transform 0.1s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post on X
          </button>

          {/* Instagram */}
          <button type="button" onClick={() => handleDownload(2, 'instagram')}
            style={{ flex: 1, fontFamily: UI, fontSize: '13px', fontWeight: 700, background: '#fff', color: '#C13584', border: '1.5px solid #C13584', borderRadius: '10px', padding: '14px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'background 0.15s, transform 0.1s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf0f7'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C13584"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </button>

          {/* Download */}
          <button type="button" onClick={() => handleDownload(3, 'certificate')}
            style={{ flex: 1, fontFamily: UI, fontSize: '13px', fontWeight: 700, background: '#fff', color: '#160A06', border: '1.5px solid #d0cac4', borderRadius: '10px', padding: '14px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'background 0.15s, border-color 0.15s, transform 0.1s', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#888'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0cac4'; e.currentTarget.style.transform = 'translateY(0)' }}
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
