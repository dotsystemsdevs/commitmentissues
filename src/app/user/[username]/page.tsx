'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { UserRepoSummary } from '@/lib/types'
import UserDashboard from '@/components/UserDashboard'
import ReadmeBadge from '@/components/ReadmeBadge'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'

const MONO = `var(--font-courier), system-ui, sans-serif`

export default function UserPage() {
  const params = useParams()
  const router = useRouter()
  const username = typeof params.username === 'string' ? params.username : ''

  const [repos, setRepos]   = useState<UserRepoSummary[] | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(`/api/user?username=${encodeURIComponent(username)}`)
      .then(r => r.json())
      .then((d: { repos?: UserRepoSummary[]; error?: string }) => {
        if (d.error) { setError(d.error); return }
        setRepos(d.repos ?? [])
      })
      .catch(() => setError('Something went wrong. Try again.'))
      .finally(() => setLoading(false))
  }, [username])

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

        <PageHero
          title="Certificate of Death"
          subtitle={
            <span style={{
              display: 'block',
              fontFamily: MONO,
              fontSize: 'clamp(15px, 4vw, 19px)',
              fontWeight: 700,
              color: '#2a2218',
              letterSpacing: '0.02em',
              marginTop: '2px',
            }}>
              @{username}
            </span>
          }
          brandHref="/"
          hideEmoji={false}
        />

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px', lineHeight: 1, animation: 'loading-float 1.8s ease-in-out infinite' }}>🪦</div>
            <p style={{ fontFamily: MONO, fontSize: '11px', color: '#8a8a8a', letterSpacing: '0.1em', margin: 0 }}>reviewing case files...</p>
            <style>{`@keyframes loading-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => router.push('/')}
              style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', textDecoration: 'underline', color: '#160A06', cursor: 'pointer', minHeight: '44px', padding: '10px 0' }}
            >
              ← examine another subject
            </button>
          </div>
        )}

        {repos && !loading && (
          <>
            <ReadmeBadge username={username} />
            <UserDashboard repos={repos} username={username} />
          </>
        )}

        <SiteFooter compact={false} />
      </div>
    </main>
  )
}
