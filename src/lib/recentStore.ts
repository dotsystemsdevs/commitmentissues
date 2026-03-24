import { LeaderboardEntry } from './types'

const MAX_RECENT = 10
const KV_KEY = 'recent:burials'

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { kv } = await import('@vercel/kv')
    return kv
  } catch {
    return null
  }
}

export async function addRecent(entry: LeaderboardEntry): Promise<void> {
  const kv = await getKv()
  if (!kv) return
  const current = await kv.get<LeaderboardEntry[]>(KV_KEY) ?? []
  const filtered = current.filter(e => e.fullName !== entry.fullName)
  filtered.unshift(entry)
  await kv.set(KV_KEY, filtered.slice(0, MAX_RECENT))
}

export async function getRecent(): Promise<LeaderboardEntry[]> {
  const kv = await getKv()
  if (!kv) return []
  return await kv.get<LeaderboardEntry[]>(KV_KEY) ?? []
}
