import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import {
  determineCauseOfDeath,
  generateLastWords,
  computeAge,
  formatDate,
} from '@/lib/scoring'
import { RepoData } from '@/lib/types'

export const runtime = 'nodejs'

const VALID_SEGMENT = /^[a-zA-Z0-9_.-]+$/
const W = 794
const H = 1123
const INK = '#1A0F06'
const WARM = '#8B6B4A'
const RED = '#8B0000'
const LINE = '#C4A882'
const BG = '#FAF6EF'

async function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }, signal: AbortSignal.timeout(3000) }
    ).then(r => r.text())
    const m = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)\s+format\(['"]woff2['"]\)/)
    if (!m) return null
    return fetch(m[1], { signal: AbortSignal.timeout(3000) }).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

function Row({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: border ? `1px solid #EDE5D8` : 'none',
    }}>
      <div style={{ fontSize: 15, color: WARM, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 17, color: INK, fontWeight: 600 }}>{value}</div>
    </div>
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params

  if (!VALID_SEGMENT.test(owner) || !VALID_SEGMENT.test(repo)) {
    return new Response('Invalid repo', { status: 400 })
  }

  const ghHeaders: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }

  let repoData: RepoData
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers: ghHeaders, signal: AbortSignal.timeout(8000) }),
    ])
    if (!repoRes.ok) return new Response('Repo not found', { status: 404 })
    const rj = await repoRes.json()
    const cj = commitsRes.ok ? await commitsRes.json() : []
    repoData = {
      name: rj.name, fullName: rj.full_name, description: rj.description ?? null,
      createdAt: rj.created_at, pushedAt: rj.pushed_at, isArchived: rj.archived ?? false,
      stargazersCount: rj.stargazers_count ?? 0, forksCount: rj.forks_count ?? 0,
      openIssuesCount: rj.open_issues_count ?? 0, language: rj.language ?? null,
      topics: rj.topics ?? [], isFork: rj.fork ?? false,
      commitCount: Array.isArray(cj) ? cj.length : 0,
      lastCommitMessage: cj[0]?.commit?.message ?? 'No commits found',
      lastCommitDate: cj[0]?.commit?.author?.date ?? rj.pushed_at,
    }
  } catch {
    return new Response('Failed to fetch repo', { status: 502 })
  }

  const causeOfDeath = determineCauseOfDeath(repoData)
  const lastWords = generateLastWords(repoData)
  const deathDate = formatDate(repoData.lastCommitDate)
  const age = computeAge(repoData.createdAt, repoData.lastCommitDate)
  const ownerName = repoData.fullName.split('/')[0]

  const [gothicFont, monoFont] = await Promise.all([
    loadFont('Unifraktur Maguntia', 400),
    loadFont('Courier Prime', 400),
  ])
  const fonts: { name: string; data: ArrayBuffer; weight: 400; style: 'normal' }[] = []
  if (gothicFont) fonts.push({ name: 'Gothic', data: gothicFont, weight: 400, style: 'normal' })
  if (monoFont) fonts.push({ name: 'Mono', data: monoFont, weight: 400, style: 'normal' })

  const gothic = fonts.find(f => f.name === 'Gothic') ? 'Gothic' : 'Georgia, serif'
  const mono = fonts.find(f => f.name === 'Mono') ? 'Mono' : 'Courier New, monospace'

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, background: BG, border: `5px solid ${INK}`, display: 'flex', flexDirection: 'column', padding: 16 }}>
        <div style={{ flex: 1, border: `2px solid ${INK}`, display: 'flex', flexDirection: 'column', padding: '44px 56px' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 28, borderBottom: `3px solid ${INK}` }}>
            <div style={{ fontSize: 56, color: INK, lineHeight: 1.06, marginBottom: 12, fontFamily: gothic }}>
              Certificate of Death
            </div>
            <div style={{ fontSize: 13, letterSpacing: '0.2em', color: WARM, fontStyle: 'italic', fontFamily: mono }}>
              official record of abandonment
            </div>
          </div>

          {/* Repo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '34px 0', borderBottom: `2px solid ${LINE}` }}>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: WARM, marginBottom: 14, fontFamily: mono }}>THIS IS TO CERTIFY THE DEATH OF</div>
            <div style={{ fontSize: 15, color: WARM, marginBottom: 10, fontFamily: mono }}>{ownerName} /</div>
            <div style={{ fontSize: 52, color: INK, lineHeight: 1.08, fontWeight: 700 }}>{repoData.name}</div>
            {repoData.description && (
              <div style={{ fontSize: 14, color: WARM, marginTop: 14, lineHeight: 1.5, textAlign: 'center', maxWidth: 560, fontFamily: mono }}>
                {repoData.description.slice(0, 120)}{repoData.description.length > 120 ? '...' : ''}
              </div>
            )}
          </div>

          {/* Cause */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '34px 0', borderBottom: `2px solid ${LINE}` }}>
            <div style={{ fontSize: 14, letterSpacing: '0.3em', color: WARM, fontFamily: mono }}>CAUSE OF DEATH</div>
            <div style={{ fontSize: 34, color: RED, lineHeight: 1.35, maxWidth: 560, textAlign: 'center', marginTop: 20, fontStyle: 'italic', fontWeight: 600 }}>
              {causeOfDeath}
            </div>
            {/* Stamp — no transform, Satori doesn't support it */}
            <div style={{ display: 'flex', marginTop: 24, border: `4px solid rgba(139,26,26,0.65)`, padding: '8px 20px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(139,26,26,0.70)', fontFamily: mono }}>
                REST IN PRODUCTION
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '28px 0', borderBottom: `2px solid ${LINE}` }}>
            <Row label="Date of death" value={deathDate} border />
            <Row label="Age at death" value={age} />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', padding: '26px 0', borderBottom: `2px solid ${LINE}` }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 22, color: INK, fontWeight: 700, fontFamily: mono }}>{repoData.stargazersCount.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: WARM, letterSpacing: '0.3em', marginTop: 6, fontFamily: mono }}>STARS</div>
            </div>
            <div style={{ width: 1, background: LINE }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 22, color: INK, fontWeight: 700, fontFamily: mono }}>{repoData.forksCount.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: WARM, letterSpacing: '0.3em', marginTop: 6, fontFamily: mono }}>FORKS</div>
            </div>
            {repoData.language && (
              <>
                <div style={{ width: 1, background: LINE }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 22, color: INK, fontWeight: 700, fontFamily: mono }}>{repoData.language}</div>
                  <div style={{ fontSize: 11, color: WARM, letterSpacing: '0.3em', marginTop: 6, fontFamily: mono }}>LANGUAGE</div>
                </div>
              </>
            )}
          </div>

          {/* Last words */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '26px 0' }}>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: WARM, fontFamily: mono }}>LAST WORDS</div>
            <div style={{ fontSize: 22, color: INK, lineHeight: 1.55, marginTop: 14, fontStyle: 'italic', textAlign: 'center', maxWidth: 560 }}>
              {'\u201C'}{lastWords}{'\u201D'}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: LINE, letterSpacing: '0.18em', fontFamily: mono }}>ISSUED BY COMMITMENTISSUES.DEV</div>
          </div>

        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: fonts.length ? fonts : undefined,
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600' },
    }
  )
}
