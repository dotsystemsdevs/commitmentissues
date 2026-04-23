import { NextResponse } from 'next/server'

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch { return null }
}

export async function GET() {
  try {
    const redis = await getRedis()
    if (!redis) return NextResponse.json([])
    const profiles = await redis.lrange<string>('recent:profiles', 0, 29)
    const seen = new Set<string>()
    const unique = profiles.filter(p => { if (seen.has(p)) return false; seen.add(p); return true })
    return NextResponse.json(unique)
  } catch {
    return NextResponse.json([])
  }
}
