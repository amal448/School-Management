// src/infrastructure/services/index.ts
import bcrypt from 'bcryptjs'
import winston from 'winston'
import { IPasswordHasher, ILogger } from 'src/application/ports/services/index'
import { AppConfig } from 'src/config/app.config'

// ── Bcrypt Password Hasher ─────────────────────────────
export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly saltRounds = AppConfig.bcrypt.saltRounds) {}

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds)
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash)
  }
}

// ── Winston Logger ─────────────────────────────────────
export class WinstonLogger implements ILogger {
  private readonly logger: winston.Logger

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
                const m = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''
                return `${timestamp} [${level}]: ${message}${m}`
              }),
            )
          : winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    })
  }

  info(message: string,  meta?: object): void { this.logger.info(message,  meta) }
  warn(message: string,  meta?: object): void { this.logger.warn(message,  meta) }
  error(message: string, meta?: object): void { this.logger.error(message, meta) }
  debug(message: string, meta?: object): void { this.logger.debug(message, meta) }
}

// Re-export so DI container can import everything from one place
export { JwtTokenService } from './token.service'
export { OtpService }      from './otp.service'
export { NodemailerService }    from './nodemailer.service'