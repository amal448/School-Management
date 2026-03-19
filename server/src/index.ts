// src/index.ts
import { AppConfig }        from './config/app.config'
import { MongooseClient }   from './infrastructure/database/mongoose-client.database'
import { redisClient }      from './infrastructure/cache/redis-client'
import { buildDependencies } from './interfaces/adapters/di/di-container'
import { createExpressApp } from './interfaces/adapters/express-adapter'

async function bootstrap(): Promise<void> {

  // ── 1. Connect MongoDB ───────────────────────────
  const db = MongooseClient.getInstance()
  await db.connect()

  // ── 2. Connect Redis ─────────────────────────────
  // Verify Redis is reachable before starting
  try {
    await redisClient.ping()
    console.info('[Redis] Connection verified')
  } catch (err) {
    console.error('[Redis] Failed to connect:', err)
    process.exit(1)
  }

  // ── 3. Wire all dependencies (Composition Root) ───
  // This also registers the Google OAuth passport strategy
  const deps = buildDependencies()

  // ── 4. Build Express app ─────────────────────────
  const app = createExpressApp(deps)

  // ── 5. Start listening ───────────────────────────
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

    // Force quit after 10s if something hangs
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