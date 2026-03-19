// src/infrastructure/services/otp.service.ts
import crypto from 'crypto'
import { redisClient } from 'src/infrastructure/cache/redis-client'
import { RedisKeys, RedisTTL } from 'src/infrastructure/cache/redis-keys'
import { AppError } from 'src/shared/types/app-error'

export class OtpService {

  // ── OTP ────────────────────────────────────────────

  async generateOtp(role: string, email: string): Promise<string> {
    // Rate limit: prevent generating a new OTP if one already exists
    // (frontend must wait for current OTP to expire before requesting another)
    const existing = await redisClient.get(RedisKeys.otp(role, email))
    if (existing) {
      throw AppError.badRequest(
        'An OTP was already sent. Please wait for it to expire before requesting a new one.'
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redisClient.setex(RedisKeys.otp(role, email), RedisTTL.otp, otp)
    return otp
  }

  async verifyOtp(role: string, email: string, otp: string): Promise<boolean> {
    const stored = await redisClient.get(RedisKeys.otp(role, email))
    if (!stored || stored !== otp) return false
    // Delete immediately — one-time use
    await redisClient.del(RedisKeys.otp(role, email))
    return true
  }

  // ── First-time login token ─────────────────────────
  // Generated when manager creates a teacher/student account
  // Sent to their email — they use it to set their password on first login

  async generateFirstTimeToken(role: string, userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex')
    await redisClient.setex(RedisKeys.firstTime(role, token), RedisTTL.firstTime, userId)
    return token
  }

  async verifyFirstTimeToken(role: string, token: string): Promise<string | null> {
    const userId = await redisClient.get(RedisKeys.firstTime(role, token))
    if (!userId) return null
    await redisClient.del(RedisKeys.firstTime(role, token))
    return userId
  }

  // ── Password reset token ───────────────────────────
  // Generated when user requests a password reset
  // Sent to their email — expires in 15 minutes

  async generateResetToken(role: string, email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex')
    await redisClient.setex(RedisKeys.resetToken(role, token), RedisTTL.resetToken, email)
    return token
  }

  async verifyResetToken(role: string, token: string): Promise<string | null> {
    const email = await redisClient.get(RedisKeys.resetToken(role, token))
    if (!email) return null
    await redisClient.del(RedisKeys.resetToken(role, token))
    return email
  }
}