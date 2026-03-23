'use client'

import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import SearchForm from '@/components/SearchForm'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import Leaderboard from '@/components/Leaderboard'
import StatsBar from '@/components/StatsBar'
import CertificateCard from '@/components/CertificateCard'
import CertificateSheet from '@/components/CertificateSheet'
import SiteFooter from '@/components/SiteFooter'
import PageHero from '@/components/PageHero'
import type { DeathCertificate } from '@/lib/types'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

const DEMO_CERT: DeathCertificate = {
  repoData: {
    name: 'atom',
    fullName: 'atom/atom',
    description: 'The hackable text editor for the 21st Century',
    createdAt: '2014-02-26T19:34:39Z',
    pushedAt: '2022-12-15T00:00:00Z',
    isArchived: true,
    stargazersCount: 60285,
    forksCount: 17341,
    openIssuesCount: 319,
    language: 'CoffeeScript',
    topics: [],
    isFork: false,
    commitCount: 38001,
    lastCommitMessage: 'Archiving the Atom editor',
    lastCommitDate: '2022-12-15T00:00:00Z',
  },
  deathIndex: 10,
  deathLabel: 'Officially Archived',
  causeOfDeath: 'GitHub built VS Code and forgot this existed',
  deathDate: 'December 15, 2022',
  age: '8 years',
  lastWords: 'At least I had good themes.',
  mourners: '60,285 stargazers',
  shareText: 'RIP atom/atom — officially dead.',
}

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
        <div className="home-layout">
          <div className="home-main">
            <PageHero
              subtitle={<>Your repo is already dead.<br />This just makes it official.</>}
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
          </div>

          {/* Demo certificate — desktop only, aria-hidden */}
          {idle && (
            <div className="home-cert-preview" aria-hidden="true">
              <div style={{ width: '220px', height: '310px', overflow: 'visible', position: 'relative' }}>
                <div style={{ width: '480px', transform: 'scale(0.458) rotate(-2deg)', transformOrigin: 'top left', pointerEvents: 'none', userSelect: 'none' }}>
                  <CertificateSheet cert={DEMO_CERT} visible={true} showStamp={true} />
                </div>
              </div>
              <p style={{ fontFamily: MONO, fontSize: '10px', color: '#b0aca8', letterSpacing: '0.1em', textAlign: 'center', marginTop: '6px' }}>
                ↑ sample output
              </p>
            </div>
          )}
        </div>
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
