'use client'

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import CertificateCard from '@/components/CertificateCard'
import Leaderboard from '@/components/Leaderboard'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const EXAMPLE_URL = 'https://github.com/atom/atom'

export default function Page() {
  const { url, setUrl, certificate, error, loading, analyze, reset } = useRepoAnalysis()

  function handleReset() {
    reset()
    setTimeout(() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(), 50)
  }

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
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>

      {/* Hero */}
      {!certificate && (
        <header style={{ width: '100%', maxWidth: '680px', paddingTop: '44px', paddingBottom: '22px', textAlign: 'center' }}>
          <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'default', width: '100%', display: 'block' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', position: 'relative' }}>
              <span className="hero-glow" />
              <span style={{ fontSize: '56px', lineHeight: 1, position: 'relative', zIndex: 1 }}>🪦</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-gothic), serif',
              fontSize: 'clamp(2.4rem, 7vw, 3.6rem)',
              color: '#160A06',
              lineHeight: 0.95,
              marginBottom: '20px',
            }}>
              Certificate of Death
            </h1>
          </button>
          <p style={{ fontFamily: FONT, fontSize: '15px', color: '#938882', lineHeight: 1.6, margin: '0 auto', maxWidth: '420px' }}>
            Paste any GitHub URL. We issue an official death certificate for your abandoned repo.
          </p>
        </header>
      )}

      {/* Search */}
      {!certificate && (
        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '12px' }}>
          <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onExample={handleExample} loading={loading} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={() => analyze(url)} />}
      {certificate && !loading && (
        <div className="certificate-scroll-zone">
          <CertificateCard cert={certificate} onReset={handleReset} />
        </div>
      )}

      {/* Leaderboard section */}
      {idle && (
        <div style={{ width: '100%', maxWidth: '680px', borderTop: '1px solid #e0e0e0', marginTop: '40px', paddingTop: '28px', paddingBottom: '52px' }}>
          <Leaderboard onSelect={handleSelect} />
        </div>
      )}

      <footer style={{ marginTop: 'auto', paddingTop: '64px', paddingBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/about',   label: 'About'   },
            { href: '/pricing', label: 'Pricing' },
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms',   label: 'Terms'   },
            { href: '/refund',  label: 'Refunds' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ fontFamily: FONT, fontSize: '11px', color: '#938882', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
        <span style={{ fontFamily: FONT, fontSize: '11px', color: '#b0aca8' }}>© commitmentissues.dev</span>
      </footer>
    </main>
  )
}
