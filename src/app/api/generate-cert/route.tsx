import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import Stripe from 'stripe'
import {
  computeDeathIndex, getDeathLabel, determineCauseOfDeath,
  generateLastWords, computeAge, formatDate, buildShareText,
} from '@/lib/scoring'
import type { RepoData, DeathCertificate } from '@/lib/types'

export const runtime = 'nodejs'

const W = 2480
const H = 3508
const S = W / 480 // 5.1667

function px(n: number) { return Math.round(n * S) }

// Module-level cache — survives warm instances
const fontCache = new Map<string, ArrayBuffer>()

async function loadFont(family: string, weight: number, italic = false): Promise<ArrayBuffer> {
  const key = `${family}:${weight}:${italic}`
  if (fontCache.has(key)) return fontCache.get(key)!
  const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120' } }
  ).then(r => r.text())
  let fontUrl: string | undefined
  const re = /url\(([^)]+\.woff2)\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css)) !== null) fontUrl = m[1]
  if (!fontUrl) throw new Error(`Font not found: ${family} ${weight} ${italic}`)
  const buf = await fetch(fontUrl).then(r => r.arrayBuffer())
  fontCache.set(key, buf)
  return buf
}

async function regenerateCert(fullName: string): Promise<DeathCertificate> {
  const [owner, repo] = fullName.split('/')
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }
  const [repoRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
  ])
  if (!repoRes.ok) throw new Error('GitHub error')
  const rj = await repoRes.json()
  const cj = commitsRes.ok ? await commitsRes.json() : []
  const lcd: string = cj[0]?.commit?.author?.date ?? rj.pushed_at
  const r: RepoData = {
    name: rj.name, fullName: rj.full_name, description: rj.description ?? null,
    createdAt: rj.created_at, pushedAt: rj.pushed_at, isArchived: rj.archived ?? false,
    stargazersCount: rj.stargazers_count ?? 0, forksCount: rj.forks_count ?? 0,
    openIssuesCount: rj.open_issues_count ?? 0, language: rj.language ?? null,
    topics: rj.topics ?? [], isFork: rj.fork ?? false,
    commitCount: Array.isArray(cj) ? cj.length : 0,
    lastCommitMessage: cj[0]?.commit?.message ?? 'No commits found',
    lastCommitDate: lcd,
  }
  const cause = determineCauseOfDeath(r)
  const idx = computeDeathIndex(r)
  return {
    repoData: r, deathIndex: idx, deathLabel: getDeathLabel(idx), causeOfDeath: cause,
    deathDate: formatDate(lcd), age: computeAge(r.createdAt, lcd),
    lastWords: generateLastWords(r),
    mourners: `${r.stargazersCount} stars, ${r.forksCount} forks (probably also dead)`,
    shareText: buildShareText(r.fullName, cause),
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment required' }, { status: 401 })
    }
    const repoFullName = session.metadata?.repo
    if (!repoFullName) return NextResponse.json({ error: 'Missing repo metadata' }, { status: 400 })

    // Parallel: cert data + fonts
    const [
      cert,
      dmSans400, dmSans700, dmSans400i,
      courier400, courier700, courier400i,
      gothic400,
    ] = await Promise.all([
      regenerateCert(repoFullName),
      loadFont('DM Sans', 400),
      loadFont('DM Sans', 700),
      loadFont('DM Sans', 400, true),
      loadFont('Courier Prime', 400),
      loadFont('Courier Prime', 700),
      loadFont('Courier Prime', 400, true),
      loadFont('UnifrakturMaguntia', 400),
    ])

    const { repoData: rd } = cert
    const SANS = 'DM Sans'
    const MONO = 'Courier Prime'
    const GOTH = 'UnifrakturMaguntia'

    const stats = [
      { value: rd.stargazersCount.toLocaleString(), label: 'stars' },
      { value: rd.forksCount.toLocaleString(), label: 'forks' },
      ...(rd.language ? [{ value: rd.language, label: 'language' }] : []),
    ]

    const desc = rd.description
      ? (rd.description.length > 110 ? rd.description.slice(0, 107) + '\u2026' : rd.description)
      : null

    const img = new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: W, height: H, background: '#FAF6EF', border: `${px(3)}px solid #1A0F06`, padding: px(10) }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: `${px(1)}px solid #1A0F06`, padding: `${px(19)}px ${px(34)}px` }}>

            {/* HEADER */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: px(19), borderBottom: `${px(2)}px solid #1A0F06` }}>
              <span style={{ fontFamily: MONO, fontSize: px(7), letterSpacing: '0.6em', color: '#8B6B4A', textTransform: 'uppercase', marginBottom: px(10) }}>commitmentissues.dev</span>
              <span style={{ fontFamily: GOTH, fontSize: px(40), color: '#1A0F06', lineHeight: 1.05, marginBottom: px(10) }}>Certificate of Death</span>
              <span style={{ fontFamily: MONO, fontSize: px(7), letterSpacing: '0.25em', color: '#8B6B4A', fontStyle: 'italic' }}>official record of abandonment</span>
            </div>

            {/* REPO */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${px(19)}px 0`, borderBottom: `${px(1)}px solid #C4A882` }}>
              <span style={{ fontFamily: MONO, fontSize: px(7), letterSpacing: '0.4em', color: '#8B6B4A', textTransform: 'uppercase', marginBottom: px(10) }}>this is to certify the death of</span>
              <span style={{ fontFamily: MONO, fontSize: px(8), color: '#8B6B4A', marginBottom: px(5) }}>{rd.fullName.split('/')[0]} /</span>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: px(33), color: '#1A0F06', lineHeight: 1.08, letterSpacing: '-0.02em' }}>{rd.name}</span>
              {desc ? <span style={{ fontFamily: MONO, fontSize: px(9), color: '#8B6B4A', marginTop: px(10), lineHeight: 1.6, textAlign: 'center' }}>{desc}</span> : null}
            </div>

            {/* CAUSE */}
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${px(19)}px 0`, borderBottom: `${px(1)}px solid #C4A882` }}>
              <span style={{ fontFamily: MONO, fontSize: px(7), letterSpacing: '0.55em', color: '#8B6B4A', textTransform: 'uppercase', marginBottom: px(15) }}>cause of death</span>
              <span style={{ fontFamily: SANS, fontStyle: 'italic', fontSize: px(20), color: '#8B0000', lineHeight: 1.45, textAlign: 'center' }}>{cert.causeOfDeath}</span>
            </div>

            {/* DATE + AGE */}
            <div style={{ display: 'flex', flexDirection: 'column', padding: `${px(12)}px 0`, borderBottom: `${px(1)}px solid #C4A882` }}>
              {[
                { label: 'Date of death', value: cert.deathDate },
                { label: 'Age at death',  value: cert.age },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: `${px(5)}px 0`, borderBottom: i === 0 ? `${px(1)}px solid #EDE5D8` : 'none' }}>
                  <span style={{ fontFamily: MONO, fontSize: px(9), color: '#8B6B4A', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: px(10), color: '#1A0F06', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* STATS */}
            <div style={{ display: 'flex', padding: `${px(12)}px 0`, borderBottom: `${px(1)}px solid #C4A882` }}>
              {stats.map(({ value, label }, i) => (
                <div key={label} style={{ display: 'flex', flex: 1 }}>
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: px(14), color: '#1A0F06' }}>{value}</span>
                    <span style={{ fontFamily: MONO, fontSize: px(6), color: '#8B6B4A', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: px(4) }}>{label}</span>
                  </div>
                  {i < stats.length - 1 ? <div style={{ width: px(1), background: '#C4A882' }} /> : null}
                </div>
              ))}
            </div>

            {/* LAST WORDS */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${px(12)}px 0`, textAlign: 'center' }}>
              <span style={{ fontFamily: MONO, fontSize: px(7), letterSpacing: '0.5em', textTransform: 'uppercase', color: '#8B6B4A', marginBottom: px(10) }}>Last words</span>
              <span style={{ fontFamily: SANS, fontStyle: 'italic', fontSize: px(14), color: '#1A0F06', lineHeight: 1.6 }}>{'\u201C'}{cert.lastWords}{'\u201D'}</span>
            </div>

            {/* FOOTER */}
            <div style={{ display: 'flex', marginTop: 'auto', justifyContent: 'center', paddingTop: px(10) }}>
              <span style={{ fontFamily: MONO, fontSize: px(6.5), fontStyle: 'italic', color: '#C4A882', letterSpacing: '0.03em' }}>No commits were harmed in the making of this document.</span>
            </div>

          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        fonts: [
          { name: 'DM Sans',            data: dmSans400,  weight: 400, style: 'normal' as const },
          { name: 'DM Sans',            data: dmSans700,  weight: 700, style: 'normal' as const },
          { name: 'DM Sans',            data: dmSans400i, weight: 400, style: 'italic' as const },
          { name: 'Courier Prime',      data: courier400, weight: 400, style: 'normal' as const },
          { name: 'Courier Prime',      data: courier700, weight: 700, style: 'normal' as const },
          { name: 'Courier Prime',      data: courier400i,weight: 400, style: 'italic' as const },
          { name: 'UnifrakturMaguntia', data: gothic400,  weight: 400, style: 'normal' as const },
        ],
      }
    )

    const safeName = rd.name.replace(/[^a-zA-Z0-9-]/g, '-')
    return new Response(img.body, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${safeName}-certificate-300dpi.png"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    console.error('[generate-cert]', err)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}
