import { NextRequest, NextResponse } from 'next/server'
import type { UserRepoSummary } from '@/lib/types'

const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

interface GHRepo {
  full_name: string
  pushed_at: string | null
  archived: boolean
  language: string | null
  fork: boolean
  description: string | null
}

function buildCause(daysSince: number | null, archived: boolean): string {
  if (archived) return 'Archived by owner'
  if (daysSince === null) return 'No commits found'
  const years = Math.floor(daysSince / 365)
  const months = Math.floor(daysSince / 30)
  if (years >= 3) return `Dead for ${years} years`
  if (years >= 2) return 'No commits in over 2 years'
  if (months >= 1) return `No commits in ${months} month${months !== 1 ? 's' : ''}`
  return 'Recently quiet'
}

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch { return null }
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')?.trim()
  if (!username || !VALID_USERNAME.test(username)) {
    return NextResponse.json({ error: 'Invalid username.' }, { status: 400 })
  }

  const ghHeaders: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }

  const fetchOpts = { headers: ghHeaders, next: { revalidate: 3600 } } as const
  const [res1, res2] = await Promise.all([
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=1`, fetchOpts),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=2`, fetchOpts),
  ])

  if (res1.status === 404) return NextResponse.json({ error: 'GitHub user not found.' }, { status: 404 })
  if (res1.status === 403 || res1.status === 429) return NextResponse.json({ error: 'GitHub rate limit hit — try again in a minute.' }, { status: 429 })
  if (!res1.ok) return NextResponse.json({ error: 'GitHub API error. Try again.' }, { status: 502 })

  const [page1, page2]: [GHRepo[], GHRepo[]] = await Promise.all([
    res1.json(),
    res2.ok ? res2.json() : Promise.resolve([]),
  ])

  const now = Date.now()
  const repos: UserRepoSummary[] = [...page1, ...page2]
    .filter(r => !r.fork)
    .map(r => {
      const pushedMs = r.pushed_at ? new Date(r.pushed_at).getTime() : null
      const daysSinceLastPush = pushedMs !== null ? Math.floor((now - pushedMs) / 86_400_000) : null
      const isDead = r.archived || (daysSinceLastPush !== null && daysSinceLastPush >= 730)
      const isStruggling = !isDead && daysSinceLastPush !== null && daysSinceLastPush >= 90
      return {
        fullName: r.full_name,
        pushedAt: r.pushed_at,
        isArchived: r.archived,
        language: r.language,
        daysSinceLastPush,
        isDead,
        isStruggling,
        cause: isDead || isStruggling ? buildCause(daysSinceLastPush, r.archived) : '',
        description: r.description,
      }
    })

  try {
    const redis = await getRedis()
    if (redis) {
      await redis.incr('stats:profiles')
      await redis.lpush('recent:profiles', username)
      await redis.ltrim('recent:profiles', 0, 49)
    }
  } catch { /* non-critical */ }

  return NextResponse.json({ username, repos })
}
