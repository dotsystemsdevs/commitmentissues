import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'

// Allowlist: GitHub username/repo segments — letters, digits, hyphen, dot, underscore only
const VALID_SEGMENT = /^[a-zA-Z0-9_.-]+$/
import { addRecent } from '@/lib/recentStore'
import {
  computeDeathIndex,
  getDeathLabel,
  determineCauseOfDeath,
  generateLastWords,
  computeAge,
  formatDate,
  buildShareText,
} from '@/lib/scoring'
import { RepoData, DeathCertificate } from '@/lib/types'

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: `Slow down. Try again in ${retryAfter}s.`, retryAfter },
      { status: 429 }
    )
  }

  const rawUrl = request.nextUrl.searchParams.get('url')
  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 })
  }

  let owner: string
  let cleanRepo: string
  try {
    const urlObj = new URL(rawUrl)
    if (urlObj.hostname !== 'github.com') {
      return NextResponse.json(
        { error: "That repo is too alive to die. Paste a real GitHub URL." },
        { status: 400 }
      )
    }
    const segments = urlObj.pathname.replace(/^\/|\/$/g, '').split('/')
    owner = segments[0]
    cleanRepo = (segments[1] ?? '').replace(/\.git$/, '')
    if (!owner || !cleanRepo) {
      return NextResponse.json(
        { error: "That repo is too alive to die. Paste a real GitHub URL." },
        { status: 400 }
      )
    }
    if (!VALID_SEGMENT.test(owner) || !VALID_SEGMENT.test(cleanRepo)) {
      return NextResponse.json(
        { error: "That repo is too alive to die. Paste a real GitHub URL." },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: "That repo is too alive to die. Paste a real GitHub URL." },
      { status: 400 }
    )
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }

  let repoRes: Response
  let commitsRes: Response
  try {
    ;[repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
        headers,
        next: { revalidate: 86400 },
      }),
      fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=1`,
        { headers, next: { revalidate: 86400 } }
      ),
    ])
  } catch {
    return NextResponse.json(
      { error: 'The reaper is busy. Try again in a moment.' },
      { status: 502 }
    )
  }

  if (repoRes.status === 404) {
    return NextResponse.json(
      { error: 'Repo not found or still breathing in private. Public repos only.' },
      { status: 404 }
    )
  }

  if (repoRes.status === 403) {
    const remaining = repoRes.headers.get('X-RateLimit-Remaining')
    if (remaining === '0') {
      const resetUnix = repoRes.headers.get('X-RateLimit-Reset')
      const resetTime = resetUnix
        ? new Date(parseInt(resetUnix) * 1000).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'soon'
      return NextResponse.json(
        { error: `GitHub is tired. Rate limit resets at ${resetTime}.` },
        { status: 429 }
      )
    }
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }

  if (!repoRes.ok) {
    return NextResponse.json(
      { error: 'The reaper is busy. Try again in a moment.' },
      { status: 500 }
    )
  }

  const repoJson = await repoRes.json()
  const commitsJson = commitsRes.ok ? await commitsRes.json() : []

  const lastCommitDate: string =
    commitsJson[0]?.commit?.author?.date ?? repoJson.pushed_at
  const lastCommitMessage: string =
    commitsJson[0]?.commit?.message ?? 'No commits found'
  const commitCount: number = Array.isArray(commitsJson) ? commitsJson.length : 0

  const repoData: RepoData = {
    name: repoJson.name,
    fullName: repoJson.full_name,
    description: repoJson.description ?? null,
    createdAt: repoJson.created_at,
    pushedAt: repoJson.pushed_at,
    isArchived: repoJson.archived ?? false,
    stargazersCount: repoJson.stargazers_count ?? 0,
    forksCount: repoJson.forks_count ?? 0,
    openIssuesCount: repoJson.open_issues_count ?? 0,
    language: repoJson.language ?? null,
    topics: repoJson.topics ?? [],
    isFork: repoJson.fork ?? false,
    commitCount,
    lastCommitMessage,
    lastCommitDate,
  }

  const deathIndex = computeDeathIndex(repoData)
  const deathLabel = getDeathLabel(deathIndex)
  const causeOfDeath = determineCauseOfDeath(repoData)
  const lastWords = generateLastWords(repoData)

  const certificate: DeathCertificate = {
    repoData,
    deathIndex,
    deathLabel,
    causeOfDeath,
    deathDate: formatDate(lastCommitDate),
    age: computeAge(repoData.createdAt, lastCommitDate),
    lastWords,
    mourners: `${repoData.stargazersCount} stars, ${repoData.forksCount} forks (probably also dead)`,
    shareText: buildShareText(repoData.fullName, causeOfDeath),
  }

  addRecent({
    fullName: repoData.fullName,
    cause: causeOfDeath,
    score: deathIndex,
    analyzedAt: new Date().toISOString(),
  }).catch(() => {})

  return NextResponse.json(certificate)
}
