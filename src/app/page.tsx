'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
import CertificateCard from '@/components/CertificateCard'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import RecentlyBuried from '@/components/RecentlyBuried'
import ClickSpark from '@/components/ClickSpark'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

export default function Page() {
  const router = useRouter()
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()
  const [buried, setBuried] = useState<number | null>(null)
  const [displayedBuried, setDisplayedBuried] = useState<number | null>(null)
  const [profiles, setProfiles] = useState<number | null>(null)
  const [displayedProfiles, setDisplayedProfiles] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const restoredRef = useRef(false)

  // Primary: username scan
  const [username, setUsername] = useState('')
  const [userError, setUserError] = useState<string | null>(null)

  // Secondary: single repo (toggled)
  const [showRepoSearch, setShowRepoSearch] = useState(false)

  function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    const VALID = /^[a-zA-Z0-9_.-]+$/
    if (!VALID.test(name)) { setUserError('Invalid username.'); return }
    router.push(`/user/${encodeURIComponent(name)}`)
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
    if (profiles === null) return
    const start = Math.max(0, profiles - 10)
    setDisplayedProfiles(start)
    let current = start
    const tick = () => {
      current += 1
      setDisplayedProfiles(current)
      if (current < profiles) setTimeout(tick, 80)
    }
    if (start < profiles) setTimeout(tick, 150)
    else setDisplayedProfiles(profiles)
  }, [profiles])

  useEffect(() => {
    if (restoredRef.current) return
    restoredRef.current = true
    if (typeof window === 'undefined') return
    const repo = new URLSearchParams(window.location.search).get('repo')
    if (!repo) return
    const restoredUrl = `https://github.com/${repo}`
    setUrl(restoredUrl)
    analyze(restoredUrl)
    setShowRepoSearch(true)
  }, [analyze, setUrl])

  function handleSelect(selectedUrl: string) {
    setUrl(selectedUrl)
    analyze(selectedUrl)
  }

  const idle = !loading && !certificate && !error

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

      {!certificate && (
        <>
          <div style={{ marginTop: '0px' }}>
            <PageHero subtitle="For projects that never got a goodbye." microcopy={null} />
          </div>

          {/* Primary: username scan */}
          <div className="ux-live-section" style={{ width: '100%', marginTop: '10px' }}>
            <form onSubmit={handleUserSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="input-button-wrapper input-block" style={{
                display: 'flex',
                border: `2px solid #0a0a0a`,
                overflow: 'hidden',
                background: '#FAF6EF',
              }}>
                <span style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#666', padding: '0 0 0 14px', display: 'flex', alignItems: 'center', flexShrink: 0, userSelect: 'none' }}>
                  github.com/
                </span>
                <input
                  autoFocus
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setUserError(null) }}
                  placeholder="your-username"
                  style={{
                    fontFamily: MONO,
                    fontSize: '14px',
                    flex: 1,
                    height: '52px',
                    padding: '0 8px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#160A06',
                    minWidth: 0,
                  }}
                />
                <ClickSpark color="#2b2b2b">
                  <button
                    className="input-submit-button alive-interactive"
                    type="submit"
                    disabled={!username.trim()}
                    style={{
                      fontFamily: FONT,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      flexShrink: 0,
                      padding: '0 20px',
                      height: '52px',
                      background: '#0a0a0a',
                      color: '#fff',
                      border: 'none',
                      cursor: !username.trim() ? 'default' : 'pointer',
                      opacity: !username.trim() ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.15s, opacity 0.12s',
                      userSelect: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                    onMouseEnter={e => { if (username.trim()) e.currentTarget.style.background = '#222' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a' }}
                  >
                    Scan Graveyard →
                  </button>
                </ClickSpark>
              </div>

              {userError && (
                <p style={{ margin: '-4px 2px 0', fontFamily: FONT, fontSize: '12px', color: '#8B0000' }}>
                  {userError}
                </p>
              )}
            </form>

            {/* Secondary: single repo toggle */}
            <div className="chips-section" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="alive-interactive"
                type="button"
                onClick={() => setShowRepoSearch(v => !v)}
                style={{
                  fontFamily: FONT,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: showRepoSearch ? '#1f1f1f' : '#5f5f5f',
                  background: 'transparent',
                  border: 'none',
                  padding: '6px 4px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'rgba(0,0,0,0.2)',
                  transition: 'color 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1f1f1f' }}
                onMouseLeave={e => { e.currentTarget.style.color = showRepoSearch ? '#1f1f1f' : '#5f5f5f' }}
              >
                {showRepoSearch ? '↑ hide single repo' : 'or check a single repo →'}
              </button>
            </div>

            {showRepoSearch && (
              <div style={{ marginTop: '8px' }}>
                <SearchForm url={url} setUrl={setUrl} onSubmit={analyze} onSelect={handleSelect} loading={loading} />
              </div>
            )}
          </div>

          {statsLoading && (
            <p style={{ fontFamily: MONO, fontSize: '11px', color: '#7f7f7f', textAlign: 'center', margin: '8px 0 0 0', letterSpacing: '0.06em' }}>
              counting graves...
            </p>
          )}
          {!statsLoading && (displayedBuried !== null || displayedProfiles !== null) && (
            <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: '#4f4f4f', opacity: 0.92, textAlign: 'center', margin: '8px 0 0 0', letterSpacing: '0.02em' }}>
              {displayedBuried !== null && displayedBuried >= 1 && (
                <span>{displayedBuried.toLocaleString()} repos buried</span>
              )}
              {displayedBuried !== null && displayedBuried >= 1 && displayedProfiles !== null && displayedProfiles >= 1 && (
                <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
              )}
              {displayedProfiles !== null && displayedProfiles >= 1 && (
                <span>{displayedProfiles.toLocaleString()} profiles scanned</span>
              )}
            </p>
          )}
        </>
      )}

      {certificate && !loading && (
        <div className="certificate-scroll-zone ux-live-section" style={{ width: '100%' }}>
          <CertificateCard cert={certificate} onReset={reset} />
        </div>
      )}

      {idle && (
        <div className="ux-live-section" style={{ width: '100%', marginTop: '34px', paddingBottom: 0 }}>
          <div style={{ marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#727272', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Recently Buried
            </p>
          </div>
          <RecentlyBuried onSelect={handleSelect} />
          <div style={{ marginTop: '28px', marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#727272', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Famous Casualties
            </p>
          </div>
          <Leaderboard onSelect={handleSelect} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={reset} />}

      <SiteFooter compact={idle} />
      </div>
    </main>
  )
}
