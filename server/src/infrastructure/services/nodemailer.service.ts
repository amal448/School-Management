// src/infrastructure/services/nodemailer.service.ts
import nodemailer, { Transporter } from 'nodemailer'

import {
  otpTemplate,
  firstTimeSetupTemplate,
  resetPasswordTemplate,
} from 'src/infrastructure/templates/email.templates'
import { AppConfig } from 'src/config/app.config'
import { IEmailService, SendFirstTimeSetupEmailInput, SendOtpEmailInput, SendResetPasswordEmailInput } from 'src/application/ports/services'

export class NodemailerService implements IEmailService {
  private readonly transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:   AppConfig.email.host,
      port:   AppConfig.email.port,
      secure: AppConfig.email.port === 465,   // true for 465, false for 587
      auth: {
        user: AppConfig.email.user,
        pass: AppConfig.email.pass,
      },
    })
  }

  async sendOtp(input: SendOtpEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from:    AppConfig.email.from,
      to:      input.to,
      subject: `${input.otp} is your EduManage sign-in code`,
      html:    otpTemplate(input.firstName, input.otp, input.expiresIn),
    })
  }

  async sendFirstTimeSetup(input: SendFirstTimeSetupEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from:    AppConfig.email.from,
      to:      input.to,
      subject: `Set up your EduManage ${input.role} account`,
      html:    firstTimeSetupTemplate(input.firstName, input.setupLink, input.role),
    })
  }

  async sendResetPassword(input: SendResetPasswordEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from:    AppConfig.email.from,
      to:      input.to,
      subject: 'Reset your EduManage password',
      html:    resetPasswordTemplate(input.firstName, input.resetLink),
    })
  }
}