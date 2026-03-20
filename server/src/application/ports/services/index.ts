// src/application/ports/services/index.ts
import { Role } from '../../../domain/enums/index';

// ── Password Hasher ────────────────────────────────────
export interface IPasswordHasher {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}

// ── Token Service ──────────────────────────────────────
export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}



// ── Logger ─────────────────────────────────────────────
export interface ILogger {
  info(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  error(message: string, meta?: object): void;
  debug(message: string, meta?: object): void;
}

export interface SendOtpEmailInput {
  to:        string
  firstName: string
  otp:       string
  role:      string
  expiresIn: number   // minutes
}

export interface SendFirstTimeSetupEmailInput {
  to:        string
  firstName: string
  setupLink: string
  role:      string
}

export interface SendResetPasswordEmailInput {
  to:        string
  firstName: string
  resetLink: string
  role:      string
}

export interface IEmailService {
  sendOtp(input: SendOtpEmailInput):                     Promise<void>
  sendFirstTimeSetup(input: SendFirstTimeSetupEmailInput): Promise<void>
  sendResetPassword(input: SendResetPasswordEmailInput):   Promise<void>
}