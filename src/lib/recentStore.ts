import { LeaderboardEntry } from './types'

const MAX_RECENT = 10
const KV_KEY = 'recent:burials'

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch {
    return null
  }
}

export async function addRecent(entry: LeaderboardEntry): Promise<void> {
  const redis = await getRedis()
  if (!redis) return
  const current = await redis.get<LeaderboardEntry[]>(KV_KEY) ?? []
  const filtered = current.filter(e => e.fullName !== entry.fullName)
  filtered.unshift(entry)
  await redis.set(KV_KEY, filtered.slice(0, MAX_RECENT))
}

export async function getRecent(): Promise<LeaderboardEntry[]> {
  const redis = await getRedis()
  if (!redis) return []
  return await redis.get<LeaderboardEntry[]>(KV_KEY) ?? []
}
