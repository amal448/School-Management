// src/config/app.config.ts
import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const AppConfig = {
  server: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
  },
  database: {
    mongoUri: requireEnv('MONGO_URI'),
    dbName: process.env.DB_NAME ?? 'edumanage',
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES ?? '7d',
    accessExpiresInSeconds: parseInt(process.env.JWT_ACCESS_EXPIRES_SECONDS ?? '900', 10),
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
  },
} as const;
