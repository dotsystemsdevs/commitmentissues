'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import CertificateCard from '@/components/CertificateCard'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import RecentlyBuried from '@/components/RecentlyBuried'
import StatsCounter from '@/components/StatsCounter'
import UserDashboard from '@/components/UserDashboard'
import type { UserRepoSummary } from '@/lib/types'

const MONO = `var(--font-courier), system-ui, sans-serif`

export default function Page() {
  // useSearchParams requires a Suspense boundary for static prerender
  // in Next 15's App Router.
  return (
    <Suspense fallback={<main className="page-shell-main"><div className="page-shell-inner page-shell-inner--home" /></main>}>
      <HomePage />
    </Suspense>
  )
}

function HomePage() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()
  const searchParams = useSearchParams()
  const [buried, setBuried] = useState<number | null>(null)
  const [displayedBuried, setDisplayedBuried] = useState<number | null>(null)
  const [profiles, setProfiles] = useState<number | null>(null)
  const [displayedProfiles, setDisplayedProfiles] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const lastHandledRepoRef = useRef<string | null>(null)

  const [userRepos, setUserRepos] = useState<UserRepoSummary[] | null>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [userFetchError, setUserFetchError] = useState<string | null>(null)
  const [scannedUsername, setScannedUsername] = useState('')

  const fetchUser = useCallback((name: string) => {
    setScannedUsername(name)
    setUserLoading(true)
    setUserFetchError(null)
    setUserRepos(null)
    fetch(`/api/user?username=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then((d: { repos?: UserRepoSummary[]; error?: string }) => {
        if (d?.error) {
          setUserFetchError(d.error)
          return
        }
        setUserRepos(d?.repos ?? [])
      })
      .catch(() => setUserFetchError('Something went wrong. Try again.'))
      .finally(() => setUserLoading(false))
  }, [])

  function resetUser() {
    setUserRepos(null)
    setUserFetchError(null)
    setScannedUsername('')
  }

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then((d: { buried: number; profiles: number }) => {
        setBuried(d.buried ?? 0)
        setProfiles(d.profiles ?? 0)
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    if (buried === null) return
    const start = Math.max(0, buried - 40)
    setDisplayedBuried(start)
    if (start >= buried) { setDisplayedBuried(buried); return }
    let current = start
    const id = window.setInterval(() => {
      current += 1
      setDisplayedBuried(current)
      if (current >= buried) window.clearInterval(id)
    }, 80)
    return () => window.clearInterval(id)
  }, [buried])

  useEffect(() => {
    if (profiles === null) return
    const start = Math.max(0, profiles - 15)
    setDisplayedProfiles(start)
    if (start >= profiles) { setDisplayedProfiles(profiles); return }
    let current = start
    const id = window.setInterval(() => {
      current += 1
      setDisplayedProfiles(current)
      if (current >= profiles) window.clearInterval(id)
    }, 120)
    return () => window.clearInterval(id)
  }, [profiles])

  useEffect(() => {
    const repo = searchParams?.get('repo') ?? null
    if (repo === lastHandledRepoRef.current) return
    lastHandledRepoRef.current = repo
    if (!repo) return
    const restoredUrl = `https://github.com/${repo}`
    setUrl(restoredUrl)
    analyze(restoredUrl)
  }, [searchParams, analyze, setUrl])

  const handleSelect = useCallback((selectedUrl: string) => {
    setUrl(selectedUrl)
    analyze(selectedUrl)
  }, [analyze, setUrl])

  const idle = !loading && !certificate && !error && !userLoading && !userRepos && !userFetchError

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner page-shell-inner--home">

      {/* Hero — landing: stats counter; user result: show @username */}
      {!certificate && !userRepos && (
        <div style={{ marginTop: '0px' }}>
          <PageHero
            subtitle={
              !statsLoading ? <StatsCounter buried={displayedBuried ?? 0} profiles={displayedProfiles ?? 0} /> : <span style={{ minHeight: '24px', display: 'block' }} />
            }
            microcopy={null}
          />
        </div>
      )}

      {!certificate && userRepos && scannedUsername && (
        <div style={{ marginTop: '0px' }}>
          <PageHero
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
                @{scannedUsername}
              </span>
            }
            microcopy={null}
          />
        </div>
      )}

      {/* Loading state in search area to avoid layout shift */}
      {!certificate && loading && (
        <div style={{ width: '100%', marginTop: '6px' }}>
          <LoadingState />
        </div>
      )}

      {/* Search — only when idle (hidden for user results) */}
      {!certificate && !loading && !error && !userRepos && !userLoading && !userFetchError && (
        <div className="ux-live-section" style={{ width: '100%', marginTop: '6px' }}>
          <SearchForm
            url={url}
            setUrl={setUrl}
            onSubmit={analyze}
            onUserSubmit={fetchUser}
            onSelect={handleSelect}
            loading={loading || userLoading}
          />
        </div>
      )}

      {/* Certificate — inline, no redirect */}
      {certificate && !loading && (
        <div className="certificate-scroll-zone ux-live-section" style={{ width: '100%' }}>
          <CertificateCard cert={certificate} onReset={reset} />
        </div>
      )}

      {idle && (
        <div style={{ width: '100%', marginTop: '56px' }}>
          <RecentlyBuried onSelect={handleSelect} />
        </div>
      )}
      {error && !loading && <ErrorDisplay error={error} onRetry={reset} />}

      {/* User scan loading */}
      {userLoading && <LoadingState />}

      {/* User scan error */}
      {userFetchError && !userLoading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '20px' }}>{userFetchError}</p>
          <button className="alive-interactive" onClick={resetUser} style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '3px', color: '#160A06', cursor: 'pointer' }}>
            ← examine another subject
          </button>
        </div>
      )}

      {/* User scan results */}
      {userRepos && !userLoading && (
        <div className="ux-live-section" style={{ width: '100%' }}>
          <div style={{ paddingBottom: '4px', marginBottom: '2px' }}>
            <button
              type="button"
              onClick={resetUser}
              className="subpage-back-link alive-interactive"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                letterSpacing: '0.06em',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9288' }}
            >
              ← back
            </button>
          </div>
          <UserDashboard repos={userRepos} username={scannedUsername} />
        </div>
      )}

      <SiteFooter compact={idle} />
      </div>
    </main>
  )
}
