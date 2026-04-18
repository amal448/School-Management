// src/interfaces/adapters/express-adapter.ts
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { AppConfig } from 'src/config/app.config'
import { AppDependencies } from './di/di-container'
import path from 'path'

export function createExpressApp(deps: AppDependencies): Application {
  const app = express()

  // ── 1. Security headers ────────────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        if (AppConfig.server.allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`))
        }
      },
      credentials: true,    // ← CRITICAL: allows cookies to be sent
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
      exposedHeaders: ['x-csrf-token'],
    })
  )

  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))

  app.use(cookieParser())

  // no session — we use JWT + Redis
  app.use(passport.initialize())

  // ── 6. Rate limiting ───────────────────────────────
  app.use(
    rateLimit({
      windowMs: AppConfig.rateLimit.windowMs,
      max: AppConfig.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      // Skip rate limiting in development
      skip: () => AppConfig.server.isDevelopment,
      message: {
        success: false,
        message: 'Too many requests. Please try again later.',
      },
    })
  )

  // ── 7. Health check ────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      status: 'healthy',
      environment: AppConfig.server.nodeEnv,
      timestamp: new Date().toISOString(),
    })
  })

  // ── 8. API routes ──────────────────────────────────
  app.use('/api/auth', deps.authRouter)
  app.use('/api/admins', deps.adminRouter)
  app.use('/api/managers', deps.managerRouter)
  app.use('/api/teachers', deps.teacherRouter)
  app.use('/api/students', deps.studentRouter)
  app.use('/api/departments', deps.departmentRouter)
  app.use('/api/subjects', deps.subjectRouter)
  app.use('/api/classes', deps.classRouter)
  app.use('/api/exams', deps.examRouter)
  app.use('/api/announcements', deps.announcementRouter)
  app.use('/api/toppers', deps.topperRouter)
  app.use('/api/stats', deps.statsRouter)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/upload', deps.uploadRouter)
  // ── 9. 404 handler ─────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  })

  // ── 10. Global error handler (must be last) ────────
  app.use(deps.errorHandler)
  return app
}