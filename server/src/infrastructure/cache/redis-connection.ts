import { redisClient } from './redis-client'
import { WinstonLogger } from 'src/infrastructure/services'

export async function connectRedis(logger: WinstonLogger): Promise<void> {
  try {
    await redisClient.ping()
    logger.info('Redis connection verified')
  } catch (err) {
    logger.error('Redis failed to connect', { err })
    process.exit(1)
  }
}

export async function disconnectRedis(logger: WinstonLogger): Promise<void> {
  await redisClient.quit()
  logger.info('Redis disconnected')
}