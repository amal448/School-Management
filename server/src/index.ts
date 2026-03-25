// src/index.ts
import { AppConfig }        from './config/app.config'
import { MongooseClient }   from './infrastructure/database/mongoose-client.database'
import { redisClient }      from './infrastructure/cache/redis-client'
import { buildDependencies } from './interfaces/adapters/di/di-container'
import { createExpressApp } from './interfaces/adapters/express-adapter'

async function bootstrap(): Promise<void> {

  //  Connect MongoDB ───────────────────────────
  const db = MongooseClient.getInstance()
  await db.connect()

  // ──  Connect Redis ─────────────────────────────
  try {
    await redisClient.ping()
    console.info('[Redis] Connection verified')
  } catch (err) {
    console.error('[Redis] Failed to connect:', err)
    process.exit(1)
  }

  // ──  Wire all dependencies (Composition Root) ───
  const deps = buildDependencies()
  const app = createExpressApp(deps)

  const server = app.listen(AppConfig.server.port, () => {
    deps.logger.info('EduManage API running', {
      port:        AppConfig.server.port,
      env:         AppConfig.server.nodeEnv,
      frontend:    AppConfig.server.frontendUrl,
    })
  })

  // ── 6. Graceful shutdown ─────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    deps.logger.info(`${signal} received — shutting down gracefully`)

    server.close(async () => {
      deps.logger.info('HTTP server closed')

      // Close DB connections cleanly
      await db.disconnect()
      deps.logger.info('MongoDB disconnected')

      await redisClient.quit()
      deps.logger.info('Redis disconnected')

      process.exit(0)
    })

    setTimeout(() => {
      deps.logger.error('Forced shutdown — took too long')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))

  process.on('unhandledRejection', (reason) => {
    deps.logger.error('Unhandled Promise Rejection', { reason })
    process.exit(1)
  })

  process.on('uncaughtException', (err) => {
    deps.logger.error('Uncaught Exception', { message: err.message, stack: err.stack })
    process.exit(1)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start EduManage:', err)
  process.exit(1)
})