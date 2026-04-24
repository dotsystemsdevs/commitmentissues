'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const userInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputMode === 'user') {
      userInputRef.current?.focus()
    } else {
      document.querySelector<HTMLInputElement>('input[inputmode="url"]')?.focus()
    }
  }, [inputMode])

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

  function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    if (!/^[a-zA-Z0-9_.-]+$/.test(name)) { setUserInputError('Invalid username.'); return }
    setUserInputError(null)
    fetchUser(name)
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
    const start = Math.max(0, buried - 40)
    setDisplayedBuried(start)
    let current = start
    const tick = () => {
      current += 1
      setDisplayedBuried(current)
      if (current < buried) setTimeout(tick, 80)
    }
    if (start < buried) setTimeout(tick, 150)
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
    <main className="page-shell-main">
      <div className="page-shell-inner page-shell-inner--home">

      {/* Hero — only on the clean landing (hidden for certificate or user results) */}
      {!certificate && !userRepos && (
        <div style={{ marginTop: '0px' }}>
          <PageHero
            subtitle={
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '24px', fontFamily: MONO, fontSize: 'clamp(14px, 2.6vw, 17px)', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8b0000', fontWeight: 700 }}>
                {statsLoading ? '' : (
                  inputMode === 'user'
                    ? (profiles && profiles > 0 ? `☠ ${profiles.toLocaleString()} profiles examined` : '☠ scan a graveyard')
                    : `☠ ${(displayedBuried ?? 0).toLocaleString()} repos buried`
                )}
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
        <>
          <div className="ux-live-section" style={{ width: '100%', marginTop: '6px' }}>

            {/* Mode tabs */}
            <div className="mode-tab-group" role="tablist" aria-label="Choose scan type" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <button
                key="user"
                type="button"
                onClick={() => setInputMode('user')}
                className={`mode-tab${inputMode === 'user' ? ' mode-tab--active' : ''}`}
                role="tab"
                aria-selected={inputMode === 'user'}
                aria-controls="panel-user"
              >
                Examine a Profile
              </button>
              <span aria-hidden style={{ color: '#cec6bb', fontSize: '10px', userSelect: 'none' }}>✦</span>
              <button
                key="repo"
                type="button"
                onClick={() => setInputMode('repo')}
                className={`mode-tab${inputMode === 'repo' ? ' mode-tab--active' : ''}`}
                role="tab"
                aria-selected={inputMode === 'repo'}
                aria-controls="panel-repo"
              >
                Certify a Repo
              </button>
            </div>

            {/* User scan */}
            {inputMode === 'user' && (
              <form id="panel-user" role="tabpanel" aria-label="Profile scan" onSubmit={handleUserSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="input-button-wrapper input-block" style={{
                  display: 'flex', border: '2px solid #1a1a1a', overflow: 'hidden', background: '#FAF6EF',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                }}>
                  <span style={{ fontFamily: MONO, fontSize: '15px', fontWeight: 700, color: '#666', padding: '0 2px 0 16px', display: 'flex', alignItems: 'center', flexShrink: 0, userSelect: 'none' }}>
                    github.com/
                  </span>
                  <input
                    ref={userInputRef}
                    autoFocus
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setUserInputError(null) }}
                    placeholder="your-username"
                    aria-invalid={Boolean(userInputError)}
                    style={{ fontFamily: MONO, fontSize: '16px', fontWeight: 600, flex: 1, height: '60px', padding: '0 10px 0 2px', background: 'transparent', border: 'none', outline: 'none', color: '#160A06', minWidth: 0 }}
                  />
                  <ClickSpark color="#2b2b2b">
                    <button
                      className="input-submit-button input-submit-button--dark alive-interactive"
                      type="submit"
                      disabled={userLoading}
                      style={{
                        fontFamily: MONO, fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em',
                        flexShrink: 0, padding: '0 24px', minWidth: '160px', height: '60px',
                        border: 'none',
                        cursor: loading ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        whiteSpace: 'nowrap', transition: 'background 0.15s, opacity 0.12s',
                        userSelect: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
                      }}
                    >
                      Open Case File →
                    </button>
                  </ClickSpark>
                </div>
                {userInputError && (
                  <p aria-live="polite" style={{ margin: '-4px 2px 0', fontFamily: MONO, fontSize: '12px', color: '#8B0000' }}>{userInputError}</p>
                )}
              </form>
            )}
            {inputMode === 'user' && (
              <div className="chips-section" style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    const pool = ['addyosmani', 'paulirish', 'kentcdodds', 'wesbos', 'tj', 'mxstbr', 'nicolo', 'sindresorhus', 'gaearon', 'torvalds']
                    const pick = pool[Math.floor(Math.random() * pool.length)]
                    setUsername(pick)
                    setUserInputError(null)
                    fetchUser(pick)
                  }}
                  disabled={userLoading}
                  aria-label="Dig up a random profile"
                  style={{
                    fontFamily: MONO, fontSize: '12px', letterSpacing: '0.04em',
                    background: 'none', border: 'none', padding: '4px 2px',
                    cursor: userLoading ? 'wait' : 'pointer',
                    color: '#9a9288',
                    textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(154,146,136,0.4)',
                    transition: 'color 0.15s, text-decoration-color 0.15s',
                    opacity: userLoading ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!userLoading) { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.textDecorationColor = '#1a1a1a' } }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#9a9288'; e.currentTarget.style.textDecorationColor = 'rgba(154,146,136,0.4)' }}
                >
                  {userLoading ? 'exhuming…' : 'or dig up a corpse →'}
                </button>
              </div>
            )}

            {/* Repo scan */}
            {inputMode === 'repo' && (
              <div id="panel-repo" role="tabpanel" aria-label="Repository scan">
                <SearchForm url={url} setUrl={setUrl} onSubmit={analyze} onSelect={handleSelect} loading={loading} />
              </div>
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
