// src/infrastructure/cache/redis-client.ts
import Redis from 'ioredis'

if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error('UPSTASH_REDIS_URL is not set in .env')
}

export const redisClient = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 5) return null
    return Math.min(times * 200, 2000)
  },
  // Required for Upstash — TLS is mandatory
  tls: {
    rejectUnauthorized: false,   // ← this fixes the Windows TLS issue
  },
  lazyConnect: true,
})

redisClient.on('connect', () => console.info('[Redis] Connected to Upstash'))
redisClient.on('error',   (e) => console.error('[Redis] Error:', e.message))
redisClient.on('close',   () => console.warn('[Redis] Connection closed'))