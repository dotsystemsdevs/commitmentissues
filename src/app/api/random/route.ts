import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const dateStr = oneYearAgo.toISOString().split('T')[0]

  const page = Math.floor(Math.random() * 8) + 1

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'commitmentissues.dev',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=pushed:<${dateStr}+stars:5..300+is:public+fork:false&sort=updated&order=desc&per_page=30&page=${page}`,
      { headers, next: { revalidate: 120 } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Could not fetch random repo' }, { status: 502 })
    }

    const data = await res.json()
    const items: { full_name: string }[] = data.items ?? []

    if (items.length === 0) {
      return NextResponse.json({ error: 'No repos found' }, { status: 404 })
    }

    const repo = items[Math.floor(Math.random() * items.length)]
    return NextResponse.json({ url: `https://github.com/${repo.full_name}` })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch random repo' }, { status: 500 })
  }
}
