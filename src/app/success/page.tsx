'use client'

import { useEffect, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import CertificateSheet from '@/components/CertificateSheet'
import type { DeathCertificate } from '@/lib/types'

const UI = `var(--font-dm), -apple-system, sans-serif`

export default function SuccessPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cert, setCert] = useState<DeathCertificate | null>(null)
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pending_cert')
      if (raw) setCert(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  // Auto-trigger download once the cert is loaded and the hidden card is rendered
  useEffect(() => {
    if (!cert || status !== 'idle') return
    const timer = setTimeout(triggerDownload, 600)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cert])

  async function triggerDownload() {
    if (!cardRef.current || !cert) return
    setStatus('generating')
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 5,        // 480×5 = 2400px wide — ~300dpi on A4
        backgroundColor: '#FAF6EF',
        width: 480,
        height: 679,
      })
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${cert.repoData.name}-death-certificate.png`
        a.click()
        URL.revokeObjectURL(url)
        localStorage.removeItem('pending_cert')
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <SubpageShell subtitle="Payment confirmed." microcopy={null}>

      <div style={{
        border: '2px solid #0a0a0a',
        borderRadius: '12px',
        padding: 'clamp(24px, 6vw, 36px)',
        background: '#fff',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🪦</div>

        <p style={{ fontFamily: UI, fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 700, color: '#160A06', margin: '0 0 8px 0' }}>
          {status === 'done' ? 'Certificate downloaded.' : 'Your certificate is ready.'}
        </p>

        <p style={{ fontFamily: UI, fontSize: '14px', color: '#938882', margin: '0 0 28px 0', lineHeight: 1.6 }}>
          {status === 'generating' && 'Generating your certificate…'}
          {status === 'done' && 'Check your downloads folder. High-res · No watermark.'}
          {status === 'idle' && !cert && 'High-res · Print-quality PNG · No watermark.'}
          {status === 'error' && 'Something went wrong. Try the button below.'}
        </p>

        {/* Retry / manual download button */}
        {status === 'error' && (
          <button
            onClick={triggerDownload}
            style={{
              fontFamily: UI,
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              background: '#0a0a0a',
              borderRadius: '8px',
              padding: '14px 28px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            {cert ? `download — ${cert.repoData.name} →` : 'try again →'}
          </button>
        )}
        {status === 'idle' && !cert && (
          <Link
            href="/"
            style={{
              fontFamily: UI,
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              background: '#0a0a0a',
              borderRadius: '8px',
              padding: '14px 28px',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '16px',
            }}
          >
            issue a certificate →
          </Link>
        )}

        {status === 'done' && (
          <Link
            href="/"
            style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            issue another certificate →
          </Link>
        )}

        {status === 'idle' && cert && (
          <p style={{ fontFamily: UI, fontSize: '13px', color: '#b0aca8' }}>
            Preparing your download…
          </p>
        )}
      </div>

      {/* Hidden certificate rendered offscreen for export — no stamp (paid version) */}
      {cert && status !== 'done' && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
          <CertificateSheet
            ref={cardRef}
            cert={cert}
            visible={true}
            showStamp={false}
          />
        </div>
      )}

    </SubpageShell>
  )
}
