const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
  } catch {
    return null
  }
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const redis = await getRedis()

  if (!redis) {
    // No Redis configured — allow all requests
    return { allowed: true }
  }

  const key = `ratelimit:${ip}`
  const now = Date.now()

  const raw = await redis.get<{ count: number; resetAt: number }>(key)

  if (!raw || now > raw.resetAt) {
    await redis.set(key, { count: 1, resetAt: now + WINDOW_MS }, { px: WINDOW_MS })
    return { allowed: true }
  }

  if (raw.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((raw.resetAt - now) / 1000) }
  }

  await redis.set(key, { count: raw.count + 1, resetAt: raw.resetAt }, { px: raw.resetAt - now })
  return { allowed: true }
}
