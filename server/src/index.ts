// src/index.ts
// Entry point: connects DB, wires DI, starts server, handles shutdown.

import { AppConfig } from './config/app.config';
import { MongooseClient } from './infrastructure/database/mongoose-client.database';
import { buildDependencies } from './interfaces/adapters/di/di-container';
import { createExpressApp } from './interfaces/adapters/express-adapter';

async function bootstrap(): Promise<void> {
  // 1. Connect to MongoDB
  const db = MongooseClient.getInstance();
  await db.connect();

  // 2. Wire all dependencies (Composition Root)
  const deps = buildDependencies();

  // 3. Build Express app
  const app = createExpressApp(deps);

  // 4. Start listening
  const server = app.listen(AppConfig.server.port, () => {
    deps.logger.info('EduManage API is running', {
      port: AppConfig.server.port,
      env:  AppConfig.server.nodeEnv,
    });
  });

  // ── Graceful shutdown ────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    deps.logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      deps.logger.info('HTTP server closed');
      await db.disconnect();
      deps.logger.info('MongoDB disconnected');
      process.exit(0);
    });
    // Force-quit if shutdown hangs beyond 10s
    setTimeout(() => { deps.logger.error('Forced shutdown'); process.exit(1); }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    deps.logger.error('Unhandled Promise Rejection', { reason });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start EduManage:', err);
  process.exit(1);
});
