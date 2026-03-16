// src/infrastructure/services/index.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { IPasswordHasher, ITokenService, ILogger, TokenPayload, TokenPair } from '../../application/ports/services/index';
import { AppConfig } from '../../config/app.config';
import { AppError } from '../../shared/types/app-error';

// ── Bcrypt Password Hasher ─────────────────────────────
export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly saltRounds = AppConfig.bcrypt.saltRounds) {}

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}

// ── JWT Token Service ──────────────────────────────────
export class JwtTokenService implements ITokenService {
  generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, AppConfig.jwt.accessSecret, {
      expiresIn: AppConfig.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    });
    const refreshToken = jwt.sign(payload, AppConfig.jwt.refreshSecret, {
      expiresIn: AppConfig.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });
    return { accessToken, refreshToken, expiresIn: AppConfig.jwt.accessExpiresInSeconds };
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.verify(token, AppConfig.jwt.accessSecret);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.verify(token, AppConfig.jwt.refreshSecret);
  }

  private verify(token: string, secret: string): TokenPayload {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized('Token has expired');
      }
      throw AppError.unauthorized('Token is invalid');
    }
  }
}

// ── Winston Logger ─────────────────────────────────────
export class WinstonLogger implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: AppConfig.server.isDevelopment ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        AppConfig.server.isDevelopment
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(({ level, message, timestamp, ...meta }) => {
                const m = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
                return `${timestamp} [${level}]: ${message}${m}`;
              }),
            )
          : winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  info(message: string, meta?: object): void  { this.logger.info(message, meta); }
  warn(message: string, meta?: object): void  { this.logger.warn(message, meta); }
  error(message: string, meta?: object): void { this.logger.error(message, meta); }
  debug(message: string, meta?: object): void { this.logger.debug(message, meta); }
}
