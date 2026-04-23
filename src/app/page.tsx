'use client'

import { useEffect, useRef, useState } from 'react'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import CertificateCard from '@/components/CertificateCard'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import RecentlyBuried from '@/components/RecentlyBuried'
import ClickSpark from '@/components/ClickSpark'
import UserDashboard from '@/components/UserDashboard'
import type { UserRepoSummary } from '@/lib/types'

const FONT = `var(--font-courier), system-ui, sans-serif`
const MONO = `var(--font-courier), system-ui, sans-serif`

export default function Page() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()
  const [buried, setBuried] = useState<number | null>(null)
  const [displayedBuried, setDisplayedBuried] = useState<number | null>(null)
  const [profiles, setProfiles] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const restoredRef = useRef(false)

  const [username, setUsername] = useState('')
  const [userInputError, setUserInputError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'user' | 'repo'>('repo')

  const [userRepos, setUserRepos] = useState<UserRepoSummary[] | null>(null)
  const [userLoading, setUserLoading] = useState(false)
  const [userFetchError, setUserFetchError] = useState<string | null>(null)
  const [scannedUsername, setScannedUsername] = useState('')

  function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    if (!/^[a-zA-Z0-9_.-]+$/.test(name)) { setUserInputError('Invalid username.'); return }
    setUserInputError(null)
    setScannedUsername(name)
    setUserLoading(true)
    setUserFetchError(null)
    fetch(`/api/user?username=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then((d: { repos?: UserRepoSummary[]; error?: string }) => {
        if (d.error) { setUserFetchError(d.error); setUserLoading(false); return }
        setUserRepos(d.repos ?? [])
        setUserLoading(false)
      })
      .catch(() => { setUserFetchError('Something went wrong. Try again.'); setUserLoading(false) })
  }

  function resetUser() {
    setUserRepos(null)
    setUserFetchError(null)
    setScannedUsername('')
    setUsername('')
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
    const start = Math.max(0, buried - 20)
    setDisplayedBuried(start)
    let current = start
    const tick = () => {
      current += 1
      setDisplayedBuried(current)
      if (current < buried) setTimeout(tick, 55)
    }
    if (start < buried) setTimeout(tick, 120)
    else setDisplayedBuried(buried)
  }, [buried])

  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true
    if (typeof window === 'undefined') return
    const repo = new URLSearchParams(window.location.search).get('repo')
    if (!repo) return
    const restoredUrl = `https://github.com/${repo}`
    setUrl(restoredUrl)
    analyze(restoredUrl)
  }, [analyze, setUrl])

  function handleSelect(selectedUrl: string) {
    setUrl(selectedUrl)
    analyze(selectedUrl)
  }

  const idle = !loading && !certificate && !error && !userLoading && !userRepos && !userFetchError

  return (
    <main className="page-shell-main" style={idle ? { height: '100dvh', overflow: 'hidden' } : undefined}>
      <div className="page-shell-inner" style={idle ? { height: '100%' } : undefined}>

      {/* Hero — always visible unless certificate is showing */}
      {!certificate && (
        <div style={{ marginTop: '0px' }}>
          <PageHero
            subtitle={
              statsLoading ? null : (
                <span style={{ fontFamily: MONO, fontSize: '12px', letterSpacing: '0.06em', color: '#7a7268' }}>
                  {inputMode === 'user'
                    ? (profiles && profiles > 0 ? `🔍 ${profiles.toLocaleString()} profiles scanned` : `🔍 scan a graveyard`)
                    : `⚰️ ${(displayedBuried ?? 0).toLocaleString()} repos buried`
                  }
                </span>
              )
            }
            microcopy={null}
          />
        </div>
      )}

      {/* Search — only when idle */}
      {!certificate && !loading && !error && (
        <>
          <div className="ux-live-section" style={{ width: '100%', marginTop: '6px' }}>

            {/* Mode tabs */}
            <div className="mode-tab-group" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              {(['user', 'repo'] as const).map((mode, i) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setInputMode(mode)}
                  className={`mode-tab${inputMode === mode ? ' mode-tab--active' : ''}`}
                  style={{
                    borderLeft: i === 1 ? 'none' : undefined,
                  }}
                >
                  {mode === 'user' ? 'Examine a Subject' : 'Certify a Repo'}
                </button>
              ))}
            </div>

            {/* User scan */}
            {inputMode === 'user' && (
              <form onSubmit={handleUserSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="input-button-wrapper input-block" style={{
                  display: 'flex', border: '2px solid #1a1a1a', overflow: 'hidden', background: '#FAF6EF',
                }}>
                  <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#666', padding: '0 0 0 14px', display: 'flex', alignItems: 'center', flexShrink: 0, userSelect: 'none' }}>
                    github.com/
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setUserInputError(null) }}
                    placeholder="your-username"
                    style={{ fontFamily: MONO, fontSize: '14px', flex: 1, height: '52px', padding: '0 8px', background: 'transparent', border: 'none', outline: 'none', color: '#160A06', minWidth: 0 }}
                  />
                  <ClickSpark color="#2b2b2b">
                    <button
                      className="input-submit-button alive-interactive"
                      type="submit"
                      style={{
                        fontFamily: FONT, fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em',
                        flexShrink: 0, padding: '0 20px', height: '52px',
                        background: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        cursor: loading ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        whiteSpace: 'nowrap', transition: 'background 0.15s, opacity 0.12s',
                        userSelect: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a' }}
                    >
                      Open Case File →
                    </button>
                  </ClickSpark>
                </div>
                {userInputError && (
                  <p style={{ margin: '-4px 2px 0', fontFamily: FONT, fontSize: '12px', color: '#8B0000' }}>{userInputError}</p>
                )}
              </form>
            )}
            {inputMode === 'user' && (
              <div className="chips-section" style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="alive-interactive"
                    type="button"
                    onClick={() => {
                      const pool = ['addyosmani', 'paulirish', 'kentcdodds', 'wesbos', 'tj', 'mxstbr', 'nicolo', 'sindresorhus', 'gaearon', 'torvalds']
                      const pick = pool[Math.floor(Math.random() * pool.length)]
                      setUsername(pick)
                      setUserInputError(null)
                      setScannedUsername(pick)
                      setUserLoading(true)
                      setUserFetchError(null)
                      fetch(`/api/user?username=${encodeURIComponent(pick)}`)
                        .then(r => r.json())
                        .then((d: { repos?: UserRepoSummary[]; error?: string }) => {
                          if (d.error) { setUserFetchError(d.error); setUserLoading(false); return }
                          setUserRepos(d.repos ?? [])
                          setUserLoading(false)
                        })
                        .catch(() => { setUserFetchError('Something went wrong. Try again.'); setUserLoading(false) })
                    }}
                    style={{
                      fontFamily: MONO, fontSize: '11px', fontWeight: 400,
                      padding: '6px 12px', background: 'transparent',
                      border: '2px solid #cec6bb', cursor: 'pointer', color: '#9a9288',
                      letterSpacing: '0.04em', transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cec6bb'; e.currentTarget.style.color = '#9a9288' }}
                  >
                    ↯ exhume at random
                  </button>
                </div>
              </div>
            )}

            {/* Repo scan */}
            {inputMode === 'repo' && (
              <SearchForm url={url} setUrl={setUrl} onSubmit={analyze} onSelect={handleSelect} loading={loading} />
            )}

          </div>
        </>
      )}

      {/* Certificate — inline, no redirect */}
      {certificate && !loading && (
        <div className="certificate-scroll-zone ux-live-section" style={{ width: '100%' }}>
          <CertificateCard cert={certificate} onReset={reset} />
        </div>
      )}

      {idle && (
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
          <RecentlyBuried onSelect={handleSelect} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={reset} />}

      {/* User scan loading */}
      {userLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px', lineHeight: 1, animation: 'hero-float 1.8s ease-in-out infinite' }}>🪦</div>
          <p style={{ fontFamily: MONO, fontSize: '11px', color: '#8a8a8a', letterSpacing: '0.1em', margin: 0 }}>reviewing case files...</p>
          <style>{`@keyframes hero-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
        </div>
      )}

      {/* User scan error */}
      {userFetchError && !userLoading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '20px' }}>{userFetchError}</p>
          <button onClick={resetUser} style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', textDecoration: 'underline', color: '#160A06', cursor: 'pointer' }}>
            ← examine another subject
          </button>
        </div>
      )}

      {/* User scan results */}
      {userRepos && !userLoading && (
        <div className="ux-live-section" style={{ width: '100%' }}>
          <div style={{ paddingBottom: '12px', marginBottom: '4px' }}>
            <button
              type="button"
              onClick={resetUser}
              style={{ fontFamily: MONO, display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', color: '#0a0a0a', fontSize: '13px', fontWeight: 600 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6"/></svg>
              back
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
