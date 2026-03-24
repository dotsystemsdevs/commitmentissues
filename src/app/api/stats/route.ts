import { NextRequest, NextResponse } from 'next/server'

const BURIED_HISTORICAL_BASELINE = 800

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const redis = await getRedis()
    if (!redis) return NextResponse.json({ buried: BURIED_HISTORICAL_BASELINE, shared: 0, downloaded: 0 })
    const [buried, shared, downloaded] = await Promise.all([
      redis.get<number>('stats:buried'),
      redis.get<number>('stats:shared'),
      redis.get<number>('stats:downloaded'),
    ])
    return NextResponse.json({
      buried:     buried     ?? BURIED_HISTORICAL_BASELINE,
      shared:     shared     ?? 0,
      downloaded: downloaded ?? 0,
    })
  } catch {
    return NextResponse.json({ buried: BURIED_HISTORICAL_BASELINE, shared: 0, downloaded: 0 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { counter } = await req.json() as { counter: 'buried' | 'shared' | 'downloaded' }
    if (!['buried', 'shared', 'downloaded'].includes(counter)) {
      return NextResponse.json({ error: 'invalid counter' }, { status: 400 })
    }
    const redis = await getRedis()
    if (!redis) return NextResponse.json({ ok: true })
    if (counter === 'buried') {
      const currentBuried = await redis.get<number>('stats:buried')
      if (currentBuried == null) {
        await redis.set('stats:buried', BURIED_HISTORICAL_BASELINE)
      }
    }
    await redis.incr(`stats:${counter}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
