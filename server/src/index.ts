import { AppConfig }              from './config/app.config'
import { MongooseClient }         from './infrastructure/database/mongoose-client.database'
import { connectRedis }           from './infrastructure/cache/redis-connection'
import { buildDependencies }      from './interfaces/adapters/di/di-container'
import { createExpressApp }       from './interfaces/adapters/express-adapter'
import { registerShutdownHandlers } from './infrastructure/server/graceful-shutdown'

async function bootstrap(): Promise<void> {
  const deps = buildDependencies()

  await MongooseClient.getInstance().connect()
  deps.logger.info('MongoDB connected')

  await connectRedis(deps.logger)

  const app    = createExpressApp(deps)
  const server = app.listen(AppConfig.server.port, () => {
    deps.logger.info('EduManage API running', {
      port:     AppConfig.server.port,
      env:      AppConfig.server.nodeEnv,
      frontend: AppConfig.server.frontendUrl,
    })
  })

  registerShutdownHandlers(server, deps.logger)
}

bootstrap().catch((err) => {
  console.error('Failed to start EduManage:', err)
  process.exit(1)
})