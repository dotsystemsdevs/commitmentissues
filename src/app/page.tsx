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
const EXAMPLE_URL = 'https://github.com/atom/atom'

export default function Page() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()

  function handleSelect(selectedUrl: string) {
    setUrl(selectedUrl)
    analyze(selectedUrl)
  }

  async function handleExample() {
    setUrl(EXAMPLE_URL)
    await analyze(EXAMPLE_URL)
  }

  const idle = !loading && !certificate && !error

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

      {/* Hero + Search — hidden once certificate is shown */}
      {!certificate && (
        <>
          <PageHero
            subtitle="Your repo is dead. Bury it properly."
            microcopy="Paste any GitHub repo → get its official cause of death + last words · No login · No storage"
          />

          <div style={{ width: '100%', marginBottom: 0 }}>
            <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onExample={handleExample} loading={loading} />
          </div>
        </>
      )}

      {/* Certificate — inline, no redirect */}
      {certificate && !loading && (
        <div className="certificate-scroll-zone" style={{ width: '100%' }}>
          <CertificateCard cert={certificate} onReset={reset} />
        </div>
      )}

      {/* Leaderboard — right below input as viral trigger */}
      {idle && (
        <div style={{ width: '100%', marginTop: '52px', paddingBottom: '52px' }}>
          <StatsBar />
          <div style={{ marginBottom: '14px', marginTop: '8px' }}>
            <p style={{ fontFamily: FONT, fontSize: '18px', fontWeight: 700, color: '#160A06', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
              The Great GitHub Graveyard
            </p>
            <p style={{ fontFamily: FONT, fontSize: '13px', color: '#938882', margin: 0 }}>
              Try a famous dead repo ↓
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
