'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

const UI = `var(--font-dm), -apple-system, sans-serif`

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  )
}

function SuccessInner() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error' | 'unauthorized'>('idle')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { setStatus('unauthorized'); return }
    triggerDownload(sessionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function triggerDownload(sessionId: string) {
    setStatus('generating')
    try {
      const res = await fetch(`/api/generate-cert?session_id=${encodeURIComponent(sessionId)}`)
      if (res.status === 401) { setStatus('unauthorized'); return }
      if (!res.ok) { setStatus('error'); return }
      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition')
      const fname = cd?.match(/filename="([^"]+)"/)?.[1] ?? 'certificate-300dpi.png'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fname
      a.click()
      URL.revokeObjectURL(url)
      localStorage.removeItem('pending_cert')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'unauthorized') {
    return (
      <SubpageShell subtitle="No valid payment found." microcopy={null}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: UI, fontSize: '14px', color: '#938882', marginBottom: '24px' }}>
            This link has already been used or is invalid.
          </p>
          <Link href="/" style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            issue a certificate →
          </Link>
        </div>
      </SubpageShell>
    )
  }

  return (
    <SubpageShell subtitle="Payment confirmed." microcopy={null}>
      <div style={{ border: '2px solid #0a0a0a', borderRadius: '12px', padding: 'clamp(24px, 6vw, 36px)', background: '#fff', marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🪦</div>

        <p style={{ fontFamily: UI, fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 700, color: '#160A06', margin: '0 0 8px 0' }}>
          {status === 'done' ? 'Certificate downloaded.' : 'Your certificate is ready.'}
        </p>

        <p style={{ fontFamily: UI, fontSize: '14px', color: '#938882', margin: '0 0 28px 0', lineHeight: 1.6 }}>
          {status === 'generating' && 'Generating your high-res certificate\u2026 this takes a few seconds.'}
          {status === 'done' && 'Check your downloads folder. High-res \u00B7 No watermark.'}
          {status === 'idle' && 'Preparing\u2026'}
          {status === 'error' && 'Something went wrong. Try the button below.'}
        </p>

        {status === 'error' && (
          <button
            onClick={() => { const s = searchParams.get('session_id'); if (s) triggerDownload(s) }}
            style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#fff', background: '#0a0a0a', borderRadius: '8px', padding: '14px 28px', border: 'none', cursor: 'pointer', marginBottom: '16px', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            try again →
          </button>
        )}

        {status === 'done' && (
          <Link href="/" style={{ fontFamily: UI, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            issue another certificate →
          </Link>
        )}
      </div>
    </SubpageShell>
  )
}
