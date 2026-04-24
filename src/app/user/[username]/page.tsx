'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { UserRepoSummary } from '@/lib/types'
import UserDashboard from '@/components/UserDashboard'
import LoadingState from '@/components/LoadingState'
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

        <div style={{ paddingBottom: '4px', marginBottom: '2px' }}>
          <Link
            href="/"
            aria-label="Back to home"
            className="subpage-back-link alive-interactive"
            style={{
              fontFamily: MONO, display: 'inline-flex', alignItems: 'center', gap: '5px',
              color: '#9a9288', textDecoration: 'none', fontSize: '11px', fontWeight: 400,
              letterSpacing: '0.06em', WebkitTapHighlightColor: 'transparent', transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9a9288' }}
          >
            ← home
          </Link>
        </div>

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
        />

        {loading && <LoadingState />}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '20px' }}>{error}</p>
            <button
              onClick={() => router.push('/')}
              style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '3px', color: '#160A06', cursor: 'pointer', minHeight: '44px', padding: '10px 0' }}
            >
              ← examine another subject
            </button>
          </div>
        )}

        {repos && !loading && <UserDashboard repos={repos} username={username} />}

        <SiteFooter />
      </div>
    </main>
  )
}
