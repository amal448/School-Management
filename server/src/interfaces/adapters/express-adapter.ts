// src/interfaces/adapters/express-adapter.ts
// Framework wiring is fully isolated here.
// Nothing else in the codebase imports from 'express' directly.

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppConfig } from '../../config/app.config';
import { AppDependencies } from './di/di-container';

export function createExpressApp(deps: AppDependencies): Application {
  const app = express();

  // ── Security headers ─────────────────────────────────
  app.use(helmet());

  // ── CORS ─────────────────────────────────────────────
  app.use(
    cors({
      origin: AppConfig.server.isDevelopment
        ? '*'
        : (process.env.ALLOWED_ORIGINS ?? '').split(','),
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ── Body parsing ──────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Rate limiting ─────────────────────────────────────
  app.use(
    rateLimit({
      windowMs: AppConfig.rateLimit.windowMs,
      max: AppConfig.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests. Please try again later.' },
    }),
  );

  // ── Health check ──────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'healthy',
      environment: AppConfig.server.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // ── API routes ────────────────────────────────────────
  app.use('/api/auth',     deps.authRouter);
  app.use('/api/managers', deps.managerRouter);
  app.use('/api/teachers', deps.teacherRouter);
  app.use('/api/students', deps.studentRouter);

  // ── 404 fallback ──────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // ── Global error handler (must be last) ───────────────
  app.use(deps.errorHandler);

  return app;
}
