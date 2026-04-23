import { NextRequest, NextResponse } from 'next/server'

// Repos buried before the Vercel migration — always added on top of the Redis counter.
// Redis only stores new burials since migration; the baseline is never baked in.
const BURIED_HISTORICAL_BASELINE = 800

function normalizeBuriedCount(rawBuried: number | null | undefined) {
  return (rawBuried ?? 0) + BURIED_HISTORICAL_BASELINE
}

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
      buried:     normalizeBuriedCount(buried),
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
    await redis.incr(`stats:${counter}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
