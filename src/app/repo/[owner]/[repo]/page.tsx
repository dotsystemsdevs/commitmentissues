'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CertificateCard from '@/components/CertificateCard'
import LoadingState from '@/components/LoadingState'
import SiteFooter from '@/components/SiteFooter'
import type { DeathCertificate } from '@/lib/types'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

export default function RepoCertPage() {
  const params = useParams()
  const router = useRouter()
  const owner = typeof params.owner === 'string' ? params.owner : ''
  const repo  = typeof params.repo  === 'string' ? params.repo  : ''

  const [cert, setCert] = useState<DeathCertificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!owner || !repo) return
    setLoading(true)
    setError(null)
    fetch(`/api/repo?url=https://github.com/${owner}/${repo}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setCert(data)
      })
      .catch(() => setError('Network error. Try again.'))
      .finally(() => setLoading(false))
  }, [owner, repo])

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

        {loading && (
          <>
            <p style={{ fontFamily: MONO, fontSize: '12px', color: '#888', margin: '0 0 16px 0', letterSpacing: '0.06em' }}>
              {owner}/{repo}
            </p>
            <LoadingState />
          </>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '16px' }}>{error}</p>
            <button
              type="button"
              onClick={() => router.back()}
              style={{ fontFamily: FONT, fontSize: '13px', color: '#555', background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', cursor: 'pointer' }}
            >
              ← back
            </button>
          </div>
        )}

        {cert && !loading && (
          <div className="certificate-scroll-zone ux-live-section" style={{ width: '100%' }}>
            <CertificateCard cert={cert} onReset={() => router.back()} />
          </div>
        )}

        <SiteFooter compact={false} />
      </div>
    </main>
  )
}
