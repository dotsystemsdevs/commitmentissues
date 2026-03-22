'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
import StatsBar from '@/components/StatsBar'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const EXAMPLE_URL = 'https://github.com/atom/atom'

export default function Page() {
  const router = useRouter()
  const { url, setUrl, certificate, error, loading, analyze } = useRepoAnalysis()

  useEffect(() => {
    if (certificate) {
      router.push(`/certificate?repo=${encodeURIComponent(certificate.repoData.fullName)}`)
    }
  }, [certificate, router])

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
      <header style={{ width: '100%', maxWidth: '680px', paddingTop: '44px', paddingBottom: '22px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px', lineHeight: 1 }}>🪦</div>
        <h1 style={{
          fontFamily: 'var(--font-gothic), serif',
          fontSize: 'clamp(2.4rem, 7vw, 3.6rem)',
          color: '#160A06',
          lineHeight: 0.95,
          marginBottom: '20px',
        }}>
          Certificate of Death
        </h1>
        <p style={{ fontFamily: FONT, fontSize: '15px', color: '#938882', lineHeight: 1.6, margin: '0 auto', maxWidth: '420px' }}>
          Turn any GitHub repo into its official death certificate.
        </p>
      </header>

      {/* Search */}
      <div style={{ width: '100%', maxWidth: '680px', marginBottom: '0' }}>
        <SearchForm url={url} setUrl={setUrl} onSubmit={() => analyze(url)} onExample={handleExample} loading={loading} />
      </div>

      {/* Leaderboard — right below input as viral trigger */}
      {idle && (
        <div style={{ width: '100%', maxWidth: '680px', marginTop: '32px', paddingBottom: '52px' }}>
          <StatsBar />
          <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#938882', marginBottom: '10px' }}>
            Notable repo deaths
          </p>
          <Leaderboard onSelect={handleSelect} />
        </div>
      )}

      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={() => analyze(url)} />}

      <footer style={{ marginTop: 'auto', paddingTop: '64px', paddingBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/faq',     label: 'FAQ'     },
            { href: '/pricing', label: 'Pricing' },
            { href: '/terms',   label: 'Terms'   },
            { href: '/privacy', label: 'Privacy' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ fontFamily: FONT, fontSize: '11px', color: '#938882', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ fontFamily: FONT, fontSize: '11px', color: '#b0aca8' }}>© commitmentissues.dev</span>
        </div>
      </footer>
    </main>
  )
}
