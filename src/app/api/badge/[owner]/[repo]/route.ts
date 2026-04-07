import { NextRequest, NextResponse } from 'next/server'
import {
  computeDeathIndex,
  getDeathLabel,
  determineCauseOfDeath,
} from '@/lib/scoring'
import { RepoData } from '@/lib/types'

const VALID_SEGMENT = /^[a-zA-Z0-9_.-]+$/

// Approximate character width for Verdana 11px (standard badge font)
function textWidth(text: string): number {
  const widths: Record<string, number> = {
    f: 5, i: 4, j: 4, l: 4, r: 5, t: 5, ' ': 4,
    m: 11, w: 10, W: 10, M: 11,
  }
  return text.split('').reduce((sum, ch) => sum + (widths[ch] ?? 7), 0)
}

function buildSvg(label: string, value: string, color: string): string {
  const lw = textWidth(label) + 20
  const rw = textWidth(value) + 20
  const total = lw + rw

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${total}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="20" fill="#1a1a1a"/>
    <rect x="${lw}" width="${rw}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${lw / 2}" y="15" fill="#000" fill-opacity=".3" aria-hidden="true">${label}</text>
    <text x="${lw / 2}" y="14">${label}</text>
    <text x="${lw + rw / 2}" y="15" fill="#000" fill-opacity=".3" aria-hidden="true">${value}</text>
    <text x="${lw + rw / 2}" y="14">${value}</text>
  </g>
</svg>`
}

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params

  if (!VALID_SEGMENT.test(owner) || !VALID_SEGMENT.test(repo)) {
    return new NextResponse('Invalid repo', { status: 400 })
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  }

  let repoData: RepoData
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
        headers,
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 86400 },
      }),
    ])

    if (!repoRes.ok) {
      const svg = buildSvg('⚰ commitmentissues', 'unknown', '#555')
      return new NextResponse(svg, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
      })
    }

    const repoJson = await repoRes.json()
    const commitsJson = commitsRes.ok ? await commitsRes.json() : []

    repoData = {
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
      commitCount: Array.isArray(commitsJson) ? commitsJson.length : 0,
      lastCommitMessage: commitsJson[0]?.commit?.message ?? 'No commits found',
      lastCommitDate: commitsJson[0]?.commit?.author?.date ?? repoJson.pushed_at,
    }
  } catch {
    const svg = buildSvg('⚰ commitmentissues', 'unknown', '#555')
    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
    })
  }

  const index = computeDeathIndex(repoData)
  const label = getDeathLabel(index)
  const cause = determineCauseOfDeath(repoData)

  // Color based on death index
  const color = index >= 9 ? '#5c0000' : index >= 6 ? '#7a1a00' : index >= 3 ? '#6b4400' : '#2d5a00'

  const valueText = label === 'dead dead' ? `☠ ${cause.slice(0, 28)}` : `${label} (${index}/10)`
  const svg = buildSvg('⚰ commitmentissues', valueText, color)

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
