import { NextRequest, NextResponse } from 'next/server'

async function getKv() {
  try {
    const { kv } = await import('@vercel/kv')
    return kv
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const kv = await getKv()
    if (!kv) return NextResponse.json({ buried: 0, shared: 0, downloaded: 0 })
    const [buried, shared, downloaded] = await Promise.all([
      kv.get<number>('stats:buried'),
      kv.get<number>('stats:shared'),
      kv.get<number>('stats:downloaded'),
    ])
    return NextResponse.json({
      buried:     buried     ?? 0,
      shared:     shared     ?? 0,
      downloaded: downloaded ?? 0,
    })
  } catch {
    return NextResponse.json({ buried: 0, shared: 0, downloaded: 0 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { counter } = await req.json() as { counter: 'buried' | 'shared' | 'downloaded' }
    if (!['buried', 'shared', 'downloaded'].includes(counter)) {
      return NextResponse.json({ error: 'invalid counter' }, { status: 400 })
    }
    const kv = await getKv()
    if (!kv) return NextResponse.json({ ok: true })
    await kv.incr(`stats:${counter}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
