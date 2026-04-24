import { NextRequest, NextResponse } from 'next/server'

const VALID_FULLNAME = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch { return null }
}

export async function GET() {
  const redis = await getRedis()
  if (!redis) return NextResponse.json({ totals: {} })
  try {
    const totals = await redis.hgetall<Record<string, string>>('candles:by_repo')
    const numeric: Record<string, number> = {}
    if (totals) {
      for (const [k, v] of Object.entries(totals)) {
        const n = typeof v === 'number' ? v : Number(v)
        if (Number.isFinite(n)) numeric[k] = n
      }
    }
    return NextResponse.json({ totals: numeric })
  } catch {
    return NextResponse.json({ totals: {} })
  }
}

export async function POST(request: NextRequest) {
  let body: { fullName?: string; action?: 'add' | 'remove' }
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const fullName = body?.fullName?.trim() ?? ''
  if (!fullName || !VALID_FULLNAME.test(fullName)) {
    return NextResponse.json({ error: 'Invalid repo name.' }, { status: 400 })
  }
  const action = body?.action === 'remove' ? 'remove' : 'add'

  const redis = await getRedis()
  if (!redis) return NextResponse.json({ count: action === 'add' ? 1 : 0, stored: false })

  try {
    if (action === 'remove') {
      const next = await redis.hincrby('candles:by_repo', fullName, -1)
      if (next < 0) {
        // Floor at 0 — someone tried to remove past zero
        await redis.hset('candles:by_repo', { [fullName]: 0 })
        return NextResponse.json({ count: 0, stored: true })
      }
      return NextResponse.json({ count: next, stored: true })
    }
    const count = await redis.hincrby('candles:by_repo', fullName, 1)
    return NextResponse.json({ count, stored: true })
  } catch {
    return NextResponse.json({ count: action === 'add' ? 1 : 0, stored: false })
  }
}
