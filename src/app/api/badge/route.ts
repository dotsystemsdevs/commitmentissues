import { NextRequest, NextResponse } from 'next/server'

const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

interface GHRepo {
  pushed_at: string | null
  archived: boolean
  fork: boolean
}

async function fetchStats(username: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }
  const [r1, r2] = await Promise.all([
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=1`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&page=2`, { headers }),
  ])
  if (!r1.ok) return null
  const [p1, p2]: [GHRepo[], GHRepo[]] = await Promise.all([
    r1.json(),
    r2.ok ? r2.json() : Promise.resolve([]),
  ])
  const now = Date.now()
  let dead = 0, struggling = 0, alive = 0
  for (const r of [...p1, ...p2].filter(x => !x.fork)) {
    const days = r.pushed_at ? Math.floor((now - new Date(r.pushed_at).getTime()) / 86_400_000) : null
    if (r.archived || (days !== null && days >= 730)) dead++
    else if (days !== null && days >= 90) struggling++
    else alive++
  }
  return { dead, struggling, alive, total: dead + struggling + alive }
}

function buildSvg(username: string, dead: number, struggling: number, alive: number, total: number) {
  const BAR_X = 16, BAR_W = 408, BAR_Y = 76, BAR_H = 6
  const deadW       = total === 0 ? 0 : Math.round((dead       / total) * BAR_W)
  const strugglingW = total === 0 ? 0 : Math.round((struggling / total) * BAR_W)
  const aliveW      = total === 0 ? BAR_W : BAR_W - deadW - strugglingW
  const MONO = "'Courier New','Courier',ui-monospace,monospace"

  return `<svg width="440" height="128" viewBox="0 0 440 128" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Graveyard report for @${username}">
  <defs>
    <clipPath id="bar-clip"><rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_W}" height="${BAR_H}"/></clipPath>
  </defs>
  <rect width="440" height="128" fill="#FAF6EF"/>
  <rect x="1.5" y="1.5" width="437" height="125" fill="none" stroke="#0a0a0a" stroke-width="3"/>

  <text x="16" y="28" font-family=${JSON.stringify(MONO)} font-size="9" font-weight="700" fill="#9a9288" letter-spacing="2.2">🪦  GITHUB REPO GRAVEYARD</text>

  <text x="16" y="58" font-family=${JSON.stringify(MONO)} font-size="15" font-weight="700" letter-spacing="0.8">
    <tspan fill="#8B0000">${dead} DEAD</tspan><tspan fill="#cec6bb" font-weight="400">  ·  </tspan><tspan fill="${struggling > 0 ? '#b45309' : '#cec6bb'}" font-weight="${struggling > 0 ? '700' : '400'}">${struggling} STRUGGLING</tspan><tspan fill="#cec6bb" font-weight="400">  ·  </tspan><tspan fill="${alive > 0 ? '#2d7a3c' : '#cec6bb'}" font-weight="${alive > 0 ? '700' : '400'}">${alive} ALIVE</tspan>
  </text>

  <rect x="${BAR_X}" y="${BAR_Y}" width="${BAR_W}" height="${BAR_H}" fill="#e0d8ce"/>
  <g clip-path="url(#bar-clip)">
    ${deadW > 0       ? `<rect x="${BAR_X}"                       y="${BAR_Y}" width="${deadW}"       height="${BAR_H}" fill="#8B0000"/>` : ''}
    ${strugglingW > 0 ? `<rect x="${BAR_X + deadW}"               y="${BAR_Y}" width="${strugglingW}" height="${BAR_H}" fill="#b45309"/>` : ''}
    ${aliveW > 0      ? `<rect x="${BAR_X + deadW + strugglingW}" y="${BAR_Y}" width="${aliveW}"      height="${BAR_H}" fill="#2d7a3c"/>` : ''}
  </g>

  <text x="16" y="104" font-family=${JSON.stringify(MONO)} font-size="10" font-weight="500" fill="#7a7268" letter-spacing="1.2">commitmentissues.dev</text>
</svg>`
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')?.trim() ?? ''
  if (!username || !VALID_USERNAME.test(username)) {
    return new NextResponse('invalid username', { status: 400 })
  }

  const stats = await fetchStats(username)
  const { dead, struggling, alive, total } = stats ?? { dead: 0, struggling: 0, alive: 0, total: 0 }

  const svg = buildSvg(username, dead, struggling, alive, total)

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
