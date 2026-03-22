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
            subtitle="Turn any GitHub repo into its official death certificate."
            microcopy={
              <span style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['no auth', 'no setup', 'instant result'].map(tag => (
                  <span key={tag} style={{ border: '1px solid #ccc', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', color: '#938882', letterSpacing: '0.03em', fontFamily: 'var(--font-dm), system-ui, sans-serif' }}>{tag}</span>
                ))}
              </span>
            }
          />

          <div style={{ width: '100%', marginBottom: 0 }}>
            <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onExample={handleExample} loading={loading} />
          </div>
        </>
      )}

      {/* Certificate — inline, no redirect */}
      {certificate && !loading && (
        <div style={{ width: '100%' }}>
          <div className="certificate-scroll-zone">
            <CertificateCard cert={certificate} onReset={reset} />
          </div>
          <SiteFooter />
        </div>
      )}

      {/* Leaderboard — right below input as viral trigger */}
      {idle && (
        <div style={{ width: '100%', marginTop: '32px', paddingBottom: '52px' }}>
          <StatsBar />
          <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#938882', marginBottom: '10px' }}>
            Notable repo deaths
          </p>
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
