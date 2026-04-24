'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { UserRepoSummary } from '@/lib/types'
import UserDashboard from '@/components/UserDashboard'
import LoadingState from '@/components/LoadingState'
import SubpageShell from '@/components/SubpageShell'

const MONO = `var(--font-courier), system-ui, sans-serif`

export default function UserPage() {
  const params = useParams()
  const router = useRouter()
  const username = typeof params.username === 'string' ? params.username : ''

  const [repos, setRepos]   = useState<UserRepoSummary[] | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(`/api/user?username=${encodeURIComponent(username)}`)
      .then(r => r.json())
      .then((d: { repos?: UserRepoSummary[]; error?: string }) => {
        if (d.error) { setError(d.error); return }
        setRepos(d.repos ?? [])
      })
      .catch(() => setError('Something went wrong. Try again.'))
      .finally(() => setLoading(false))
  }, [username])

  return (
    <SubpageShell
      title={undefined}
      subtitle={null}
      microcopy={null}
      hideHero
    >
      {loading && <LoadingState />}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontFamily: MONO, fontSize: '13px', color: '#8B0000', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => router.push('/')}
            style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '3px', color: '#160A06', cursor: 'pointer', minHeight: '44px', padding: '10px 0' }}
          >
            ← examine another subject
          </button>
        </div>
      )}

      {repos && !loading && <UserDashboard repos={repos} username={username} />}
    </SubpageShell>
  )
}
