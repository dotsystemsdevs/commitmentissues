import { NextRequest, NextResponse } from 'next/server'
import {
  computeDeathIndex,
  determineCauseOfDeath,
  generateLastWords,
  getDeathLabel,
  formatDate,
} from '@/lib/scoring'
import { RepoData, UserRepoSummary } from '@/lib/types'
import { addRecentBatch } from '@/lib/recentStore'

const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')?.trim()
  if (!username || !VALID_USERNAME.test(username)) {
    return NextResponse.json({ error: 'Invalid username.' }, { status: 400 })
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 3600 },
  })

  if (userRes.status === 404) {
    return NextResponse.json(
      { error: `User "${username}" not found on GitHub.` },
      { status: 404 }
    )
  }
  if (userRes.status === 403) {
    return NextResponse.json(
      { error: 'GitHub rate limit hit. Try again later.' },
      { status: 429 }
    )
  }
  if (!userRes.ok) {
    return NextResponse.json({ error: 'GitHub is unresponsive. Try again.' }, { status: 502 })
  }

  const [page1Res, page2Res] = await Promise.all([
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=public&sort=pushed&page=1`,
      { headers, signal: AbortSignal.timeout(10000), next: { revalidate: 3600 } }
    ),
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=public&sort=pushed&page=2`,
      { headers, signal: AbortSignal.timeout(10000), next: { revalidate: 3600 } }
    ),
  ])

  const repos1 = page1Res.ok ? await page1Res.json() : []
  const repos2 = page2Res.ok ? await page2Res.json() : []
  const allRepos = [...repos1, ...(Array.isArray(repos2) ? repos2 : [])]

  if (!Array.isArray(allRepos) || allRepos.length === 0) {
    return NextResponse.json({ username, repos: [] })
  }

  const results: UserRepoSummary[] = allRepos.map(r => {
    const repoData: RepoData = {
      name: r.name,
      fullName: r.full_name,
      description: r.description ?? null,
      createdAt: r.created_at,
      pushedAt: r.pushed_at,
      isArchived: r.archived ?? false,
      stargazersCount: r.stargazers_count ?? 0,
      forksCount: r.forks_count ?? 0,
      openIssuesCount: r.open_issues_count ?? 0,
      language: r.language ?? null,
      topics: r.topics ?? [],
      isFork: r.fork ?? false,
      commitCount: 0,
      lastCommitMessage: '',
      lastCommitDate: r.pushed_at,
    }
    const deathIndex = computeDeathIndex(repoData)
    const daysSincePush = Math.floor(
      (Date.now() - new Date(r.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    return {
      fullName: r.full_name,
      name: r.name,
      description: r.description ?? null,
      language: r.language ?? null,
      deathIndex,
      deathLabel: getDeathLabel(deathIndex),
      causeOfDeath: determineCauseOfDeath(repoData),
      lastWords: generateLastWords(repoData),
      lastCommitDate: formatDate(r.pushed_at),
      isArchived: r.archived ?? false,
      stargazersCount: r.stargazers_count ?? 0,
      daysSincePush,
    }
  })

  results.sort((a, b) => b.deathIndex - a.deathIndex)

  // Add top 10 to recently buried + increment buried counter
  const now = new Date().toISOString()
  addRecentBatch(
    results.slice(0, 10).map(r => ({
      fullName: r.fullName,
      cause: r.causeOfDeath,
      score: r.deathIndex,
      analyzedAt: now,
    }))
  ).catch(() => {})

  fetch(`${request.nextUrl.origin}/api/stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter: 'buried', by: results.length }),
  }).catch(() => {})

  fetch(`${request.nextUrl.origin}/api/stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter: 'profiles', by: 1 }),
  }).catch(() => {})

  return NextResponse.json({ username, repos: results })
}
