'use client'

import { useEffect, useRef, useState } from 'react'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
import CertificateCard from '@/components/CertificateCard'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import RecentlyBuried from '@/components/RecentlyBuried'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

export default function Page() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()
  const [buried, setBuried] = useState<number | null>(null)
  const [displayedBuried, setDisplayedBuried] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const restoredRef = useRef(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then((d: { buried: number }) => setBuried(d.buried ?? 0))
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

  const idle = !loading && !certificate && !error

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

      {/* Hero + Search — hidden once certificate is shown */}
      {!certificate && (
        <>
          <div style={{ marginTop: '0px' }}>
            <PageHero
              subtitle="For projects that never got a goodbye."
              microcopy={null}
            />
          </div>

          <div className="ux-live-section" style={{ width: '100%', marginTop: '10px' }}>
            <SearchForm url={url} setUrl={setUrl} onSubmit={analyze} onSelect={handleSelect} loading={loading} />
          </div>

          {statsLoading && (
            <p style={{ fontFamily: MONO, fontSize: '11px', color: '#7f7f7f', textAlign: 'center', margin: '8px 0 0 0', letterSpacing: '0.06em' }}>
              counting graves...
            </p>
          )}
          {!statsLoading && displayedBuried !== null && displayedBuried >= 1 && (
            <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: '#4f4f4f', opacity: 0.92, textAlign: 'center', margin: '8px 0 0 0', letterSpacing: '0.02em' }}>
              {displayedBuried.toLocaleString()} repos buried
            </p>
          )}

        </>
      )}

      {/* Certificate — inline, no redirect */}
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
