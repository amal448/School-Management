// src/infrastructure/cache/redis-keys.ts
export const RedisKeys = {
  // Auth sessions
  session:       (sessionId: string)            => `session:${sessionId}`,
  activeSession: (userId: string)               => `active_session:${userId}`,
  refreshToken:  (userId: string)               => `refresh_token:${userId}`,
  userCache:     (userId: string)               => `user:${userId}`,
  csrfToken:     (userId: string)               => `csrf:${userId}`,

  // OTP — role-scoped
  otp:           (role: string, email: string)  => `otp:${role}:${email}`,

  // Password reset — role-scoped
  resetToken:    (role: string, token: string)  => `reset:${role}:${token}`,

  // First time login token — role-scoped
  firstTime:     (role: string, token: string)  => `firsttime:${role}:${token}`,

  // Google OAuth state — prevents CSRF on OAuth flow
  oauthState:    (state: string)                => `oauth:state:${state}`,
} as const

export const RedisTTL = {
  otp:          10 * 60,        // 10 minutes
  resetToken:   15 * 60,        // 15 minutes
  firstTime:    24 * 60 * 60,   // 24 hours
  oauthState:   5  * 60,        // 5 minutes
  session:      7  * 24 * 60 * 60, // 7 days
  userCache:    60 * 60,        // 1 hour
  csrf:         7  * 24 * 60 * 60, // 7 days
} as const