import { NextRequest, NextResponse } from 'next/server'

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
    const [buried, shared, downloaded, profiles] = await Promise.all([
      redis.get<number>('stats:buried'),
      redis.get<number>('stats:shared'),
      redis.get<number>('stats:downloaded'),
      redis.get<number>('stats:profiles'),
    ])
    return NextResponse.json({
      buried:     normalizeBuriedCount(buried),
      shared:     shared     ?? 0,
      downloaded: downloaded ?? 0,
      profiles:   profiles   ?? 0,
    })
  } catch {
    return NextResponse.json({ buried: BURIED_HISTORICAL_BASELINE, shared: 0, downloaded: 0 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { counter, by } = await req.json() as { counter: 'buried' | 'shared' | 'downloaded' | 'profiles'; by?: number }
    if (!['buried', 'shared', 'downloaded', 'profiles'].includes(counter)) {
      return NextResponse.json({ error: 'invalid counter' }, { status: 400 })
    }
    const redis = await getRedis()
    if (!redis) return NextResponse.json({ ok: true })
    const amount = typeof by === 'number' && by > 1 ? by : 1
    await redis.incrby(`stats:${counter}`, amount)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
