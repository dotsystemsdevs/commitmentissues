'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UserDashboard from '@/components/UserDashboard'
import LoadingState from '@/components/LoadingState'
import SiteFooter from '@/components/SiteFooter'
import type { UserRepoSummary } from '@/lib/types'

type UserApiResponse =
  | { error: string }
  | { username: string; repos: UserRepoSummary[] }

export default function UserPage() {
  const params = useParams()
  const router = useRouter()
  const username = typeof params.username === 'string' ? params.username : ''

  const [repos, setRepos] = useState<UserRepoSummary[] | null>(null)
  const [scannedUsername, setScannedUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const runScan = useCallback(() => {
    if (!username) return () => {}
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setRepos(null)

    fetch(`/api/user?username=${encodeURIComponent(username)}`, { signal: controller.signal })
      .then(async r => {
        const data = (await r.json().catch(() => null)) as UserApiResponse | null
        if (!r.ok) {
          const message =
            (data && 'error' in data && typeof data.error === 'string' && data.error) ||
            (r.status === 404
              ? `User "${username}" not found on GitHub.`
              : r.status === 429
                ? 'GitHub rate limit hit. Try again later.'
                : 'Something went wrong. Try again.')
          throw new Error(message)
        }
        if (!data || typeof data !== 'object') throw new Error('Something went wrong. Try again.')
        if ('error' in data) throw new Error(data.error)

        const nextUsername = data.username || username
        const nextRepos = data.repos
        setScannedUsername(nextUsername || username)
        setRepos(nextRepos)
      })
      .catch(err => {
        if (err?.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Network error. Try again.')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [username])

  useEffect(() => {
    if (!username) {
      setLoading(false)
      setError('Missing username.')
      return
    }
    return runScan()
  }, [username, runScan])

  return (
    <main className="page-shell-main">
      <div className="page-shell-inner">

        <header className="user-page-header">
          <p className="user-page-kicker">graveyard scan</p>
          <p className="user-page-handle" title={username ? `@${username}` : 'Unknown user'}>
            {username ? `@${username}` : 'unknown'}
          </p>
        </header>

        {loading && <LoadingState />}

        {!loading && error && (
          <section className="user-page-state" aria-live="polite">
            <div className="user-page-state-card">
              <p className="user-page-error">{error}</p>
              <div className="user-page-state-actions">
                <button
                  type="button"
                  className="user-page-btn user-page-btn--primary alive-interactive"
                  onClick={() => runScan()}
                >
                  Retry scan
                </button>
                <button
                  type="button"
                  className="user-page-btn user-page-btn--ghost alive-interactive"
                  onClick={() => router.push('/')}
                >
                  ← Back home
                </button>
              </div>
              <p className="user-page-state-hint">
                Tip: GitHub sometimes rate-limits requests. Waiting a minute usually fixes it.
              </p>
            </div>
          </section>
        )}

        {repos && !loading && !error && (
          <div className="ux-live-section user-page-results">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="user-page-back alive-interactive"
            >
              ← back
            </button>
            <UserDashboard username={scannedUsername || username} repos={repos} />
          </div>
        )}

        <SiteFooter compact={false} />
      </div>
    </main>
  )
}
