'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useRepoAnalysis } from '@/hooks/useRepoAnalysis'
import CertificateCard from '@/components/CertificateCard'
import LoadingState from '@/components/LoadingState'
import ErrorDisplay from '@/components/ErrorDisplay'
import SiteFooter from '@/components/SiteFooter'

function CertificateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const repo = searchParams.get('repo') ?? ''
  const { certificate, error, loading, analyze } = useRepoAnalysis()

  useEffect(() => {
    if (repo) analyze(`https://github.com/${repo}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo])

  function handleReset() {
    router.push('/')
  }

  return (
    <>
      {loading && <LoadingState />}
      {error && !loading && <ErrorDisplay error={error} onRetry={() => analyze(`https://github.com/${repo}`)} />}
      {certificate && !loading && (
        <div className="certificate-scroll-zone">
          <CertificateCard cert={certificate} onReset={handleReset} />
        </div>
      )}
    </>
  )
}

export default function CertificatePage() {
  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">
        <Suspense fallback={<LoadingState />}>
          <CertificateContent />
        </Suspense>

        <SiteFooter />
      </div>
    </main>
  )
}
