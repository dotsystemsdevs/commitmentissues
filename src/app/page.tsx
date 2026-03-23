'use client'

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
import StatsBar from '@/components/StatsBar'
import CertificateCard from '@/components/CertificateCard'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'

const FONT = `var(--font-dm), -apple-system, sans-serif`

export default function Page() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()

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
          <PageHero
            subtitle="Your repo is already dead. This just makes it official."
            microcopy={null}
          />

          <div style={{ width: '100%' }}>
            <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onSelect={handleSelect} loading={loading} />
          </div>

          {idle && (
            <div style={{ marginTop: '20px' }}>
              <StatsBar />
            </div>
          )}
        </>
      )}

      {/* Certificate — inline, no redirect */}
      {certificate && !loading && (
        <div className="certificate-scroll-zone" style={{ width: '100%' }}>
          <CertificateCard cert={certificate} onReset={reset} />
        </div>
      )}

      {/* Graveyard — right below social proof */}
      {idle && (
        <div style={{ width: '100%', marginTop: '36px', paddingBottom: '52px' }}>
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 700, color: '#160A06', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
              The Great GitHub Graveyard
            </p>
            <p style={{ fontFamily: FONT, fontSize: '13px', color: '#938882', margin: 0 }}>
              Click any repo to see how it died.
            </p>
          </div>
          <Leaderboard onSelect={handleSelect} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={() => analyze(url)} />}

      <SiteFooter />
      </div>
    </main>
  )
}
