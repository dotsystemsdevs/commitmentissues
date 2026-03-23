'use client'

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
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
            subtitle="Drop a GitHub URL. We'll write the obituary it deserves."
            microcopy={null}
          />

          <div style={{ width: '100%' }}>
            <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onSelect={handleSelect} loading={loading} />
          </div>

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
          <div style={{ marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#b0aca8', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              The Graveyard
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
