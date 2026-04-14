import { Server }        from 'http'
import { MongooseClient } from 'src/infrastructure/database/mongoose-client.database'
import { disconnectRedis } from 'src/infrastructure/cache/redis-connection'
import { WinstonLogger }  from 'src/infrastructure/services'

const FORCE_SHUTDOWN_MS = 10_000

export function registerShutdownHandlers(
  server: Server,
  logger: WinstonLogger,
): void {

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully`)

    // Force kill after timeout
    const forceExit = setTimeout(() => {
      logger.error('Forced shutdown — took too long')
      process.exit(1)
    }, FORCE_SHUTDOWN_MS)

    // Don't let the timeout keep the process alive
    forceExit.unref()

    server.close(async () => {
      logger.info('HTTP server closed')

      await MongooseClient.getInstance().disconnect()
      logger.info('MongoDB disconnected')

      await disconnectRedis(logger)

      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', { reason })
    process.exit(1)
  })

  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception', { message: err.message, stack: err.stack })
    process.exit(1)
  })
}